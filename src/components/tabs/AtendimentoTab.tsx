import { useState, useEffect } from 'react';
import { Bot, Plus, Trash2, Loader2, MessageCircle } from 'lucide-react';
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
import { getAutoResponses, createAutoResponse, updateAutoResponse, deleteAutoResponse } from '@/lib/modules';

export default function AtendimentoTab() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ trigger_keyword: '', match_type: 'contains', response_text: '' });

  useEffect(() => { getAutoResponses().then(setResponses).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleCreate = async () => {
    if (!form.trigger_keyword || !form.response_text) return;
    setSaving(true);
    try { const r = await createAutoResponse(form); setResponses(prev => [r, ...prev]); setShowDialog(false); setForm({ trigger_keyword: '', match_type: 'contains', response_text: '' }); toast.success('Resposta automática criada!'); }
    catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const toggleActive = async (id: string, current: boolean) => { try { await updateAutoResponse(id, { is_active: !current }); setResponses(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r)); } catch { toast.error('Erro'); } };
  const handleDelete = async (id: string) => { try { await deleteAutoResponse(id); setResponses(prev => prev.filter(r => r.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Atendimento Automático</h3><p className="text-muted-foreground mt-1">Respostas automáticas por palavras-chave</p></div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Nova Resposta</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{responses.length}</div><p className="text-sm text-muted-foreground">Respostas Configuradas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{responses.filter(r => r.is_active).length}</div><p className="text-sm text-muted-foreground">Ativas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{responses.reduce((s, r) => s + (r.times_triggered || 0), 0)}</div><p className="text-sm text-muted-foreground">Vezes Acionadas</p></CardContent></Card>
      </div>
      {responses.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><MessageCircle className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhuma resposta automática configurada.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">{responses.map(r => (
          <Card key={r.id}><CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4"><Switch checked={r.is_active} onCheckedChange={() => toggleActive(r.id, r.is_active)} />
              <div><div className="flex items-center gap-2"><Badge variant="outline">{r.match_type === 'exact' ? 'Exato' : r.match_type === 'starts_with' ? 'Começa com' : 'Contém'}</Badge><span className="font-mono text-sm font-bold">{r.trigger_keyword}</span></div><p className="text-sm text-muted-foreground line-clamp-1 mt-1">{r.response_text}</p><p className="text-xs text-muted-foreground">Acionado {r.times_triggered || 0}x</p></div>
            </div>
            <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}><Trash2 className="h-3 w-3" /></Button>
          </CardContent></Card>
        ))}</div>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>Nova Resposta Automática</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Palavra-chave</Label><Input value={form.trigger_keyword} onChange={e => setForm(f => ({ ...f, trigger_keyword: e.target.value }))} placeholder="/start, preço, ajuda..." /></div>
          <div className="space-y-2"><Label>Tipo</Label><Select value={form.match_type} onValueChange={v => setForm(f => ({ ...f, match_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="contains">Contém</SelectItem><SelectItem value="exact">Exato</SelectItem><SelectItem value="starts_with">Começa com</SelectItem></SelectContent></Select></div>
          <div className="space-y-2"><Label>Resposta</Label><Textarea value={form.response_text} onChange={e => setForm(f => ({ ...f, response_text: e.target.value }))} rows={4} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.trigger_keyword || !form.response_text}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
