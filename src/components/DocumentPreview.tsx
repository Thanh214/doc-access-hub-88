
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentModal } from "./PaymentModal";

interface DocumentPreviewProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  previewContent: string;
  price: number;
  isFree: boolean;
  pages: number;
  fileSize: string;
  dateAdded: string;
}

const DocumentPreview = ({
  id,
  title,
  description,
  category,
  thumbnail,
  previewContent,
  price,
  isFree,
  pages,
  fileSize,
  dateAdded,
}: DocumentPreviewProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
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
                <Badge variant="outline">{pages} trang</Badge>
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
                
                {isFree && !isPreviewExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent flex items-end justify-center p-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsPreviewExpanded(true)}
                    >
                      Xem Thêm
                    </Button>
                  </div>
                )}
                
                <motion.div 
                  className={`prose max-w-none ${isPreviewExpanded ? '' : 'max-h-[500px] overflow-hidden'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                </motion.div>
                
                {isPreviewExpanded && (
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
              {thumbnail && (
                <img 
                  src={thumbnail} 
                  alt={title} 
                  className="w-full h-40 object-cover rounded-md mb-6 shadow-sm"
                />
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
        />
      )}
    </>
  );
};

export default DocumentPreview;
