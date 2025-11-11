import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MessageCircle,
  Clock,
  Filter,
  Send,
  Workflow,
  Plus,
} from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: (type: string) => void;
}

export default function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const nodeTypes = [
    {
      type: 'trigger',
      label: 'Gatilho',
      icon: Workflow,
      description: 'Inicia o fluxo',
      color: 'text-green-500',
    },
    {
      type: 'message',
      label: 'Mensagem',
      icon: MessageCircle,
      description: 'Envia mensagem',
      color: 'text-primary',
    },
    {
      type: 'delay',
      label: 'Aguardar',
      icon: Clock,
      description: 'Delay temporal',
      color: 'text-amber-500',
    },
    {
      type: 'condition',
      label: 'Condição',
      icon: Filter,
      description: 'Decisão if/else',
      color: 'text-purple-500',
    },
    {
      type: 'action',
      label: 'Ação',
      icon: Send,
      description: 'Executar ação',
      color: 'text-blue-500',
    },
  ];

  return (
    <Card className="w-72 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Adicionar Nós
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {nodeTypes.map((node) => {
          const Icon = node.icon;
          return (
            <Button
              key={node.type}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => onAddNode(node.type)}
            >
              <Icon className={`h-5 w-5 shrink-0 ${node.color}`} />
              <div className="text-left flex-1">
                <div className="font-semibold text-sm">{node.label}</div>
                <div className="text-xs text-muted-foreground">{node.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

interface NodeConfigPanelProps {
  selectedNode: any;
  onUpdateNode: (id: string, data: any) => void;
  onClose: () => void;
}

export function NodeConfigPanel({ selectedNode, onUpdateNode, onClose }: NodeConfigPanelProps) {
  if (!selectedNode) return null;

  const handleUpdate = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      config: {
        ...selectedNode.data.config,
        [field]: value,
      },
    });
  };

  return (
    <Card className="w-80 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Configurar Nó</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome do Nó</Label>
          <Input
            value={selectedNode.data.label || ''}
            onChange={(e) =>
              onUpdateNode(selectedNode.id, {
                ...selectedNode.data,
                label: e.target.value,
              })
            }
            placeholder="Digite o nome"
          />
        </div>

        {selectedNode.data.type === 'message' && (
          <>
            <div className="space-y-2">
              <Label>Mensagem</Label>
              <Textarea
                value={selectedNode.data.config?.message || ''}
                onChange={(e) => handleUpdate('message', e.target.value)}
                placeholder="Digite a mensagem a ser enviada"
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Mídia</Label>
              <Select
                value={selectedNode.data.config?.mediaType || 'text'}
                onValueChange={(value) => handleUpdate('mediaType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedNode.data.type === 'delay' && (
          <>
            <div className="space-y-2">
              <Label>Tempo de espera</Label>
              <Input
                type="number"
                value={selectedNode.data.config?.duration || 5}
                onChange={(e) => handleUpdate('duration', parseInt(e.target.value))}
                placeholder="Segundos"
              />
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select
                value={selectedNode.data.config?.unit || 'seconds'}
                onValueChange={(value) => handleUpdate('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Segundos</SelectItem>
                  <SelectItem value="minutes">Minutos</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedNode.data.type === 'condition' && (
          <>
            <div className="space-y-2">
              <Label>Condição</Label>
              <Select
                value={selectedNode.data.config?.condition || 'contains'}
                onValueChange={(value) => handleUpdate('condition', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="starts_with">Começa com</SelectItem>
                  <SelectItem value="ends_with">Termina com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input
                value={selectedNode.data.config?.value || ''}
                onChange={(e) => handleUpdate('value', e.target.value)}
                placeholder="Digite o valor"
              />
            </div>
          </>
        )}

        {selectedNode.data.type === 'trigger' && (
          <div className="space-y-2">
            <Label>Tipo de Gatilho</Label>
            <Select
              value={selectedNode.data.config?.triggerType || 'keyword'}
              onValueChange={(value) => handleUpdate('triggerType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keyword">Palavra-chave</SelectItem>
                <SelectItem value="command">Comando</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="schedule">Agendamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            value={selectedNode.data.description || ''}
            onChange={(e) =>
              onUpdateNode(selectedNode.id, {
                ...selectedNode.data,
                description: e.target.value,
              })
            }
            placeholder="Descrição opcional"
            rows={3}
          />
        </div>

        <Button onClick={onClose} variant="outline" className="w-full">
          Fechar
        </Button>
      </CardContent>
    </Card>
  );
}
