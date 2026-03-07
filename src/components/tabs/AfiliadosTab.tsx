import { useState, useEffect } from 'react';
import { Link2, Plus, Trash2, Loader2, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getAffiliates, createAffiliate, deleteAffiliate } from '@/lib/modules';
import { getProducts } from '@/lib/products';

export default function AfiliadosTab() {
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ product_id: '', affiliate_name: '', affiliate_email: '', commission_percent: '10', affiliate_code: '' });

  useEffect(() => { Promise.all([getAffiliates(), getProducts()]).then(([a, p]) => { setAffiliates(a); setProducts(p); }).catch(() => {}).finally(() => setLoading(false)); }, []);

  const generateCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleCreate = async () => {
    if (!form.product_id || !form.affiliate_name) return;
    setSaving(true);
    try { const aff = await createAffiliate({ product_id: form.product_id, affiliate_name: form.affiliate_name, affiliate_email: form.affiliate_email || undefined, commission_percent: parseFloat(form.commission_percent), affiliate_code: form.affiliate_code || generateCode() }); setAffiliates(prev => [aff, ...prev]); setShowDialog(false); setForm({ product_id: '', affiliate_name: '', affiliate_email: '', commission_percent: '10', affiliate_code: '' }); toast.success('Afiliado adicionado!'); }
    catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => { try { await deleteAffiliate(id); setAffiliates(prev => prev.filter(a => a.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); } };
  const copyLink = (code: string) => { navigator.clipboard.writeText(`${window.location.origin}/checkout?ref=${code}`); toast.success('Link copiado!'); };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Afiliados</h3><p className="text-muted-foreground mt-1">Links, comissões e rastreio de vendas</p></div>
        <Button onClick={() => { setForm(f => ({ ...f, affiliate_code: generateCode() })); setShowDialog(true); }}><Plus className="mr-2 h-4 w-4" />Novo Afiliado</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{affiliates.length}</div><p className="text-sm text-muted-foreground">Afiliados</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{affiliates.reduce((s, a) => s + (a.total_sales || 0), 0)}</div><p className="text-sm text-muted-foreground">Vendas Totais</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">R$ {affiliates.reduce((s, a) => s + (a.total_earned || 0), 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Comissões</p></CardContent></Card>
      </div>
      {affiliates.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Link2 className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhum afiliado cadastrado.</p></CardContent></Card>
      ) : (
        <Card><CardContent className="pt-6">
          <Table><TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Código</TableHead><TableHead>Comissão</TableHead><TableHead>Vendas</TableHead><TableHead>Ganhos</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>{affiliates.map(a => (<TableRow key={a.id}><TableCell className="font-medium">{a.affiliate_name}</TableCell><TableCell className="font-mono text-xs">{a.affiliate_code}</TableCell><TableCell>{a.commission_percent}%</TableCell><TableCell>{a.total_sales || 0}</TableCell><TableCell>R$ {(a.total_earned || 0).toFixed(2)}</TableCell><TableCell><div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => copyLink(a.affiliate_code)}><Copy className="h-3 w-3" /></Button><Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}><Trash2 className="h-3 w-3" /></Button></div></TableCell></TableRow>))}</TableBody>
          </Table>
        </CardContent></Card>
      )}
      <Dialog open={showDialog} onOpenChange={setShowDialog}><DialogContent><DialogHeader><DialogTitle>Novo Afiliado</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input value={form.affiliate_name} onChange={e => setForm(f => ({ ...f, affiliate_name: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={form.affiliate_email} onChange={e => setForm(f => ({ ...f, affiliate_email: e.target.value }))} /></div>
          <div className="space-y-2"><Label>Produto</Label><Select value={form.product_id} onValueChange={v => setForm(f => ({ ...f, product_id: v }))}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Comissão (%)</Label><Input type="number" value={form.commission_percent} onChange={e => setForm(f => ({ ...f, commission_percent: e.target.value }))} /></div><div className="space-y-2"><Label>Código</Label><Input value={form.affiliate_code} onChange={e => setForm(f => ({ ...f, affiliate_code: e.target.value }))} /></div></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button><Button onClick={handleCreate} disabled={saving || !form.product_id || !form.affiliate_name}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar</Button></DialogFooter>
      </DialogContent></Dialog>
    </div>
  );
}
