import { useState } from 'react';
import { Share2, Plus, DollarSign, Copy, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  clicks: number;
  sales: number;
  commission: number;
  totalEarned: number;
}

export default function AfiliadosTab() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([
    { id: '1', name: 'Carlos Lima', email: 'carlos@email.com', code: 'CARLOS10', clicks: 450, sales: 23, commission: 20, totalEarned: 912 },
    { id: '2', name: 'Ana Souza', email: 'ana@email.com', code: 'ANA15', clicks: 320, sales: 15, commission: 15, totalEarned: 443 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', commission: '20' });

  const handleCreate = () => {
    if (!form.name || !form.email) return;
    const code = form.name.split(' ')[0].toUpperCase() + Math.floor(Math.random() * 100);
    setAffiliates(prev => [...prev, { id: Date.now().toString(), name: form.name, email: form.email, code, clicks: 0, sales: 0, commission: parseInt(form.commission), totalEarned: 0 }]);
    setForm({ name: '', email: '', commission: '20' });
    setIsOpen(false);
    toast.success('Afiliado cadastrado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Afiliados</h3>
          <p className="text-muted-foreground mt-1">Gerencie links, comissões e rastreamento</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Afiliado</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Afiliado</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Comissão (%)</Label><Input type="number" value={form.commission} onChange={e => setForm(f => ({ ...f, commission: e.target.value }))} /></div>
              <Button onClick={handleCreate} className="w-full">Cadastrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{affiliates.length}</div><p className="text-sm text-muted-foreground">Afiliados Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{affiliates.reduce((a, af) => a + af.sales, 0)}</div><p className="text-sm text-muted-foreground">Vendas por Afiliados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">R$ {affiliates.reduce((a, af) => a + af.totalEarned, 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Comissões Pagas</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5 text-primary" />Afiliados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Código</TableHead><TableHead>Cliques</TableHead><TableHead>Vendas</TableHead><TableHead>Comissão</TableHead><TableHead>Total Ganho</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {affiliates.map(af => (
                <TableRow key={af.id}>
                  <TableCell className="font-medium">{af.name}</TableCell>
                  <TableCell><Badge variant="outline" className="font-mono">{af.code}</Badge></TableCell>
                  <TableCell>{af.clicks}</TableCell>
                  <TableCell>{af.sales}</TableCell>
                  <TableCell>{af.commission}%</TableCell>
                  <TableCell className="text-emerald-500 font-medium">R$ {af.totalEarned.toFixed(2)}</TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/checkout/produto?ref=${af.code}`); toast.success('Link copiado!'); }}><Copy className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
