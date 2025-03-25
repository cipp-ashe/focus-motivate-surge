
import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  // Log component rendering for debugging
  console.log('Settings page rendering');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 dark:text-white">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">General Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save" className="text-base font-medium dark:text-white">Auto-save</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Automatically save your progress</p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-mode" className="text-base font-medium dark:text-white">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Use a more compact UI layout</p>
                </div>
                <Switch id="compact-mode" />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Appearance Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-base font-medium dark:text-white">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Enable dark mode</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Notification Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-reminders" className="text-base font-medium dark:text-white">Task Reminders</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Get reminders for upcoming tasks</p>
                </div>
                <Switch id="task-reminders" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="habit-notifications" className="text-base font-medium dark:text-white">Habit Notifications</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Get notified about habits tracking</p>
                </div>
                <Switch id="habit-notifications" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
