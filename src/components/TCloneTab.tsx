import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, Trash2, Copy, Settings2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface CloneBot {
  id: string;
  botToken: string;
  sourceId: string;
  destinationId: string;
  status: 'running' | 'stopped';
  messagesCopied: number;
  addWatermark: boolean;
  realtime: boolean;
}

export default function TCloneTab() {
  const [bots, setBots] = useState<CloneBot[]>([
    {
      id: '1',
      botToken: '1234567890:ABC...',
      sourceId: '-1001234567890',
      destinationId: '-1009876543210',
      status: 'stopped',
      messagesCopied: 342,
      addWatermark: false,
      realtime: true,
    },
  ]);

  const [formData, setFormData] = useState({
    botToken: '',
    sourceId: '',
    destinationId: '',
    addWatermark: false,
    watermarkText: '',
    realtime: true,
    startFrom: '',
  });

  const handleCreateBot = () => {
    if (!formData.botToken || !formData.sourceId || !formData.destinationId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newBot: CloneBot = {
      id: Date.now().toString(),
      botToken: formData.botToken,
      sourceId: formData.sourceId,
      destinationId: formData.destinationId,
      status: 'stopped',
      messagesCopied: 0,
      addWatermark: formData.addWatermark,
      realtime: formData.realtime,
    };

    setBots([...bots, newBot]);
    setFormData({
      botToken: '',
      sourceId: '',
      destinationId: '',
      addWatermark: false,
      watermarkText: '',
      realtime: true,
      startFrom: '',
    });
    toast.success('Bot de clonagem configurado com sucesso!');
  };

  const handleToggleBot = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' }
        : bot
    ));
    const bot = bots.find(b => b.id === id);
    toast.success(bot?.status === 'running' ? 'Clonagem pausada' : 'Clonagem iniciada');
  };

  const handleDeleteBot = (id: string) => {
    if (confirm('Deseja realmente deletar este bot de clonagem?')) {
      setBots(bots.filter(b => b.id !== id));
      toast.success('Bot deletado com sucesso!');
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
            <Copy className="h-5 w-5 text-primary" />
            Configurar Clonagem de Canal
          </CardTitle>
          <CardDescription>
            Clone mensagens automaticamente de um canal/grupo para outro
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
              <Label htmlFor="sourceId">ID do Canal Fonte *</Label>
              <Input
                id="sourceId"
                placeholder="-1001234567890"
                value={formData.sourceId}
                onChange={(e) => setFormData({ ...formData, sourceId: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destinationId">ID do Canal Destino *</Label>
              <Input
                id="destinationId"
                placeholder="-1009876543210"
                value={formData.destinationId}
                onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startFrom">Começar do Mensagem ID (opcional)</Label>
              <Input
                id="startFrom"
                placeholder="1000"
                type="number"
                value={formData.startFrom}
                onChange={(e) => setFormData({ ...formData, startFrom: e.target.value })}
                className="bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="realtime">Clonagem em Tempo Real</Label>
                <p className="text-xs text-muted-foreground">
                  Copiar mensagens automaticamente quando postadas
                </p>
              </div>
              <Switch
                id="realtime"
                checked={formData.realtime}
                onCheckedChange={(checked) => setFormData({ ...formData, realtime: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="addWatermark">Adicionar Marca D'água</Label>
                <p className="text-xs text-muted-foreground">
                  Adicionar texto personalizado nas mensagens copiadas
                </p>
              </div>
              <Switch
                id="addWatermark"
                checked={formData.addWatermark}
                onCheckedChange={(checked) => setFormData({ ...formData, addWatermark: checked })}
              />
            </div>
            {formData.addWatermark && (
              <div className="space-y-2">
                <Label htmlFor="watermarkText">Texto da Marca D'água</Label>
                <Input
                  id="watermarkText"
                  placeholder="📢 Via @MeuCanal"
                  value={formData.watermarkText}
                  onChange={(e) => setFormData({ ...formData, watermarkText: e.target.value })}
                  className="bg-card border-border"
                />
              </div>
            )}
          </div>

          <Button onClick={handleCreateBot} className="w-full hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Criar Bot de Clonagem
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Bots de Clonagem Ativos</CardTitle>
          <CardDescription>Gerencie suas clonagens de canais</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal Fonte</TableHead>
                <TableHead>Canal Destino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Msgs Copiadas</TableHead>
                <TableHead>Tempo Real</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-mono text-xs">{bot.sourceId}</TableCell>
                  <TableCell className="font-mono text-xs">{bot.destinationId}</TableCell>
                  <TableCell>
                    <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                      {bot.status === 'running' ? '● Clonando' : 'Pausado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{bot.messagesCopied}</TableCell>
                  <TableCell>{bot.realtime ? 'Sim' : 'Não'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleBot(bot.id)}
                      >
                        {bot.status === 'running' ? (
                          <Square className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteBot(bot.id)}
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
  );
}
