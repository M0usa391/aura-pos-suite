
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  category: string;
  stock: number;
  minStock: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  profit: number;
  date: string;
  invoiceNumber: string;
}

interface Store {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  sales: Sale[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Category actions
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  
  // Cart actions
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Sales actions
  completeSale: () => void;
}

// Generate a random 6-character product code
const generateProductCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate invoice number with date prefix
const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${year}${month}${day}-${random}`;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      cart: [],
      sales: [],
      
      addProduct: (product) => {
        const id = generateProductCode();
        const createdAt = new Date().toISOString();
        set((state) => ({
          products: [...state.products, { ...product, id, createdAt }],
        }));
      },
      
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        }));
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },
      
      addCategory: (name) => {
        const id = Date.now().toString();
        set((state) => ({
          categories: [...state.categories, { id, name }],
        }));
      },
      
      updateCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, name } : category
          ),
        }));
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },
      
      addToCart: (product, quantity) => {
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id);
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            cart: [...state.cart, { product, quantity }],
          };
        });
      },
      
      updateCartItem: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      completeSale: () => {
        const { cart, products } = get();
        
        if (cart.length === 0) return;
        
        const total = cart.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        
        const profit = cart.reduce(
          (sum, item) => sum + (item.product.price - item.product.costPrice) * item.quantity,
          0
        );
        
        const sale: Sale = {
          id: Date.now().toString(),
          items: [...cart],
          total,
          profit,
          date: new Date().toISOString(),
          invoiceNumber: generateInvoiceNumber(),
        };
        
        // Update product stock
        cart.forEach((item) => {
          const product = products.find((p) => p.id === item.product.id);
          if (product) {
            get().updateProduct(product.id, {
              stock: product.stock - item.quantity,
            });
          }
        });
        
        set((state) => ({
          sales: [sale, ...state.sales],
          cart: [],
        }));
        
        return sale;
      },
    }),
    {
      name: 'aura-pos-storage',
    }
  )
);
