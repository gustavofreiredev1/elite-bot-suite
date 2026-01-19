import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Sparkles, Clock, Shield, Star, ArrowRight } from 'lucide-react';
import { usePlanStore, getPlanById } from '@/store/planStore';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface PlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botId?: string;
}

export default function PlansModal({ open, onOpenChange, botId }: PlansModalProps) {
  const { 
    plans, 
    subscriptionPlans, 
    purchaseBot, 
    purchaseSubscription,
    userPlan,
    hasActiveSubscription,
    isTrialActive,
    getTrialDaysRemaining,
    getSubscriptionDaysRemaining
  } = usePlanStore();

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
      description: `Você tem acesso a todos os 17 bots por ${type} dias.`,
    });
    onOpenChange(false);
  };

  const selectedPlan = botId ? getPlanById(botId) : null;
  const isPurchased = botId ? userPlan.activePlans.includes(botId) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Escolha seu Plano
                </DialogTitle>
                <DialogDescription className="text-base">
                  Libere todo o potencial da Elite Bot Suite
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Status Banner */}
          <div className="mt-4 flex flex-wrap gap-2">
            {isTrialActive() && (
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                <Clock className="h-3 w-3 mr-1" />
                Trial: {getTrialDaysRemaining()} dias restantes
              </Badge>
            )}
            {hasActiveSubscription() && (
              <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
                <Shield className="h-3 w-3 mr-1" />
                Assinatura: {getSubscriptionDaysRemaining()} dias restantes
              </Badge>
            )}
            {userPlan.activePlans.length > 0 && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
                <Zap className="h-3 w-3 mr-1" />
                {userPlan.activePlans.length} bot(s) vitalício(s)
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue={botId ? "individual" : "subscription"} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="subscription" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Crown className="mr-2 h-4 w-4" />
                Todos os Bots
              </TabsTrigger>
              <TabsTrigger value="individual" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Zap className="mr-2 h-4 w-4" />
                Bot Individual
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh]">
            <TabsContent value="subscription" className="p-6 pt-4 mt-0">
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Melhor Custo-Benefício</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Com a assinatura você acessa todos os <strong>17 bots</strong> por um único valor mensal.
                  Economize até 80% comparado a comprar individualmente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`relative transition-all hover:shadow-xl h-full flex flex-col ${
                        plan.popular ? 'ring-2 ring-primary shadow-glow scale-[1.02]' : 'hover:ring-1 hover:ring-border'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary shadow-lg px-3">
                            <Star className="h-3 w-3 mr-1" />
                            Mais Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pt-6">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.duration} dias de acesso total</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-1">
                        <div className="space-y-1">
                          {plan.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              R$ {plan.originalPrice.toFixed(2)}
                            </div>
                          )}
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-primary">
                              R$ {plan.price.toFixed(2)}
                            </span>
                            {plan.discount && (
                              <Badge variant="secondary" className="bg-success/20 text-success">
                                -{plan.discount}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ≈ R$ {(plan.price / plan.duration).toFixed(2)}/dia
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="pt-4">
                        <Button
                          onClick={() => handlePurchaseSubscription(plan.duration.toString() as '30' | '60' | '90')}
                          className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                          size="lg"
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          Assinar Agora
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="individual" className="p-6 pt-4 mt-0">
              {selectedPlan && (
                <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bot selecionado:</p>
                      <p className="font-semibold text-lg">{selectedPlan.name}</p>
                    </div>
                    {isPurchased ? (
                      <Badge className="bg-success">Já adquirido</Badge>
                    ) : (
                      <Button onClick={() => handlePurchaseBot(selectedPlan.id)}>
                        Comprar por R$ {selectedPlan.price.toFixed(2)}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isOwned = userPlan.activePlans.includes(plan.id);
                  const isSelected = botId === plan.id;
                  
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`relative transition-all h-full ${
                          isSelected ? 'ring-2 ring-primary' : isOwned ? 'ring-1 ring-success/50 bg-success/5' : 'hover:ring-1 hover:ring-border'
                        }`}
                      >
                        {plan.popular && !isOwned && (
                          <Badge className="absolute -top-2 right-4 bg-primary text-xs">
                            Popular
                          </Badge>
                        )}
                        {isOwned && (
                          <Badge className="absolute -top-2 right-4 bg-success text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Adquirido
                          </Badge>
                        )}
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <Badge variant="outline" className="w-fit text-xs capitalize">
                            {plan.category === 'automation' && 'Automação'}
                            {plan.category === 'growth' && 'Crescimento'}
                            {plan.category === 'security' && 'Segurança'}
                            {plan.category === 'content' && 'Conteúdo'}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-2">
                          <div className="text-2xl font-bold text-primary">
                            R$ {plan.price.toFixed(2)}
                            <span className="text-xs text-muted-foreground font-normal ml-1">
                              vitalício
                            </span>
                          </div>
                          <ul className="space-y-1">
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Check className="h-3 w-3 text-success shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="pt-2">
                          <Button
                            onClick={() => handlePurchaseBot(plan.id)}
                            className="w-full"
                            size="sm"
                            variant={isOwned ? 'secondary' : 'outline'}
                            disabled={isOwned}
                          >
                            {isOwned ? 'Já possui' : 'Comprar'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="p-4 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Pagamento seguro
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Acesso imediato
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Suporte incluído
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
