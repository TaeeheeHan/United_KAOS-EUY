import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}

interface AdminState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Demo credentials
const DEMO_ADMIN = {
  email: 'admin@kaoseuy.com',
  password: 'admin123',
  user: {
    id: '1',
    email: 'admin@kaoseuy.com',
    name: 'Admin Kaos EUY',
    role: 'admin' as const,
  },
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          set({
            user: DEMO_ADMIN.user,
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'kaos-euy-admin',
    }
  )
);
