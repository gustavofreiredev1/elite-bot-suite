
-- Fix overly permissive INSERT on orders - restrict to authenticated or service role
DROP POLICY "Anyone can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
