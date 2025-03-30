
export const formatCurrency = (amount: number): string => {
  // Format with dot as thousand separator and đ symbol at the end
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })
  .format(amount)
  .replace('₫', 'đ')
  .trim();
}; 
