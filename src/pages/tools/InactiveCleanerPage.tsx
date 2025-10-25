import { useParams } from 'react-router-dom';
import { UserMinus } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import InactiveCleanerTab from '@/components/InactiveCleanerTab';
import { mockBots } from '@/mocks/mockData';

export default function InactiveCleanerPage() {
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
        title={`${bot.name} - Limpador de Inativos`}
        description="Detecte e remova membros inativos"
        icon={UserMinus}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <InactiveCleanerTab />
    </MainLayout>
  );
}
