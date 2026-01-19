import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, Zap, Shield, Users, MessageSquare, TrendingUp, 
  ArrowRight, Check, Star, Play, ChevronRight, Crown,
  Clock, Sparkles, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { usePlanStore } from '@/store/planStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Landing() {
  const navigate = useNavigate();
  const { subscriptionPlans } = usePlanStore();

  const features = [
    {
      icon: Bot,
      title: '17 Bots Poderosos',
      description: 'Ferramentas completas para automação, growth e segurança no Telegram.',
    },
    {
      icon: Zap,
      title: 'Automação Total',
      description: 'Configure uma vez e deixe os bots trabalharem 24/7 por você.',
    },
    {
      icon: Shield,
      title: 'Anti-Ban Integrado',
      description: 'Delays inteligentes e proteções para manter suas contas seguras.',
    },
    {
      icon: TrendingUp,
      title: 'Cresça Rápido',
      description: 'Adicione membros, envie em massa e extraia dados com facilidade.',
    },
  ];

  const botCategories = [
    {
      title: 'Automação',
      bots: ['Super Bot Elite', 'Auto Pay Bot', 'Auto React Bot', 'Account Generator'],
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Crescimento',
      bots: ['Mass Sender Pro', 'Add Members Pro', 'User Scraper', 'Mass React Pro', 'Views Tracker'],
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Segurança',
      bots: ['Security Guard', 'Session Manager', 'Message Backup', 'Inactive Cleaner'],
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Conteúdo',
      bots: ['Auto Poster', 'T-Clone Master', 'Poll Master', 'Media Extractor'],
      icon: MessageSquare,
      color: 'from-orange-500 to-amber-500',
    },
  ];

  const testimonials = [
    {
      name: 'Lucas M.',
      role: 'Dono de Canal',
      content: 'Cresci meu canal de 500 para 15.000 membros em 2 meses usando o Add Members e Mass Sender.',
      rating: 5,
    },
    {
      name: 'Ana P.',
      role: 'Infoprodutora',
      content: 'O Auto Pay automatizou 100% das minhas vendas no Telegram. Economizo horas por dia.',
      rating: 5,
    },
    {
      name: 'Carlos R.',
      role: 'Community Manager',
      content: 'O Security Guard acabou com o spam nos meus grupos. Vida muito mais fácil!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/login')} className="hover-glow">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 px-4 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              17 Bots • 7 dias grátis • Sem cartão
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Automatize seu{' '}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Telegram
              </span>
              <br />
              como um profissional
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A suíte completa de bots para crescer grupos, automatizar vendas, 
              enviar em massa e proteger suas comunidades.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')} 
                className="hover-glow text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Começar Grátis
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-6"
              >
                Ver Planos
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Setup em 5 minutos
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Suporte 24/7
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                Cancele quando quiser
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item}>
                <Card className="card-glow h-full hover-lift">
                  <CardHeader>
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-2">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              17 bots especializados divididos em 4 categorias para cobrir todas as suas necessidades
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {botCategories.map((category, index) => (
              <motion.div key={index} variants={item}>
                <Card className="card-elegant h-full">
                  <CardHeader>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} w-fit mb-2`}>
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.bots.length} bots</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.bots.map((bot, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-3 w-3 text-success" />
                          {bot}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Crown className="h-3 w-3 mr-1" />
              Preços Simples
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground text-lg">
              Todos os planos incluem acesso a todos os 17 bots
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative h-full flex flex-col ${
                  plan.popular ? 'ring-2 ring-primary shadow-glow scale-105' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary shadow-lg">
                        <Star className="h-3 w-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.duration} dias</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="space-y-1">
                      {plan.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          R$ {plan.originalPrice.toFixed(2)}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
                        {plan.discount && (
                          <Badge variant="secondary" className="bg-success/20 text-success">
                            -{plan.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      onClick={() => navigate('/login')} 
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      Começar Agora
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              Também vendemos bots individuais a partir de R$ 34,90 (acesso vitalício)
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que nossos usuários dizem</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-elegant h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para automatizar seu Telegram?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comece agora com 7 dias grátis. Sem precisar de cartão.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="hover-glow text-lg px-8 py-6"
            >
              <Send className="mr-2 h-5 w-5" />
              Criar Conta Grátis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="md" />
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/terms" className="hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="/support" className="hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Elite Bot Suite. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
