import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Trash2, Send, Plus, List } from "lucide-react";
import { EmailSummaryModal } from "./EmailSummaryModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
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
  const [isBulkAdd, setIsBulkAdd] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulkAdd) {
      const tasks = newTaskName.split('\n').filter(task => task.trim());
      tasks.forEach(taskName => {
        if (taskName.trim()) {
          onTaskAdd({
            id: Math.random().toString(),
            name: taskName.trim(),
            completed: false,
          });
        }
      });
    } else {
      if (!newTaskName.trim()) return;
      onTaskAdd({
        id: Math.random().toString(),
        name: newTaskName.trim(),
        completed: false,
      });
    }
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
      <Card className="p-4 w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsBulkAdd(!isBulkAdd)}
              className={isBulkAdd ? "bg-accent" : ""}
            >
              {isBulkAdd ? <List className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            {isBulkAdd ? (
              <Textarea
                ref={textareaRef}
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add multiple tasks (one per line)..."
                className="flex-1 min-h-[100px] resize-y"
              />
            ) : (
              <Input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1"
              />
            )}
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="p-4 cursor-pointer hover:bg-accent/50 transition-colors h-[100px] flex items-center"
            onClick={() => onTaskSelect(task)}
          >
            <div className="line-clamp-3 w-full">
              {task.name}
            </div>
          </Card>
        ))}
      </div>

      {completedTasks.length > 0 && (
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="completed-tasks">
            <AccordionTrigger className="text-lg font-semibold">
              Completed Tasks ({completedTasks.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="p-4 bg-muted h-[100px] flex items-center">
                    <div className="line-clamp-3 w-full line-through">
                      {task.name}
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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