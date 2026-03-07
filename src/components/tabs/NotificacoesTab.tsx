import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Loader2 } from 'lucide-react';
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
import { getNotifications, createNotification, updateNotification, deleteNotification } from '@/lib/modules';

export default function NotificacoesTab() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'info', trigger_event: 'new_sale' });

  useEffect(() => { getNotifications().then(setNotifs).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.message) return;
    setSaving(true);
    try { const n = await createNotification(form); setNotifs(prev => [n, ...prev]); setShowDialog(false); setForm({ title: '', message: '', type: 'info', trigger_event: 'new_sale' }); toast.success('Notificação criada!'); }
    catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => { try { await updateNotification(id, { is_active: !current }); setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_active: !current } : n)); } catch { toast.error('Erro'); } };
  const handleDelete = async (id: string) => { try { await deleteNotification(id); setNotifs(prev => prev.filter(n => n.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };

  const eventLabels: Record<string, string> = { new_sale: 'Nova Venda', new_lead: 'Novo Lead', payment_confirmed: 'Pagamento Confirmado', subscription_expired: 'Assinatura Expirada', new_member: 'Novo Membro' };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Notificações</h3><p className="text-muted-foreground mt-1">Alertas automáticos para eventos</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Nova Notificação</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{notifs.length}</div><p className="text-sm text-muted-foreground">Notificações</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{notifs.filter(n => n.is_active).length}</div><p className="text-sm text-muted-foreground">Ativas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(notifs.map(n => n.trigger_event)).size}</div><p className="text-sm text-muted-foreground">Eventos</p></CardContent></Card>
      </div>
      {notifs.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Bell className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhuma notificação configurada.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">{notifs.map(n => (
          <Card key={n.id}><CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4"><Switch checked={n.is_active} onCheckedChange={() => toggleActive(n.id, n.is_active)} /><div><p className="font-semibold">{n.title}</p><p className="text-sm text-muted-foreground line-clamp-1">{n.message}</p><Badge variant="outline" className="text-xs mt-1">{eventLabels[n.trigger_event] || n.trigger_event}</Badge></div></div>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(n.id)}><Trash2 className="h-3 w-3" /></Button>
          </CardContent></Card>
        ))}</div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>Nova Notificação</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Título</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Mensagem</Label><Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3} /></div>
          <div className="space-y-2"><Label>Evento</Label><Select value={form.trigger_event} onValueChange={v => setForm(f => ({ ...f, trigger_event: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new_sale">Nova Venda</SelectItem><SelectItem value="new_lead">Novo Lead</SelectItem><SelectItem value="payment_confirmed">Pagamento Confirmado</SelectItem><SelectItem value="subscription_expired">Assinatura Expirada</SelectItem><SelectItem value="new_member">Novo Membro</SelectItem></SelectContent></Select></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.title || !form.message}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
