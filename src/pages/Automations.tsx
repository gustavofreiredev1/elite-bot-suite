import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, Plus, Play, Pause, Save, Zap, Trash2, Loader2 } from 'lucide-react';
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
import { getUserBots, getBotFlows, saveBotFlow, deleteBotFlow } from '@/lib/telegram';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const nodeTypes = { custom: CustomNode };

interface BotRecord { id: string; name: string; telegram_bot_username: string | null; }
interface FlowRecord {
  id: string;
  bot_id: string;
  name: string;
  description: string | null;
  trigger_command: string | null;
  is_active: boolean;
  nodes: any[];
  edges: any[];
}

export default function Automations() {
  const [searchParams] = useSearchParams();
  const [bots, setBots] = useState<BotRecord[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(searchParams.get('bot'));
  const [flows, setFlows] = useState<FlowRecord[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FlowRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowCommand, setNewFlowCommand] = useState('/start');

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    getUserBots().then((data) => {
      setBots(data || []);
      if (!selectedBotId && data?.length) setSelectedBotId(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedBotId) return;
    getBotFlows(selectedBotId).then((data) => {
      setFlows((data || []).map((d: any) => ({ ...d, nodes: d.nodes || [], edges: d.edges || [] })) as FlowRecord[]);
      setSelectedFlow(null);
      setNodes([]);
      setEdges([]);
    });
  }, [selectedBotId]);

  const loadFlow = (flow: FlowRecord) => {
    setSelectedFlow(flow);
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    setSelectedNode(null);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAddNode = (type: string) => {
    const labels: Record<string, string> = {
      trigger: 'Gatilho',
      message: 'Mensagem',
      condition: 'Condição',
      delay: 'Delay',
      action: 'Ação',
      button: 'Botão',
      payment: 'Pagamento',
      webhook: 'Webhook',
    };
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      data: {
        label: labels[type] || type,
        type,
        description: 'Configure este bloco',
        config: {},
      },
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    };
    setNodes((nds) => [...nds, newNode] as any);
  };

  const onUpdateNode = (id: string, data: any) => {
    setNodes((nds) => nds.map((n) => (n.id === id ? { ...n, data } : n)));
  };

  const handleSaveFlow = async () => {
    if (!selectedFlow || !selectedBotId) return;
    setSaving(true);
    try {
      await saveBotFlow({
        id: selectedFlow.id,
        bot_id: selectedBotId,
        name: selectedFlow.name,
        description: selectedFlow.description || undefined,
        trigger_command: selectedFlow.trigger_command || undefined,
        is_active: selectedFlow.is_active,
        nodes,
        edges,
      });
      toast.success('Fluxo salvo!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFlow = async () => {
    if (!selectedBotId || !newFlowName.trim()) return;
    setSaving(true);
    try {
      const startNode = {
        id: 'node-1',
        type: 'custom',
        data: { label: 'Início', type: 'trigger', description: `Comando ${newFlowCommand}`, config: { triggerType: 'command' } },
        position: { x: 250, y: 50 },
      };
      const rawFlow = await saveBotFlow({
        bot_id: selectedBotId,
        name: newFlowName.trim(),
        trigger_command: newFlowCommand,
        nodes: [startNode],
        edges: [],
      });
      const flow = { ...rawFlow, nodes: rawFlow.nodes || [], edges: rawFlow.edges || [] } as FlowRecord;
      setFlows((prev) => [flow, ...prev]);
      loadFlow(flow);
      setShowNewDialog(false);
      setNewFlowName('');
      toast.success('Fluxo criado!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar fluxo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    if (!confirm('Excluir este fluxo?')) return;
    try {
      await deleteBotFlow(flowId);
      setFlows((prev) => prev.filter((f) => f.id !== flowId));
      if (selectedFlow?.id === flowId) {
        setSelectedFlow(null);
        setNodes([]);
        setEdges([]);
      }
      toast.success('Fluxo excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  };

  const toggleFlowActive = async (flow: FlowRecord) => {
    try {
      await saveBotFlow({ ...flow, is_active: !flow.is_active });
      setFlows((prev) => prev.map((f) => (f.id === flow.id ? { ...f, is_active: !f.is_active } : f)));
      toast.success(flow.is_active ? 'Fluxo pausado' : 'Fluxo ativado');
    } catch {
      toast.error('Erro ao alterar status');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Automações"
        description="Crie fluxos visuais para automatizar seu bot"
        icon={Zap}
        breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Automações' }]}
        actions={
          <div className="flex gap-2">
            {bots.length > 1 && (
              <Select value={selectedBotId || ''} onValueChange={setSelectedBotId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione um bot" />
                </SelectTrigger>
                <SelectContent>
                  {bots.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={() => setShowNewDialog(true)} disabled={!selectedBotId}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Fluxo
            </Button>
          </div>
        }
      />

      <div className="space-y-6 mt-6">
        {!selectedBotId ? (
          <Card className="card-elegant">
            <CardContent className="flex flex-col items-center py-16 space-y-4">
              <Bot className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-muted-foreground">Conecte um bot primeiro para criar automações.</p>
              <Button onClick={() => (window.location.href = '/create-bot')} className="hover-glow">
                Conectar Bot
              </Button>
            </CardContent>
          </Card>
        ) : selectedFlow ? (
          /* Flow Editor */
          <Card className="p-0 overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedFlow.name}
                    <Badge variant={selectedFlow.is_active ? 'default' : 'secondary'}>
                      {selectedFlow.is_active ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Comando: {selectedFlow.trigger_command || 'Nenhum'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setSelectedFlow(null); setNodes([]); setEdges([]); }}>
                    Voltar
                  </Button>
                  <Button onClick={handleSaveFlow} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Salvar
                  </Button>
                </div>
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
                    onNodeClick={(_e, node) => setSelectedNode(node)}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-muted/30"
                  >
                    <Controls />
                    <MiniMap className="bg-background" />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                    <Panel position="top-left" className="bg-background/80 backdrop-blur p-2 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Dica:</strong> Arraste para conectar os blocos
                      </p>
                    </Panel>
                  </ReactFlow>
                </div>
                <div className="border-l w-[280px]">
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
          /* Flow List */
          <div className="space-y-4">
            {flows.length === 0 ? (
              <Card className="card-elegant">
                <CardContent className="flex flex-col items-center py-16 space-y-4">
                  <Zap className="h-16 w-16 text-muted-foreground/30" />
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Nenhum fluxo criado</h3>
                    <p className="text-muted-foreground">Crie seu primeiro fluxo de automação.</p>
                  </div>
                  <Button onClick={() => setShowNewDialog(true)} className="hover-glow">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Fluxo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              flows.map((flow) => (
                <Card key={flow.id} className="card-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="cursor-pointer" onClick={() => loadFlow(flow)}>
                        <CardTitle className="flex items-center gap-2">
                          {flow.name}
                          <Badge variant={flow.is_active ? 'default' : 'secondary'}>
                            {flow.is_active ? 'Ativo' : 'Pausado'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {flow.trigger_command || 'Sem comando'} · {(flow.nodes || []).length} blocos
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => toggleFlowActive(flow)}>
                          {flow.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => loadFlow(flow)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFlow(flow.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* New Flow Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Fluxo de Automação</DialogTitle>
            <DialogDescription>Configure o nome e o comando gatilho do fluxo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Fluxo</Label>
              <Input
                placeholder="Ex: Boas-vindas"
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Comando Gatilho</Label>
              <Input
                placeholder="/start"
                value={newFlowCommand}
                onChange={(e) => setNewFlowCommand(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Quando o usuário enviar este comando, o fluxo será executado.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFlow} disabled={!newFlowName.trim() || saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar Fluxo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
