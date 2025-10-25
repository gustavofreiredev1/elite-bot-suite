import { useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import AccountGeneratorTab from '@/components/AccountGeneratorTab';
import { mockBots } from '@/mocks/mockData';

export default function AccountGeneratorPage() {
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
        title={`${bot.name} - Gerador de Contas`}
        description="Crie contas Telegram automaticamente"
        icon={UserPlus}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <AccountGeneratorTab />
    </MainLayout>
  );
}
