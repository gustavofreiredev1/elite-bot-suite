import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Database, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Backup {
  id: string;
  channelName: string;
  channelId: string;
  totalMessages: number;
  format: 'JSON' | 'HTML' | 'TXT';
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
}

const mockBackups: Backup[] = [
  {
    id: '1',
    channelName: 'Canal Tech News',
    channelId: '-1001234567890',
    totalMessages: 15420,
    format: 'JSON',
    status: 'completed',
    createdAt: '2025-01-20 14:30',
  },
];

export default function MessageBackupTab() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups);
  const [formData, setFormData] = useState({
    channelId: '',
    format: 'JSON',
    includeMedia: true,
    incremental: false,
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Backup iniciado com sucesso!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Configurar Backup de Mensagens
            </CardTitle>
            <CardDescription>Extraia e salve mensagens de canais e grupos</CardDescription>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Inicial (opcional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Final (opcional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Formato de Exportação</Label>
                <div className="flex gap-2">
                  {['JSON', 'HTML', 'TXT'].map((format) => (
                    <Button
                      key={format}
                      type="button"
                      variant={formData.format === format ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, format: format as any })}
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="glass p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="includeMedia">Incluir Mídias Anexadas</Label>
                  <Switch
                    id="includeMedia"
                    checked={formData.includeMedia}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeMedia: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="incremental">Backup Incremental</Label>
                  <Switch
                    id="incremental"
                    checked={formData.incremental}
                    onCheckedChange={(checked) => setFormData({ ...formData, incremental: checked })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Download className="h-4 w-4 mr-2" />
                Iniciar Backup
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Backups Realizados</CardTitle>
            <CardDescription>Histórico de exportações</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Mensagens</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.channelName}</TableCell>
                    <TableCell>{backup.totalMessages.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{backup.format}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={backup.status === 'completed' ? 'default' : 'secondary'}>
                        {backup.status === 'completed' ? '✓ Concluído' : '● Processando'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
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
