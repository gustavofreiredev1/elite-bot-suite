import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Trash2, Edit, Zap, GitBranch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/GlassCard';

interface Automation {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: 'active' | 'inactive';
  executions: number;
}

const mockAutomations: Automation[] = [
  {
    id: '1',
    name: 'Boas-vindas Automáticas',
    trigger: 'Recebe /start',
    action: 'Enviar mensagem de boas-vindas',
    status: 'active',
    executions: 450,
  },
  {
    id: '2',
    name: 'Resposta Fora do Horário',
    trigger: 'Mensagem após 18h',
    action: 'Enviar horário de atendimento',
    status: 'active',
    executions: 128,
  },
  {
    id: '3',
    name: 'Adicionar ao Grupo',
    trigger: 'Comando /grupo',
    action: 'Enviar link do grupo',
    status: 'inactive',
    executions: 67,
  },
];

export default function Automations() {
  const [automations, setAutomations] = useState(mockAutomations);

  const handleTest = (name: string) => {
    toast.success(`Automação "${name}" executada com sucesso!`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar a automação "${name}"?`)) {
      setAutomations(automations.filter((auto) => auto.id !== id));
      toast.success('Automação deletada!');
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
            <h1 className="text-3xl font-bold">Automações</h1>
            <p className="text-muted-foreground">Configure fluxos automáticos para seus bots</p>
          </div>
          <Button className="hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Nova Automação
          </Button>
        </div>

        <Card className="card-elegant relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              Builder Visual
            </CardTitle>
            <CardDescription>Arraste e conecte os blocos para criar fluxos automáticos</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px] p-6 border-2 border-dashed border-primary/30 rounded-xl bg-background/50">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-strong p-6 rounded-xl cursor-move space-y-3 hover-glow group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold shadow-glow">
                  1
                </div>
                <h4 className="font-semibold text-lg">Gatilho</h4>
                <p className="text-sm text-muted-foreground">Quando receber /start</p>
                <Badge className="bg-primary/20 text-primary">Evento</Badge>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-strong p-6 rounded-xl cursor-move space-y-3 hover-glow group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold shadow-glow">
                  2
                </div>
                <h4 className="font-semibold text-lg">Ação</h4>
                <p className="text-sm text-muted-foreground">Enviar mensagem personalizada</p>
                <Badge className="bg-secondary/20 text-secondary">Resposta</Badge>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="glass-strong p-6 rounded-xl cursor-move space-y-3 hover-glow group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold shadow-glow">
                  3
                </div>
                <h4 className="font-semibold text-lg">Condição</h4>
                <p className="text-sm text-muted-foreground">Se usuário é novo</p>
                <Badge className="bg-accent/20 text-accent">Lógica</Badge>
              </motion.div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4 text-primary animate-pulse-glow" />
              <p className="text-sm text-muted-foreground">
                Arraste os blocos acima para criar seu fluxo de automação
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Automações Criadas</h2>
          <div className="grid gap-4">
            {automations.map((auto, index) => (
              <motion.div
                key={auto.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
              >
                <Card className="card-glow group relative overflow-hidden">
                  <div className="absolute inset-0 gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {auto.name}
                          <Badge
                            variant={auto.status === 'active' ? 'default' : 'secondary'}
                            className={auto.status === 'active' ? 'bg-success shadow-glow' : 'bg-muted'}
                          >
                            {auto.status === 'active' ? '● Ativo' : 'Inativo'}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-primary" />
                          {auto.executions.toLocaleString()} execuções
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTest(auto.name)}
                          className="hover-glow"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover-glow">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(auto.id, auto.name)}
                          className="hover:bg-destructive/10 hover:text-destructive transition-smooth"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
                        <span className="text-muted-foreground">Gatilho:</span>
                        <span className="font-medium">{auto.trigger}</span>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-2 h-2 rounded-full bg-secondary shadow-glow" />
                        <span className="text-muted-foreground">Ação:</span>
                        <span className="font-medium">{auto.action}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
