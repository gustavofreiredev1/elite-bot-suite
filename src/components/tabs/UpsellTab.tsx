import { useState, useEffect } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts } from '@/lib/products';

export default function UpsellTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getProducts().then(setProducts).catch(() => {}).finally(() => setLoading(false)); }, []);
  const withUpsell = products.filter(p => p.upsell_product_id || p.order_bump_product_id);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h3 className="text-2xl font-bold">Upsell & Ofertas</h3><p className="text-muted-foreground mt-1">Order bump, upsell e downsell</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{products.length}</div><p className="text-sm text-muted-foreground">Produtos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{withUpsell.length}</div><p className="text-sm text-muted-foreground">Com Upsell/Bump</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{products.length - withUpsell.length}</div><p className="text-sm text-muted-foreground">Sem Ofertas</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Configuração de Ofertas</CardTitle></CardHeader><CardContent>
        <p className="text-muted-foreground mb-4">Configure upsells e order bumps na página de Produtos.</p>
        {products.length === 0 ? <p className="text-center text-muted-foreground py-8">Nenhum produto.</p> : (
          <div className="space-y-3">{products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div><p className="font-semibold">{p.name}</p><p className="text-sm text-primary font-bold">R$ {p.price.toFixed(2)}</p></div>
              <div className="flex items-center gap-2">{p.order_bump_product_id && <Badge variant="outline">Order Bump</Badge>}{p.upsell_product_id && <Badge variant="outline">Upsell</Badge>}{!p.order_bump_product_id && !p.upsell_product_id && <Badge variant="secondary">Sem Ofertas</Badge>}</div>
            </div>
          ))}</div>
        )}
      </CardContent></Card>
    </div>
  );
}
