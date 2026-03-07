import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Copy, ExternalLink, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getProducts } from '@/lib/products';
import { useNavigate } from 'react-router-dom';

export default function CheckoutProTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false)); }, []);
  const copyLink = (slug: string) => { navigator.clipboard.writeText(`${window.location.origin}/checkout/${slug}`); toast.success('Link copiado!'); };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h3 className="text-2xl font-bold">Checkout Pro</h3><p className="text-muted-foreground mt-1">Páginas de venda estilo Kiwify</p></div>
        <Button onClick={() => navigate('/products')}><Plus className="mr-2 h-4 w-4" />Novo Produto</Button>
      </div>
      {products.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><CreditCard className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Crie um produto para gerar seu checkout.</p><Button onClick={() => navigate('/products')}>Criar Produto</Button></CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{products.map(p => (
          <Card key={p.id} className="card-glow"><CardHeader><div className="flex items-start justify-between"><CardTitle className="text-lg">{p.name}</CardTitle><Badge variant={p.is_active ? 'default' : 'secondary'}>{p.is_active ? 'Ativo' : 'Inativo'}</Badge></div><p className="text-2xl font-bold text-primary mt-2">R$ {p.price.toFixed(2)}</p></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground mb-4">{p.description || 'Sem descrição'}</p><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => copyLink(p.slug)}><Copy className="h-3 w-3 mr-1" />Link</Button><Button variant="outline" size="sm" onClick={() => window.open(`/checkout/${p.slug}`, '_blank')}><ExternalLink className="h-3 w-3 mr-1" />Abrir</Button></div><p className="text-xs text-muted-foreground mt-3 font-mono">{window.location.origin}/checkout/{p.slug}</p></CardContent>
          </Card>
        ))}</div>
      )}
    </div>
  );
}
