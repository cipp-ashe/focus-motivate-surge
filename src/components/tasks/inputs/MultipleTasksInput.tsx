
import React from 'react';
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MultipleTasksInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const MultipleTasksInput: React.FC<MultipleTasksInputProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <Textarea
        placeholder="Enter multiple tasks, each on a new line"
        value={value}
        onChange={onChange}
        className="flex-grow min-h-[100px] bg-background/50 border-input/50"
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-input/50"
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send size={16} className="mr-2" />
          Add All Tasks
        </Button>
      </div>
    </div>
  );
};
