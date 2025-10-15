import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';

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

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Builder Visual</CardTitle>
            <CardDescription>Arraste e conecte os blocos para criar fluxos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px] p-6 border-2 border-dashed border-border rounded-xl">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass p-4 rounded-lg cursor-move space-y-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold">Gatilho</h4>
                <p className="text-sm text-muted-foreground">Quando receber /start</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass p-4 rounded-lg cursor-move space-y-2"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold">Ação</h4>
                <p className="text-sm text-muted-foreground">Enviar mensagem</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass p-4 rounded-lg cursor-move space-y-2"
              >
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold">Condição</h4>
                <p className="text-sm text-muted-foreground">Se usuário novo</p>
              </motion.div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Arraste os blocos acima para criar seu fluxo de automação
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
              >
                <Card className="card-elegant hover-scale">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {auto.name}
                          <Badge variant={auto.status === 'active' ? 'default' : 'secondary'}>
                            {auto.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{auto.executions} execuções</CardDescription>
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
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Gatilho:</span>
                        <span className="font-medium">{auto.trigger}</span>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
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
