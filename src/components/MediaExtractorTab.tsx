import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Image, Video, FileText, Download, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ExtractionJob {
  id: string;
  channelName: string;
  channelId: string;
  links: number;
  images: number;
  videos: number;
  documents: number;
  status: 'processing' | 'completed';
  createdAt: string;
}

const mockJobs: ExtractionJob[] = [
  {
    id: '1',
    channelName: 'Canal Recursos',
    channelId: '-1001234567890',
    links: 340,
    images: 520,
    videos: 85,
    documents: 120,
    status: 'completed',
    createdAt: '2025-01-20 11:00',
  },
];

export default function MediaExtractorTab() {
  const [jobs, setJobs] = useState<ExtractionJob[]>(mockJobs);
  const [formData, setFormData] = useState({
    channelId: '',
    extractLinks: true,
    extractImages: true,
    extractVideos: true,
    extractDocs: true,
    organizeByDate: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Extração iniciada com sucesso!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5 text-primary" />
              Extrator de Links e Mídias
            </CardTitle>
            <CardDescription>Extraia links, imagens, vídeos e documentos automaticamente</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channelId">ID do Canal/Grupo</Label>
                <Input
                  id="channelId"
                  placeholder="-1001234567890 ou @nomedocanal"
                  value={formData.channelId}
                  onChange={(e) => setFormData({ ...formData, channelId: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <Label>Tipos de Conteúdo para Extrair</Label>
                <div className="glass p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extractLinks" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      URLs e Links
                    </Label>
                    <Switch
                      id="extractLinks"
                      checked={formData.extractLinks}
                      onCheckedChange={(checked) => setFormData({ ...formData, extractLinks: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extractImages" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Imagens
                    </Label>
                    <Switch
                      id="extractImages"
                      checked={formData.extractImages}
                      onCheckedChange={(checked) => setFormData({ ...formData, extractImages: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extractVideos" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Vídeos
                    </Label>
                    <Switch
                      id="extractVideos"
                      checked={formData.extractVideos}
                      onCheckedChange={(checked) => setFormData({ ...formData, extractVideos: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extractDocs" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documentos
                    </Label>
                    <Switch
                      id="extractDocs"
                      checked={formData.extractDocs}
                      onCheckedChange={(checked) => setFormData({ ...formData, extractDocs: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between glass p-3 rounded-lg">
                <Label htmlFor="organizeByDate">Organizar por Data</Label>
                <Switch
                  id="organizeByDate"
                  checked={formData.organizeByDate}
                  onCheckedChange={(checked) => setFormData({ ...formData, organizeByDate: checked })}
                />
              </div>

              <Button type="submit" className="w-full hover-glow">
                <Play className="h-4 w-4 mr-2" />
                Iniciar Extração
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Extrações Realizadas</CardTitle>
            <CardDescription>Histórico de downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Canal</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Imagens</TableHead>
                  <TableHead>Vídeos</TableHead>
                  <TableHead>Docs</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.channelName}</TableCell>
                    <TableCell>{job.links}</TableCell>
                    <TableCell>{job.images}</TableCell>
                    <TableCell>{job.videos}</TableCell>
                    <TableCell>{job.documents}</TableCell>
                    <TableCell>
                      <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                        {job.status === 'completed' ? '✓ Concluído' : '● Processando'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
