
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentPreview from "@/components/DocumentPreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText, Download, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { getDocumentById, downloadDocument, purchaseDocument } from "@/services/document.service";
import { PaymentModal } from "@/components/PaymentModal";

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const docData = await getDocumentById(id);
        setDocument(docData);
      } catch (error) {
        console.error("Error fetching document:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải thông tin tài liệu. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocument();
  }, [id, toast]);
  
  const handleDownload = async () => {
    if (!document || !id) return;
    
    if (!document.isFree && !document.isPurchased) {
      setShowPaymentModal(true);
      return;
    }
    
    setIsDownloading(true);
    try {
      const result = await downloadDocument(id);
      toast({
        title: "Tải xuống thành công",
        description: "Tài liệu đã được tải xuống thành công",
      });
      
      // Trigger file download
      if (result.download_url) {
        const link = document.createElement('a');
        link.href = result.download_url;
        link.setAttribute('download', result.filename || 'document');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi tải xuống",
        description: "Không thể tải xuống tài liệu. Vui lòng thử lại sau.",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handlePaymentSuccess = async () => {
    if (!id) return;
    
    toast({
      title: "Thanh toán thành công",
      description: `Bạn đã mua "${document.title}" thành công. Bạn có thể tải xuống ngay bây giờ.`,
    });
    
    try {
      await purchaseDocument(id);
      
      // Update document state to show it as purchased
      setDocument(prev => ({
        ...prev,
        isPurchased: true
      }));
      
      // Auto download after purchase
      const result = await downloadDocument(id);
      if (result.download_url) {
        const link = document.createElement('a');
        link.href = result.download_url;
        link.setAttribute('download', result.filename || 'document');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
    }
    
    setShowPaymentModal(false);
  };
  
  // Tài liệu liên quan (trong ứng dụng thực tế sẽ lấy từ API)
  const relatedDocuments = document?.relatedDocuments || [];
    
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Đang tải tài liệu...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex-grow">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Không Tìm Thấy Tài Liệu</h1>
            <p className="text-muted-foreground mb-8">
              Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link to="/documents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Duyệt Tài Liệu
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Button variant="ghost" asChild size="sm">
              <Link to="/documents">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Quay Lại Tài Liệu
              </Link>
            </Button>
          </div>
          
          <DocumentPreview {...document} />
          
          <div className="mt-8 flex justify-center gap-4">
            {document.isFree || document.isPurchased ? (
              <Button 
                size="lg" 
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-8"
              >
                <Download className="mr-2 h-5 w-5" />
                {isDownloading ? "Đang tải xuống..." : "Tải Xuống"}
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => setShowPaymentModal(true)}
                className="px-8"
              >
                <Lock className="mr-2 h-5 w-5" />
                Mua Ngay ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(document.price)})
              </Button>
            )}
          </div>
          
          {/* Tài Liệu Liên Quan */}
          {relatedDocuments.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Tài Liệu Liên Quan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <Link to={`/documents/${doc.id}`} className="group">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img 
                            src={doc.thumbnail || "/placeholder.svg"} 
                            alt={doc.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      {showPaymentModal && (
        <PaymentModal 
          docId={id || ""}
          docTitle={document.title}
          docPrice={document.price}
          isFree={document.isFree}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default DocumentView;
