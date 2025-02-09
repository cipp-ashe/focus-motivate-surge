
import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';
import { NotesPagination } from './NotesPagination';
import { downloadAllNotes } from '@/utils/downloadUtils';
import type { Note } from '@/hooks/useNotes';

interface NotesListHeaderProps {
  notes: Note[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onClearClick: () => void;
  compact?: boolean;
}

export const NotesListHeader = ({
  notes,
  currentPage,
  totalPages,
  onPageChange,
  onClearClick,
  compact = false
}: NotesListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-medium text-muted-foreground">Recent Notes</h3>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Download}
            onClick={() => downloadAllNotes(notes)}
            className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
          />
          <ActionButton
            icon={Trash2}
            onClick={onClearClick}
            className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
          />
        </div>
        <NotesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          compact={compact}
        />
      </div>
    </div>
  );
};
