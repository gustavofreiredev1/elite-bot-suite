import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Upload, Pause, Play, Trash2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  recipients: number;
  sent: number;
  pending: number;
  errors: number;
  status: 'active' | 'paused' | 'completed' | 'error';
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha Promocional',
    recipients: 1000,
    sent: 750,
    pending: 200,
    errors: 50,
    status: 'active',
    createdAt: '2025-01-15 14:30',
  },
];

export default function MassSenderTab() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [formData, setFormData] = useState({
    campaignName: '',
    message: '',
    delay: '5',
    mediaUrl: '',
    recipientsList: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Campanha criada com sucesso!');
    setFormData({
      campaignName: '',
      message: '',
      delay: '5',
      mediaUrl: '',
      recipientsList: '',
    });
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'active' ? 'paused' : 'active' as const }
        : c
    ));
    toast.success('Status da campanha atualizado!');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('Campanha deletada!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Configurar Envio em Massa
            </CardTitle>
            <CardDescription>
              Envie mensagens para múltiplos destinatários automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nome da Campanha</Label>
                  <Input
                    id="campaignName"
                    placeholder="Ex: Promoção Janeiro"
                    value={formData.campaignName}
                    onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delay">Delay entre envios (segundos)</Label>
                  <Input
                    id="delay"
                    type="number"
                    placeholder="5"
                    value={formData.delay}
                    onChange={(e) => setFormData({ ...formData, delay: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem aqui..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaUrl">URL de Mídia (opcional)</Label>
                <Input
                  id="mediaUrl"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientsList">Lista de Destinatários</Label>
                <div className="flex gap-2">
                  <Input
                    id="recipientsList"
                    placeholder="Cole IDs ou usernames (um por linha)"
                    value={formData.recipientsList}
                    onChange={(e) => setFormData({ ...formData, recipientsList: e.target.value })}
                  />
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Send className="h-4 w-4 mr-2" />
                Iniciar Campanha
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Campanhas Ativas</CardTitle>
            <CardDescription>Gerencie suas campanhas de envio em massa</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Destinatários</TableHead>
                  <TableHead>Enviados</TableHead>
                  <TableHead>Pendentes</TableHead>
                  <TableHead>Erros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.recipients}</TableCell>
                    <TableCell className="text-success">{campaign.sent}</TableCell>
                    <TableCell className="text-warning">{campaign.pending}</TableCell>
                    <TableCell className="text-destructive">{campaign.errors}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'completed' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {campaign.status === 'active' ? '● Em Andamento' :
                         campaign.status === 'paused' ? 'Pausado' :
                         campaign.status === 'completed' ? 'Concluído' : 'Erro'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleCampaignStatus(campaign.id)}
                        >
                          {campaign.status === 'active' ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
