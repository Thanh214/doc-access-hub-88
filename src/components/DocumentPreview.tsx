
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, AlertCircle, FileText, CheckCircle, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentModal } from "./PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { getDocumentPreview, downloadDocument, checkDownloadEligibility, getCurrentSubscription } from "@/services/document.service";
import { formatCurrency, formatFileSize, formatDate } from "@/utils/formatters";

interface DocumentPreviewProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  fileSize: string;
  dateAdded: string;
}

const DocumentPreview = ({
  id,
  title,
  description,
  category,
  thumbnail,
  price,
  isFree,
  fileSize,
  dateAdded,
}: DocumentPreviewProps) => {
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [eligibilityStatus, setEligibilityStatus] = useState<any>(null);
  
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true);
        const data = await getDocumentPreview(id);
        setPreviewContent(data.preview);
        setPages(data.pages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching document preview:", error);
        setPreviewContent("<p>Không thể tải nội dung xem trước.</p>");
        setIsLoading(false);
      }
    };
    
    const fetchEligibility = async () => {
      try {
        const data = await checkDownloadEligibility(id);
        setEligibilityStatus(data);
      } catch (error) {
        console.error("Error checking eligibility:", error);
      }
    };
    
    const fetchSubscription = async () => {
      try {
        const data = await getCurrentSubscription();
        setCurrentSubscription(data);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };
    
    fetchPreview();
    fetchEligibility();
    fetchSubscription();
  }, [id]);
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadDocument(id);
      toast({
        title: "Tải xuống thành công",
        description: "Tài liệu đang được tải xuống",
      });
      setIsDownloading(false);
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Lỗi tải xuống",
        description: error.response?.data?.message || "Đã xảy ra lỗi khi tải tài liệu",
        variant: "destructive",
      });
      setIsDownloading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };
  
  const handleCloseBanner = () => {
    setCurrentSubscription(null);
  };
  
  return (
    <>
      <AnimatePresence>
        {currentSubscription && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg p-4 shadow-sm relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-white/20"
              onClick={handleCloseBanner}
            >
              <X className="h-3 w-3" />
            </Button>
            
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-800">
                  Bạn đang sử dụng gói <span className="font-bold">{currentSubscription.package_name}</span>
                </h3>
                <div className="text-sm text-green-700 mt-1 flex items-center">
                  <Download className="h-3 w-3 mr-1" />
                  <span>Còn {currentSubscription.remaining_downloads} lượt tải miễn phí</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Hết hạn: {formatDate(currentSubscription.end_date)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50">
            <div className="p-6">
              <motion.h1 
                className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500"
                variants={itemVariants}
              >
                {title}
              </motion.h1>
              <motion.div 
                className="flex flex-wrap gap-2 mb-4"
                variants={itemVariants}
              >
                <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">{category}</Badge>
                <Badge variant="outline">{pages} trang</Badge>
                <Badge variant="outline">{fileSize}</Badge>
                <Badge variant="outline">Ngày thêm: {dateAdded}</Badge>
              </motion.div>
              <motion.p 
                className="text-muted-foreground mb-6"
                variants={itemVariants}
              >
                {description}
              </motion.p>
              
              <div className="relative mb-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    {!isFree && (
                      <motion.div 
                        className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/95 to-transparent ${isPreviewExpanded ? "h-[70%] pointer-events-none" : "h-full"}`}
                        variants={itemVariants}
                      >
                        <motion.div 
                          className="text-center max-w-md"
                          variants={itemVariants}
                        >
                          <Lock className="h-12 w-12 text-amber-500 mb-4 mx-auto animate-pulse" />
                          <h3 className="text-xl font-medium mb-3">Tài Liệu Cao Cấp</h3>
                          <p className="text-center text-muted-foreground mb-5 max-w-xs mx-auto">
                            Mua tài liệu này với giá {formatCurrency(price)} để xem toàn bộ nội dung
                          </p>
                          <Button 
                            onClick={() => setShowPaymentModal(true)}
                            className="pointer-events-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all"
                            size="lg"
                          >
                            Mua Ngay
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                    
                    {isFree && !isPreviewExpanded && (
                      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent flex items-end justify-center p-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsPreviewExpanded(true)}
                          className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
                        >
                          Xem Thêm
                        </Button>
                      </div>
                    )}
                    
                    <motion.div 
                      className={`prose max-w-none ${isPreviewExpanded ? '' : 'max-h-[500px] overflow-hidden'}`}
                      variants={itemVariants}
                    >
                      <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                    </motion.div>
                    
                    {isPreviewExpanded && (
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsPreviewExpanded(false)}
                          className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all"
                        >
                          Thu Gọn
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
        >
          <Card className="sticky top-24 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="p-6">
              {thumbnail ? (
                <div className="w-full h-40 overflow-hidden rounded-md mb-6 shadow-md group relative">
                  <img 
                    src={thumbnail} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ) : (
                <div className="w-full h-40 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md mb-6 shadow-sm flex items-center justify-center">
                  <FileText className="h-12 w-12 text-blue-300" />
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Thông Tin Tài Liệu</h3>
                <motion.ul 
                  className="space-y-3"
                  variants={containerVariants}
                >
                  <motion.li 
                    className="flex justify-between bg-blue-50 p-3 rounded-md transition-colors hover:bg-blue-100"
                    variants={itemVariants}
                  >
                    <span className="text-blue-800">Danh mục:</span>
                    <span className="font-medium text-blue-900">{category}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-blue-50 p-3 rounded-md transition-colors hover:bg-blue-100"
                    variants={itemVariants}
                  >
                    <span className="text-blue-800">Số trang:</span>
                    <span className="font-medium text-blue-900">{pages}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-blue-50 p-3 rounded-md transition-colors hover:bg-blue-100"
                    variants={itemVariants}
                  >
                    <span className="text-blue-800">Kích thước:</span>
                    <span className="font-medium text-blue-900">{fileSize}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-blue-50 p-3 rounded-md transition-colors hover:bg-blue-100"
                    variants={itemVariants}
                  >
                    <span className="text-blue-800">Ngày thêm:</span>
                    <span className="font-medium text-blue-900">{dateAdded}</span>
                  </motion.li>
                  <motion.li 
                    className="flex justify-between bg-blue-50 p-3 rounded-md transition-colors hover:bg-blue-100"
                    variants={itemVariants}
                  >
                    <span className="text-blue-800">Giá:</span>
                    <span className="font-medium">
                      {isFree ? (
                        <Badge variant="secondary" className="bg-green-500 hover:bg-green-600 text-white">Miễn Phí</Badge>
                      ) : (
                        <span className="font-bold text-amber-600">{formatCurrency(price)}</span>
                      )}
                    </span>
                  </motion.li>
                </motion.ul>
              </div>
              
              {eligibilityStatus && (
                <motion.div variants={itemVariants}>
                  {isFree ? (
                    <motion.div 
                      className="space-y-4"
                      variants={itemVariants}
                    >
                      {!eligibilityStatus.eligible && eligibilityStatus.reason === 'no_subscription' && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                          <p className="text-sm text-yellow-700">
                            Tài liệu miễn phí yêu cầu đăng ký gói để tải xuống. Bạn có thể xem trực tiếp không giới hạn.
                          </p>
                        </div>
                      )}
                      
                      {!eligibilityStatus.eligible && eligibilityStatus.reason === 'download_limit_reached' && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                          <p className="text-sm text-yellow-700">
                            Bạn đã hết lượt tải miễn phí trong gói {eligibilityStatus.subscription.package_name}. Hãy nâng cấp gói hoặc chờ đến kỳ gia hạn tiếp theo.
                          </p>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all text-white"
                        onClick={eligibilityStatus.eligible ? handleDownload : () => setShowPaymentModal(true)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang tải xuống...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            {eligibilityStatus.eligible ? "Tải Xuống Ngay" : "Đăng Ký Để Tải Xuống"}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                    >
                      {!eligibilityStatus.eligible && eligibilityStatus.reason === 'insufficient_balance' && (
                        <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start mb-4">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                          <div className="text-sm text-yellow-700">
                            <p className="mb-1">Số dư không đủ để mua tài liệu này.</p>
                            <p className="font-medium">Số dư hiện tại: {formatCurrency(eligibilityStatus.currentBalance)}</p>
                            <p className="font-medium">Giá tài liệu: {formatCurrency(eligibilityStatus.requiredBalance)}</p>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg transition-all text-white"
                        onClick={eligibilityStatus.eligible ? handleDownload : () => setShowPaymentModal(true)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang tải xuống...
                          </>
                        ) : (
                          <>
                            {eligibilityStatus.eligible ? (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Tải Xuống Ngay
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Mua Tài Liệu
                              </>
                            )}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
      
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
