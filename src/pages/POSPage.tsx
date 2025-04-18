import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore, Product, CartItem } from '../data/store';
import { formatCurrency } from '../utils/statistics';
import { downloadInvoiceAsPDF, printInvoice } from '../utils/invoice';
import { toast } from 'sonner';

// Business info for the invoice
const businessInfo = {
  name: 'متجر Aura',
  address: 'طرابلس، ليبيا',
  phone: '+218 91 234 5678',
  email: 'info@aurapos.com',
};

const POSPage: React.FC = () => {
  const { products, categories, cart, addToCart, updateCartItem, removeFromCart, clearCart, completeSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showCompleteSaleDialog, setShowCompleteSaleDialog] = useState(false);
  const [currentSale, setCurrentSale] = useState<any>(null);
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  
  // Filter products based on search term and active category
  useEffect(() => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, activeCategory]);
  
  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    
    const saleResult = completeSale();
    setCurrentSale(saleResult);
    setShowCompleteSaleDialog(true);
    toast.success('تمت عملية البيع بنجاح');
  };
  
  // Handle increase/decrease quantity
  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(item.product.id);
    } else if (newQuantity > item.product.stock) {
      toast.error(`الكمية المتوفرة من ${item.product.name} هي ${item.product.stock} فقط`);
    } else {
      updateCartItem(item.product.id, newQuantity);
    }
  };
  
  // Handle print invoice
  const handlePrintInvoice = () => {
    if (currentSale) {
      printInvoice(currentSale, businessInfo);
    }
  };
  
  // Handle download invoice as PDF
  const handleDownloadInvoice = () => {
    if (currentSale) {
      downloadInvoiceAsPDF(currentSale, businessInfo);
    }
  };

  return (
    <div className="container mx-auto pb-16 pt-6">
      <h1 className="text-2xl font-bold text-primary mb-6">نقطة البيع</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Products Section */}
        <div className="w-full lg:w-2/3 space-y-4">
          <Card className="libyan-border overflow-hidden">
            <CardHeader className="libyan-header pb-2">
              <CardTitle className="text-white">المنتجات</CardTitle>
              <div className="relative w-full max-w-xs">
                <Input
                  className="pr-10 bg-white/90 shadow-sm"
                  placeholder="بحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <i className="bi bi-search text-gray-400"></i>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b px-6 bg-secondary/10 overflow-x-auto">
                  <TabsList className="h-12">
                    <TabsTrigger
                      value="all"
                      onClick={() => setActiveCategory('all')}
                    >
                      الكل
                    </TabsTrigger>
                    
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        onClick={() => setActiveCategory(category.id)}
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="p-0 m-0">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Card
                          key={product.id}
                          className={`product-card cursor-pointer ${
                            product.stock <= 0 ? 'opacity-50' : ''
                          }`}
                          onClick={() => {
                            if (product.stock > 0) {
                              addToCart(product, 1);
                              toast.success(`تمت إضافة ${product.name} إلى السلة`);
                            } else {
                              toast.error(`${product.name} غير متوفر في المخزون`);
                            }
                          }}
                        >
                          <div className="product-image bg-gray-100 flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <i className="bi bi-box text-4xl text-gray-400"></i>
                            )}
                          </div>
                          <div className="product-info">
                            <div className="text-base font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate mb-2">
                              {product.id}
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="font-bold text-primary">
                                {formatCurrency(product.price)}
                              </div>
                              <div className="text-xs">
                                {product.stock > 0 ? (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">المتاح: {product.stock}</span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">غير متوفر</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-gray-500">
                        لا توجد منتجات متطابقة مع البحث
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="p-0 m-0">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <Card
                            key={product.id}
                            className={`product-card cursor-pointer ${
                              product.stock <= 0 ? 'opacity-50' : ''
                            }`}
                            onClick={() => {
                              if (product.stock > 0) {
                                addToCart(product, 1);
                                toast.success(`تمت إضافة ${product.name} إلى السلة`);
                              } else {
                                toast.error(`${product.name} غير متوفر في المخزون`);
                              }
                            }}
                          >
                            <div className="product-image bg-gray-100 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <i className="bi bi-box text-4xl text-gray-400"></i>
                              )}
                            </div>
                            <div className="product-info">
                              <div className="text-base font-medium truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate mb-2">
                                {product.id}
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="font-bold text-primary">
                                  {formatCurrency(product.price)}
                                </div>
                                <div className="text-xs">
                                  {product.stock > 0 ? (
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">المتاح: {product.stock}</span>
                                  ) : (
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">غير متوفر</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                          لا توجد منتجات متطابقة مع البحث
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Cart Section */}
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-6 libyan-border overflow-hidden">
            <CardHeader className="libyan-header">
              <CardTitle className="flex justify-between items-center text-white">
                <span>سلة المشتريات</span>
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                  {cart.length} منتج
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto py-4">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between bg-gray-50 items-center p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center ml-3 overflow-hidden">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <i className="bi bi-box text-xl text-gray-400"></i>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(item.product.price)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        
                        <div className="w-8 text-center font-medium">{item.quantity}</div>
                        
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        >
                          <i className="bi bi-plus"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <i className="bi bi-cart text-4xl mb-2 opacity-50"></i>
                  <p>السلة فارغة</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 bg-secondary/10 rounded-b-lg p-4">
              <div className="w-full flex justify-between text-lg font-bold">
                <span>المجموع:</span>
                <span className="text-primary">{formatCurrency(cartTotal)}</span>
              </div>
              
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="w-1/2 border-primary text-primary"
                  onClick={() => clearCart()}
                  disabled={cart.length === 0}
                >
                  <i className="bi bi-trash ml-2"></i>
                  إفراغ السلة
                </Button>
                
                <Button
                  className="w-1/2 bg-secondary hover:bg-secondary/90"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                >
                  <i className="bi bi-check2-circle ml-2"></i>
                  إتمام البيع
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Complete Sale Dialog */}
      <Dialog open={showCompleteSaleDialog} onOpenChange={setShowCompleteSaleDialog}>
        <DialogContent className="max-w-md libyan-pattern">
          <DialogHeader className="libyan-header rounded-t-lg">
            <DialogTitle className="text-white">تمت عملية البيع بنجاح</DialogTitle>
            <DialogDescription className="text-white/80">
              تمت عملية البيع بنجاح ويمكنك الآن طباعة الفاتورة أو تحميلها.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {currentSale && formatCurrency(currentSale.total)}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {currentSale && currentSale.invoiceNumber}
            </div>
            
            <div className="p-4 bg-primary/10 rounded-md mb-4 border border-primary/20">
              <div className="text-sm text-gray-600 mb-2">
                الربح من هذه العملية:
              </div>
              <div className="text-lg font-bold text-green-600">
                {currentSale && formatCurrency(currentSale.profit)}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-primary text-primary"
              onClick={handlePrintInvoice}
            >
              <i className="bi bi-printer ml-2"></i>
              طباعة الفاتورة
            </Button>
            
            <Button
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90"
              onClick={handleDownloadInvoice}
            >
              <i className="bi bi-download ml-2"></i>
              تحميل PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POSPage;
