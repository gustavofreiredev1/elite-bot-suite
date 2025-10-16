import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, Zap, Download, Calendar, LineChart as LineChartIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import MainLayout from '@/layouts/MainLayout';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { mockChartData } from '@/mocks/mockData';

const realtimeData = Array.from({ length: 20 }, (_, i) => ({
  time: `${14 + Math.floor(i / 4)}:${(i % 4) * 15}`,
  messages: Math.floor(Math.random() * 50 + 10),
  users: Math.floor(Math.random() * 30 + 5),
}));

const conversionData = [
  { stage: 'Visitantes', value: 1000 },
  { stage: 'Interações', value: 750 },
  { stage: 'Engajados', value: 500 },
  { stage: 'Convertidos', value: 200 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('7d');

  const handleExport = () => {
    // Simular export
    setTimeout(() => {
      alert('Relatório exportado com sucesso!');
    }, 500);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <PageHeader
          title="Analytics Avançado"
          description="Métricas e insights detalhados"
          icon={LineChartIcon}
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
        />
        <div className="flex justify-end items-center gap-2 mb-6">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="hover-glow">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] bg-card border-border">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport} className="hover-glow">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total de Mensagens"
            value={15420}
            icon={MessageSquare}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Usuários Únicos"
            value={3840}
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Taxa de Engajamento"
            value="67%"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            label="Tempo Médio Resposta"
            value="1.2s"
            icon={Zap}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard title="Atividade em Tempo Real" description="Últimas 5 horas">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realtimeData}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2e2e2e',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorMessages)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Funil de Conversão" description="Jornada do usuário">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="stage" type="category" stroke="#888" width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #2e2e2e',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Tendência de Crescimento" description="Comparativo mensal">
          <ResponsiveContainer width="100%" height={400}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Mensagens"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="Usuários"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Mobile', value: 68 },
                { label: 'Desktop', value: 25 },
                { label: 'Tablet', value: 7 },
              ].map((device) => (
                <div key={device.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{device.label}</span>
                    <span className="text-sm font-medium">{device.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${device.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Países Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { country: 'Brasil', flag: '🇧🇷', users: 2450 },
                { country: 'Estados Unidos', flag: '🇺🇸', users: 890 },
                { country: 'Portugal', flag: '🇵🇹', users: 340 },
                { country: 'Argentina', flag: '🇦🇷', users: 160 },
              ].map((item) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.flag}</span>
                    <span className="text-sm">{item.country}</span>
                  </div>
                  <span className="text-sm font-medium">{item.users.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-elegant">
            <CardHeader>
              <CardTitle>Horários de Pico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { time: '09:00', activity: 85 },
                { time: '12:00', activity: 92 },
                { time: '15:00', activity: 78 },
                { time: '18:00', activity: 95 },
                { time: '21:00', activity: 88 },
              ].map((slot) => (
                <div key={slot.time} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{slot.time}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                      style={{ width: `${slot.activity}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{slot.activity}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </MainLayout>
  );
}
