import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Bot, Check, Loader2, ArrowRight, ExternalLink, AlertCircle, Plug } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import { validateToken, connectBot } from '@/lib/telegram';

const tokenSchema = z.string().min(30, 'Token muito curto').max(200, 'Token muito longo');

export default function CreateBot() {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [botInfo, setBotInfo] = useState<{ username: string; first_name: string } | null>(null);
  const navigate = useNavigate();

  const handleValidate = async () => {
    const result = tokenSchema.safeParse(token.trim());
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setIsValidating(true);
    try {
      const data = await validateToken(token.trim());
      setBotInfo(data.bot_info);
      toast.success(`Bot @${data.bot_info.username} validado com sucesso!`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao validar token');
      setBotInfo(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectBot(token.trim(), botInfo?.first_name);
      toast.success('Bot conectado e webhook configurado!');
      navigate('/my-bots');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao conectar bot');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <PageHeader
          title="Conectar Bot"
          description="Cole o token do BotFather para conectar seu bot"
          icon={Plug}
          breadcrumbs={[
            { label: 'Painel', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: 'Conectar Bot' },
          ]}
        />

        <Alert className="border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Como obter o token:</strong> Abra o Telegram, busque{' '}
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary inline-flex items-center gap-1"
            >
              @BotFather <ExternalLink className="h-3 w-3" />
            </a>
            , envie <code>/newbot</code> e siga as instruções.
          </AlertDescription>
        </Alert>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Token do Bot
            </CardTitle>
            <CardDescription>Cole o token recebido do @BotFather</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setBotInfo(null);
                }}
                className="font-mono"
              />
            </div>

            {!botInfo ? (
              <Button
                onClick={handleValidate}
                disabled={!token.trim() || isValidating}
                className="w-full hover-glow"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    Validar Token
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="glass p-4 rounded-lg flex items-center gap-4">
                  <div className="p-3 rounded-full bg-success/10">
                    <Check className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold">@{botInfo.username}</p>
                    <p className="text-sm text-muted-foreground">{botInfo.first_name}</p>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full hover-glow"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando e configurando webhook...
                    </>
                  ) : (
                    <>
                      <Plug className="mr-2 h-4 w-4" />
                      Conectar Bot
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
}
