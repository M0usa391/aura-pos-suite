
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { 
  getTotalSalesAmount,
  getTotalProfit,
  getTopSellingProducts,
  getLowStockProducts,
  formatCurrency,
  getDailySales
} from '../utils/statistics';

const Dashboard: React.FC = () => {
  const { products, sales } = useStore();
  const [dailySales, setDailySales] = useState(0);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [topProducts, setTopProducts] = useState<{ product: string; quantity: number }[]>([]);
  const [lowStockItems, setLowStockItems] = useState(0);
  
  useEffect(() => {
    // Get today's sales
    const todaySales = getDailySales(sales, new Date());
    setDailySales(getTotalSalesAmount(todaySales));
    setDailyProfit(getTotalProfit(todaySales));
    
    // Get top products for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSales = sales.filter(sale => 
      new Date(sale.date) >= thirtyDaysAgo
    );
    
    setTopProducts(getTopSellingProducts(recentSales, 5));
    
    // Get count of low stock items
    setLowStockItems(getLowStockProducts(products).length);
  }, [products, sales]);

  return (
    <div className="container mx-auto pb-16 pt-6 px-4">
      <h1 className="text-2xl font-bold text-aura-darkBlue mb-6">لوحة التحكم</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">المبيعات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dailySales)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">الأرباح اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dailyProfit)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">عدد المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">منتجات قليلة المخزون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/pos">
          <Button className="w-full h-24 bg-aura-gold hover:bg-aura-gold/90 flex flex-col items-center justify-center">
            <i className="bi bi-cart-fill text-2xl mb-2"></i>
            <span>نقطة البيع</span>
          </Button>
        </Link>
        
        <Link to="/inventory">
          <Button className="w-full h-24 bg-aura-darkBlue hover:bg-aura-darkBlue/90 flex flex-col items-center justify-center">
            <i className="bi bi-box-seam-fill text-2xl mb-2"></i>
            <span>المخزون</span>
          </Button>
        </Link>
        
        <Link to="/statistics">
          <Button className="w-full h-24 bg-aura-gold hover:bg-aura-gold/90 flex flex-col items-center justify-center">
            <i className="bi bi-graph-up-arrow text-2xl mb-2"></i>
            <span>التقارير</span>
          </Button>
        </Link>
        
        <Link to="/sales">
          <Button className="w-full h-24 bg-aura-darkBlue hover:bg-aura-darkBlue/90 flex flex-col items-center justify-center">
            <i className="bi bi-receipt text-2xl mb-2"></i>
            <span>الفواتير</span>
          </Button>
        </Link>
      </div>
      
      {/* Top Selling Products */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-aura-lightGold flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span>{product.product}</span>
                  </div>
                  <div className="font-semibold">{product.quantity} وحدة</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              لا توجد بيانات مبيعات متاحة
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center">
              <i className="bi bi-exclamation-triangle-fill ml-2"></i>
              تنبيه: منتجات منخفضة المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              يوجد {lowStockItems} منتج بحاجة إلى إعادة تعبئة المخزون.
            </p>
            <Link to="/inventory" className="mt-2 inline-block">
              <Button variant="outline" className="text-red-700 border-red-300 hover:bg-red-100">
                عرض المنتجات
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
