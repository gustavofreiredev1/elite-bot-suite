import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot as BotIcon, Plus, Wifi, WifiOff, Trash2, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import MainLayout from '@/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getUserBots, disconnectBot } from '@/lib/telegram';
import { Search } from 'lucide-react';

interface BotRecord {
  id: string;
  name: string;
  telegram_bot_username: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
}

export default function MyBots() {
  const [bots, setBots] = useState<BotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchBots = async () => {
    try {
      const data = await getUserBots();
      setBots(data || []);
    } catch (err: any) {
      toast.error('Erro ao carregar bots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleDisconnect = async (botId: string, name: string) => {
    if (!confirm(`Desconectar o bot "${name}"?`)) return;
    try {
      await disconnectBot(botId);
      toast.success('Bot desconectado');
      fetchBots();
    } catch {
      toast.error('Erro ao desconectar');
    }
  };

  const filtered = bots.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.telegram_bot_username || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Meus Bots"
          description="Gerencie seus bots do Telegram"
          icon={BotIcon}
          breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Meus Bots' }]}
          actions={
            <Button onClick={() => navigate('/create-bot')} className="hover-glow">
              <Plus className="mr-2 h-4 w-4" />
              Conectar Bot
            </Button>
          }
        />

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="card-elegant">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <BotIcon className="h-16 w-16 text-muted-foreground/30" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Nenhum bot conectado</h3>
                <p className="text-muted-foreground">Conecte seu primeiro bot do Telegram para começar.</p>
              </div>
              <Button onClick={() => navigate('/create-bot')} className="hover-glow" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Conectar Primeiro Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((bot) => (
              <motion.div key={bot.id} whileHover={{ y: -4 }}>
                <Card className="card-glow h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <BotIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bot.name}</CardTitle>
                          {bot.telegram_bot_username && (
                            <p className="text-sm text-muted-foreground">@{bot.telegram_bot_username}</p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={bot.status === 'connected' ? 'default' : 'secondary'}
                        className={bot.status === 'connected' ? 'bg-success' : ''}
                      >
                        {bot.status === 'connected' ? (
                          <><Wifi className="mr-1 h-3 w-3" /> Online</>
                        ) : (
                          <><WifiOff className="mr-1 h-3 w-3" /> Offline</>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Conectado em {new Date(bot.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/messages?bot=${bot.id}`)}
                      >
                        Chat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/automations?bot=${bot.id}`)}
                      >
                        Fluxos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDisconnect(bot.id, bot.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
