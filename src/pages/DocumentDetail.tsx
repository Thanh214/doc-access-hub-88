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
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await axios.get(`/api/documents/${id}`);
                setDocument(response.data);
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
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', document?.title || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải tài liệu');
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

    if (!document) {
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
                    <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                            document.is_premium 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                        }`}>
                            {document.is_premium ? 'Premium' : 'Miễn phí'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {document.category_name}
                        </span>
                    </div>
                </div>

                <div className="prose max-w-none mb-6">
                    <p>{document.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Thông tin tài liệu</h3>
                        <dl className="mt-2 space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Kích thước:</dt>
                                <dd className="text-sm font-medium">{formatFileSize(document.file_size)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Định dạng:</dt>
                                <dd className="text-sm font-medium">{document.file_type}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Lượt tải:</dt>
                                <dd className="text-sm font-medium">{document.download_count}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Ngày đăng:</dt>
                                <dd className="text-sm font-medium">{formatDate(document.created_at)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-600">Người đăng:</dt>
                                <dd className="text-sm font-medium">{document.uploader_name}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Xem trước</h3>
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <iframe
                                    src={`/api/documents/preview/${id}`}
                                    className="w-full h-full"
                                    title="Document preview"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Giá:</span>
                                <span className="text-xl font-bold text-primary">
                                    {document.is_premium ? formatCurrency(document.price) : 'Miễn phí'}
                                </span>
                            </div>
                            <button
                                onClick={handlePurchase}
                                className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                {document.is_premium ? 'Mua ngay' : 'Tải xuống'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail; 