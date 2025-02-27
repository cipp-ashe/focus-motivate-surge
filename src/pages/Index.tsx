
import React from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';
import TemplateSelectionSheet from '@/components/habits/TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

// Main dashboard content that provides navigation to other sections
const MainDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-6 shadow-sm bg-card">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Focus Motivate Surge</h2>
        <p className="mb-4 text-muted-foreground">
          Your all-in-one productivity dashboard to help you stay focused, track habits, and manage your tasks.
        </p>
        
        <NavigationMenu className="max-w-full w-full justify-start my-6">
          <NavigationMenuList className="flex flex-col sm:flex-row gap-2 w-full">
            <NavigationMenuItem className="w-full sm:w-auto">
              <Link to="/habits" className={navigationMenuTriggerStyle() + " w-full justify-between"}>
                Habits
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full sm:w-auto">
              <Link to="/notes" className={navigationMenuTriggerStyle() + " w-full justify-between"}>
                Notes
              </Link>
            </NavigationMenuItem>
            {/* Add more navigation items as needed */}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      
      {/* Quick actions section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-6 shadow-sm bg-card">
          <h3 className="text-xl font-medium mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/habits">Manage Habit Templates</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/notes">View Notes</Link>
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border p-6 shadow-sm bg-card">
          <h3 className="text-xl font-medium mb-3">Recent Activity</h3>
          <p className="text-muted-foreground">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

// This component has been causing issues on the index page - separate the configurations
const HabitsSection = () => {
  const { templates } = useHabitState();
  const { open } = useHabitsPanel();
  const [configOpen, setConfigOpen] = React.useState(false);

  // Function to open config sheet directly
  const openConfig = () => {
    console.log("Opening config sheet directly");
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    console.log("Config sheet state change:", open);
    setConfigOpen(open);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    console.log("Template selected:", templateId);
    const template = habitTemplates.find(t => t.id === templateId);
    if (template) {
      toast.success(`Added template: ${template.name}`);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={open}
        >
          <Settings className="h-4 w-4" />
          Open Habit Drawer
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-2"
          onClick={openConfig}
        >
          <Settings className="h-4 w-4" />
          Configure Templates
        </Button>
      </div>

      {/* Habit drawer */}
      <HabitTracker 
        activeTemplates={templates}
      />

      {/* Template configuration (completely separate from drawer) */}
      <TemplateSelectionSheet
        isOpen={configOpen}
        onOpenChange={handleCloseConfig}
        allTemplates={habitTemplates}
        activeTemplateIds={templates.map(t => t.templateId)}
        onSelectTemplate={handleSelectTemplate}
        onCreateTemplate={() => {
          toast.info('Creating new template');
        }}
      />
    </div>
  );
};

const IndexPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      {/* Main dashboard content with navigation */}
      <MainDashboard />
      
      {/* Add the habit section */}
      <HabitsSection />
    </div>
  );
};

export default IndexPage;
