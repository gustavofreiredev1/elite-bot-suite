import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Square, Trash2, Download, Key } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Session {
  id: string;
  phoneNumber: string;
  accountName: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function CreateSessionsTab() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      phoneNumber: '+55 11 98765-4321',
      accountName: 'Conta Principal',
      status: 'active',
      createdAt: '2025-01-15 14:30',
    },
  ]);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    accountName: '',
    apiId: '',
    apiHash: '',
  });

  const handleCreateSession = () => {
    if (!formData.phoneNumber || !formData.accountName || !formData.apiId || !formData.apiHash) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newSession: Session = {
      id: Date.now().toString(),
      phoneNumber: formData.phoneNumber,
      accountName: formData.accountName,
      status: 'inactive',
      createdAt: new Date().toLocaleString('pt-BR'),
    };

    setSessions([...sessions, newSession]);
    setFormData({ phoneNumber: '', accountName: '', apiId: '', apiHash: '' });
    toast.success('Sessão criada com sucesso! Aguardando autenticação...');
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Deseja realmente deletar esta sessão?')) {
      setSessions(sessions.filter(s => s.id !== id));
      toast.success('Sessão deletada com sucesso!');
    }
  };

  const handleDownloadSession = (phoneNumber: string) => {
    toast.success(`Download do arquivo .session iniciado para ${phoneNumber}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Criar Nova Sessão
          </CardTitle>
          <CardDescription>
            Gere arquivos de sessão para autenticação automatizada de bots no Telegram
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Telefone *</Label>
              <Input
                id="phoneNumber"
                placeholder="+55 11 98765-4321"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountName">Nome da Conta *</Label>
              <Input
                id="accountName"
                placeholder="Minha Conta Bot"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiId">API ID *</Label>
              <Input
                id="apiId"
                placeholder="12345678"
                value={formData.apiId}
                onChange={(e) => setFormData({ ...formData, apiId: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiHash">API Hash *</Label>
              <Input
                id="apiHash"
                placeholder="abcdef123456..."
                type="password"
                value={formData.apiHash}
                onChange={(e) => setFormData({ ...formData, apiHash: e.target.value })}
                className="bg-card border-border"
              />
            </div>
          </div>
          <Button onClick={handleCreateSession} className="w-full hover-glow">
            <Plus className="mr-2 h-4 w-4" />
            Criar Sessão
          </Button>
        </CardContent>
      </Card>

      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Sessões Ativas</CardTitle>
          <CardDescription>Gerencie suas sessões de autenticação do Telegram</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Telefone</TableHead>
                <TableHead>Nome da Conta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.phoneNumber}</TableCell>
                  <TableCell>{session.accountName}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                      {session.status === 'active' ? '● Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>{session.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSession(session.phoneNumber)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteSession(session.id)}
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
  );
}
