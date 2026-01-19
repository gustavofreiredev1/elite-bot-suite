import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Privacy() {
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
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
                    <p className="text-muted-foreground">Última atualização: Janeiro 2025</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-6 text-muted-foreground">
                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">1. Coleta de Dados</h2>
                    <p>Coletamos as seguintes informações quando você usa nossa plataforma:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Dados de Conta:</strong> Nome, email, senha (criptografada)</li>
                      <li><strong>Dados de Uso:</strong> Logs de atividade, preferências, configurações</li>
                      <li><strong>Dados de Pagamento:</strong> Processados por gateways seguros (não armazenamos cartões)</li>
                      <li><strong>Dados do Telegram:</strong> API ID, API Hash, sessões (armazenados localmente)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">2. Uso dos Dados</h2>
                    <p>Utilizamos seus dados para:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Fornecer e melhorar nossos serviços</li>
                      <li>Processar pagamentos e gerenciar assinaturas</li>
                      <li>Enviar comunicações sobre sua conta</li>
                      <li>Garantir a segurança da plataforma</li>
                      <li>Cumprir obrigações legais</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">3. Armazenamento e Segurança</h2>
                    <p>
                      Seus dados são armazenados em servidores seguros com criptografia.
                      Credenciais do Telegram são armazenadas localmente no seu navegador
                      e nunca são enviadas para nossos servidores.
                      Implementamos medidas técnicas e organizacionais para proteger seus dados.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">4. Compartilhamento de Dados</h2>
                    <p>Não vendemos seus dados pessoais. Podemos compartilhar dados com:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Processadores de Pagamento:</strong> Para processar transações</li>
                      <li><strong>Provedores de Infraestrutura:</strong> Para hospedar nossos serviços</li>
                      <li><strong>Autoridades:</strong> Quando exigido por lei</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
                    <p>De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                      <li><strong>Correção:</strong> Atualizar dados incorretos ou incompletos</li>
                      <li><strong>Exclusão:</strong> Solicitar a remoção dos seus dados</li>
                      <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                      <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies e Rastreamento</h2>
                    <p>
                      Utilizamos cookies essenciais para o funcionamento da plataforma.
                      Cookies de análise são usados para melhorar a experiência do usuário.
                      Você pode desabilitar cookies nas configurações do seu navegador.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">7. Retenção de Dados</h2>
                    <p>
                      Mantemos seus dados enquanto sua conta estiver ativa.
                      Após encerramento, dados são mantidos por até 90 dias para backup.
                      Dados de pagamento são mantidos conforme exigências fiscais (5 anos).
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">8. Menores de Idade</h2>
                    <p>
                      Nossos serviços são destinados a maiores de 18 anos.
                      Não coletamos intencionalmente dados de menores de idade.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">9. Alterações</h2>
                    <p>
                      Esta política pode ser atualizada periodicamente.
                      Alterações significativas serão comunicadas por email.
                      Recomendamos revisar esta página regularmente.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-semibold text-foreground mb-3">10. Contato do DPO</h2>
                    <p>
                      Para questões relacionadas à privacidade, contate nosso Encarregado de 
                      Proteção de Dados:
                      <a href="mailto:privacidade@botelite.com" className="text-primary ml-1">
                        privacidade@botelite.com
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
