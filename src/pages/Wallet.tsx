import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getWallet, getOrders, getWithdrawals, requestWithdrawal } from '@/lib/products';
import AnimatedCounter from '@/components/AnimatedCounter';

export default function Wallet() {
  const [wallet, setWallet] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', pixKey: '', pixKeyType: 'cpf' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      getWallet().catch(() => null),
      getOrders({ limit: 20 }).catch(() => []),
      getWithdrawals().catch(() => []),
    ]).then(([w, o, wd]) => {
      setWallet(w);
      setOrders(o || []);
      setWithdrawals(wd || []);
      setLoading(false);
    });
  }, []);

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawForm.amount);
    if (!amount || amount <= 0 || !withdrawForm.pixKey) return;
    if (wallet && amount > wallet.balance) {
      toast.error('Saldo insuficiente');
      return;
    }
    setSaving(true);
    try {
      await requestWithdrawal(amount, withdrawForm.pixKey, withdrawForm.pixKeyType);
      toast.success('Saque solicitado! Será processado em até 24h.');
      setShowWithdraw(false);
      setWithdrawForm({ amount: '', pixKey: '', pixKeyType: 'cpf' });
      // Reload
      const [w, wd] = await Promise.all([getWallet(), getWithdrawals()]);
      setWallet(w);
      setWithdrawals(wd || []);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao solicitar saque');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === 'paid' || s === 'completed') return 'default';
    if (s === 'pending' || s === 'processing') return 'secondary';
    return 'destructive';
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { pending: 'Pendente', paid: 'Pago', completed: 'Concluído', failed: 'Falhou', processing: 'Processando' };
    return map[s] || s;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Carteira"
          description="Gerencie seus ganhos e saques"
          icon={WalletIcon}
          breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Carteira' }]}
          actions={
            <Button onClick={() => setShowWithdraw(true)} disabled={!wallet || wallet.balance <= 0}>
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Sacar
            </Button>
          }
        />

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Saldo Disponível', value: wallet?.balance || 0, icon: DollarSign, color: 'text-emerald-500' },
            { label: 'Saldo Pendente', value: wallet?.pending_balance || 0, icon: Clock, color: 'text-amber-500' },
            { label: 'Total Recebido', value: wallet?.total_earned || 0, icon: TrendingUp, color: 'text-primary' },
            { label: 'Total Sacado', value: wallet?.total_withdrawn || 0, icon: ArrowUpRight, color: 'text-secondary' },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02, y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="card-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ <AnimatedCounter value={stat.value} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDownLeft className="h-5 w-5 text-primary" />
              Últimas Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhuma venda ainda.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div>
                      <p className="font-medium text-sm">{order.products?.name || 'Produto'}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.buyer_name || order.buyer_email || 'Anônimo'} · {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColor(order.status)}>{statusLabel(order.status)}</Badge>
                      <span className="font-bold text-sm">R$ {order.amount?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Withdrawals */}
        {withdrawals.length > 0 && (
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-secondary" />
                Saques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {withdrawals.map((w: any) => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div>
                      <p className="font-medium text-sm">PIX: {w.pix_key}</p>
                      <p className="text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusColor(w.status)}>{statusLabel(w.status)}</Badge>
                      <span className="font-bold text-sm">R$ {w.amount?.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Saque</DialogTitle>
            <DialogDescription>Saldo disponível: R$ {wallet?.balance?.toFixed(2) || '0.00'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={withdrawForm.amount} onChange={(e) => setWithdrawForm((f) => ({ ...f, amount: e.target.value }))} placeholder="100.00" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Chave PIX</Label>
              <Select value={withdrawForm.pixKeyType} onValueChange={(v) => setWithdrawForm((f) => ({ ...f, pixKeyType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpf">CPF</SelectItem>
                  <SelectItem value="cnpj">CNPJ</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="random">Aleatória</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chave PIX</Label>
              <Input value={withdrawForm.pixKey} onChange={(e) => setWithdrawForm((f) => ({ ...f, pixKey: e.target.value }))} placeholder="Sua chave PIX" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdraw(false)}>Cancelar</Button>
            <Button onClick={handleWithdraw} disabled={!withdrawForm.amount || !withdrawForm.pixKey || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Solicitar Saque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
