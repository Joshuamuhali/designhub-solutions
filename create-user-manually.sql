-- Simple user creation script for Super Admin
-- Run this manually in Supabase SQL Editor to create users

-- Example: Create a Sales Rep user
-- Replace the email and name with actual values

-- Step 1: Create user in auth (you'll get a user ID from the result)
-- This needs to be done via the Supabase Dashboard → Authentication → Users

-- Step 2: Create the profile record (run this after creating auth user)
INSERT INTO profiles (
    id, 
    email, 
    full_name, 
    role, 
    created_at, 
    updated_at
) VALUES (
    'USER_ID_FROM_AUTH', -- Replace with actual user ID from auth
    'salesrep@designhub.co.zm', -- Replace with actual email
    'Sales Representative', -- Replace with actual name
    'sales_rep', -- Role from role system
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;

-- Step 3: Verify the user was created
SELECT * FROM profiles WHERE email = 'salesrep@designhub.co.zm';
