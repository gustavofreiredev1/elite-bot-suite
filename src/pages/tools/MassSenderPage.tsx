import { useParams, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import MassSenderTab from '@/components/MassSenderTab';
import { mockBots } from '@/mocks/mockData';

export default function MassSenderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        title={`${bot.name} - Envio em Massa`}
        description="Configure e gerencie campanhas de envio em massa"
        icon={Send}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <MassSenderTab />
    </MainLayout>
  );
}
