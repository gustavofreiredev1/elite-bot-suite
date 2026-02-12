import { useState } from 'react';
import { QrCode, DollarSign, CreditCard, Plus, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface PixCharge {
  id: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'expired';
  pixCode: string;
  createdAt: string;
  paidAt?: string;
}

export default function PixTab() {
  const [charges, setCharges] = useState<PixCharge[]>([
    { id: '1', description: 'Acesso Premium', amount: 49.90, status: 'paid', pixCode: 'PIX123...', createdAt: '2025-03-01', paidAt: '2025-03-01' },
    { id: '2', description: 'Curso Marketing', amount: 197.00, status: 'pending', pixCode: 'PIX456...', createdAt: '2025-03-02' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '' });

  const handleCreate = () => {
    if (!form.description || !form.amount) return;
    setCharges(prev => [...prev, {
      id: Date.now().toString(), description: form.description, amount: parseFloat(form.amount),
      status: 'pending', pixCode: `PIX${Date.now()}`, createdAt: new Date().toISOString(),
    }]);
    setForm({ description: '', amount: '' });
    setIsOpen(false);
    toast.success('Cobrança PIX gerada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Pagamentos PIX</h3>
          <p className="text-muted-foreground mt-1">Gere cobranças PIX direto no chat do Telegram</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Cobrança</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Gerar Cobrança PIX</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Descrição</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Acesso Premium" /></div>
              <div className="space-y-2"><Label>Valor (R$)</Label><Input type="number" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="49.90" /></div>
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex gap-2 items-start"><QrCode className="h-5 w-5 text-primary mt-0.5" /><div><p className="text-sm font-medium">Fluxo</p><p className="text-xs text-muted-foreground">1. Bot gera QR Code PIX<br />2. Cliente paga<br />3. Confirmação automática</p></div></div>
              </div>
              <Button onClick={handleCreate} className="w-full">Gerar PIX</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">R$ {charges.filter(c => c.status === 'paid').reduce((a, c) => a + c.amount, 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Recebido</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-500">{charges.filter(c => c.status === 'pending').length}</div><p className="text-sm text-muted-foreground">Pendentes</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{charges.filter(c => c.status === 'paid').length}</div><p className="text-sm text-muted-foreground">Pagos</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cobranças</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Valor</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {charges.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.description}</TableCell>
                  <TableCell>R$ {c.amount.toFixed(2)}</TableCell>
                  <TableCell><Badge variant={c.status === 'paid' ? 'default' : c.status === 'pending' ? 'secondary' : 'destructive'}>{c.status === 'paid' ? 'Pago' : c.status === 'pending' ? 'Pendente' : 'Expirado'}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(c.pixCode); toast.success('Código copiado!'); }}><Copy className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
