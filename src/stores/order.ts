import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'bank_transfer' | 'cod' | 'ewallet';

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'production' | 'shipped' | 'delivered';
  createdAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
  addToHistory: (order: Order) => void;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
}

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KE-${timestamp}-${random}`;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      addToHistory: (order) => {
        set((state) => ({
          orderHistory: [order, ...state.orderHistory],
        }));
      },

      getOrderByNumber: (orderNumber) => {
        const { orderHistory } = get();
        return orderHistory.find((o) => o.orderNumber === orderNumber);
      },
    }),
    {
      name: 'kaos-euy-orders',
    }
  )
);

export { generateOrderNumber };
