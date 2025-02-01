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
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
}: TaskTableProps) => {
  return (
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
              className={`group cursor-pointer transition-all duration-300 ease-in-out
                hover:bg-accent/10 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-[1px]
                ${selectedTasks.includes(task.id) 
                  ? 'bg-accent/20 shadow-lg shadow-primary/10 -translate-y-[1px] border-l-2 border-l-primary' 
                  : ''
                }`}
              onClick={(e) => onTaskClick(task, e)}
            >
              <TableCell className="py-4">
                <div className="flex justify-between items-center">
                  <div className="line-clamp-2">{task.name}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskDelete(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-destructive"
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