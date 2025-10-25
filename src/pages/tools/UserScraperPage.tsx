import { useParams, useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import UserScraperTab from '@/components/UserScraperTab';
import { mockBots } from '@/mocks/mockData';

export default function UserScraperPage() {
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
        title={`${bot.name} - Scraper de Usuários`}
        description="Extraia e gerencie listas de membros de grupos"
        icon={Users}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <UserScraperTab />
    </MainLayout>
  );
}
