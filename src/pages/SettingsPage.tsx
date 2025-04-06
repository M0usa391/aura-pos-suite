
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  
  // Business Information State
  const [businessInfo, setBusinessInfo] = useState({
    name: 'متجر Aura',
    address: 'شارع الملك فهد، الرياض، المملكة العربية السعودية',
    phone: '+966 11 234 5678',
    email: 'info@aurapos.com',
    taxId: '123456789',
    logo: '',
  });
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    lowStockAlert: true,
    salesSummary: true,
    newSaleNotification: true,
  });
  
  // Invoice Settings State
  const [invoiceSettings, setInvoiceSettings] = useState({
    showLogo: true,
    showTaxId: true,
    currencySymbol: 'ر.س',
    invoiceNotes: 'شكراً لتعاملكم معنا!',
  });
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Handle business info form submission
  const handleBusinessInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the business info in a database
    toast.success('تم تحديث معلومات العمل بنجاح');
  };
  
  // Handle notification settings change
  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    });
    toast.success('تم تحديث إعدادات الإشعارات');
  };
  
  // Handle invoice settings form submission
  const handleInvoiceSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the invoice settings in a database
    toast.success('تم تحديث إعدادات الفواتير بنجاح');
  };
  
  // Handle password change form submission
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (passwordForm.currentPassword !== 'admin') {
      toast.error('كلمة المرور الحالية غير صحيحة');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    
    // In a real app, this would update the password in a database
    toast.success('تم تغيير كلمة المرور بنجاح');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  // Handle backup data
  const handleBackupData = () => {
    // In a real app, this would create a backup of the data
    toast.success('تم إنشاء نسخة احتياطية من البيانات');
  };
  
  // Handle restore data from backup
  const handleRestoreData = () => {
    // In a real app, this would restore data from a backup
    toast.info('هذه الوظيفة غير متاحة في النسخة التجريبية');
  };
  
  // Handle reset data
  const handleResetData = () => {
    if (confirm('هذا سيؤدي إلى حذف جميع البيانات. هل أنت متأكد؟')) {
      // Clear localStorage
      localStorage.clear();
      toast.success('تم إعادة تعيين جميع البيانات');
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };
  
  return (
    <div className="container mx-auto pb-16 pt-6 px-4">
      <h1 className="text-2xl font-bold text-aura-darkBlue mb-6">الإعدادات</h1>
      
      <Tabs defaultValue="business" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="business">معلومات العمل</TabsTrigger>
          <TabsTrigger value="invoice">إعدادات الفاتورة</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="account">الحساب</TabsTrigger>
          <TabsTrigger value="data">البيانات</TabsTrigger>
        </TabsList>
        
        {/* Business Information Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العمل</CardTitle>
              <CardDescription>
                قم بتحديث معلومات عملك التي ستظهر في الفواتير والتقارير.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBusinessInfoSubmit}>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">اسم العمل</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      placeholder="أدخل اسم العمل"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">العنوان</Label>
                    <Input
                      id="businessAddress"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      placeholder="أدخل عنوان العمل"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">رقم الهاتف</Label>
                      <Input
                        id="businessPhone"
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                        placeholder="أدخل رقم الهاتف"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessEmail">البريد الإلكتروني</Label>
                      <Input
                        id="businessEmail"
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                        placeholder="أدخل البريد الإلكتروني"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessTaxId">الرقم الضريبي</Label>
                    <Input
                      id="businessTaxId"
                      value={businessInfo.taxId}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                      placeholder="أدخل الرقم الضريبي"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessLogo">شعار العمل</Label>
                    <Input
                      id="businessLogo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        // In a real app, this would upload the logo to a server
                        if (e.target.files && e.target.files[0]) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target) {
                              setBusinessInfo({
                                ...businessInfo,
                                logo: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                  
                  <Button type="submit" className="mt-4 bg-aura-gold hover:bg-aura-gold/90">
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoice Settings Tab */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الفاتورة</CardTitle>
              <CardDescription>
                قم بتخصيص مظهر ومحتوى الفواتير.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvoiceSettingsSubmit}>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showLogo">إظهار الشعار</Label>
                      <div className="text-sm text-muted-foreground">
                        عرض شعار العمل في الفواتير
                      </div>
                    </div>
                    <Switch
                      id="showLogo"
                      checked={invoiceSettings.showLogo}
                      onCheckedChange={(checked) =>
                        setInvoiceSettings({ ...invoiceSettings, showLogo: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showTaxId">إظهار الرقم الضريبي</Label>
                      <div className="text-sm text-muted-foreground">
                        عرض الرقم الضريبي في الفواتير
                      </div>
                    </div>
                    <Switch
                      id="showTaxId"
                      checked={invoiceSettings.showTaxId}
                      onCheckedChange={(checked) =>
                        setInvoiceSettings({ ...invoiceSettings, showTaxId: checked })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">رمز العملة</Label>
                    <Input
                      id="currencySymbol"
                      value={invoiceSettings.currencySymbol}
                      onChange={(e) =>
                        setInvoiceSettings({ ...invoiceSettings, currencySymbol: e.target.value })
                      }
                      placeholder="رمز العملة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNotes">ملاحظات الفاتورة</Label>
                    <textarea
                      id="invoiceNotes"
                      className="elegant-input h-20"
                      value={invoiceSettings.invoiceNotes}
                      onChange={(e) =>
                        setInvoiceSettings({ ...invoiceSettings, invoiceNotes: e.target.value })
                      }
                      placeholder="ملاحظات تظهر في أسفل الفاتورة"
                    />
                  </div>
                  
                  <Button type="submit" className="mt-4 bg-aura-gold hover:bg-aura-gold/90">
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                اختر الإشعارات التي ترغب في تلقيها.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تنبيهات المخزون المنخفض</Label>
                    <div className="text-sm text-muted-foreground">
                      تلقي إشعارات عندما تنخفض مستويات المخزون عن الحد الأدنى
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlert}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('lowStockAlert', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>ملخص المبيعات اليومية</Label>
                    <div className="text-sm text-muted-foreground">
                      تلقي ملخص يومي للمبيعات في نهاية اليوم
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.salesSummary}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('salesSummary', checked)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>إشعارات المبيعات الجديدة</Label>
                    <div className="text-sm text-muted-foreground">
                      تلقي إشعار عند كل عملية بيع جديدة
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.newSaleNotification}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('newSaleNotification', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الحساب</CardTitle>
              <CardDescription>
                قم بتحديث معلومات حسابك وكلمة المرور.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      placeholder="أدخل كلمة المرور الحالية"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      placeholder="أدخل كلمة المرور الجديدة"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
                    />
                  </div>
                  
                  <Button type="submit" className="bg-aura-gold hover:bg-aura-gold/90">
                    تغيير كلمة المرور
                  </Button>
                </form>
                
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">تسجيل الخروج</h3>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                  >
                    <i className="bi bi-box-arrow-left ml-2"></i>
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>إدارة البيانات</CardTitle>
              <CardDescription>
                قم بإنشاء نسخة احتياطية من البيانات أو استعادتها.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">النسخ الاحتياطي</h3>
                  <p className="text-sm text-muted-foreground">
                    قم بإنشاء نسخة احتياطية من جميع بيانات النظام.
                  </p>
                  <Button onClick={handleBackupData}>
                    <i className="bi bi-download ml-2"></i>
                    إنشاء نسخة احتياطية
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium">استعادة البيانات</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    استعادة البيانات من نسخة احتياطية سابقة.
                  </p>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      // In a real app, this would restore data from a backup file
                      toast.info('هذه الوظيفة غير متاحة في النسخة التجريبية');
                    }}
                  />
                  <Button variant="outline" className="mt-2" onClick={handleRestoreData}>
                    <i className="bi bi-upload ml-2"></i>
                    استعادة البيانات
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-red-600">إعادة تعيين البيانات</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    سيؤدي هذا إلى حذف جميع البيانات وإعادة تعيين النظام.
                  </p>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleResetData}
                  >
                    <i className="bi bi-trash3 ml-2"></i>
                    إعادة تعيين البيانات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
