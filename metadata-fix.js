// METADATA ONLY FIX - Bypass database issues completely
// Run this in browser console to fix role using only auth metadata

const metadataFix = async () => {
  console.log('🔧 METADATA ONLY FIX');
  console.log('====================');
  
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
    
    console.log('✅ User:', user.email);
    console.log('🔍 Current role:', user.user_metadata?.role);
    
    // Step 2: Force update metadata
    console.log('🔄 Updating metadata to super_admin...');
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        role: 'super_admin',
        full_name: 'Joshua Muhali'
      }
    });
    
    if (updateError) {
      console.log('⚠️ Update failed, trying sign-in refresh...');
      
      // Alternative: Re-sign in to refresh metadata
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: 'Josh2284256'
      });
      
      if (signInError) {
        console.error('❌ Sign-in failed:', signInError.message);
      } else {
        console.log('✅ Sign-in refresh successful');
      }
    } else {
      console.log('✅ Metadata updated successfully');
    }
    
    // Step 3: Verify
    const { data: finalUser } = await supabase.auth.getUser();
    const finalRole = finalUser?.user?.user_metadata?.role;
    
    console.log('🎯 FINAL RESULT:');
    console.log('Role:', finalRole);
    console.log('Expected: super_admin');
    
    if (finalRole === 'super_admin') {
      console.log('✅ SUCCESS! Now refresh the page (Ctrl+F5)');
      console.log('🚀 You should be routed to Super Admin Dashboard');
    } else {
      console.log('❌ Still not fixed. Run SQL fix instead.');
    }
    
  } catch (error) {
    console.error('❌ Fix error:', error);
  }
};

// Auto-run
metadataFix();

console.log('🔧 METADATA FIX EXECUTED');
