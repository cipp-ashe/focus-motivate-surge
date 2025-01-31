import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Trash2, Send } from "lucide-react";
import { EmailSummaryModal } from "./EmailSummaryModal";
import { sendTaskSummaryEmail } from "../lib/supabase";
import { formatDailySummary } from "../utils/summaryFormatter";
import { TaskSummary } from "../types/summary";
import { Quote } from "../types/timer";

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
  favorites?: Quote[];
}

export const TaskList = ({
  tasks,
  completedTasks,
  onTaskAdd,
  onTaskSelect,
  onTasksClear,
  favorites = [],
}: TaskListProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    onTaskAdd({
      id: Math.random().toString(),
      name: newTaskName.trim(),
      completed: false,
    });
    setNewTaskName("");
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

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>
      </Card>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onTaskSelect(task)}
          >
            {task.name}
          </Card>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <Card key={task.id} className="p-4 bg-muted">
                {task.name}
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={onTasksClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
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

      <EmailSummaryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleSendSummary}
      />
    </div>
  );
};