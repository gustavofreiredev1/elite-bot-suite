import { supabase } from '@/integrations/supabase/client';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('id, user_id, bot_id, name, description, price, currency, product_type, image_url, slug, is_active, checkout_config, order_bump_product_id, upsell_product_id, delivery_type, created_at, updated_at')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) throw error;
  return data;
};

export const createProduct = async (product: {
  name: string;
  description?: string;
  price: number;
  slug: string;
  bot_id?: string;
  delivery_content?: string;
  delivery_type?: string;
  image_url?: string;
  checkout_config?: Record<string, any>;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('products')
    .insert({ ...product, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, updates: Record<string, any>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
};

export const getWallet = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error) throw error;
  return data;
};

export const getOrders = async (filters?: { status?: string; limit?: number }) => {
  let query = supabase
    .from('orders')
    .select('*, products(name, price)')
    .order('created_at', { ascending: false });

  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createOrder = async (order: {
  seller_id: string;
  product_id: string;
  amount: number;
  buyer_name?: string;
  buyer_email?: string;
  buyer_phone?: string;
  buyer_telegram_id?: number;
  payment_method?: string;
  coupon_code?: string;
}) => {
  const platformFee = order.amount * 0.05; // 5% platform fee
  const netAmount = order.amount - platformFee;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...order,
      platform_fee: platformFee,
      net_amount: netAmount,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createCoupon = async (coupon: {
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses?: number;
  product_id?: string;
  expires_at?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('coupons')
    .insert({ ...coupon, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getWithdrawals = async () => {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const requestWithdrawal = async (amount: number, pixKey: string, pixKeyType: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Use secure function to deduct balance
  const { error: walletError } = await supabase.rpc('update_wallet_balance', {
    _user_id: user.id,
    _amount: amount,
    _operation: 'withdraw',
  });
  if (walletError) throw walletError;

  const { data, error } = await supabase
    .from('withdrawals')
    .insert({
      user_id: user.id,
      amount,
      pix_key: pixKey,
      pix_key_type: pixKeyType,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const validateCoupon = async (code: string, productId?: string) => {
  const { data, error } = await supabase.rpc('validate_coupon', {
    _code: code,
    _product_id: productId || null,
  });
  if (error) throw error;
  return data as { valid: boolean; discount_type?: string; discount_value?: number; error?: string };
};
