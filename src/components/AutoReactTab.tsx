import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smile, ThumbsUp, Trash2, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AutoReactBot {
  id: string;
  channelName: string;
  channelId: string;
  emojis: string[];
  reactedCount: number;
  status: 'active' | 'paused';
  filters: string[];
}

const mockBots: AutoReactBot[] = [
  {
    id: '1',
    channelName: 'Canal Notícias',
    channelId: '-1001234567890',
    emojis: ['👍', '❤️', '🔥'],
    reactedCount: 342,
    status: 'active',
    filters: ['Todas as mensagens'],
  },
];

export default function AutoReactTab() {
  const [bots, setBots] = useState<AutoReactBot[]>(mockBots);
  const [formData, setFormData] = useState({
    channelId: '',
    emojis: '👍 ❤️ 🔥',
    filterKeywords: '',
    filterAuthors: '',
    reactToAll: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Bot de reações criado com sucesso!');
  };

  const toggleStatus = (id: string) => {
    setBots(bots.map(b => 
      b.id === id 
        ? { ...b, status: b.status === 'active' ? 'paused' : 'active' as const }
        : b
    ));
    toast.success('Status atualizado!');
  };

  const popularEmojis = ['👍', '❤️', '🔥', '😂', '👏', '🎉', '💯', '✨', '⭐', '🚀'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Bot de Reações Automáticas
            </CardTitle>
            <CardDescription>Reaja automaticamente a mensagens em canais e grupos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channelId">ID do Canal/Grupo</Label>
                <Input
                  id="channelId"
                  placeholder="-1001234567890"
                  value={formData.channelId}
                  onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Emojis para Reação</Label>
                <div className="glass p-4 rounded-lg space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {popularEmojis.map((emoji) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = formData.emojis.trim();
                          if (!current.includes(emoji)) {
                            setFormData({ ...formData, emojis: current + ' ' + emoji });
                          }
                        }}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="👍 ❤️ 🔥 (separados por espaço)"
                    value={formData.emojis}
                    onChange={(e) => setFormData({ ...formData, emojis: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Filtros (opcional)</Label>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="filterKeywords">Palavras-chave</Label>
                    <Input
                      id="filterKeywords"
                      placeholder="promoção, oferta, desconto"
                      value={formData.filterKeywords}
                      onChange={(e) => setFormData({ ...formData, filterKeywords: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Reage apenas a mensagens com essas palavras
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filterAuthors">Autores específicos</Label>
                    <Input
                      id="filterAuthors"
                      placeholder="@user1, @user2"
                      value={formData.filterAuthors}
                      onChange={(e) => setFormData({ ...formData, filterAuthors: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between glass p-3 rounded-lg">
                <Label htmlFor="reactToAll">Reagir a todas as mensagens</Label>
                <Switch
                  id="reactToAll"
                  checked={formData.reactToAll}
                  onCheckedChange={(checked) => setFormData({ ...formData, reactToAll: checked })}
                />
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Smile className="h-4 w-4 mr-2" />
                Ativar Reações Automáticas
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Bots de Reação Ativos</CardTitle>
            <CardDescription>Gerencie suas configurações</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Emojis</TableHead>
                  <TableHead>Reações</TableHead>
                  <TableHead>Filtros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">{bot.channelName}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {bot.emojis.map((emoji, idx) => (
                          <span key={idx} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{bot.reactedCount}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {bot.filters.map((filter, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                        {bot.status === 'active' ? '● Ativo' : 'Pausado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(bot.id)}
                        >
                          {bot.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button variant="outline" size="sm">
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
