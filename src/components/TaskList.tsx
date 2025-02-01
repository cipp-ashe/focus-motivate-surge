import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { TaskInput } from "./TaskInput";
import { TaskTable } from "./TaskTable";
import { CompletedTasks } from "./CompletedTasks";
import { EmailSummaryModal } from "./EmailSummaryModal";
import { Quote } from "@/types/timer";
import { useTaskManager } from "@/hooks/useTaskManager";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  completedTasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task) => void;
  onTasksClear: () => void;
  onSelectedTasksClear?: (taskIds: string[]) => void;
  favorites?: Quote[];
}

export const TaskList = ({
  tasks,
  completedTasks,
  onTaskAdd,
  onTaskSelect,
  onTasksClear,
  onSelectedTasksClear,
  favorites = [],
}: TaskListProps) => {
  const {
    selectedTasks,
    showEmailModal,
    setShowEmailModal,
    handleTaskClick,
    clearSelectedTasks,
    handleSendSummary,
    handleTaskDelete,
  } = useTaskManager({
    tasks,
    completedTasks,
    onTaskAdd,
    onTaskSelect,
    onTasksClear,
    onSelectedTasksClear: onSelectedTasksClear!,
    favorites,
  });

  return (
    <div className="space-y-4">
      <TaskInput onTaskAdd={onTaskAdd} />
      
      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        onTaskClick={handleTaskClick}
        onTaskDelete={handleTaskDelete}
        onTasksClear={onTasksClear}
      />
      
      <div className="flex justify-start items-center mt-4">
        <Button
          variant="outline"
          onClick={selectedTasks.length > 0 ? clearSelectedTasks : onTasksClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {selectedTasks.length > 0 ? `Clear Selected (${selectedTasks.length})` : 'Clear All'}
        </Button>
      </div>

      <CompletedTasks 
        tasks={completedTasks} 
        onSendSummary={() => setShowEmailModal(true)} 
      />

      <EmailSummaryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleSendSummary}
      />
    </div>
  );
};