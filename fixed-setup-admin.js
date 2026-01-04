// FIXED SETUP SCRIPT - Aligned with Updated Schema
// Run this in browser console after running audit-and-fix.sql

const createSuperAdmin = async () => {
  // Replace these with your actual Supabase credentials
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // e.g., https://your-project.supabase.co
  const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Get from Supabase Settings > API
  
  // Create Supabase client with service role key
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🚀 Creating super admin user...');

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'designhubzm@gmail.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Admin',
        role: 'super_admin'
      }
    });

    if (authError) {
      // If user already exists, try to get existing user
      if (authError.message.includes('already registered')) {
        console.log('⚠️ User already exists, fetching existing user...');
        const { data: existingUser } = await supabase.auth.admin.listUsers();
        const user = existingUser.users.find(u => u.email === 'designhubzm@gmail.com');
        
        if (user) {
          console.log('✅ Found existing auth user:', user.id);
          // Create profile for existing user
          await createUserProfile(supabase, user.id);
          return;
        }
      }
      throw authError;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Step 2: Create user profile in database
    await createUserProfile(supabase, authData.user.id);

  } catch (error) {
    console.error('❌ Setup error:', error);
  }
};

const createUserProfile = async (supabase, userId) => {
  try {
    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: 'designhubzm@gmail.com',
        full_name: 'Super Admin',
        role: 'super_admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });

    if (profileError) {
      // If profile already exists, that's fine
      if (profileError.code === '23505') { // Unique violation
        console.log('✅ User profile already exists');
      } else {
        throw profileError;
      }
    } else {
      console.log('✅ User profile created:', profileData);
    }

    console.log('🎉 Super admin user setup complete!');
    console.log('📧 Email: designhubzm@gmail.com');
    console.log('🔑 Password: admin123456');
    console.log('🌐 Login at: http://localhost:8080/login');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Test login at http://localhost:8080/login');
    console.log('2. Verify dashboard loads correctly');
    console.log('3. Check all features work properly');

  } catch (error) {
    console.error('❌ Profile creation error:', error);
  }
};

// Alternative: Simple auth signup (if admin API doesn't work)
const createSuperAdminSimple = async () => {
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
  
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('🚀 Creating super admin user (simple method)...');

    // Step 1: Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'designhubzm@gmail.com',
      password: 'admin123456',
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: 'Super Admin',
          role: 'super_admin'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️ User already exists, trying to sign in...');
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email: 'designhubzm@gmail.com',
          password: 'admin123456'
        });
        
        if (signInData.user) {
          console.log('✅ User signed in successfully');
          console.log('📧 Email: designhubzm@gmail.com');
          console.log('🔑 Password: admin123456');
          console.log('🌐 Login at: http://localhost:8080/login');
          return;
        }
      }
      throw authError;
    }

    console.log('✅ Auth user created:', authData.user?.id);
    console.log('📧 Email: designhubzm@gmail.com');
    console.log('🔑 Password: admin123456');
    console.log('🌐 Login at: http://localhost:8080/login');

  } catch (error) {
    console.error('❌ Simple setup error:', error);
  }
};

// Instructions:
console.log('🔧 SETUP INSTRUCTIONS:');
console.log('');
console.log('📋 STEP 1: Run audit-and-fix.sql in Supabase SQL Editor');
console.log('📋 STEP 2: Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_SERVICE_ROLE_KEY');
console.log('📋 STEP 3: Run createSuperAdmin() in browser console');
console.log('📋 STEP 4: If that fails, try createSuperAdminSimple()');
console.log('');
console.log('🚀 Ready to run: createSuperAdmin()');
