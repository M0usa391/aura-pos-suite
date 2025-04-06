
import { Sale, Product } from '../data/store';

// Get sales for a specific day
export const getDailySales = (sales: Sale[], date: Date): Sale[] => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  return sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= targetDate && saleDate < nextDay;
  });
};

// Get sales for a specific week
export const getWeeklySales = (sales: Sale[], date: Date): Sale[] => {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  // Get the first day of the week (Sunday)
  const firstDayOfWeek = new Date(targetDate);
  const day = targetDate.getDay();
  firstDayOfWeek.setDate(targetDate.getDate() - day);
  
  // Get the last day of the week (Saturday)
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 7);
  
  return sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= firstDayOfWeek && saleDate < lastDayOfWeek;
  });
};

// Get sales for a specific month
export const getMonthlySales = (sales: Sale[], month: number, year: number): Sale[] => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  return sales.filter((sale) => {
    const saleDate = new Date(sale.date);
    return saleDate >= startDate && saleDate <= endDate;
  });
};

// Get total sales amount for a period
export const getTotalSalesAmount = (sales: Sale[]): number => {
  return sales.reduce((total, sale) => total + sale.total, 0);
};

// Get total profit for a period
export const getTotalProfit = (sales: Sale[]): number => {
  return sales.reduce((total, sale) => total + sale.profit, 0);
};

// Get top selling products for a period
export const getTopSellingProducts = (sales: Sale[], limit: number = 5): { product: string; quantity: number; }[] => {
  const productCounts: Record<string, { name: string; quantity: number }> = {};
  
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const productId = item.product.id;
      if (!productCounts[productId]) {
        productCounts[productId] = {
          name: item.product.name,
          quantity: 0,
        };
      }
      productCounts[productId].quantity += item.quantity;
    });
  });
  
  return Object.values(productCounts)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
    .map((item) => ({
      product: item.name,
      quantity: item.quantity,
    }));
};

// Get low stock products
export const getLowStockProducts = (products: Product[]): Product[] => {
  return products.filter((product) => product.stock <= product.minStock);
};

// Format currency - تغيير العملة إلى الدينار الليبي
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-LY', {
    style: 'currency',
    currency: 'LYD',
    maximumFractionDigits: 3,
    minimumFractionDigits: 3
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('ar-LY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

// Format short date
export const formatShortDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('ar-LY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(dateString));
};
