import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Zap, MessageSquare, Crown, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'elite-bot-onboarding-complete';

const steps = [
  {
    icon: Bot,
    title: 'Bem-vindo ao Elite Bot Suite!',
    description: 'A plataforma completa para automatizar seu Telegram. Vamos configurar tudo em poucos minutos.',
    action: 'Começar',
  },
  {
    icon: Zap,
    title: 'Conecte seu Telegram',
    description: 'Configure suas credenciais da API do Telegram para começar a usar os 17 bots disponíveis.',
    action: 'Configurar',
    path: '/create-bot',
  },
  {
    icon: MessageSquare,
    title: 'Explore os Bots',
    description: 'Cada bot é especializado: envio em massa, automações, segurança, crescimento e muito mais.',
    action: 'Ver Bots',
    path: '/my-bots',
  },
  {
    icon: Crown,
    title: 'Aproveite o Trial Grátis',
    description: 'Você tem 7 dias para testar todos os bots gratuitamente. Depois, escolha o plano ideal para você.',
    action: 'Entendi!',
  },
];

export default function OnboardingGuide() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    const step = steps[currentStep];
    if (step.path) {
      navigate(step.path);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 h-8 w-8"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardContent className="relative z-10 pt-6 pb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/20 shrink-0">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={handleNext} className="hover-glow">
                    {step.action}
                    {currentStep < steps.length - 1 ? (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    ) : (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </Button>

                  <div className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-1.5 bg-primary/50' : 'w-1.5 bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
