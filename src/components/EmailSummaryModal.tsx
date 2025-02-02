import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { z } from "zod";

interface EmailSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

const emailSchema = z.string().email("Please enter a valid email address");

export const EmailSummaryModal = ({
  isOpen,
  onClose,
  onSubmit,
}: EmailSummaryModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email form submitted with:', email);
    
    try {
      emailSchema.parse(email);
      setIsLoading(true);
      console.log('Email validation passed, attempting to send...');
      
      await onSubmit(email);
      console.log('Email sent successfully');
      
      toast.success("Summary email sent successfully!");
      onClose();
      setEmail(""); // Reset the email input after successful submission
    } catch (error) {
      console.error("Email submission error:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        validation: error instanceof z.ZodError ? error.errors : undefined,
      });
      
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        const errorMessage = error instanceof Error ? error.message : "Failed to send email. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Daily Summary</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a summary of your day's tasks,
            metrics, and favorite quotes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Summary"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};