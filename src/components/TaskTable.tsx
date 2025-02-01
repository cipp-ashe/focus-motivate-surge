import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Trash2, Clock } from "lucide-react";
import { Task } from "./TaskList";
import { useState } from "react";
import { MinutesInput } from "./MinutesInput";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksClear: () => void;
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksClear,
}: TaskTableProps) => {
  const [editingDuration, setEditingDuration] = useState<string | null>(null);

  const handleDurationBlur = (taskId: string) => {
    setEditingDuration(null);
  };

  const handleDurationChange = (taskId: string, minutes: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.duration = minutes;
    }
  };

  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60%]">Active Tasks</TableHead>
            <TableHead className="w-[20%] text-right">Duration (min)</TableHead>
            <TableHead className="w-[20%] text-right">
              {tasks.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTasksClear();
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className={`cursor-pointer transition-colors duration-200
              ${selectedTasks.includes(task.id) 
                ? 'bg-accent/10' 
                : 'hover:bg-accent/5'
              }`}
              onClick={(e) => onTaskClick(task, e)}
            >
              <TableCell className="py-2">
                <span className="line-clamp-2">{task.name}</span>
              </TableCell>
              <TableCell className="py-2 text-right">
                <div 
                  className="flex items-center justify-end gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingDuration(task.id);
                  }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {editingDuration === task.id ? (
                    <div onClick={e => e.stopPropagation()} className="w-32">
                      <MinutesInput
                        minutes={task.duration || 0}
                        onMinutesChange={(minutes) => handleDurationChange(task.id, minutes)}
                        minMinutes={1}
                        maxMinutes={60}
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      {task.duration || '–'}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-2 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskDelete(task.id);
                  }}
                  className="ml-2 text-muted-foreground hover:text-destructive transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};