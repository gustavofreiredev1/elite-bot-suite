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
  Image,
  Volume2,
  Video,
  MousePointer,
  DollarSign,
  Tag,
  Variable,
  Webhook,
  ListOrdered,
  Plug,
  RotateCw,
} from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: (type: string) => void;
}

const nodeTypes = [
  { type: 'trigger', label: 'Gatilho', icon: Workflow, description: 'Inicia o fluxo', color: 'text-emerald-500' },
  { type: 'message', label: 'Mensagem', icon: MessageCircle, description: 'Envia texto', color: 'text-primary' },
  { type: 'image', label: 'Imagem', icon: Image, description: 'Envia imagem', color: 'text-sky-500' },
  { type: 'audio', label: 'Áudio', icon: Volume2, description: 'Envia áudio', color: 'text-orange-500' },
  { type: 'video', label: 'Vídeo', icon: Video, description: 'Envia vídeo', color: 'text-pink-500' },
  { type: 'button', label: 'Botão', icon: MousePointer, description: 'Botão interativo', color: 'text-cyan-500' },
  { type: 'condition', label: 'Condição', icon: Filter, description: 'Decisão if/else', color: 'text-purple-500' },
  { type: 'delay', label: 'Aguardar', icon: Clock, description: 'Delay temporal', color: 'text-amber-500' },
  { type: 'payment', label: 'Pagamento', icon: DollarSign, description: 'Cobra via PIX', color: 'text-emerald-500' },
  { type: 'webhook', label: 'Webhook', icon: Webhook, description: 'Chamada HTTP', color: 'text-rose-500' },
  { type: 'tag', label: 'Tag', icon: Tag, description: 'Marca usuário', color: 'text-indigo-500' },
  { type: 'variable', label: 'Variável', icon: Variable, description: 'Salva dado', color: 'text-teal-500' },
  { type: 'list', label: 'Lista', icon: ListOrdered, description: 'Menu de opções', color: 'text-lime-500' },
  { type: 'api', label: 'API', icon: Plug, description: 'Integração externa', color: 'text-violet-500' },
  { type: 'sequence', label: 'Sequência', icon: RotateCw, description: 'Fluxo encadeado', color: 'text-fuchsia-500' },
  { type: 'action', label: 'Ação', icon: Send, description: 'Executar ação', color: 'text-blue-500' },
];

export default function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  return (
    <Card className="w-72 h-full overflow-y-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Blocos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {nodeTypes.map((node) => {
          const Icon = node.icon;
          return (
            <Button
              key={node.type}
              variant="outline"
              className="w-full justify-start gap-3 h-auto py-2.5"
              onClick={() => onAddNode(node.type)}
            >
              <Icon className={`h-4 w-4 shrink-0 ${node.color}`} />
              <div className="text-left flex-1">
                <div className="font-semibold text-xs">{node.label}</div>
                <div className="text-[10px] text-muted-foreground">{node.description}</div>
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
      config: { ...selectedNode.data.config, [field]: value },
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, label });
  };

  const updateDescription = (description: string) => {
    onUpdateNode(selectedNode.id, { ...selectedNode.data, description });
  };

  return (
    <Card className="w-80 h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="text-lg">Configurar Bloco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input value={selectedNode.data.label || ''} onChange={(e) => updateLabel(e.target.value)} />
        </div>

        {selectedNode.data.type === 'message' && (
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea value={selectedNode.data.config?.message || ''} onChange={(e) => handleUpdate('message', e.target.value)} rows={4} placeholder="Digite a mensagem" />
          </div>
        )}

        {selectedNode.data.type === 'image' && (
          <div className="space-y-2">
            <Label>URL da Imagem</Label>
            <Input value={selectedNode.data.config?.imageUrl || ''} onChange={(e) => handleUpdate('imageUrl', e.target.value)} placeholder="https://..." />
            <Label>Legenda</Label>
            <Input value={selectedNode.data.config?.caption || ''} onChange={(e) => handleUpdate('caption', e.target.value)} placeholder="Legenda opcional" />
          </div>
        )}

        {selectedNode.data.type === 'audio' && (
          <div className="space-y-2">
            <Label>URL do Áudio</Label>
            <Input value={selectedNode.data.config?.audioUrl || ''} onChange={(e) => handleUpdate('audioUrl', e.target.value)} placeholder="https://..." />
          </div>
        )}

        {selectedNode.data.type === 'video' && (
          <div className="space-y-2">
            <Label>URL do Vídeo</Label>
            <Input value={selectedNode.data.config?.videoUrl || ''} onChange={(e) => handleUpdate('videoUrl', e.target.value)} placeholder="https://..." />
            <Label>Legenda</Label>
            <Input value={selectedNode.data.config?.caption || ''} onChange={(e) => handleUpdate('caption', e.target.value)} placeholder="Legenda opcional" />
          </div>
        )}

        {selectedNode.data.type === 'button' && (
          <>
            <div className="space-y-2">
              <Label>Texto do Botão</Label>
              <Input value={selectedNode.data.config?.buttonText || ''} onChange={(e) => handleUpdate('buttonText', e.target.value)} placeholder="Clique aqui" />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={selectedNode.data.config?.buttonType || 'reply'} onValueChange={(v) => handleUpdate('buttonType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="reply">Resposta</SelectItem>
                  <SelectItem value="url">Link</SelectItem>
                  <SelectItem value="callback">Callback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedNode.data.config?.buttonType === 'url' && (
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={selectedNode.data.config?.url || ''} onChange={(e) => handleUpdate('url', e.target.value)} placeholder="https://..." />
              </div>
            )}
          </>
        )}

        {selectedNode.data.type === 'delay' && (
          <>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Input type="number" value={selectedNode.data.config?.duration || 5} onChange={(e) => handleUpdate('duration', parseInt(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={selectedNode.data.config?.unit || 'seconds'} onValueChange={(v) => handleUpdate('unit', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Select value={selectedNode.data.config?.condition || 'contains'} onValueChange={(v) => handleUpdate('condition', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="starts_with">Começa com</SelectItem>
                  <SelectItem value="regex">Regex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input value={selectedNode.data.config?.value || ''} onChange={(e) => handleUpdate('value', e.target.value)} placeholder="Texto para comparar" />
            </div>
          </>
        )}

        {selectedNode.data.type === 'payment' && (
          <>
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input type="number" step="0.01" value={selectedNode.data.config?.amount || ''} onChange={(e) => handleUpdate('amount', e.target.value)} placeholder="49.90" />
            </div>
            <div className="space-y-2">
              <Label>Descrição do Pagamento</Label>
              <Input value={selectedNode.data.config?.paymentDescription || ''} onChange={(e) => handleUpdate('paymentDescription', e.target.value)} placeholder="Acesso VIP" />
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Select value={selectedNode.data.config?.paymentMethod || 'pix'} onValueChange={(v) => handleUpdate('paymentMethod', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedNode.data.type === 'webhook' && (
          <>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={selectedNode.data.config?.webhookUrl || ''} onChange={(e) => handleUpdate('webhookUrl', e.target.value)} placeholder="https://api.exemplo.com/webhook" />
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Select value={selectedNode.data.config?.method || 'POST'} onValueChange={(v) => handleUpdate('method', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedNode.data.type === 'tag' && (
          <div className="space-y-2">
            <Label>Nome da Tag</Label>
            <Input value={selectedNode.data.config?.tagName || ''} onChange={(e) => handleUpdate('tagName', e.target.value)} placeholder="vip, lead, comprador" />
          </div>
        )}

        {selectedNode.data.type === 'variable' && (
          <>
            <div className="space-y-2">
              <Label>Nome da Variável</Label>
              <Input value={selectedNode.data.config?.varName || ''} onChange={(e) => handleUpdate('varName', e.target.value)} placeholder="nome_usuario" />
            </div>
            <div className="space-y-2">
              <Label>Origem</Label>
              <Select value={selectedNode.data.config?.source || 'input'} onValueChange={(v) => handleUpdate('source', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Resposta do Usuário</SelectItem>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                  <SelectItem value="api">Resposta de API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {selectedNode.data.type === 'list' && (
          <div className="space-y-2">
            <Label>Opções (uma por linha)</Label>
            <Textarea value={selectedNode.data.config?.options || ''} onChange={(e) => handleUpdate('options', e.target.value)} rows={4} placeholder={"Opção 1\nOpção 2\nOpção 3"} />
          </div>
        )}

        {selectedNode.data.type === 'api' && (
          <>
            <div className="space-y-2">
              <Label>URL da API</Label>
              <Input value={selectedNode.data.config?.apiUrl || ''} onChange={(e) => handleUpdate('apiUrl', e.target.value)} placeholder="https://api.exemplo.com" />
            </div>
            <div className="space-y-2">
              <Label>Método</Label>
              <Select value={selectedNode.data.config?.apiMethod || 'GET'} onValueChange={(v) => handleUpdate('apiMethod', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Headers (JSON)</Label>
              <Textarea value={selectedNode.data.config?.headers || ''} onChange={(e) => handleUpdate('headers', e.target.value)} rows={3} placeholder='{"Authorization": "Bearer ..."}' />
            </div>
          </>
        )}

        {selectedNode.data.type === 'trigger' && (
          <div className="space-y-2">
            <Label>Tipo de Gatilho</Label>
            <Select value={selectedNode.data.config?.triggerType || 'keyword'} onValueChange={(v) => handleUpdate('triggerType', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="keyword">Palavra-chave</SelectItem>
                <SelectItem value="command">Comando</SelectItem>
                <SelectItem value="payment">Pagamento</SelectItem>
                <SelectItem value="click">Clique em botão</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="schedule">Agendamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea value={selectedNode.data.description || ''} onChange={(e) => updateDescription(e.target.value)} placeholder="Descrição opcional" rows={2} />
        </div>

        <Button onClick={onClose} variant="outline" className="w-full">
          Fechar
        </Button>
      </CardContent>
    </Card>
  );
}
