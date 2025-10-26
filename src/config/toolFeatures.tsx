import { 
  MessageSquare, 
  CreditCard, 
  Key, 
  UserPlus, 
  Copy, 
  Eye, 
  Zap, 
  Send, 
  Users, 
  BarChart3, 
  Database, 
  UserMinus, 
  Download, 
  UserCog, 
  Smile, 
  Shield, 
  Heart,
  LucideIcon 
} from 'lucide-react';
import { ToolType } from '@/mocks/mockData';

export interface ToolFeature {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const toolFeatures: Record<ToolType, ToolFeature[]> = {
  autopost: [
    { icon: MessageSquare, label: 'Agendamento', description: 'Agende posts por data/hora' },
    { icon: Download, label: 'Mídias', description: 'Suporte a fotos e vídeos' },
    { icon: BarChart3, label: 'Recorrência', description: 'Posts diários/semanais' },
  ],
  autopay: [
    { icon: CreditCard, label: 'Pagamentos', description: 'Automação de vendas' },
    { icon: Users, label: 'Conversões', description: 'Tracking de clientes' },
    { icon: BarChart3, label: 'Relatórios', description: 'Análise de vendas' },
  ],
  sessions: [
    { icon: Key, label: 'Multi-sessão', description: 'Gerencie várias contas' },
    { icon: Database, label: 'Backup', description: 'Salve sessões em .session' },
    { icon: Shield, label: 'Segurança', description: 'Criptografia de dados' },
  ],
  addmembers: [
    { icon: UserPlus, label: 'Importação', description: 'Adicione membros em massa' },
    { icon: Users, label: 'Filtros', description: 'Selecione usuários ativos' },
    { icon: BarChart3, label: 'Logs', description: 'Acompanhe adições' },
  ],
  tclone: [
    { icon: Copy, label: 'Clonagem', description: 'Clone grupos/canais' },
    { icon: Database, label: 'Backup', description: 'Preserve estrutura' },
    { icon: Users, label: 'Membros', description: 'Transfira usuários' },
  ],
  views: [
    { icon: Eye, label: 'Rastreamento', description: 'Monitore visualizações' },
    { icon: BarChart3, label: 'Analytics', description: 'Relatórios detalhados' },
    { icon: Zap, label: 'Real-time', description: 'Dados ao vivo' },
  ],
  superbot: [
    { icon: Zap, label: 'IA Avançada', description: 'Respostas inteligentes' },
    { icon: MessageSquare, label: 'Chat 24/7', description: 'Atendimento contínuo' },
    { icon: BarChart3, label: 'Comandos', description: 'Múltiplos comandos' },
  ],
  masssender: [
    { icon: Send, label: 'Envio Massa', description: 'Centenas de mensagens' },
    { icon: Database, label: 'Listas', description: 'CSV/JSON suportado' },
    { icon: Shield, label: 'Anti-ban', description: 'Delays automáticos' },
  ],
  userscraper: [
    { icon: Users, label: 'Extração', description: 'IDs e usernames' },
    { icon: Download, label: 'Exportação', description: 'CSV/JSON' },
    { icon: BarChart3, label: 'Filtros', description: 'Online/offline' },
  ],
  pollbot: [
    { icon: BarChart3, label: 'Enquetes', description: 'Crie votações' },
    { icon: Users, label: 'Participação', description: 'Anônima ou pública' },
    { icon: MessageSquare, label: 'Resultados', description: 'Tempo real' },
  ],
  messagebackup: [
    { icon: Database, label: 'Backup', description: 'Extraia mensagens' },
    { icon: Download, label: 'Mídias', description: 'Salve arquivos' },
    { icon: BarChart3, label: 'Filtros', description: 'Por data/usuário' },
  ],
  inactivecleaner: [
    { icon: UserMinus, label: 'Detecção', description: 'Identifique inativos' },
    { icon: Shield, label: 'Remoção', description: 'Limpeza automática' },
    { icon: BarChart3, label: 'Relatórios', description: 'Logs de ações' },
  ],
  mediaextractor: [
    { icon: Download, label: 'Extração', description: 'Links e mídias' },
    { icon: Database, label: 'Organização', description: 'Por pastas/datas' },
    { icon: BarChart3, label: 'Relatórios', description: 'Lista completa' },
  ],
  accountgen: [
    { icon: UserCog, label: 'Criação', description: 'Contas automáticas' },
    { icon: Key, label: 'Sessões', description: 'Arquivos .session' },
    { icon: Shield, label: 'Validação', description: 'SMS automático' },
  ],
  autoreact: [
    { icon: Smile, label: 'Reações Auto', description: 'Emojis personalizados' },
    { icon: MessageSquare, label: 'Filtros', description: 'Por autor/palavra' },
    { icon: BarChart3, label: 'Logs', description: 'Reações aplicadas' },
  ],
  security: [
    { icon: Shield, label: 'Anti-link', description: 'Bloqueie links' },
    { icon: UserMinus, label: 'Anti-spam', description: 'Remova spam' },
    { icon: BarChart3, label: 'Warns', description: 'Sistema de avisos' },
  ],
  massreact: [
    { icon: Heart, label: 'Reações Massa', description: 'Centenas de reações' },
    { icon: Users, label: 'Multi-conta', description: 'Várias sessões' },
    { icon: Shield, label: 'Anti-ban', description: 'Delays seguros' },
  ],
};

export function getToolFeatures(toolType: ToolType): ToolFeature[] {
  return toolFeatures[toolType] || [];
}

export const toolColors: Record<ToolType, string> = {
  autopost: 'from-blue-500/20 to-cyan-500/20',
  autopay: 'from-green-500/20 to-emerald-500/20',
  sessions: 'from-purple-500/20 to-pink-500/20',
  addmembers: 'from-orange-500/20 to-amber-500/20',
  tclone: 'from-indigo-500/20 to-violet-500/20',
  views: 'from-yellow-500/20 to-orange-500/20',
  superbot: 'from-red-500/20 to-rose-500/20',
  masssender: 'from-teal-500/20 to-cyan-500/20',
  userscraper: 'from-lime-500/20 to-green-500/20',
  pollbot: 'from-fuchsia-500/20 to-pink-500/20',
  messagebackup: 'from-sky-500/20 to-blue-500/20',
  inactivecleaner: 'from-slate-500/20 to-gray-500/20',
  mediaextractor: 'from-violet-500/20 to-purple-500/20',
  accountgen: 'from-amber-500/20 to-yellow-500/20',
  autoreact: 'from-pink-500/20 to-rose-500/20',
  security: 'from-red-600/20 to-orange-600/20',
  massreact: 'from-rose-500/20 to-pink-500/20',
};
