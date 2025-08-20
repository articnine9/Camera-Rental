import { create } from 'zustand';

export interface Equipment {
  id: string;
  name: string;
  brand: string;
  category: 'camera' | 'lens' | 'accessory';
  description: string;
  image: string;
  dailyRate: number;
  deposit: number;
  available: boolean;
  storeLocation: 'downtown' | 'midtown' | 'uptown';
  specifications: Record<string, string>;
}

interface EquipmentStore {
  equipment: Equipment[];
  featuredEquipment: Equipment[];
  selectedEquipment: Equipment | null;
  
  // Actions
  setSelectedEquipment: (equipment: Equipment | null) => void;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  getEquipmentByCategory: (category: Equipment['category']) => Equipment[];
  getAvailableEquipment: () => Equipment[];
}

// Sample data
const sampleEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Canon EOS R5',
    brand: 'Canon',
    category: 'camera',
    description: 'Professional full-frame mirrorless camera with 45MP sensor',
    image: '/placeholder.svg',
    dailyRate: 75,
    deposit: 2000,
    available: true,
    storeLocation: 'downtown',
    specifications: {
      'Sensor': '45MP Full-Frame',
      'ISO Range': '100-51200',
      'Video': '8K RAW',
      'Mount': 'Canon RF'
    }
  },
  {
    id: '2',
    name: 'Sony FX6',
    brand: 'Sony',
    category: 'camera',
    description: 'Professional cinema camera with full-frame sensor',
    image: '/placeholder.svg',
    dailyRate: 120,
    deposit: 4000,
    available: true,
    storeLocation: 'midtown',
    specifications: {
      'Sensor': 'Full-Frame CMOS',
      'Recording': '4K 120p',
      'Mount': 'Sony E',
      'Codec': 'XAVC-I'
    }
  },
  {
    id: '3',
    name: 'Canon RF 24-70mm f/2.8L',
    brand: 'Canon',
    category: 'lens',
    description: 'Professional standard zoom lens',
    image: '/placeholder.svg',
    dailyRate: 45,
    deposit: 1200,
    available: true,
    storeLocation: 'downtown',
    specifications: {
      'Focal Length': '24-70mm',
      'Aperture': 'f/2.8',
      'Mount': 'Canon RF',
      'IS': 'No (Body IS)'
    }
  },
  {
    id: '4',
    name: 'DJI Ronin 4D',
    brand: 'DJI',
    category: 'accessory',
    description: 'Professional cinema camera with integrated gimbal',
    image: '/placeholder.svg',
    dailyRate: 200,
    deposit: 6000,
    available: false,
    storeLocation: 'uptown',
    specifications: {
      'Sensor': '6K Full-Frame',
      'Gimbal': '4-Axis',
      'Recording': '6K ProRes RAW',
      'Range': '6km'
    }
  }
];

export const useEquipmentStore = create<EquipmentStore>((set, get) => ({
  equipment: sampleEquipment,
  featuredEquipment: sampleEquipment.slice(0, 3),
  selectedEquipment: null,

  setSelectedEquipment: (equipment) => set({ selectedEquipment: equipment }),

  addEquipment: (newEquipment) => set((state) => ({
    equipment: [...state.equipment, { ...newEquipment, id: Date.now().toString() }]
  })),

  updateEquipment: (id, updates) => set((state) => ({
    equipment: state.equipment.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  deleteEquipment: (id) => set((state) => ({
    equipment: state.equipment.filter(item => item.id !== id)
  })),

  getEquipmentByCategory: (category) => {
    return get().equipment.filter(item => item.category === category);
  },

  getAvailableEquipment: () => {
    return get().equipment.filter(item => item.available);
  }
}));