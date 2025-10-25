import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import AutoReactTab from '@/components/AutoReactTab';
import { mockBots } from '@/mocks/mockData';

export default function AutoReactPage() {
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
        title={`${bot.name} - Reações Automáticas`}
        description="Reaja automaticamente a mensagens"
        icon={Heart}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <AutoReactTab />
    </MainLayout>
  );
}
