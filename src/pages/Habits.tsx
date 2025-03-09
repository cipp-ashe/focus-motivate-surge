
import React, { useState, useEffect } from 'react';
import { useHabitState } from '@/contexts/habits/HabitContext';
import HabitTracker from '@/components/habits/HabitTracker';
import TemplateSelectionSheet from '@/components/habits/TemplateSelectionSheet';
import { habitTemplates } from '@/utils/habitTemplates';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventBus } from '@/lib/eventBus';
import { useTodaysHabits } from '@/hooks/useTodaysHabits';
import { TodaysHabitCard } from '@/components/habits/TodaysHabitCard';
import { useIsMobile } from '@/hooks/use-mobile';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
  const [configOpen, setConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Debug to see what data we have
  useEffect(() => {
    console.log("HabitsPage - templates from context:", templates);
    console.log("HabitsPage - today's habits:", todaysHabits);
    
    // Check localStorage directly
    try {
      const storedTemplates = localStorage.getItem('habit-templates');
      console.log("HabitsPage - templates from localStorage:", storedTemplates ? JSON.parse(storedTemplates) : "none");
    } catch (error) {
      console.error("Error parsing templates from localStorage:", error);
    }
  }, [templates, todaysHabits]);

  // Load custom templates
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom-templates');
      if (saved) {
        setCustomTemplates(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  }, []);

  // Function to open config sheet
  const openConfig = () => {
    setConfigOpen(true);
  };

  // Handle closing config
  const handleCloseConfig = (open: boolean) => {
    setConfigOpen(open);
  };

  // Handle template selection
  const handleSelectTemplate = (templateId: string) => {
    // Check both built-in and custom templates
    const template = 
      habitTemplates.find(t => t.id === templateId) || 
      customTemplates.find(t => t.id === templateId);
    
    if (template) {
      console.log("Adding template:", template);
      eventBus.emit('habit:template-add', templateId);
      toast.success(`Added template: ${template.name}`);
    }
  };

  const handleHabitComplete = (habit) => {
    setCompletedHabits(prev => {
      if (prev.includes(habit.id)) {
        return prev.filter(id => id !== habit.id);
      } else {
        return [...prev, habit.id];
      }
    });
  };

  const handleAddHabitToTasks = (habit) => {
    // This function would add the habit as a task
    toast.success(`Added "${habit.name}" to tasks`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Habit Tracker
        </h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-6">
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-2 shadow-sm hover:shadow transition-all"
          onClick={openConfig}
        >
          <Plus className="h-4 w-4" />
          Manage Habit Templates
        </Button>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-[1fr_300px] gap-8'}`}>
        {/* Today's Habits Card */}
        {todaysHabits && todaysHabits.length > 0 && (
          <div className={`${isMobile ? 'order-first' : 'lg:order-last'}`}>
            <TodaysHabitCard
              habits={todaysHabits}
              completedHabits={completedHabits}
              onHabitComplete={handleHabitComplete}
              onAddHabitToTasks={handleAddHabitToTasks}
            />
          </div>
        )}

        <div className="bg-background">
          {/* Habit tracker */}
          <HabitTracker 
            activeTemplates={templates}
          />
        </div>
      </div>

      {/* Template configuration */}
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

export default HabitsPage;
