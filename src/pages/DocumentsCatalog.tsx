
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowDownUp, BookOpen, Bookmark } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFreeDocuments, getPremiumDocuments, getMockFreeDocuments, getMockPremiumDocuments, Document } from "@/services/document.service";

const DocumentsCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [freeDocuments, setFreeDocuments] = useState<Document[]>([]);
  const [premiumDocuments, setPremiumDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all");

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Try to get data from API first, fall back to mock data for demo
        let freeDocsResponse;
        let premiumDocsResponse;
        
        try {
          freeDocsResponse = await getFreeDocuments();
          if (!freeDocsResponse || freeDocsResponse.length === 0) {
            throw new Error("No free documents returned from API");
          }
        } catch (error) {
          console.log("Using mock free documents for demo");
          freeDocsResponse = getMockFreeDocuments();
        }
        
        try {
          premiumDocsResponse = await getPremiumDocuments();
          if (!premiumDocsResponse || premiumDocsResponse.length === 0) {
            throw new Error("No premium documents returned from API");
          }
        } catch (error) {
          console.log("Using mock premium documents for demo");
          premiumDocsResponse = getMockPremiumDocuments();
        }
        
        setFreeDocuments(freeDocsResponse);
        setPremiumDocuments(premiumDocsResponse);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Update URL when tab changes
  useEffect(() => {
    searchParams.set("tab", activeTab);
    setSearchParams(searchParams);
  }, [activeTab, searchParams, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes we're just filtering the existing documents client-side
    console.log(`Searching for: ${searchQuery}`);
  };

  const filteredFreeDocuments = freeDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPremiumDocuments = premiumDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Combine and filter documents for "all" tab
  const allDocuments = [...freeDocuments, ...premiumDocuments].filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4">Thư Viện Tài Liệu</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Khám phá kho tài liệu đa dạng của chúng tôi, từ tài liệu miễn phí đến tài liệu cao cấp
            </p>
            
            <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm tài liệu..."
                  className="pl-10 rounded-r-none focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                Tìm Kiếm
              </Button>
            </form>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-accent">
                <Filter className="h-4 w-4 mr-2" />
                Bộ Lọc
              </Badge>
              <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-accent">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Sắp Xếp
              </Badge>
              <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-accent">
                <BookOpen className="h-4 w-4 mr-2" />
                Danh Mục
              </Badge>
              <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-accent">
                <Bookmark className="h-4 w-4 mr-2" />
                Đã Lưu
              </Badge>
            </div>
          </motion.div>
          
          <Tabs 
            defaultValue={activeTab} 
            onValueChange={setActiveTab}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">Tất Cả</TabsTrigger>
                <TabsTrigger value="free">Miễn Phí</TabsTrigger>
                <TabsTrigger value="premium">Cao Cấp</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, index) => (
                    <div key={index} className="h-96 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))
                ) : allDocuments.length > 0 ? (
                  allDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      category={doc.category}
                      thumbnail={doc.thumbnail}
                      price={doc.price}
                      isFree={doc.isFree || !doc.is_premium}
                      previewAvailable={doc.previewAvailable}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy tài liệu</h3>
                    <p className="text-muted-foreground">
                      Vui lòng thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="free" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="h-96 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))
                ) : filteredFreeDocuments.length > 0 ? (
                  filteredFreeDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      category={doc.category}
                      thumbnail={doc.thumbnail}
                      price={doc.price}
                      isFree={true}
                      previewAvailable={doc.previewAvailable}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy tài liệu miễn phí</h3>
                    <p className="text-muted-foreground">
                      Vui lòng thử tìm kiếm với từ khóa khác hoặc xem các tài liệu cao cấp.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="premium" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <div key={index} className="h-96 rounded-lg bg-gray-100 animate-pulse"></div>
                  ))
                ) : filteredPremiumDocuments.length > 0 ? (
                  filteredPremiumDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      id={doc.id}
                      title={doc.title}
                      description={doc.description}
                      category={doc.category}
                      thumbnail={doc.thumbnail}
                      price={doc.price}
                      isFree={false}
                      previewAvailable={doc.previewAvailable}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Không tìm thấy tài liệu cao cấp</h3>
                    <p className="text-muted-foreground">
                      Vui lòng thử tìm kiếm với từ khóa khác hoặc xem các tài liệu miễn phí.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">Không tìm thấy những gì bạn cần?</p>
            <Button size="lg">Yêu Cầu Tài Liệu</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DocumentsCatalog;
