import { motion } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockChartData } from '@/mocks/mockData';
import MainLayout from '@/layouts/MainLayout';
import AnimatedCounter from '@/components/AnimatedCounter';
import GlassCard from '@/components/GlassCard';

export default function Stats() {
  const stats = [
    { label: 'Média Diária', value: '280', icon: TrendingUp, change: '+12%', color: 'text-primary' },
    { label: 'Usuários Ativos', value: '1.2k', icon: Users, change: '+8%', color: 'text-secondary' },
    { label: 'Taxa de Resposta', value: '98%', icon: MessageSquare, change: '+2%', color: 'text-success' },
    { label: 'Tempo Médio', value: '1.5s', icon: Clock, change: '-15%', color: 'text-accent' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Estatísticas</h1>
            <p className="text-muted-foreground">Análise detalhada dos seus bots</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-card border-border">
                <SelectValue placeholder="Selecione o bot" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os Bots</SelectItem>
                <SelectItem value="1">Atendimento Bot</SelectItem>
                <SelectItem value="2">Vendas Bot</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30d">
              <SelectTrigger className="w-[150px] bg-card border-border">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="card-glow relative overflow-hidden group">
                <div className="absolute inset-0 gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <Sparkles className="h-3 w-3" />
                    {stat.change} vs. período anterior
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-elegant hover-lift">
              <CardHeader>
                <CardTitle>Mensagens Enviadas</CardTitle>
                <CardDescription>Volume de mensagens ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockChartData}>
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
                    <Bar dataKey="messages" fill="#3b82f6" name="Mensagens" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-elegant hover-lift">
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
                <CardDescription>Novos usuários por dia</CardDescription>
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
                      dataKey="users"
                      stroke="#60a5fa"
                      strokeWidth={3}
                      name="Usuários"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimas interações com os bots</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Bot</TableHead>
                    <TableHead>Comando</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell>15/10/2025 14:3{i}</TableCell>
                      <TableCell>Atendimento Bot</TableCell>
                      <TableCell className="font-mono text-primary">/start</TableCell>
                      <TableCell>Usuário {i}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-success">✓ Sucesso</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
