import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, Trash2, Upload, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface AddMemberBot {
  id: string;
  botToken: string;
  groupId: string;
  groupName: string;
  status: 'running' | 'stopped';
  membersAdded: number;
  delay: number;
}

export default function AddMembersTab() {
  const [bots, setBots] = useState<AddMemberBot[]>([
    {
      id: '1',
      botToken: '1234567890:ABC...',
      groupId: '-1001234567890',
      groupName: 'Grupo Teste',
      status: 'stopped',
      membersAdded: 150,
      delay: 30,
    },
  ]);

  const [formData, setFormData] = useState({
    botToken: '',
    groupId: '',
    groupName: '',
    membersList: '',
    delay: '30',
    maxPerDay: '50',
  });

  const handleCreateBot = () => {
    if (!formData.botToken || !formData.groupId || !formData.groupName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newBot: AddMemberBot = {
      id: Date.now().toString(),
      botToken: formData.botToken,
      groupId: formData.groupId,
      groupName: formData.groupName,
      status: 'stopped',
      membersAdded: 0,
      delay: parseInt(formData.delay),
    };

    setBots([...bots, newBot]);
    setFormData({ botToken: '', groupId: '', groupName: '', membersList: '', delay: '30', maxPerDay: '50' });
    toast.success('Bot configurado com sucesso!');
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
    if (confirm('Deseja realmente deletar este bot?')) {
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
            <UserPlus className="h-5 w-5 text-primary" />
            Configurar Bot de Adição
          </CardTitle>
          <CardDescription>
            Configure um bot para adicionar membros automaticamente em grupos Telegram
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
              <Label htmlFor="delay">Delay entre Adições (segundos)</Label>
              <Input
                id="delay"
                type="number"
                placeholder="30"
                value={formData.delay}
                onChange={(e) => setFormData({ ...formData, delay: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPerDay">Limite por Dia</Label>
              <Input
                id="maxPerDay"
                type="number"
                placeholder="50"
                value={formData.maxPerDay}
                onChange={(e) => setFormData({ ...formData, maxPerDay: e.target.value })}
                className="bg-card border-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="membersList">Lista de Membros (user IDs ou @usernames, um por linha)</Label>
            <Textarea
              id="membersList"
              placeholder="@username1&#10;@username2&#10;123456789"
              value={formData.membersList}
              onChange={(e) => setFormData({ ...formData, membersList: e.target.value })}
              className="bg-card border-border min-h-[120px]"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateBot} className="flex-1 hover-glow">
              <Plus className="mr-2 h-4 w-4" />
              Criar Bot
            </Button>
            <Button variant="outline" className="flex-1">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Bots de Adição Ativos</CardTitle>
          <CardDescription>Gerencie seus bots de adição de membros</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grupo</TableHead>
                <TableHead>ID do Grupo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Membros Adicionados</TableHead>
                <TableHead>Delay</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bots.map((bot) => (
                <TableRow key={bot.id}>
                  <TableCell className="font-medium">{bot.groupName}</TableCell>
                  <TableCell className="font-mono text-xs">{bot.groupId}</TableCell>
                  <TableCell>
                    <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                      {bot.status === 'running' ? '● Rodando' : 'Pausado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{bot.membersAdded}</TableCell>
                  <TableCell>{bot.delay}s</TableCell>
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
