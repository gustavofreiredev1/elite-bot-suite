import { useState, useEffect } from 'react';
import { UserPlus, Download, Search, Trash2, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getLeads, createLead, deleteLead } from '@/lib/modules';

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'manual', tags: '' });

  useEffect(() => {
    getLeads().then(setLeads).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter(l =>
    (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.name && !form.email) return;
    setSaving(true);
    try {
      const lead = await createLead({
        name: form.name || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        source: form.source,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      });
      setLeads(prev => [lead, ...prev]);
      setShowDialog(false);
      setForm({ name: '', phone: '', email: '', source: 'manual', tags: '' });
      toast.success('Lead adicionado!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l.id !== id));
      toast.success('Lead removido');
    } catch { toast.error('Erro ao remover'); }
  };

  const exportCSV = () => {
    const csv = 'Nome,Telefone,Email,Origem,Tags\n' + leads.map(l =>
      `"${l.name || ''}","${l.phone || ''}","${l.email || ''}","${l.source || ''}","${(l.tags || []).join(',')}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    toast.success('Leads exportados!');
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Captura de Leads</h3>
          <p className="text-muted-foreground mt-1">Coleta automática de contatos com segmentação</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" disabled={leads.length === 0}><Download className="mr-2 h-4 w-4" />Exportar CSV</Button>
          <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Novo Lead</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{leads.length}</div><p className="text-sm text-muted-foreground">Total de Leads</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{leads.filter(l => (l.tags || []).includes('hot')).length}</div><p className="text-sm text-muted-foreground">Leads Quentes</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(leads.map(l => l.source)).size}</div><p className="text-sm text-muted-foreground">Origens</p></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar leads..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />Leads Capturados</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum lead encontrado.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telefone</TableHead><TableHead>Email</TableHead><TableHead>Origem</TableHead><TableHead>Tags</TableHead><TableHead>Data</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.name || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">{l.phone || '-'}</TableCell>
                    <TableCell>{l.email || '-'}</TableCell>
                    <TableCell>{l.source}</TableCell>
                    <TableCell><div className="flex gap-1">{(l.tags || []).map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(l.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => handleDelete(l.id)}><Trash2 className="h-3 w-3" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Lead</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do contato" /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+5511999999999" /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" /></div>
            <div className="space-y-2"><Label>Origem</Label><Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="Bot, Landing Page, etc" /></div>
            <div className="space-y-2"><Label>Tags (separadas por vírgula)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="hot, premium" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || (!form.name && !form.email)}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
