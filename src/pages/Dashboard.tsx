import { motion } from 'framer-motion';
import { Bot, MessageSquare, Repeat, Activity, TrendingUp, Zap, Home, Shield, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockStats, mockChartData, mockCommandData } from '@/mocks/mockData';
import MainLayout from '@/layouts/MainLayout';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProgressBar from '@/components/ProgressBar';
import GlassCard from '@/components/GlassCard';
import { useTelegramConfigStore } from '@/store/telegramConfigStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isConfigured } = useTelegramConfigStore();
  
  const statCards = [
    { label: 'Total de Bots', value: mockStats.totalBots, icon: Bot, color: 'text-primary' },
    { label: 'Bots Ativos', value: mockStats.activeBots, icon: Activity, color: 'text-success' },
    { label: 'Mensagens Enviadas', value: mockStats.totalMessages.toLocaleString(), icon: MessageSquare, color: 'text-secondary' },
    { label: 'Automações', value: mockStats.totalAutomations, icon: Repeat, color: 'text-accent' },
  ];

  return (
    <MainLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <PageHeader
          title="Dashboard"
          description="Visão geral da sua operação"
          icon={Home}
          breadcrumbs={[{ label: 'Dashboard' }]}
        />

        {/* Welcome Card for Non-Configured Users */}
        {!isConfigured() && (
          <motion.div variants={item}>
            <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl">Bem-vindo ao Elite Bot Suite!</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Para começar a usar todos os 17 bots disponíveis, você precisa configurar suas credenciais do Telegram.
                    </CardDescription>
                  </div>
                  <Zap className="h-12 w-12 text-primary opacity-50" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex flex-col gap-4">
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Acesse <strong>my.telegram.org</strong> para obter suas credenciais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Configure uma única vez e use em todos os bots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      <span>Suas credenciais ficam salvas localmente no navegador</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate('/create-bot')} 
                    className="w-fit hover-glow"
                    size="lg"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Configurar Telegram Agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex justify-end">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
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
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter value={stat.value} />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div variants={item}>
          <GlassCard glow>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary animate-pulse-glow" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Sistema 100% Operacional</h3>
                <ProgressBar value={100} glow className="mt-2" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item}>
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Mensagens por Dia</CardTitle>
                <CardDescription>Atividade dos últimos 7 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                    <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #2e2e2e',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="messages"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Mensagens"
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      name="Usuários"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Comandos Mais Usados</CardTitle>
                <CardDescription>Distribuição de comandos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockCommandData as any}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => {
                        const percent = entry.percent || 0;
                        return `${entry.name} ${(Number(percent) * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {mockCommandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #2e2e2e',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
