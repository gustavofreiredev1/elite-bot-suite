import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Edit, Trash2, Plus, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AutoPostBot {
  id: string;
  name: string;
  chatId: string;
  token: string;
  template: string;
  interval: number;
  autoContent: boolean;
  status: 'active' | 'inactive';
  lastPost: string;
}

export default function AutoPostTab() {
  const [bots, setBots] = useState<AutoPostBot[]>([
    {
      id: '1',
      name: 'Bot Notícias 24h',
      chatId: '-1001234567890',
      token: '1234567890:ABC...',
      template: 'Nova atualização: {content}',
      interval: 60,
      autoContent: true,
      status: 'active',
      lastPost: 'Há 5 minutos',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AutoPostBot | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    chatId: '',
    token: '',
    template: '',
    interval: 60,
    autoContent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBot) {
      setBots(bots.map(bot => 
        bot.id === editingBot.id 
          ? { ...bot, ...formData, status: 'inactive' as const, lastPost: 'Nunca' }
          : bot
      ));
      toast.success('Bot AutoPost atualizado com sucesso!');
    } else {
      const newBot: AutoPostBot = {
        id: Date.now().toString(),
        ...formData,
        status: 'inactive',
        lastPost: 'Nunca',
      };
      setBots([...bots, newBot]);
      toast.success('Bot AutoPost criado com sucesso!');
    }

    setIsDialogOpen(false);
    setEditingBot(null);
    setFormData({
      name: '',
      chatId: '',
      token: '',
      template: '',
      interval: 60,
      autoContent: false,
    });
  };

  const toggleBotStatus = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
    toast.success('Status do bot atualizado!');
  };

  const handleEdit = (bot: AutoPostBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      chatId: bot.chatId,
      token: bot.token,
      template: bot.template,
      interval: bot.interval,
      autoContent: bot.autoContent,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar o bot "${name}"?`)) {
      setBots(bots.filter(bot => bot.id !== id));
      toast.success('Bot AutoPost deletado com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">AutoPost 24h</h3>
          <p className="text-muted-foreground mt-1">
            Configure bots para postagens automáticas 24 horas por dia
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover-glow" onClick={() => {
              setEditingBot(null);
              setFormData({
                name: '',
                chatId: '',
                token: '',
                template: '',
                interval: 60,
                autoContent: false,
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo AutoPost
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBot ? 'Editar Bot AutoPost' : 'Criar Novo Bot AutoPost'}
              </DialogTitle>
              <DialogDescription>
                Configure um bot para postagens automáticas em grupos ou canais Telegram
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Bot</Label>
                <Input
                  id="name"
                  placeholder="Ex: Bot Notícias 24h"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token do Bot (BotFather)</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Obtenha o token no @BotFather do Telegram
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatId">Chat ID (Grupo/Canal)</Label>
                <Input
                  id="chatId"
                  placeholder="-1001234567890"
                  value={formData.chatId}
                  onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  IDs de supergroups começam com -100
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template da Mensagem</Label>
                <Textarea
                  id="template"
                  placeholder="Nova atualização: {content}&#10;&#10;Use {content} para conteúdo automático"
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use {'{content}'} como placeholder para geração automática
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interval">Intervalo de Postagem (minutos)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  value={formData.interval}
                  onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoContent"
                  checked={formData.autoContent}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoContent: checked })}
                />
                <Label htmlFor="autoContent" className="cursor-pointer">
                  Geração automática de conteúdo
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 hover-glow">
                  {editingBot ? 'Salvar Alterações' : 'Criar Bot AutoPost'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingBot(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bots AutoPost Ativos</CardTitle>
          <CardDescription>
            Gerencie seus bots de postagem automática
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Bot</TableHead>
                  <TableHead>Chat ID</TableHead>
                  <TableHead>Intervalo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Postagem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum bot AutoPost configurado
                    </TableCell>
                  </TableRow>
                ) : (
                  bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell className="font-mono text-sm">{bot.chatId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {bot.interval}min
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={bot.status === 'active' ? 'default' : 'secondary'}
                          className={bot.status === 'active' ? 'bg-success shadow-glow' : ''}
                        >
                          {bot.status === 'active' ? '● Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bot.lastPost}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant={bot.status === 'active' ? 'destructive' : 'default'}
                            onClick={() => toggleBotStatus(bot.id)}
                            className="hover-glow"
                          >
                            {bot.status === 'active' ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Parar
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Iniciar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(bot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(bot.id, bot.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {bots.length > 0 && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Logs de Postagens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Bot Notícias 24h</span>
                <span className="text-success">✓ Postagem enviada - Há 5 min</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Bot Notícias 24h</span>
                <span className="text-success">✓ Postagem enviada - Há 1 hora</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Bot Notícias 24h</span>
                <span className="text-success">✓ Postagem enviada - Há 2 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
