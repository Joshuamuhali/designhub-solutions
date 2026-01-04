import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getRouteForRole, getRoleDefinition, isValidRole } from '@/lib/roleSystem';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  full_name: string;
  created_at: string;
  last_login?: string;
}

export default function RoleBasedRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log('🔍 Fetching user profile for:', user.email);
        
        // Get profile by auth user ID (not email) - this is the correct way
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id) // Query by auth user ID
          .single();

        console.log('🔍 Profile query result:', { profile, error });

        if (error) {
          console.log('⚠️ Profile not found, checking metadata...');
          // If no profile exists, create one based on user metadata
          const userRole = user.user_metadata?.role || 'client';
          console.log('🔍 User metadata role:', userRole);
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id, // Use auth user ID
              email: user.email,
              role: userRole,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              created_at: new Date().toISOString()
            } as any) // Type assertion to bypass TypeScript strict typing
            .select()
            .single();

          console.log('🔍 Profile creation result:', { newProfile, insertError });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            // Fallback to metadata
            const fallbackProfile = {
              id: user.id,
              email: user.email || '',
              role: userRole,
              full_name: user.user_metadata?.full_name || 'User',
              created_at: new Date().toISOString()
            };
            console.log('🔍 Using fallback profile:', fallbackProfile);
            setUserProfile(fallbackProfile);
          } else {
            console.log('✅ Profile created successfully');
            setUserProfile(newProfile);
          }
        } else {
          console.log('✅ Profile found in database');
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to metadata
        const fallbackProfile = {
          id: user.id,
          email: user.email || '',
          role: user.user_metadata?.role || 'client',
          full_name: user.user_metadata?.full_name || 'User',
          created_at: new Date().toISOString()
        };
        console.log('🔍 Using fallback profile due to error:', fallbackProfile);
        setUserProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    if (!loading && userProfile) {
      // Use role system for routing
      const roleDefinition = getRoleDefinition(userProfile.role);
      const targetRoute = getRouteForRole(userProfile.role);
      
      console.log('🔍 RoleBasedRouter - Role System:');
      console.log('User Profile:', userProfile);
      console.log('User Role:', userProfile.role);
      console.log('Role Definition:', roleDefinition);
      console.log('Target Route:', targetRoute);
      console.log('Is Valid Role:', isValidRole(userProfile.role));
      
      // Navigate using role system
      navigate(targetRoute, { replace: true });
    }
  }, [loading, userProfile, navigate]);

  // Show loading state while checking user role
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  // Return null while redirecting
  return null;
}
