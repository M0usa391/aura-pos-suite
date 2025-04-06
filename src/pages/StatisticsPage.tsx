import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useStore } from '../data/store';
import { 
  getDailySales, 
  getWeeklySales, 
  getMonthlySales, 
  getTotalSalesAmount, 
  getTotalProfit, 
  getTopSellingProducts,
  formatCurrency,
  formatShortDate 
} from '../utils/statistics';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

const StatisticsPage: React.FC = () => {
  const { sales, products } = useStore();
  const [period, setPeriod] = useState('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  const COLORS = ['#D4AF37', '#1A3365', '#F5E7C1', '#0A1F44', '#F8F5E4', '#998542', '#6B7AA1'];
  
  useEffect(() => {
    const processDailyData = () => {
      const dailySales = getDailySales(sales, currentDate);
      
      const hourlyData: Record<number, { hour: string; sales: number; profit: number }> = {};
      
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = {
          hour: `${i}:00`,
          sales: 0,
          profit: 0,
        };
      }
      
      dailySales.forEach((sale) => {
        const saleHour = new Date(sale.date).getHours();
        hourlyData[saleHour].sales += sale.total;
        hourlyData[saleHour].profit += sale.profit;
      });
      
      setDailyData(Object.values(hourlyData));
    };
    
    const processWeeklyData = () => {
      const weeklySales = getWeeklySales(sales, currentDate);
      
      const dailyData: Record<number, { day: string; sales: number; profit: number }> = {};
      
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        dailyData[i] = {
          day: dayNames[i],
          sales: 0,
          profit: 0,
        };
      }
      
      weeklySales.forEach((sale) => {
        const saleDate = new Date(sale.date);
        const dayOfWeek = saleDate.getDay();
        
        dailyData[dayOfWeek].sales += sale.total;
        dailyData[dayOfWeek].profit += sale.profit;
      });
      
      setWeeklyData(Object.values(dailyData));
    };
    
    const processMonthlyData = () => {
      const monthlySales = getMonthlySales(sales, currentMonth, currentYear);
      
      const dailyData: Record<number, { date: string; sales: number; profit: number }> = {};
      
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        
        dailyData[i] = {
          date: `${i}`,
          sales: 0,
          profit: 0,
        };
      }
      
      monthlySales.forEach((sale) => {
        const saleDate = new Date(sale.date);
        const dayOfMonth = saleDate.getDate();
        
        dailyData[dayOfMonth].sales += sale.total;
        dailyData[dayOfMonth].profit += sale.profit;
      });
      
      setMonthlyData(Object.values(dailyData));
    };
    
    const processCategoryData = () => {
      const categorySales: Record<string, { name: string; value: number }> = {};
      
      products.forEach((product) => {
        if (!categorySales[product.category]) {
          categorySales[product.category] = {
            name: product.category || 'غير مصنف',
            value: 0,
          };
        }
      });
      
      sales.forEach((sale) => {
        sale.items.forEach((item) => {
          const category = item.product.category || 'غير مصنف';
          
          if (!categorySales[category]) {
            categorySales[category] = {
              name: category,
              value: 0,
            };
          }
          
          categorySales[category].value += item.product.price * item.quantity;
        });
      });
      
      setCategoryData(Object.values(categorySales));
    };
    
    processDailyData();
    processWeeklyData();
    processMonthlyData();
    processCategoryData();
  }, [sales, products, currentDate, currentMonth, currentYear]);
  
  const handlePrevious = () => {
    if (period === 'daily') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (period === 'weekly') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (period === 'monthly') {
      const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };
  
  const handleNext = () => {
    if (period === 'daily') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (period === 'weekly') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (period === 'monthly') {
      const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };
  
  const handleToday = () => {
    if (period === 'daily' || period === 'weekly') {
      setCurrentDate(new Date());
    } else if (period === 'monthly') {
      setCurrentMonth(new Date().getMonth());
      setCurrentYear(new Date().getFullYear());
    }
  };
  
  const getPeriodLabel = (): string => {
    if (period === 'daily') {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(currentDate);
    } else if (period === 'weekly') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${new Intl.DateTimeFormat('ar-SA', {
        month: 'short',
        day: 'numeric',
      }).format(startOfWeek)} - ${new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(endOfWeek)}`;
    } else {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
      }).format(new Date(currentYear, currentMonth, 1));
    }
  };
  
  const getPeriodSales = (): number => {
    if (period === 'daily') {
      const dailySales = getDailySales(sales, currentDate);
      return getTotalSalesAmount(dailySales);
    } else if (period === 'weekly') {
      const weeklySales = getWeeklySales(sales, currentDate);
      return getTotalSalesAmount(weeklySales);
    } else {
      const monthlySales = getMonthlySales(sales, currentMonth, currentYear);
      return getTotalSalesAmount(monthlySales);
    }
  };
  
  const getPeriodProfit = (): number => {
    if (period === 'daily') {
      const dailySales = getDailySales(sales, currentDate);
      return getTotalProfit(dailySales);
    } else if (period === 'weekly') {
      const weeklySales = getWeeklySales(sales, currentDate);
      return getTotalProfit(weeklySales);
    } else {
      const monthlySales = getMonthlySales(sales, currentMonth, currentYear);
      return getTotalProfit(monthlySales);
    }
  };
  
  const getTopProductsForPeriod = (): { product: string; quantity: number }[] => {
    if (period === 'daily') {
      const dailySales = getDailySales(sales, currentDate);
      return getTopSellingProducts(dailySales, 5);
    } else if (period === 'weekly') {
      const weeklySales = getWeeklySales(sales, currentDate);
      return getTopSellingProducts(weeklySales, 5);
    } else {
      const monthlySales = getMonthlySales(sales, currentMonth, currentYear);
      return getTopSellingProducts(monthlySales, 5);
    }
  };
  
  const formatTooltip = (value: number): string => {
    return formatCurrency(value);
  };
  
  return (
    <div className="container mx-auto pb-16 pt-6 px-4">
      <h1 className="text-2xl font-bold text-aura-darkBlue mb-6">الإحصائيات والتقارير</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <Tabs value={period} onValueChange={setPeriod} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="daily">يومي</TabsTrigger>
            <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
            <TabsTrigger value="monthly">شهري</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <i className="bi bi-chevron-right"></i>
          </Button>
          
          <span className="font-medium min-w-[150px] text-center">
            {getPeriodLabel()}
          </span>
          
          <Button variant="outline" size="sm" onClick={handleNext}>
            <i className="bi bi-chevron-left"></i>
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleToday}>
            اليوم
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">إجمالي المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getPeriodSales())}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">إجمالي الأرباح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getPeriodProfit())}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">عدد المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {period === 'daily'
                ? getDailySales(sales, currentDate).length
                : period === 'weekly'
                ? getWeeklySales(sales, currentDate).length
                : getMonthlySales(sales, currentMonth, currentYear).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">نسبة الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getPeriodSales() > 0
                ? `${Math.round((getPeriodProfit() / getPeriodSales()) * 100)}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>تحليل المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <TabsContent value="daily" forceMount className={period === 'daily' ? 'block' : 'hidden'}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="sales" name="المبيعات" fill="#D4AF37" />
                    <Bar dataKey="profit" name="الأرباح" fill="#1A3365" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" forceMount className={period === 'weekly' ? 'block' : 'hidden'}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={formatTooltip} />
                    <Bar dataKey="sales" name="المبيعات" fill="#D4AF37" />
                    <Bar dataKey="profit" name="الأرباح" fill="#1A3365" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" forceMount className={period === 'monthly' ? 'block' : 'hidden'}>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={formatTooltip} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="المبيعات" stroke="#D4AF37" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" name="الأرباح" stroke="#1A3365" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>المبيعات حسب التصنيف</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
        </CardHeader>
        <CardContent>
          {getTopProductsForPeriod().length > 0 ? (
            <div className="space-y-4">
              {getTopProductsForPeriod().map((product, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-aura-lightGold flex items-center justify-center ml-3">
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
              لا توجد بيانات مبيعات متاحة لهذه الفترة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
