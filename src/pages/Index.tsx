
import { useState } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { Header } from "@/components/layout/Header";
import { HabitTaskManager } from "@/components/habits/HabitTaskManager";
import { DailySyncManager } from "@/components/tasks/DailySyncManager";
import { useDataInitialization } from "@/hooks/useDataInitialization";
import { useLocalStorageData } from "@/hooks/useLocalStorageData";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  console.log('Rendering Index component');
  
  const { isInitialized, showClearButton, clearStorage, error } = useDataInitialization();
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();
  const { tasks, updateTask } = useTaskContext();

  const {
    lastSyncDate,
    favorites,
    activeTemplates,
    setActiveTemplates,
    handleLastSyncUpdate,
    handleFavoritesUpdate
  } = useLocalStorageData();

  const handleNotesClick = () => {
    closeHabits();
    toggleNotes();
  };

  const handleHabitsClick = () => {
    closeNotes();
    toggleHabits();
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4 p-8 rounded-lg border border-border shadow-sm">
          {error ? (
            <>
              <div className="text-lg font-medium text-destructive">{error}</div>
              <div className="text-sm text-muted-foreground">
                Try clearing local storage to fix this issue
              </div>
              {showClearButton && (
                <Button 
                  variant="destructive"
                  onClick={clearStorage}
                  className="mt-4"
                >
                  Clear Storage & Refresh
                </Button>
              )}
            </>
          ) : (
            <div className="text-lg font-medium animate-pulse">
              Initializing data store...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-full flex flex-col bg-background transition-colors duration-300">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-7 w-full overflow-hidden flex flex-col">
        <Header 
          onNotesClick={handleNotesClick}
          onHabitsClick={handleHabitsClick}
        />

        <HabitTaskManager
          activeTemplates={activeTemplates}
        />

        <DailySyncManager
          lastSyncDate={lastSyncDate}
          onLastSyncUpdate={handleLastSyncUpdate}
          tasks={tasks}
          onTasksUpdate={updateTask}
        />

        <div className="flex-1 overflow-hidden">
          <TaskManager
            initialFavorites={favorites}
            onFavoritesChange={handleFavoritesUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
