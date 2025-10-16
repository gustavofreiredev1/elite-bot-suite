import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, Upload, Bot } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProgressBar from '@/components/ProgressBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';

const botSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  token: z.string().min(10, 'Token inválido'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  prefix: z.string().default('/'),
  inlineMode: z.boolean().default(false),
  welcomeMessage: z.string().min(5, 'Mensagem de boas-vindas muito curta'),
  helpMessage: z.string().min(5, 'Mensagem de ajuda muito curta'),
});

type BotForm = z.infer<typeof botSchema>;

export default function CreateBot() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const form = useForm<BotForm>({
    resolver: zodResolver(botSchema),
    defaultValues: {
      name: '',
      token: '',
      description: '',
      prefix: '/',
      inlineMode: false,
      welcomeMessage: 'Olá! Bem-vindo ao bot.',
      helpMessage: 'Use /start para começar.',
    },
  });

  const onSubmit = async (data: BotForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Bot criado com sucesso!');
    navigate('/my-bots');
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['name', 'token'] : step === 2 ? ['description', 'prefix'] : ['welcomeMessage', 'helpMessage'];
    const isValid = await form.trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const steps = [
    { number: 1, title: 'Informações Básicas', description: 'Nome e token do bot' },
    { number: 2, title: 'Configurações', description: 'Personalize seu bot' },
    { number: 3, title: 'Mensagens', description: 'Configure as mensagens automáticas' },
    { number: 4, title: 'Confirmação', description: 'Revise e confirme' },
  ];

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <PageHeader
          title="Criar Novo Bot"
          description="Configure seu bot em poucos passos"
          icon={Bot}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: 'Criar Bot' }
          ]}
        />

        <ProgressBar value={(step / 4) * 100} className="mb-4" glow />

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
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name">Nome do Bot</Label>
                      <Input id="name" placeholder="Ex: Atendimento Bot" {...form.register('name')} />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="token">Token do Telegram</Label>
                      <Input id="token" placeholder="123456789:ABCdefGHI..." {...form.register('token')} />
                      {form.formState.errors.token && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.token.message}</p>
                      )}
                    </div>
                    <div>
                      <Label>Foto do Bot (opcional)</Label>
                      <Button variant="outline" className="w-full" type="button">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload da Foto
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        placeholder="Descreva a função do seu bot..."
                        {...form.register('description')}
                      />
                      {form.formState.errors.description && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.description.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="prefix">Prefixo de Comandos</Label>
                      <Input id="prefix" placeholder="/" {...form.register('prefix')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="inline">Modo Inline</Label>
                        <p className="text-xs text-muted-foreground">Habilitar respostas inline</p>
                      </div>
                      <Switch id="inline" {...form.register('inlineMode')} />
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
                    <div>
                      <Label htmlFor="welcome">Mensagem de Boas-vindas</Label>
                      <Textarea
                        id="welcome"
                        placeholder="Mensagem enviada no /start"
                        {...form.register('welcomeMessage')}
                      />
                      {form.formState.errors.welcomeMessage && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.welcomeMessage.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="help">Mensagem de Ajuda</Label>
                      <Textarea
                        id="help"
                        placeholder="Mensagem enviada no /help"
                        {...form.register('helpMessage')}
                      />
                      {form.formState.errors.helpMessage && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.helpMessage.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="glass p-6 rounded-xl space-y-4">
                      <h3 className="font-bold text-lg">Resumo do Bot</h3>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Nome:</span> {form.watch('name')}</p>
                        <p><span className="text-muted-foreground">Token:</span> {form.watch('token').slice(0, 20)}...</p>
                        <p><span className="text-muted-foreground">Descrição:</span> {form.watch('description')}</p>
                        <p><span className="text-muted-foreground">Prefixo:</span> {form.watch('prefix')}</p>
                        <p><span className="text-muted-foreground">Inline:</span> {form.watch('inlineMode') ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>
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
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} className="flex-1 hover-glow">
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 hover-glow">
                    <Check className="mr-2 h-4 w-4" />
                    Criar Bot
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
