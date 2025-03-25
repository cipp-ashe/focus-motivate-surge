
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, MailCheck, Laptop, CloudOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useTheme } from '@/contexts/theme/ThemeContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { user, isLocalOnly, setLocalOnly } = useAuth();
  const { isDarkMode } = useTheme();
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

  const handleContinueLocally = () => {
    setLocalOnly(true);
    toast.success('You are now using the app in local mode');
    navigate(from, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md border-slate-200 bg-white/90 dark:border-slate-700 dark:bg-slate-900/50 backdrop-blur-md shadow-xl">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-2xl font-bold text-center text-slate-800 dark:text-white">Focus Notes</CardTitle>
          <CardDescription className="text-center text-slate-600 dark:text-slate-300">
            {linkSent 
              ? "Check your email for the magic link" 
              : "Choose how you want to use the app"}
          </CardDescription>
        </CardHeader>
        
        {linkSent ? (
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
              <div className="h-20 w-20 rounded-full bg-purple-100/10 flex items-center justify-center">
                <MailCheck className="h-10 w-10 text-purple-500 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Check your inbox</h2>
              <p className="text-slate-600 dark:text-slate-300">
                We've sent a magic link to <span className="font-medium text-purple-600 dark:text-purple-300">{email}</span>
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Click the link in the email to sign in to your account
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => setLinkSent(false)}
              >
                Use a different email
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-6 pt-4">
              {/* Local-only option */}
              <div className="border rounded-md p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Laptop className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 dark:text-white">Continue without an account</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Your data will be stored locally in your browser only. You won't be able to sync across devices.
                    </p>
                    <Button 
                      className="mt-3 bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                      onClick={handleContinueLocally}
                    >
                      <CloudOff className="mr-2 h-4 w-4" />
                      Continue Locally
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-300 dark:border-slate-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or sign in to sync</span>
                </div>
              </div>
              
              {/* Sign in form */}
              <form onSubmit={handleMagicLink}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-500
                             dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  We'll send you a magic link to your email. Click the link to sign in - no password needed!
                </p>
                
                <Button 
                  type="submit" 
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
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
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default Auth;
