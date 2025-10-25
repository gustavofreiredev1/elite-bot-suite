import { useParams } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import PollBotTab from '@/components/PollBotTab';
import { mockBots } from '@/mocks/mockData';

export default function PollBotPage() {
  const { id } = useParams();
  const bot = mockBots.find((b) => b.id === id);

  if (!bot) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bot não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={`${bot.name} - Enquetes e Feedback`}
        description="Crie e gerencie enquetes automáticas"
        icon={BarChart2}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <PollBotTab />
    </MainLayout>
  );
}
