import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Task } from "./TaskList";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task, event: React.MouseEvent) => void;
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
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
              className={`cursor-pointer transition-all duration-300 ease-in-out
                hover:bg-accent/10 hover:shadow-lg hover:shadow-primary/5 hover:translate-y-[-2px]
                ${selectedTasks.includes(task.id) 
                  ? 'bg-accent/20 shadow-lg shadow-primary/10 translate-y-[-2px] border-l-2 border-l-primary' 
                  : ''
                }`}
              onClick={(e) => onTaskClick(task, e)}
            >
              <TableCell className="py-4">
                <div className="line-clamp-2">{task.name}</div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};