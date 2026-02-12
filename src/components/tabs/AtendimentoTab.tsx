import { useState } from 'react';
import { Bot, MessageSquare, Zap, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AtendimentoTab() {
  const [config, setConfig] = useState({
    welcomeMessage: 'Olá! Como posso ajudar?',
    aiEnabled: true,
    humanHandoff: true,
    handoffKeyword: '/humano',
    maxResponseTime: '30',
  });
  const [commands, setCommands] = useState([
    { trigger: '/start', response: 'Bem-vindo! Escolha uma opção:', isActive: true },
    { trigger: '/ajuda', response: 'Como posso ajudar?\n1. Suporte\n2. Vendas\n3. FAQ', isActive: true },
    { trigger: '/faq', response: 'Perguntas frequentes:\n- Como funciona?\n- Quanto custa?\n- Como pagar?', isActive: true },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Atendimento Auto</h3>
        <p className="text-muted-foreground mt-1">Respostas automáticas + IA + transferência para humano</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">24/7</div><p className="text-sm text-muted-foreground">Disponibilidade</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{commands.length}</div><p className="text-sm text-muted-foreground">Comandos Ativos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{'< 2s'}</div><p className="text-sm text-muted-foreground">Tempo de Resposta</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />Configurações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Mensagem de Boas-Vindas</Label><Textarea value={config.welcomeMessage} onChange={e => setConfig(c => ({ ...c, welcomeMessage: e.target.value }))} /></div>
          <div className="flex items-center gap-3"><Switch checked={config.aiEnabled} onCheckedChange={v => setConfig(c => ({ ...c, aiEnabled: v }))} /><div><p className="text-sm font-medium">IA Ativada</p><p className="text-xs text-muted-foreground">Respostas inteligentes com IA</p></div></div>
          <div className="flex items-center gap-3"><Switch checked={config.humanHandoff} onCheckedChange={v => setConfig(c => ({ ...c, humanHandoff: v }))} /><div><p className="text-sm font-medium">Transferência para Humano</p><p className="text-xs text-muted-foreground">Escale para atendente quando necessário</p></div></div>
          <Button onClick={() => toast.success('Configurações salvas!')}>Salvar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Respostas Automáticas</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commands.map((cmd, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div>
                  <Badge variant="outline" className="font-mono">{cmd.trigger}</Badge>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{cmd.response}</p>
                </div>
                <Switch checked={cmd.isActive} onCheckedChange={v => setCommands(prev => prev.map((c, j) => j === i ? { ...c, isActive: v } : c))} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
