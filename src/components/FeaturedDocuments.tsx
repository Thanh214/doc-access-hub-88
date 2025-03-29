
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DocumentCard from "./DocumentCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Document, getFeaturedDocuments } from "@/services/document.service";
import { useToast } from "@/hooks/use-toast";

const FeaturedDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [visibleDocuments, setVisibleDocuments] = useState<Document[]>([]);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedDocuments();
        setDocuments(data);
        setVisibleDocuments(data.slice(0, 3));
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải dữ liệu tài liệu. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [toast]);
  
  const toggleDocuments = () => {
    if (isShowingAll) {
      setVisibleDocuments(documents.slice(0, 3));
    } else {
      setVisibleDocuments(documents);
    }
    setIsShowingAll(!isShowingAll);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Tài Liệu Nổi Bật</h2>
            <p className="text-muted-foreground max-w-2xl">
              Khám phá bộ sưu tập tài liệu cao cấp và miễn phí được tuyển chọn theo nhu cầu của bạn.
            </p>
          </div>
          
          <Link 
            to="/documents" 
            className="mt-4 md:mt-0 text-primary hover:text-primary/80 transition-colors flex items-center"
          >
            Xem tất cả tài liệu
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {visibleDocuments.map((doc) => (
                <motion.div key={doc.id} variants={item}>
                  <DocumentCard
                    id={doc.id}
                    title={doc.title}
                    description={doc.description}
                    category={doc.category}
                    thumbnail={doc.thumbnail}
                    price={doc.price}
                    isFree={doc.isFree}
                    previewAvailable={doc.previewAvailable}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                onClick={toggleDocuments}
                className="rounded-full px-6"
              >
                {isShowingAll ? "Thu Gọn" : "Xem Thêm"}
                <ArrowRight className={`ml-2 h-4 w-4 transition-transform duration-300 ${isShowingAll ? "rotate-90" : ""}`} />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedDocuments;
