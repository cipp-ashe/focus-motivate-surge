
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/ui/useIsMobile';

interface NotesHeaderProps {
  onClearNotes: () => void;
}

export const NotesHeader = ({ onClearNotes }: NotesHeaderProps) => {
  const isMobile = useIsMobile();
  
  const handleClearNotes = () => {
    if (window.confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      onClearNotes();
      toast.success("All notes cleared 🗑️");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h2 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground`}>Saved Notes</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClearNotes}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
