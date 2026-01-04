// TEST ROLE SYSTEM - Complete verification
// Run this in browser console to test the entire role system

const testRoleSystem = async () => {
  console.log('🧪 TESTING COMPLETE ROLE SYSTEM');
  console.log('==================================');
  
  // Check if roleSystem is available
  if (typeof window.roleSystem === 'undefined') {
    console.error('❌ Role system not loaded. Make sure you run this on your app page.');
    return;
  }
  
  const { getRoleDefinition, getRouteForRole, isValidRole } = window.roleSystem;
  
  // Test 1: Role definitions
  console.log('📋 Test 1: Role Definitions');
  const testRoles = ['super_admin', 'admin', 'sales_head', 'sales_rep', 'finance', 'marketing', 'support', 'client'];
  
  testRoles.forEach(role => {
    const definition = getRoleDefinition(role);
    const route = getRouteForRole(role);
    const valid = isValidRole(role);
    
    console.log(`✅ ${role}:`, {
      title: definition.title,
      route: route,
      category: definition.category,
      accessLevel: definition.accessLevel,
      valid: valid
    });
  });
  
  // Test 2: Current user role
  console.log('\n👤 Test 2: Current User Role');
  
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase not available');
    return;
  }
  
  const { createClient } = window.supabase;
  const supabase = createClient(
    'https://hmfobjajoydbphqwggti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'
  );
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError);
      return;
    }
    
    if (!user) {
      console.log('❌ No user logged in. Please login first.');
      return;
    }
    
    console.log('✅ Current User:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });
    
    const userRole = user.user_metadata?.role || 'client';
    const userDefinition = getRoleDefinition(userRole);
    const userRoute = getRouteForRole(userRole);
    
    console.log('🎯 User Role Analysis:', {
      role: userRole,
      definition: userDefinition,
      route: userRoute,
      shouldNavigateTo: userRoute
    });
    
    // Test 3: Database profile check
    console.log('\n🗄️ Test 3: Database Profile Check');
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🔍 Database Profile:', { profile, error: profileError });
    
    if (profileError) {
      console.log('⚠️ Profile not found, creating...');
      
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: userRole,
          status: 'active',
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      console.log('🔍 Profile Creation:', { newProfile, error: insertError });
      
      if (insertError) {
        console.error('❌ Could not create profile:', insertError);
      } else {
        console.log('✅ Profile created successfully');
      }
    } else {
      console.log('✅ Profile found:', profile);
      
      // Update role if mismatched
      if (profile.role !== userRole) {
        console.log('🔄 Updating role in database...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users')
          .update({ role: userRole })
          .eq('email', user.email)
          .select()
          .single();
        
        console.log('🔍 Profile Update:', { updatedProfile, error: updateError });
        
        if (updateError) {
          console.error('❌ Could not update profile:', updateError);
        } else {
          console.log('✅ Profile updated successfully');
        }
      }
    }
    
    // Test 4: Final verification
    console.log('\n🎯 Test 4: Final Verification');
    
    const { data: finalProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🎉 FINAL RESULT:', {
      user: {
        email: user.email,
        metadata_role: user.user_metadata?.role
      },
      database: {
        role: finalProfile?.role,
        status: finalProfile?.status
      },
      routing: {
        expected_route: getRouteForRole(userRole),
        role_definition: getRoleDefinition(userRole)
      }
    });
    
    console.log('🚀 Expected navigation:', getRouteForRole(userRole));
    console.log('📋 Refresh the page to test routing');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Auto-run the test
testRoleSystem();

console.log('🧪 ROLE SYSTEM TEST EXECUTED');
console.log('📋 Check results above for complete analysis');
