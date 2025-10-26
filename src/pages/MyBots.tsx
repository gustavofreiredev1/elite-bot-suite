import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, BarChart3, Search, Plus, Zap, Bot as BotIcon, Shield, CheckCircle2, XCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockBots } from '@/mocks/mockData';
import MainLayout from '@/layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AnimatedCounter from '@/components/AnimatedCounter';
import { getToolFeatures, toolColors } from '@/config/toolFeatures';
import { Separator } from '@/components/ui/separator';
import { useTelegramConfigStore } from '@/store/telegramConfigStore';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { config, isConfigured } = useTelegramConfigStore();

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
        <PageHeader
          title="Meus Bots"
          description="Gerencie todos os seus bots Telegram"
          icon={BotIcon}
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Meus Bots' }]}
          actions={
            <Button onClick={() => navigate('/create-bot')} className="hover-glow">
              <Plus className="mr-2 h-4 w-4" />
              Configurar Telegram
            </Button>
          }
        />


        {!isConfigured() && (
          <Alert className="border-destructive/50 bg-destructive/5">
            <XCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                <strong>Configuração necessária:</strong> Configure suas credenciais do Telegram para usar os bots.
              </span>
              <Button 
                size="sm" 
                onClick={() => navigate('/create-bot')}
                className="ml-4"
              >
                Configurar Agora
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isConfigured() && config && (
          <Alert className="border-success/50 bg-success/5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Telegram configurado!</strong> Conectado como {config.phoneNumber}
                </div>
                <Badge variant="outline" className="border-success text-success">
                  <Shield className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
          {filteredBots.map((bot) => {
            const features = getToolFeatures(bot.toolType);
            const gradientColor = toolColors[bot.toolType];
            
            return (
              <motion.div key={bot.id} variants={item} whileHover={{ y: -8 }}>
                <Card className="card-glow group relative overflow-hidden h-full flex flex-col">
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
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

                  <CardContent className="space-y-4 relative z-10 flex-1 flex flex-col">
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

                    <Separator className="bg-border/50" />

                    <div className="space-y-2 flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Funções Exclusivas
                      </p>
                      <div className="space-y-2">
                        {features.map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-smooth"
                            >
                              <div className="p-1.5 rounded-md bg-primary/10 shrink-0">
                                <Icon className="h-3.5 w-3.5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium leading-none mb-0.5">
                                  {feature.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 hover-glow"
                        onClick={() => navigate(`/bot/${bot.id}/${bot.toolType}`)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 hover-glow"
                        onClick={() => navigate(`/bot/${bot.id}/${bot.toolType}`)}
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
            );
          })}
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
