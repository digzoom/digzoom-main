-- Customers edit name, avatar and phone through updateMyProfile on the server.
-- Direct table UPDATE would also let them change role and is_active, which
-- are used for authorization by both RLS and the API.
REVOKE UPDATE ON TABLE public.profiles FROM PUBLIC, anon, authenticated;
