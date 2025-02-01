import { Button } from "./ui/button";
import { Trash2, Send } from "lucide-react";
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
    onSelectedTasksClear,
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
      />
      
      <div className="flex justify-between items-center mt-4 mb-6">
        <Button
          variant="outline"
          onClick={selectedTasks.length > 0 ? clearSelectedTasks : onTasksClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {selectedTasks.length > 0 ? `Clear Selected (${selectedTasks.length})` : 'Clear All'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowEmailModal(true)}
          className="text-primary hover:text-primary"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Summary
        </Button>
      </div>

      <CompletedTasks tasks={completedTasks} />

      <EmailSummaryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleSendSummary}
      />
    </div>
  );
};