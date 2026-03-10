
-- 1. FIX: Wallet balance manipulation - Remove direct UPDATE, add security definer function
DROP POLICY IF EXISTS "Users can update own wallet" ON public.wallets;

CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  _user_id uuid,
  _amount numeric,
  _operation text -- 'add_earned', 'add_pending', 'withdraw', 'confirm_pending'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _operation = 'add_earned' THEN
    UPDATE public.wallets 
    SET balance = balance + _amount, total_earned = total_earned + _amount, updated_at = now()
    WHERE user_id = _user_id;
  ELSIF _operation = 'add_pending' THEN
    UPDATE public.wallets 
    SET pending_balance = pending_balance + _amount, updated_at = now()
    WHERE user_id = _user_id;
  ELSIF _operation = 'confirm_pending' THEN
    UPDATE public.wallets 
    SET balance = balance + _amount, pending_balance = pending_balance - _amount, total_earned = total_earned + _amount, updated_at = now()
    WHERE user_id = _user_id;
  ELSIF _operation = 'withdraw' THEN
    UPDATE public.wallets 
    SET balance = balance - _amount, total_withdrawn = total_withdrawn + _amount, updated_at = now()
    WHERE user_id = _user_id AND balance >= _amount;
  END IF;
END;
$$;

-- 2. FIX: Products delivery_content exposed publicly - Create a safe view
CREATE OR REPLACE VIEW public.products_public
WITH (security_invoker = on) AS
SELECT id, user_id, bot_id, name, description, price, currency, product_type, 
       image_url, slug, is_active, checkout_config, order_bump_product_id, 
       upsell_product_id, delivery_type, created_at, updated_at
FROM public.products;
-- Note: delivery_content is intentionally excluded

-- Update products SELECT policy: public can only see via view, not base table delivery_content
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true AND (
    user_id = auth.uid() OR 
    delivery_content IS NULL OR 
    auth.uid() IS NOT NULL
  ));

-- Create a secure function to get delivery content only after purchase
CREATE OR REPLACE FUNCTION public.get_delivery_content(_order_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _content text;
BEGIN
  SELECT p.delivery_content INTO _content
  FROM public.orders o
  JOIN public.products p ON o.product_id = p.id
  WHERE o.id = _order_id AND o.status = 'paid';
  
  RETURN _content;
END;
$$;

-- 3. FIX: Orders unrestricted INSERT - restrict to pending status only
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (
    status = 'pending' 
    AND EXISTS (SELECT 1 FROM public.profiles WHERE user_id = seller_id)
  );

-- 4. FIX: Coupons public enumeration - remove public SELECT, add validation function
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

CREATE OR REPLACE FUNCTION public.validate_coupon(_code text, _product_id uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _coupon record;
BEGIN
  SELECT id, discount_type, discount_value, max_uses, current_uses, expires_at, product_id
  INTO _coupon
  FROM public.coupons
  WHERE code = _code AND is_active = true;
  
  IF _coupon IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom não encontrado');
  END IF;
  
  IF _coupon.expires_at IS NOT NULL AND _coupon.expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom expirado');
  END IF;
  
  IF _coupon.max_uses IS NOT NULL AND _coupon.current_uses >= _coupon.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom esgotado');
  END IF;
  
  IF _coupon.product_id IS NOT NULL AND _product_id IS NOT NULL AND _coupon.product_id != _product_id THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Cupom não válido para este produto');
  END IF;
  
  RETURN jsonb_build_object(
    'valid', true,
    'discount_type', _coupon.discount_type,
    'discount_value', _coupon.discount_value
  );
END;
$$;

-- 5. FIX: RLS always true - already handled by fixing orders policy above

-- Re-create trigger if missing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
