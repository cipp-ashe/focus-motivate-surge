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
import { Input } from "./ui/input";
import { useState } from "react";

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
  const [durationValues, setDurationValues] = useState<Record<string, number>>({});

  const handleDurationChange = (taskId: string, value: string) => {
    // Handle MM:SS format
    if (value.includes(':')) {
      const [minutes, seconds] = value.split(':').map(v => parseInt(v) || 0);
      const totalMinutes = minutes + (seconds / 60);
      setDurationValues(prev => ({
        ...prev,
        [taskId]: totalMinutes
      }));
      return;
    }

    // Handle direct minute input
    const duration = parseInt(value) || 0;
    setDurationValues(prev => ({
      ...prev,
      [taskId]: duration
    }));
  };

  const handleDurationBlur = (taskId: string) => {
    setEditingDuration(null);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.duration = durationValues[taskId];
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
                    <Input
                      type="text"
                      placeholder="5 or 5:00"
                      value={durationValues[task.id] || task.duration || ''}
                      onChange={(e) => handleDurationChange(task.id, e.target.value)}
                      onBlur={() => handleDurationBlur(task.id)}
                      className="w-24 h-8 text-right"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
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