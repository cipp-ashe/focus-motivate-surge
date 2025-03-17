
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, MoonStar, Sun, User, PaintBucket, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useDataInitialization } from '@/hooks/data/useDataInitialization';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Settings = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { clearStorage } = useDataInitialization();
  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gradient-primary">Settings</h1>
      
      {/* Authentication Card */}
      <Card className="mb-8 card-hover-effect bg-card/60 backdrop-blur-md border border-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Account
          </CardTitle>
          <CardDescription>
            {isAuthenticated 
              ? "Manage your account settings" 
              : "Sign in to sync your data across devices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="space-y-3 p-4 rounded-lg bg-foreground/5">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Account ID:</span> <span className="text-xs text-muted-foreground">{user?.id}</span></p>
              <p><span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at && new Date(user.last_sign_in_at).toLocaleString()}</p>
            </div>
          ) : (
            <div className="space-y-4 p-4 rounded-lg bg-foreground/5">
              <p className="text-muted-foreground">
                You're currently using Focus Notes without an account. Your data is stored locally on this device only.
              </p>
              <p className="text-muted-foreground">
                Sign in or create an account to sync your data across devices and access from anywhere.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          {isAuthenticated ? (
            <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto">
              Sign Out
            </Button>
          ) : (
            <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow button-glow">
              <Link to="/auth" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In / Create Account
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Theme Settings */}
      <Card className="mb-8 card-hover-effect bg-card/60 backdrop-blur-md border border-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <PaintBucket className="h-5 w-5 text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the app's appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-foreground/5">
            <div className="space-y-1">
              <Label htmlFor="dark-mode" className="text-base font-medium flex items-center gap-2">
                {isDark ? <MoonStar className="h-4 w-4 text-purple-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management */}
      <Card className="mb-8 card-hover-effect bg-card/60 backdrop-blur-md border border-primary/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Data Management
          </CardTitle>
          <CardDescription>Manage your application data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-foreground/5 space-y-3">
            <div className="space-y-2">
              <h3 className="font-medium">Reset Application Data</h3>
              <p className="text-sm text-muted-foreground">
                If you're experiencing issues with the application, you can reset all data. This action cannot be undone.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-2">
                  Reset Application Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all your tasks, notes, habits, and settings. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearStorage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      {/* About Section */}
      <Card className="bg-card/60 backdrop-blur-md border border-primary/10 card-hover-effect">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            About
          </CardTitle>
          <CardDescription>Focus Notes App</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-foreground/5 space-y-3">
            <p className="text-sm font-medium">
              Version 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
              A productivity application for managing tasks, tracking time, and building habits.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
