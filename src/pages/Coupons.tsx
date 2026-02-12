import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Ticket, Plus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getCoupons, createCoupon } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

export default function Coupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', max_uses: '' });

  useEffect(() => {
    getCoupons()
      .then(setCoupons)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.code || !form.discount_value) return;
    setSaving(true);
    try {
      const coupon = await createCoupon({
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        max_uses: form.max_uses ? parseInt(form.max_uses) : undefined,
      });
      setCoupons((prev) => [coupon, ...prev]);
      setShowDialog(false);
      setForm({ code: '', discount_type: 'percentage', discount_value: '', max_uses: '' });
      toast.success('Cupom criado!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar cupom');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este cupom?')) return;
    try {
      await supabase.from('coupons').delete().eq('id', id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      toast.success('Cupom excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Cupons"
          description="Gerencie cupons de desconto"
          icon={Ticket}
          breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Cupons' }]}
          actions={<Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Novo Cupom</Button>}
        />

        {coupons.length === 0 ? (
          <Card className="card-elegant">
            <CardContent className="flex flex-col items-center py-16 space-y-4">
              <Ticket className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="font-semibold text-lg">Nenhum cupom criado</h3>
              <Button onClick={() => setShowDialog(true)} className="hover-glow"><Plus className="mr-2 h-4 w-4" />Criar Cupom</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coupons.map((c) => (
              <Card key={c.id} className="card-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-mono">{c.code}</CardTitle>
                    <Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-2xl font-bold text-primary">
                    {c.discount_type === 'percentage' ? `${c.discount_value}%` : `R$ ${c.discount_value}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Usos: {c.current_uses}{c.max_uses ? `/${c.max_uses}` : ' (ilimitado)'}
                  </p>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Cupom</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Código</Label>
              <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="DESCONTO10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={form.discount_type} onValueChange={(v) => setForm((f) => ({ ...f, discount_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem</SelectItem>
                    <SelectItem value="fixed">Valor Fixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input type="number" value={form.discount_value} onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))} placeholder="10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Máximo de usos (vazio = ilimitado)</Label>
              <Input type="number" value={form.max_uses} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))} placeholder="100" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.code || !form.discount_value || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
