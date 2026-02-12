import { useState } from 'react';
import { Calendar, Plus, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ScheduledMessage {
  id: string;
  name: string;
  message: string;
  scheduledAt: string;
  repeat: string;
  chatId: string;
  status: 'pending' | 'sent' | 'failed';
}

export default function AgendadorTab() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([
    { id: '1', name: 'Bom dia', message: 'Bom dia! Confira as novidades de hoje.', scheduledAt: '2025-03-15T08:00', repeat: 'daily', chatId: '-100123', status: 'pending' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', message: '', scheduledAt: '', repeat: 'once', chatId: '' });

  const handleCreate = () => {
    if (!form.name || !form.message || !form.scheduledAt) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), ...form, status: 'pending' }]);
    setForm({ name: '', message: '', scheduledAt: '', repeat: 'once', chatId: '' });
    setIsOpen(false);
    toast.success('Mensagem agendada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Agendador</h3>
          <p className="text-muted-foreground mt-1">Mensagens programadas por data, hora e recorrência</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Agendar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Agendar Mensagem</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Bom dia automático" /></div>
              <div className="space-y-2"><Label>Mensagem</Label><Textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Texto da mensagem..." /></div>
              <div className="space-y-2"><Label>Data e Hora</Label><Input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label>Repetição</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.repeat} onChange={e => setForm(f => ({ ...f, repeat: e.target.value }))}>
                  <option value="once">Uma vez</option>
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <div className="space-y-2"><Label>Chat ID</Label><Input value={form.chatId} onChange={e => setForm(f => ({ ...f, chatId: e.target.value }))} placeholder="-100123456789" /></div>
              <Button onClick={handleCreate} className="w-full">Agendar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Mensagens Agendadas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Data/Hora</TableHead><TableHead>Repetição</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {messages.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{new Date(m.scheduledAt).toLocaleString('pt-BR')}</TableCell>
                  <TableCell><Badge variant="outline">{m.repeat === 'once' ? 'Uma vez' : m.repeat === 'daily' ? 'Diário' : m.repeat === 'weekly' ? 'Semanal' : 'Mensal'}</Badge></TableCell>
                  <TableCell><Badge variant={m.status === 'pending' ? 'secondary' : m.status === 'sent' ? 'default' : 'destructive'}>{m.status === 'pending' ? 'Pendente' : m.status === 'sent' ? 'Enviado' : 'Falhou'}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => { setMessages(prev => prev.filter(x => x.id !== m.id)); toast.success('Removido'); }}><Trash2 className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
