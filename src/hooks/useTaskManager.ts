import { useState } from "react";
import { Task } from "@/components/TaskList";
import { Quote } from "@/types/timer";
import { TaskSummary } from "@/types/summary";
import { formatDailySummary } from "@/utils/summaryFormatter";
import { sendTaskSummaryEmail } from "@/lib/supabase";

interface UseTaskManagerProps {
  tasks: Task[];
  completedTasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task) => void;
  onTasksClear: () => void;
  onSelectedTasksClear?: (taskIds: string[]) => void;
  favorites?: Quote[];
}

export const useTaskManager = ({
  tasks,
  completedTasks,
  onTaskAdd,
  onTaskSelect,
  onTasksClear,
  onSelectedTasksClear,
  favorites = [],
}: UseTaskManagerProps) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleTaskClick = (task: Task, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      setSelectedTasks(prev =>
        prev.includes(task.id)
          ? prev.filter(id => id !== task.id)
          : [...prev, task.id]
      );
    } else {
      setSelectedTasks([]);
      onTaskSelect(task);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    if (onSelectedTasksClear) {
      onSelectedTasksClear([taskId]);
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  const clearSelectedTasks = () => {
    if (onSelectedTasksClear) {
      onSelectedTasksClear(selectedTasks);
      setSelectedTasks([]);
    }
  };

  const handleSendSummary = async (email: string) => {
    const completedTaskSummaries: TaskSummary[] = completedTasks.map(task => ({
      taskName: task.name,
      completed: true,
      relatedQuotes: favorites.filter(quote => quote.task === task.name),
    }));

    const unfinishedTaskSummaries: TaskSummary[] = tasks.map(task => ({
      taskName: task.name,
      completed: false,
      relatedQuotes: favorites.filter(quote => quote.task === task.name),
    }));

    const summaryData = formatDailySummary(
      completedTaskSummaries,
      unfinishedTaskSummaries,
      favorites
    );

    await sendTaskSummaryEmail(email, summaryData);
  };

  return {
    selectedTasks,
    showEmailModal,
    setShowEmailModal,
    handleTaskClick,
    clearSelectedTasks,
    handleSendSummary,
    handleTaskDelete,
  };
};