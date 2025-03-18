
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the hash from the URL
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        try {
          // Try to set the session using the URL params
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setError('Failed to authenticate. Please try again.');
            toast.error('Authentication failed: ' + error.message);
            setTimeout(() => navigate('/auth'), 3000);
          } else {
            toast.success('Successfully logged in!');
            
            // Try to find the original location they were trying to access
            // This works with RequireAuth's state passing
            try {
              // This might be undefined if they went directly to auth
              const from = (location.state as any)?.from?.pathname || '/';
              navigate(from, { replace: true });
            } catch (e) {
              // If anything goes wrong with the state, just go home
              navigate('/');
            }
          }
        } catch (error) {
          console.error('Error during auth callback:', error);
          setError('Something went wrong');
          toast.error('Authentication error');
          setTimeout(() => navigate('/auth'), 3000);
        }
      } else {
        setError('Invalid authentication link');
        toast.error('Invalid authentication link');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {error ? (
        <>
          <div className="text-destructive text-lg mb-4">{error}</div>
          <div className="text-muted-foreground">Redirecting you back to sign in...</div>
        </>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg">Logging you in...</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback;
