import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Loader2, QrCode, Copy, CheckCircle2, Package, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { getProductBySlug, createOrder } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

export default function Checkout() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', coupon: '' });

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then(setProduct)
      .catch(() => toast.error('Produto não encontrado'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePurchase = async () => {
    if (!form.name || !form.email || !product) return;
    setProcessing(true);
    try {
      // Generate a fake PIX code for demonstration
      const pixCode = `00020126330014BR.GOV.BCB.PIX0111${Date.now()}5204000053039865802BR5925ELITE BOT SUITE6009SAO PAULO62070503***6304`;

      const order = await createOrder({
        seller_id: product.user_id,
        product_id: product.id,
        amount: product.price,
        buyer_name: form.name,
        buyer_email: form.email,
        buyer_phone: form.phone,
        payment_method: 'pix',
        coupon_code: form.coupon || undefined,
      });

      // Update order with PIX code
      await supabase.from('orders').update({ pix_code: pixCode }).eq('id', order.id);

      setOrderCreated({ ...order, pix_code: pixCode });
      toast.success('Pedido criado! Escaneie o QR Code para pagar.');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar');
    } finally {
      setProcessing(false);
    }
  };

  const copyPixCode = () => {
    if (orderCreated?.pix_code) {
      navigator.clipboard.writeText(orderCreated.pix_code);
      toast.success('Código PIX copiado!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="flex flex-col items-center py-12 space-y-4">
            <Package className="h-16 w-16 text-muted-foreground/30" />
            <h2 className="text-xl font-bold">Produto não encontrado</h2>
            <p className="text-muted-foreground">Este link de checkout não é válido.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full card-elegant">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Pague via PIX</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">{product.name}</p>
            </div>

            {/* PIX QR Code placeholder */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </div>

            {/* PIX copy-paste */}
            <div className="space-y-2">
              <Label>Código PIX (Copia e Cola)</Label>
              <div className="flex gap-2">
                <Input value={orderCreated.pix_code || ''} readOnly className="text-xs" />
                <Button variant="outline" size="icon" onClick={copyPixCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Pagamento detectado automaticamente</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Produto entregue instantaneamente</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              Pagamento seguro via Elite Bot Suite
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Product Info */}
        <Card className="card-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-2">Produto Digital</Badge>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                {product.description && (
                  <p className="text-muted-foreground mt-2">{product.description}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-4 border-t border-border">
              <span className="text-muted-foreground">Total</span>
              <span className="text-3xl font-bold text-primary">R$ {product.price.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Dados do Comprador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label>E-mail *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-2">
              <Label>Cupom de desconto</Label>
              <Input value={form.coupon} onChange={(e) => setForm((f) => ({ ...f, coupon: e.target.value }))} placeholder="Código do cupom" />
            </div>

            <Separator />

            <Button
              className="w-full h-12 text-lg hover-glow"
              onClick={handlePurchase}
              disabled={!form.name || !form.email || processing}
            >
              {processing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Lock className="mr-2 h-5 w-5" />
              )}
              Pagar com PIX · R$ {product.price.toFixed(2)}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              Compra 100% segura · Entrega imediata
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
