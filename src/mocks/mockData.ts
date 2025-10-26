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
    name: 'Super Bot Elite',
    token: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    description: 'Bot de atendimento inteligente com IA avançada 24/7',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=superbot',
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
    name: 'Auto Pay Bot',
    token: '987654321:ZYXwvuTSRqponMLKjihgFEDcba',
    description: 'Automação de vendas e pagamentos no Telegram',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=autopay',
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
    name: 'Auto Poster',
    token: '456789123:XYZabcDEFghiJKLmnoPQRstuvw',
    description: 'Agendamento automático de postagens em canais',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=autopost',
    status: 'active',
    createdAt: '2025-01-20',
    messagesCount: 2340,
    usersCount: 580,
    toolType: 'autopost',
    stats: {
      messages: 2340,
      users: 580,
    },
  },
  {
    id: '4',
    name: 'Session Manager',
    token: '111222333:AAAbbbCCCdddEEEfff',
    description: 'Gerenciamento completo de múltiplas sessões Telegram',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=sessions',
    status: 'active',
    createdAt: '2025-02-05',
    messagesCount: 670,
    usersCount: 145,
    toolType: 'sessions',
    stats: {
      messages: 670,
      users: 145,
    },
  },
  {
    id: '5',
    name: 'Add Members Pro',
    token: '444555666:GGGhhhIIIjjjKKKlll',
    description: 'Adicione membros em massa aos seus grupos',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=addmembers',
    status: 'active',
    createdAt: '2025-02-10',
    messagesCount: 1890,
    usersCount: 420,
    toolType: 'addmembers',
    stats: {
      messages: 1890,
      users: 420,
    },
  },
  {
    id: '6',
    name: 'T-Clone Master',
    token: '777888999:MMMnnnOOOpppQQQrrr',
    description: 'Clone grupos e canais completos com facilidade',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=tclone',
    status: 'active',
    createdAt: '2025-02-12',
    messagesCount: 560,
    usersCount: 98,
    toolType: 'tclone',
    stats: {
      messages: 560,
      users: 98,
    },
  },
  {
    id: '7',
    name: 'Views Tracker',
    token: '101112131:SSSsttTTTuuuVVVwww',
    description: 'Rastreamento avançado de visualizações em tempo real',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=views',
    status: 'active',
    createdAt: '2025-02-14',
    messagesCount: 3450,
    usersCount: 780,
    toolType: 'views',
    stats: {
      messages: 3450,
      users: 780,
    },
  },
  {
    id: '8',
    name: 'Mass Sender Pro',
    token: '141516171:XXXyyyZZZaaaAAABBB',
    description: 'Envio em massa de mensagens e campanhas',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=masssender',
    status: 'active',
    createdAt: '2025-02-18',
    messagesCount: 5670,
    usersCount: 1240,
    toolType: 'masssender',
    stats: {
      messages: 5670,
      users: 1240,
    },
  },
  {
    id: '9',
    name: 'User Scraper',
    token: '181920212:CCCdddEEEfffGGGhhh',
    description: 'Extração completa de membros de grupos e canais',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=userscraper',
    status: 'active',
    createdAt: '2025-02-20',
    messagesCount: 890,
    usersCount: 234,
    toolType: 'userscraper',
    stats: {
      messages: 890,
      users: 234,
    },
  },
  {
    id: '10',
    name: 'Poll Master Bot',
    token: '222324252:IIIjjjKKKlllMMMnnn',
    description: 'Criação e gestão de enquetes automáticas',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=pollbot',
    status: 'active',
    createdAt: '2025-02-22',
    messagesCount: 1230,
    usersCount: 340,
    toolType: 'pollbot',
    stats: {
      messages: 1230,
      users: 340,
    },
  },
  {
    id: '11',
    name: 'Message Backup',
    token: '262728293:OOOpppQQQrrrSSSstt',
    description: 'Backup completo de mensagens e histórico',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=messagebackup',
    status: 'active',
    createdAt: '2025-02-25',
    messagesCount: 4560,
    usersCount: 680,
    toolType: 'messagebackup',
    stats: {
      messages: 4560,
      users: 680,
    },
  },
  {
    id: '12',
    name: 'Inactive Cleaner',
    token: '303132333:UUUvvvWWWxxxYYYzzz',
    description: 'Detector e limpador de membros inativos',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=inactivecleaner',
    status: 'active',
    createdAt: '2025-02-28',
    messagesCount: 780,
    usersCount: 156,
    toolType: 'inactivecleaner',
    stats: {
      messages: 780,
      users: 156,
    },
  },
  {
    id: '13',
    name: 'Media Extractor',
    token: '343536373:AAAbbbCCCdddEEEfff',
    description: 'Extração automática de links e mídias',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=mediaextractor',
    status: 'active',
    createdAt: '2025-03-01',
    messagesCount: 2340,
    usersCount: 467,
    toolType: 'mediaextractor',
    stats: {
      messages: 2340,
      users: 467,
    },
  },
  {
    id: '14',
    name: 'Account Generator',
    token: '383940414:GGGhhhIIIjjjKKKlll',
    description: 'Gerador automático de contas Telegram',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=accountgen',
    status: 'inactive',
    createdAt: '2025-03-03',
    messagesCount: 120,
    usersCount: 34,
    toolType: 'accountgen',
    stats: {
      messages: 120,
      users: 34,
    },
  },
  {
    id: '15',
    name: 'Auto React Bot',
    token: '424344454:MMMnnnOOOpppQQQrrr',
    description: 'Reações automáticas com emojis personalizados',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=autoreact',
    status: 'active',
    createdAt: '2025-03-05',
    messagesCount: 3450,
    usersCount: 890,
    toolType: 'autoreact',
    stats: {
      messages: 3450,
      users: 890,
    },
  },
  {
    id: '16',
    name: 'Security Guard Bot',
    token: '464748495:SSSsttTTTuuuVVVwww',
    description: 'Sistema anti-link e anti-spam avançado',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=security',
    status: 'active',
    createdAt: '2025-03-08',
    messagesCount: 6780,
    usersCount: 1450,
    toolType: 'security',
    stats: {
      messages: 6780,
      users: 1450,
    },
  },
  {
    id: '17',
    name: 'Mass React Pro',
    token: '505152535:XXXyyyZZZaaaAAABBB',
    description: 'Reações em massa com múltiplas contas',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=massreact',
    status: 'active',
    createdAt: '2025-03-10',
    messagesCount: 4560,
    usersCount: 980,
    toolType: 'massreact',
    stats: {
      messages: 4560,
      users: 980,
    },
  },
];

export const mockStats: Stats = {
  totalBots: 17,
  activeBots: 16,
  totalMessages: 42380,
  totalAutomations: 156,
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
