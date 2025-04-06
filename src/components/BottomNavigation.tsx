
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية', path: '/dashboard', icon: 'bi-house-fill' },
  { id: 'pos', label: 'نقطة البيع', path: '/pos', icon: 'bi-cart-fill' },
  { id: 'inventory', label: 'المخزون', path: '/inventory', icon: 'bi-box-seam-fill' },
  { id: 'stats', label: 'الإحصائيات', path: '/statistics', icon: 'bi-bar-chart-fill' },
  { id: 'settings', label: 'الإعدادات', path: '/settings', icon: 'bi-gear-fill' },
];

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-200 py-2 z-10">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
