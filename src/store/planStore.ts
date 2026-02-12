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
    id: 'vendas-auto',
    name: 'Vendas Automáticas',
    price: 89.90,
    duration: 'lifetime',
    features: ['Funil completo', 'Checkout integrado', 'Entrega automática', 'Relatórios de vendas'],
    category: 'automation',
    popular: true,
  },
  {
    id: 'checkout-pro',
    name: 'Checkout Pro',
    price: 79.90,
    duration: 'lifetime',
    features: ['Páginas de venda', 'PIX QR Code', 'Métricas de conversão', 'Templates prontos'],
    category: 'automation',
  },
  {
    id: 'area-vip',
    name: 'Área VIP',
    price: 74.90,
    duration: 'lifetime',
    features: ['Controle de acesso', 'Membros pagantes', 'Expiração automática', 'Logs de acesso'],
    category: 'growth',
  },
  {
    id: 'disparo',
    name: 'Disparo em Massa',
    price: 84.90,
    duration: 'lifetime',
    features: ['Broadcast ilimitado', 'Anti-ban inteligente', 'Relatórios real-time', 'CSV/JSON'],
    category: 'growth',
    popular: true,
  },
  {
    id: 'leads',
    name: 'Captura de Leads',
    price: 64.90,
    duration: 'lifetime',
    features: ['Captura automática', 'Exportação CSV/Excel', 'Segmentação por tags', 'Multi-origem'],
    category: 'growth',
  },
  {
    id: 'funis',
    name: 'Funis Inteligentes',
    price: 99.90,
    duration: 'lifetime',
    features: ['Editor visual', 'Condições e delays', 'Multi-mídia', 'Publicação 1 clique'],
    category: 'automation',
  },
  {
    id: 'atendimento',
    name: 'Atendimento Auto',
    price: 79.90,
    duration: 'lifetime',
    features: ['IA avançada', 'Chat 24/7', 'Transferência humano', 'Respostas automáticas'],
    category: 'automation',
  },
  {
    id: 'entrega',
    name: 'Entrega Digital',
    price: 54.90,
    duration: 'lifetime',
    features: ['Arquivos e links', 'Links com expiração', 'Anti-pirataria', 'Entrega automática'],
    category: 'content',
  },
  {
    id: 'agendador',
    name: 'Agendador',
    price: 49.90,
    duration: 'lifetime',
    features: ['Agendamento ilimitado', 'Fuso horário', 'Templates', 'Recorrência'],
    category: 'content',
  },
  {
    id: 'pix',
    name: 'Pagamentos PIX',
    price: 69.90,
    duration: 'lifetime',
    features: ['QR Code PIX', 'Confirmação real-time', 'Copia e cola', 'Integração chat'],
    category: 'automation',
  },
  {
    id: 'crm',
    name: 'CRM Telegram',
    price: 59.90,
    duration: 'lifetime',
    features: ['Tags e listas', 'Histórico completo', 'Segmentação', 'Exportação'],
    category: 'growth',
  },
  {
    id: 'relatorios',
    name: 'Relatórios Pro',
    price: 49.90,
    duration: 'lifetime',
    features: ['Dashboard real-time', 'Crescimento diário', 'Exportar PDF/Excel', 'Métricas avançadas'],
    category: 'content',
  },
  {
    id: 'afiliados',
    name: 'Afiliados',
    price: 79.90,
    duration: 'lifetime',
    features: ['Links únicos', 'Comissões configuráveis', 'Rastreamento completo', 'Pagamento automático'],
    category: 'growth',
  },
  {
    id: 'upsell',
    name: 'Upsell & Ofertas',
    price: 69.90,
    duration: 'lifetime',
    features: ['Order bump', 'Upsell pós-compra', 'Downsell alternativo', 'Aumento de ticket'],
    category: 'automation',
  },
  {
    id: 'recuperacao',
    name: 'Recuperação de Vendas',
    price: 59.90,
    duration: 'lifetime',
    features: ['Carrinho abandonado', 'Sequência de lembretes', 'Cupom automático', 'Métricas'],
    category: 'automation',
  },
  {
    id: 'notificacoes',
    name: 'Notificações',
    price: 34.90,
    duration: 'lifetime',
    features: ['Alertas por evento', 'Multi-canal', 'Triggers configuráveis', 'Histórico'],
    category: 'security',
  },
  {
    id: 'extrator',
    name: 'Extrator de Contatos',
    price: 64.90,
    duration: 'lifetime',
    features: ['Exportar IDs', 'Membros de grupos', 'CSV/Excel', 'Filtros avançados'],
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
