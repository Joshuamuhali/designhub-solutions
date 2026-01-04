-- FIX USER ROUTING - Ensure User Profile Exists with Correct Role
-- Run this in Supabase SQL Editor to fix routing issues

-- Step 1: Check if the user exists in auth.users
SELECT 
    'AUTH_USERS_CHECK' as check_type,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 2: Check if the user exists in users table
SELECT 
    'USERS_TABLE_CHECK' as check_type,
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 3: Create or update the user profile with correct role
INSERT INTO users (id, email, role, status, full_name, created_at)
VALUES 
    (
        (SELECT id FROM auth.users WHERE email = 'joshuamuhali95@gmail.com' LIMIT 1),
        'joshuamuhali95@gmail.com',
        'super_admin',
        'active',
        'Joshua Muhali',
        NOW()
    )
ON CONFLICT (email) 
DO UPDATE SET 
    role = 'super_admin',
    status = 'active',
    full_name = 'Joshua Muhali',
    updated_at = NOW();

-- Step 4: Verify the fix
SELECT 
    'FINAL_CHECK' as check_type,
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 5: Update any existing users with super_admin role from metadata
UPDATE users 
SET role = 'super_admin'
WHERE email IN (
    SELECT email 
    FROM auth.users 
    WHERE raw_user_meta_data->>'role' = 'super_admin'
    OR raw_user_meta_data->>'role' = 'admin'
);

-- Step 6: Show all super admin users
SELECT 
    'ALL_SUPER_ADMINS' as check_type,
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
WHERE role = 'super_admin'
ORDER BY created_at DESC;

-- Success message
SELECT 'ROUTING_FIX_COMPLETE' as status, 
       'User profile created/updated with super_admin role' as message;
