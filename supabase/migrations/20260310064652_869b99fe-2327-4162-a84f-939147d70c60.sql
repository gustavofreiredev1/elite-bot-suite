
-- Fix products SELECT policy - remove auth.uid() IS NOT NULL branch
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true AND (user_id = auth.uid() OR delivery_content IS NULL));

-- products_public is a view with security_invoker=on, no separate RLS needed
-- but let's drop it since we fixed the base table policy properly
DROP VIEW IF EXISTS public.products_public;
