
/**
 * Format currency to Vietnamese format (e.g., 100.000đ)
 */
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === undefined || amount === null) {
    return "0đ";
  }
  return amount.toLocaleString("vi-VN", { maximumFractionDigits: 0 }).replace(/,/g, ".") + "đ";
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format date to Vietnamese format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
