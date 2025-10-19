import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import AutoPayTab from '@/components/AutoPayTab';
import { mockBots } from '@/mocks/mockData';

export default function AutoPayPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bot = mockBots.find(b => b.id === id);

  if (!bot) {
    return (
      <MainLayout>
        <div>Bot não encontrado</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title={`AutoPay BOT - ${bot.name}`}
          description="Automação de vendas e pagamentos Pix via MercadoPago"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Meus Bots', href: '/my-bots' },
            { label: bot.name }
          ]}
          actions={
            <Button variant="outline" onClick={() => navigate('/my-bots')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          }
        />
        <AutoPayTab />
      </div>
    </MainLayout>
  );
}
