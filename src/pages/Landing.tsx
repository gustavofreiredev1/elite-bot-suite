import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bot, Zap, Shield, Users, MessageSquare, TrendingUp,
  ArrowRight, Check, Star, Play, ChevronRight, Crown,
  Sparkles, Send, ShoppingCart, CreditCard, QrCode,
  Workflow, Bell, Download, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { usePlanStore } from '@/store/planStore';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function Landing() {
  const navigate = useNavigate();
  const { subscriptionPlans } = usePlanStore();

  const features = [
    { icon: ShoppingCart, title: 'Vendas Automáticas', description: 'Funil completo com checkout, PIX e entrega automática.' },
    { icon: Workflow, title: 'Funis Inteligentes', description: 'Editor visual drag-and-drop estilo ManyChat.' },
    { icon: QrCode, title: 'Pagamentos PIX', description: 'Cobranças automáticas com QR Code direto no chat.' },
    { icon: Shield, title: 'Segurança Total', description: 'Criptografia, anti-fraude e isolamento por usuário.' },
  ];

  const botCategories = [
    {
      title: 'Vendas & Monetização',
      bots: ['Vendas Automáticas', 'Checkout Pro', 'Pagamentos PIX', 'Upsell & Ofertas', 'Recuperação de Vendas'],
      icon: ShoppingCart,
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'Automação & Crescimento',
      bots: ['Funis Inteligentes', 'Disparo em Massa', 'Captura de Leads', 'Agendador', 'Atendimento Auto'],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Gestão & CRM',
      bots: ['Área VIP', 'CRM Telegram', 'Afiliados', 'Notificações'],
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Entrega & Relatórios',
      bots: ['Entrega Digital', 'Relatórios Pro', 'Extrator de Contatos'],
      icon: Package,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const testimonials = [
    { name: 'Lucas M.', role: 'Infoprodutor', content: 'Vendi R$15.000 no primeiro mês usando Vendas Automáticas + PIX.', rating: 5 },
    { name: 'Ana P.', role: 'Mentora', content: 'O Checkout Pro é melhor que Kiwify. Meus alunos compram direto no chat!', rating: 5 },
    { name: 'Carlos R.', role: 'Gestor de Comunidade', content: 'Área VIP + Funis Inteligentes automatizou 100% da minha operação.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>Entrar</Button>
              <Button onClick={() => navigate('/login')} className="hover-glow">
                Começar Agora<ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />17 Ferramentas • 7 dias grátis • Sem cartão
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Venda, automatize e monetize{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">no Telegram</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A plataforma completa para vender produtos digitais, criar funis de vendas,
              cobrar via PIX e automatizar entregas — tudo dentro do Telegram.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => navigate('/login')} className="hover-glow text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />Começar Grátis
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-lg px-8 py-6">
                Ver Planos<ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Setup em 5 minutos</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Suporte 24/7</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Cancele quando quiser</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={item}>
                <Card className="card-glow h-full hover-lift">
                  <CardHeader>
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2"><f.icon className="h-6 w-6 text-primary" /></div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent><CardDescription className="text-base">{f.description}</CardDescription></CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bot Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">17 ferramentas profissionais</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Tudo que você precisa para vender e automatizar no Telegram</p>
          </div>
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {botCategories.map((cat, i) => (
              <motion.div key={i} variants={item}>
                <Card className="card-elegant h-full">
                  <CardHeader>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} w-fit mb-2`}><cat.icon className="h-6 w-6 text-white" /></div>
                    <CardTitle>{cat.title}</CardTitle>
                    <CardDescription>{cat.bots.length} ferramentas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cat.bots.map((b, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm"><Check className="h-3 w-3 text-emerald-500" />{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30"><Crown className="h-3 w-3 mr-1" />Preços Simples</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Escolha seu plano</h2>
            <p className="text-muted-foreground text-lg">Todos os planos incluem acesso a todas as 17 ferramentas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Card className={`relative h-full flex flex-col ${plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary shadow-lg"><Star className="h-3 w-3 mr-1" />Mais Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.duration} dias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-1">
                      {plan.originalPrice && <p className="text-sm text-muted-foreground line-through">R$ {plan.originalPrice.toFixed(2)}</p>}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                        {plan.discount && <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-500">-{plan.discount}%</Badge>}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-500" />{f}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button onClick={() => navigate('/login')} className="w-full" variant={plan.popular ? 'default' : 'outline'} size="lg">Começar Agora</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="card-elegant h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                    </div>
                    <p className="text-muted-foreground mb-4">"{t.content}"</p>
                    <div><p className="font-semibold">{t.name}</p><p className="text-sm text-muted-foreground">{t.role}</p></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto para vender no Telegram?</h2>
            <p className="text-lg text-muted-foreground mb-8">Comece agora com 7 dias grátis. Sem precisar de cartão.</p>
            <Button size="lg" onClick={() => navigate('/login')} className="hover-glow text-lg px-8 py-6">
              <Send className="mr-2 h-5 w-5" />Criar Conta Grátis
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/terms" className="hover:text-foreground transition-colors">Termos de Uso</a>
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="/support" className="hover:text-foreground transition-colors">Suporte</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 Elite Bot Suite. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
