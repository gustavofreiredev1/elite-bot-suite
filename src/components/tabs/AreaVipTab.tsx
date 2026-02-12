import { useState } from 'react';
import { Crown, Plus, UserMinus, Users, Clock, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface VipMember {
  id: string;
  name: string;
  telegramId: string;
  plan: string;
  expiresAt: string;
  isActive: boolean;
}

export default function AreaVipTab() {
  const [members, setMembers] = useState<VipMember[]>([
    { id: '1', name: 'João Silva', telegramId: '123456', plan: 'Mensal', expiresAt: '2025-03-15', isActive: true },
    { id: '2', name: 'Maria Santos', telegramId: '789012', plan: 'Anual', expiresAt: '2026-01-01', isActive: true },
  ]);
  const [autoRemove, setAutoRemove] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Área VIP</h3>
          <p className="text-muted-foreground mt-1">Controle de acesso a grupos e canais pagos</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{members.filter(m => m.isActive).length}</div><p className="text-sm text-muted-foreground">Membros Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{members.length}</div><p className="text-sm text-muted-foreground">Total de Membros</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-500">{members.filter(m => new Date(m.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</div><p className="text-sm text-muted-foreground">Vencendo em 7 dias</p></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><Switch checked={autoRemove} onCheckedChange={setAutoRemove} /><div><p className="text-sm font-medium">Remoção Automática</p><p className="text-xs text-muted-foreground">Remover ao vencer</p></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-amber-500" />Membros VIP</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telegram ID</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="font-mono text-xs">{m.telegramId}</TableCell>
                  <TableCell>{m.plan}</TableCell>
                  <TableCell>{new Date(m.expiresAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell><Badge variant={m.isActive ? 'default' : 'destructive'}>{m.isActive ? 'Ativo' : 'Expirado'}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="hover:bg-destructive/10" onClick={() => { setMembers(prev => prev.filter(x => x.id !== m.id)); toast.success('Membro removido'); }}>
                      <UserMinus className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
