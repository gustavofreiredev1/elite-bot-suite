import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Package, Plus, Trash2, Edit, Copy, ExternalLink, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/products';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  slug: string;
  is_active: boolean;
  delivery_type: string;
  delivery_content: string | null;
  product_type: string;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    slug: '',
    delivery_type: 'text',
    delivery_content: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data as Product[]);
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.name);
      if (editingId) {
        await updateProduct(editingId, { ...form, price: parseFloat(form.price), slug });
        toast.success('Produto atualizado!');
      } else {
        await createProduct({ ...form, price: parseFloat(form.price), slug });
        toast.success('Produto criado!');
      }
      setShowDialog(false);
      resetForm();
      loadProducts();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este produto?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produto excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      slug: p.slug,
      delivery_type: p.delivery_type,
      delivery_content: p.delivery_content || '',
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', slug: '', delivery_type: 'text', delivery_content: '' });
  };

  const copyCheckoutLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/checkout/${slug}`);
    toast.success('Link copiado!');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Produtos"
          description="Gerencie seus produtos digitais e links de checkout"
          icon={Package}
          breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Produtos' }]}
          actions={
            <Button onClick={() => { resetForm(); setShowDialog(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          }
        />

        {products.length === 0 ? (
          <Card className="card-elegant">
            <CardContent className="flex flex-col items-center py-16 space-y-4">
              <Package className="h-16 w-16 text-muted-foreground/30" />
              <h3 className="font-semibold text-lg">Nenhum produto cadastrado</h3>
              <p className="text-muted-foreground">Crie seu primeiro produto para vender via Telegram.</p>
              <Button onClick={() => { resetForm(); setShowDialog(true); }} className="hover-glow">
                <Plus className="mr-2 h-4 w-4" />
                Criar Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Card key={p.id} className="card-glow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {p.name}
                        <Badge variant={p.is_active ? 'default' : 'secondary'}>
                          {p.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">{p.description || 'Sem descrição'}</CardDescription>
                    </div>
                    <div className="text-xl font-bold text-primary">
                      R$ {p.price.toFixed(2)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyCheckoutLink(p.slug)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Link
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`/checkout/${p.slug}`, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
            <DialogDescription>Configure os detalhes do seu produto digital.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex: Curso de Vendas" />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descreva seu produto" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="49.90" />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={form.slug || generateSlug(form.name)} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="curso-vendas" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Entrega</Label>
              <Select value={form.delivery_type} onValueChange={(v) => setForm((f) => ({ ...f, delivery_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto/Link</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                  <SelectItem value="group">Grupo Telegram</SelectItem>
                  <SelectItem value="bot_message">Mensagem do Bot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo de Entrega</Label>
              <Textarea value={form.delivery_content} onChange={(e) => setForm((f) => ({ ...f, delivery_content: e.target.value }))} placeholder="Link, mensagem ou instrução de entrega" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.price || saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
