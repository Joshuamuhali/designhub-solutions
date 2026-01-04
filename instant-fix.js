// INSTANT FIX - Create User Right Now
// Copy this entire script and run in browser console

// Step 1: Create Supabase client with your project details
const { createClient } = window.supabase;
const supabase = createClient(
  'https://hmfobjajoydbphqwggti.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'
);

// Step 2: Create the user immediately
const createUserNow = async () => {
  try {
    console.log('🚀 Creating super admin user...');
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: 'designhubzm@gmail.com',
      password: 'admin123456',
      options: {
        emailRedirectTo: 'http://localhost:8080/login',
        data: {
          full_name: 'Super Admin',
          role: 'super_admin'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ User already exists! Trying to sign in...');
        
        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'designhubzm@gmail.com',
          password: 'admin123456'
        });
        
        if (signInError) {
          console.error('❌ Sign in failed:', signInError.message);
          console.log('🔧 Try resetting password or check email confirmation');
        } else {
          console.log('✅ Successfully signed in!');
          console.log('🎉 You can now access the dashboard');
        }
      } else {
        console.error('❌ Creation failed:', error.message);
      }
    } else {
      console.log('✅ User created successfully!');
      console.log('📧 Check your email for confirmation');
      console.log('👤 User ID:', data.user?.id);
    }
    
    console.log('');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('📧 Email: designhubzm@gmail.com');
    console.log('🔑 Password: admin123456');
    console.log('🌐 Login: http://localhost:8080/login');
    
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

// Step 3: Auto-run the function
createUserNow();

console.log('✅ Script executed! Check results above.');
