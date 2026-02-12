export type ToolType =
  | 'vendas-auto'
  | 'checkout-pro'
  | 'area-vip'
  | 'disparo'
  | 'leads'
  | 'funis'
  | 'atendimento'
  | 'entrega'
  | 'agendador'
  | 'pix'
  | 'crm'
  | 'relatorios'
  | 'afiliados'
  | 'upsell'
  | 'recuperacao'
  | 'notificacoes'
  | 'extrator';

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

export const toolNames: Record<ToolType, string> = {
  'vendas-auto': 'Vendas Automáticas',
  'checkout-pro': 'Checkout Pro',
  'area-vip': 'Área VIP',
  'disparo': 'Disparo em Massa',
  'leads': 'Captura de Leads',
  'funis': 'Funis Inteligentes',
  'atendimento': 'Atendimento Auto',
  'entrega': 'Entrega Digital',
  'agendador': 'Agendador',
  'pix': 'Pagamentos PIX',
  'crm': 'CRM Telegram',
  'relatorios': 'Relatórios Pro',
  'afiliados': 'Afiliados',
  'upsell': 'Upsell & Ofertas',
  'recuperacao': 'Recuperação de Vendas',
  'notificacoes': 'Notificações',
  'extrator': 'Extrator de Contatos',
};

export const toolDescriptions: Record<ToolType, string> = {
  'vendas-auto': 'Funil completo + checkout + entrega automática',
  'checkout-pro': 'Páginas de vendas estilo Kiwify/Cakto',
  'area-vip': 'Controle de membros e pagantes',
  'disparo': 'Broadcast ilimitado para listas',
  'leads': 'Coleta automática de contatos',
  'funis': 'Fluxos visuais estilo ManyChat',
  'atendimento': 'Respostas automáticas + IA',
  'entrega': 'Envio de arquivos, links e cursos',
  'agendador': 'Mensagens programadas por data/hora',
  'pix': 'Cobranças PIX direto no chat',
  'crm': 'Tags, listas e histórico de clientes',
  'relatorios': 'Analytics e métricas completas',
  'afiliados': 'Links, comissões e rastreamento',
  'upsell': 'Order bump, upsell e downsell',
  'recuperacao': 'Lembretes de carrinho abandonado',
  'notificacoes': 'Alertas automáticos por evento',
  'extrator': 'Exportar IDs, usuários e grupos',
};

export const mockBots: Bot[] = [
  {
    id: '1',
    name: 'Vendas Automáticas',
    token: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    description: 'Funil completo + checkout + entrega automática',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=vendas',
    status: 'active',
    createdAt: '2025-01-15',
    messagesCount: 1250,
    usersCount: 340,
    toolType: 'vendas-auto',
    stats: { messages: 1250, users: 340 },
  },
  {
    id: '2',
    name: 'Checkout Pro',
    token: '987654321:ZYXwvuTSRqponMLKjihgFEDcba',
    description: 'Páginas de vendas estilo Kiwify/Cakto',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=checkout',
    status: 'active',
    createdAt: '2025-02-01',
    messagesCount: 890,
    usersCount: 210,
    toolType: 'checkout-pro',
    stats: { messages: 890, users: 210 },
  },
  {
    id: '3',
    name: 'Área VIP',
    token: '456789123:XYZabcDEFghiJKLmnoPQRstuvw',
    description: 'Controle de membros e pagantes',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=vip',
    status: 'active',
    createdAt: '2025-01-20',
    messagesCount: 2340,
    usersCount: 580,
    toolType: 'area-vip',
    stats: { messages: 2340, users: 580 },
  },
  {
    id: '4',
    name: 'Disparo em Massa',
    token: '111222333:AAAbbbCCCdddEEEfff',
    description: 'Broadcast ilimitado para listas',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=disparo',
    status: 'active',
    createdAt: '2025-02-05',
    messagesCount: 5670,
    usersCount: 1240,
    toolType: 'disparo',
    stats: { messages: 5670, users: 1240 },
  },
  {
    id: '5',
    name: 'Captura de Leads',
    token: '444555666:GGGhhhIIIjjjKKKlll',
    description: 'Coleta automática de contatos',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=leads',
    status: 'active',
    createdAt: '2025-02-10',
    messagesCount: 1890,
    usersCount: 420,
    toolType: 'leads',
    stats: { messages: 1890, users: 420 },
  },
  {
    id: '6',
    name: 'Funis Inteligentes',
    token: '777888999:MMMnnnOOOpppQQQrrr',
    description: 'Fluxos visuais estilo ManyChat',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=funis',
    status: 'active',
    createdAt: '2025-02-12',
    messagesCount: 560,
    usersCount: 98,
    toolType: 'funis',
    stats: { messages: 560, users: 98 },
  },
  {
    id: '7',
    name: 'Atendimento Auto',
    token: '101112131:SSSsttTTTuuuVVVwww',
    description: 'Respostas automáticas + IA',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=atendimento',
    status: 'active',
    createdAt: '2025-02-14',
    messagesCount: 3450,
    usersCount: 780,
    toolType: 'atendimento',
    stats: { messages: 3450, users: 780 },
  },
  {
    id: '8',
    name: 'Entrega Digital',
    token: '141516171:XXXyyyZZZaaaAAABBB',
    description: 'Envio de arquivos, links e cursos',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=entrega',
    status: 'active',
    createdAt: '2025-02-18',
    messagesCount: 670,
    usersCount: 145,
    toolType: 'entrega',
    stats: { messages: 670, users: 145 },
  },
  {
    id: '9',
    name: 'Agendador',
    token: '181920212:CCCdddEEEfffGGGhhh',
    description: 'Mensagens programadas por data/hora',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=agendador',
    status: 'active',
    createdAt: '2025-02-20',
    messagesCount: 890,
    usersCount: 234,
    toolType: 'agendador',
    stats: { messages: 890, users: 234 },
  },
  {
    id: '10',
    name: 'Pagamentos PIX',
    token: '222324252:IIIjjjKKKlllMMMnnn',
    description: 'Cobranças PIX direto no chat',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=pix',
    status: 'active',
    createdAt: '2025-02-22',
    messagesCount: 1230,
    usersCount: 340,
    toolType: 'pix',
    stats: { messages: 1230, users: 340 },
  },
  {
    id: '11',
    name: 'CRM Telegram',
    token: '262728293:OOOpppQQQrrrSSSstt',
    description: 'Tags, listas e histórico de clientes',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=crm',
    status: 'active',
    createdAt: '2025-02-25',
    messagesCount: 4560,
    usersCount: 680,
    toolType: 'crm',
    stats: { messages: 4560, users: 680 },
  },
  {
    id: '12',
    name: 'Relatórios Pro',
    token: '303132333:UUUvvvWWWxxxYYYzzz',
    description: 'Analytics e métricas completas',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=relatorios',
    status: 'active',
    createdAt: '2025-02-28',
    messagesCount: 780,
    usersCount: 156,
    toolType: 'relatorios',
    stats: { messages: 780, users: 156 },
  },
  {
    id: '13',
    name: 'Afiliados',
    token: '343536373:AAAbbbCCCdddEEEfff',
    description: 'Links, comissões e rastreamento',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=afiliados',
    status: 'active',
    createdAt: '2025-03-01',
    messagesCount: 2340,
    usersCount: 467,
    toolType: 'afiliados',
    stats: { messages: 2340, users: 467 },
  },
  {
    id: '14',
    name: 'Upsell & Ofertas',
    token: '383940414:GGGhhhIIIjjjKKKlll',
    description: 'Order bump, upsell e downsell',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=upsell',
    status: 'active',
    createdAt: '2025-03-03',
    messagesCount: 120,
    usersCount: 34,
    toolType: 'upsell',
    stats: { messages: 120, users: 34 },
  },
  {
    id: '15',
    name: 'Recuperação de Vendas',
    token: '424344454:MMMnnnOOOpppQQQrrr',
    description: 'Lembretes de carrinho abandonado',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=recuperacao',
    status: 'active',
    createdAt: '2025-03-05',
    messagesCount: 3450,
    usersCount: 890,
    toolType: 'recuperacao',
    stats: { messages: 3450, users: 890 },
  },
  {
    id: '16',
    name: 'Notificações',
    token: '464748495:SSSsttTTTuuuVVVwww',
    description: 'Alertas automáticos por evento',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=notificacoes',
    status: 'active',
    createdAt: '2025-03-08',
    messagesCount: 6780,
    usersCount: 1450,
    toolType: 'notificacoes',
    stats: { messages: 6780, users: 1450 },
  },
  {
    id: '17',
    name: 'Extrator de Contatos',
    token: '505152535:XXXyyyZZZaaaAAABBB',
    description: 'Exportar IDs, usuários e grupos',
    photo: 'https://api.dicebear.com/7.x/bottts/svg?seed=extrator',
    status: 'active',
    createdAt: '2025-03-10',
    messagesCount: 4560,
    usersCount: 980,
    toolType: 'extrator',
    stats: { messages: 4560, users: 980 },
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
