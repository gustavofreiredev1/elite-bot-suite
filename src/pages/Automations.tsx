import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Plus, Play, Pause, Settings, Trash2, Save, Zap } from 'lucide-react';
import { toast } from 'sonner';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from '@/components/flow/CustomNode';
import NodeToolbar, { NodeConfigPanel } from '@/components/flow/NodeToolbar';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      label: 'Novo Membro',
      type: 'trigger',
      description: 'Quando um novo membro entra no grupo',
      config: { triggerType: 'new_member' },
    },
    position: { x: 250, y: 50 },
  },
];

const initialEdges: Edge[] = [];

export default function Automations() {
  const navigate = useNavigate();
  const [showFlow, setShowFlow] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [automations, setAutomations] = useState([
    {
      id: '1',
      name: 'Boas-vindas Automáticas',
      description: 'Envia mensagem de boas-vindas para novos membros',
      status: 'active',
      triggers: 3,
      actions: 5,
    },
    {
      id: '2',
      name: 'Resposta Automática FAQ',
      description: 'Responde perguntas frequentes automaticamente',
      status: 'paused',
      triggers: 10,
      actions: 15,
    },
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = (type: string) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: 'custom',
      data: {
        label: `Novo ${type}`,
        type,
        description: 'Configure este nó',
        config: { triggerType: 'default' },
      },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
    };
    setNodes((nds) => [...nds, newNode] as any);
    toast.success('Nó adicionado!');
  };

  const onUpdateNode = (id: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data } : node))
    );
  };

  const onNodeClick = (_event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  };

  const saveFlow = () => {
    toast.success('Fluxo salvo com sucesso!', {
      description: 'Seu fluxo de automação foi salvo.',
    });
  };

  const toggleStatus = (id: string) => {
    setAutomations(
      automations.map((auto) =>
        auto.id === id
          ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
          : auto
      )
    );
    toast.success('Status atualizado!');
  };

  const deleteAutomation = (id: string) => {
    setAutomations(automations.filter((auto) => auto.id !== id));
    toast.success('Automação removida!');
  };

  return (
    <MainLayout>
      <PageHeader
        title="Automações"
        description="Configure e gerencie suas automações do Telegram"
        icon={Bot}
      />

      <div className="space-y-6">
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => setShowFlow(!showFlow)}
            variant={showFlow ? 'secondary' : 'default'}
          >
            <Zap className="mr-2 h-4 w-4" />
            {showFlow ? 'Ver Lista' : 'Editor Visual'}
          </Button>
          <Button onClick={() => navigate('/create-bot')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Automação
          </Button>
        </div>

        {showFlow ? (
          <Card className="p-0 overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Editor de Fluxo Visual</CardTitle>
                  <CardDescription>
                    Arraste e conecte nós para criar automações complexas
                  </CardDescription>
                </div>
                <Button onClick={saveFlow}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Fluxo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] flex">
                <div className="flex-1">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-muted/30"
                  >
                    <Controls />
                    <MiniMap
                      nodeColor={(node) => {
                        switch (node.data.type) {
                          case 'trigger':
                            return 'rgb(34 197 94)';
                          case 'message':
                            return 'hsl(var(--primary))';
                          case 'delay':
                            return 'rgb(245 158 11)';
                          case 'condition':
                            return 'rgb(168 85 247)';
                          case 'action':
                            return 'rgb(59 130 246)';
                          default:
                            return 'rgb(156 163 175)';
                        }
                      }}
                      className="bg-background"
                    />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    <Panel position="top-left" className="bg-background/80 backdrop-blur p-2 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        <strong>Dica:</strong> Clique em um nó para configurá-lo
                      </div>
                    </Panel>
                  </ReactFlow>
                </div>
                <div className="border-l">
                  {selectedNode ? (
                    <NodeConfigPanel
                      selectedNode={selectedNode}
                      onUpdateNode={onUpdateNode}
                      onClose={() => setSelectedNode(null)}
                    />
                  ) : (
                    <NodeToolbar onAddNode={onAddNode} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {automations.map((auto) => (
              <Card key={auto.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {auto.name}
                        <Badge variant={auto.status === 'active' ? 'default' : 'secondary'}>
                          {auto.status === 'active' ? 'Ativo' : 'Pausado'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{auto.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(auto.id)}
                      >
                        {auto.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAutomation(auto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{auto.triggers}</span> Gatilhos
                    </div>
                    <div>
                      <span className="font-medium">{auto.actions}</span> Ações
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
