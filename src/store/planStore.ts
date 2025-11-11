import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number | 'lifetime'; // dias ou vitalício
  features: string[];
  popular?: boolean;
}

export interface UserPlan {
  activePlans: string[]; // IDs dos bots comprados vitalícios
  subscription: {
    type: '30' | '60' | '90' | null;
    expiresAt: Date | null;
  };
  trialStartedAt: Date;
  trialEnded: boolean;
  lastFreeUse: { [botId: string]: Date };
}

interface PlanStore {
  userPlan: UserPlan;
  plans: Plan[];
  subscriptionPlans: Plan[];
  initializeTrial: () => void;
  canUseBot: (botId: string) => { allowed: boolean; reason?: string };
  purchaseBot: (botId: string) => void;
  purchaseSubscription: (type: '30' | '60' | '90') => void;
  useFreeBot: (botId: string) => void;
}

const TRIAL_DURATION_DAYS = 7;

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      userPlan: {
        activePlans: [],
        subscription: {
          type: null,
          expiresAt: null,
        },
        trialStartedAt: new Date(),
        trialEnded: false,
        lastFreeUse: {},
      },

      plans: [
        {
          id: 'super-bot',
          name: 'Super Bot',
          price: 49.90,
          duration: 'lifetime',
          features: ['Automação completa', 'Suporte prioritário', 'Updates vitalícios'],
        },
        {
          id: 'auto-pay',
          name: 'Auto Pay',
          price: 39.90,
          duration: 'lifetime',
          features: ['Pagamentos automáticos', 'Multi-contas', 'Relatórios'],
        },
        {
          id: 'mass-sender',
          name: 'Mass Sender',
          price: 44.90,
          duration: 'lifetime',
          features: ['Envio em massa', 'Agendamento', 'Analytics'],
        },
      ],

      subscriptionPlans: [
        {
          id: 'sub-30',
          name: 'Plano Mensal',
          price: 99.90,
          duration: 30,
          features: ['Todos os bots liberados', 'Suporte prioritário', 'Updates inclusos'],
        },
        {
          id: 'sub-60',
          name: 'Plano Bimestral',
          price: 179.90,
          duration: 60,
          features: ['Todos os bots liberados', 'Suporte prioritário', 'Updates inclusos', '10% desconto'],
          popular: true,
        },
        {
          id: 'sub-90',
          name: 'Plano Trimestral',
          price: 249.90,
          duration: 90,
          features: ['Todos os bots liberados', 'Suporte prioritário', 'Updates inclusos', '20% desconto'],
        },
      ],

      initializeTrial: () => {
        const state = get();
        if (!state.userPlan.trialStartedAt) {
          set({
            userPlan: {
              ...state.userPlan,
              trialStartedAt: new Date(),
            },
          });
        }
      },

      canUseBot: (botId: string) => {
        const state = get();
        const { userPlan } = state;

        // Verifica se tem o bot comprado vitalício
        if (userPlan.activePlans.includes(botId)) {
          return { allowed: true };
        }

        // Verifica se tem assinatura ativa
        if (userPlan.subscription.type && userPlan.subscription.expiresAt) {
          const now = new Date();
          const expiresAt = new Date(userPlan.subscription.expiresAt);
          if (now < expiresAt) {
            return { allowed: true };
          }
        }

        // Verifica trial
        const trialStart = new Date(userPlan.trialStartedAt);
        const now = new Date();
        const daysSinceTrial = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceTrial < TRIAL_DURATION_DAYS) {
          return { allowed: true, reason: 'trial' };
        }

        // Trial acabou - verifica uso gratuito 24h
        if (userPlan.trialEnded) {
          const lastUse = userPlan.lastFreeUse[botId];
          if (lastUse) {
            const lastUseDate = new Date(lastUse);
            const hoursSinceLastUse = (now.getTime() - lastUseDate.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastUse < 24) {
              return { allowed: false, reason: 'wait-24h' };
            }
          }
          return { allowed: true, reason: 'free-24h' };
        }

        return { allowed: false, reason: 'trial-ended' };
      },

      useFreeBot: (botId: string) => {
        const state = get();
        const trialStart = new Date(state.userPlan.trialStartedAt);
        const now = new Date();
        const daysSinceTrial = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));

        set({
          userPlan: {
            ...state.userPlan,
            trialEnded: daysSinceTrial >= TRIAL_DURATION_DAYS,
            lastFreeUse: {
              ...state.userPlan.lastFreeUse,
              [botId]: now,
            },
          },
        });
      },

      purchaseBot: (botId: string) => {
        const state = get();
        set({
          userPlan: {
            ...state.userPlan,
            activePlans: [...state.userPlan.activePlans, botId],
          },
        });
      },

      purchaseSubscription: (type: '30' | '60' | '90') => {
        const state = get();
        const now = new Date();
        const duration = parseInt(type);
        const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

        set({
          userPlan: {
            ...state.userPlan,
            subscription: {
              type,
              expiresAt,
            },
          },
        });
      },
    }),
    {
      name: 'plan-storage',
    }
  )
);
