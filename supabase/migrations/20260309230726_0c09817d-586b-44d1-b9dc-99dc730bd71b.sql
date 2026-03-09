
-- Re-attach handle_new_user trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Fix orders RLS: allow anonymous inserts for public checkout
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO public
  WITH CHECK (true);
