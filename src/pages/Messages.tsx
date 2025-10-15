import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Edit, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

const mockTemplates: Template[] = [
  { id: '1', name: 'Boas-vindas', content: 'Olá! Bem-vindo ao nosso bot. Como posso ajudar você hoje?' },
  { id: '2', name: 'Horário de Atendimento', content: 'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.' },
  { id: '3', name: 'Erro Genérico', content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' },
];

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '/start', sender: 'user', timestamp: '14:32' },
    { id: '2', text: 'Olá! Bem-vindo ao bot.', sender: 'bot', timestamp: '14:32' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [templates, setTemplates] = useState(mockTemplates);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Resposta automática do bot baseada em suas automações.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold">Mensagens</h1>
          <p className="text-muted-foreground">Gerencie templates e teste seu bot</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="card-elegant lg:col-span-2">
            <CardHeader>
              <CardTitle>Simulador de Chat</CardTitle>
              <CardDescription>Teste as respostas do seu bot em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={msg.sender === 'bot' ? 'bg-primary' : 'bg-secondary'}>
                            {msg.sender === 'bot' ? 'B' : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-muted border-border"
                />
                <Button onClick={handleSend} className="hover-glow">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="card-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Templates</CardTitle>
                  <Button size="sm" className="hover-glow">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Mensagens predefinidas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-3 rounded-lg space-y-2 cursor-pointer"
                    onClick={() => {
                      setInputValue(template.content);
                      toast.success('Template carregado!');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{template.name}</p>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-elegant">
              <CardHeader>
                <CardTitle>Criar Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Nome do template" className="bg-muted border-border" />
                <Textarea
                  placeholder="Conteúdo da mensagem..."
                  className="bg-muted border-border"
                  rows={4}
                />
                <Button className="w-full hover-glow">Salvar Template</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
