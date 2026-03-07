import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Loader2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getScheduledMessages, createScheduledMessage, deleteScheduledMessage, updateScheduledMessage } from '@/lib/modules';

export default function AgendadorTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', message_content: '', schedule_at: '', schedule_type: 'once', repeat_interval: '' });

  useEffect(() => { getScheduledMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.message_content || !form.schedule_at) return;
    setSaving(true);
    try {
      const msg = await createScheduledMessage(form);
      setMessages(prev => [...prev, msg].sort((a, b) => new Date(a.schedule_at).getTime() - new Date(b.schedule_at).getTime()));
      setShowDialog(false); setForm({ name: '', message_content: '', schedule_at: '', schedule_type: 'once', repeat_interval: '' });
      toast.success('Agendamento criado!');
    } catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try { await updateScheduledMessage(id, { is_active: !current }); setMessages(prev => prev.map(m => m.id === id ? { ...m, is_active: !current } : m)); } catch { toast.error('Erro'); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteScheduledMessage(id); setMessages(prev => prev.filter(m => m.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Agendador</h3><p className="text-muted-foreground mt-1">Mensagens programadas com recorrência</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Novo Agendamento</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{messages.length}</div><p className="text-sm text-muted-foreground">Agendamentos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{messages.filter(m => m.is_active).length}</div><p className="text-sm text-muted-foreground">Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{messages.filter(m => m.schedule_type === 'recurring').length}</div><p className="text-sm text-muted-foreground">Recorrentes</p></CardContent></Card>
      </div>
      {messages.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Calendar className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum agendamento criado.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <Card key={m.id}><CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Switch checked={m.is_active} onCheckedChange={() => toggleActive(m.id, m.is_active)} />
                <div><p className="font-semibold">{m.name}</p><p className="text-sm text-muted-foreground line-clamp-1">{m.message_content}</p>
                  <div className="flex items-center gap-2 mt-1"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-xs text-muted-foreground">{new Date(m.schedule_at).toLocaleString('pt-BR')}</span><Badge variant="outline" className="text-xs">{m.schedule_type === 'recurring' ? 'Recorrente' : 'Único'}</Badge></div>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(m.id)}><Trash2 className="h-3 w-3" /></Button>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Agendamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Mensagem</Label><Textarea value={form.message_content} onChange={e => setForm(f => ({ ...f, message_content: e.target.value }))} rows={3} /></div>
            <div className="space-y-2"><Label>Data/Hora</Label><Input type="datetime-local" value={form.schedule_at} onChange={e => setForm(f => ({ ...f, schedule_at: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Tipo</Label>
              <Select value={form.schedule_type} onValueChange={v => setForm(f => ({ ...f, schedule_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="once">Único</SelectItem><SelectItem value="recurring">Recorrente</SelectItem></SelectContent></Select>
            </div>
            {form.schedule_type === 'recurring' && <div className="space-y-2"><Label>Intervalo</Label><Select value={form.repeat_interval} onValueChange={v => setForm(f => ({ ...f, repeat_interval: v }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="daily">Diário</SelectItem><SelectItem value="weekly">Semanal</SelectItem><SelectItem value="monthly">Mensal</SelectItem></SelectContent></Select></div>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.name || !form.message_content || !form.schedule_at}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
