import { useParams } from 'react-router-dom';
import { Zap } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import MassReactTab from '@/components/MassReactTab';
import { mockBots } from '@/mocks/mockData';

export default function MassReactPage() {
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
        title={`${bot.name} - Reações em Massa`}
        description="Reaja em centenas de mensagens"
        icon={Zap}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <MassReactTab />
    </MainLayout>
  );
}
