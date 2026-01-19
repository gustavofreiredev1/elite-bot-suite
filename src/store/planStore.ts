import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolType } from '@/mocks/mockData';

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number | 'lifetime';
  features: string[];
  popular?: boolean;
  category: 'automation' | 'growth' | 'security' | 'content';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: 30 | 60 | 90;
  features: string[];
  popular?: boolean;
  discount?: number;
}

export interface UserPlan {
  activePlans: string[];
  subscription: {
    type: '30' | '60' | '90' | null;
    expiresAt: Date | null;
    startedAt: Date | null;
  };
  trialStartedAt: Date;
  trialEnded: boolean;
  lastFreeUse: { [botId: string]: Date };
}

interface PlanStore {
  userPlan: UserPlan;
  plans: Plan[];
  subscriptionPlans: SubscriptionPlan[];
  initializeTrial: () => void;
  canUseBot: (botId: string) => { allowed: boolean; reason?: string };
  purchaseBot: (botId: string) => void;
  purchaseSubscription: (type: '30' | '60' | '90') => void;
  useFreeBot: (botId: string) => void;
  getTrialDaysRemaining: () => number;
  getSubscriptionDaysRemaining: () => number;
  hasActiveSubscription: () => boolean;
  isTrialActive: () => boolean;
  getTotalBotsPurchased: () => number;
}

const TRIAL_DURATION_DAYS = 7;

// Todos os 17 bots como planos individuais
const BOT_PLANS: Plan[] = [
  {
    id: 'superbot',
    name: 'Super Bot Elite',
    price: 79.90,
    duration: 'lifetime',
    features: ['IA avançada 24/7', 'Respostas inteligentes', 'Múltiplos comandos', 'Suporte prioritário'],
    category: 'automation',
  },
  {
    id: 'autopay',
    name: 'Auto Pay Bot',
    price: 89.90,
    duration: 'lifetime',
    features: ['Automação de vendas', 'Múltiplos gateways', 'Tracking de clientes', 'Relatórios financeiros'],
    category: 'automation',
    popular: true,
  },
  {
    id: 'autopost',
    name: 'Auto Poster',
    price: 59.90,
    duration: 'lifetime',
    features: ['Agendamento ilimitado', 'Suporte a mídias', 'Posts recorrentes', 'Analytics de posts'],
    category: 'content',
  },
  {
    id: 'sessions',
    name: 'Session Manager',
    price: 69.90,
    duration: 'lifetime',
    features: ['Multi-sessão', 'Backup .session', 'Criptografia', 'Gestão centralizada'],
    category: 'security',
  },
  {
    id: 'addmembers',
    name: 'Add Members Pro',
    price: 74.90,
    duration: 'lifetime',
    features: ['Importação em massa', 'Filtros avançados', 'Logs detalhados', 'Anti-ban integrado'],
    category: 'growth',
  },
  {
    id: 'tclone',
    name: 'T-Clone Master',
    price: 99.90,
    duration: 'lifetime',
    features: ['Clone completo', 'Preserva estrutura', 'Transfere membros', 'Backup automático'],
    category: 'content',
  },
  {
    id: 'views',
    name: 'Views Tracker',
    price: 49.90,
    duration: 'lifetime',
    features: ['Monitoramento real-time', 'Analytics avançados', 'Relatórios exportáveis', 'Alertas'],
    category: 'growth',
  },
  {
    id: 'masssender',
    name: 'Mass Sender Pro',
    price: 84.90,
    duration: 'lifetime',
    features: ['Envio ilimitado', 'CSV/JSON', 'Anti-ban delays', 'Templates salvos'],
    category: 'growth',
    popular: true,
  },
  {
    id: 'userscraper',
    name: 'User Scraper',
    price: 64.90,
    duration: 'lifetime',
    features: ['Extração completa', 'Exportação CSV/JSON', 'Filtros online/offline', 'Logs de extração'],
    category: 'growth',
  },
  {
    id: 'pollbot',
    name: 'Poll Master Bot',
    price: 44.90,
    duration: 'lifetime',
    features: ['Enquetes ilimitadas', 'Anônimo/público', 'Resultados real-time', 'Templates'],
    category: 'content',
  },
  {
    id: 'messagebackup',
    name: 'Message Backup',
    price: 54.90,
    duration: 'lifetime',
    features: ['Backup mensagens', 'Salva mídias', 'Filtros avançados', 'Restauração'],
    category: 'security',
  },
  {
    id: 'inactivecleaner',
    name: 'Inactive Cleaner',
    price: 39.90,
    duration: 'lifetime',
    features: ['Detecção automática', 'Remoção segura', 'Logs de ações', 'Configurável'],
    category: 'security',
  },
  {
    id: 'mediaextractor',
    name: 'Media Extractor',
    price: 49.90,
    duration: 'lifetime',
    features: ['Extrai links/mídias', 'Organização auto', 'Relatórios', 'Filtros por tipo'],
    category: 'content',
  },
  {
    id: 'accountgen',
    name: 'Account Generator',
    price: 149.90,
    duration: 'lifetime',
    features: ['Criação automática', 'Arquivos .session', 'SMS automático', 'Validação'],
    category: 'automation',
  },
  {
    id: 'autoreact',
    name: 'Auto React Bot',
    price: 34.90,
    duration: 'lifetime',
    features: ['Reações auto', 'Emojis custom', 'Filtros', 'Logs de reações'],
    category: 'automation',
  },
  {
    id: 'security',
    name: 'Security Guard Bot',
    price: 69.90,
    duration: 'lifetime',
    features: ['Anti-link', 'Anti-spam', 'Warns system', 'Bans automáticos'],
    category: 'security',
    popular: true,
  },
  {
    id: 'massreact',
    name: 'Mass React Pro',
    price: 59.90,
    duration: 'lifetime',
    features: ['Reações em massa', 'Multi-conta', 'Anti-ban', 'Configurável'],
    category: 'growth',
  },
];

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-30',
    name: 'Mensal',
    price: 149.90,
    duration: 30,
    features: [
      'Todos os 17 bots liberados',
      'Suporte prioritário 24/7',
      'Updates e novidades inclusos',
      'Sem limites de uso',
    ],
  },
  {
    id: 'sub-60',
    name: 'Bimestral',
    price: 249.90,
    originalPrice: 299.80,
    duration: 60,
    discount: 17,
    features: [
      'Todos os 17 bots liberados',
      'Suporte prioritário 24/7',
      'Updates e novidades inclusos',
      'Sem limites de uso',
      '17% de economia',
    ],
    popular: true,
  },
  {
    id: 'sub-90',
    name: 'Trimestral',
    price: 349.90,
    originalPrice: 449.70,
    duration: 90,
    discount: 22,
    features: [
      'Todos os 17 bots liberados',
      'Suporte prioritário 24/7',
      'Updates e novidades inclusos',
      'Sem limites de uso',
      '22% de economia',
      'Bônus: Consultoria setup',
    ],
  },
];

export const usePlanStore = create<PlanStore>()(
  persist(
    (set, get) => ({
      userPlan: {
        activePlans: [],
        subscription: {
          type: null,
          expiresAt: null,
          startedAt: null,
        },
        trialStartedAt: new Date(),
        trialEnded: false,
        lastFreeUse: {},
      },

      plans: BOT_PLANS,
      subscriptionPlans: SUBSCRIPTION_PLANS,

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

      getTrialDaysRemaining: () => {
        const state = get();
        const trialStart = new Date(state.userPlan.trialStartedAt);
        const now = new Date();
        const daysSinceTrial = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, TRIAL_DURATION_DAYS - daysSinceTrial);
      },

      getSubscriptionDaysRemaining: () => {
        const state = get();
        if (!state.userPlan.subscription.expiresAt) return 0;
        const expiresAt = new Date(state.userPlan.subscription.expiresAt);
        const now = new Date();
        const daysRemaining = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, daysRemaining);
      },

      hasActiveSubscription: () => {
        const state = get();
        if (!state.userPlan.subscription.type || !state.userPlan.subscription.expiresAt) return false;
        const now = new Date();
        const expiresAt = new Date(state.userPlan.subscription.expiresAt);
        return now < expiresAt;
      },

      isTrialActive: () => {
        const state = get();
        return get().getTrialDaysRemaining() > 0 && !state.userPlan.trialEnded;
      },

      getTotalBotsPurchased: () => {
        return get().userPlan.activePlans.length;
      },

      canUseBot: (botId: string) => {
        const state = get();
        const { userPlan } = state;

        // Verifica se tem o bot comprado vitalício
        if (userPlan.activePlans.includes(botId)) {
          return { allowed: true, reason: 'purchased' };
        }

        // Verifica se tem assinatura ativa
        if (get().hasActiveSubscription()) {
          return { allowed: true, reason: 'subscription' };
        }

        // Verifica trial
        const trialDaysRemaining = get().getTrialDaysRemaining();
        if (trialDaysRemaining > 0 && !userPlan.trialEnded) {
          return { allowed: true, reason: 'trial' };
        }

        // Trial acabou - verifica uso gratuito 24h
        const lastUse = userPlan.lastFreeUse[botId];
        if (lastUse) {
          const lastUseDate = new Date(lastUse);
          const now = new Date();
          const hoursSinceLastUse = (now.getTime() - lastUseDate.getTime()) / (1000 * 60 * 60);
          if (hoursSinceLastUse < 24) {
            return { allowed: false, reason: 'wait-24h' };
          }
        }
        return { allowed: true, reason: 'free-24h' };
      },

      useFreeBot: (botId: string) => {
        const state = get();
        const now = new Date();
        const trialDaysRemaining = get().getTrialDaysRemaining();

        set({
          userPlan: {
            ...state.userPlan,
            trialEnded: trialDaysRemaining <= 0,
            lastFreeUse: {
              ...state.userPlan.lastFreeUse,
              [botId]: now,
            },
          },
        });
      },

      purchaseBot: (botId: string) => {
        const state = get();
        if (!state.userPlan.activePlans.includes(botId)) {
          set({
            userPlan: {
              ...state.userPlan,
              activePlans: [...state.userPlan.activePlans, botId],
            },
          });
        }
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
              startedAt: now,
            },
            trialEnded: true,
          },
        });
      },
    }),
    {
      name: 'elite-bot-plan-storage',
    }
  )
);

// Helper para mapear toolType para plan id
export const toolTypeToPlanId = (toolType: ToolType): string => {
  return toolType;
};

export const getPlanById = (planId: string): Plan | undefined => {
  return BOT_PLANS.find(p => p.id === planId);
};

export const getPlansByCategory = (category: Plan['category']): Plan[] => {
  return BOT_PLANS.filter(p => p.category === category);
};
