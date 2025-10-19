import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Trash2, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ViewTracker {
  id: string;
  botToken: string;
  groupId: string;
  groupName: string;
  status: 'active' | 'inactive';
  totalViews: number;
  topMessage: {
    id: number;
    views: number;
    text: string;
  };
}

interface MessageView {
  id: string;
  messageId: number;
  text: string;
  views: number;
  timestamp: string;
}

export default function ViewsTrackingTab() {
  const [trackers, setTrackers] = useState<ViewTracker[]>([
    {
      id: '1',
      botToken: '1234567890:ABC...',
      groupId: '-1001234567890',
      groupName: 'Grupo Principal',
      status: 'active',
      totalViews: 15420,
      topMessage: {
        id: 123,
        views: 2340,
        text: 'Novidade incrível chegando!',
      },
    },
  ]);

  const [messageViews, setMessageViews] = useState<MessageView[]>([
    {
      id: '1',
      messageId: 123,
      text: 'Novidade incrível chegando!',
      views: 2340,
      timestamp: '2025-01-20 15:30',
    },
    {
      id: '2',
      messageId: 122,
      text: 'Confira nossos novos produtos',
      views: 1890,
      timestamp: '2025-01-20 12:15',
    },
  ]);

  const [formData, setFormData] = useState({
    botToken: '',
    groupId: '',
    groupName: '',
    viewThreshold: '100',
  });

  const handleCreateTracker = () => {
    if (!formData.botToken || !formData.groupId || !formData.groupName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newTracker: ViewTracker = {
      id: Date.now().toString(),
      botToken: formData.botToken,
      groupId: formData.groupId,
      groupName: formData.groupName,
      status: 'active',
      totalViews: 0,
      topMessage: {
        id: 0,
        views: 0,
        text: '-',
      },
    };

    setTrackers([...trackers, newTracker]);
    setFormData({ botToken: '', groupId: '', groupName: '', viewThreshold: '100' });
    toast.success('Tracker de visualizações criado com sucesso!');
  };

  const handleDeleteTracker = (id: string) => {
    if (confirm('Deseja realmente deletar este tracker?')) {
      setTrackers(trackers.filter(t => t.id !== id));
      toast.success('Tracker deletado com sucesso!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Configurar Tracking de Visualizações
          </CardTitle>
          <CardDescription>
            Monitore visualizações de mensagens em tempo real nos seus grupos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="botToken">Token do Bot *</Label>
              <Input
                id="botToken"
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                value={formData.botToken}
                onChange={(e) => setFormData({ ...formData, botToken: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupId">ID do Grupo *</Label>
              <Input
                id="groupId"
                placeholder="-1001234567890"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupName">Nome do Grupo *</Label>
              <Input
                id="groupName"
                placeholder="Meu Grupo Telegram"
                value={formData.groupName}
                onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewThreshold">Alerta de Visualizações</Label>
              <Input
                id="viewThreshold"
                type="number"
                placeholder="100"
                value={formData.viewThreshold}
                onChange={(e) => setFormData({ ...formData, viewThreshold: e.target.value })}
                className="bg-card border-border"
              />
              <p className="text-xs text-muted-foreground">
                Notificar quando uma mensagem atingir este número
              </p>
            </div>
          </div>
          <Button onClick={handleCreateTracker} className="w-full hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Criar Tracker
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Trackers Ativos</CardTitle>
          <CardDescription>Grupos sendo monitorados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>ID do Grupo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Views</TableHead>
                <TableHead>Top Mensagem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackers.map((tracker) => (
                <TableRow key={tracker.id}>
                  <TableCell className="font-medium">{tracker.groupName}</TableCell>
                  <TableCell className="font-mono text-xs">{tracker.groupId}</TableCell>
                  <TableCell>
                    <Badge variant={tracker.status === 'active' ? 'default' : 'secondary'}>
                      {tracker.status === 'active' ? '● Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">{tracker.totalViews.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-primary" />
                      <span className="text-sm">{tracker.topMessage.views} views</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteTracker(tracker.id)}
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

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Mensagens Mais Visualizadas</CardTitle>
          <CardDescription>Top mensagens por visualizações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Visualizações</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messageViews.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-mono text-xs">{msg.messageId}</TableCell>
                  <TableCell className="max-w-xs truncate">{msg.text}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-primary" />
                      <span className="font-bold">{msg.views.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{msg.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
