
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const Settings = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Authentication Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            {isAuthenticated 
              ? "Manage your account settings" 
              : "Sign in to sync your data across devices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Account ID:</span> <span className="text-xs text-muted-foreground">{user?.id}</span></p>
              <p><span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at && new Date(user.last_sign_in_at).toLocaleString()}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                You're currently using Focus Notes without an account. Your data is stored locally on this device only.
              </p>
              <p className="text-muted-foreground">
                Sign in or create an account to sync your data across devices and access from anywhere.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isAuthenticated ? (
            <Button variant="destructive" onClick={signOut}>
              Sign Out
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In / Create Account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Theme Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the app's appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Focus Notes App</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Version 1.0.0
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            A productivity application for managing tasks, tracking time, and building habits.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
