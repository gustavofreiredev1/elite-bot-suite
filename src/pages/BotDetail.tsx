import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Power, Copy, ExternalLink, Activity, Users, MessageSquare, Bot, PlayCircle, BookOpen, TrendingUp, Zap, CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
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
  const [logs, setLogs] = useState<Array<{ time: string; type: string; message: string; status: 'running' | 'success' | 'error' | 'warning' }>>([]);
  
  // Simular busca de bot por ID
  const bot = mockBots.find(b => b.id === id) || mockBots[0];

  // Simular logs em tempo real
  useEffect(() => {
    const logMessages = [
      { type: 'INFO', message: 'Bot iniciado e pronto para processar comandos', status: 'success' as const },
      { type: 'INFO', message: 'Conectado ao servidor Telegram', status: 'success' as const },
      { type: 'INFO', message: 'Aguardando mensagens...', status: 'running' as const },
      { type: 'INFO', message: 'Nova mensagem recebida de @usuario_123', status: 'running' as const },
      { type: 'SUCCESS', message: 'Processamento de comando /start concluído', status: 'success' as const },
      { type: 'INFO', message: 'Enviando resposta ao usuário...', status: 'running' as const },
      { type: 'SUCCESS', message: 'Resposta enviada com sucesso', status: 'success' as const },
      { type: 'INFO', message: 'Executando automação agendada', status: 'running' as const },
      { type: 'WARNING', message: 'Taxa de requisições próxima do limite', status: 'warning' as const },
      { type: 'INFO', message: 'Webhook verificado e atualizado', status: 'success' as const },
      { type: 'INFO', message: 'Processando 5 mensagens em fila', status: 'running' as const },
      { type: 'SUCCESS', message: 'Todas as mensagens processadas', status: 'success' as const },
    ];

    const interval = setInterval(() => {
      const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog = {
        time: new Date().toLocaleTimeString('pt-BR'),
        type: randomLog.type,
        message: randomLog.message,
        status: randomLog.status
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
          description={`@${bot.name.toLowerCase().replace(/\s/g, '_')}_bot • Criado em ${new Date(bot.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}`}
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
          <TabsList className="bg-muted grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="logs">Logs em Tempo Real</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
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

          <TabsContent value="tutorial" className="space-y-6">
            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  Vídeo Tutorial
                </CardTitle>
                <CardDescription>Aprenda a configurar e usar o {bot.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-xl overflow-hidden bg-muted border border-border">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/dQw4w9WgXcQ`}
                    title="Tutorial do Bot"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Guia Passo a Passo
                </CardTitle>
                <CardDescription>Siga este tutorial para começar a usar todas as funcionalidades</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Configure o Bot',
                    description: 'Acesse as configurações e adicione o token do Telegram. Certifique-se de que o bot está ativo.',
                    icon: Bot
                  },
                  {
                    step: 2,
                    title: 'Defina as Permissões',
                    description: 'Configure as permissões necessárias nos grupos onde o bot irá operar. Adicione como administrador se necessário.',
                    icon: CheckCircle2
                  },
                  {
                    step: 3,
                    title: 'Configure as Automações',
                    description: 'Acesse a página da ferramenta específica e configure os parâmetros de automação desejados.',
                    icon: Zap
                  },
                  {
                    step: 4,
                    title: 'Ative e Monitore',
                    description: 'Ative o bot e acompanhe os logs em tempo real para garantir que tudo está funcionando corretamente.',
                    icon: Activity
                  }
                ].map(({ step, title, description, icon: Icon }) => (
                  <div key={step} className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 hover-lift">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border-2 border-primary/50">
                      {step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold">{title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-elegant bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Dicas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Mantenha o bot sempre ativo para garantir o funcionamento das automações</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Monitore regularmente os logs para identificar possíveis problemas</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Configure limites de taxa para evitar bloqueios do Telegram</p>
                </div>
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-sm">Faça backup das configurações importantes regularmente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="card-elegant hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Interações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">12,458</div>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +18% vs mês anterior
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-primary/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Únicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">3,249</div>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +12% vs mês anterior
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-secondary/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">98.7%</div>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +2.3% vs mês anterior
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-success/50" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elegant hover-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">0.8s</div>
                      <p className="text-xs text-success flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        -15% vs mês anterior
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-accent/50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Distribuição de Comandos</CardTitle>
                  <CardDescription>Top 10 comandos mais utilizados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { cmd: '/start', count: 3420, percent: 28 },
                    { cmd: '/help', count: 2180, percent: 18 },
                    { cmd: '/info', count: 1890, percent: 15 },
                    { cmd: '/menu', count: 1560, percent: 13 },
                    { cmd: '/status', count: 1120, percent: 9 },
                    { cmd: '/config', count: 890, percent: 7 },
                    { cmd: '/list', count: 670, percent: 5 },
                    { cmd: '/stats', count: 450, percent: 3 },
                    { cmd: '/report', count: 180, percent: 1 },
                    { cmd: '/custom', count: 98, percent: 1 },
                  ].map((item) => (
                    <div key={item.cmd} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-mono font-medium">{item.cmd}</span>
                        <span className="text-muted-foreground">{item.count.toLocaleString()} vezes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: 0.1 }}
                            className="h-full bg-gradient-primary"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{item.percent}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle>Atividade por Horário</CardTitle>
                  <CardDescription>Distribuição de uso ao longo do dia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { period: '00:00 - 03:00', value: 12, color: 'bg-muted' },
                    { period: '03:00 - 06:00', value: 8, color: 'bg-muted' },
                    { period: '06:00 - 09:00', value: 45, color: 'bg-warning' },
                    { period: '09:00 - 12:00', value: 78, color: 'bg-primary' },
                    { period: '12:00 - 15:00', value: 92, color: 'bg-primary' },
                    { period: '15:00 - 18:00', value: 85, color: 'bg-primary' },
                    { period: '18:00 - 21:00', value: 95, color: 'bg-success' },
                    { period: '21:00 - 00:00', value: 68, color: 'bg-secondary' },
                  ].map((item) => (
                    <div key={item.period} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.period}</span>
                        <span className="text-muted-foreground">{item.value}% de uso</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Performance e Métricas</CardTitle>
                <CardDescription>Indicadores de desempenho do bot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uptime</span>
                      <span className="text-sm text-success font-bold">99.9%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success w-[99.9%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">30 dias sem interrupções</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Latência Média</span>
                      <span className="text-sm text-accent font-bold">0.8s</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[85%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">Excelente performance</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Taxa de Erro</span>
                      <span className="text-sm text-warning font-bold">1.3%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-warning w-[1.3%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">Dentro do esperado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="card-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary animate-pulse-glow" />
                      Logs em Tempo Real
                    </CardTitle>
                    <CardDescription>Acompanhe a execução das automações ao vivo</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 border border-success/30">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-success">Executando</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-xs max-h-[600px] overflow-y-auto custom-scrollbar">
                  {logs.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aguardando logs...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-4 p-3 rounded-lg border ${
                          log.status === 'success'
                            ? 'bg-success/5 border-success/20'
                            : log.status === 'error'
                            ? 'bg-destructive/5 border-destructive/20'
                            : log.status === 'warning'
                            ? 'bg-warning/5 border-warning/20'
                            : 'bg-muted/30 border-border/50'
                        }`}
                      >
                        <span className="text-muted-foreground flex-shrink-0">{log.time}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {log.status === 'running' && (
                            <Zap className="h-4 w-4 text-primary animate-pulse" />
                          )}
                          {log.status === 'success' && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                          {log.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          {log.status === 'warning' && (
                            <AlertCircle className="h-4 w-4 text-warning" />
                          )}
                          <span
                            className={`font-bold ${
                              log.type === 'SUCCESS'
                                ? 'text-success'
                                : log.type === 'WARNING'
                                ? 'text-warning'
                                : log.type === 'ERROR'
                                ? 'text-destructive'
                                : 'text-foreground'
                            }`}
                          >
                            [{log.type}]
                          </span>
                        </div>
                        <span className="flex-1">{log.message}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-sm">Mensagens Processadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">1,247</div>
                  <p className="text-xs text-muted-foreground mt-1">nas últimas 24 horas</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-sm">Automações Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">12</div>
                  <p className="text-xs text-muted-foreground mt-1">em execução agora</p>
                </CardContent>
              </Card>

              <Card className="card-elegant">
                <CardHeader>
                  <CardTitle className="text-sm">Última Atividade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{logs[0]?.time || '--:--:--'}</div>
                  <p className="text-xs text-muted-foreground mt-1">agora mesmo</p>
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
