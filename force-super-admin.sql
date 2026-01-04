-- FORCE SUPER ADMIN ROLE - Immediate fix
-- Run this in Supabase SQL Editor RIGHT NOW

-- Step 1: Delete any existing profile to avoid conflicts
DELETE FROM users WHERE email = 'joshuamuhali95@gmail.com';

-- Step 2: Get the user ID from auth.users
DO $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = 'joshuamuhali95@gmail.com' LIMIT 1;
    
    IF user_id IS NOT NULL THEN
        -- Step 3: Force create the user profile with super_admin role
        INSERT INTO users (
            id, 
            email, 
            role, 
            status, 
            full_name, 
            created_at,
            last_login
        ) VALUES (
            user_id,
            'joshuamuhali95@gmail.com',
            'super_admin',
            'active',
            'Joshua Muhali',
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ User profile forced to super_admin for joshuamuhali95@gmail.com';
    ELSE
        RAISE NOTICE '❌ User not found in auth.users table';
    END IF;
END $$;

-- Step 4: Update auth user metadata to match
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 5: Verify the fix
SELECT 
    'VERIFICATION' as step,
    u.id,
    u.email,
    u.role,
    u.status,
    u.full_name,
    u.created_at,
    a.raw_user_meta_data->>'role' as auth_role
FROM users u
JOIN auth.users a ON u.id = a.id
WHERE u.email = 'joshuamuhali95@gmail.com';

-- Step 6: Show all super admins for confirmation
SELECT 
    'ALL_SUPER_ADMINS' as step,
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
SELECT 'FORCE_SUPER_ADMIN_COMPLETE' as status, 
       'joshuamuhali95@gmail.com forced to super_admin role' as message;

-- Additional: Fix any other admin users
UPDATE users 
SET role = 'super_admin'
WHERE email IN ('designhubzm@gmail.com')
AND role != 'super_admin';

UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email IN ('designhubzm@gmail.com')
AND raw_user_meta_data->>'role' != 'super_admin';
