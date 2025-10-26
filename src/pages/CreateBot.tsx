import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, Bot, KeyRound, Phone, Hash, Shield, ExternalLink, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import { useTelegramConfigStore } from '@/store/telegramConfigStore';

const telegramConfigSchema = z.object({
  apiId: z.string().min(1, 'API ID é obrigatório').regex(/^\d+$/, 'API ID deve conter apenas números'),
  apiHash: z.string().min(32, 'API Hash inválido (deve ter 32 caracteres)').max(32, 'API Hash inválido (deve ter 32 caracteres)'),
  phoneNumber: z.string().min(8, 'Número de telefone inválido').regex(/^\+?[1-9]\d{1,14}$/, 'Use formato internacional: +55...'),
  sessionName: z.string().min(3, 'Nome da sessão deve ter no mínimo 3 caracteres').max(50, 'Nome muito longo'),
});

type TelegramConfigForm = z.infer<typeof telegramConfigSchema>;

export default function CreateBot() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setConfig } = useTelegramConfigStore();

  const form = useForm<TelegramConfigForm>({
    resolver: zodResolver(telegramConfigSchema),
    defaultValues: {
      apiId: '',
      apiHash: '',
      phoneNumber: '',
      sessionName: 'elite_bot_session',
    },
  });

  const onSubmit = async (data: TelegramConfigForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setConfig({
      apiId: data.apiId,
      apiHash: data.apiHash,
      phoneNumber: data.phoneNumber,
      sessionName: data.sessionName,
    });
    toast.success('Configuração do Telegram salva com sucesso! Agora você pode usar todos os bots.');
    navigate('/my-bots');
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['apiId', 'apiHash'] : ['phoneNumber', 'sessionName'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const steps = [
    { number: 1, title: 'Credenciais API', description: 'API ID e API Hash' },
    { number: 2, title: 'Autenticação', description: 'Número de telefone' },
    { number: 3, title: 'Confirmação', description: 'Revise suas configurações' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <PageHeader
          title="Configurar Telegram"
          description="Configure suas credenciais para usar todos os bots"
          icon={Shield}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: 'Configurar Telegram' }
          ]}
        />

        <Alert className="border-primary/50 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Você precisa obter suas credenciais da API do Telegram em{' '}
            <a 
              href="https://my.telegram.org/auth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-primary inline-flex items-center gap-1"
            >
              my.telegram.org <ExternalLink className="h-3 w-3" />
            </a>
          </AlertDescription>
        </Alert>

        <ProgressBar value={(step / 3) * 100} className="mb-4" glow />

        {/* Progress Steps */}
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s.number ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{s.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 rounded ${step > s.number ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>{steps[step - 1].title}</CardTitle>
            <CardDescription>{steps[step - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="glass p-4 rounded-lg space-y-2">
                      <div className="flex items-start gap-3">
                        <KeyRound className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Como obter suas credenciais?</h4>
                          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Acesse <a href="https://my.telegram.org/auth" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">my.telegram.org</a> e faça login</li>
                            <li>Vá em "API development tools"</li>
                            <li>Crie um novo aplicativo ou use um existente</li>
                            <li>Copie seu API ID e API Hash</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="apiId" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        API ID
                      </Label>
                      <Input 
                        id="apiId" 
                        placeholder="12345678" 
                        {...form.register('apiId')} 
                        className="mt-2"
                      />
                      {form.formState.errors.apiId && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.apiId.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Número de 8 dígitos fornecido pelo Telegram</p>
                    </div>

                    <div>
                      <Label htmlFor="apiHash" className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        API Hash
                      </Label>
                      <Input 
                        id="apiHash" 
                        placeholder="1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p" 
                        {...form.register('apiHash')}
                        className="mt-2"
                        type="password"
                      />
                      {form.formState.errors.apiHash && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.apiHash.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Hash de 32 caracteres fornecido pelo Telegram</p>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="glass p-4 rounded-lg space-y-2">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Segurança e Privacidade</h4>
                          <p className="text-xs text-muted-foreground">
                            Suas credenciais são armazenadas localmente no seu navegador e nunca são enviadas para servidores externos. 
                            Você manterá controle total sobre sua conta Telegram.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Número de Telefone
                      </Label>
                      <Input 
                        id="phoneNumber" 
                        placeholder="+5511999999999" 
                        {...form.register('phoneNumber')}
                        className="mt-2"
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.phoneNumber.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Use formato internacional com código do país (+55 para Brasil)</p>
                    </div>

                    <div>
                      <Label htmlFor="sessionName">
                        Nome da Sessão
                      </Label>
                      <Input 
                        id="sessionName" 
                        placeholder="elite_bot_session" 
                        {...form.register('sessionName')}
                        className="mt-2"
                      />
                      {form.formState.errors.sessionName && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.sessionName.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Identificador único para sua sessão Telegram</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="glass p-6 rounded-xl space-y-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Check className="h-5 w-5 text-success" />
                        Resumo da Configuração
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <Hash className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">API ID</p>
                            <p className="font-mono text-sm">{form.watch('apiId')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <KeyRound className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">API Hash</p>
                            <p className="font-mono text-sm">{form.watch('apiHash').slice(0, 16)}...</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Telefone</p>
                            <p className="font-mono text-sm">{form.watch('phoneNumber')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <Bot className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Nome da Sessão</p>
                            <p className="font-mono text-sm">{form.watch('sessionName')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert className="border-success/50 bg-success/5">
                      <Check className="h-4 w-4 text-success" />
                      <AlertDescription>
                        Após confirmar, você poderá usar todos os 17 bots disponíveis na plataforma!
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={nextStep} className="flex-1 hover-glow">
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 hover-glow">
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Configuração
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
}
