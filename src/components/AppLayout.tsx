
import React from 'react';
import { cn } from '@/lib/utils';
import { Notes } from './notes/Notes';
import { ArrowLeft } from 'lucide-react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { useHabitsPanel } from '@/hooks/useHabitsPanel';
import { TitleBar } from './TitleBar';
import HabitTracker from './habits/HabitTracker';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isOpen: isNotesOpen, close: handleCloseNotes } = useNotesPanel();
  const { isOpen: isHabitsOpen, close: handleCloseHabits } = useHabitsPanel();

  const handleCloseHabitsAndRefresh = () => {
    handleCloseHabits();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {window.electron && <TitleBar />}
      <div className="flex-1 flex relative">
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden z-40",
            (isNotesOpen || isHabitsOpen) ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => {
            handleCloseNotes();
            handleCloseHabitsAndRefresh();
          }}
        />

        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          (isNotesOpen || isHabitsOpen) && "lg:pr-[50%]"
        )}>
          {children}
        </div>

        {/* Notes Panel */}
        <div
          className={cn(
            "fixed top-0 right-0 h-screen w-full lg:w-1/2 bg-background border-l border-border transition-transform duration-300 ease-in-out z-50 flex flex-col",
            isNotesOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-none px-4 py-7">
              <div className="flex items-center gap-4 mb-4 sm:mb-7">
                <button 
                  onClick={handleCloseNotes}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Focus Notes
                </h1>
              </div>
            </div>

            <div className="flex-1 px-4 pb-7 overflow-hidden">
              <div className="relative bg-card/90 backdrop-blur-md shadow-lg rounded-lg p-6 h-full before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-primary/20 before:via-purple-500/20 before:to-primary/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-[7px] after:bg-card/90 after:-z-10">
                <Notes />
              </div>
            </div>
          </div>
        </div>

        {/* Habits Panel */}
        <div
          className={cn(
            "fixed top-0 right-0 h-screen w-full lg:w-1/2 bg-background border-l border-border transition-transform duration-300 ease-in-out z-50 flex flex-col",
            isHabitsOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-none px-4 py-7">
              <div className="flex items-center gap-4 mb-4 sm:mb-7">
                <button 
                  onClick={handleCloseHabitsAndRefresh}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Habit Configuration
                </h1>
              </div>
            </div>

            <div className="flex-1 px-4 pb-7 overflow-hidden">
              <div className="relative bg-card/90 backdrop-blur-md shadow-lg rounded-lg p-6 h-full before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-primary/20 before:via-purple-500/20 before:to-primary/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-[7px] after:bg-card/90 after:-z-10">
                <HabitTracker />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
