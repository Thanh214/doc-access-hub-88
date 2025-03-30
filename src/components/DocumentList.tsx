import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Star, Book, Clock, Tag, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatFileSize } from '@/utils/format';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  file_path?: string;
  file_size?: number;
  download_count: number;
  created_at: string;
  is_premium: boolean;
  uploader_name?: string;
  uploader_username?: string;
  status: string;
}

interface DocumentListProps {
  documents: Document[];
  onPurchase?: (documentId: string) => void;
  isAdmin?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onPurchase, isAdmin = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (documents.length === 0) {
    return (
      <motion.div 
        className="text-center py-16 px-4 bg-gradient-to-b from-white to-primary/5 rounded-2xl border border-primary/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <FileText className="h-10 w-10 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
        <p className="mt-1 text-base text-muted-foreground max-w-md mx-auto">
          Chưa có tài liệu nào trong hệ thống hoặc không tìm thấy tài liệu phù hợp với tìm kiếm.
        </p>
        <Button variant="outline" className="mt-6">
          <Link to="/documents" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            Khám phá tài liệu khác
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {documents.map((document) => (
        <motion.div
          key={document.id}
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-primary/10 overflow-hidden flex flex-col h-full"
        >
          <div className="p-6 pb-4 flex-grow">
            <div className="flex justify-between items-start mb-3">
              <Badge variant={document.is_premium ? "default" : "secondary"} className={document.is_premium ? "bg-primary text-white" : "bg-primary/10 text-primary"}>
                {document.is_premium ? "Premium" : "Miễn phí"}
              </Badge>
              {document.category && (
                <Badge variant="outline" className="bg-transparent border-primary/20 text-muted-foreground">
                  {document.category}
                </Badge>
              )}
            </div>
            
            <Link to={`/documents/${document.id}`}>
              <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">{document.title}</h3>
            </Link>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{document.description}</p>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-muted-foreground mt-auto">
              {document.file_size && (
                <div className="flex items-center">
                  <FileText className="h-3.5 w-3.5 mr-1 text-primary/70" />
                  <span>{formatFileSize(document.file_size)}</span>
                </div>
              )}
              <div className="flex items-center">
                <Download className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>{document.download_count || 0} lượt tải</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 text-primary/70" />
                <span>{formatDate(document.created_at)}</span>
              </div>
              {document.uploader_name && (
                <div className="flex items-center">
                  <User className="h-3.5 w-3.5 mr-1 text-primary/70" />
                  <span>{document.uploader_name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-primary/10 bg-primary/5 flex justify-between items-center">
            <div className="font-medium text-primary">
              {document.is_premium ? formatCurrency(document.price) : 'Miễn phí'}
            </div>
            
            {isAdmin ? (
              <Link to={`/admin/documents/${document.id}`}>
                <Button size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                  Chi tiết
                </Button>
              </Link>
            ) : (
              document.is_premium ? (
                <Button 
                  size="sm" 
                  onClick={() => onPurchase && onPurchase(document.id)}
                  className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                >
                  Mua ngay
                </Button>
              ) : (
                <Link to={`/documents/${document.id}`}>
                  <Button size="sm" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                    Xem chi tiết
                  </Button>
                </Link>
              )
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DocumentList;
