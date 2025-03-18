
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, MailCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/';

  // If user is already logged in, redirect to previous page or main page
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use our custom edge function for sending the magic link
      const { error } = await supabase.functions.invoke('magic-link-handler', {
        body: { 
          email, 
          redirectTo: `${window.location.origin}/auth/callback` 
        }
      });
      
      if (!error) {
        setLinkSent(true);
        toast.success('Magic link sent! Check your email');
      } else {
        toast.error(`Failed to send magic link: ${error.message}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/50 backdrop-blur-md shadow-xl">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center text-white">Focus Notes</CardTitle>
          <CardDescription className="text-center text-slate-300">
            {linkSent 
              ? "Check your email for the magic link" 
              : "Sign in to sync your data across devices"}
          </CardDescription>
        </CardHeader>
        
        {linkSent ? (
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="h-20 w-20 rounded-full bg-purple-100/10 flex items-center justify-center">
                <MailCheck className="h-10 w-10 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Check your inbox</h2>
              <p className="text-slate-300">
                We've sent a magic link to <span className="font-medium text-purple-300">{email}</span>
              </p>
              <p className="text-slate-400 text-sm">
                Click the link in the email to sign in to your account
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                onClick={() => setLinkSent(false)}
              >
                Use a different email
              </Button>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleMagicLink}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              <p className="text-sm text-slate-400">
                We'll send you a magic link to your email. Click the link to sign in - no password needed!
              </p>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending magic link...
                  </>
                ) : (
                  'Send Magic Link'
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Auth;
