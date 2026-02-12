import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Repeat, Activity, TrendingUp, Zap, Home, Plus, ArrowRight, DollarSign, ShoppingCart } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProgressBar from '@/components/ProgressBar';
import GlassCard from '@/components/GlassCard';
import OnboardingGuide from '@/components/OnboardingGuide';
import { useNavigate } from 'react-router-dom';
import { getUserBots } from '@/lib/telegram';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [stats, setStats] = useState({ totalBots: 0, activeBots: 0, totalMessages: 0, totalFlows: 0, totalOrders: 0, totalRevenue: 0 });
  const [hasBots, setHasBots] = useState<boolean | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const bots = await getUserBots();
        const totalBots = bots?.length || 0;
        const activeBots = bots?.filter((b: any) => b.status === 'connected').length || 0;
        setHasBots(totalBots > 0);

        // Get message count
        const { count: msgCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });

        // Get flow count
        const { count: flowCount } = await supabase
          .from('bot_flows')
          .select('*', { count: 'exact', head: true });

        // Get orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('amount, status');
        const paidOrders = (ordersData || []).filter((o: any) => o.status === 'paid');
        const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);

        setStats({
          totalBots,
          activeBots,
          totalMessages: msgCount || 0,
          totalFlows: flowCount || 0,
          totalOrders: ordersData?.length || 0,
          totalRevenue,
        });
      } catch {
        // Silently fail
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total de Bots', value: stats.totalBots, icon: Bot, color: 'text-primary' },
    { label: 'Bots Ativos', value: stats.activeBots, icon: Activity, color: 'text-emerald-500' },
    { label: 'Mensagens', value: stats.totalMessages, icon: MessageSquare, color: 'text-secondary' },
    { label: 'Automações', value: stats.totalFlows, icon: Repeat, color: 'text-accent' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'text-amber-500' },
    { label: 'Receita (R$)', value: stats.totalRevenue, icon: DollarSign, color: 'text-emerald-500' },
  ];

  return (
    <MainLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <PageHeader
          title={`Olá, ${profile?.full_name || 'Usuário'}!`}
          description="Visão geral da sua operação"
          icon={Home}
          breadcrumbs={[{ label: 'Painel' }]}
        />

        <OnboardingGuide />

        {hasBots === false && (
          <motion.div variants={item}>
            <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">Bem-vindo ao Elite Bot Suite!</CardTitle>
                    <CardDescription className="text-base">
                      Conecte seu primeiro bot do Telegram para começar.
                    </CardDescription>
                  </div>
                  <Zap className="h-12 w-12 text-primary opacity-50" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Abra o <strong>@BotFather</strong> no Telegram</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Crie um bot com <code>/newbot</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Cole o token aqui e comece a usar</span>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/create-bot')} className="w-fit hover-glow" size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Conectar Primeiro Bot
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map((stat, index) => (
            <motion.div key={index} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="card-glow relative overflow-hidden group">
                <div className="absolute inset-0 gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold">
                    <AnimatedCounter value={stat.value} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        {hasBots && (
          <motion.div variants={item}>
            <GlassCard glow>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/create-bot')} variant="outline" className="hover-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Conectar Bot
                </Button>
                <Button onClick={() => navigate('/automations')} variant="outline" className="hover-glow">
                  <Zap className="mr-2 h-4 w-4" />
                  Criar Fluxo
                </Button>
                <Button onClick={() => navigate('/products')} variant="outline" className="hover-glow">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Produtos
                </Button>
                <Button onClick={() => navigate('/wallet')} variant="outline" className="hover-glow">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Carteira
                </Button>
                <Button onClick={() => navigate('/messages')} variant="outline" className="hover-glow">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ver Chat
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* System Status */}
        <motion.div variants={item}>
          <GlassCard glow>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary animate-pulse-glow" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Sistema Operacional</h3>
                <ProgressBar value={100} glow className="mt-2" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
