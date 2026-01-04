import { useAuth } from '@/contexts/AuthContext';
import RoleBasedRouter from '@/components/RoleBasedRouter';

export default function Overview() {
  const { user } = useAuth();
  
  // Return RoleBasedRouter immediately to handle role-based routing
  return <RoleBasedRouter />;
}
