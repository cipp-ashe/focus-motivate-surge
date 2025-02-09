
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { Task } from "@/types/tasks";
import { Download, FileJson, Trash2 } from "lucide-react";
import { ActionButton } from "./ui/action-button";
import { toast } from "sonner";
import { format } from "date-fns";
import { NotesDialog } from "./notes/components/NotesDialog";
import { useState } from "react";
import { TaskMetricsRow } from "./tasks/TaskMetricsRow";
import { TaskJsonDialog } from "./tasks/TaskJsonDialog";
import { downloadContent } from "@/utils/downloadUtils";
import { Tag } from "@/types/core";

interface CompletedTasksProps {
  tasks: Task[];
  onTasksClear?: () => void;
}

const downloadMarkdown = (tasks: Task[]) => {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
  const content = tasks.map(task => {
    const metrics = task.metrics || {
      expectedTime: 0,
      actualDuration: 0,
      pauseCount: 0,
      favoriteQuotes: 0,
      pausedTime: 0,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 100,
      completionStatus: 'Completed On Time',
    };

    let completionTime = 'Not recorded';
    if (metrics.endTime) {
      try {
        const date = new Date(metrics.endTime);
        if (!isNaN(date.getTime())) {
          completionTime = format(date, 'MMM d, yyyy HH:mm');
        }
      } catch (error) {
        console.warn(`Invalid date format for task ${task.name}:`, metrics.endTime);
      }
    }

    return `# ${task.name}\n\nCompleted: ${completionTime}\nExpected Time: ${metrics.expectedTime}s\nActual Time: ${metrics.actualDuration}s\nEfficiency: ${metrics.efficiencyRatio.toFixed(1)}%\nStatus: ${metrics.completionStatus}\n\n---\n\n`;
  }).join('\n');

  downloadContent(content, `completed-tasks-${timestamp}.md`, 'text/markdown');
  toast.success('Tasks downloaded as Markdown');
};

export const CompletedTasks = ({ tasks, onTasksClear }: CompletedTasksProps) => {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showJsonDialog, setShowJsonDialog] = useState(false);

  if (tasks.length === 0) return null;

  const handleClearTasks = () => {
    onTasksClear?.();
    setShowClearDialog(false);
    toast.success("Completed tasks cleared 🗑️");
  };

  const processedTasks = tasks.map(task => ({
    ...task,
    tags: [
      ...(task.tags || []),
      {
        id: 'completed-tag',
        name: 'Completed',
        color: 'green',
        createdAt: new Date().toISOString()
      } as Tag
    ]
  }));

  return (
    <div className="mt-4">
      <div className="flex flex-col space-y-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="completed-tasks" className="border-b-0">
            <div className="flex justify-between items-center bg-card rounded-lg px-4 py-2">
              <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                Completed Tasks ({tasks.length})
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <ActionButton
                  icon={Download}
                  onClick={() => downloadMarkdown(processedTasks)}
                  title="Download as Markdown"
                  className="h-6 w-6 p-0"
                />
                <ActionButton
                  icon={FileJson}
                  onClick={() => setShowJsonDialog(true)}
                  title="View JSON Data"
                  className="h-6 w-6 p-0"
                />
                <ActionButton
                  icon={Trash2}
                  onClick={() => setShowClearDialog(true)}
                  title="Clear completed tasks"
                  className="h-6 w-6 p-0"
                />
              </div>
            </div>
            <AccordionContent>
              <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Completion Time</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Metrics</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedTasks.map((task) => (
                      <TaskMetricsRow key={task.id} task={task} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <NotesDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear completed tasks?"
        description="This action cannot be undone. All completed tasks will be permanently deleted."
        actionText="Clear All"
        onAction={handleClearTasks}
        variant="destructive"
      />

      <TaskJsonDialog 
        tasks={processedTasks}
        open={showJsonDialog}
        onOpenChange={setShowJsonDialog}
      />
    </div>
  );
};
