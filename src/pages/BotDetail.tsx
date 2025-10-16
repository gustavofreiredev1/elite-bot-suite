import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Power, Copy, ExternalLink, Activity, Users, MessageSquare, Bot } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import Breadcrumbs from '@/components/Breadcrumbs';
import StatusBadge from '@/components/StatusBadge';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockBots, mockChartData } from '@/mocks/mockData';

export default function BotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  
  // Simular busca de bot por ID
  const bot = mockBots.find(b => b.id === id) || mockBots[0];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(bot.token);
    toast.success('Token copiado!');
  };

  const handleToggleStatus = () => {
    setIsActive(!isActive);
    toast.success(isActive ? 'Bot desativado' : 'Bot ativado');
  };

  const handleDelete = () => {
    toast.success('Bot deletado com sucesso!');
    navigate('/my-bots');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <PageHeader
          title={bot.name}
          description={`@${bot.username || bot.name.toLowerCase().replace(/\s/g, '_')}_bot • Criado em 15 de Janeiro, 2025`}
          icon={Bot}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: bot.name }
          ]}
          actions={
            <>
              <StatusBadge status={isActive ? 'active' : 'inactive'} />
              <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleToggleStatus} className="hover-glow">
              <Power className="mr-2 h-4 w-4" />
              {isActive ? 'Desativar' : 'Ativar'}
            </Button>
            <Button variant="outline" onClick={() => navigate(`/create-bot?edit=${id}`)} className="hover-glow">
              <Edit className="mr-2 h-4 w-4" />
              Editar
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
          <StatCard
            label="Mensagens Hoje"
            value={bot.stats.messages}
            icon={MessageSquare}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Usuários Ativos"
            value={bot.stats.users}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Taxa de Resposta"
            value="98%"
            icon={Activity}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ChartCard title="Atividade dos Últimos 7 Dias" description="Mensagens processadas por dia">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2e2e2e',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Comandos Mais Usados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['/start', '/help', '/info', '/menu', '/status'].map((cmd, i) => (
                    <div key={cmd} className="flex items-center justify-between">
                      <span className="font-mono text-sm">{cmd}</span>
                      <span className="text-muted-foreground">{Math.floor(Math.random() * 500)} vezes</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Horários de Pico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['08:00 - 10:00', '12:00 - 14:00', '18:00 - 20:00', '20:00 - 22:00'].map((time, i) => (
                    <div key={time} className="flex items-center justify-between">
                      <span className="text-sm">{time}</span>
                      <div className="flex-1 mx-4 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${Math.floor(Math.random() * 50 + 50)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Informações do Bot</CardTitle>
                <CardDescription>Detalhes técnicos e configurações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Token</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-muted rounded-lg text-xs font-mono">
                        {bot.token}
                      </code>
                      <Button variant="outline" size="icon" onClick={handleCopyToken}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="mt-1">@{bot.name.toLowerCase().replace(/\s/g, '_')}_bot</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Bot ID</label>
                    <p className="mt-1">{bot.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Link Público</label>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href={`https://t.me/${bot.name.toLowerCase().replace(/\s/g, '_')}_bot`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        t.me/{bot.name.toLowerCase().replace(/\s/g, '_')}_bot
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Logs Recentes</CardTitle>
                <CardDescription>Últimas atividades do bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 font-mono text-xs">
                  {[
                    { time: '14:35:22', type: 'INFO', message: 'Mensagem recebida de usuário #12345' },
                    { time: '14:35:23', type: 'SUCCESS', message: 'Resposta enviada com sucesso' },
                    { time: '14:37:10', type: 'INFO', message: 'Comando /start executado' },
                    { time: '14:38:45', type: 'WARNING', message: 'Taxa de requisições elevada detectada' },
                    { time: '14:40:12', type: 'INFO', message: 'Webhook atualizado' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">{log.time}</span>
                      <span
                        className={
                          log.type === 'SUCCESS'
                            ? 'text-success'
                            : log.type === 'WARNING'
                            ? 'text-warning'
                            : 'text-foreground'
                        }
                      >
                        [{log.type}]
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  );
}
