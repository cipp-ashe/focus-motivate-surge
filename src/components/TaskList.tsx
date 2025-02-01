import { Button } from "./ui/card";
import { Trash2, Send, X } from "lucide-react";
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
      />
      
      <CompletedTasks tasks={completedTasks} />

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          {selectedTasks.length > 0 && onSelectedTasksClear ? (
            <Button
              variant="outline"
              onClick={clearSelectedTasks}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Selected ({selectedTasks.length})
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onTasksClear}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowEmailModal(true)}
          className="text-primary hover:text-primary"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Summary
        </Button>
      </div>

      <EmailSummaryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleSendSummary}
      />
    </div>
  );
};