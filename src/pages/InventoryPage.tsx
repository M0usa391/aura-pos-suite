
import React, { useState, useEffect } from 'react';
import { useStore, Product, Category } from '../data/store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '../utils/statistics';
import { toast } from 'sonner';

const InventoryPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('products');
  
  // Product form state
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    price: 0,
    costPrice: 0,
    category: '',
    stock: 0,
    minStock: 0,
  });
  
  // Category form state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
  });
  
  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);
  
  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      id: '',
      name: '',
      price: 0,
      costPrice: 0,
      category: categories.length > 0 ? categories[0].id : '',
      stock: 0,
      minStock: 0,
    });
    setIsEditMode(false);
  };
  
  // Reset category form
  const resetCategoryForm = () => {
    setCategoryForm({
      id: '',
      name: '',
    });
  };
  
  // Open product dialog for adding
  const handleAddProduct = () => {
    resetProductForm();
    setShowProductDialog(true);
  };
  
  // Open product dialog for editing
  const handleEditProduct = (product: Product) => {
    setProductForm({
      id: product.id,
      name: product.name,
      price: product.price,
      costPrice: product.costPrice,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
    });
    setIsEditMode(true);
    setShowProductDialog(true);
  };
  
  // Submit product form
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name) {
      toast.error('يرجى إدخال اسم المنتج');
      return;
    }
    
    if (productForm.price <= 0) {
      toast.error('يرجى إدخال سعر صحيح للمنتج');
      return;
    }
    
    if (isEditMode) {
      // Update existing product
      updateProduct(productForm.id, {
        name: productForm.name,
        price: productForm.price,
        costPrice: productForm.costPrice,
        category: productForm.category,
        stock: productForm.stock,
        minStock: productForm.minStock,
      });
      toast.success('تم تحديث المنتج بنجاح');
    } else {
      // Add new product
      addProduct({
        name: productForm.name,
        price: productForm.price,
        costPrice: productForm.costPrice,
        category: productForm.category,
        stock: productForm.stock,
        minStock: productForm.minStock,
      });
      toast.success('تمت إضافة المنتج بنجاح');
    }
    
    setShowProductDialog(false);
    resetProductForm();
  };
  
  // Delete a product
  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      toast.success('تم حذف المنتج بنجاح');
    }
  };
  
  // Open category dialog for adding
  const handleAddCategory = () => {
    resetCategoryForm();
    setShowCategoryDialog(true);
  };
  
  // Open category dialog for editing
  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
    });
    setShowCategoryDialog(true);
  };
  
  // Submit category form
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name) {
      toast.error('يرجى إدخال اسم التصنيف');
      return;
    }
    
    if (categoryForm.id) {
      // Update existing category
      updateCategory(categoryForm.id, categoryForm.name);
      toast.success('تم تحديث التصنيف بنجاح');
    } else {
      // Add new category
      addCategory(categoryForm.name);
      toast.success('تمت إضافة التصنيف بنجاح');
    }
    
    setShowCategoryDialog(false);
    resetCategoryForm();
  };
  
  // Delete a category
  const handleDeleteCategory = (id: string) => {
    // Check if category is in use
    const isInUse = products.some((product) => product.category === id);
    
    if (isInUse) {
      toast.error('لا يمكن حذف هذا التصنيف لأنه مستخدم في بعض المنتجات');
      return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      deleteCategory(id);
      toast.success('تم حذف التصنيف بنجاح');
    }
  };
  
  return (
    <div className="container mx-auto pb-16 pt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-aura-darkBlue">إدارة المخزون</h1>
        
        <div className="flex gap-2">
          {activeTab === 'products' ? (
            <Button className="bg-aura-gold hover:bg-aura-gold/90" onClick={handleAddProduct}>
              <i className="bi bi-plus-lg ml-2"></i>
              إضافة منتج
            </Button>
          ) : (
            <Button className="bg-aura-gold hover:bg-aura-gold/90" onClick={handleAddCategory}>
              <i className="bi bi-plus-lg ml-2"></i>
              إضافة تصنيف
            </Button>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="categories">التصنيفات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle>قائمة المنتجات</CardTitle>
                <Input
                  className="max-w-xs"
                  placeholder="بحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-right">
                        <th className="px-4 py-2 border-b">الكود</th>
                        <th className="px-4 py-2 border-b">الاسم</th>
                        <th className="px-4 py-2 border-b">السعر</th>
                        <th className="px-4 py-2 border-b">تكلفة الشراء</th>
                        <th className="px-4 py-2 border-b">التصنيف</th>
                        <th className="px-4 py-2 border-b">المخزون</th>
                        <th className="px-4 py-2 border-b">الحد الأدنى</th>
                        <th className="px-4 py-2 border-b">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const category = categories.find((cat) => cat.id === product.category);
                        const isLowStock = product.stock <= product.minStock;
                        
                        return (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{product.id}</td>
                            <td className="px-4 py-2 border-b">{product.name}</td>
                            <td className="px-4 py-2 border-b">{formatCurrency(product.price)}</td>
                            <td className="px-4 py-2 border-b">{formatCurrency(product.costPrice)}</td>
                            <td className="px-4 py-2 border-b">{category?.name || 'غير مصنف'}</td>
                            <td className={`px-4 py-2 border-b ${isLowStock ? 'text-red-600 font-semibold' : ''}`}>
                              {product.stock}
                            </td>
                            <td className="px-4 py-2 border-b">{product.minStock}</td>
                            <td className="px-4 py-2 border-b">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {searchTerm ? 'لا توجد منتجات متطابقة مع البحث' : 'لا توجد منتجات، أضف منتجًا جديدًا'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>قائمة التصنيفات</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-right">
                        <th className="px-4 py-2 border-b">الاسم</th>
                        <th className="px-4 py-2 border-b">عدد المنتجات</th>
                        <th className="px-4 py-2 border-b">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => {
                        const productCount = products.filter(
                          (product) => product.category === category.id
                        ).length;
                        
                        return (
                          <tr key={category.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{category.name}</td>
                            <td className="px-4 py-2 border-b">{productCount}</td>
                            <td className="px-4 py-2 border-b">
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCategory(category)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeleteCategory(category.id)}
                                  disabled={productCount > 0}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  لا توجد تصنيفات، أضف تصنيفًا جديدًا
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
            <DialogDescription>
              أدخل بيانات المنتج بالتفصيل.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  اسم المنتج *
                </label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="أدخل اسم المنتج"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    سعر البيع *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="costPrice" className="text-sm font-medium">
                    تكلفة الشراء *
                  </label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={productForm.costPrice}
                    onChange={(e) => setProductForm({ ...productForm, costPrice: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  التصنيف
                </label>
                <select
                  id="category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="elegant-input"
                >
                  <option value="">بدون تصنيف</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="stock" className="text-sm font-medium">
                    المخزون الحالي *
                  </label>
                  <Input
                    id="stock"
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="minStock" className="text-sm font-medium">
                    الحد الأدنى للمخزون
                  </label>
                  <Input
                    id="minStock"
                    type="number"
                    value={productForm.minStock}
                    onChange={(e) => setProductForm({ ...productForm, minStock: parseInt(e.target.value) })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductDialog(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-aura-gold hover:bg-aura-gold/90">
                {isEditMode ? 'تحديث المنتج' : 'إضافة المنتج'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{categoryForm.id ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
            <DialogDescription>
              أدخل اسم التصنيف.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="categoryName" className="text-sm font-medium">
                  اسم التصنيف *
                </label>
                <Input
                  id="categoryName"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="أدخل اسم التصنيف"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCategoryDialog(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="bg-aura-gold hover:bg-aura-gold/90">
                {categoryForm.id ? 'تحديث التصنيف' : 'إضافة التصنيف'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
