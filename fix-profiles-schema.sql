-- FIX PROFILES SCHEMA - Complete solution for role-based system
-- Run this in Supabase SQL Editor

-- Step 1: Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin', 'sales_head', 'sales_rep', 'finance', 'marketing', 'support')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Step 2: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy 3: Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );

-- Policy 5: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );

-- Step 4: Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Force create/update existing users
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
    COALESCE(u.raw_user_meta_data->>'role', 'client') as role,
    u.created_at,
    NOW() as updated_at
FROM auth.users u
WHERE u.email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com')
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;

-- Step 7: Force super admin role for specific users
UPDATE profiles 
SET role = 'super_admin'
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com');

-- Step 8: Update auth metadata to match
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'),
    '{role}',
    '"super_admin"'
)
WHERE email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com');

-- Step 9: Verification
SELECT 
    'VERIFICATION' as step,
    p.id,
    p.email,
    p.role,
    p.full_name,
    p.created_at,
    a.raw_user_meta_data->>'role' as auth_role
FROM profiles p
JOIN auth.users a ON p.id = a.id
WHERE p.email IN ('joshuamuhali95@gmail.com', 'designhubzm@gmail.com')
ORDER BY p.email;

-- Step 10: Show all profiles
SELECT 
    'ALL_PROFILES' as step,
    id,
    email,
    role,
    full_name,
    created_at,
    last_login
FROM profiles
ORDER BY created_at DESC;

-- Success message
SELECT 'PROFILES_SCHEMA_COMPLETE' as status, 
       'Profiles table created with RLS, triggers, and super admin users fixed' as message;
