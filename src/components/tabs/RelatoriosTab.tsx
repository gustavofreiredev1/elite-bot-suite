import { BarChart3, TrendingUp, Download, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';

const revenueData = [
  { date: '01/03', revenue: 450, orders: 5 },
  { date: '02/03', revenue: 890, orders: 9 },
  { date: '03/03', revenue: 320, orders: 3 },
  { date: '04/03', revenue: 1250, orders: 12 },
  { date: '05/03', revenue: 780, orders: 8 },
  { date: '06/03', revenue: 1100, orders: 11 },
  { date: '07/03', revenue: 1450, orders: 15 },
];

const channelData = [
  { name: 'Bot Vendas', value: 4500 },
  { name: 'Checkout', value: 3200 },
  { name: 'PIX Chat', value: 1800 },
  { name: 'Afiliados', value: 900 },
];

export default function RelatoriosTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Relatórios Pro</h3>
          <p className="text-muted-foreground mt-1">Analytics completos do seu negócio</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Relatório exportado!')}><Download className="mr-2 h-4 w-4" />Exportar PDF</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">R$ 10.400</div><p className="text-sm text-muted-foreground">Receita Total</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">63</div><p className="text-sm text-muted-foreground">Total de Vendas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">R$ 165</div><p className="text-sm text-muted-foreground">Ticket Médio</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">+23%</div><p className="text-sm text-muted-foreground">Crescimento</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Receita por Dia</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Receita por Canal</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
