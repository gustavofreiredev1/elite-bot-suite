import {
  ShoppingCart,
  CreditCard,
  Crown,
  Send,
  UserPlus,
  Workflow,
  Bot,
  Package,
  Calendar,
  QrCode,
  Users,
  BarChart3,
  Share2,
  TrendingUp,
  RefreshCcw,
  Bell,
  Download,
  DollarSign,
  MessageSquare,
  Zap,
  Shield,
  Tag,
  Clock,
  FileText,
  Link,
  Mail,
  LucideIcon,
} from 'lucide-react';
import { ToolType } from '@/mocks/mockData';

export interface ToolFeature {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const toolFeatures: Record<ToolType, ToolFeature[]> = {
  'vendas-auto': [
    { icon: ShoppingCart, label: 'Funil de Vendas', description: 'Crie funis automatizados de ponta a ponta' },
    { icon: CreditCard, label: 'Checkout Integrado', description: 'Pagamento PIX e cartão direto no bot' },
    { icon: Package, label: 'Entrega Automática', description: 'Libere o produto após pagamento confirmado' },
  ],
  'checkout-pro': [
    { icon: CreditCard, label: 'Páginas de Venda', description: 'Checkout externo estilo Kiwify/Cakto' },
    { icon: QrCode, label: 'PIX QR Code', description: 'Geração automática de QR Code' },
    { icon: BarChart3, label: 'Conversão', description: 'Métricas de conversão em tempo real' },
  ],
  'area-vip': [
    { icon: Crown, label: 'Controle de Acesso', description: 'Gerencie quem entra e sai do grupo VIP' },
    { icon: Users, label: 'Membros Pagantes', description: 'Lista automática de pagantes ativos' },
    { icon: Clock, label: 'Expiração', description: 'Remoção automática ao vencer o acesso' },
  ],
  'disparo': [
    { icon: Send, label: 'Broadcast', description: 'Envie para milhares de contatos' },
    { icon: Shield, label: 'Anti-ban', description: 'Delays inteligentes para evitar bloqueio' },
    { icon: BarChart3, label: 'Relatório', description: 'Entregues, lidos e erros em tempo real' },
  ],
  'leads': [
    { icon: UserPlus, label: 'Captura Automática', description: 'Colete nome, telefone e e-mail' },
    { icon: Download, label: 'Exportação', description: 'Exporte em CSV/JSON/Excel' },
    { icon: Tag, label: 'Segmentação', description: 'Tags automáticas por origem' },
  ],
  'funis': [
    { icon: Workflow, label: 'Editor Visual', description: 'Drag-and-drop estilo ManyChat' },
    { icon: Zap, label: 'Condições', description: 'If/else, delays, webhooks' },
    { icon: MessageSquare, label: 'Multi-mídia', description: 'Texto, imagem, vídeo e botões' },
  ],
  'atendimento': [
    { icon: Bot, label: 'IA Avançada', description: 'Respostas inteligentes com IA' },
    { icon: MessageSquare, label: 'Chat 24/7', description: 'Atendimento contínuo automatizado' },
    { icon: Users, label: 'Transferência', description: 'Escale para humano quando necessário' },
  ],
  'entrega': [
    { icon: Package, label: 'Arquivos', description: 'PDFs, vídeos, links e cursos' },
    { icon: Link, label: 'Links Seguros', description: 'Links com expiração e limite de acesso' },
    { icon: Shield, label: 'Anti-pirataria', description: 'Proteção contra compartilhamento' },
  ],
  'agendador': [
    { icon: Calendar, label: 'Agendamento', description: 'Agende por data, hora e recorrência' },
    { icon: Clock, label: 'Fuso Horário', description: 'Respeite o fuso do destinatário' },
    { icon: FileText, label: 'Templates', description: 'Salve mensagens como templates' },
  ],
  'pix': [
    { icon: QrCode, label: 'QR Code PIX', description: 'Gere cobranças instantâneas no chat' },
    { icon: DollarSign, label: 'Confirmação', description: 'Detecte pagamento em tempo real' },
    { icon: CreditCard, label: 'Copia e Cola', description: 'Código PIX pronto para copiar' },
  ],
  'crm': [
    { icon: Tag, label: 'Tags', description: 'Etiquete contatos por comportamento' },
    { icon: Users, label: 'Listas', description: 'Organize contatos em listas' },
    { icon: FileText, label: 'Histórico', description: 'Histórico completo de interações' },
  ],
  'relatorios': [
    { icon: BarChart3, label: 'Dashboard', description: 'Métricas visuais em tempo real' },
    { icon: TrendingUp, label: 'Crescimento', description: 'Análise de crescimento diário' },
    { icon: Download, label: 'Exportar', description: 'Relatórios em PDF e Excel' },
  ],
  'afiliados': [
    { icon: Share2, label: 'Links de Afiliado', description: 'Gere links únicos por afiliado' },
    { icon: DollarSign, label: 'Comissões', description: 'Comissões configuráveis por produto' },
    { icon: BarChart3, label: 'Rastreamento', description: 'Cliques, vendas e conversão' },
  ],
  'upsell': [
    { icon: TrendingUp, label: 'Order Bump', description: 'Oferta extra no checkout' },
    { icon: ShoppingCart, label: 'Upsell', description: 'Oferta após compra confirmada' },
    { icon: RefreshCcw, label: 'Downsell', description: 'Oferta alternativa se recusar' },
  ],
  'recuperacao': [
    { icon: RefreshCcw, label: 'Carrinho Abandonado', description: 'Lembretes automáticos' },
    { icon: Mail, label: 'Sequência', description: 'Até 5 mensagens de recuperação' },
    { icon: DollarSign, label: 'Desconto', description: 'Cupom automático de incentivo' },
  ],
  'notificacoes': [
    { icon: Bell, label: 'Alertas', description: 'Notifique por venda, lead ou erro' },
    { icon: Zap, label: 'Triggers', description: 'Dispare por evento do sistema' },
    { icon: MessageSquare, label: 'Multi-canal', description: 'Telegram, e-mail e webhook' },
  ],
  'extrator': [
    { icon: Download, label: 'Exportar Contatos', description: 'IDs, usernames e telefones' },
    { icon: Users, label: 'Grupos', description: 'Extraia membros de qualquer grupo' },
    { icon: FileText, label: 'Planilhas', description: 'Exporte em CSV/Excel' },
  ],
};

export function getToolFeatures(toolType: ToolType): ToolFeature[] {
  return toolFeatures[toolType] || [];
}

export const toolColors: Record<ToolType, string> = {
  'vendas-auto': 'from-green-500/20 to-emerald-500/20',
  'checkout-pro': 'from-blue-500/20 to-cyan-500/20',
  'area-vip': 'from-amber-500/20 to-yellow-500/20',
  'disparo': 'from-teal-500/20 to-cyan-500/20',
  'leads': 'from-orange-500/20 to-amber-500/20',
  'funis': 'from-indigo-500/20 to-violet-500/20',
  'atendimento': 'from-purple-500/20 to-pink-500/20',
  'entrega': 'from-sky-500/20 to-blue-500/20',
  'agendador': 'from-yellow-500/20 to-orange-500/20',
  'pix': 'from-lime-500/20 to-green-500/20',
  'crm': 'from-fuchsia-500/20 to-pink-500/20',
  'relatorios': 'from-slate-500/20 to-gray-500/20',
  'afiliados': 'from-violet-500/20 to-purple-500/20',
  'upsell': 'from-rose-500/20 to-pink-500/20',
  'recuperacao': 'from-red-500/20 to-rose-500/20',
  'notificacoes': 'from-pink-500/20 to-rose-500/20',
  'extrator': 'from-emerald-500/20 to-teal-500/20',
};
