import { useState } from 'react';
import { Send, Upload, Pause, Play, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  recipients: number;
  sent: number;
  pending: number;
  errors: number;
  status: 'active' | 'paused' | 'completed' | 'error';
}

export default function DisparoTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'Campanha Promocional', recipients: 1000, sent: 750, pending: 200, errors: 50, status: 'active' },
  ]);
  const [form, setForm] = useState({ name: '', message: '', delay: '5', mediaUrl: '', recipients: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setCampaigns(prev => [...prev, { id: Date.now().toString(), name: form.name, recipients: form.recipients.split('\n').filter(Boolean).length, sent: 0, pending: 0, errors: 0, status: 'active' }]);
    setForm({ name: '', message: '', delay: '5', mediaUrl: '', recipients: '' });
    toast.success('Disparo iniciado!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Disparo em Massa</h3>
        <p className="text-muted-foreground mt-1">Broadcast ilimitado com anti-ban inteligente</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Configurar Disparo</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Nome da Campanha</Label><Input placeholder="Ex: Promoção Janeiro" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Delay entre envios (seg)</Label><Input type="number" value={form.delay} onChange={e => setForm(f => ({ ...f, delay: e.target.value }))} /></div>
            </div>
            <div className="space-y-2"><Label>Mensagem</Label><Textarea rows={4} placeholder="Digite sua mensagem..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
            <div className="space-y-2"><Label>URL de Mídia (opcional)</Label><Input placeholder="https://..." value={form.mediaUrl} onChange={e => setForm(f => ({ ...f, mediaUrl: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>Lista de Destinatários</Label>
              <div className="flex gap-2">
                <Input placeholder="Cole IDs (um por linha)" value={form.recipients} onChange={e => setForm(f => ({ ...f, recipients: e.target.value }))} />
                <Button type="button" variant="outline"><Upload className="h-4 w-4 mr-2" />CSV</Button>
              </div>
            </div>
            <Button type="submit" className="w-full"><Send className="h-4 w-4 mr-2" />Iniciar Disparo</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Campanhas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Campanha</TableHead><TableHead>Destinatários</TableHead><TableHead>Enviados</TableHead><TableHead>Pendentes</TableHead><TableHead>Erros</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.recipients}</TableCell>
                  <TableCell className="text-emerald-500">{c.sent}</TableCell>
                  <TableCell className="text-amber-500">{c.pending}</TableCell>
                  <TableCell className="text-destructive">{c.errors}</TableCell>
                  <TableCell><Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status === 'active' ? '● Ativo' : c.status === 'paused' ? 'Pausado' : 'Concluído'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setCampaigns(prev => prev.map(x => x.id === c.id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x)); }}>{c.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}</Button>
                      <Button size="sm" variant="outline" onClick={() => setCampaigns(prev => prev.filter(x => x.id !== c.id))}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
