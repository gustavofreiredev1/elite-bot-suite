import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Edit, Trash2, Plus, DollarSign, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AutoPayBot {
  id: string;
  name: string;
  chatId: string;
  token: string;
  mpAccessToken: string;
  productValue: number;
  productDescription: string;
  customCommand: string;
  status: 'active' | 'inactive';
  lastTransaction: string;
  totalSales: number;
}

interface Transaction {
  id: string;
  botName: string;
  value: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  customerName: string;
}

export default function AutoPayTab() {
  const [bots, setBots] = useState<AutoPayBot[]>([
    {
      id: '1',
      name: 'Loja Premium',
      chatId: '-1001234567890',
      token: '1234567890:ABC...',
      mpAccessToken: 'APP_USR-...',
      productValue: 49.90,
      productDescription: 'Acesso Premium - 30 dias',
      customCommand: '/comprar',
      status: 'active',
      lastTransaction: 'Há 10 minutos',
      totalSales: 1250.00,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      botName: 'Loja Premium',
      value: 49.90,
      status: 'approved',
      date: 'Há 10 minutos',
      customerName: 'João Silva',
    },
    {
      id: '2',
      botName: 'Loja Premium',
      value: 49.90,
      status: 'pending',
      date: 'Há 25 minutos',
      customerName: 'Maria Santos',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AutoPayBot | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    chatId: '',
    token: '',
    mpAccessToken: '',
    productValue: 0,
    productDescription: '',
    customCommand: '/comprar',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBot) {
      setBots(bots.map(bot => 
        bot.id === editingBot.id 
          ? { ...bot, ...formData }
          : bot
      ));
      toast.success('Bot AutoPay atualizado com sucesso!');
    } else {
      const newBot: AutoPayBot = {
        id: Date.now().toString(),
        ...formData,
        status: 'inactive',
        lastTransaction: 'Nunca',
        totalSales: 0,
      };
      setBots([...bots, newBot]);
      toast.success('Bot AutoPay criado com sucesso!');
    }

    setIsDialogOpen(false);
    setEditingBot(null);
    setFormData({
      name: '',
      chatId: '',
      token: '',
      mpAccessToken: '',
      productValue: 0,
      productDescription: '',
      customCommand: '/comprar',
    });
  };

  const toggleBotStatus = (id: string) => {
    setBots(bots.map(bot => 
      bot.id === id 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
    toast.success('Status do bot atualizado!');
  };

  const handleEdit = (bot: AutoPayBot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      chatId: bot.chatId,
      token: bot.token,
      mpAccessToken: bot.mpAccessToken,
      productValue: bot.productValue,
      productDescription: bot.productDescription,
      customCommand: bot.customCommand,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja deletar o bot "${name}"?`)) {
      setBots(bots.filter(bot => bot.id !== id));
      toast.success('Bot AutoPay deletado com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">AutoPay BOT</h3>
          <p className="text-muted-foreground mt-1">
            Automação de vendas com pagamento Pix via MercadoPago
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hover-glow" onClick={() => {
              setEditingBot(null);
              setFormData({
                name: '',
                chatId: '',
                token: '',
                mpAccessToken: '',
                productValue: 0,
                productDescription: '',
                customCommand: '/comprar',
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Novo AutoPay
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBot ? 'Editar Bot AutoPay' : 'Criar Novo Bot AutoPay'}
              </DialogTitle>
              <DialogDescription>
                Configure um bot para vendas automáticas com pagamento Pix
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Bot</Label>
                <Input
                  id="name"
                  placeholder="Ex: Loja Premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token do Bot (BotFather)</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mpAccessToken">Access Token MercadoPago</Label>
                <Input
                  id="mpAccessToken"
                  type="password"
                  placeholder="APP_USR-..."
                  value={formData.mpAccessToken}
                  onChange={(e) => setFormData({ ...formData, mpAccessToken: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Obtenha seu Access Token em{' '}
                  <a 
                    href="https://www.mercadopago.com.br/developers" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    MercadoPago Developers
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatId">Chat ID (Grupo/Canal)</Label>
                <Input
                  id="chatId"
                  placeholder="-1001234567890"
                  value={formData.chatId}
                  onChange={(e) => setFormData({ ...formData, chatId: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productValue">Valor (R$)</Label>
                  <Input
                    id="productValue"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="49.90"
                    value={formData.productValue || ''}
                    onChange={(e) => setFormData({ ...formData, productValue: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCommand">Comando Personalizado</Label>
                  <Input
                    id="customCommand"
                    placeholder="/comprar"
                    value={formData.customCommand}
                    onChange={(e) => setFormData({ ...formData, customCommand: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productDescription">Descrição do Produto/Serviço</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Acesso Premium - 30 dias de benefícios exclusivos"
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                <div className="flex gap-2 items-start">
                  <QrCode className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Fluxo de Pagamento</p>
                    <p className="text-xs text-muted-foreground">
                      1. Cliente envia comando (ex: /comprar)<br />
                      2. Bot gera QR Code Pix automaticamente<br />
                      3. Cliente paga via Pix<br />
                      4. Bot confirma pagamento e libera acesso
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 hover-glow">
                  {editingBot ? 'Salvar Alterações' : 'Criar Bot AutoPay'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingBot(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bots AutoPay Ativos</CardTitle>
          <CardDescription>
            Gerencie seus bots de vendas automáticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Bot</TableHead>
                  <TableHead>Chat ID</TableHead>
                  <TableHead>Valor Padrão</TableHead>
                  <TableHead>Total em Vendas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Transação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum bot AutoPay configurado
                    </TableCell>
                  </TableRow>
                ) : (
                  bots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell className="font-mono text-sm">{bot.chatId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1 font-mono">
                          <DollarSign className="h-3 w-3" />
                          R$ {bot.productValue.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        R$ {bot.totalSales.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={bot.status === 'active' ? 'default' : 'secondary'}
                          className={bot.status === 'active' ? 'bg-success shadow-glow' : ''}
                        >
                          {bot.status === 'active' ? '● Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bot.lastTransaction}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant={bot.status === 'active' ? 'destructive' : 'default'}
                            onClick={() => toggleBotStatus(bot.id)}
                            className="hover-glow"
                          >
                            {bot.status === 'active' ? (
                              <>
                                <Pause className="h-3 w-3 mr-1" />
                                Parar
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Iniciar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(bot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(bot.id, bot.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bot</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação registrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.botName}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell className="font-mono">R$ {transaction.value.toFixed(2)}</TableCell>
                      <TableCell>
                        {transaction.status === 'approved' ? (
                          <Badge variant="default" className="bg-success gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Aprovado
                          </Badge>
                        ) : transaction.status === 'pending' ? (
                          <Badge variant="secondary" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Pendente
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Rejeitado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.date}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
