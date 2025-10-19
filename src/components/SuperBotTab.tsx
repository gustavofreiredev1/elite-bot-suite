import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, Trash2, Zap, Code, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SuperBot {
  id: string;
  botToken: string;
  botName: string;
  groupId: string;
  status: 'running' | 'stopped';
  features: {
    autoReply: boolean;
    moderation: boolean;
    welcomeMsg: boolean;
    antiSpam: boolean;
  };
  commandsCount: number;
}

export default function SuperBotTab() {
  const [bots, setBots] = useState<SuperBot[]>([
    {
      id: '1',
      botToken: '1234567890:ABC...',
      botName: 'Super Bot Admin',
      groupId: '-1001234567890',
      status: 'running',
      features: {
        autoReply: true,
        moderation: true,
        welcomeMsg: true,
        antiSpam: true,
      },
      commandsCount: 15,
    },
  ]);

  const [formData, setFormData] = useState({
    botToken: '',
    botName: '',
    groupId: '',
    welcomeMessage: '',
    autoReply: true,
    moderation: true,
    welcomeMsg: false,
    antiSpam: true,
    customCommands: '',
    apiKeys: '',
  });

  const handleCreateBot = () => {
    if (!formData.botToken || !formData.botName || !formData.groupId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newBot: SuperBot = {
      id: Date.now().toString(),
      botToken: formData.botToken,
      botName: formData.botName,
      groupId: formData.groupId,
      status: 'stopped',
      features: {
        autoReply: formData.autoReply,
        moderation: formData.moderation,
        welcomeMsg: formData.welcomeMsg,
        antiSpam: formData.antiSpam,
      },
      commandsCount: 0,
    };

    setBots([...bots, newBot]);
    setFormData({
      botToken: '',
      botName: '',
      groupId: '',
      welcomeMessage: '',
      autoReply: true,
      moderation: true,
      welcomeMsg: false,
      antiSpam: true,
      customCommands: '',
      apiKeys: '',
    });
    toast.success('Super Bot criado com sucesso!');
  };

  const handleToggleBot = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === 'running' ? 'stopped' : 'running' }
        : bot
    ));
    const bot = bots.find(b => b.id === id);
    toast.success(bot?.status === 'running' ? 'Bot pausado' : 'Bot iniciado');
  };

  const handleDeleteBot = (id: string) => {
    if (confirm('Deseja realmente deletar este Super Bot?')) {
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
            <Zap className="h-5 w-5 text-primary" />
            Configurar Super Bot
          </CardTitle>
          <CardDescription>
            Crie um bot multifuncional com recursos avançados de automação
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
              <Label htmlFor="botName">Nome do Bot *</Label>
              <Input
                id="botName"
                placeholder="Meu Super Bot"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="groupId">ID do Grupo *</Label>
              <Input
                id="groupId"
                placeholder="-1001234567890"
                value={formData.groupId}
                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                className="bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Recursos de Automação
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoReply">Respostas Automáticas</Label>
                  <p className="text-xs text-muted-foreground">
                    Responder comandos automaticamente
                  </p>
                </div>
                <Switch
                  id="autoReply"
                  checked={formData.autoReply}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoReply: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="moderation">Moderação Automática</Label>
                  <p className="text-xs text-muted-foreground">
                    Remover spam e links maliciosos
                  </p>
                </div>
                <Switch
                  id="moderation"
                  checked={formData.moderation}
                  onCheckedChange={(checked) => setFormData({ ...formData, moderation: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="welcomeMsg">Mensagem de Boas-vindas</Label>
                  <p className="text-xs text-muted-foreground">
                    Saudar novos membros
                  </p>
                </div>
                <Switch
                  id="welcomeMsg"
                  checked={formData.welcomeMsg}
                  onCheckedChange={(checked) => setFormData({ ...formData, welcomeMsg: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="antiSpam">Anti-Spam</Label>
                  <p className="text-xs text-muted-foreground">
                    Detectar e bloquear spam
                  </p>
                </div>
                <Switch
                  id="antiSpam"
                  checked={formData.antiSpam}
                  onCheckedChange={(checked) => setFormData({ ...formData, antiSpam: checked })}
                />
              </div>
            </div>
          </div>

          {formData.welcomeMsg && (
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
              <Textarea
                id="welcomeMessage"
                placeholder="Bem-vindo(a) ao grupo! 👋"
                value={formData.welcomeMessage}
                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                className="bg-card border-border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customCommands" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Comandos Personalizados (JSON)
            </Label>
            <Textarea
              id="customCommands"
              placeholder='{"comando": "resposta", "/ajuda": "Lista de comandos..."}'
              value={formData.customCommands}
              onChange={(e) => setFormData({ ...formData, customCommands: e.target.value })}
              className="bg-card border-border font-mono text-xs min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKeys">Chaves API Externas (opcional)</Label>
            <Textarea
              id="apiKeys"
              placeholder="WEATHER_API=abc123&#10;NEWS_API=xyz789"
              value={formData.apiKeys}
              onChange={(e) => setFormData({ ...formData, apiKeys: e.target.value })}
              className="bg-card border-border font-mono text-xs"
            />
          </div>

          <Button onClick={handleCreateBot} className="w-full hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Criar Super Bot
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Super Bots Ativos</CardTitle>
          <CardDescription>Gerencie seus bots multifuncionais</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Grupo ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Comandos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.botName}</TableCell>
                  <TableCell className="font-mono text-xs">{bot.groupId}</TableCell>
                  <TableCell>
                    <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                      {bot.status === 'running' ? '● Rodando' : 'Pausado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {bot.features.autoReply && <Badge variant="outline">Auto Reply</Badge>}
                      {bot.features.moderation && <Badge variant="outline">Moderação</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{bot.commandsCount}</TableCell>
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
