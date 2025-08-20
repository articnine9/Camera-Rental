import { create } from 'zustand';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type StoreLocation = 'downtown' | 'midtown' | 'uptown';

export interface Booking {
  id: string;
  userId: string;
  equipmentId: string;
  equipmentName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  storeLocation: StoreLocation;
  status: BookingStatus;
  totalCost: number;
  deposit: number;
  createdAt: string;
  notes?: string;
}

interface BookingStore {
  bookings: Booking[];
  currentBooking: Partial<Booking> | null;
  
  // Actions
  setCurrentBooking: (booking: Partial<Booking> | null) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus, notes?: string) => void;
  getUserBookings: (userId: string) => Booking[];
  getPendingBookings: () => Booking[];
  getBookingsByStore: (storeLocation: StoreLocation) => Booking[];
}

// Sample bookings
const sampleBookings: Booking[] = [
  {
    id: '1',
    userId: 'user1',
    equipmentId: '1',
    equipmentName: 'Canon EOS R5',
    customerName: 'John Photographer',
    customerEmail: 'john@example.com',
    customerPhone: '+1 (555) 123-4567',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    storeLocation: 'downtown',
    status: 'pending',
    totalCost: 225,
    deposit: 2000,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    equipmentId: '2',
    equipmentName: 'Sony FX6',
    customerName: 'Sarah Director',
    customerEmail: 'sarah@filmstudio.com',
    customerPhone: '+1 (555) 987-6543',
    startDate: '2024-01-20',
    endDate: '2024-01-25',
    storeLocation: 'midtown',
    status: 'approved',
    totalCost: 600,
    deposit: 4000,
    createdAt: '2024-01-12T14:30:00Z'
  }
];

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: sampleBookings,
  currentBooking: null,

  setCurrentBooking: (booking) => set({ currentBooking: booking }),

  createBooking: (newBooking) => set((state) => ({
    bookings: [...state.bookings, {
      ...newBooking,
      id: Date.now().toString(),
      status: 'pending' as BookingStatus,
      createdAt: new Date().toISOString()
    }]
  })),

  updateBookingStatus: (id, status, notes) => set((state) => ({
    bookings: state.bookings.map(booking =>
      booking.id === id 
        ? { ...booking, status, notes: notes || booking.notes }
        : booking
    )
  })),

  getUserBookings: (userId) => {
    return get().bookings.filter(booking => booking.userId === userId);
  },

  getPendingBookings: () => {
    return get().bookings.filter(booking => booking.status === 'pending');
  },

  getBookingsByStore: (storeLocation) => {
    return get().bookings.filter(booking => booking.storeLocation === storeLocation);
  }
}));