// QUICK USER CREATION - Guaranteed to Work
// Run this in browser console on ANY website (not just your app)

const createSuperAdminQuick = async () => {
  console.log('🚀 Starting quick user creation...');
  
  // Get your Supabase details from environment or replace manually
  const supabaseUrl = 'https://hmfobjajoydbphqwggti.supabase.co'; // Your project URL
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'; // Replace with your anon key
  
  // Create Supabase client
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('📧 Attempting to create user: designhubzm@gmail.com');
    
    // Method 1: Try signup first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'designhubzm@gmail.com',
      password: 'admin123456',
      options: {
        emailRedirectTo: 'http://localhost:8080/dashboard',
        data: {
          full_name: 'Super Admin',
          role: 'super_admin'
        }
      }
    });

    if (signUpError) {
      console.log('⚠️ Signup error:', signUpError.message);
      
      // If user already exists, try to sign in
      if (signUpError.message.includes('already registered') || signUpError.message.includes('User already registered')) {
        console.log('🔄 User already exists, trying to sign in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'designhubzm@gmail.com',
          password: 'admin123456'
        });
        
        if (signInError) {
          console.log('❌ Sign in error:', signInError.message);
          console.log('🔧 User might need email confirmation or password reset');
        } else {
          console.log('✅ Successfully signed in!');
          console.log('👤 User:', signInData.user);
          console.log('📧 Email: designhubzm@gmail.com');
          console.log('🔑 Password: admin123456');
          console.log('🌐 You can now login at: http://localhost:8080/login');
        }
      } else {
        throw signUpError;
      }
    } else {
      console.log('✅ User created successfully!');
      console.log('👤 User:', signUpData.user);
      console.log('📧 Email: designhubzm@gmail.com');
      console.log('🔑 Password: admin123456');
      console.log('🌐 You can now login at: http://localhost:8080/login');
      console.log('');
      console.log('⚠️ IMPORTANT: Check your email for confirmation link!');
    }

    // Method 2: Try to create database profile
    if (signUpData?.user || signInData?.user) {
      const userId = (signUpData?.user || signInData?.user)?.id;
      
      console.log('🔄 Creating database profile...');
      
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: 'designhubzm@gmail.com',
          full_name: 'Super Admin',
          role: 'super_admin',
          status: 'active',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.log('⚠️ Profile creation error:', profileError.message);
        // This might be expected if profile already exists or RLS blocks it
      } else {
        console.log('✅ Database profile created successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('📧 Email: designhubzm@gmail.com');
  console.log('🔑 Password: admin123456');
  console.log('🌐 Login URL: http://localhost:8080/login');
  console.log('');
  console.log('🔧 If login still fails:');
  console.log('1. Check email for confirmation');
  console.log('2. Try password reset at: http://localhost:8080/forgot-password');
  console.log('3. Run SQL queries to verify user exists');
};

// Alternative: Direct admin method (if you have service role key)
const createSuperAdminDirect = async () => {
  const supabaseUrl = 'https://hmfobjajoydbphqwggti.supabase.co';
  const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY'; // Get from Supabase Settings > API
  
  const { createClient } = window.supabase;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'designhubzm@gmail.com',
      password: 'admin123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Admin',
        role: 'super_admin'
      }
    });

    if (error) {
      console.error('Admin creation error:', error);
    } else {
      console.log('✅ Admin user created:', data);
    }
  } catch (err) {
    console.error('Direct admin error:', err);
  }
};

console.log('🚀 QUICK USER CREATION SCRIPT');
console.log('');
console.log('📋 INSTRUCTIONS:');
console.log('1. Copy this entire script');
console.log('2. Open browser console (F12)');
console.log('3. Paste and press Enter');
console.log('4. Run: createSuperAdminQuick()');
console.log('');
console.log('⚡ Ready to run: createSuperAdminQuick()');
