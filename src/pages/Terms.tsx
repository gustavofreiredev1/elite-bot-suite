import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="card-elegant">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Termos de Uso</CardTitle>
                    <p className="text-muted-foreground">Última atualização: Janeiro 2025</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos Termos</h2>
                    <p>
                      Ao acessar e usar a Elite Bot Suite, você concorda em cumprir e estar vinculado 
                      a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, 
                      não deve usar nossos serviços.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Descrição do Serviço</h2>
                    <p>
                      A Elite Bot Suite é uma plataforma SaaS que oferece ferramentas de automação 
                      para o Telegram. Nossos serviços incluem, mas não se limitam a:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Bots de automação de mensagens</li>
                      <li>Ferramentas de crescimento de grupos</li>
                      <li>Sistemas de segurança para comunidades</li>
                      <li>Gerenciamento de conteúdo e backups</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. Uso Aceitável</h2>
                    <p>Você concorda em usar nossos serviços apenas para fins legais. É proibido:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Violar os Termos de Serviço do Telegram</li>
                      <li>Enviar spam ou conteúdo não solicitado</li>
                      <li>Realizar atividades fraudulentas ou ilegais</li>
                      <li>Compartilhar suas credenciais com terceiros</li>
                      <li>Tentar acessar sistemas sem autorização</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Contas e Segurança</h2>
                    <p>
                      Você é responsável por manter a confidencialidade de suas credenciais de acesso.
                      Qualquer atividade realizada em sua conta é de sua responsabilidade.
                      Notifique-nos imediatamente sobre qualquer uso não autorizado.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Pagamentos e Reembolsos</h2>
                    <p>
                      As assinaturas são cobradas antecipadamente pelo período selecionado.
                      Compras de bots individuais são finais e não reembolsáveis.
                      Reembolsos para assinaturas podem ser solicitados em até 7 dias após a compra,
                      desde que o uso seja mínimo.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Período de Teste</h2>
                    <p>
                      Oferecemos um período de teste gratuito de 7 dias para novos usuários.
                      Durante este período, você tem acesso a todas as funcionalidades.
                      Após o trial, você pode usar cada bot gratuitamente a cada 24 horas ou
                      adquirir um plano pago.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
                    <p>
                      Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais
                      ou consequentes resultantes do uso de nossos serviços. Usamos o Telegram
                      como plataforma, mas não somos afiliados a ele.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">8. Modificações</h2>
                    <p>
                      Reservamo-nos o direito de modificar estes termos a qualquer momento.
                      Alterações significativas serão notificadas por email ou através da plataforma.
                      O uso continuado após alterações constitui aceitação dos novos termos.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">9. Contato</h2>
                    <p>
                      Para dúvidas sobre estes termos, entre em contato através do email:
                      <a href="mailto:suporte@botelite.com" className="text-primary ml-1">
                        suporte@botelite.com
                      </a>
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
