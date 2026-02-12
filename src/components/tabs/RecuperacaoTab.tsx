import { useState } from 'react';
import { RefreshCcw, Mail, DollarSign, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface AbandonedCart {
  id: string;
  buyerName: string;
  product: string;
  amount: number;
  abandonedAt: string;
  remindersSent: number;
  recovered: boolean;
}

export default function RecuperacaoTab() {
  const [enabled, setEnabled] = useState(true);
  const [carts, setCarts] = useState<AbandonedCart[]>([
    { id: '1', buyerName: 'João Silva', product: 'Curso Premium', amount: 197, abandonedAt: '2025-03-01', remindersSent: 2, recovered: false },
    { id: '2', buyerName: 'Maria Santos', product: 'eBook Marketing', amount: 47, abandonedAt: '2025-03-02', remindersSent: 1, recovered: true },
  ]);
  const [config, setConfig] = useState({
    delay1: '30',
    delay2: '120',
    delay3: '1440',
    message1: '👋 Oi! Vi que você se interessou pelo {produto}. Ainda está disponível com desconto especial!',
    message2: '⏰ Última chance! O {produto} está com preço especial por tempo limitado.',
    couponEnabled: true,
    couponDiscount: '10',
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Recuperação de Vendas</h3>
          <p className="text-muted-foreground mt-1">Lembretes automáticos para carrinhos abandonados</p>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Badge variant={enabled ? 'default' : 'secondary'}>{enabled ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{carts.length}</div><p className="text-sm text-muted-foreground">Carrinhos Abandonados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">{carts.filter(c => c.recovered).length}</div><p className="text-sm text-muted-foreground">Recuperados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{carts.length > 0 ? ((carts.filter(c => c.recovered).length / carts.length) * 100).toFixed(0) : 0}%</div><p className="text-sm text-muted-foreground">Taxa de Recuperação</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">R$ {carts.filter(c => c.recovered).reduce((a, c) => a + c.amount, 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Valor Recuperado</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />Configurações de Recuperação</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>1ª Mensagem (min)</Label><Input value={config.delay1} onChange={e => setConfig(c => ({ ...c, delay1: e.target.value }))} /></div>
            <div className="space-y-2"><Label>2ª Mensagem (min)</Label><Input value={config.delay2} onChange={e => setConfig(c => ({ ...c, delay2: e.target.value }))} /></div>
            <div className="space-y-2"><Label>3ª Mensagem (min)</Label><Input value={config.delay3} onChange={e => setConfig(c => ({ ...c, delay3: e.target.value }))} /></div>
          </div>
          <div className="flex items-center gap-3"><Switch checked={config.couponEnabled} onCheckedChange={v => setConfig(c => ({ ...c, couponEnabled: v }))} /><div><p className="text-sm font-medium">Cupom Automático</p><p className="text-xs text-muted-foreground">Enviar cupom de desconto na última mensagem</p></div></div>
          <Button onClick={() => toast.success('Salvo!')}>Salvar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Carrinhos Abandonados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Comprador</TableHead><TableHead>Produto</TableHead><TableHead>Valor</TableHead><TableHead>Lembretes</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {carts.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.buyerName}</TableCell>
                  <TableCell>{c.product}</TableCell>
                  <TableCell>R$ {c.amount.toFixed(2)}</TableCell>
                  <TableCell>{c.remindersSent}/3</TableCell>
                  <TableCell><Badge variant={c.recovered ? 'default' : 'secondary'}>{c.recovered ? '✅ Recuperado' : 'Pendente'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
