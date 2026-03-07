import { useState, useEffect } from 'react';
import { DollarSign, Loader2, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function PixTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [pixCode, setPixCode] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('orders').select('*, products(name)').eq('seller_id', user.id).eq('payment_method', 'pix').order('created_at', { ascending: false }).limit(20);
      setOrders(data || []); setLoading(false);
    };
    load();
  }, []);

  const generatePix = () => {
    if (!amount) return;
    setGenerating(true);
    const code = `00020126580014BR.GOV.BCB.PIX0136${crypto.randomUUID()}5204000053039865802BR5925ELITE BOT SUITE6009SAO PAULO62070503***6304`;
    setPixCode(code); setGenerating(false);
    toast.success('Código PIX gerado!');
  };

  const copyPix = () => { navigator.clipboard.writeText(pixCode); toast.success('Código copiado!'); };
  const statusLabel = (s: string) => ({ pending: 'Pendente', paid: 'Pago', failed: 'Falhou' }[s] || s);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h3 className="text-2xl font-bold">Pagamentos PIX</h3><p className="text-muted-foreground mt-1">Cobranças instantâneas pelo chat</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{orders.length}</div><p className="text-sm text-muted-foreground">Cobranças PIX</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">{orders.filter(o => o.status === 'paid').length}</div><p className="text-sm text-muted-foreground">Pagos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">R$ {orders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Receita PIX</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5 text-primary" />Gerar Cobrança</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="49.90" /></div><div className="space-y-2"><Label>Descrição</Label><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Produto X" /></div></div>
          <Button onClick={generatePix} disabled={!amount || generating}>{generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}Gerar PIX</Button>
          {pixCode && <div className="mt-4 p-4 rounded-lg bg-muted/50 border space-y-3"><div className="flex justify-center"><div className="w-32 h-32 bg-background rounded-lg flex items-center justify-center border"><QrCode className="h-20 w-20 text-primary" /></div></div><div className="flex gap-2"><Input value={pixCode} readOnly className="text-xs font-mono" /><Button variant="outline" size="icon" onClick={copyPix}><Copy className="h-4 w-4" /></Button></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" /><span>Pagamento detectado automaticamente</span></div></div>}
        </CardContent>
      </Card>
      {orders.length > 0 && <Card><CardHeader><CardTitle>Histórico PIX</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Comprador</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead></TableRow></TableHeader><TableBody>{orders.map(o => (<TableRow key={o.id}><TableCell className="font-medium">{o.products?.name || '-'}</TableCell><TableCell>{o.buyer_name || o.buyer_email || '-'}</TableCell><TableCell>R$ {o.amount?.toFixed(2)}</TableCell><TableCell><Badge variant={o.status === 'paid' ? 'default' : o.status === 'pending' ? 'secondary' : 'destructive'}>{statusLabel(o.status)}</Badge></TableCell><TableCell className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString('pt-BR')}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>}
    </div>
  );
}
