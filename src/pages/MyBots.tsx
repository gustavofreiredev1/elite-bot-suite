import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, BarChart3, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockBots } from '@/mocks/mockData';
import MainLayout from '@/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
            <motion.div key={bot.id} variants={item}>
              <Card className="card-elegant hover-scale group">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <img
                      src={bot.photo}
                      alt={bot.name}
                      className="h-16 w-16 rounded-xl bg-primary/10 p-2"
                    />
                    <Badge
                      variant={bot.status === 'active' ? 'default' : 'secondary'}
                      className={bot.status === 'active' ? 'bg-success' : 'bg-muted'}
                    >
                      {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{bot.name}</CardTitle>
                    <CardDescription className="mt-2">{bot.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mensagens</p>
                      <p className="text-lg font-semibold">{bot.messagesCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Usuários</p>
                      <p className="text-lg font-semibold">{bot.usersCount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="flex-1 hover-glow">
                      <Edit className="mr-2 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover-glow"
                      onClick={() => navigate('/stats')}
                    >
                      <BarChart3 className="mr-2 h-3 w-3" />
                      Stats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive"
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
