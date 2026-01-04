// DEBUG ROUTING - Run this in browser console
// This will help us identify why routing isn't working

const debugRouting = async () => {
  console.log('🔍 DEBUGGING ROUTING ISSUE');
  console.log('================================');
  
  // Check if Supabase is available
  if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase not available. Make sure you run this on your app page.');
    return;
  }
  
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
      console.log('❌ No user logged in. Please login first.');
      return;
    }
    
    console.log('✅ Current user:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });
    
    // Step 2: Check database profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🔍 Database profile query:', { profile, error: profileError });
    
    if (profileError) {
      console.log('⚠️ Profile not found in database');
      
      // Step 3: Try to create profile
      const userRole = user.user_metadata?.role || 'client';
      console.log('🔍 User metadata role:', userRole);
      
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: 'super_admin', // Force super_admin for this user
          status: 'active',
          full_name: user.user_metadata?.full_name || 'Joshua Muhali',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      console.log('🔍 Profile creation result:', { newProfile, error: insertError });
      
      if (insertError) {
        console.error('❌ Could not create profile:', insertError);
      } else {
        console.log('✅ Profile created successfully:', newProfile);
      }
    } else {
      console.log('✅ Profile found in database:', profile);
      
      // Step 4: Update profile to super_admin if needed
      if (profile.role !== 'super_admin') {
        console.log('🔄 Updating profile role to super_admin...');
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('users')
          .update({ role: 'super_admin' })
          .eq('email', user.email)
          .select()
          .single();
        
        console.log('🔍 Profile update result:', { updatedProfile, error: updateError });
        
        if (updateError) {
          console.error('❌ Could not update profile:', updateError);
        } else {
          console.log('✅ Profile updated to super_admin:', updatedProfile);
        }
      }
    }
    
    // Step 5: Final verification
    const { data: finalProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    console.log('🎯 FINAL RESULT:', finalProfile);
    console.log('🚀 Expected route: /dashboard/superadmin');
    console.log('📋 Refresh the page after this script completes');
    
  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
};

// Auto-run the debug function
debugRouting();

console.log('🔧 DEBUG SCRIPT EXECUTED');
console.log('📋 Check console output above for details');
console.log('🔄 Refresh the page after script completes');
