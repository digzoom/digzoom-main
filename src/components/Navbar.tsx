import StoreNavigation from './StoreNavigation';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export default function Navbar() {
  const {user, isAdmin, logout} = useSupabaseAuth();
  return <StoreNavigation user={user} isAdmin={isAdmin} logout={logout} />;
}
