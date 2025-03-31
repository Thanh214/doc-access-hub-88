
/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null || isNaN(bytes)) {
    return '0 B';
  }
  
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date to local date string
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(',', '');
  } catch (error) {
    return dateString;
  }
};

/**
 * Format currency to VND
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 đ';
  }
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
