import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import CreateSessionsTab from '@/components/CreateSessionsTab';
import { mockBots } from '@/mocks/mockData';

export default function CreateSessionsPage() {
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
          title={`Criar Sessões - ${bot.name}`}
          description="Geração de sessões Telegram para automações avançadas"
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
        <CreateSessionsTab />
      </div>
    </MainLayout>
  );
}
