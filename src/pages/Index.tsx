
import { useState } from "react";
import { TaskManager } from "@/components/tasks/TaskManager";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import { useHabitsPanel } from "@/hooks/useHabitsPanel";
import { Header } from "@/components/layout/Header";
import { HabitTaskManager } from "@/components/habits/HabitTaskManager";
import { DailySyncManager } from "@/components/tasks/DailySyncManager";
import { useDataInitialization } from "@/hooks/useDataInitialization";
import { useLocalStorageData } from "@/hooks/useLocalStorageData";
import { useRelationships } from "@/hooks/useRelationships";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isInitialized, showClearButton, clearStorage, error } = useDataInitialization();
  const { toggle: toggleNotes, close: closeNotes } = useNotesPanel();
  const { toggle: toggleHabits, close: closeHabits } = useHabitsPanel();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    lastSyncDate,
    tasks,
    initialCompletedTasks,
    favorites,
    activeTemplates,
    setActiveTemplates,
    handleTasksUpdate,
    handleLastSyncUpdate,
    handleCompletedTasksUpdate,
    handleFavoritesUpdate
  } = useLocalStorageData();

  useRelationships(setActiveTemplates);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-4 rounded-lg">
          {error ? (
            <>
              <div className="text-lg font-medium text-red-600">{error}</div>
              <div className="text-sm text-muted-foreground">
                Try clearing local storage to fix this issue
              </div>
            </>
          ) : (
            <div className="text-lg font-medium">Initializing data store...</div>
          )}
          
          {showClearButton && (
            <Button 
              variant="destructive"
              onClick={clearStorage}
              className="mt-4"
            >
              Clear Storage & Refresh
            </Button>
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
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
          activeTemplates={activeTemplates}
        />

        <DailySyncManager
          lastSyncDate={lastSyncDate}
          tasks={tasks}
          onTasksUpdate={handleTasksUpdate}
          onLastSyncUpdate={handleLastSyncUpdate}
        />

        <div className="flex-1 overflow-hidden">
          <TaskManager
            initialTasks={tasks}
            initialCompletedTasks={initialCompletedTasks}
            initialFavorites={favorites}
            onTasksUpdate={handleTasksUpdate}
            onCompletedTasksUpdate={handleCompletedTasksUpdate}
            onFavoritesChange={handleFavoritesUpdate}
            selectedTaskId={selectedTaskId}
            onTaskSelect={setSelectedTaskId}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
