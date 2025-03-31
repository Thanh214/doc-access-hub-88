
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Lock } from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { useToast } from "@/hooks/use-toast";
import { purchaseDocument, downloadDocument } from "@/services/document.service";

interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  previewAvailable: boolean;
}

const DocumentCard = ({
  id,
  title,
  description,
  category,
  thumbnail,
  price,
  isFree,
  previewAvailable,
}: DocumentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePreview = () => {
    navigate(`/documents/${id}`);
  };
  
  const handleDownload = async () => {
    if (!isFree) {
      setShowPaymentModal(true);
      return;
    }
    
    setIsProcessing(true);
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
      setIsProcessing(false);
    }
  };
  
  const handlePurchase = () => {
    setShowPaymentModal(true);
  };
  
  const handlePaymentSuccess = async () => {
    toast({
      title: "Thanh toán thành công",
      description: isFree 
        ? "Bạn đã đăng ký gói tài liệu miễn phí. Bạn có thể tải xuống ngay bây giờ." 
        : `Bạn đã mua "${title}" thành công. Bạn có thể tải xuống ngay bây giờ.`,
    });
    
    try {
      if (!isFree) {
        await purchaseDocument(id);
      }
      
      // Automatically download the document after purchase
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
  
  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-300 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div onClick={handlePreview} className="cursor-pointer">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={thumbnail || "/placeholder.svg"} 
                alt={title} 
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
              />
            </div>
          </div>
          
          <Badge 
            className="absolute top-3 left-3 bg-white/80 text-foreground backdrop-blur-sm hover:bg-white/90"
          >
            {category}
          </Badge>
          
          {!isFree && (
            <Badge 
              className="absolute top-3 right-3 bg-primary/80 backdrop-blur-sm hover:bg-primary"
            >
              {formatPrice(price)}
            </Badge>
          )}
          
          {isFree && (
            <Badge 
              className="absolute top-3 right-3 bg-green-500/80 text-white backdrop-blur-sm hover:bg-green-500"
            >
              Miễn Phí
            </Badge>
          )}
        </div>
        
        <CardContent className="flex-grow p-5">
          <div onClick={handlePreview} className="cursor-pointer">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handlePreview}
            disabled={isProcessing}
          >
            <Eye className="mr-1 h-4 w-4" />
            Xem Trước
          </Button>
          
          {isFree ? (
            <Button
              size="sm"
              className="flex-1"
              disabled={!previewAvailable || isProcessing}
              onClick={handleDownload}
            >
              <Download className="mr-1 h-4 w-4" />
              {isProcessing ? "Đang tải..." : "Tải Xuống"}
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              disabled={isProcessing}
              onClick={handlePurchase}
            >
              <Lock className="mr-1 h-4 w-4" />
              Mua Ngay
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {showPaymentModal && (
        <PaymentModal 
          docId={id}
          docTitle={title}
          docPrice={price}
          isFree={isFree}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default DocumentCard;
