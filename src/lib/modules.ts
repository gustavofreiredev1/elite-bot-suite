import { supabase } from '@/integrations/supabase/client';

const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');
  return user.id;
};

// ===== LEADS =====
export const getLeads = async (botId?: string) => {
  const userId = await getUserId();
  let query = supabase.from('leads').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (botId) query = query.eq('bot_id', botId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createLead = async (lead: { name?: string; phone?: string; email?: string; telegram_id?: number; telegram_username?: string; source?: string; tags?: string[]; bot_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('leads').insert({ ...lead, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const deleteLead = async (id: string) => {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
};

// ===== BROADCASTS =====
export const getBroadcasts = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('broadcasts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createBroadcast = async (broadcast: { name: string; message_content: string; media_url?: string; media_type?: string; bot_id?: string; target_type?: string; scheduled_at?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('broadcasts').insert({ ...broadcast, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateBroadcast = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('broadcasts').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteBroadcast = async (id: string) => {
  const { error } = await supabase.from('broadcasts').delete().eq('id', id);
  if (error) throw error;
};

// ===== SCHEDULED MESSAGES =====
export const getScheduledMessages = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('scheduled_messages').select('*').eq('user_id', userId).order('schedule_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const createScheduledMessage = async (msg: { name: string; message_content: string; bot_id?: string; schedule_at: string; schedule_type?: string; repeat_interval?: string; target_chat_id?: number }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('scheduled_messages').insert({ ...msg, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateScheduledMessage = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('scheduled_messages').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteScheduledMessage = async (id: string) => {
  const { error } = await supabase.from('scheduled_messages').delete().eq('id', id);
  if (error) throw error;
};

// ===== AFFILIATES =====
export const getAffiliates = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('affiliates').select('*, products(name)').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createAffiliate = async (aff: { product_id: string; affiliate_name: string; affiliate_email?: string; commission_percent: number; affiliate_code: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('affiliates').insert({ ...aff, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const deleteAffiliate = async (id: string) => {
  const { error } = await supabase.from('affiliates').delete().eq('id', id);
  if (error) throw error;
};

// ===== CRM CONTACTS =====
export const getCrmContacts = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('crm_contacts').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCrmContact = async (contact: { name?: string; telegram_id?: number; telegram_username?: string; phone?: string; email?: string; tags?: string[]; notes?: string; bot_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('crm_contacts').insert({ ...contact, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateCrmContact = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('crm_contacts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCrmContact = async (id: string) => {
  const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
  if (error) throw error;
};

// ===== NOTIFICATIONS =====
export const getNotifications = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createNotification = async (notif: { title: string; message: string; type?: string; trigger_event?: string; bot_id?: string; target_chat_id?: number; template?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('notifications').insert({ ...notif, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateNotification = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('notifications').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteNotification = async (id: string) => {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) throw error;
};

// ===== DELIVERIES =====
export const getDeliveries = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('deliveries').select('*, products(name)').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createDelivery = async (delivery: { name: string; delivery_type: string; content: string; product_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('deliveries').insert({ ...delivery, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const deleteDelivery = async (id: string) => {
  const { error } = await supabase.from('deliveries').delete().eq('id', id);
  if (error) throw error;
};

// ===== RECOVERY CAMPAIGNS =====
export const getRecoveryCampaigns = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('recovery_campaigns').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createRecoveryCampaign = async (campaign: { name: string; message_template: string; delay_minutes: number; max_attempts?: number; bot_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('recovery_campaigns').insert({ ...campaign, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateRecoveryCampaign = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('recovery_campaigns').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteRecoveryCampaign = async (id: string) => {
  const { error } = await supabase.from('recovery_campaigns').delete().eq('id', id);
  if (error) throw error;
};

// ===== VIP MEMBERS =====
export const getVipMembers = async () => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('vip_members').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createVipMember = async (member: { telegram_id: number; telegram_username?: string; name?: string; plan_name?: string; bot_id?: string; expires_at?: string; order_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('vip_members').insert({ ...member, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateVipMember = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('vip_members').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteVipMember = async (id: string) => {
  const { error } = await supabase.from('vip_members').delete().eq('id', id);
  if (error) throw error;
};

// ===== AUTO RESPONSES =====
export const getAutoResponses = async (botId?: string) => {
  const userId = await getUserId();
  let query = supabase.from('auto_responses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (botId) query = query.eq('bot_id', botId);
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createAutoResponse = async (resp: { trigger_keyword: string; match_type?: string; response_text: string; response_media_url?: string; bot_id?: string }) => {
  const userId = await getUserId();
  const { data, error } = await supabase.from('auto_responses').insert({ ...resp, user_id: userId }).select().single();
  if (error) throw error;
  return data;
};

export const updateAutoResponse = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase.from('auto_responses').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteAutoResponse = async (id: string) => {
  const { error } = await supabase.from('auto_responses').delete().eq('id', id);
  if (error) throw error;
};
