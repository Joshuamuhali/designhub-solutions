// TEST PROFILES SYSTEM - Complete verification
// Run this in browser console to test the fixed profiles table

const testProfilesSystem = async () => {
  console.log('🧪 TESTING PROFILES SYSTEM');
  console.log('============================');
  
  const { createClient } = window.supabase;
  const supabase = createClient(
    'https://hmfobjajoydbphqwggti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'
  );

  try {
    // Step 1: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No user logged in');
      return;
    }
    
    console.log('✅ Current User:', {
      id: user.id,
      email: user.email,
      metadata_role: user.user_metadata?.role
    });
    
    // Step 2: Test profiles table query (the correct way)
    console.log('\n🔄 Step 1: Testing profiles table query...');
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id) // Query by auth user ID
      .single();
    
    console.log('🔍 Profiles Query Result:', { profile, error: profileError });
    
    if (profileError) {
      console.log('⚠️ Profile query failed, this might be expected if profile doesn\'t exist');
      
      // Step 3: Test profile creation
      console.log('\n🔄 Step 2: Testing profile creation...');
      
      const userRole = user.user_metadata?.role || 'client';
      console.log('🔍 Using role from metadata:', userRole);
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: userRole,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      console.log('🔍 Profile Creation Result:', { newProfile, error: insertError });
      
      if (insertError) {
        console.error('❌ Profile creation failed:', insertError);
      } else {
        console.log('✅ Profile created successfully!');
      }
    } else {
      console.log('✅ Profile found in profiles table:', profile);
    }
    
    // Step 4: Final verification
    console.log('\n🔄 Step 3: Final verification...');
    
    const { data: finalProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    console.log('🎯 Final Profile:', finalProfile);
    
    if (finalProfile) {
      console.log('✅ SUCCESS: Profiles system working!');
      
      // Test role-based routing
      if (typeof window.getRouteForRole === 'function') {
        const route = window.getRouteForRole(finalProfile.role);
        console.log('🚀 Role-based routing test:');
        console.log('  Profile Role:', finalProfile.role);
        console.log('  Target Route:', route);
        console.log('  Expected: /dashboard/superadmin (for super_admin)');
        
        if (finalProfile.role === 'super_admin' && route === '/dashboard/superadmin') {
          console.log('✅ PERFECT: Routing will work correctly!');
        } else if (finalProfile.role === 'client') {
          console.log('⚠️ Role is still client, need to update to super_admin');
        } else {
          console.log('⚠️ Role routing mismatch');
        }
      }
      
      // Test sidebar role detection
      console.log('\n🎨 Sidebar should show:');
      if (finalProfile.role === 'super_admin') {
        console.log('  DesignHub');
        console.log('  Super Admin Portal');
      } else if (finalProfile.role === 'admin') {
        console.log('  DesignHub');
        console.log('  Admin Portal');
      } else {
        console.log('  DesignHub');
        console.log('  Client Portal');
      }
    }
    
    // Step 5: Instructions
    console.log('\n📋 NEXT STEPS:');
    if (finalProfile?.role === 'super_admin') {
      console.log('✅ All good! Refresh page (Ctrl+F5) and test routing');
    } else {
      console.log('⚠️ Need to fix role. Run SQL fix or update manually');
      console.log('🔧 Run fix-profiles-schema.sql in Supabase SQL Editor');
    }
    
    console.log('\n🎯 Expected Results:');
    console.log('- Profile query: No 406/400 errors');
    console.log('- Profile role: super_admin');
    console.log('- Route: /dashboard/superadmin');
    console.log('- Sidebar: "Super Admin Portal"');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Auto-run test
testProfilesSystem();

console.log('🧪 PROFILES SYSTEM TEST EXECUTED');
console.log('📋 Check results above for complete analysis');
