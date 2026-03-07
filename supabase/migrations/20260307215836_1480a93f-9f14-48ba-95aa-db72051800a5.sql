
-- Leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  email TEXT,
  telegram_id BIGINT,
  telegram_username TEXT,
  source TEXT DEFAULT 'bot',
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own leads" ON public.leads FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Broadcasts table
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT,
  target_type TEXT DEFAULT 'all',
  target_filter JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  total_sent INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own broadcasts" ON public.broadcasts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Scheduled messages
CREATE TABLE public.scheduled_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  media_url TEXT,
  target_chat_id BIGINT,
  target_type TEXT DEFAULT 'chat',
  schedule_type TEXT NOT NULL DEFAULT 'once',
  schedule_at TIMESTAMP WITH TIME ZONE NOT NULL,
  repeat_interval TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own schedules" ON public.scheduled_messages FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Affiliates
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  affiliate_name TEXT NOT NULL,
  affiliate_email TEXT,
  commission_percent NUMERIC NOT NULL DEFAULT 10,
  affiliate_code TEXT NOT NULL UNIQUE,
  total_sales INTEGER DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own affiliates" ON public.affiliates FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- CRM contacts
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT,
  telegram_id BIGINT,
  telegram_username TEXT,
  phone TEXT,
  email TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'active',
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own contacts" ON public.crm_contacts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  trigger_event TEXT,
  is_active BOOLEAN DEFAULT true,
  target_chat_id BIGINT,
  template TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Deliveries
CREATE TABLE public.deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  delivery_type TEXT NOT NULL DEFAULT 'link',
  content TEXT NOT NULL,
  total_delivered INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own deliveries" ON public.deliveries FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Recovery campaigns (cart abandonment)
CREATE TABLE public.recovery_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message_template TEXT NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 30,
  max_attempts INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  total_recovered INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.recovery_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own recovery" ON public.recovery_campaigns FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- VIP members
CREATE TABLE public.vip_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  telegram_id BIGINT NOT NULL,
  telegram_username TEXT,
  name TEXT,
  plan_name TEXT,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMP WITH TIME ZONE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.vip_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own vip members" ON public.vip_members FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Auto-response rules
CREATE TABLE public.auto_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.bots(id) ON DELETE CASCADE,
  trigger_keyword TEXT NOT NULL,
  match_type TEXT DEFAULT 'contains',
  response_text TEXT NOT NULL,
  response_media_url TEXT,
  is_active BOOLEAN DEFAULT true,
  times_triggered INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.auto_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own auto responses" ON public.auto_responses FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Fix: Create trigger for handle_new_user on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
