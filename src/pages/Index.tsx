
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

const Index = () => {
  console.log('Mounting Index component');
  
  const { isInitialized } = useDataInitialization();
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

  console.log('Index component state:', {
    isInitialized,
    tasks: tasks.length,
    completedTasks: initialCompletedTasks.length,
    activeTemplates: activeTemplates.length
  });

  if (!isInitialized) {
    console.log('Waiting for data store initialization...');
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>;
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
