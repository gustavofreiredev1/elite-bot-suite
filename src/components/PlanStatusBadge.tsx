import { usePlanStore } from '@/store/planStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Zap, Gift } from 'lucide-react';
import { useState } from 'react';
import PlansModal from './PlansModal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PlanStatusBadgeProps {
  compact?: boolean;
}

export default function PlanStatusBadge({ compact = false }: PlanStatusBadgeProps) {
  const [showPlansModal, setShowPlansModal] = useState(false);
  const {
    hasActiveSubscription,
    isTrialActive,
    getTrialDaysRemaining,
    getSubscriptionDaysRemaining,
    getTotalBotsPurchased,
    userPlan,
  } = usePlanStore();

  const hasSub = hasActiveSubscription();
  const isTrial = isTrialActive();
  const botsPurchased = getTotalBotsPurchased();

  if (compact) {
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-1"
              onClick={() => setShowPlansModal(true)}
            >
              {hasSub ? (
                <>
                  <Crown className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">{getSubscriptionDaysRemaining()}d</span>
                </>
              ) : isTrial ? (
                <>
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">{getTrialDaysRemaining()}d</span>
                </>
              ) : botsPurchased > 0 ? (
                <>
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">{botsPurchased}</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Free</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasSub
              ? `Assinatura ativa: ${getSubscriptionDaysRemaining()} dias restantes`
              : isTrial
              ? `Trial: ${getTrialDaysRemaining()} dias restantes`
              : botsPurchased > 0
              ? `${botsPurchased} bot(s) vitalício(s)`
              : 'Plano gratuito - clique para ver opções'}
          </TooltipContent>
        </Tooltip>
        <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {hasSub ? (
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-primary/30 cursor-pointer hover:bg-primary/30 transition-colors"
            onClick={() => setShowPlansModal(true)}
          >
            <Crown className="h-3 w-3 mr-1" />
            PRO • {getSubscriptionDaysRemaining()} dias
          </Badge>
        ) : isTrial ? (
          <Badge
            variant="secondary"
            className="bg-secondary/20 text-secondary-foreground border-secondary/30 cursor-pointer hover:bg-secondary/30 transition-colors"
            onClick={() => setShowPlansModal(true)}
          >
            <Gift className="h-3 w-3 mr-1" />
            Trial • {getTrialDaysRemaining()} dias
          </Badge>
        ) : botsPurchased > 0 ? (
          <Badge
            variant="secondary"
            className="bg-success/20 text-success border-success/30 cursor-pointer hover:bg-success/30 transition-colors"
            onClick={() => setShowPlansModal(true)}
          >
            <Zap className="h-3 w-3 mr-1" />
            {botsPurchased} bot(s)
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-muted transition-colors"
            onClick={() => setShowPlansModal(true)}
          >
            <Clock className="h-3 w-3 mr-1" />
            Gratuito
          </Badge>
        )}
      </div>
      <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
    </>
  );
}
