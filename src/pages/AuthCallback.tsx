
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the hash from the URL
      const hash = window.location.hash;
      
      if (hash && hash.includes('access_token')) {
        try {
          // Try to set the session using the URL params
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            toast.error('Failed to log in. Please try again.');
            navigate('/auth');
          } else {
            toast.success('Successfully logged in!');
            navigate('/');
          }
        } catch (error) {
          console.error('Error during auth callback:', error);
          toast.error('Something went wrong');
          navigate('/auth');
        }
      } else {
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-lg">Logging you in...</p>
    </div>
  );
};

export default AuthCallback;
