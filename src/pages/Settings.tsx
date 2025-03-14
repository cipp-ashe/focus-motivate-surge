
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/theme/ThemeContext';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
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
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Account Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent>
          {user && (
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Account ID:</span> <span className="text-xs text-muted-foreground">{user.id}</span></p>
              <p><span className="font-medium">Last Sign In:</span> {user.last_sign_in_at && new Date(user.last_sign_in_at).toLocaleString()}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={signOut}>
            Sign Out
          </Button>
        </CardFooter>
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
