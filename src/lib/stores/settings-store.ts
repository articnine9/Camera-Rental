import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingType = 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'email' | 'url';

export interface Setting {
  id: string;
  key: string;
  label: string;
  description: string;
  type: SettingType;
  value: any;
  category: string;
  options?: string[]; // For select type
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsState {
  settings: Setting[];
  categories: string[];
  addSetting: (setting: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSetting: (id: string, updates: Partial<Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteSetting: (id: string) => Promise<void>;
  getSettingsByCategory: (category: string) => Setting[];
  getSettingValue: (key: string) => any;
  updateSettingValue: (key: string, value: any) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => Promise<void>;
}

const defaultSettings: Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Application Settings
  {
    key: 'app_name',
    label: 'Application Name',
    description: 'The name of your application',
    type: 'text',
    value: 'Equipment Rental System',
    category: 'Application',
    required: true
  },
  {
    key: 'app_description',
    label: 'Application Description',
    description: 'Brief description of your application',
    type: 'textarea',
    value: 'Professional equipment rental management system',
    category: 'Application'
  },
  {
    key: 'company_email',
    label: 'Company Email',
    description: 'Main contact email for the company',
    type: 'email',
    value: 'contact@company.com',
    category: 'Application',
    required: true
  },
  {
    key: 'company_phone',
    label: 'Company Phone',
    description: 'Main contact phone number',
    type: 'text',
    value: '+1 (555) 123-4567',
    category: 'Application'
  },
  {
    key: 'company_address',
    label: 'Company Address',
    description: 'Physical address of the company',
    type: 'textarea',
    value: '123 Business St, City, State 12345',
    category: 'Application'
  },

  // Booking Settings
  {
    key: 'max_booking_days',
    label: 'Maximum Booking Days',
    description: 'Maximum number of days equipment can be booked',
    type: 'number',
    value: 30,
    category: 'Booking',
    validation: { min: 1, max: 365 }
  },
  {
    key: 'advance_booking_days',
    label: 'Advance Booking Days',
    description: 'How many days in advance bookings can be made',
    type: 'number',
    value: 90,
    category: 'Booking',
    validation: { min: 1, max: 365 }
  },
  {
    key: 'require_approval',
    label: 'Require Booking Approval',
    description: 'Whether bookings need admin approval',
    type: 'boolean',
    value: true,
    category: 'Booking'
  },
  {
    key: 'cancellation_policy',
    label: 'Cancellation Policy',
    description: 'Policy for booking cancellations',
    type: 'select',
    value: 'flexible',
    category: 'Booking',
    options: ['flexible', 'moderate', 'strict']
  },

  // Payment Settings
  {
    key: 'currency',
    label: 'Currency',
    description: 'Default currency for pricing',
    type: 'select',
    value: 'USD',
    category: 'Payment',
    options: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  {
    key: 'tax_rate',
    label: 'Tax Rate (%)',
    description: 'Default tax rate percentage',
    type: 'number',
    value: 8.5,
    category: 'Payment',
    validation: { min: 0, max: 50 }
  },
  {
    key: 'security_deposit',
    label: 'Require Security Deposit',
    description: 'Whether to require security deposits',
    type: 'boolean',
    value: true,
    category: 'Payment'
  },

  // Notification Settings
  {
    key: 'email_notifications',
    label: 'Email Notifications',
    description: 'Enable email notifications',
    type: 'boolean',
    value: true,
    category: 'Notifications'
  },
  {
    key: 'booking_reminders',
    label: 'Booking Reminders',
    description: 'Send booking reminder emails',
    type: 'boolean',
    value: true,
    category: 'Notifications'
  },
  {
    key: 'reminder_hours',
    label: 'Reminder Hours Before',
    description: 'Hours before booking to send reminder',
    type: 'number',
    value: 24,
    category: 'Notifications',
    validation: { min: 1, max: 168 }
  },

  // System Settings
  {
    key: 'maintenance_mode',
    label: 'Maintenance Mode',
    description: 'Enable maintenance mode',
    type: 'boolean',
    value: false,
    category: 'System'
  },
  {
    key: 'max_file_size',
    label: 'Max File Size (MB)',
    description: 'Maximum file upload size in megabytes',
    type: 'number',
    value: 10,
    category: 'System',
    validation: { min: 1, max: 100 }
  },
  {
    key: 'session_timeout',
    label: 'Session Timeout (minutes)',
    description: 'User session timeout in minutes',
    type: 'number',
    value: 60,
    category: 'System',
    validation: { min: 5, max: 1440 }
  }
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: [],
      categories: [],

      addSetting: async (settingData) => {
        const newSetting: Setting = {
          ...settingData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          settings: [...state.settings, newSetting],
          categories: [...new Set([...state.categories, newSetting.category])]
        }));
      },

      updateSetting: async (id, updates) => {
        set(state => ({
          settings: state.settings.map(setting =>
            setting.id === id
              ? { ...setting, ...updates, updatedAt: new Date() }
              : setting
          )
        }));
      },

      deleteSetting: async (id) => {
        set(state => ({
          settings: state.settings.filter(setting => setting.id !== id)
        }));
      },

      getSettingsByCategory: (category) => {
        return get().settings.filter(setting => setting.category === category);
      },

      getSettingValue: (key) => {
        const setting = get().settings.find(s => s.key === key);
        return setting?.value;
      },

      updateSettingValue: async (key, value) => {
        set(state => ({
          settings: state.settings.map(setting =>
            setting.key === key
              ? { ...setting, value, updatedAt: new Date() }
              : setting
          )
        }));
      },

      resetToDefaults: async () => {
        const defaultSettingsWithIds: Setting[] = defaultSettings.map(setting => ({
          ...setting,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        const categories = [...new Set(defaultSettingsWithIds.map(s => s.category))];

        set({
          settings: defaultSettingsWithIds,
          categories
        });
      },

      exportSettings: () => {
        return JSON.stringify(get().settings, null, 2);
      },

      importSettings: async (settingsJson) => {
        try {
          const importedSettings = JSON.parse(settingsJson) as Setting[];
          const categories = [...new Set(importedSettings.map(s => s.category))];
          
          set({
            settings: importedSettings.map(setting => ({
              ...setting,
              updatedAt: new Date()
            })),
            categories
          });
        } catch (error) {
          throw new Error('Invalid settings JSON format');
        }
      }
    }),
    {
      name: 'settings-storage',
      onRehydrateStorage: () => (state) => {
        // Initialize with default settings if empty
        if (state && state.settings.length === 0) {
          state.resetToDefaults();
        }
      }
    }
  )
);