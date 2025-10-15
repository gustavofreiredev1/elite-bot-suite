import { motion } from 'framer-motion';
import { BookOpen, MessageCircle, Mail, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';

const faqs = [
  {
    question: 'Como criar um bot no Telegram?',
    answer: 'Para criar um bot, acesse o @BotFather no Telegram e use o comando /newbot. Siga as instruções para obter seu token.',
  },
  {
    question: 'O que é um token de bot?',
    answer: 'O token é uma chave de autenticação única que permite que seu código se comunique com a API do Telegram.',
  },
  {
    question: 'Como configurar automações?',
    answer: 'Vá para a seção de Automações e use o builder visual para criar fluxos. Conecte gatilhos (eventos) com ações (respostas).',
  },
  {
    question: 'Posso ter múltiplos bots?',
    answer: 'Sim! Você pode criar e gerenciar quantos bots precisar, todos em um só lugar.',
  },
  {
    question: 'Como ver as estatísticas?',
    answer: 'Acesse a seção de Estatísticas para ver métricas detalhadas como mensagens enviadas, usuários ativos e mais.',
  },
];

export default function Support() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Chamado aberto com sucesso! Responderemos em breve.');
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Suporte</h1>
          <p className="text-muted-foreground">Encontre respostas e entre em contato</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-elegant hover-scale">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Documentação</CardTitle>
              <CardDescription>Guias e tutoriais completos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover-glow">
                Acessar Docs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elegant hover-scale">
            <CardHeader>
              <MessageCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Comunidade</CardTitle>
              <CardDescription>Conecte-se com outros usuários</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover-glow">
                Entrar no Discord
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="card-elegant hover-scale">
            <CardHeader>
              <Mail className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Email</CardTitle>
              <CardDescription>Contato direto com suporte</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover-glow">
                suporte@botelite.com
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>Respostas rápidas para dúvidas comuns</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Abrir Chamado</CardTitle>
            <CardDescription>Descreva seu problema e entraremos em contato</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="support-name">Nome</Label>
                  <Input id="support-name" placeholder="Seu nome" required className="bg-muted border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="bg-muted border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-subject">Assunto</Label>
                <Input
                  id="support-subject"
                  placeholder="Descreva brevemente o problema"
                  required
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-message">Mensagem</Label>
                <Textarea
                  id="support-message"
                  placeholder="Descreva seu problema em detalhes..."
                  rows={6}
                  required
                  className="bg-muted border-border"
                />
              </div>
              <Button type="submit" className="w-full hover-glow">
                Enviar Chamado
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
}
