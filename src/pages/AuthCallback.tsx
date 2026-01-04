import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // This will automatically handle the OAuth callback
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          toast({
            title: "Email confirmed!",
            description: "Your email has been verified successfully.",
          });
          navigate('/dashboard');
        } else {
          // If no session, try to get the user from the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { data: { session: newSession }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) throw sessionError;
            
            if (newSession?.user) {
              toast({
                title: "Email confirmed!",
                description: "Your email has been verified successfully.",
              });
              navigate('/dashboard');
            }
          } else {
            throw new Error('No valid session found');
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to verify email.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Verifying your email...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>
    </div>
  );
}
