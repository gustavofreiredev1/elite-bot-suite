import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Upload, Play, Pause, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

interface MassReactJob {
  id: string;
  channelName: string;
  totalMessages: number;
  completed: number;
  emojis: string[];
  status: 'running' | 'paused' | 'completed';
  createdAt: string;
}

const mockJobs: MassReactJob[] = [
  {
    id: '1',
    channelName: 'Canal Promo',
    totalMessages: 500,
    completed: 350,
    emojis: ['🔥', '👍', '❤️'],
    status: 'running',
    createdAt: '2025-01-20 15:00',
  },
];

export default function MassReactTab() {
  const [jobs, setJobs] = useState<MassReactJob[]>(mockJobs);
  const [formData, setFormData] = useState({
    channelId: '',
    messageIds: '',
    emojis: '🔥 👍 ❤️',
    delay: [3],
    sessions: '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Campanha de reações em massa iniciada!');
  };

  const toggleStatus = (id: string) => {
    setJobs(jobs.map(j => 
      j.id === id 
        ? { ...j, status: j.status === 'running' ? 'paused' : 'running' as const }
        : j
    ));
    toast.success('Status atualizado!');
  };

  const popularEmojis = ['🔥', '👍', '❤️', '😍', '💯', '⚡', '🎉', '👏', '💪', '🚀'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Reações em Massa (Mass React)
            </CardTitle>
            <CardDescription>Reaja em centenas de mensagens automaticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channelId">ID do Canal</Label>
                <Input
                  id="channelId"
                  placeholder="-1001234567890"
                  value={formData.channelId}
                  onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageIds">IDs das Mensagens</Label>
                <div className="flex gap-2">
                  <Textarea
                    id="messageIds"
                    placeholder="123, 124, 125, 126... ou cole a lista"
                    rows={3}
                    value={formData.messageIds}
                    onChange={(e) => setFormData({ ...formData, messageIds: e.target.value })}
                  />
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cole IDs separados por vírgula ou faça upload de arquivo TXT
                </p>
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
                    placeholder="🔥 👍 ❤️ (separados por espaço)"
                    value={formData.emojis}
                    onChange={(e) => setFormData({ ...formData, emojis: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Delay entre Reações: {formData.delay[0]}s</Label>
                  <Badge variant="secondary">{formData.delay[0]}s</Badge>
                </div>
                <Slider
                  value={formData.delay}
                  onValueChange={(value) => setFormData({ ...formData, delay: value })}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de espera entre cada reação (anti-ban)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessions">Número de Sessões (contas simultâneas)</Label>
                <Input
                  id="sessions"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.sessions}
                  onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Mais sessões = mais rápido (requer arquivos .session)
                </p>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Zap className="h-4 w-4 mr-2" />
                Iniciar Reações em Massa
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Campanhas de Reação</CardTitle>
            <CardDescription>Monitoramento em tempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Concluído</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead>Emojis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.channelName}</TableCell>
                    <TableCell>{job.totalMessages}</TableCell>
                    <TableCell className="text-success">{job.completed}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(job.completed / job.totalMessages) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((job.completed / job.totalMessages) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {job.emojis.map((emoji, idx) => (
                          <span key={idx} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === 'running' ? 'default' :
                          job.status === 'completed' ? 'secondary' : 'destructive'
                        }
                      >
                        {job.status === 'running' ? '● Executando' :
                         job.status === 'paused' ? 'Pausado' : '✓ Concluído'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(job.id)}
                        >
                          {job.status === 'running' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
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
