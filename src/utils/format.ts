
export const formatCurrency = (amount: number): string => {
    if (amount === undefined || amount === null) {
        return '0₫';
    }
    
    try {
        // Format with thousand separators and add Vietnamese dong symbol
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return amount.toLocaleString('vi-VN') + '₫';
    }
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const truncateText = (text: string, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format document type with color
export const formatDocumentType = (type: string): { label: string; color: string } => {
    switch (type?.toLowerCase()) {
        case 'pdf':
            return { label: 'PDF', color: 'text-red-500 bg-red-50 border-red-200' };
        case 'doc':
        case 'docx':
            return { label: 'Word', color: 'text-blue-500 bg-blue-50 border-blue-200' };
        case 'xls':
        case 'xlsx':
            return { label: 'Excel', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' };
        case 'ppt':
        case 'pptx':
            return { label: 'PowerPoint', color: 'text-orange-500 bg-orange-50 border-orange-200' };
        case 'image':
        case 'jpg':
        case 'jpeg':
        case 'png':
            return { label: 'Hình ảnh', color: 'text-purple-500 bg-purple-50 border-purple-200' };
        case 'audio':
        case 'mp3':
        case 'wav':
            return { label: 'Âm thanh', color: 'text-cyan-500 bg-cyan-50 border-cyan-200' };
        case 'video':
        case 'mp4':
            return { label: 'Video', color: 'text-pink-500 bg-pink-50 border-pink-200' };
        case 'zip':
        case 'rar':
            return { label: 'Nén', color: 'text-yellow-500 bg-yellow-50 border-yellow-200' };
        case 'sql':
            return { label: 'SQL', color: 'text-indigo-500 bg-indigo-50 border-indigo-200' };
        default:
            return { label: 'Tài liệu', color: 'text-gray-500 bg-gray-50 border-gray-200' };
    }
};

// Format status with color
export const formatStatus = (status: string): { label: string; color: string } => {
    switch (status?.toLowerCase()) {
        case 'active':
        case 'approved':
            return { label: 'Hoạt động', color: 'text-green-700 bg-green-100' };
        case 'pending':
            return { label: 'Chờ duyệt', color: 'text-yellow-700 bg-yellow-100' };
        case 'rejected':
            return { label: 'Từ chối', color: 'text-red-700 bg-red-100' };
        case 'draft':
            return { label: 'Bản nháp', color: 'text-gray-700 bg-gray-100' };
        case 'archived':
            return { label: 'Đã lưu trữ', color: 'text-blue-700 bg-blue-100' };
        default:
            return { label: status || 'Không xác định', color: 'text-gray-700 bg-gray-100' };
    }
};

// Format number with thousand separator
export const formatNumber = (number: number): string => {
    return number?.toLocaleString('vi-VN') || '0';
};
