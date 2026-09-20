import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Role } from '@/contexts/AuthContext';

interface RequireRoleProps {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ allow, children, fallback }: RequireRoleProps) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!allow.includes(role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
