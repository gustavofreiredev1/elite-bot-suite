import { useState, useEffect } from 'react';
import { BarChart3, Loader2, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RelatoriosTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalLeads: 0, totalMembers: 0, paidOrders: 0, pendingOrders: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const [ordersRes, leadsRes, membersRes] = await Promise.all([
          supabase.from('orders').select('amount, status, created_at').eq('seller_id', user.id),
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('vip_members').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        ]);
        const orders = ordersRes.data || [];
        const paid = orders.filter(o => o.status === 'paid');
        const revenue = paid.reduce((s, o) => s + (o.amount || 0), 0);
        const dateMap: Record<string, { date: string; vendas: number }> = {};
        orders.forEach(o => { const d = new Date(o.created_at).toLocaleDateString('pt-BR'); if (!dateMap[d]) dateMap[d] = { date: d, vendas: 0 }; dateMap[d].vendas++; });
        setStats({ totalOrders: orders.length, totalRevenue: revenue, totalLeads: leadsRes.count || 0, totalMembers: membersRes.count || 0, paidOrders: paid.length, pendingOrders: orders.filter(o => o.status === 'pending').length });
        setChartData(Object.values(dateMap).slice(-14));
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h3 className="text-2xl font-bold">Relatórios Pro</h3><p className="text-muted-foreground mt-1">Analytics completos da operação</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6 flex items-center gap-4"><DollarSign className="h-8 w-8 text-emerald-500" /><div><div className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</div><p className="text-sm text-muted-foreground">Receita Total</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><ShoppingCart className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{stats.totalOrders}</div><p className="text-sm text-muted-foreground">Pedidos</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><Users className="h-8 w-8 text-amber-500" /><div><div className="text-2xl font-bold">{stats.totalLeads}</div><p className="text-sm text-muted-foreground">Leads</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-secondary" /><div><div className="text-2xl font-bold">{stats.totalMembers}</div><p className="text-sm text-muted-foreground">Membros VIP</p></div></CardContent></Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardContent className="pt-6"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Pagos</span><Badge>{stats.paidOrders}</Badge></div><div className="flex justify-between"><span className="text-sm text-muted-foreground">Pendentes</span><Badge variant="secondary">{stats.pendingOrders}</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Conversão</span><span className="font-bold">{stats.totalOrders > 0 ? ((stats.paidOrders / stats.totalOrders) * 100).toFixed(1) : 0}%</span></div><div className="flex justify-between"><span className="text-sm text-muted-foreground">Ticket Médio</span><span className="font-bold">R$ {stats.paidOrders > 0 ? (stats.totalRevenue / stats.paidOrders).toFixed(2) : '0.00'}</span></div></CardContent></Card>
      </div>
      {chartData.length > 0 && <Card><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Vendas por Dia</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} /><Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>}
    </div>
  );
}
