import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  companyName?: string;
  taxId?: string;
  dateOfBirth?: string;
  identificationNumber: string;
  identificationType: 'passport' | 'license' | 'nationalId';
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  isActive: boolean;
  totalBookings: number;
  totalSpent: number;
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerStore {
  customers: Customer[];
  searchQuery: string;
  filterStatus: 'all' | 'active' | 'inactive';
  
  // Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalBookings' | 'totalSpent'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerByEmail: (email: string) => Customer | undefined;
  searchCustomers: (query: string) => Customer[];
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: 'all' | 'active' | 'inactive') => void;
  updateCustomerStats: (customerId: string, bookingAmount: number) => void;
}

// Sample customers data
const sampleCustomers: Customer[] = [
  {
    id: 'cust001',
    name: 'John Photographer',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    companyName: 'John\'s Photography Studio',
    identificationNumber: 'P123456789',
    identificationType: 'passport',
    emergencyContact: {
      name: 'Jane Photographer',
      phone: '+1 (555) 123-4568',
      relationship: 'Spouse'
    },
    isActive: true,
    totalBookings: 5,
    totalSpent: 1250.00,
    membershipLevel: 'silver',
    notes: 'Professional photographer, frequent customer',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cust002',
    name: 'Sarah Director',
    email: 'sarah@filmstudio.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Film Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    companyName: 'Sunset Film Studios',
    taxId: 'TAX987654321',
    identificationNumber: 'L987654321',
    identificationType: 'license',
    emergencyContact: {
      name: 'Mike Producer',
      phone: '+1 (555) 987-6544',
      relationship: 'Business Partner'
    },
    isActive: true,
    totalBookings: 12,
    totalSpent: 3600.00,
    membershipLevel: 'gold',
    notes: 'Film director, often rents high-end equipment',
    createdAt: '2023-11-15T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'cust003',
    name: 'Alex Content Creator',
    email: 'alex@youtube.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '789 Digital Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA'
    },
    identificationNumber: 'D456789012',
    identificationType: 'license',
    emergencyContact: {
      name: 'Sam Creator',
      phone: '+1 (555) 456-7891',
      relationship: 'Sibling'
    },
    isActive: true,
    totalBookings: 8,
    totalSpent: 2100.00,
    membershipLevel: 'bronze',
    notes: 'YouTube content creator, prefers lightweight equipment',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
];

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: sampleCustomers,
      searchQuery: '',
      filterStatus: 'all',
      
      addCustomer: async (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: `cust${Date.now()}`,
          totalBookings: 0,
          totalSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          customers: [...state.customers, newCustomer]
        }));
      },
      
      updateCustomer: async (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
              : customer
          )
        }));
      },
      
      deleteCustomer: async (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id)
        }));
      },
      
      getCustomerById: (id) => {
        return get().customers.find((customer) => customer.id === id);
      },
      
      getCustomerByEmail: (email) => {
        return get().customers.find((customer) => customer.email === email);
      },
      
      searchCustomers: (query) => {
        const { customers, filterStatus } = get();
        let filtered = customers;
        
        if (filterStatus !== 'all') {
          filtered = filtered.filter(customer => 
            filterStatus === 'active' ? customer.isActive : !customer.isActive
          );
        }
        
        if (query) {
          filtered = filtered.filter(customer =>
            customer.name.toLowerCase().includes(query.toLowerCase()) ||
            customer.email.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query) ||
            (customer.companyName && customer.companyName.toLowerCase().includes(query.toLowerCase()))
          );
        }
        
        return filtered;
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilterStatus: (status) => set({ filterStatus: status }),
      
      updateCustomerStats: (customerId, bookingAmount) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? { 
                  ...customer, 
                  totalBookings: customer.totalBookings + 1,
                  totalSpent: customer.totalSpent + bookingAmount,
                  updatedAt: new Date().toISOString()
                }
              : customer
          )
        }));
      },
    }),
    {
      name: 'customer-store',
    }
  )
);