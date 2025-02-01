import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Trash2, Send, Plus, List } from "lucide-react";
import { EmailSummaryModal } from "./EmailSummaryModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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

      {completedTasks.length > 0 && (
        <div className="text-sm text-muted-foreground mt-2">
          Completed Tasks: {completedTasks.length}
        </div>
      )}

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full">Active Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onTaskSelect(task)}
              >
                <TableCell className="py-4">
                  <div className="line-clamp-2">{task.name}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {completedTasks.length > 0 && (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="completed-tasks">
            <AccordionTrigger className="text-sm font-medium">
              View Completed Tasks
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableBody>
                  {completedTasks.map((task) => (
                    <TableRow key={task.id} className="bg-muted/50">
                      <TableCell className="py-3">
                        <div className="line-clamp-2 line-through text-muted-foreground">
                          {task.name}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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