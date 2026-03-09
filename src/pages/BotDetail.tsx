import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Power, Copy, ExternalLink, Activity, Users, MessageSquare, Bot, PlayCircle, BookOpen, TrendingUp, Zap, CheckCircle2, AlertCircle, Info, Clock, Wrench, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import PlanGuard from '@/components/PlanGuard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToolType, toolNames, toolDescriptions } from '@/mocks/mockData';
import { getToolFeatures } from '@/config/toolFeatures';
import { supabase } from '@/integrations/supabase/client';
import VendasAutoTab from '@/components/tabs/VendasAutoTab';
import CheckoutProTab from '@/components/tabs/CheckoutProTab';
import AreaVipTab from '@/components/tabs/AreaVipTab';
import DisparoTab from '@/components/tabs/DisparoTab';
import LeadsTab from '@/components/tabs/LeadsTab';
import FunisTab from '@/components/tabs/FunisTab';
import AtendimentoTab from '@/components/tabs/AtendimentoTab';
import EntregaTab from '@/components/tabs/EntregaTab';
import AgendadorTab from '@/components/tabs/AgendadorTab';
import PixTab from '@/components/tabs/PixTab';
import CrmTab from '@/components/tabs/CrmTab';
import RelatoriosTab from '@/components/tabs/RelatoriosTab';
import AfiliadosTab from '@/components/tabs/AfiliadosTab';
import UpsellTab from '@/components/tabs/UpsellTab';
import RecuperacaoTab from '@/components/tabs/RecuperacaoTab';
import NotificacoesTab from '@/components/tabs/NotificacoesTab';
import ExtratorTab from '@/components/tabs/ExtratorTab';

const mockChartData = [
  { date: 'Seg', messages: 120 },
  { date: 'Ter', messages: 180 },
  { date: 'Qua', messages: 150 },
  { date: 'Qui', messages: 220 },
  { date: 'Sex', messages: 190 },
  { date: 'Sáb', messages: 250 },
  { date: 'Dom', messages: 280 },
];

export default function BotDetail() {
  const { id, toolType } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string; status: 'running' | 'success' | 'error' | 'warning' }>>([]);
  const [msgCount, setMsgCount] = useState(0);
  const [convCount, setConvCount] = useState(0);

  useEffect(() => {
    const loadBot = async () => {
      if (!id) return;
      const { data, error } = await supabase.from('bots').select('*').eq('id', id).single();
      if (error || !data) {
        toast.error('Bot não encontrado');
        navigate('/my-bots');
        return;
      }
      setBot(data);
      setIsActive(data.is_active);

      // Load stats
      const [{ count: mc }, { count: cc }] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('bot_id', id),
        supabase.from('conversations').select('*', { count: 'exact', head: true }).eq('bot_id', id),
      ]);
      setMsgCount(mc || 0);
      setConvCount(cc || 0);
      setLoading(false);
    };
    loadBot();
  }, [id, navigate]);

  useEffect(() => {
    const logMessages = [
      { type: 'INFO', message: 'Bot iniciado e pronto', status: 'success' as const },
      { type: 'INFO', message: 'Conectado ao Telegram', status: 'success' as const },
      { type: 'INFO', message: 'Aguardando mensagens...', status: 'running' as const },
      { type: 'SUCCESS', message: 'Comando processado', status: 'success' as const },
      { type: 'INFO', message: 'Webhook verificado', status: 'success' as const },
    ];
    const interval = setInterval(() => {
      const r = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLogs(prev => [{ time: new Date().toLocaleTimeString('pt-BR'), ...r }, ...prev].slice(0, 20));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleStatus = async () => {
    if (!bot) return;
    const newActive = !isActive;
    await supabase.from('bots').update({ is_active: newActive }).eq('id', bot.id);
    setIsActive(newActive);
    toast.success(newActive ? 'Bot ativado' : 'Bot desativado');
  };

  const handleDelete = async () => {
    if (!bot || !confirm('Tem certeza que deseja deletar este bot?')) return;
    await supabase.from('bots').delete().eq('id', bot.id);
    toast.success('Bot deletado!');
    navigate('/my-bots');
  };

  const toolKey = (toolType || 'vendas-auto') as ToolType;
  const toolLabel = toolNames[toolKey] || toolType;
  const toolDesc = toolDescriptions[toolKey] || '';
  const features = getToolFeatures(toolKey);

  const renderToolComponent = () => {
    switch (toolKey) {
      case 'vendas-auto': return <VendasAutoTab />;
      case 'checkout-pro': return <CheckoutProTab />;
      case 'area-vip': return <AreaVipTab />;
      case 'disparo': return <DisparoTab />;
      case 'leads': return <LeadsTab />;
      case 'funis': return <FunisTab />;
      case 'atendimento': return <AtendimentoTab />;
      case 'entrega': return <EntregaTab />;
      case 'agendador': return <AgendadorTab />;
      case 'pix': return <PixTab />;
      case 'crm': return <CrmTab />;
      case 'relatorios': return <RelatoriosTab />;
      case 'afiliados': return <AfiliadosTab />;
      case 'upsell': return <UpsellTab />;
      case 'recuperacao': return <RecuperacaoTab />;
      case 'notificacoes': return <NotificacoesTab />;
      case 'extrator': return <ExtratorTab />;
      default: return <div className="text-center text-muted-foreground py-12">Ferramenta não encontrada</div>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </MainLayout>
    );
  }

  if (!bot) return null;

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title={`${bot.name} · ${toolLabel}`}
          description={toolDesc}
          icon={Bot}
          breadcrumbs={[
            { label: 'Painel', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: bot.name },
            { label: toolLabel },
          ]}
          actions={
            <>
              <StatusBadge status={isActive ? 'active' : 'inactive'} />
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleToggleStatus}>
                  <Power className="mr-2 h-4 w-4" />
                  {isActive ? 'Desativar' : 'Ativar'}
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </Button>
              </div>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Mensagens" value={msgCount} icon={MessageSquare} trend={{ value: 12, isPositive: true }} />
          <StatCard label="Conversas" value={convCount} icon={Users} trend={{ value: 8, isPositive: true }} />
          <StatCard label="Status" value={isActive ? 'Online' : 'Offline'} icon={Activity} />
        </div>

        <Tabs defaultValue="tool" className="space-y-6">
          <TabsList className="bg-muted grid w-full grid-cols-4">
            <TabsTrigger value="tool">{toolLabel}</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value="tool" className="space-y-6">
            <PlanGuard botId={toolKey}>
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    {toolLabel}
                  </CardTitle>
                  <CardDescription>{toolDesc}</CardDescription>
                </CardHeader>
                <CardContent>{renderToolComponent()}</CardContent>
              </Card>
            </PlanGuard>

            <Card className="card-elegant bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-primary" />
                  Funcionalidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="p-2 rounded-md bg-primary/10 shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold mb-1">{feature.label}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <ChartCard title="Atividade 7 Dias" description="Mensagens processadas por dia">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="messages" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Logs em Tempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                  {logs.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Aguardando logs...</p>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/50 text-sm">
                        <span className="text-muted-foreground text-xs font-mono w-20">{log.time}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          log.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                          log.status === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                          log.status === 'error' ? 'bg-destructive/10 text-destructive' :
                          'bg-primary/10 text-primary'
                        }`}>{log.type}</span>
                        <span>{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutorial">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Guia Rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { step: 1, title: 'Configure o Bot', description: 'Adicione o token do Telegram e ative o bot.', icon: Bot },
                  { step: 2, title: 'Defina Permissões', description: 'Adicione o bot como admin nos grupos desejados.', icon: CheckCircle2 },
                  { step: 3, title: 'Configure Automações', description: 'Use a aba da ferramenta para configurar tudo.', icon: Zap },
                  { step: 4, title: 'Monitore', description: 'Acompanhe logs e analytics em tempo real.', icon: Activity },
                ].map(({ step, title, description, icon: Icon }) => (
                  <div key={step} className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{step}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold">{title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
}
