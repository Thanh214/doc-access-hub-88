import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Download, Star, Book, Clock, Tag, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, formatFileSize } from '@/utils/format';

interface Document {
  id: number;
  title: string;
  description: string;
  category_name: string;
  price: number;
  file_size: number;
  file_type: string;
  download_count: number;
  created_at: string;
  is_premium: boolean;
  status: string;
  thumbnail: string | null;
  uploader_name: string;
}

interface DocumentListProps {
  documents: Document[];
  onPurchase?: (documentId: string) => void;
  isAdmin?: boolean;
  isLoading?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  onPurchase, 
  isAdmin = false,
  isLoading = false 
}) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không tìm thấy tài liệu nào
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tiêu đề</th>
            <th className="px-4 py-2">Thumbnail</th>
            <th className="px-4 py-2">Loại</th>
            <th className="px-4 py-2">Danh mục</th>
            <th className="px-4 py-2">Kích thước</th>
            <th className="px-4 py-2">Giá</th>
            <th className="px-4 py-2">Lượt tải</th>
            <th className="px-4 py-2">Ngày tạo</th>
            <th className="px-4 py-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{doc.id}</td>
              <td className="px-4 py-2">{doc.title}</td>
              <td className="px-4 py-2">
                {doc.thumbnail ? (
                  <img 
                    src={doc.thumbnail} 
                    alt={doc.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-2">
                {doc.is_premium ? (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Premium
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Free
                  </span>
                )}
              </td>
              <td className="px-4 py-2">{doc.category_name}</td>
              <td className="px-4 py-2">{formatFileSize(doc.file_size)}</td>
              <td className="px-4 py-2">{formatCurrency(doc.price)}</td>
              <td className="px-4 py-2">{doc.download_count}</td>
              <td className="px-4 py-2">{formatDate(doc.created_at)}</td>
              <td className="px-4 py-2">
                <div className="flex space-x-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Xem chi tiết"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Chỉnh sửa"
                  >
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Xóa"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
