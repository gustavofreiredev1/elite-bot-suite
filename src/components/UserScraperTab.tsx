import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Download, Play, Trash2, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ScrapeJob {
  id: string;
  groupName: string;
  groupId: string;
  totalMembers: number;
  extracted: number;
  status: 'processing' | 'completed' | 'error';
  filters: string[];
  createdAt: string;
}

const mockJobs: ScrapeJob[] = [
  {
    id: '1',
    groupName: 'Grupo Tech Brasil',
    groupId: '-1001234567890',
    totalMembers: 5000,
    extracted: 4850,
    status: 'completed',
    filters: ['Ativos', 'Com username'],
    createdAt: '2025-01-15 10:00',
  },
];

export default function UserScraperTab() {
  const [jobs, setJobs] = useState<ScrapeJob[]>(mockJobs);
  const [formData, setFormData] = useState({
    groupId: '',
    filterOnline: false,
    filterUsername: true,
    filterAdmin: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Extração iniciada com sucesso!');
    setFormData({
      groupId: '',
      filterOnline: false,
      filterUsername: true,
      filterAdmin: false,
    });
  };

  const downloadExport = (jobId: string) => {
    toast.success('Exportando para CSV...');
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success('Extração deletada!');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Extrair Membros de Grupos
            </CardTitle>
            <CardDescription>
              Colete listas de membros de grupos e canais públicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupId">ID do Grupo/Canal</Label>
                <Input
                  id="groupId"
                  placeholder="-1001234567890 ou @nomedogrupo"
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Use o ID numérico ou username do grupo público
                </p>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros de Extração
                </Label>
                
                <div className="space-y-3 glass p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filterOnline" className="cursor-pointer">
                      Apenas usuários online
                    </Label>
                    <Switch
                      id="filterOnline"
                      checked={formData.filterOnline}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, filterOnline: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="filterUsername" className="cursor-pointer">
                      Apenas com username público
                    </Label>
                    <Switch
                      id="filterUsername"
                      checked={formData.filterUsername}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, filterUsername: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="filterAdmin" className="cursor-pointer">
                      Excluir administradores
                    </Label>
                    <Switch
                      id="filterAdmin"
                      checked={formData.filterAdmin}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, filterAdmin: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Extração
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Extrações Realizadas</CardTitle>
            <CardDescription>Histórico de coleta de membros</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Extraídos</TableHead>
                  <TableHead>Filtros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.groupName}</TableCell>
                    <TableCell className="font-mono text-xs">{job.groupId}</TableCell>
                    <TableCell>{job.totalMembers.toLocaleString()}</TableCell>
                    <TableCell className="text-success">
                      {job.extracted.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {job.filters.map((filter, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === 'completed' ? 'default' :
                          job.status === 'processing' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {job.status === 'completed' ? '✓ Concluído' :
                         job.status === 'processing' ? '● Processando' : 'Erro'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadExport(job.id)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
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
    </div>
  );
}
