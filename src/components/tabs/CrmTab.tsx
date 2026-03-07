import { useState, useEffect } from 'react';
import { Users2, Plus, Trash2, Loader2, Search, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getCrmContacts, createCrmContact, updateCrmContact, deleteCrmContact } from '@/lib/modules';

export default function CrmTab() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', telegram_username: '', phone: '', email: '', tags: '', notes: '' });

  useEffect(() => { getCrmContacts().then(setContacts).catch(() => {}).finally(() => setLoading(false)); }, []);

  const filtered = contacts.filter(c => (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase()) || (c.telegram_username || '').toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!form.name && !form.telegram_username) return;
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
      if (editingId) { const u = await updateCrmContact(editingId, payload); setContacts(prev => prev.map(c => c.id === editingId ? u : c)); toast.success('Atualizado!'); }
      else { const c = await createCrmContact(payload); setContacts(prev => [c, ...prev]); toast.success('Contato adicionado!'); }
      setShowDialog(false); resetForm();
    } catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const resetForm = () => { setEditingId(null); setForm({ name: '', telegram_username: '', phone: '', email: '', tags: '', notes: '' }); };
  const handleEdit = (c: any) => { setEditingId(c.id); setForm({ name: c.name || '', telegram_username: c.telegram_username || '', phone: c.phone || '', email: c.email || '', tags: (c.tags || []).join(', '), notes: c.notes || '' }); setShowDialog(true); };
  const handleDelete = async (id: string) => { try { await deleteCrmContact(id); setContacts(prev => prev.filter(c => c.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">CRM Telegram</h3><p className="text-muted-foreground mt-1">Tags, listas e histórico de contatos</p></div>
        <Button onClick={() => { resetForm(); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />Novo Contato</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{contacts.length}</div><p className="text-sm text-muted-foreground">Total Contatos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{contacts.filter(c => c.status === 'active').length}</div><p className="text-sm text-muted-foreground">Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(contacts.flatMap(c => c.tags || [])).size}</div><p className="text-sm text-muted-foreground">Tags Únicas</p></CardContent></Card>
      </div>
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Buscar contatos..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} /></div>
      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Users2 className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum contato encontrado.</p></CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6">
          <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telegram</TableHead><TableHead>Email</TableHead><TableHead>Tags</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>{filtered.map(c => (<TableRow key={c.id}><TableCell className="font-medium">{c.name || '-'}</TableCell><TableCell>{c.telegram_username ? `@${c.telegram_username}` : '-'}</TableCell><TableCell>{c.email || '-'}</TableCell><TableCell><div className="flex gap-1 flex-wrap">{(c.tags || []).map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell><TableCell><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => handleEdit(c)}><Edit className="h-3 w-3" /></Button><Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent></Card>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>{editingId ? 'Editar' : 'Novo'} Contato</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Username Telegram</Label><Input value={form.telegram_username} onChange={e => setForm(f => ({ ...f, telegram_username: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Tags (vírgula)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="cliente, vip" /></div>
          <div className="space-y-2"><Label>Notas</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleSave} disabled={saving || (!form.name && !form.telegram_username)}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editingId ? 'Salvar' : 'Criar'}</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
