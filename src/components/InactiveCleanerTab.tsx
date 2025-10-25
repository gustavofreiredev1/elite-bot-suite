import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserMinus, Shield, Play, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ScanResult {
  id: string;
  groupName: string;
  groupId: string;
  totalMembers: number;
  inactiveMembers: number;
  status: 'analyzing' | 'completed';
  createdAt: string;
}

const mockScans: ScanResult[] = [
  {
    id: '1',
    groupName: 'Grupo Vendas Premium',
    groupId: '-1001234567890',
    totalMembers: 5000,
    inactiveMembers: 1240,
    status: 'completed',
    createdAt: '2025-01-20 10:15',
  },
];

export default function InactiveCleanerTab() {
  const [scans, setScans] = useState<ScanResult[]>(mockScans);
  const [formData, setFormData] = useState({
    groupId: '',
    inactiveDays: '30',
    autoRemove: false,
    excludeAdmins: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Análise iniciada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-primary" />
              Detector de Membros Inativos
            </CardTitle>
            <CardDescription>Analise e limpe grupos de contas inativas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="groupId">ID do Grupo</Label>
                  <Input
                    id="groupId"
                    placeholder="-1001234567890"
                    value={formData.groupId}
                    onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inactiveDays">Dias de Inatividade</Label>
                  <Input
                    id="inactiveDays"
                    type="number"
                    placeholder="30"
                    value={formData.inactiveDays}
                    onChange={(e) => setFormData({ ...formData, inactiveDays: e.target.value })}
                  />
                </div>
              </div>

              <div className="glass p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRemove">Remoção Automática</Label>
                    <p className="text-xs text-muted-foreground">Remove inativos automaticamente</p>
                  </div>
                  <Switch
                    id="autoRemove"
                    checked={formData.autoRemove}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoRemove: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="excludeAdmins">Proteger Administradores</Label>
                    <p className="text-xs text-muted-foreground">Não remove admins mesmo se inativos</p>
                  </div>
                  <Switch
                    id="excludeAdmins"
                    checked={formData.excludeAdmins}
                    onCheckedChange={(checked) => setFormData({ ...formData, excludeAdmins: checked })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Análise
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Análises Realizadas</CardTitle>
            <CardDescription>Histórico de limpeza de grupos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Total Membros</TableHead>
                  <TableHead>Inativos</TableHead>
                  <TableHead>% Inativo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.groupName}</TableCell>
                    <TableCell>{scan.totalMembers.toLocaleString()}</TableCell>
                    <TableCell className="text-warning">{scan.inactiveMembers.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {((scan.inactiveMembers / scan.totalMembers) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={scan.status === 'completed' ? 'default' : 'secondary'}>
                        {scan.status === 'completed' ? '✓ Concluído' : '● Analisando'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-3 w-3" />
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
