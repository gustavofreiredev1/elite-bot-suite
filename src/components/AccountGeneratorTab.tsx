import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Key, Shield, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface GeneratedAccount {
  id: string;
  phone: string;
  username: string;
  sessionFile: string;
  status: 'active' | 'pending' | 'error';
  createdAt: string;
}

const mockAccounts: GeneratedAccount[] = [
  {
    id: '1',
    phone: '+55 11 98765-4321',
    username: '@user_12345',
    sessionFile: 'session_12345.session',
    status: 'active',
    createdAt: '2025-01-20 08:30',
  },
];

export default function AccountGeneratorTab() {
  const [accounts, setAccounts] = useState<GeneratedAccount[]>(mockAccounts);
  const [formData, setFormData] = useState({
    apiId: '',
    apiHash: '',
    smsApiKey: '',
    proxyUrl: '',
    quantity: '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Geração de contas iniciada!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Gerador de Contas Telegram
            </CardTitle>
            <CardDescription>Crie e valide contas automaticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="glass p-4 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-warning">
                  <Shield className="h-4 w-4" />
                  <p className="text-sm">Credenciais API Telegram</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apiId">API ID</Label>
                    <Input
                      id="apiId"
                      placeholder="12345678"
                      value={formData.apiId}
                      onChange={(e) => setFormData({ ...formData, apiId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apiHash">API Hash</Label>
                    <Input
                      id="apiHash"
                      type="password"
                      placeholder="••••••••••••••••"
                      value={formData.apiHash}
                      onChange={(e) => setFormData({ ...formData, apiHash: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsApiKey">SMS API Key (5sim, SMS-Activate)</Label>
                <Input
                  id="smsApiKey"
                  placeholder="Chave API do serviço de SMS"
                  value={formData.smsApiKey}
                  onChange={(e) => setFormData({ ...formData, smsApiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Necessário para receber códigos de verificação
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="proxyUrl">Proxy (opcional)</Label>
                  <Input
                    id="proxyUrl"
                    placeholder="socks5://user:pass@host:port"
                    value={formData.proxyUrl}
                    onChange={(e) => setFormData({ ...formData, proxyUrl: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full hover-glow">
                <UserPlus className="h-4 w-4 mr-2" />
                Gerar Contas
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Contas Geradas</CardTitle>
            <CardDescription>Histórico de contas criadas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Arquivo de Sessão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono">{account.phone}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell className="font-mono text-xs">{account.sessionFile}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          account.status === 'active' ? 'default' :
                          account.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {account.status === 'active' ? '● Ativa' :
                         account.status === 'pending' ? 'Pendente' : 'Erro'}
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
