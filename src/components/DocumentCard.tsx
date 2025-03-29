
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Lock } from "lucide-react";
import { PaymentModal } from "./PaymentModal";

export interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string; // Require thumbnail with default in component
  price: number;
  isFree: boolean; 
  previewAvailable: boolean;
  is_premium?: boolean;
  is_featured?: boolean;
  user_id?: number;
  download_count?: number;
  created_at?: string;
  updated_at?: string;
}

const DocumentCard = ({
  id,
  title,
  description,
  category,
  thumbnail = "/placeholder.svg", // Provide default value
  price,
  isFree,
  previewAvailable,
}: DocumentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
  
  return (
    <>
      <Card 
        className="overflow-hidden transition-all duration-300 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <Link to={`/document/${id}`}>
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={thumbnail} 
                alt={title} 
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
              />
            </div>
          </Link>
          
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
          <Link to={`/document/${id}`}>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/document/${id}`}>
              <Eye className="mr-1 h-4 w-4" />
              Xem Trước
            </Link>
          </Button>
          
          {isFree ? (
            <Button
              size="sm"
              className="flex-1"
              disabled={!previewAvailable}
              onClick={() => setShowPaymentModal(true)}
            >
              <Download className="mr-1 h-4 w-4" />
              Tải Xuống
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => setShowPaymentModal(true)}
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
        />
      )}
    </>
  );
};

export default DocumentCard;
