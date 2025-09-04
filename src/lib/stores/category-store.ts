import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  getSubCategories: (parentId: string) => Category[];
  getRootCategories: () => Category[];
}

// Sample categories data
const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Cameras',
    description: 'All types of cameras and camera equipment',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'DSLR',
    description: 'Digital Single-Lens Reflex cameras',
    parentId: '1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Lighting',
    description: 'Professional lighting equipment',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Studio Lights',
    description: 'Studio lighting equipment',
    parentId: '3',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Audio',
    description: 'Audio recording and sound equipment',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: sampleCategories,
      
      addCategory: async (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },
      
      updateCategory: async (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates, updatedAt: new Date().toISOString() }
              : category
          )
        }));
      },
      
      deleteCategory: async (id) => {
        // Also delete subcategories
        set((state) => ({
          categories: state.categories.filter((category) => 
            category.id !== id && category.parentId !== id
          )
        }));
      },
      
      getCategoryById: (id) => {
        return get().categories.find((category) => category.id === id);
      },
      
      getSubCategories: (parentId) => {
        return get().categories.filter((category) => category.parentId === parentId);
      },
      
      getRootCategories: () => {
        return get().categories.filter((category) => !category.parentId);
      },
    }),
    {
      name: 'category-store',
    }
  )
);