
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
          <Card className="overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{category}</Badge>
                <Badge variant="outline">{pages} pages</Badge>
                <Badge variant="outline">{fileSize}</Badge>
                <Badge variant="outline">Added on {dateAdded}</Badge>
              </div>
              <p className="text-muted-foreground mb-6">{description}</p>
              
              <div className="relative mb-6">
                {!isFree && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/95 to-transparent ${isPreviewExpanded ? "h-[70%] pointer-events-none" : "h-full"}`}>
                    <Lock className="h-10 w-10 text-primary mb-3" />
                    <h3 className="text-lg font-medium mb-2">Premium Document</h3>
                    <p className="text-center text-muted-foreground mb-4 max-w-xs">
                      Purchase this document for {formatPrice(price)} to view the full content
                    </p>
                    <Button 
                      onClick={() => setShowPaymentModal(true)}
                      className="pointer-events-auto"
                    >
                      Purchase Now
                    </Button>
                  </div>
                )}
                
                {isFree && !isPreviewExpanded && (
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-background to-transparent flex items-end justify-center p-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsPreviewExpanded(true)}
                    >
                      Show More
                    </Button>
                  </div>
                )}
                
                <div className={`prose max-w-none ${isPreviewExpanded ? '' : 'max-h-[500px] overflow-hidden'}`}>
                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                </div>
                
                {isPreviewExpanded && (
                  <div className="mt-6 text-center">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsPreviewExpanded(false)}
                    >
                      Show Less
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
          <Card className="sticky top-24">
            <div className="p-6">
              {thumbnail && (
                <img 
                  src={thumbnail} 
                  alt={title} 
                  className="w-full h-40 object-cover rounded-md mb-6"
                />
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Document Info</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{category}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-medium">{pages}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">File size:</span>
                    <span className="font-medium">{fileSize}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Date added:</span>
                    <span className="font-medium">{dateAdded}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      {isFree ? (
                        <Badge variant="success" className="bg-green-500 text-white">Free</Badge>
                      ) : (
                        formatPrice(price)
                      )}
                    </span>
                  </li>
                </ul>
              </div>
              
              {isFree ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Free documents require a subscription to download. Preview is available without limitations.
                    </p>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Subscribe to Download
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Purchase Document
                </Button>
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
