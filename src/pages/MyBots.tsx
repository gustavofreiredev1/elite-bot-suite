import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, BarChart3, Search, Plus, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockBots } from '@/mocks/mockData';
import MainLayout from '@/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AnimatedCounter from '@/components/AnimatedCounter';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export default function MyBots() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [bots, setBots] = useState(mockBots);

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(search.toLowerCase()) ||
      bot.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar o bot "${name}"?`)) {
      setBots(bots.filter((bot) => bot.id !== id));
      toast.success('Bot deletado com sucesso!');
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Bots</h1>
            <p className="text-muted-foreground">Gerencie todos os seus bots</p>
          </div>
          <Button onClick={() => navigate('/create-bot')} className="hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Criar Novo Bot
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredBots.map((bot) => (
            <motion.div key={bot.id} variants={item} whileHover={{ y: -8 }}>
              <Card className="card-glow group relative overflow-hidden">
                <div className="absolute inset-0 gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="space-y-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <img
                        src={bot.photo}
                        alt={bot.name}
                        className="h-16 w-16 rounded-xl bg-primary/10 p-2"
                      />
                      {bot.status === 'active' && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-success rounded-full animate-pulse-glow" />
                      )}
                    </div>
                    <Badge
                      variant={bot.status === 'active' ? 'default' : 'secondary'}
                      className={bot.status === 'active' ? 'bg-success shadow-glow' : 'bg-muted'}
                    >
                      {bot.status === 'active' ? '● Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {bot.name}
                      {bot.status === 'active' && <Zap className="h-4 w-4 text-primary" />}
                    </CardTitle>
                    <CardDescription className="mt-2">{bot.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Mensagens</p>
                      <p className="text-lg font-bold">
                        <AnimatedCounter value={bot.messagesCount} />
                      </p>
                    </div>
                    <div className="glass p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Usuários</p>
                      <p className="text-lg font-bold">
                        <AnimatedCounter value={bot.usersCount} />
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 hover-glow">
                      <Edit className="mr-2 h-3 w-3" />
                      Editar
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover-glow"
                    onClick={() => navigate(`/bot/${bot.id}`)}
                  >
                    <BarChart3 className="mr-2 h-3 w-3" />
                    Detalhes
                  </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      onClick={() => handleDelete(bot.id, bot.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum bot encontrado</p>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
