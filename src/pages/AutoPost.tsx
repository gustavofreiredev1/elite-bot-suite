import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Clock, Play, Pause, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AutoPostBot {
  id: string;
  name: string;
  token: string;
  chatId: string;
  template: string;
  interval: number;
  autoGenerate: boolean;
  status: 'active' | 'inactive';
  lastPost: string;
}

export default function AutoPost() {
  const { toast } = useToast();
  const [bots, setBots] = useState<AutoPostBot[]>([
    {
      id: '1',
      name: 'Bot News 24h',
      token: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
      chatId: '-1001234567890',
      template: 'Nova atualização disponível! 🚀\n\nConfira as últimas novidades em nosso canal.',
      interval: 60,
      autoGenerate: true,
      status: 'active',
      lastPost: '2 minutos atrás',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AutoPostBot | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    chatId: '',
    template: '',
    interval: 60,
    autoGenerate: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.token || !formData.chatId || !formData.template) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.chatId.startsWith('-100')) {
      toast({
        title: 'Atenção',
        description: 'Para supergroups, o Chat ID deve começar com -100',
        variant: 'destructive',
      });
      return;
    }

    if (editingBot) {
      setBots(bots.map(bot => 
        bot.id === editingBot.id 
          ? { ...bot, ...formData, lastPost: bot.lastPost }
          : bot
      ));
      toast({
        title: 'Sucesso',
        description: 'Bot atualizado com sucesso',
      });
    } else {
      const newBot: AutoPostBot = {
        id: Date.now().toString(),
        ...formData,
        status: 'inactive',
        lastPost: 'Nunca',
      };
      setBots([...bots, newBot]);
      toast({
        title: 'Sucesso',
        description: 'Bot criado com sucesso',
      });
    }

    setIsDialogOpen(false);
    setEditingBot(null);
    setFormData({
      name: '',
      token: '',
      chatId: '',
      template: '',
      interval: 60,
      autoGenerate: false,
    });
  };

  const handleToggleStatus = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
    
    const bot = bots.find(b => b.id === id);
    toast({
      title: bot?.status === 'active' ? 'Bot pausado' : 'Bot iniciado',
      description: bot?.status === 'active' 
        ? 'As postagens foram pausadas' 
        : 'As postagens foram iniciadas',
    });
  };

  const handleEdit = (bot: AutoPostBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      token: bot.token,
      chatId: bot.chatId,
      template: bot.template,
      interval: bot.interval,
      autoGenerate: bot.autoGenerate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBots(bots.filter(bot => bot.id !== id));
    toast({
      title: 'Bot removido',
      description: 'O bot foi removido com sucesso',
    });
  };

  const handleNewBot = () => {
    setEditingBot(null);
    setFormData({
      name: '',
      token: '',
      chatId: '',
      template: '',
      interval: 60,
      autoGenerate: false,
    });
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <PageHeader
        title="AutoPost 24h"
        description="Gerencie postagens automáticas 24/7 em grupos e canais Telegram"
        icon={Clock}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'AutoPost 24h' },
        ]}
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewBot} className="hover-glow">
                <Plus className="mr-2 h-4 w-4" />
                Novo AutoPost
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle>
                  {editingBot ? 'Editar AutoPost' : 'Criar Novo AutoPost'}
                </DialogTitle>
                <DialogDescription>
                  Configure o bot para postagens automáticas em grupos ou canais Telegram
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Bot *</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Bot News 24h"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token">Token do Bot (BotFather) *</Label>
                  <Input
                    id="token"
                    type="password"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    value={formData.token}
                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                    className="bg-background border-border font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    Obtenha o token com o @BotFather no Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatId">Chat ID do Grupo/Canal *</Label>
                  <Input
                    id="chatId"
                    placeholder="-1001234567890"
                    value={formData.chatId}
                    onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                    className="bg-background border-border font-mono"
                  />
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Para supergroups, o ID deve começar com -100. Use @userinfobot para obter o Chat ID
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template da Mensagem *</Label>
                  <Textarea
                    id="template"
                    placeholder="Digite o template da mensagem aqui...&#10;&#10;Você pode usar:&#10;{date} - Data atual&#10;{time} - Hora atual&#10;{random} - Número aleatório"
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="bg-background border-border min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Suporte para texto, links e emojis. Imagens serão adicionadas em breve
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interval">Intervalo de Postagem (minutos) *</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    max="1440"
                    placeholder="60"
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) || 60 })}
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo: 1 minuto | Máximo: 1440 minutos (24 horas)
                  </p>
                </div>

                <div className="flex items-center justify-between space-x-2 p-4 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoGenerate">Variação Automática</Label>
                    <p className="text-xs text-muted-foreground">
                      Ativa variações no template usando placeholders
                    </p>
                  </div>
                  <Switch
                    id="autoGenerate"
                    checked={formData.autoGenerate}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoGenerate: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 hover-glow">
                    {editingBot ? 'Salvar Alterações' : 'Criar AutoPost'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total de Bots</p>
              <p className="text-3xl font-bold">{bots.length}</p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Bots Ativos</p>
              <p className="text-3xl font-bold text-success">
                {bots.filter(b => b.status === 'active').length}
              </p>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Posts Hoje</p>
              <p className="text-3xl font-bold">247</p>
            </div>
          </GlassCard>
        </div>

        {/* Bots Table */}
        <GlassCard>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Bots AutoPost Ativos</h2>
            
            {bots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum bot configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro bot AutoPost para começar a postar automaticamente
                </p>
                <Button onClick={handleNewBot} className="hover-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Bot
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Nome do Bot</TableHead>
                      <TableHead>Chat ID</TableHead>
                      <TableHead>Intervalo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Postagem</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bots.map((bot) => (
                      <TableRow key={bot.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{bot.name}</TableCell>
                        <TableCell className="font-mono text-sm">{bot.chatId}</TableCell>
                        <TableCell>{bot.interval} min</TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={bot.status === 'active' ? 'active' : 'inactive'} 
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{bot.lastPost}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant={bot.status === 'active' ? 'destructive' : 'default'}
                              onClick={() => handleToggleStatus(bot.id)}
                              className="hover-glow"
                            >
                              {bot.status === 'active' ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(bot)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(bot.id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="bg-primary/5 border-primary/20">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-medium">Como configurar seu AutoPost</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Crie um bot no Telegram através do @BotFather e copie o token</li>
                <li>Adicione o bot ao seu grupo/canal e dê permissões de admin</li>
                <li>Use o @userinfobot para obter o Chat ID do grupo/canal</li>
                <li>Configure o template da mensagem e o intervalo de postagem</li>
                <li>Clique em Iniciar para ativar o AutoPost 24h</li>
              </ol>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </MainLayout>
  );
}
