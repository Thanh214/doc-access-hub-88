import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, FileText } from "lucide-react";
import { DocumentResponse, getAllDocuments, searchDocuments, getDocumentsByCategory, getAllCategories, Category } from "@/services/document.service";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const DocumentBrowser = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả Danh Mục");
  const [documentType, setDocumentType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [documentsData, categoriesData] = await Promise.all([
          getAllDocuments(),
          getAllCategories()
        ]);
        
        setDocuments(documentsData);
        setFilteredDocuments(documentsData);
        setCategories(categoriesData);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    const filterDocuments = async () => {
      setIsLoading(true);
      
      try {
        let filtered = [...documents];
        
        // Apply search filter
        if (searchTerm) {
          const searchResults = await searchDocuments(searchTerm);
          filtered = searchResults;
        }
        
        // Apply category filter
        if (selectedCategory !== "Tất Cả Danh Mục") {
          if (searchTerm) {
            filtered = filtered.filter(doc => doc.category === selectedCategory);
          } else {
            const categoryResults = await getDocumentsByCategory(selectedCategory);
            filtered = categoryResults;
          }
        }
        
        // Apply document type filter
        if (documentType === "free") {
          filtered = filtered.filter(doc => doc.isFree);
        } else if (documentType === "premium") {
          filtered = filtered.filter(doc => !doc.isFree);
        }
        
        // Apply sorting
        if (sortOrder === "newest") {
          // Giả sử id cao hơn là mới hơn
          filtered = [...filtered].sort((a, b) => parseInt(b.id) - parseInt(a.id));
        } else if (sortOrder === "oldest") {
          filtered = [...filtered].sort((a, b) => parseInt(a.id) - parseInt(b.id));
        } else if (sortOrder === "price-low") {
          filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price-high") {
          filtered = [...filtered].sort((a, b) => b.price - a.price);
        }
        
        setFilteredDocuments(filtered);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể lọc dữ liệu tài liệu. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    filterDocuments();
  }, [searchTerm, selectedCategory, documentType, sortOrder, documents, toast]);
  
  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Thư Viện Tài Liệu</h1>
              <p className="text-muted-foreground">
                Khám phá bộ sưu tập tài liệu miễn phí và cao cấp của chúng tôi
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Bộ Lọc
              </Button>
              
              <Select 
                defaultValue="newest" 
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới Nhất</SelectItem>
                  <SelectItem value="oldest">Cũ Nhất</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar lọc */}
            <div className={`lg:block ${isFilterOpen ? "block" : "hidden"}`}>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Tìm Kiếm Tài Liệu</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Tìm kiếm..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Loại Tài Liệu</h3>
                  <Tabs 
                    defaultValue="all" 
                    className="w-full"
                    onValueChange={(value) => setDocumentType(value)}
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">Tất cả</TabsTrigger>
                      <TabsTrigger value="free" className="flex-1">Miễn phí</TabsTrigger>
                      <TabsTrigger value="premium" className="flex-1">Cao cấp</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Danh Mục</h3>
                  <ScrollArea className="h-[300px] pr-2 categories-container">
                    <div className="space-y-2">
                      <div 
                        className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          "Tất Cả Danh Mục" === selectedCategory
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/60"
                        }`}
                        onClick={() => setSelectedCategory("Tất Cả Danh Mục")}
                      >
                        Tất Cả Danh Mục
                      </div>
                      {categories.map((category) => (
                        <div 
                          key={category.id}
                          className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            category.name === selectedCategory
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted/60"
                          }`}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            
            {/* Lưới tài liệu */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Hiển thị {filteredDocuments.length} tài liệu
                </p>
                
                {selectedCategory !== "Tất Cả Danh Mục" && (
                  <Badge 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {selectedCategory}
                    <button 
                      className="ml-1 hover:text-primary"
                      onClick={() => setSelectedCategory("Tất Cả Danh Mục")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredDocuments.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <DocumentCard {...doc} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Không tìm thấy tài liệu</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Chúng tôi không thể tìm thấy tài liệu nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("Tất Cả Danh Mục");
                      setDocumentType("all");
                    }}
                  >
                    Xóa Tất Cả Bộ Lọc
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentBrowser;
