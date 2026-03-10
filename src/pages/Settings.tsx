import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Globe, Upload, Settings as SettingsIcon, Crown, Zap, Gift, Clock } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { usePlanStore } from '@/store/planStore';
import MainLayout from '@/layouts/MainLayout';
import PlansModal from '@/components/PlansModal';

export default function Settings() {
  const { user, profile } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const {
    hasActiveSubscription,
    isTrialActive,
    getTrialDaysRemaining,
    getSubscriptionDaysRemaining,
    getTotalBotsPurchased,
    userPlan,
  } = usePlanStore();

  const handleSave = async () => {
    const nameInput = (document.getElementById('name') as HTMLInputElement)?.value;
    if (nameInput && nameInput !== profile?.full_name) {
      await useAuthStore.getState().updateProfile({ full_name: nameInput } as any);
    }
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <PageHeader
          title="Configurações"
          description="Gerencie suas preferências e conta"
          icon={SettingsIcon}
          breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Configurações' }]}
        />

        {/* Plan Status Card */}
        <Card className="card-elegant border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Seu Plano
            </CardTitle>
            <CardDescription>Gerencie sua assinatura e visualize seu plano atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                {hasActiveSubscription() ? (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </Badge>
                ) : isTrialActive() ? (
                  <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">
                    <Gift className="h-3 w-3 mr-1" />
                    Trial
                  </Badge>
                ) : getTotalBotsPurchased() > 0 ? (
                  <Badge className="bg-success/20 text-success border-success/30">
                    <Zap className="h-3 w-3 mr-1" />
                    Vitalício
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    Gratuito
                  </Badge>
                )}
                <div>
                  <p className="font-medium text-sm">
                    {hasActiveSubscription()
                      ? `Assinatura ativa • ${getSubscriptionDaysRemaining()} dias restantes`
                      : isTrialActive()
                      ? `Período de teste • ${getTrialDaysRemaining()} dias restantes`
                      : getTotalBotsPurchased() > 0
                      ? `${getTotalBotsPurchased()} bot(s) comprado(s)`
                      : 'Sem plano ativo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasActiveSubscription()
                      ? 'Todos os 17 bots liberados'
                      : isTrialActive()
                      ? 'Acesso completo durante o trial'
                      : 'Faça upgrade para desbloquear tudo'}
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowPlansModal(true)} variant={hasActiveSubscription() ? 'outline' : 'default'} className="hover-glow">
                {hasActiveSubscription() ? 'Gerenciar' : 'Fazer Upgrade'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil
            </CardTitle>
            <CardDescription>Informações pessoais e foto de perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="hover-glow">
                  <Upload className="mr-2 h-4 w-4" />
                  Alterar Foto
                </Button>
                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={profile?.full_name || ''} className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={profile?.email || user?.email} className="bg-muted border-border" />
              </div>
            </div>

            <Button onClick={handleSave} className="hover-glow">Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como você recebe alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações Push</Label>
                <p className="text-sm text-muted-foreground">Receba notificações no navegador</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Alertas por Email</Label>
                <p className="text-sm text-muted-foreground">Receba resumos diários por email</p>
              </div>
              <Switch
                id="email-alerts"
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferências
            </CardTitle>
            <CardDescription>Personalize sua experiência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="pt-BR">
                <SelectTrigger id="language" className="bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select defaultValue="America/Sao_Paulo">
                <SelectTrigger id="timezone" className="bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>Ações irreversíveis para sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Deletar Conta</p>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e todos os dados
                </p>
              </div>
              <Button variant="destructive">Deletar</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <PlansModal open={showPlansModal} onOpenChange={setShowPlansModal} />
    </MainLayout>
  );
}
