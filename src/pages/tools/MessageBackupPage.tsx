import { useParams } from 'react-router-dom';
import { Database } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import MessageBackupTab from '@/components/MessageBackupTab';
import { mockBots } from '@/mocks/mockData';

export default function MessageBackupPage() {
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
        title={`${bot.name} - Backup de Mensagens`}
        description="Extraia e salve mensagens de canais"
        icon={Database}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <MessageBackupTab />
    </MainLayout>
  );
}
