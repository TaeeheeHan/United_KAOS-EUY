import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, Size, ProductColor } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: Size, color: ProductColor, quantity?: number) => void;
  removeItem: (productId: string, size: Size, color: ProductColor) => void;
  updateQuantity: (productId: string, size: Size, color: ProductColor, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size, color, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.size === size &&
              item.color.code === color.code
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, size, color, quantity }],
          };
        });
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.size === size &&
                item.color.code === color.code
              )
          ),
        }));
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            item.size === size &&
            item.color.code === color.code
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'kaos-euy-cart',
    }
  )
);
