import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { usePlanStore } from '@/store/planStore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botId?: string;
}

export default function PlansModal({ open, onOpenChange, botId }: PlansModalProps) {
  const { plans, subscriptionPlans, purchaseBot, purchaseSubscription } = usePlanStore();

  const handlePurchaseBot = (planId: string) => {
    purchaseBot(planId);
    toast.success('Bot adquirido com sucesso!', {
      description: 'Você agora tem acesso vitalício a este bot.',
    });
    onOpenChange(false);
  };

  const handlePurchaseSubscription = (type: '30' | '60' | '90') => {
    purchaseSubscription(type);
    toast.success('Assinatura ativada!', {
      description: `Você tem acesso a todos os bots por ${type} dias.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Escolha seu Plano
          </DialogTitle>
          <DialogDescription>
            Compre bots individualmente ou assine para ter acesso a todos
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={botId ? "individual" : "subscription"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">
              <Zap className="mr-2 h-4 w-4" />
              Bots Individuais
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <Crown className="mr-2 h-4 w-4" />
              Assinaturas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-xl ${
                    botId === plan.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {botId === plan.id && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Recomendado
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>Acesso vitalício</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        pagamento único
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handlePurchaseBot(plan.id)}
                      className="w-full"
                      size="lg"
                    >
                      Comprar Agora
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-xl ${
                    plan.popular ? 'ring-2 ring-primary scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                      Mais Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.duration} dias de acesso total</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-4xl font-bold text-primary">
                      R$ {plan.price.toFixed(2)}
                      <span className="text-sm text-muted-foreground font-normal ml-2">
                        /{plan.duration} dias
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() =>
                        handlePurchaseSubscription(plan.duration.toString() as '30' | '60' | '90')
                      }
                      className="w-full"
                      size="lg"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      Assinar Agora
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Período de teste:</strong> 7 dias grátis para experimentar todos os bots.
            Após o trial, use cada bot gratuitamente a cada 24h ou adquira um plano.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
