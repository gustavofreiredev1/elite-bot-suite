import { ReactNode, useEffect, useState } from 'react';
import { usePlanStore } from '@/store/planStore';
import PlansModal from '@/components/PlansModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Lock, Clock, Gift } from 'lucide-react';

interface PlanGuardProps {
  botId: string;
  children: ReactNode;
}

export default function PlanGuard({ botId, children }: PlanGuardProps) {
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [accessStatus, setAccessStatus] = useState<{
    allowed: boolean;
    reason?: string;
  }>({ allowed: true });
  const { canUseBot, useFreeBot, initializeTrial } = usePlanStore();

  useEffect(() => {
    initializeTrial();
    const status = canUseBot(botId);
    setAccessStatus(status);
  }, [botId, canUseBot, initializeTrial]);

  const handleUseBot = () => {
    useFreeBot(botId);
    setAccessStatus({ allowed: true, reason: 'free-24h' });
  };

  if (!accessStatus.allowed) {
    if (accessStatus.reason === 'wait-24h') {
      return (
        <div className="space-y-4">
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <Clock className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-lg font-semibold">Aguarde 24 horas</AlertTitle>
            <AlertDescription className="mt-2">
              Você já usou este bot gratuitamente hoje. Para continuar usando sem limitações,
              adquira um plano.
            </AlertDescription>
          </Alert>
          <Button onClick={() => setShowPlansModal(true)} className="w-full" size="lg">
            Ver Planos
          </Button>
          <PlansModal
            open={showPlansModal}
            onOpenChange={setShowPlansModal}
            botId={botId}
          />
        </div>
      );
    }

    if (accessStatus.reason === 'trial-ended') {
      return (
        <div className="space-y-4">
          <Alert className="border-primary/50 bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-semibold">Trial encerrado</AlertTitle>
            <AlertDescription className="mt-2">
              Seu período de teste de 7 dias terminou. Você ainda pode usar este bot
              gratuitamente a cada 24h ou adquirir um plano para acesso ilimitado.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleUseBot} variant="outline" size="lg">
              Usar Grátis (24h)
            </Button>
            <Button onClick={() => setShowPlansModal(true)} size="lg">
              Ver Planos
            </Button>
          </div>
          <PlansModal
            open={showPlansModal}
            onOpenChange={setShowPlansModal}
            botId={botId}
          />
        </div>
      );
    }
  }

  return (
    <>
      {accessStatus.reason === 'trial' && (
        <Alert className="mb-4 border-primary/50 bg-primary/10">
          <Gift className="h-5 w-5 text-primary" />
          <AlertTitle>Período de teste ativo</AlertTitle>
          <AlertDescription>
            Você está no trial de 7 dias. Aproveite para testar todas as funcionalidades!
          </AlertDescription>
        </Alert>
      )}
      {children}
    </>
  );
}
