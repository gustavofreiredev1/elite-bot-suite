import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TelegramConfig {
  apiId: string;
  apiHash: string;
  phoneNumber: string;
  sessionName: string;
  isConfigured: boolean;
  configuredAt?: string;
}

export type TelegramConfigInput = Omit<TelegramConfig, 'isConfigured' | 'configuredAt'>;

interface TelegramConfigStore {
  config: TelegramConfig | null;
  setConfig: (config: TelegramConfigInput) => void;
  clearConfig: () => void;
  isConfigured: () => boolean;
}

export const useTelegramConfigStore = create<TelegramConfigStore>()(
  persist(
    (set, get) => ({
      config: null,
      setConfig: (config) => set({ 
        config: { 
          ...config, 
          isConfigured: true,
          configuredAt: new Date().toISOString()
        } 
      }),
      clearConfig: () => set({ config: null }),
      isConfigured: () => get().config?.isConfigured ?? false,
    }),
    {
      name: 'telegram-config-storage',
    }
  )
);
