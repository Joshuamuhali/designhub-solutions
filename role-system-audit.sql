-- ROLE SYSTEM AUDIT AND FIX
-- Complete role categorization and routing structure

-- Step 1: Check current role structure
SELECT 
    'CURRENT_ROLES' as audit_type,
    role,
    COUNT(*) as user_count,
    status
FROM users 
GROUP BY role, status
ORDER BY role;

-- Step 2: Define proper role hierarchy and categories
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'super_admin' as role,
    'System Administrator' as title,
    'Full system access, user management, all dashboards' as description,
    'admin' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'admin' as role,
    'Administrator' as title,
    'Administrative access, limited user management' as description,
    'admin' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'sales_head' as role,
    'Sales Head' as title,
    'Sales team management, reports, analytics' as description,
    'sales' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'sales_rep' as role,
    'Sales Representative' as title,
    'Client management, sales tasks, commissions' as description,
    'sales' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'finance' as role,
    'Finance Manager' as title,
    'Financial reports, invoices, billing' as description,
    'finance' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'marketing' as role,
    'Marketing Manager' as title,
    'Campaigns, analytics, content management' as description,
    'marketing' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'support' as role,
    'Support Agent' as title,
    'Customer support, ticket management' as description,
    'support' as category
UNION ALL
SELECT 
    'ROLE_HIERARCHY' as audit_type,
    'client' as role,
    'Client' as title,
    'Standard client access to own data' as description,
    'client' as category;

-- Step 3: Create role mapping table for routing
CREATE TABLE IF NOT EXISTS role_routes (
    role TEXT PRIMARY KEY,
    route TEXT NOT NULL,
    dashboard_component TEXT NOT NULL,
    category TEXT NOT NULL,
    access_level INTEGER DEFAULT 1
);

-- Insert proper role mappings
INSERT INTO role_routes (role, route, dashboard_component, category, access_level) VALUES
    ('super_admin', '/dashboard/superadmin', 'SuperAdminDashboard', 'admin', 10),
    ('admin', '/dashboard/admin', 'AdminDashboard', 'admin', 8),
    ('sales_head', '/dashboard/sales-head', 'SalesHeadDashboard', 'sales', 7),
    ('sales_rep', '/dashboard/sales-rep', 'SalesRepDashboard', 'sales', 5),
    ('finance', '/dashboard/finance', 'FinanceDashboard', 'finance', 6),
    ('marketing', '/dashboard/marketing', 'MarketingDashboard', 'marketing', 6),
    ('support', '/dashboard/support', 'SupportDashboard', 'support', 5),
    ('client', '/dashboard', 'Overview', 'client', 1)
ON CONFLICT (role) DO UPDATE SET
    route = EXCLUDED.route,
    dashboard_component = EXCLUDED.dashboard_component,
    category = EXCLUDED.category,
    access_level = EXCLUDED.access_level;

-- Step 4: Fix existing user roles
UPDATE users 
SET role = 'super_admin'
WHERE email = 'joshuamuhali95@gmail.com';

UPDATE users 
SET role = 'super_admin'
WHERE email = 'designhubzm@gmail.com';

-- Step 5: Update auth metadata to match database roles
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com');

-- Step 6: Verify role mappings
SELECT 
    'ROLE_MAPPINGS' as audit_type,
    rr.role,
    rr.route,
    rr.dashboard_component,
    rr.category,
    rr.access_level,
    u.email as current_user,
    u.status
FROM role_routes rr
LEFT JOIN users u ON rr.role = u.role
WHERE u.email IS NOT NULL
ORDER BY rr.access_level DESC;

-- Step 7: Create function for role-based routing
CREATE OR REPLACE FUNCTION get_user_route(user_email TEXT)
RETURNS TABLE(route TEXT, dashboard_component TEXT, category TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rr.route,
        rr.dashboard_component,
        rr.category
    FROM users u
    JOIN role_routes rr ON u.role = rr.role
    WHERE u.email = user_email
    AND u.status = 'active'
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Test the routing function
SELECT 
    'ROUTING_TEST' as audit_type,
    email,
    role,
    (SELECT route FROM get_user_route(email)) as assigned_route
FROM users
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com')
ORDER BY email;

-- Success message
SELECT 'ROLE_SYSTEM_FIXED' as status, 
       'Complete role hierarchy and routing system established' as message;
