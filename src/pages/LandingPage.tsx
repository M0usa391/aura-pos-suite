
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-aura-darkBlue mb-6">
            نظام <span className="text-aura-gold">Aura POS</span> المتكامل
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
            الحل الأمثل لإدارة مبيعاتك ومخزونك بكل سهولة واحترافية. نظام متكامل يساعدك على إدارة عملك بكفاءة عالية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-aura-gold hover:bg-aura-gold/90 text-white px-6 py-3 rounded-lg text-lg">
                تسجيل الدخول
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" className="border-aura-darkBlue text-aura-darkBlue px-6 py-3 rounded-lg text-lg">
                تعرف على المميزات
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-aura-darkBlue mb-16">
            مميزات النظام
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-cart-check-fill text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">نقطة البيع</h3>
              <p className="text-gray-600">
                واجهة سهلة الاستخدام لإتمام عمليات البيع بسرعة وفعالية، مع إمكانية طباعة الفواتير مباشرة.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-box-seam-fill text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">إدارة المخزون</h3>
              <p className="text-gray-600">
                متابعة دقيقة للمنتجات مع تنبيهات للمنتجات منخفضة المخزون، وتحديث تلقائي للمخزون مع كل عملية بيع.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-graph-up-arrow text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">التقارير والإحصائيات</h3>
              <p className="text-gray-600">
                تقارير مفصلة للمبيعات والأرباح، مع إحصائيات يومية وأسبوعية وشهرية لمراقبة أداء متجرك.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-receipt text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">إصدار الفواتير</h3>
              <p className="text-gray-600">
                إنشاء فواتير احترافية مخصصة، مع إمكانية الطباعة أو التصدير بصيغة PDF.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-tags-fill text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">تصنيف المنتجات</h3>
              <p className="text-gray-600">
                إمكانية تصنيف المنتجات بمرونة تامة، مما يسهل إدارة المنتجات والبحث عنها في نقطة البيع.
              </p>
            </div>
            
            <div className="elegant-card text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-aura-lightGold text-aura-gold mb-6 mx-auto">
                <i className="bi bi-shield-check text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-aura-darkBlue mb-3">أمان وموثوقية</h3>
              <p className="text-gray-600">
                حماية بيانات متجرك مع نظام آمن للتخزين والمزامنة، وإمكانية تحديد صلاحيات المستخدمين.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-aura-darkBlue text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6">ابدأ استخدام نظام Aura POS اليوم</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            انضم إلى الآلاف من أصحاب الأعمال الذين يستخدمون Aura POS لإدارة أعمالهم بنجاح
          </p>
          <Link to="/login">
            <Button className="bg-aura-gold hover:bg-aura-gold/90 text-white px-8 py-3 rounded-lg text-lg">
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-100">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-aura-darkBlue mb-4">Aura POS</h2>
            <p className="text-gray-600 mb-6">
              نظام نقاط البيع المتكامل لإدارة متجرك بذكاء
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-aura-darkBlue hover:text-aura-gold">
                <i className="bi bi-facebook text-xl"></i>
              </a>
              <a href="#" className="text-aura-darkBlue hover:text-aura-gold">
                <i className="bi bi-twitter text-xl"></i>
              </a>
              <a href="#" className="text-aura-darkBlue hover:text-aura-gold">
                <i className="bi bi-instagram text-xl"></i>
              </a>
              <a href="#" className="text-aura-darkBlue hover:text-aura-gold">
                <i className="bi bi-linkedin text-xl"></i>
              </a>
            </div>
            <p className="mt-6 text-gray-500">
              &copy; {new Date().getFullYear()} Aura POS. كل الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
