import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { getProducts } from '@/lib/products';
import { useNavigate } from 'react-router-dom';

export default function VendasAutoTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const [ordersRes, prods] = await Promise.all([supabase.from('orders').select('*, products(name, price)').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(50), getProducts()]);
        setOrders(ordersRes.data || []); setProducts(prods || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const paid = orders.filter(o => o.status === 'paid');
  const revenue = paid.reduce((s, o) => s + (o.amount || 0), 0);
  const statusLabel = (s: string) => ({ pending: 'Pendente', paid: 'Pago', delivered: 'Entregue', failed: 'Falhou' }[s] || s);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Vendas Automáticas</h3><p className="text-muted-foreground mt-1">Funil + checkout + entrega automática</p></div>
        <Button onClick={() => navigate('/products')}>Gerenciar Produtos</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6 flex items-center gap-4"><ShoppingCart className="h-8 w-8 text-primary" /><div><div className="text-2xl font-bold">{orders.length}</div><p className="text-sm text-muted-foreground">Pedidos</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><DollarSign className="h-8 w-8 text-emerald-500" /><div><div className="text-2xl font-bold">R$ {revenue.toFixed(2)}</div><p className="text-sm text-muted-foreground">Receita</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><TrendingUp className="h-8 w-8 text-amber-500" /><div><div className="text-2xl font-bold">{products.length}</div><p className="text-sm text-muted-foreground">Produtos</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-4"><DollarSign className="h-8 w-8 text-secondary" /><div><div className="text-2xl font-bold">{orders.length > 0 ? ((paid.length / orders.length) * 100).toFixed(0) : 0}%</div><p className="text-sm text-muted-foreground">Conversão</p></div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Últimos Pedidos</CardTitle></CardHeader><CardContent>{orders.length === 0 ? <p className="text-center text-muted-foreground py-8">Nenhum pedido ainda.</p> : <Table><TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Comprador</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead></TableRow></TableHeader><TableBody>{orders.slice(0, 20).map(o => (<TableRow key={o.id}><TableCell className="font-medium">{o.products?.name || '-'}</TableCell><TableCell>{o.buyer_name || o.buyer_email || '-'}</TableCell><TableCell>R$ {o.amount?.toFixed(2)}</TableCell><TableCell><Badge variant={o.status === 'paid' ? 'default' : o.status === 'pending' ? 'secondary' : 'destructive'}>{statusLabel(o.status)}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString('pt-BR')}</TableCell></TableRow>))}</TableBody></Table>}</CardContent></Card>
    </div>
  );
}
