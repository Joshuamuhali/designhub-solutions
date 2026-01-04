// TEST DASHBOARD HEADERS - Verify role-specific portal names
// Run this in browser console to test dashboard headers

const testDashboardHeaders = async () => {
  console.log('🧪 TESTING DASHBOARD HEADERS');
  console.log('===============================');
  
  // Expected portal names by role
  const expectedPortals = {
    super_admin: 'Super Admin Portal',
    admin: 'Admin Portal',
    sales_head: 'Sales Portal',
    sales_rep: 'Sales Portal',
    finance: 'Finance Portal',
    marketing: 'Marketing Portal',
    support: 'Support Portal',
    client: 'Client Portal'
  };
  
  console.log('📋 Expected Portal Names by Role:');
  Object.entries(expectedPortals).forEach(([role, portal]) => {
    console.log(`  ${role}: ${portal}`);
  });
  
  // Check current user
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase not available. Run this on your app page.');
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
      email: user.email,
      metadata_role: user.user_metadata?.role
    });
    
    const userRole = user.user_metadata?.role || 'client';
    const expectedPortal = expectedPortals[userRole];
    
    console.log('🎯 Portal Analysis:', {
      user_role: userRole,
      expected_portal: expectedPortal,
      should_see_in_sidebar: expectedPortal
    });
    
    // Check database profile
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single();
    
    console.log('🗄️ Database Profile:', profile);
    
    if (profile) {
      const dbPortal = expectedPortals[profile.role];
      console.log('🎯 Database Portal Analysis:', {
        db_role: profile.role,
        db_portal: dbPortal,
        matches_metadata: profile.role === userRole
      });
    }
    
    // Test DOM inspection
    console.log('\n🔍 DOM Inspection Test:');
    console.log('Check the sidebar header in the dashboard.');
    console.log('It should show:', expectedPortal);
    console.log('Instead of: "Client Portal"');
    
    // Manual verification instructions
    console.log('\n📋 Manual Verification Steps:');
    console.log('1. Look at the sidebar in your dashboard');
    console.log('2. Check the text under "DesignHub"');
    console.log('3. It should say:', expectedPortal);
    console.log('4. NOT "Client Portal"');
    
    console.log('\n🚀 Test Complete!');
    console.log('🔄 If still showing "Client Portal", refresh the page (Ctrl+F5)');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Auto-run the test
testDashboardHeaders();

console.log('🧪 DASHBOARD HEADER TEST EXECUTED');
console.log('📋 Check results above and verify in the dashboard');
