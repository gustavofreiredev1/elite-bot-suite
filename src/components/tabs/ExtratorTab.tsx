import { useState, useEffect } from 'react';
import { Download, Users, Loader2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function ExtratorTab() {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    // Load CRM contacts for export
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('crm_contacts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setContacts(data || []);
    };
    load();
  }, []);

  const exportCSV = () => {
    if (contacts.length === 0) { toast.error('Nenhum contato para exportar'); return; }
    const csv = 'Nome,Telegram ID,Username,Telefone,Email,Tags\n' + contacts.map(c =>
      `"${c.name || ''}","${c.telegram_id || ''}","${c.telegram_username || ''}","${c.phone || ''}","${c.email || ''}","${(c.tags || []).join(',')}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'contatos.csv'; a.click();
    toast.success('Exportado!');
  };

  const exportLeads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('leads').select('*').eq('user_id', user.id);
    if (!data || data.length === 0) { toast.error('Nenhum lead para exportar'); return; }
    const csv = 'Nome,Telefone,Email,Telegram ID,Username,Origem,Tags\n' + data.map((l: any) =>
      `"${l.name || ''}","${l.phone || ''}","${l.email || ''}","${l.telegram_id || ''}","${l.telegram_username || ''}","${l.source || ''}","${(l.tags || []).join(',')}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    toast.success('Leads exportados!');
  };

  const exportVipMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('vip_members').select('*').eq('user_id', user.id);
    if (!data || data.length === 0) { toast.error('Nenhum membro VIP para exportar'); return; }
    const csv = 'Nome,Telegram ID,Username,Plano,Status,Expira\n' + data.map((m: any) =>
      `"${m.name || ''}","${m.telegram_id}","${m.telegram_username || ''}","${m.plan_name || ''}","${m.status}","${m.expires_at || 'Vitalício'}"`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'membros-vip.csv'; a.click();
    toast.success('Membros VIP exportados!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Extrator de Contatos</h3>
        <p className="text-muted-foreground mt-1">Exporte IDs, usuários, grupos e planilhas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={exportCSV}>
          <CardContent className="flex flex-col items-center py-8 space-y-3">
            <Users className="h-10 w-10 text-primary" />
            <h4 className="font-semibold">Contatos CRM</h4>
            <p className="text-sm text-muted-foreground text-center">{contacts.length} contatos disponíveis</p>
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" />Exportar CSV</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={exportLeads}>
          <CardContent className="flex flex-col items-center py-8 space-y-3">
            <FileText className="h-10 w-10 text-primary" />
            <h4 className="font-semibold">Leads Capturados</h4>
            <p className="text-sm text-muted-foreground text-center">Exportar todos os leads</p>
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" />Exportar CSV</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={exportVipMembers}>
          <CardContent className="flex flex-col items-center py-8 space-y-3">
            <Users className="h-10 w-10 text-primary" />
            <h4 className="font-semibold">Membros VIP</h4>
            <p className="text-sm text-muted-foreground text-center">Exportar membros pagantes</p>
            <Button variant="outline" size="sm"><Download className="h-3 w-3 mr-1" />Exportar CSV</Button>
          </CardContent>
        </Card>
      </div>

      {contacts.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Prévia dos Contatos CRM</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Telegram</TableHead><TableHead>Telefone</TableHead><TableHead>Email</TableHead><TableHead>Tags</TableHead></TableRow></TableHeader>
              <TableBody>
                {contacts.slice(0, 10).map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name || '-'}</TableCell>
                    <TableCell className="text-sm">{c.telegram_username ? `@${c.telegram_username}` : c.telegram_id || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">{c.phone || '-'}</TableCell>
                    <TableCell>{c.email || '-'}</TableCell>
                    <TableCell><div className="flex gap-1">{(c.tags || []).slice(0, 3).map((t: string) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {contacts.length > 10 && <p className="text-sm text-muted-foreground text-center mt-4">Mostrando 10 de {contacts.length} contatos</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
