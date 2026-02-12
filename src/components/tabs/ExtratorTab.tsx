import { useState } from 'react';
import { Download, Users, Search, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface ExtractedGroup {
  id: string;
  name: string;
  chatId: string;
  membersCount: number;
  extractedAt: string;
  status: 'completed' | 'processing' | 'error';
}

export default function ExtratorTab() {
  const [groups, setGroups] = useState<ExtractedGroup[]>([
    { id: '1', name: 'Grupo Marketing Digital', chatId: '-100123456', membersCount: 4500, extractedAt: '2025-03-01', status: 'completed' },
    { id: '2', name: 'Canal de Vendas', chatId: '-100789012', membersCount: 12000, extractedAt: '2025-03-02', status: 'completed' },
  ]);
  const [chatId, setChatId] = useState('');
  const [extracting, setExtracting] = useState(false);

  const handleExtract = () => {
    if (!chatId) return;
    setExtracting(true);
    setTimeout(() => {
      setGroups(prev => [...prev, { id: Date.now().toString(), name: `Grupo ${chatId}`, chatId, membersCount: Math.floor(Math.random() * 5000), extractedAt: new Date().toISOString(), status: 'completed' }]);
      setChatId('');
      setExtracting(false);
      toast.success('Extração concluída!');
    }, 2000);
  };

  const exportCSV = (group: ExtractedGroup) => {
    const csv = `ID,Username,Nome\n1,user1,Usuário 1\n2,user2,Usuário 2`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${group.name}.csv`; a.click();
    toast.success('Exportado!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Extrator de Contatos</h3>
        <p className="text-muted-foreground mt-1">Exporte IDs, usernames e membros de grupos</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Extrair Membros</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Chat ID do Grupo/Canal</Label>
            <div className="flex gap-2">
              <Input placeholder="-100123456789" value={chatId} onChange={e => setChatId(e.target.value)} />
              <Button onClick={handleExtract} disabled={extracting || !chatId}>
                {extracting ? 'Extraindo...' : 'Extrair'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Extrações Realizadas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Grupo</TableHead><TableHead>Chat ID</TableHead><TableHead>Membros</TableHead><TableHead>Data</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {groups.map(g => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell className="font-mono text-xs">{g.chatId}</TableCell>
                  <TableCell>{g.membersCount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(g.extractedAt).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell><Badge variant={g.status === 'completed' ? 'default' : g.status === 'processing' ? 'secondary' : 'destructive'}>{g.status === 'completed' ? 'Concluído' : g.status === 'processing' ? 'Processando' : 'Erro'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => exportCSV(g)}><Download className="h-3 w-3 mr-1" />CSV</Button>
                      <Button size="sm" variant="outline" onClick={() => exportCSV(g)}><FileText className="h-3 w-3 mr-1" />Excel</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
