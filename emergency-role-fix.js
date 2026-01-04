// EMERGENCY ROLE FIX - Force super admin role immediately
// Run this in browser console to fix the role issue

const emergencyRoleFix = async () => {
  console.log('🚨 EMERGENCY ROLE FIX');
  console.log('========================');
  
  const { createClient } = window.supabase;
  const supabase = createClient(
    'https://hmfobjajoydbphqwggti.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlc2lnbmh1Yi1zb2x1dGlvbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjAxNjY5OCwiZXhwIjoyMDkxNzQyNjk4fQ.Y7kKm8a8hF9nL3aQqJ3bH2X8wF6vZ9cT1rG7sK8'
  );

  try {
    // Step 1: Get current user
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
    console.log('🔍 Current metadata role:', user.user_metadata?.role);
    
    // Step 2: Force update auth metadata using admin API (if available)
    console.log('🔄 Step 1: Updating auth metadata...');
    
    try {
      // Try to update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          role: 'super_admin',
          full_name: 'Joshua Muhali'
        }
      });
      
      if (updateError) {
        console.log('⚠️ Could not update auth metadata:', updateError.message);
      } else {
        console.log('✅ Auth metadata updated successfully');
      }
    } catch (err) {
      console.log('⚠️ Auth metadata update failed:', err.message);
    }
    
    // Step 3: Force create database profile with service role
    console.log('🔄 Step 2: Creating database profile...');
    
    // Use service role key for admin operations
    const serviceRoleKey = 'YOUR_SERVICE_ROLE_KEY'; // You'll need to replace this
    
    const adminSupabase = createClient(
      'https://hmfobjajoydbphqwggti.supabase.co',
      serviceRoleKey
    );
    
    // Try with service role
    try {
      const { data: profile, error: insertError } = await adminSupabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          role: 'super_admin',
          status: 'active',
          full_name: 'Joshua Muhali',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (insertError) {
        console.log('⚠️ Service role insert failed:', insertError);
      } else {
        console.log('✅ Database profile created with service role:', profile);
      }
    } catch (err) {
      console.log('⚠️ Service role not available, trying regular insert...');
      
      // Fallback: Try regular insert
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: 'super_admin',
          status: 'active',
          full_name: 'Joshua Muhali',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (fallbackError) {
        console.log('❌ All database attempts failed:', fallbackError);
      } else {
        console.log('✅ Database profile created with regular role:', fallbackProfile);
      }
    }
    
    // Step 4: Force refresh user session
    console.log('🔄 Step 3: Refreshing user session...');
    
    const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.log('⚠️ Session refresh failed:', refreshError.message);
    } else {
      console.log('✅ Session refreshed');
    }
    
    // Step 5: Final verification
    console.log('🔍 Step 4: Final verification...');
    
    const { data: finalUser } = await supabase.auth.getUser();
    const { data: finalProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🎯 FINAL RESULTS:');
    console.log('Auth Role:', finalUser?.user?.user_metadata?.role);
    console.log('Database Role:', finalProfile?.role);
    console.log('Expected: super_admin');
    
    // Step 6: Instructions
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Refresh the page (Ctrl+F5)');
    console.log('2. Login again if needed');
    console.log('3. Should route to /dashboard/superadmin');
    console.log('4. Should show "Super Admin Portal" in sidebar');
    
    if (finalUser?.user?.user_metadata?.role === 'super_admin' || finalProfile?.role === 'super_admin') {
      console.log('✅ SUCCESS: Role fixed to super_admin!');
    } else {
      console.log('❌ STILL ISSUE: Role not fixed. Run SQL fix manually.');
    }
    
  } catch (error) {
    console.error('❌ Emergency fix error:', error);
  }
};

// Auto-run the emergency fix
emergencyRoleFix();

console.log('🚨 EMERGENCY ROLE FIX EXECUTED');
console.log('📋 Check results above and follow the instructions');
