import { useState } from 'react';
import { TrendingUp, ShoppingCart, RefreshCcw, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function UpsellTab() {
  const [config, setConfig] = useState({
    orderBumpEnabled: true,
    orderBumpProduct: 'eBook Bônus',
    orderBumpPrice: '29.90',
    orderBumpDiscount: '50',
    upsellEnabled: true,
    upsellProduct: 'Mentoria Individual',
    upsellPrice: '497.00',
    downsellEnabled: true,
    downsellProduct: 'Grupo de Suporte',
    downsellPrice: '97.00',
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Upsell & Ofertas</h3>
        <p className="text-muted-foreground mt-1">Maximize o ticket médio com order bump, upsell e downsell</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-emerald-500">+42%</div><p className="text-sm text-muted-foreground">Aumento no Ticket</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">67%</div><p className="text-sm text-muted-foreground">Aceitação Order Bump</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">23%</div><p className="text-sm text-muted-foreground">Aceitação Upsell</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" />Order Bump</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3"><Switch checked={config.orderBumpEnabled} onCheckedChange={v => setConfig(c => ({ ...c, orderBumpEnabled: v }))} /><p className="text-sm font-medium">Ativado</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Produto</Label><Input value={config.orderBumpProduct} onChange={e => setConfig(c => ({ ...c, orderBumpProduct: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Preço (R$)</Label><Input value={config.orderBumpPrice} onChange={e => setConfig(c => ({ ...c, orderBumpPrice: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Desconto (%)</Label><Input value={config.orderBumpDiscount} onChange={e => setConfig(c => ({ ...c, orderBumpDiscount: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Upsell</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3"><Switch checked={config.upsellEnabled} onCheckedChange={v => setConfig(c => ({ ...c, upsellEnabled: v }))} /><p className="text-sm font-medium">Ativado</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Produto</Label><Input value={config.upsellProduct} onChange={e => setConfig(c => ({ ...c, upsellProduct: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Preço (R$)</Label><Input value={config.upsellPrice} onChange={e => setConfig(c => ({ ...c, upsellPrice: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><RefreshCcw className="h-5 w-5 text-primary" />Downsell</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3"><Switch checked={config.downsellEnabled} onCheckedChange={v => setConfig(c => ({ ...c, downsellEnabled: v }))} /><p className="text-sm font-medium">Ativado</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Produto</Label><Input value={config.downsellProduct} onChange={e => setConfig(c => ({ ...c, downsellProduct: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Preço (R$)</Label><Input value={config.downsellPrice} onChange={e => setConfig(c => ({ ...c, downsellPrice: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => toast.success('Configurações salvas!')}>Salvar Configurações</Button>
    </div>
  );
}
