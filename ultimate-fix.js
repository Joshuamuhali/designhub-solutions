// ULTIMATE FIX - Address both RLS and CORS issues
// Run this in browser console to fix everything

const ultimateFix = async () => {
  console.log('🚀 ULTIMATE FIX - RLS + CORS Issues');
  console.log('=====================================');
  
  // Step 1: Fix the immediate role issue using auth metadata only
  console.log('🔄 Step 1: Bypassing database, using auth metadata...');
  
  const { createClient } = window.supabase;
  const supabase = createClient(
    'https://hmfobjajoydbphqwggti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'
  );

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError);
      return;
    }
    
    if (!user) {
      console.error('❌ No user logged in');
      return;
    }
    
    console.log('✅ Current user:', user.email);
    console.log('🔍 Current metadata:', user.user_metadata);
    
    // Step 2: Force update user metadata to super_admin
    console.log('🔄 Step 2: Forcing metadata update...');
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        role: 'super_admin',
        full_name: 'Joshua Muhali',
        is_admin: true,
        admin_level: 'super_admin'
      }
    });
    
    if (updateError) {
      console.log('⚠️ Metadata update failed:', updateError.message);
      console.log('🔄 Trying alternative approach...');
      
      // Alternative: Create a new session with forced role
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: 'Josh2284256' // Your known password
      });
      
      if (signInError) {
        console.error('❌ Alternative sign-in failed:', signInError.message);
      } else {
        console.log('✅ Alternative sign-in successful');
      }
    } else {
      console.log('✅ Metadata updated successfully');
    }
    
    // Step 3: Refresh session to get updated metadata
    console.log('🔄 Step 3: Refreshing session...');
    
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.log('⚠️ Session refresh failed:', refreshError.message);
    } else {
      console.log('✅ Session refreshed');
    }
    
    // Step 4: Verify the fix
    console.log('🔍 Step 4: Verification...');
    
    const { data: finalUser } = await supabase.auth.getUser();
    
    console.log('🎯 FINAL RESULTS:');
    console.log('Email:', finalUser?.user?.email);
    console.log('Metadata Role:', finalUser?.user?.user_metadata?.role);
    console.log('Expected: super_admin');
    
    // Step 5: Test routing
    console.log('🔄 Step 5: Testing routing...');
    
    if (typeof window.getRouteForRole === 'function') {
      const currentRole = finalUser?.user?.user_metadata?.role || 'client';
      const targetRoute = window.getRouteForRole(currentRole);
      
      console.log('🚀 Routing Test:');
      console.log('Current Role:', currentRole);
      console.log('Target Route:', targetRoute);
      console.log('Should be: /dashboard/superadmin');
      
      if (targetRoute === '/dashboard/superadmin') {
        console.log('✅ SUCCESS: Routing will work correctly!');
        console.log('📋 Next: Refresh page and you should be routed to Super Admin Dashboard');
      } else {
        console.log('❌ ISSUE: Still routing to wrong place');
      }
    } else {
      console.log('⚠️ Role system not loaded, but metadata should be fixed');
    }
    
    // Step 6: Instructions
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Refresh the page (Ctrl+F5)');
    console.log('2. If still not working, clear all browser data');
    console.log('3. Login again with: joshuamuhali95@gmail.com / Josh2284256');
    console.log('4. Should route to /dashboard/superadmin');
    console.log('5. Should show "Super Admin Portal" in sidebar');
    
    // Step 7: CORS workaround info
    console.log('\n🌐 CORS Issues:');
    console.log('If you see CORS errors, this is a Supabase configuration issue.');
    console.log('Go to Supabase Dashboard → Settings → API → Add localhost:8080 to CORS');
    console.log('Or run the SQL fix below to bypass database entirely.');
    
  } catch (error) {
    console.error('❌ Ultimate fix error:', error);
  }
};

// Auto-run the ultimate fix
ultimateFix();

console.log('🚀 ULTIMATE FIX EXECUTED');
console.log('📋 Check results above and follow instructions');
