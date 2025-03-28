
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

// Dữ liệu mẫu cho tài liệu
const allDocuments = [
  {
    id: "1",
    title: "Nghiên Cứu: Nguyên Tắc Kiến Trúc Hiện Đại",
    description: "Phân tích toàn diện về các nguyên tắc kiến trúc đương đại và ứng dụng của chúng trong thiết kế đô thị.",
    category: "Kiến Trúc",
    thumbnail: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 50000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "2",
    title: "Mẫu Kế Hoạch Kinh Doanh: Hướng Dẫn Khởi Nghiệp",
    description: "Mẫu chi tiết để tạo kế hoạch kinh doanh thuyết phục cho startup với dự báo tài chính.",
    category: "Kinh Doanh",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 75000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "3",
    title: "Nhập Môn Khoa Học Máy Tính",
    description: "Học những kiến thức cơ bản về khoa học máy tính với hướng dẫn toàn diện thân thiện với người mới bắt đầu.",
    category: "Giáo Dục",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
  {
    id: "4",
    title: "Phân Tích Thị Trường: Ngành Năng Lượng Tái Tạo",
    description: "Phân tích chuyên sâu về xu hướng thị trường năng lượng tái tạo, cơ hội và dự báo cho 2023-2030.",
    category: "Nghiên Cứu Thị Trường",
    thumbnail: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 120000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "5",
    title: "Bộ Mẫu Hợp Đồng Pháp Lý",
    description: "Tập hợp các mẫu hợp đồng pháp lý thiết yếu cho các nhu cầu kinh doanh và giao dịch.",
    category: "Pháp Lý",
    thumbnail: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 90000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "6",
    title: "Hướng Dẫn Marketing Số Cho Người Mới Bắt Đầu",
    description: "Học những kiến thức cơ bản về chiến lược marketing số, mạng xã hội, và tối ưu hóa SEO.",
    category: "Marketing",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
  {
    id: "7",
    title: "Tổng Quan Về Phương Pháp Quản Lý Dự Án",
    description: "So sánh các phương pháp quản lý dự án khác nhau để tìm ra cách tiếp cận tốt nhất cho nhóm của bạn.",
    category: "Kinh Doanh",
    thumbnail: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 65000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "8",
    title: "Nhập Môn Khoa Học Dữ Liệu Với Python",
    description: "Hướng dẫn cho người mới bắt đầu về phân tích và trực quan hóa dữ liệu sử dụng Python và các thư viện phổ biến.",
    category: "Giáo Dục",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
  {
    id: "9",
    title: "Nguyên Tắc Thiết Kế UI/UX và Thực Hành Tốt Nhất",
    description: "Hướng dẫn toàn diện để tạo ra giao diện kỹ thuật số hiệu quả, thân thiện với người dùng với nguyên tắc thiết kế hiện đại.",
    category: "Thiết Kế",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 80000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "10",
    title: "Lập Kế Hoạch Tài Chính Cho Doanh Nghiệp Nhỏ",
    description: "Các mẫu và hướng dẫn lập kế hoạch tài chính thiết yếu cho chủ doanh nghiệp nhỏ và doanh nhân.",
    category: "Tài Chính",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 95000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "11",
    title: "Hướng Dẫn Quản Lý Y Tế",
    description: "Tài liệu toàn diện cho các chuyên gia quản lý y tế bao gồm quy định và thực hành tốt nhất.",
    category: "Y Tế",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 110000,
    isFree: false,
    previewAvailable: true,
  },
  {
    id: "12",
    title: "Nền Tảng Phát Triển Web",
    description: "Học những kiến thức cơ bản về HTML, CSS và JavaScript để bắt đầu xây dựng trang web của riêng bạn.",
    category: "Giáo Dục",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 0,
    isFree: true,
    previewAvailable: true,
  },
];

const categories = [
  "Tất Cả Danh Mục",
  "Kiến Trúc",
  "Kinh Doanh",
  "Thiết Kế",
  "Giáo Dục",
  "Tài Chính",
  "Y Tế",
  "Pháp Lý",
  "Marketing",
  "Nghiên Cứu Thị Trường",
];

const DocumentBrowser = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [documents, setDocuments] = useState(allDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState(allDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả Danh Mục");
  const [documentType, setDocumentType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    // Lọc tài liệu dựa trên từ khóa tìm kiếm, danh mục và loại tài liệu
    let filtered = allDocuments;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "Tất Cả Danh Mục") {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }
    
    if (documentType === "free") {
      filtered = filtered.filter(doc => doc.isFree);
    } else if (documentType === "premium") {
      filtered = filtered.filter(doc => !doc.isFree);
    }
    
    // Sắp xếp tài liệu
    if (sortOrder === "newest") {
      // Trong ứng dụng thực tế, sẽ sắp xếp theo ngày thêm
      filtered = [...filtered];
    } else if (sortOrder === "oldest") {
      // Trong ứng dụng thực tế, sẽ sắp xếp theo ngày thêm ngược lại
      filtered = [...filtered].reverse();
    } else if (sortOrder === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }
    
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategory, documentType, sortOrder]);
  
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
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div 
                        key={category}
                        className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          category === selectedCategory
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/60"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
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
              
              {filteredDocuments.length > 0 ? (
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
