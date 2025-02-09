
import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, clearData?: boolean) => Promise<void>;
  type?: 'notes' | 'tasks';
}

export const EmailSummaryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  type = 'notes'
}: EmailSummaryModalProps) => {
  const [email, setEmail] = useState('');
  const [clearAfterSend, setClearAfterSend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email, clearAfterSend);
      toast.success(`Summary sent to ${email} 📧`);
      setEmail('');
      setClearAfterSend(false);
      onClose();
    } catch (error) {
      console.error('Error sending summary:', error);
      toast.error('Failed to send summary email 📧❌');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isSubmitting) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send {type} summary</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a summary of your {type}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="clear"
                checked={clearAfterSend}
                onCheckedChange={(checked) => setClearAfterSend(checked as boolean)}
              />
              <label
                htmlFor="clear"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Clear {type} after sending
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Summary'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
