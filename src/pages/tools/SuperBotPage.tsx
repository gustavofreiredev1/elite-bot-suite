import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import SuperBotTab from '@/components/SuperBotTab';
import { mockBots } from '@/mocks/mockData';

export default function SuperBotPage() {
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
          title={`Super Bot - ${bot.name}`}
          description="Automação multifuncional avançada"
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
        <SuperBotTab />
      </div>
    </MainLayout>
  );
}
