import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, AlertCircle, FileText, Image, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentModal } from "./PaymentModal";
import API from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface DocumentPreviewProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  previewContent?: string;
  file_path?: string;
  file_type?: string;
  price: number;
  isFree: boolean;
  pages?: number;
  fileSize?: string;
  dateAdded?: string;
}

const DocumentPreview = ({
  id,
  title,
  description,
  category,
  thumbnail,
  previewContent,
  file_path,
  file_type,
  price,
  isFree,
  pages = 0,
  fileSize = "0 KB",
  dateAdded = new Date().toLocaleDateString(),
}: DocumentPreviewProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  useEffect(() => {
    // Lấy URL xem trước khi component được tải
    const loadPreview = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setPreviewError(null);
      
      try {
        console.log("Loading preview for document ID:", id);
        
        // Xây dựng URL để xem trước tài liệu
        const previewEndpoint = `/documents/preview/${id}`;
        const url = `${API.defaults.baseURL}${previewEndpoint}`;
        console.log("Preview URL:", url);
        
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error getting preview URL:", error);
        setPreviewError("Không thể tải xem trước tài liệu");
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể tải xem trước tài liệu. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPreview();
  }, [id, toast]);
  
  // Xác định loại file để hiển thị icon phù hợp
  const getFileIcon = () => {
    if (!file_type) return <FileQuestion className="h-6 w-6" />;
    
    const type = file_type.toLowerCase();
    
    if (type.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (type.includes('image')) {
      return <Image className="h-6 w-6 text-blue-500" />;
    } else if (type.includes('word') || type.includes('doc')) {
      return <FileText className="h-6 w-6 text-blue-700" />;
    } else if (type.includes('excel') || type.includes('xls')) {
      return <FileText className="h-6 w-6 text-green-700" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Render phần xem trước tài liệu
  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive">{previewError}</p>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không có xem trước cho tài liệu này</p>
        </div>
      );
    }
    
    console.log("Rendering preview with URL:", previewUrl);
    console.log("File type:", file_type);
    
    if (file_type && file_type.toLowerCase().includes('pdf')) {
      return (
        <iframe 
          src={previewUrl} 
          className="w-full h-[500px] border-0 rounded" 
          title={`Preview of ${title}`}
          onError={(e) => {
            console.error("Error loading PDF iframe:", e);
            setPreviewError("Không thể tải PDF. Vui lòng thử lại sau.");
          }}
        />
      );
    } else if (file_type && file_type.toLowerCase().includes('image')) {
      return (
        <div className="flex items-center justify-center">
          <img 
            src={previewUrl} 
            alt={title} 
            className="max-w-full max-h-[500px] object-contain" 
            onError={() => {
              console.error("Error loading image");
              setPreviewError("Không thể tải hình ảnh. Vui lòng thử lại sau.");
            }}
          />
        </div>
      );
    } else if (previewContent) {
      // Nếu có nội dung preview text
      return (
        <div className={`prose max-w-none ${isPreviewExpanded ? '' : 'max-h-[500px] overflow-hidden'}`}>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-60 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không hỗ trợ xem trước cho định dạng này</p>
          <p className="text-sm text-muted-foreground mt-2">({file_type || 'Không xác định'})</p>
        </div>
      );
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <div className="p-6">
              <motion.h1 
                className="text-2xl font-bold mb-2 text-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap gap-2 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Badge variant="secondary" className="bg-vibrant-1 text-white">{category}</Badge>
                {pages > 0 && <Badge variant="outline">{pages} trang</Badge>}
                <Badge variant="outline">{fileSize}</Badge>
                <Badge variant="outline">Ngày thêm: {dateAdded}</Badge>
              </motion.div>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {description}
              </motion.p>
              
              <div className="relative mb-6">
                {!isFree && (
                  <motion.div 
                    className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/95 to-transparent ${isPreviewExpanded ? "h-[70%] pointer-events-none" : "h-full"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <Lock className="h-10 w-10 text-primary mb-3 mx-auto animate-pulse-scale" />
                      <h3 className="text-lg font-medium mb-2">Tài Liệu Cao Cấp</h3>
                      <p className="text-center text-muted-foreground mb-4 max-w-xs">
                        Mua tài liệu này với giá {formatPrice(price)} để xem toàn bộ nội dung
                      </p>
                      <Button 
                        onClick={() => setShowPaymentModal(true)}
                        className="pointer-events-auto bg-gradient-vibrant hover:opacity-90"
                      >
                        Mua Ngay
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                
                {renderPreview()}
                
                {(previewContent && isPreviewExpanded) && (
                  <div className="mt-6 text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsPreviewExpanded(false)}
                    >
                      Thu Gọn
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="sticky top-24 shadow-md hover:shadow-lg transition-all duration-300 border-accent/30">
            <div className="p-6">
              {thumbnail ? (
                <img 
                  src={thumbnail} 
                  alt={title} 
                  className="w-full h-40 object-cover rounded-md mb-6 shadow-sm"
                />
              ) : (
                <div className="w-full h-40 bg-muted flex items-center justify-center rounded-md mb-6 shadow-sm">
                  {getFileIcon()}
                  <span className="ml-2 text-muted-foreground">{file_type || 'Tài liệu'}</span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gradient">Thông Tin Tài Liệu</h3>
                <ul className="space-y-3">
                  <motion.li 
                    className="flex justify-between bg-muted/40 p-3 rounded-md"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <span className="text-muted-foreground">Danh mục:</span>
                    <span className="font-medium">{category}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-muted/40 p-3 rounded-md"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <span className="text-muted-foreground">Số trang:</span>
                    <span className="font-medium">{pages}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-muted/40 p-3 rounded-md"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    <span className="text-muted-foreground">Kích thước:</span>
                    <span className="font-medium">{fileSize}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-muted/40 p-3 rounded-md"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <span className="text-muted-foreground">Ngày thêm:</span>
                    <span className="font-medium">{dateAdded}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-muted/40 p-3 rounded-md"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <span className="text-muted-foreground">Giá:</span>
                    <span className="font-medium">
                      {isFree ? (
                        <Badge variant="secondary" className="bg-green-500 text-white">Miễn Phí</Badge>
                      ) : (
                        formatPrice(price)
                      )}
                    </span>
                  </motion.li>
                </ul>
              </div>
              
              {isFree ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Tài liệu miễn phí yêu cầu đăng ký để tải xuống. Bạn có thể xem trực tiếp không giới hạn.
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-vibrant hover:opacity-90"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Đăng Ký Để Tải Xuống
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <Button 
                    className="w-full bg-gradient-vibrant hover:opacity-90"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Mua Tài Liệu
                  </Button>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
      
      {showPaymentModal && (
        <PaymentModal 
          docId={id}
          docTitle={title}
          docPrice={price}
          isFree={isFree}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {}}
        />
      )}
    </>
  );
};

export default DocumentPreview;
