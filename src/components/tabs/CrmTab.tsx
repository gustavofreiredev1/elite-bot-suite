import { useState } from 'react';
import { Users, Tag, Search, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  telegramId: string;
  tags: string[];
  lastInteraction: string;
  totalMessages: number;
  list: string;
}

export default function CrmTab() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'João Silva', telegramId: '123456', tags: ['cliente', 'premium'], lastInteraction: '2025-03-01', totalMessages: 45, list: 'Compradores' },
    { id: '2', name: 'Maria Santos', telegramId: '789012', tags: ['lead', 'quente'], lastInteraction: '2025-03-02', totalMessages: 12, list: 'Leads' },
    { id: '3', name: 'Pedro Costa', telegramId: '345678', tags: ['cliente'], lastInteraction: '2025-02-28', totalMessages: 78, list: 'Compradores' },
  ]);
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.includes(search.toLowerCase())));

  const addTag = (id: string, tag: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, tags: [...new Set([...c.tags, tag])] } : c));
    toast.success('Tag adicionada!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">CRM Telegram</h3>
        <p className="text-muted-foreground mt-1">Gerencie contatos com tags, listas e histórico</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{contacts.length}</div><p className="text-sm text-muted-foreground">Total Contatos</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(contacts.flatMap(c => c.tags)).size}</div><p className="text-sm text-muted-foreground">Tags</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{new Set(contacts.map(c => c.list)).size}</div><p className="text-sm text-muted-foreground">Listas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{contacts.reduce((a, c) => a + c.totalMessages, 0)}</div><p className="text-sm text-muted-foreground">Mensagens</p></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar contato ou tag..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Contatos</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telegram ID</TableHead><TableHead>Tags</TableHead><TableHead>Lista</TableHead><TableHead>Mensagens</TableHead><TableHead>Última Interação</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.telegramId}</TableCell>
                  <TableCell><div className="flex gap-1 flex-wrap">{c.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                  <TableCell><Badge variant="secondary">{c.list}</Badge></TableCell>
                  <TableCell>{c.totalMessages}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(c.lastInteraction).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
