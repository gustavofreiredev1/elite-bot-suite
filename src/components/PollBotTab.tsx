import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Plus, Trash2, Eye, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  isAnonymous: boolean;
  status: 'active' | 'closed';
  createdAt: string;
}

const mockPolls: Poll[] = [
  {
    id: '1',
    question: 'Qual funcionalidade você mais usa?',
    options: ['AutoPost', 'AutoPay', 'Mass Sender', 'Outros'],
    votes: [150, 230, 180, 90],
    isAnonymous: true,
    status: 'active',
    createdAt: '2025-01-20 09:00',
  },
];

export default function PollBotTab() {
  const [polls, setPolls] = useState<Poll[]>(mockPolls);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    isAnonymous: true,
    autoSchedule: false,
  });

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({ ...formData, options: formData.options.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Enquete criada com sucesso!');
    setFormData({ question: '', options: ['', ''], isAnonymous: true, autoSchedule: false });
  };

  const togglePollStatus = (id: string) => {
    setPolls(polls.map(p => 
      p.id === id 
        ? { ...p, status: p.status === 'active' ? 'closed' : 'active' as const }
        : p
    ));
    toast.success('Status da enquete atualizado!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Criar Nova Enquete
            </CardTitle>
            <CardDescription>Configure enquetes automáticas para seus grupos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Pergunta da Enquete</Label>
                <Input
                  id="question"
                  placeholder="Ex: Qual o melhor horário para postagens?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Opções de Resposta</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Opção ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    {formData.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="glass p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isAnonymous">Votação Anônima</Label>
                  <Switch
                    id="isAnonymous"
                    checked={formData.isAnonymous}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAnonymous: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSchedule">Enquete Diária Automática</Label>
                  <Switch
                    id="autoSchedule"
                    checked={formData.autoSchedule}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoSchedule: checked })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Plus className="h-4 w-4 mr-2" />
                Criar Enquete
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Enquetes Ativas</CardTitle>
            <CardDescription>Gerencie e visualize resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pergunta</TableHead>
                  <TableHead>Total Votos</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell className="font-medium">{poll.question}</TableCell>
                    <TableCell>{poll.votes.reduce((a, b) => a + b, 0)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {poll.isAnonymous ? 'Anônima' : 'Pública'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                        {poll.status === 'active' ? '● Ativa' : 'Encerrada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePollStatus(poll.id)}
                        >
                          {poll.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
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
