// Simple Setup Script - Run this in browser console on any page
// This creates the super admin user using regular auth signup

const createSuperAdmin = async () => {
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
  const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
  
  // Create Supabase client
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('Creating super admin user...');
    
    // 1. Sign up the user (this creates the auth user)
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
      // If user already exists, try to sign them in
      if (authError.message.includes('already registered')) {
        console.log('User already exists, attempting to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'designhubzm@gmail.com',
          password: 'admin123456'
        });
        
        if (signInError) {
          console.error('Sign in error:', signInError);
          return;
        }
        
        console.log('✅ User signed in successfully!');
        console.log('📧 Email: designhubzm@gmail.com');
        console.log('🔑 Password: admin123456');
        console.log('🌐 You can now access the dashboard');
        return;
      }
      
      console.error('Auth error:', authError);
      return;
    }

    console.log('✅ Auth user created:', authData);

    // 2. Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email: 'designhubzm@gmail.com',
        role: 'super_admin',
        status: 'active',
        full_name: 'Super Admin',
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      // Don't return here, the auth user was created successfully
    } else {
      console.log('✅ User profile created:', profileData);
    }

    console.log('✅ Super admin user created successfully!');
    console.log('📧 Email: designhubzm@gmail.com');
    console.log('🔑 Password: admin123456');
    console.log('🌐 Login at: http://localhost:8080/login');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run the quick-setup.sql in Supabase SQL Editor');
    console.log('2. Login with the credentials above');
    console.log('3. Test the dashboard functionality');

  } catch (error) {
    console.error('Setup error:', error);
  }
};

// Instructions:
// 1. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY above
// 2. Run this script in browser console
// 3. Run createSuperAdmin()
// 4. Run the quick-setup.sql in Supabase SQL Editor

console.log('🚀 To create super admin user, run: createSuperAdmin()');
