import { useParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import SecurityBotTab from '@/components/SecurityBotTab';
import { mockBots } from '@/mocks/mockData';

export default function SecurityBotPage() {
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
        title={`${bot.name} - Anti-Link / Anti-Spam`}
        description="Proteja seus grupos contra spam"
        icon={Shield}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <SecurityBotTab />
    </MainLayout>
  );
}
