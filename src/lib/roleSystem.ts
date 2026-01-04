// ROLE SYSTEM - Complete role categorization and routing
// This defines the entire role hierarchy and routing structure

export interface RoleDefinition {
  role: string;
  title: string;
  description: string;
  category: 'admin' | 'sales' | 'finance' | 'marketing' | 'support' | 'client';
  route: string;
  component: string;
  accessLevel: number;
  permissions: string[];
}

export const ROLE_HIERARCHY: Record<string, RoleDefinition> = {
  super_admin: {
    role: 'super_admin',
    title: 'Super Admin',
    description: 'Full system access, user management, all dashboards',
    category: 'admin',
    route: '/dashboard/superadmin',
    component: 'SuperAdminDashboard',
    accessLevel: 10,
    permissions: [
      'manage_users',
      'manage_roles',
      'system_settings',
      'view_all_data',
      'manage_admins',
      'manage_sales',
      'manage_finance',
      'manage_marketing',
      'manage_support',
      'manage_clients'
    ]
  },
  admin: {
    role: 'admin',
    title: 'Administrator',
    description: 'Administrative access, limited user management',
    category: 'admin',
    route: '/dashboard/admin',
    component: 'AdminDashboard',
    accessLevel: 8,
    permissions: [
      'manage_users',
      'view_reports',
      'manage_clients',
      'manage_projects',
      'view_analytics'
    ]
  },
  sales_head: {
    role: 'sales_head',
    title: 'Sales Head',
    description: 'Sales team management, reports, analytics',
    category: 'sales',
    route: '/dashboard/sales-head',
    component: 'SalesHeadDashboard',
    accessLevel: 7,
    permissions: [
      'manage_sales_team',
      'view_sales_reports',
      'manage_leads',
      'approve_commissions',
      'sales_analytics'
    ]
  },
  sales_rep: {
    role: 'sales_rep',
    title: 'Sales Representative',
    description: 'Client management, sales tasks, commissions',
    category: 'sales',
    route: '/dashboard/sales-rep',
    component: 'SalesRepDashboard',
    accessLevel: 5,
    permissions: [
      'manage_own_clients',
      'view_own_commissions',
      'create_leads',
      'update_tasks',
      'client_communication'
    ]
  },
  finance: {
    role: 'finance',
    title: 'Finance Manager',
    description: 'Financial reports, invoices, billing',
    category: 'finance',
    route: '/dashboard/finance',
    component: 'FinanceDashboard',
    accessLevel: 6,
    permissions: [
      'manage_invoices',
      'view_financial_reports',
      'manage_billing',
      'approve_payments',
      'tax_reports'
    ]
  },
  marketing: {
    role: 'marketing',
    title: 'Marketing Manager',
    description: 'Campaigns, analytics, content management',
    category: 'marketing',
    route: '/dashboard/marketing',
    component: 'MarketingDashboard',
    accessLevel: 6,
    permissions: [
      'manage_campaigns',
      'view_marketing_analytics',
      'manage_content',
      'social_media',
      'email_marketing'
    ]
  },
  support: {
    role: 'support',
    title: 'Support Agent',
    description: 'Customer support, ticket management',
    category: 'support',
    route: '/dashboard/support',
    component: 'SupportDashboard',
    accessLevel: 5,
    permissions: [
      'manage_tickets',
      'client_support',
      'knowledge_base',
      'support_reports'
    ]
  },
  client: {
    role: 'client',
    title: 'Client',
    description: 'Standard client access to own data',
    category: 'client',
    route: '/dashboard',
    component: 'Overview',
    accessLevel: 1,
    permissions: [
      'view_own_projects',
      'view_own_invoices',
      'communicate',
      'update_profile'
    ]
  }
};

// Role categories for organization
export const ROLE_CATEGORIES = {
  admin: ['super_admin', 'admin'],
  sales: ['sales_head', 'sales_rep'],
  finance: ['finance'],
  marketing: ['marketing'],
  support: ['support'],
  client: ['client']
};

// Helper functions
export const getRoleDefinition = (role: string): RoleDefinition => {
  return ROLE_HIERARCHY[role] || ROLE_HIERARCHY.client;
};

export const getRouteForRole = (role: string): string => {
  return getRoleDefinition(role).route;
};

export const hasPermission = (userRole: string, permission: string): boolean => {
  const role = getRoleDefinition(userRole);
  return role.permissions.includes(permission);
};

export const canAccessCategory = (userRole: string, category: string): boolean => {
  const role = getRoleDefinition(userRole);
  return role.category === category || role.accessLevel >= 8; // Admins can access all
};

export const getRolesByCategory = (category: string): RoleDefinition[] => {
  return Object.values(ROLE_HIERARCHY).filter(role => role.category === category);
};

export const isValidRole = (role: string): boolean => {
  return Object.keys(ROLE_HIERARCHY).includes(role);
};

// Role hierarchy checking
export const canManageRole = (managerRole: string, targetRole: string): boolean => {
  const manager = getRoleDefinition(managerRole);
  const target = getRoleDefinition(targetRole);
  return manager.accessLevel > target.accessLevel;
};

// Get all roles a user can manage
export const getManageableRoles = (userRole: string): string[] => {
  const manager = getRoleDefinition(userRole);
  return Object.values(ROLE_HIERARCHY)
    .filter(role => manager.accessLevel > role.accessLevel)
    .map(role => role.role);
};
