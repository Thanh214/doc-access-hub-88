import React, { useState, useEffect } from 'react';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import ReactPlayer from 'react-player';
import Papa from 'papaparse';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentModal } from "./PaymentModal";

interface DocumentPreviewProps {
  fileUrl: string;
  fileType: string;
  className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileUrl,
  fileType,
  className = ''
}) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      if (!fileUrl || !fileType) {
        setError('Thiếu thông tin file');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const type = fileType.toLowerCase();

        if (type.includes('msword') || type.includes('wordprocessingml')) {
          const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
          const result = await mammoth.convertToHtml({ arrayBuffer: response.data });
          setContent(result.value);
        }
        else if (type.includes('sheet') || type.includes('excel')) {
          const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
          const workbook = XLSX.read(response.data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          setContent(JSON.stringify(data, null, 2));
        }
        else if (type.includes('text') || type.includes('csv')) {
          const response = await axios.get(fileUrl);
          if (type.includes('csv')) {
            Papa.parse(response.data, {
              complete: (results) => {
                setContent(JSON.stringify(results.data, null, 2));
              },
              error: (error) => {
                setError(`Lỗi đọc file CSV: ${error.message}`);
              }
            });
          } else {
            setContent(response.data);
          }
        }
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError(`Lỗi khi tải nội dung: ${err?.message || 'Không xác định'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [fileUrl, fileType]);

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!fileUrl || !fileType) {
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p>Không có file để hiển thị</p>
        </div>
      );
    }

    const type = fileType.toLowerCase();

    try {
      if (type.includes('pdf')) {
        return (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div style={{ height: '750px' }}>
              <Viewer fileUrl={fileUrl} />
            </div>
          </Worker>
        );
      }

      if (type.includes('video')) {
        return (
          <div className="aspect-video">
            <ReactPlayer
              url={fileUrl}
              controls
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>
        );
      }

      if (type.includes('image')) {
        return (
          <img 
            src={fileUrl} 
            alt="Preview" 
            className="max-w-full h-auto rounded-lg"
          />
        );
      }

      if (type.includes('msword') || type.includes('wordprocessingml')) {
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        );
      }

      if (type.includes('sheet') || type.includes('excel')) {
        return (
          <div className="p-4 bg-white rounded-lg shadow overflow-auto max-h-[750px]">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        );
      }

      if (type.includes('text') || type.includes('csv')) {
        return (
          <div className="p-4 bg-white rounded-lg shadow overflow-auto max-h-[750px]">
            <pre className="whitespace-pre-wrap">{content}</pre>
          </div>
        );
      }

      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center">
          <p>Không hỗ trợ xem trước loại file này</p>
          <p className="text-sm text-gray-500">({fileType})</p>
        </div>
      );
    } catch (err) {
      console.error('Error rendering preview:', err);
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Lỗi khi hiển thị file
        </div>
      );
    }
  };

  return (
    <div className={`document-preview ${className}`}>
      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      ) : (
        renderPreview()
      )}
    </div>
  );
};
