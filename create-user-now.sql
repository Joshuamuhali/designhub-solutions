-- CREATE SUPER ADMIN USER NOW
-- Run this in Supabase SQL Editor to create the user immediately

-- Method 1: Direct user creation (bypasses RLS)
INSERT INTO users (id, email, role, status, full_name, created_at)
VALUES 
    ('9e698f5b-deb3-48ed-b3e9-65df692e25d1', 'designhubzm@gmail.com', 'super_admin', 'active', 'Super Admin', NOW())
ON CONFLICT (email) DO NOTHING;

-- Method 2: Check if user exists
SELECT 
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
WHERE email = 'designhubzm@gmail.com';

-- Method 3: Check auth users table
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'designhubzm@gmail.com';

-- Method 4: Create auth user via SQL (if possible)
-- Note: This might not work in all Supabase versions
-- You may need to use the JavaScript method instead

-- Method 5: Create a simple test user
INSERT INTO users (id, email, role, status, full_name, created_at)
VALUES 
    (gen_random_uuid(), 'test@admin.com', 'super_admin', 'active', 'Test Admin', NOW())
ON CONFLICT (email) DO NOTHING;

-- Method 6: Show all current users
SELECT 
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
ORDER BY created_at DESC;

-- Method 7: Create the user with a different approach
-- First, let's create the user manually in auth.users if possible
-- This is a workaround for some Supabase versions

-- Success message
SELECT 'USER_CREATION_ATTEMPTED' as status, 'Check results above' as message;
