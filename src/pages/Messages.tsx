import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User as UserIcon, MessageSquare, Loader2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import MainLayout from '@/layouts/MainLayout';
import { getUserBots, getBotConversations, getConversationMessages, sendMessage } from '@/lib/telegram';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface BotRecord {
  id: string;
  name: string;
  telegram_bot_username: string | null;
  status: string;
}

interface ConvRecord {
  id: string;
  telegram_chat_id: number;
  chat_title: string | null;
  chat_type: string | null;
  last_message_at: string | null;
}

interface MsgRecord {
  id: string;
  conversation_id: string;
  sender_type: string;
  sender_name: string | null;
  content: string | null;
  created_at: string;
}

export default function Messages() {
  const [searchParams] = useSearchParams();
  const [bots, setBots] = useState<BotRecord[]>([]);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(searchParams.get('bot'));
  const [conversations, setConversations] = useState<ConvRecord[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [selectedConv, setSelectedConv] = useState<ConvRecord | null>(null);
  const [messages, setMessages] = useState<MsgRecord[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserBots().then((data) => {
      setBots(data || []);
      if (!selectedBotId && data?.length) setSelectedBotId(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedBotId) return;
    getBotConversations(selectedBotId).then((data) => {
      setConversations(data || []);
      if (data?.length) {
        setSelectedConvId(data[0].id);
        setSelectedConv(data[0]);
      } else {
        setSelectedConvId(null);
        setSelectedConv(null);
        setMessages([]);
      }
    });
  }, [selectedBotId]);

  useEffect(() => {
    if (!selectedConvId) return;
    getConversationMessages(selectedConvId).then((data) => setMessages(data || []));
  }, [selectedConvId]);

  // Realtime subscription
  useEffect(() => {
    if (!selectedBotId) return;

    const channel = supabase
      .channel(`messages-${selectedBotId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `bot_id=eq.${selectedBotId}` },
        (payload) => {
          const newMsg = payload.new as MsgRecord;
          if (newMsg.conversation_id === selectedConvId) {
            setMessages((prev) => [...prev, newMsg]);
          }
          // Refresh conversations list
          getBotConversations(selectedBotId).then((data) => setConversations(data || []));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBotId, selectedConvId]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBotId || !selectedConv) return;
    setSending(true);
    try {
      await sendMessage(selectedBotId, selectedConv.telegram_chat_id, inputValue.trim());
      setInputValue('');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader
          title="Chat"
          description="Converse com seus usuários em tempo real"
          icon={MessageSquare}
          breadcrumbs={[{ label: 'Painel', href: '/dashboard' }, { label: 'Chat' }]}
        />

        {bots.length === 0 ? (
          <Card className="card-elegant">
            <CardContent className="flex flex-col items-center py-16 space-y-4">
              <Bot className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-muted-foreground">Conecte um bot primeiro para ver as conversas.</p>
              <Button onClick={() => (window.location.href = '/create-bot')} className="hover-glow">
                Conectar Bot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-4" style={{ height: 'calc(100vh - 220px)' }}>
            {/* Sidebar - Bots + Conversations */}
            <Card className="card-elegant lg:col-span-1 overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bots</CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {bots.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBotId(bot.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedBotId === bot.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 shrink-0" />
                      <span className="truncate">{bot.name}</span>
                      {bot.status === 'connected' && (
                        <span className="h-2 w-2 rounded-full bg-success ml-auto shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>

              <CardHeader className="pb-2 pt-2 border-t border-border">
                <CardTitle className="text-sm">Conversas</CardTitle>
              </CardHeader>
              <ScrollArea className="flex-1 px-2 pb-2">
                {conversations.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Nenhuma conversa ainda
                  </p>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setSelectedConvId(conv.id);
                          setSelectedConv(conv);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedConvId === conv.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        }`}
                      >
                        <p className="font-medium truncate">{conv.chat_title || `Chat ${conv.telegram_chat_id}`}</p>
                        <p className="text-xs text-muted-foreground">
                          {conv.last_message_at
                            ? new Date(conv.last_message_at).toLocaleString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                day: '2-digit',
                                month: '2-digit',
                              })
                            : ''}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>

            {/* Chat area */}
            <Card className="card-elegant lg:col-span-3 flex flex-col overflow-hidden">
              {selectedConv ? (
                <>
                  <CardHeader className="border-b border-border py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {(selectedConv.chat_title || 'C').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{selectedConv.chat_title || `Chat ${selectedConv.telegram_chat_id}`}</p>
                        <Badge variant="outline" className="text-xs">
                          {selectedConv.chat_type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender_type === 'bot' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${msg.sender_type === 'bot' ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={`text-xs ${msg.sender_type === 'bot' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                {msg.sender_type === 'bot' ? <Bot className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`rounded-2xl px-3 py-2 ${
                                msg.sender_type === 'bot'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              {msg.sender_name && msg.sender_type === 'user' && (
                                <p className="text-xs font-semibold mb-0.5">{msg.sender_name}</p>
                              )}
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                  <div className="border-t border-border p-3 flex gap-2">
                    <Input
                      placeholder="Responder mensagem..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-muted/50"
                      disabled={sending}
                    />
                    <Button onClick={handleSend} disabled={!inputValue.trim() || sending} className="hover-glow">
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                    <p className="text-muted-foreground">Selecione uma conversa para começar</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
