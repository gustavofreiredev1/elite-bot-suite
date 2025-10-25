import { useParams } from 'react-router-dom';
import { Link } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import MediaExtractorTab from '@/components/MediaExtractorTab';
import { mockBots } from '@/mocks/mockData';

export default function MediaExtractorPage() {
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
        title={`${bot.name} - Extrator de Mídias`}
        description="Extraia links, imagens e vídeos"
        icon={Link}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Meus Bots', href: '/my-bots' },
          { label: bot.name },
        ]}
      />
      <MediaExtractorTab />
    </MainLayout>
  );
}
