-- IMMEDIATE FIX - Force User Profile Creation
-- Run this in Supabase SQL Editor NOW

-- Step 1: Get the user ID from auth.users
DO $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM auth.users WHERE email = 'joshuamuhali95@gmail.com' LIMIT 1;
    
    IF user_id IS NOT NULL THEN
        -- Step 2: Delete any existing profile to avoid conflicts
        DELETE FROM users WHERE email = 'joshuamuhali95@gmail.com';
        
        -- Step 3: Create the user profile with super_admin role
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
        
        RAISE NOTICE 'User profile created successfully for joshuamuhali95@gmail.com';
    ELSE
        RAISE NOTICE 'User not found in auth.users table';
    END IF;
END $$;

-- Step 4: Verify the profile was created
SELECT 
    'PROFILE_CHECK' as status,
    id,
    email,
    role,
    status,
    full_name,
    created_at
FROM users 
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 5: Check auth user metadata
SELECT 
    'AUTH_USER_CHECK' as status,
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users 
WHERE email = 'joshuamuhali95@gmail.com';

-- Step 6: Update auth user metadata if needed
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email = 'joshuamuhali95@gmail.com';

-- Success message
SELECT 'IMMEDIATE_FIX_COMPLETE' as status, 
       'User profile forced to super_admin role' as message;
