import React from 'react';
import { Quote } from '@/types/timer/models';
import { TimerStateMetrics } from '@/types/metrics';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (email: string) => Promise<void>;
  favorites: Quote[];
  metrics: TimerStateMetrics;
}

export const EmailSummaryModal: React.FC<EmailSummaryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  favorites,
  metrics
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email Summary</DialogTitle>
          <DialogDescription>
            Send a summary of your task completion via email.
          </DialogDescription>
        </DialogHeader>
        <div>
          <p>Expected Time: {metrics.expectedTime} mins</p>
          <p>Actual Duration: {metrics.actualDuration} mins</p>
          <p>Efficiency Ratio: {metrics.efficiencyRatio}%</p>
          <p>Favorites:</p>
          <ul>
            {favorites.map(quote => (
              <li key={quote.id}>{quote.text} - {quote.author}</li>
            ))}
          </ul>
        </div>
        <input type="email" placeholder="Enter your email" />
        <Button onClick={() => onSubmit && onSubmit('example@example.com')}>Send</Button>
      </DialogContent>
    </Dialog>
  );
};
