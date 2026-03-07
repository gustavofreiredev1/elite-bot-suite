import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Loader2, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getVipMembers, createVipMember, updateVipMember, deleteVipMember } from '@/lib/modules';

export default function AreaVipTab() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', telegram_id: '', telegram_username: '', plan_name: '', expires_at: '' });

  useEffect(() => { getVipMembers().then(setMembers).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!form.telegram_id) return;
    setSaving(true);
    try {
      const member = await createVipMember({ telegram_id: parseInt(form.telegram_id), telegram_username: form.telegram_username || undefined, name: form.name || undefined, plan_name: form.plan_name || undefined, expires_at: form.expires_at || undefined });
      setMembers(prev => [member, ...prev]); setShowDialog(false); setForm({ name: '', telegram_id: '', telegram_username: '', plan_name: '', expires_at: '' });
      toast.success('Membro VIP adicionado!');
    } catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { try { await deleteVipMember(id); setMembers(prev => prev.filter(m => m.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };
  const toggleStatus = async (id: string, current: string) => { const s = current === 'active' ? 'expired' : 'active'; try { await updateVipMember(id, { status: s }); setMembers(prev => prev.map(m => m.id === id ? { ...m, status: s } : m)); } catch { toast.error('Erro'); } };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Área VIP</h3><p className="text-muted-foreground mt-1">Controle de membros e pagantes</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Novo Membro</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{members.length}</div><p className="text-sm text-muted-foreground">Total Membros</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">{members.filter(m => m.status === 'active').length}</div><p className="text-sm text-muted-foreground">Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-amber-500">{members.filter(m => m.status === 'expired').length}</div><p className="text-sm text-muted-foreground">Expirados</p></CardContent></Card>
      </div>
      {members.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Crown className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum membro VIP ainda.</p></CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6">
          <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telegram ID</TableHead><TableHead>Username</TableHead><TableHead>Plano</TableHead><TableHead>Expira</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>{members.map(m => (<TableRow key={m.id}><TableCell className="font-medium">{m.name || '-'}</TableCell><TableCell className="font-mono text-xs">{m.telegram_id}</TableCell><TableCell>{m.telegram_username ? `@${m.telegram_username}` : '-'}</TableCell><TableCell>{m.plan_name || '-'}</TableCell><TableCell className="text-sm text-muted-foreground">{m.expires_at ? new Date(m.expires_at).toLocaleDateString('pt-BR') : 'Vitalício'}</TableCell><TableCell><Badge variant={m.status === 'active' ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => toggleStatus(m.id, m.status)}>{m.status === 'active' ? 'Ativo' : 'Expirado'}</Badge></TableCell><TableCell><Button size="sm" variant="ghost" onClick={() => handleDelete(m.id)}><Trash2 className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent></Card>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>Adicionar Membro VIP</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Telegram ID *</Label><Input value={form.telegram_id} onChange={e => setForm(f => ({ ...f, telegram_id: e.target.value }))} placeholder="123456789" /></div>
          <div className="space-y-2"><Label>Username</Label><Input value={form.telegram_username} onChange={e => setForm(f => ({ ...f, telegram_username: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Plano</Label><Input value={form.plan_name} onChange={e => setForm(f => ({ ...f, plan_name: e.target.value }))} placeholder="Premium" /></div>
          <div className="space-y-2"><Label>Expira em</Label><Input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.telegram_id}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
