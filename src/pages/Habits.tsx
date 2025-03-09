
import React, { useState, useEffect } from 'react';
import { useHabitState, useHabitActions } from '@/contexts/habits/HabitContext';
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
import { cn } from '@/lib/utils';
import { useHabitProgress } from '@/components/habits/hooks/useHabitProgress';
import { HabitDetail } from '@/components/habits/types';
import { relationshipManager } from '@/lib/relationshipManager';

const HabitsPage = () => {
  const { templates } = useHabitState();
  const { todaysHabits } = useTodaysHabits(templates);
  const [configOpen, setConfigOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { updateProgress, getTodayProgress } = useHabitProgress();

  // Debug to see what data we have
  useEffect(() => {
    console.log("HabitsPage - templates from context:", templates);
    console.log("HabitsPage - today's habits:", todaysHabits);
    
    // Check localStorage directly
    try {
      const storedTemplates = localStorage.getItem('habit-templates');
      console.log("HabitsPage - templates from localStorage:", storedTemplates ? JSON.parse(storedTemplates) : "none");
      
      // Also check habit progress
      const storedProgress = localStorage.getItem('habit-progress');
      console.log("HabitsPage - habit progress from localStorage:", storedProgress ? JSON.parse(storedProgress) : "none");
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, [templates, todaysHabits]);

  // Load completed habits from localStorage and relationships on initial load and whenever todaysHabits changes
  useEffect(() => {
    if (!todaysHabits.length) return;
    
    // Find habits that are already completed today based on relationships OR progress
    const completed: string[] = [];
    
    templates.forEach(template => {
      const templateId = template.templateId;
      todaysHabits.forEach(habit => {
        // Check if this habit has a related note (journal entry)
        const relatedNotes = relationshipManager.getRelatedEntities(habit.id, 'habit', 'note');
        const hasJournalEntry = relatedNotes.length > 0;
        
        // If there's a journal entry OR the progress shows completed, mark it as completed
        if (hasJournalEntry) {
          console.log(`Found related notes for habit ${habit.id}:`, relatedNotes);
          completed.push(habit.id);
          
          // Ensure the progress is updated to match the relationship
          updateProgress(habit.id, templateId, true);
        } else {
          // If no journal entry, check the stored progress
          const progress = getTodayProgress(habit.id, templateId);
          if (progress.completed) {
            completed.push(habit.id);
          }
        }
      });
    });
    
    if (completed.length > 0) {
      console.log("Found completed habits:", completed);
      setCompletedHabits(completed);
    }
  }, [todaysHabits, templates, getTodayProgress, updateProgress]);

  // Listen for events that could change completion status
  useEffect(() => {
    const handleJournalDeleted = ({ habitId }: { habitId: string }) => {
      setCompletedHabits(prev => prev.filter(id => id !== habitId));
    };
    
    const unsub = eventBus.on('habit:journal-deleted', handleJournalDeleted);
    return () => unsub();
  }, []);

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

  const handleHabitComplete = (habit: HabitDetail, templateId?: string) => {
    // If no templateId provided, find the template that contains this habit
    const actualTemplateId = templateId || templates.find(t => 
      t.habits.some(h => h.id === habit.id)
    )?.templateId;
    
    if (!actualTemplateId) {
      console.error("Could not find template for habit:", habit);
      toast.error("Error marking habit as complete");
      return;
    }

    // Check if there's an existing journal entry
    const relatedNotes = relationshipManager.getRelatedEntities(habit.id, 'habit', 'note');
    const hasJournalEntry = relatedNotes.length > 0;

    // Track locally for UI updates
    setCompletedHabits(prev => {
      if (prev.includes(habit.id)) {
        // If already completed and it's not a journal habit, mark as incomplete
        if (!hasJournalEntry && habit.metrics.type !== 'journal') {
          updateProgress(habit.id, actualTemplateId, false);
          return prev.filter(id => id !== habit.id);
        } 
        // If it's a journal habit or has a journal entry, don't allow unchecking directly
        return prev;
      } else {
        // If not completed, mark as complete
        updateProgress(habit.id, actualTemplateId, true);
        return [...prev, habit.id];
      }
    });
    
    console.log(`Marked habit ${habit.id} in template ${actualTemplateId} as complete`);
  };

  const handleAddHabitToTasks = (habit: HabitDetail) => {
    // This function would add the habit as a task
    toast.success(`Added "${habit.name}" to tasks`);
  };

  // Find template for today's habits
  const todaysHabitsTemplateId = templates.find(t => 
    t.habits.some(h => todaysHabits.some(th => th.id === h.id))
  )?.templateId;

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex items-center gap-4 mb-5">
        <Link 
          to="/"
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Habit Tracker
        </h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:justify-end gap-2 mb-4">
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
          onClick={openConfig}
        >
          <Plus className="h-3.5 w-3.5" />
          Manage Habit Templates
        </Button>
      </div>

      <div className={cn(
        "grid gap-4",
        isMobile 
          ? "grid-cols-1" 
          : todaysHabits && todaysHabits.length > 0 
            ? "grid-cols-1 lg:grid-cols-[1fr_300px]" 
            : "grid-cols-1"
      )}>
        {/* Today's Habits Card */}
        {todaysHabits && todaysHabits.length > 0 && (
          <div className={cn(
            isMobile ? 'order-first' : 'lg:order-last',
            "bg-card/50 border border-border rounded-lg shadow-sm overflow-hidden"
          )}>
            <TodaysHabitCard
              habits={todaysHabits}
              completedHabits={completedHabits}
              onHabitComplete={handleHabitComplete}
              onAddHabitToTasks={handleAddHabitToTasks}
              templateId={todaysHabitsTemplateId}
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
