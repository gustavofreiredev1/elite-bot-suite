import { useState } from 'react';
import { Bell, Plus, Zap, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Notification {
  id: string;
  name: string;
  trigger: string;
  channel: string;
  isActive: boolean;
  sent: number;
}

export default function NotificacoesTab() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', name: 'Nova Venda', trigger: 'order.paid', channel: 'telegram', isActive: true, sent: 156 },
    { id: '2', name: 'Novo Lead', trigger: 'lead.created', channel: 'telegram', isActive: true, sent: 89 },
    { id: '3', name: 'Saque Solicitado', trigger: 'withdrawal.requested', channel: 'email', isActive: false, sent: 12 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', trigger: 'order.paid', channel: 'telegram' });

  const triggers = [
    { value: 'order.paid', label: 'Pagamento Confirmado' },
    { value: 'order.created', label: 'Novo Pedido' },
    { value: 'lead.created', label: 'Novo Lead' },
    { value: 'withdrawal.requested', label: 'Saque Solicitado' },
    { value: 'member.joined', label: 'Novo Membro VIP' },
    { value: 'member.expired', label: 'Acesso Expirado' },
    { value: 'bot.error', label: 'Erro no Bot' },
  ];

  const handleCreate = () => {
    if (!form.name) return;
    setNotifications(prev => [...prev, { id: Date.now().toString(), ...form, isActive: true, sent: 0 }]);
    setForm({ name: '', trigger: 'order.paid', channel: 'telegram' });
    setIsOpen(false);
    toast.success('Notificação criada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Notificações</h3>
          <p className="text-muted-foreground mt-1">Alertas automáticos por evento do sistema</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Notificação</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Notificação</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Alerta de venda" /></div>
              <div className="space-y-2">
                <Label>Evento Gatilho</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.trigger} onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}>
                  {triggers.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Canal</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}>
                  <option value="telegram">Telegram</option>
                  <option value="email">Email</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
              <Button onClick={handleCreate} className="w-full">Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <Card key={n.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{n.name}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{triggers.find(t => t.value === n.trigger)?.label || n.trigger}</Badge>
                    <Badge variant="secondary" className="text-xs">{n.channel}</Badge>
                    <span className="text-xs text-muted-foreground">{n.sent} enviadas</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={n.isActive} onCheckedChange={v => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isActive: v } : x))} />
                <Button size="sm" variant="outline" onClick={() => { setNotifications(prev => prev.filter(x => x.id !== n.id)); toast.success('Removida'); }}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
