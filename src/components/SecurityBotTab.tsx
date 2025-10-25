import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SecurityConfig {
  id: string;
  groupName: string;
  groupId: string;
  blockedLinks: number;
  warnings: number;
  bans: number;
  status: 'active' | 'inactive';
}

const mockConfigs: SecurityConfig[] = [
  {
    id: '1',
    groupName: 'Grupo VIP',
    groupId: '-1001234567890',
    blockedLinks: 45,
    warnings: 12,
    bans: 3,
    status: 'active',
  },
];

export default function SecurityBotTab() {
  const [configs, setConfigs] = useState<SecurityConfig[]>(mockConfigs);
  const [formData, setFormData] = useState({
    groupId: '',
    blockLinks: true,
    blockInvites: true,
    blockSpam: true,
    warnsLimit: '3',
    whitelist: '',
    autoDelete: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuração de segurança ativada!');
  };

  const toggleStatus = (id: string) => {
    setConfigs(configs.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' as const }
        : c
    ));
    toast.success('Status atualizado!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Bot Anti-Link / Anti-Spam
            </CardTitle>
            <CardDescription>Proteja seus grupos contra links e spam</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupId">ID do Grupo</Label>
                <Input
                  id="groupId"
                  placeholder="-1001234567890"
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Regras de Segurança</Label>
                <div className="glass p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="blockLinks">Bloquear Links Externos</Label>
                    <Switch
                      id="blockLinks"
                      checked={formData.blockLinks}
                      onCheckedChange={(checked) => setFormData({ ...formData, blockLinks: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="blockInvites">Bloquear Convites de Grupos</Label>
                    <Switch
                      id="blockInvites"
                      checked={formData.blockInvites}
                      onCheckedChange={(checked) => setFormData({ ...formData, blockInvites: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="blockSpam">Detector de Spam/Flood</Label>
                    <Switch
                      id="blockSpam"
                      checked={formData.blockSpam}
                      onCheckedChange={(checked) => setFormData({ ...formData, blockSpam: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoDelete">Auto-deletar Mensagens Suspeitas</Label>
                    <Switch
                      id="autoDelete"
                      checked={formData.autoDelete}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoDelete: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warnsLimit">Limite de Avisos (antes do ban)</Label>
                <Input
                  id="warnsLimit"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.warnsLimit}
                  onChange={(e) => setFormData({ ...formData, warnsLimit: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Após X avisos, o usuário será banido automaticamente
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whitelist">Lista Branca (opcional)</Label>
                <Textarea
                  id="whitelist"
                  placeholder="youtube.com, github.com, @admin_user"
                  rows={3}
                  value={formData.whitelist}
                  onChange={(e) => setFormData({ ...formData, whitelist: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Domínios e usuários permitidos (um por linha)
                </p>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Shield className="h-4 w-4 mr-2" />
                Ativar Proteção
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Grupos Protegidos</CardTitle>
            <CardDescription>Monitoramento de segurança</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Links Bloqueados</TableHead>
                  <TableHead>Avisos</TableHead>
                  <TableHead>Bans</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.groupName}</TableCell>
                    <TableCell className="text-warning">{config.blockedLinks}</TableCell>
                    <TableCell className="text-destructive">{config.warnings}</TableCell>
                    <TableCell className="text-destructive font-bold">{config.bans}</TableCell>
                    <TableCell>
                      <Badge variant={config.status === 'active' ? 'default' : 'secondary'}>
                        {config.status === 'active' ? '● Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(config.id)}
                        >
                          {config.status === 'active' ? <Ban className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
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
