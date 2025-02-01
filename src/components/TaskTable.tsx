import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Trash2 } from "lucide-react";
import { Task } from "./TaskList";

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
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <div className="flex justify-between items-center">
                <span>Active Tasks</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTasksClear();
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>
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
              <div className="flex justify-between items-center">
                <span className="line-clamp-2">{task.name}</span>
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskDelete(task.id);
                }}
                className="ml-2 text-muted hover:text-destructive transition-colors duration-200"
                >
                <Trash2 className="h-4 w-4" />
                </button>
              </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};