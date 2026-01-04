import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getRoleDefinition } from '@/lib/roleSystem';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  Clock, 
  FolderOpen, 
  DollarSign, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Home className="w-4 h-4" />,
    href: '/dashboard'
  },
  {
    id: 'service-requests',
    label: 'Service Requests',
    icon: <FileText className="w-4 h-4" />,
    href: '/dashboard/requests',
    badge: 0
  },
  {
    id: 'timeline',
    label: 'Project Timeline',
    icon: <Clock className="w-4 h-4" />,
    href: '/dashboard/timeline'
  },
  {
    id: 'files',
    label: 'Files & Media',
    icon: <FolderOpen className="w-4 h-4" />,
    href: '/dashboard/files'
  },
  {
    id: 'billing',
    label: 'Quotations & Invoices',
    icon: <DollarSign className="w-4 h-4" />,
    href: '/dashboard/billing'
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: <MessageSquare className="w-4 h-4" />,
    href: '/dashboard/messages',
    badge: 0
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/dashboard/analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-4 h-4" />,
    href: '/dashboard/settings'
  }
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>('client');
  const [roleTitle, setRoleTitle] = useState<string>('Client');
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      try {
        // Try to get role from profiles table first
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id) // Query by auth user ID
          .single() as any; // Type assertion to handle Supabase typing
        
        if (profile && (profile as any).role) {
          setUserRole((profile as any).role);
          const roleDef = getRoleDefinition((profile as any).role);
          setRoleTitle(roleDef.title);
        } else {
          // Fallback to metadata
          const metadataRole = user.user_metadata?.role || 'client';
          setUserRole(metadataRole);
          const roleDef = getRoleDefinition(metadataRole);
          setRoleTitle(roleDef.title);
        }
      } catch (error) {
        // Fallback to metadata
        const metadataRole = user.user_metadata?.role || 'client';
        setUserRole(metadataRole);
        const roleDef = getRoleDefinition(metadataRole);
        setRoleTitle(roleDef.title);
      }
    };

    fetchUserRole();
  }, [user]);

  const getPortalName = () => {
    switch (userRole) {
      case 'super_admin':
        return 'Super Admin Portal';
      case 'admin':
        return 'Admin Portal';
      case 'sales_head':
        return 'Sales Portal';
      case 'sales_rep':
        return 'Sales Portal';
      case 'finance':
        return 'Finance Portal';
      case 'marketing':
        return 'Marketing Portal';
      case 'support':
        return 'Support Portal';
      default:
        return 'Client Portal';
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">DesignHub</h2>
              <p className="text-xs text-gray-500">{getPortalName()}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions (when expanded) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button size="sm" className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              New Request
            </Button>
            <Button size="sm" className="w-full justify-start" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
