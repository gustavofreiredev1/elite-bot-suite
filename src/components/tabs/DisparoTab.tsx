import { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Loader2, Play, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getBroadcasts, createBroadcast, deleteBroadcast, updateBroadcast } from '@/lib/modules';

export default function DisparoTab() {
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', message_content: '', target_type: 'all' });

  useEffect(() => {
    getBroadcasts().then(setBroadcasts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.message_content) return;
    setSaving(true);
    try {
      const b = await createBroadcast(form);
      setBroadcasts(prev => [b, ...prev]);
      setShowDialog(false);
      setForm({ name: '', message_content: '', target_type: 'all' });
      toast.success('Disparo criado!');
    } catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const handleSend = async (id: string) => {
    try {
      await updateBroadcast(id, { status: 'sending', started_at: new Date().toISOString() });
      setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, status: 'sending' } : b));
      toast.success('Disparo iniciado!');
    } catch { toast.error('Erro ao iniciar'); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteBroadcast(id); setBroadcasts(prev => prev.filter(b => b.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); }
  };

  const statusMap: Record<string, string> = { draft: 'Rascunho', sending: 'Enviando', completed: 'Concluído', failed: 'Falhou' };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Disparo em Massa</h3><p className="text-muted-foreground mt-1">Broadcast ilimitado para seus contatos</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Novo Disparo</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{broadcasts.length}</div><p className="text-sm text-muted-foreground">Total de Disparos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{broadcasts.filter(b => b.status === 'completed').length}</div><p className="text-sm text-muted-foreground">Concluídos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{broadcasts.reduce((sum, b) => sum + (b.total_sent || 0), 0)}</div><p className="text-sm text-muted-foreground">Mensagens Enviadas</p></CardContent></Card>
      </div>
      {broadcasts.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Send className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum disparo criado ainda.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {broadcasts.map(b => (
            <Card key={b.id}><CardContent className="flex items-center justify-between py-4">
              <div><p className="font-semibold">{b.name}</p><p className="text-sm text-muted-foreground line-clamp-1">{b.message_content}</p><p className="text-xs text-muted-foreground mt-1">{new Date(b.created_at).toLocaleDateString('pt-BR')}</p></div>
              <div className="flex items-center gap-3">
                <Badge variant={b.status === 'completed' ? 'default' : b.status === 'sending' ? 'secondary' : 'outline'}>{statusMap[b.status] || b.status}</Badge>
                {b.status === 'draft' && <Button size="sm" onClick={() => handleSend(b.id)}><Play className="h-3 w-3 mr-1" />Enviar</Button>}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(b.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Disparo</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Black Friday" /></div>
            <div className="space-y-2"><Label>Mensagem</Label><Textarea value={form.message_content} onChange={e => setForm(f => ({ ...f, message_content: e.target.value }))} rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.message_content}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
