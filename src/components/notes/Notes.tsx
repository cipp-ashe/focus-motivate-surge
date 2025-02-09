
import React from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import type { NotesProps } from '@/types/notes';

export const Notes: React.FC<NotesProps> = ({ hideNotes }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <NotesEditor />
      </div>

      {!hideNotes && (
        <SavedNotes />
      )}
    </div>
  );
};
