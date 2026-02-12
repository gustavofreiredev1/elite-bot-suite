import { useState } from 'react';
import { UserPlus, Download, Tag, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  tags: string[];
  capturedAt: string;
}

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'João Silva', phone: '+5511999999999', email: 'joao@email.com', source: 'Bot Vendas', tags: ['hot', 'premium'], capturedAt: '2025-03-01' },
    { id: '2', name: 'Maria Santos', phone: '+5521988888888', email: 'maria@email.com', source: 'Landing Page', tags: ['warm'], capturedAt: '2025-03-02' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase()));

  const exportCSV = () => {
    const csv = 'Nome,Telefone,Email,Origem,Tags\n' + leads.map(l => `${l.name},${l.phone},${l.email},${l.source},"${l.tags.join(',')}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    toast.success('Leads exportados!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Captura de Leads</h3>
          <p className="text-muted-foreground mt-1">Coleta automática de contatos com segmentação</p>
        </div>
        <Button onClick={exportCSV} variant="outline"><Download className="mr-2 h-4 w-4" />Exportar CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{leads.length}</div><p className="text-sm text-muted-foreground">Total de Leads</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{leads.filter(l => l.tags.includes('hot')).length}</div><p className="text-sm text-muted-foreground">Leads Quentes</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(leads.map(l => l.source)).size}</div><p className="text-sm text-muted-foreground">Origens</p></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar leads..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" />Leads Capturados</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telefone</TableHead><TableHead>Email</TableHead><TableHead>Origem</TableHead><TableHead>Tags</TableHead><TableHead>Data</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(l => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell className="font-mono text-xs">{l.phone}</TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.source}</TableCell>
                  <TableCell><div className="flex gap-1">{l.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(l.capturedAt).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
