// Setup script to create initial super admin user
// Run this script in your browser console when logged into Supabase

const createSuperAdmin = async () => {
  const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
  const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // Replace with your service role key
  
  // Create Supabase client
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Create super admin user in Supabase Auth
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
      console.error('Auth error:', authError);
      return;
    }

    console.log('Auth user created:', authData);

    // Create user profile in database
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'designhubzm@gmail.com',
        full_name: 'Super Admin',
        role: 'super_admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }

    console.log('User profile created:', profileData);
    console.log('✅ Super admin user created successfully!');
    console.log('📧 Email: designhubzm@gmail.com');
    console.log('🔑 Password: admin123456');
    console.log('🌐 Login at: http://localhost:8080/login');

  } catch (error) {
    console.error('Setup error:', error);
  }
};

// Instructions:
// 1. Go to your Supabase project dashboard
// 2. Open SQL Editor and run the schema.sql file first
// 3. Open browser console on any page
// 4. Paste this script and replace YOUR_SUPABASE_URL and YOUR_SUPABASE_SERVICE_ROLE_KEY
// 5. Run createSuperAdmin()
// 6. You can now login with the credentials above

console.log('🚀 To create super admin user, run: createSuperAdmin()');
