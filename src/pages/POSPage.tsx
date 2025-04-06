
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore, Product, CartItem } from '../data/store';
import { formatCurrency } from '../utils/statistics';
import { downloadInvoiceAsPDF, printInvoice } from '../utils/invoice';
import { toast } from 'sonner';

// Business info for the invoice
const businessInfo = {
  name: 'متجر Aura',
  address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
  phone: '+966 11 234 5678',
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
    
    // Check if sale was completed successfully
    if (saleResult) {
      setCurrentSale(saleResult);
      setShowCompleteSaleDialog(true);
      toast.success('تمت عملية البيع بنجاح');
    }
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
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Products Section */}
        <div className="w-full lg:w-2/3 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <CardTitle>المنتجات</CardTitle>
                <Input
                  className="max-w-xs"
                  placeholder="بحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" className="w-full">
                <div className="border-b px-6">
                  <TabsList className="h-12">
                    <TabsTrigger
                      value="all"
                      onClick={() => setActiveCategory('all')}
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-aura-gold"
                    >
                      الكل
                    </TabsTrigger>
                    
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-aura-gold"
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
                          className={`cursor-pointer hover:shadow-md transition-shadow ${
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
                          <CardContent className="p-4 text-center">
                            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-2">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              ) : (
                                <i className="bi bi-box text-4xl text-gray-400"></i>
                              )}
                            </div>
                            <div className="text-sm font-medium truncate">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {product.id}
                            </div>
                            <div className="mt-1 font-bold text-aura-darkBlue">
                              {formatCurrency(product.price)}
                            </div>
                            <div className="text-xs mt-1">
                              {product.stock > 0 ? (
                                <span className="text-green-600">متوفر: {product.stock}</span>
                              ) : (
                                <span className="text-red-600">غير متوفر</span>
                              )}
                            </div>
                          </CardContent>
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
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
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
                            <CardContent className="p-4 text-center">
                              <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-2">
                                {product.imageUrl ? (
                                  <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover rounded-md"
                                  />
                                ) : (
                                  <i className="bi bi-box text-4xl text-gray-400"></i>
                                )}
                              </div>
                              <div className="text-sm font-medium truncate">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {product.id}
                              </div>
                              <div className="mt-1 font-bold text-aura-darkBlue">
                                {formatCurrency(product.price)}
                              </div>
                              <div className="text-xs mt-1">
                                {product.stock > 0 ? (
                                  <span className="text-green-600">متوفر: {product.stock}</span>
                                ) : (
                                  <span className="text-red-600">غير متوفر</span>
                                )}
                              </div>
                            </CardContent>
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
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>سلة المشتريات</span>
                <span className="text-sm text-aura-gold">
                  {cart.length} منتج
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center border-b border-gray-100 pb-4"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center ml-3">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover rounded-md"
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
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <i className="bi bi-dash"></i>
                        </Button>
                        
                        <div className="w-10 text-center">{item.quantity}</div>
                        
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
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
                  <i className="bi bi-cart text-4xl mb-2"></i>
                  <p>السلة فارغة</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full flex justify-between text-lg font-bold">
                <span>المجموع:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => clearCart()}
                  disabled={cart.length === 0}
                >
                  <i className="bi bi-trash ml-2"></i>
                  إفراغ السلة
                </Button>
                
                <Button
                  className="w-1/2 bg-aura-gold hover:bg-aura-gold/90"
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>تمت عملية البيع بنجاح</DialogTitle>
            <DialogDescription>
              تمت عملية البيع بنجاح ويمكنك الآن طباعة الفاتورة أو تحميلها.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 text-center">
            <div className="text-3xl font-bold text-aura-gold mb-2">
              {currentSale && formatCurrency(currentSale.total)}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {currentSale && currentSale.invoiceNumber}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-md mb-4">
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
              className="w-full sm:w-auto"
              onClick={handlePrintInvoice}
            >
              <i className="bi bi-printer ml-2"></i>
              طباعة الفاتورة
            </Button>
            
            <Button
              className="w-full sm:w-auto bg-aura-gold hover:bg-aura-gold/90"
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
