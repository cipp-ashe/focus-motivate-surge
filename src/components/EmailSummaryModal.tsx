import { TimerStateMetrics } from "@/types/metrics";
import { Quote } from "@/types/timer/models";
import { Task } from "./tasks/TaskList";

export interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks?: Task[];
  favorites: Quote[];
  metrics: TimerStateMetrics;
}

export const EmailSummaryModal: React.FC<EmailSummaryModalProps> = ({
  isOpen,
  onClose,
  tasks = [],
  favorites,
  metrics,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Summary</DialogTitle>
          <DialogDescription>
            Here’s a summary of your completed tasks and favorite quotes.
          </DialogDescription>
        </DialogHeader>
        <div>
          <h3 className="text-lg font-medium">Completed Tasks</h3>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="py-2">
                {task.name}
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-medium">Favorite Quotes</h3>
          <ul>
            {favorites.map((quote, index) => (
              <li key={index} className="py-2">
                "{quote.text}" - {quote.author}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">Metrics</h3>
          <p>Expected Time: {metrics.expectedTime} mins</p>
          <p>Actual Duration: {metrics.actualDuration} mins</p>
          <p>Efficiency Ratio: {metrics.efficiencyRatio}%</p>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
