
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Clock, Award } from "lucide-react";
import { formatCurrency } from '../utils/format';
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser } from '@/services/auth.service';

interface Document {
  id: string;
  title: string;
  description: string;
  file_path?: string;
  price: number;
  category_id?: number;
  category?: string;
  is_premium?: boolean;
  download_count?: number;
  created_at?: string;
}

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, isLoading }) => {
  const { toast } = useToast();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';

  // Function to handle document purchase
  const handlePurchase = (document: Document) => {
    if (!currentUser) {
      toast({
        title: "Bạn cần đăng nhập",
        description: "Vui lòng đăng nhập để mua tài liệu này.",
        variant: "destructive",
      });
      return;
    }

    if (currentUser.balance < document.price) {
      toast({
        title: "Số dư không đủ",
        description: "Số dư của bạn không đủ để mua tài liệu này. Vui lòng nạp thêm tiền.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would call an API here to process the purchase
    toast({
      title: "Mua tài liệu thành công",
      description: `Bạn đã mua thành công tài liệu "${document.title}".`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="animate-pulse h-[280px] overflow-hidden rounded-xl">
            <div className="h-40 bg-gray-200 rounded-t-xl"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy tài liệu</h3>
        <p className="mt-1 text-sm text-gray-500">
          Chưa có tài liệu nào trong hệ thống hoặc không tìm thấy tài liệu phù hợp với tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((document) => (
        <Card key={document.id} className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 rounded-xl border-gray-100">
          <div className="aspect-[16/9] bg-gradient-soft relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md">
                <svg 
                  className="h-10 w-10 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
            </div>
            
            {document.is_premium && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-gradient-vibrant text-white border-none">
                <Award className="h-3 w-3 mr-1" /> Premium
              </Badge>
            )}
          </div>
          
          <div className="flex-1 p-4">
            {document.category && (
              <Badge variant="outline" className="mb-2 text-xs">
                {document.category}
              </Badge>
            )}
            
            <h3 className="font-medium text-lg mb-2 line-clamp-2">
              <Link to={`/documents/${document.id}`} className="hover:text-primary">
                {document.title}
              </Link>
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {document.description}
            </p>
            
            <div className="mt-auto pt-3 border-t">
              <div className="flex justify-between items-center">
                <div className="font-medium">
                  {formatCurrency(document.price)}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-lg"
                    asChild
                  >
                    <Link to={`/documents/${document.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Xem
                    </Link>
                  </Button>
                  
                  {isAdmin ? (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="rounded-lg"
                      asChild
                    >
                      <Link to={`/documents/${document.id}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Tải
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handlePurchase(document)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Mua
                    </Button>
                  )}
                </div>
              </div>
              
              {document.created_at && (
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(document.created_at).toLocaleDateString('vi-VN')}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
