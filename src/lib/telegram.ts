import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

const getAuthHeaders = () => {
  const session = useAuthStore.getState().session;
  return {
    Authorization: `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

const callTelegramBot = async (action: string, body: Record<string, any> = {}) => {
  const { data, error } = await supabase.functions.invoke('telegram-bot', {
    body: { action, ...body },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
};

export const validateToken = (token: string) =>
  callTelegramBot('validate_token', { telegram_token: token });

export const connectBot = (token: string, botName?: string) =>
  callTelegramBot('connect_bot', { telegram_token: token, bot_name: botName });

export const disconnectBot = (botId: string) =>
  callTelegramBot('disconnect_bot', { bot_id: botId });

export const sendMessage = (botId: string, chatId: number, text: string) =>
  callTelegramBot('send_message', { bot_id: botId, chat_id: chatId, text });

export const listBots = () => callTelegramBot('list_bots');

export const getUserBots = async () => {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getBotConversations = async (botId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('bot_id', botId)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getConversationMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const getBotFlows = async (botId: string) => {
  const { data, error } = await supabase
    .from('bot_flows')
    .select('*')
    .eq('bot_id', botId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const saveBotFlow = async (flow: {
  id?: string;
  bot_id: string;
  name: string;
  description?: string;
  trigger_command?: string;
  is_active?: boolean;
  nodes: any[];
  edges: any[];
}) => {
  if (flow.id) {
    const { data, error } = await supabase
      .from('bot_flows')
      .update({
        name: flow.name,
        description: flow.description,
        trigger_command: flow.trigger_command,
        is_active: flow.is_active,
        nodes: flow.nodes,
        edges: flow.edges,
      })
      .eq('id', flow.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('bot_flows')
      .insert({
        bot_id: flow.bot_id,
        name: flow.name,
        description: flow.description,
        trigger_command: flow.trigger_command,
        is_active: flow.is_active ?? false,
        nodes: flow.nodes,
        edges: flow.edges,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const deleteBotFlow = async (flowId: string) => {
  const { error } = await supabase.from('bot_flows').delete().eq('id', flowId);
  if (error) throw error;
};
