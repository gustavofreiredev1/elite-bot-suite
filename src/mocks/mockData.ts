export type ToolType = 'autopost' | 'autopay' | 'sessions' | 'addmembers' | 'tclone' | 'views' | 'superbot' | 'masssender' | 'userscraper' | 'pollbot' | 'messagebackup' | 'inactivecleaner' | 'mediaextractor' | 'accountgen' | 'autoreact' | 'security' | 'massreact';

export interface Bot {
  id: string;
  name: string;
  token: string;
  description: string;
  photo: string;
  status: 'active' | 'inactive';
  createdAt: string;
  messagesCount: number;
  usersCount: number;
  toolType: ToolType;
  stats: {
    messages: number;
    users: number;
  };
}

export interface Stats {
  totalBots: number;
  activeBots: number;
  totalMessages: number;
  totalAutomations: number;
}

export interface ChartData {
  date: string;
  messages: number;
  users: number;
}

export interface CommandData {
  name: string;
  count: number;
}

export const mockBots: Bot[] = [
  {
    id: '1',
    name: 'Atendimento Bot',
    token: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    description: 'Bot de atendimento ao cliente 24/7',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=1',
    status: 'active',
    createdAt: '2025-01-15',
    messagesCount: 1250,
    usersCount: 340,
    toolType: 'superbot',
    stats: {
      messages: 1250,
      users: 340,
    },
  },
  {
    id: '2',
    name: 'Vendas Bot',
    token: '987654321:ZYXwvuTSRqponMLKjihgFEDcba',
    description: 'Bot para automação de vendas e conversões',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
    status: 'active',
    createdAt: '2025-02-01',
    messagesCount: 890,
    usersCount: 210,
    toolType: 'autopay',
    stats: {
      messages: 890,
      users: 210,
    },
  },
  {
    id: '3',
    name: 'Suporte Técnico',
    token: '456789123:XYZabcDEFghiJKLmnoPQRstuvw',
    description: 'Bot especializado em suporte técnico',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=3',
    status: 'inactive',
    createdAt: '2025-01-20',
    messagesCount: 450,
    usersCount: 120,
    toolType: 'autopost',
    stats: {
      messages: 450,
      users: 120,
    },
  },
];

export const mockStats: Stats = {
  totalBots: 3,
  activeBots: 2,
  totalMessages: 2590,
  totalAutomations: 12,
};

export const mockChartData: ChartData[] = [
  { date: '2025-10-09', messages: 120, users: 45 },
  { date: '2025-10-10', messages: 180, users: 67 },
  { date: '2025-10-11', messages: 150, users: 52 },
  { date: '2025-10-12', messages: 220, users: 89 },
  { date: '2025-10-13', messages: 190, users: 71 },
  { date: '2025-10-14', messages: 250, users: 95 },
  { date: '2025-10-15', messages: 280, users: 102 },
];

export const mockCommandData: CommandData[] = [
  { name: '/start', count: 450 },
  { name: '/help', count: 320 },
  { name: '/info', count: 280 },
  { name: '/status', count: 190 },
  { name: '/outros', count: 150 },
];
