
import { useState } from "react";
import { Task } from "@/types/tasks";
import { ScreenshotTask } from "./ScreenshotTask";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/ui/useIsMobile";

interface ScreenshotListProps {
  tasks: Task[];
}

export const ScreenshotList: React.FC<ScreenshotListProps> = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  
  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (task.capturedText && task.capturedText.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search screenshots..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No screenshots found</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="text-primary text-sm mt-2 underline underline-offset-2"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${
          isMobile 
            ? "grid-cols-1" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {filteredTasks.map((task) => (
            <ScreenshotTask key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
