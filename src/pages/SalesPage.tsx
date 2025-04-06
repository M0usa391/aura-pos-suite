
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore, Sale } from '../data/store';
import { formatCurrency, formatDate, formatShortDate } from '../utils/statistics';
import { downloadInvoiceAsPDF, printInvoice } from '../utils/invoice';

// Business info for the invoice
const businessInfo = {
  name: 'متجر Aura',
  address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
  phone: '+966 11 234 5678',
  email: 'info@aurapos.com',
};

const SalesPage: React.FC = () => {
  const { sales } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  
  // Filter sales based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = sales.filter(
        (sale) =>
          sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.items.some((item) =>
            item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredSales(filtered);
    } else {
      setFilteredSales(sales);
    }
  }, [sales, searchTerm]);
  
  // Open sale details dialog
  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setShowSaleDialog(true);
  };
  
  // Handle print invoice
  const handlePrintInvoice = () => {
    if (selectedSale) {
      printInvoice(selectedSale, businessInfo);
    }
  };
  
  // Handle download invoice as PDF
  const handleDownloadInvoice = () => {
    if (selectedSale) {
      downloadInvoiceAsPDF(selectedSale, businessInfo);
    }
  };

  return (
    <div className="container mx-auto pb-16 pt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-aura-darkBlue">سجل المبيعات</h1>
        <Input
          className="max-w-xs"
          placeholder="بحث عن فاتورة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>قائمة المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-right">
                    <th className="px-4 py-2 border-b">رقم الفاتورة</th>
                    <th className="px-4 py-2 border-b">التاريخ</th>
                    <th className="px-4 py-2 border-b">المبلغ</th>
                    <th className="px-4 py-2 border-b">الربح</th>
                    <th className="px-4 py-2 border-b">عدد المنتجات</th>
                    <th className="px-4 py-2 border-b">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b font-medium">{sale.invoiceNumber}</td>
                      <td className="px-4 py-2 border-b">{formatShortDate(sale.date)}</td>
                      <td className="px-4 py-2 border-b font-medium">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="px-4 py-2 border-b text-green-600">
                        {formatCurrency(sale.profit)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} وحدة
                      </td>
                      <td className="px-4 py-2 border-b">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewSale(sale)}
                        >
                          <i className="bi bi-eye ml-1"></i>
                          عرض
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? 'لا توجد مبيعات متطابقة مع البحث' : 'لا توجد مبيعات'}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Sale Details Dialog */}
      <Dialog open={showSaleDialog} onOpenChange={setShowSaleDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>تفاصيل الفاتورة: {selectedSale?.invoiceNumber}</span>
              <span className="text-sm font-normal">
                {selectedSale && formatDate(selectedSale.date)}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">إجمالي المبلغ</div>
                  <div className="text-lg font-bold">{formatCurrency(selectedSale.total)}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">إجمالي الربح</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedSale.profit)}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">نسبة الربح</div>
                  <div className="text-lg font-bold">
                    {Math.round((selectedSale.profit / selectedSale.total) * 100)}%
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">عدد المنتجات</div>
                  <div className="text-lg font-bold">
                    {selectedSale.items.reduce((sum, item) => sum + item.quantity, 0)} وحدة
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-right">
                      <th className="px-4 py-2 border-b">المنتج</th>
                      <th className="px-4 py-2 border-b">الكمية</th>
                      <th className="px-4 py-2 border-b">سعر الوحدة</th>
                      <th className="px-4 py-2 border-b">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSale.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{item.product.id}</div>
                        </td>
                        <td className="px-4 py-2 border-b">{item.quantity}</td>
                        <td className="px-4 py-2 border-b">{formatCurrency(item.product.price)}</td>
                        <td className="px-4 py-2 border-b font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-4 py-2 border-b text-left font-bold">
                        الإجمالي
                      </td>
                      <td className="px-4 py-2 border-b font-bold">
                        {formatCurrency(selectedSale.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handlePrintInvoice}>
                  <i className="bi bi-printer ml-2"></i>
                  طباعة الفاتورة
                </Button>
                
                <Button className="bg-aura-gold hover:bg-aura-gold/90" onClick={handleDownloadInvoice}>
                  <i className="bi bi-download ml-2"></i>
                  تحميل PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesPage;
