import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // API-like methods
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  refreshToken: () => Promise<{ success: boolean }>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  // Internal methods
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Demo users storage (simulates database)
let demoUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@camera-rental.com',
    role: 'admin',
    phone: '+1234567890',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer',
    phone: '+1234567891',
    createdAt: '2024-01-02T00:00:00Z',
  },
];

// Simulate API delay
const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await simulateApiDelay();
          
          const user = demoUsers.find(u => u.email === email);
          if (user && password === 'password123') {
            const updatedUser = { ...user, lastLogin: new Date().toISOString() };
            // Update user in demo storage
            demoUsers = demoUsers.map(u => u.id === user.id ? updatedUser : u);
            
            set({ user: updatedUser, isLoading: false });
            return { success: true, message: 'Login successful' };
          }
          
          set({ isLoading: false, error: 'Invalid credentials' });
          return { success: false, message: 'Invalid email or password' };
        } catch (error) {
          set({ isLoading: false, error: 'Login failed' });
          return { success: false, message: 'Network error occurred' };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        await simulateApiDelay();
        set({ user: null, isLoading: false, error: null });
      },
      
      register: async (name: string, email: string, password: string, phone?: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await simulateApiDelay();
          
          // Check if user already exists
          const existingUser = demoUsers.find(u => u.email === email);
          if (existingUser) {
            set({ isLoading: false, error: 'User already exists' });
            return { success: false, message: 'User with this email already exists' };
          }
          
          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            role: 'customer',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          
          demoUsers.push(newUser);
          set({ user: newUser, isLoading: false });
          return { success: true, message: 'Registration successful' };
        } catch (error) {
          set({ isLoading: false, error: 'Registration failed' });
          return { success: false, message: 'Network error occurred' };
        }
      },
      
      refreshToken: async () => {
        const { user } = get();
        if (!user) return { success: false };
        
        set({ isLoading: true });
        try {
          await simulateApiDelay();
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: 'Token refresh failed' });
          return { success: false };
        }
      },
      
      updateProfile: async (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return { success: false, message: 'Not authenticated' };
        
        set({ isLoading: true, error: null });
        
        try {
          await simulateApiDelay();
          
          const updatedUser = { ...user, ...userData };
          // Update in demo storage
          demoUsers = demoUsers.map(u => u.id === user.id ? updatedUser : u);
          
          set({ user: updatedUser, isLoading: false });
          return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
          set({ isLoading: false, error: 'Profile update failed' });
          return { success: false, message: 'Network error occurred' };
        }
      },
      
      changePassword: async (oldPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await simulateApiDelay();
          
          // In real app, would verify old password
          if (oldPassword !== 'password123') {
            set({ isLoading: false, error: 'Invalid current password' });
            return { success: false, message: 'Current password is incorrect' };
          }
          
          set({ isLoading: false });
          return { success: true, message: 'Password changed successfully' };
        } catch (error) {
          set({ isLoading: false, error: 'Password change failed' });
          return { success: false, message: 'Network error occurred' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);