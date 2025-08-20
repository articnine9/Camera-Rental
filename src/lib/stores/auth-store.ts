import { create } from 'zustand';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeLocation?: 'downtown' | 'midtown' | 'uptown';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
}

// Sample users for demo
const sampleUsers: User[] = [
  {
    id: 'admin1',
    name: 'Store Manager',
    email: 'admin@camerarent.com',
    role: 'admin',
    storeLocation: 'downtown'
  },
  {
    id: 'user1',
    name: 'John Photographer',
    email: 'john@example.com',
    role: 'customer'
  }
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = sampleUsers.find(u => u.email === email);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  register: async (name, email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'customer'
    };
    
    set({ user: newUser, isAuthenticated: true });
    return true;
  },

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  }
}));