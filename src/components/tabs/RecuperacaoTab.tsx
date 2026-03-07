import { useState, useEffect } from 'react';
import { RotateCcw, Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getRecoveryCampaigns, createRecoveryCampaign, updateRecoveryCampaign, deleteRecoveryCampaign } from '@/lib/modules';

export default function RecuperacaoTab() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', message_template: '', delay_minutes: '30', max_attempts: '3' });

  useEffect(() => { getRecoveryCampaigns().then(setCampaigns).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.message_template) return;
    setSaving(true);
    try { const c = await createRecoveryCampaign({ name: form.name, message_template: form.message_template, delay_minutes: parseInt(form.delay_minutes) || 30, max_attempts: parseInt(form.max_attempts) || 3 }); setCampaigns(prev => [c, ...prev]); setShowDialog(false); setForm({ name: '', message_template: '', delay_minutes: '30', max_attempts: '3' }); toast.success('Campanha criada!'); }
    catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => { try { await updateRecoveryCampaign(id, { is_active: !current }); setCampaigns(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c)); } catch { toast.error('Erro'); } };
  const handleDelete = async (id: string) => { try { await deleteRecoveryCampaign(id); setCampaigns(prev => prev.filter(c => c.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Recuperação de Vendas</h3><p className="text-muted-foreground mt-1">Lembretes para carrinhos abandonados</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Nova Campanha</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{campaigns.length}</div><p className="text-sm text-muted-foreground">Campanhas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{campaigns.reduce((s, c) => s + (c.total_sent || 0), 0)}</div><p className="text-sm text-muted-foreground">Lembretes Enviados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">{campaigns.reduce((s, c) => s + (c.total_recovered || 0), 0)}</div><p className="text-sm text-muted-foreground">Vendas Recuperadas</p></CardContent></Card>
      </div>
      {campaigns.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><RotateCcw className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhuma campanha de recuperação.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">{campaigns.map(c => (
          <Card key={c.id}><CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4"><Switch checked={c.is_active} onCheckedChange={() => toggleActive(c.id, c.is_active)} /><div><p className="font-semibold">{c.name}</p><p className="text-sm text-muted-foreground">Atraso: {c.delay_minutes}min · Max: {c.max_attempts} tentativas</p><p className="text-xs text-muted-foreground mt-1">Enviados: {c.total_sent || 0} · Recuperados: {c.total_recovered || 0}</p></div></div>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-3 w-3" /></Button>
          </CardContent></Card>
        ))}</div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>Nova Campanha</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Mensagem</Label><Textarea value={form.message_template} onChange={e => setForm(f => ({ ...f, message_template: e.target.value }))} rows={4} placeholder="Oi! Notamos que você não finalizou..." /></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Atraso (min)</Label><Input type="number" value={form.delay_minutes} onChange={e => setForm(f => ({ ...f, delay_minutes: e.target.value }))} /></div><div className="space-y-2"><Label>Max tentativas</Label><Input type="number" value={form.max_attempts} onChange={e => setForm(f => ({ ...f, max_attempts: e.target.value }))} /></div></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.name || !form.message_template}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
