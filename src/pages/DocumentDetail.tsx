
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { formatCurrency, formatFileSize, formatDate } from '../utils/format';

interface Document {
    id: number;
    title: string;
    description: string;
    category_name: string;
    price: number;
    file_path: string;
    file_size: number;
    file_type: string;
    download_count: number;
    created_at: string;
    is_premium: boolean;
    status: string;
    thumbnail: string | null;
    uploader_name: string;
}

const DocumentDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [documentData, setDocumentData] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`/api/documents/${id}`);
                setDocumentData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [id]);

    const handlePurchase = async () => {
        try {
            const response = await axios.get(`/api/documents/download/${id}`);
            // Tạo URL từ blob và tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = window.document.createElement('a');
            link.href = url;
            link.setAttribute('download', documentData?.title || 'document');
            window.document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải tài liệu');
        }
    };

    const handlePreviewError = () => {
        setPreviewError('Không thể xem trước tài liệu này');
    };

    const renderPreview = () => {
        if (!documentData) return null;

        const fileType = documentData.file_type.toLowerCase();
        
        if (fileType.includes('pdf') || fileType.includes('image')) {
            return (
                <iframe
                    src={`/api/documents/preview/${id}`}
                    className="w-full h-full border-0"
                    title="Document preview"
                    onError={handlePreviewError}
                />
            );
        } else if (fileType.includes('text') || fileType.includes('rtf') || fileType.includes('msword')) {
            return (
                <div className="w-full h-full bg-white p-4 overflow-auto">
                    <object
                        data={`/api/documents/preview/${id}`}
                        type={documentData.file_type}
                        className="w-full h-full"
                        onError={handlePreviewError}
                    >
                        <p>Không thể xem trước tài liệu này</p>
                    </object>
                </div>
            );
        } else {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Không hỗ trợ xem trước loại file này</p>
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                {error}
            </div>
        );
    }

    if (!documentData) {
        return (
            <div className="text-center py-8 text-gray-500">
                Không tìm thấy tài liệu
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{documentData.title}</h1>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            documentData.is_premium 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {documentData.is_premium ? 'Premium' : 'Miễn phí'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {documentData.category_name}
                        </span>
                    </div>
                </div>

                <div className="prose max-w-none mb-6">
                    <p>{documentData.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Thông tin tài liệu</h3>
                        <dl className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Kích thước:</dt>
                                <dd className="text-sm font-medium">{formatFileSize(documentData.file_size)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Định dạng:</dt>
                                <dd className="text-sm font-medium">{documentData.file_type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Lượt tải:</dt>
                                <dd className="text-sm font-medium">{documentData.download_count}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Ngày đăng:</dt>
                                <dd className="text-sm font-medium">{formatDate(documentData.created_at)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Người đăng:</dt>
                                <dd className="text-sm font-medium">{documentData.uploader_name}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Xem trước</h3>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                {previewError ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-red-500">{previewError}</p>
                                    </div>
                                ) : (
                                    renderPreview()
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Giá:</span>
                                <span className="text-xl font-bold text-primary">
                                    {documentData.is_premium ? formatCurrency(documentData.price) : 'Miễn phí'}
                                </span>
                            </div>
                            <button
                                onClick={handlePurchase}
                                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                {documentData.is_premium ? 'Mua ngay' : 'Tải xuống'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail; 
