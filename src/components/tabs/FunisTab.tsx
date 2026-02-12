import { Workflow } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FunisTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Funis Inteligentes</h3>
        <p className="text-muted-foreground mt-1">Crie fluxos visuais drag-and-drop estilo ManyChat</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Workflow className="h-16 w-16 text-primary" />
          <div className="text-center space-y-2">
            <h4 className="text-xl font-semibold">Editor Visual de Fluxos</h4>
            <p className="text-muted-foreground max-w-md">
              Monte sequências com blocos de texto, imagem, vídeo, botões, condições, delays, webhooks e pagamentos — tudo visual.
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/automations')}>
            <Workflow className="mr-2 h-4 w-4" />
            Abrir Editor de Fluxos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
