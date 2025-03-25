import React from 'react';
import { Note } from '@/types/notes';
import { useNotesContext } from '@/contexts/notes/NotesContext';
import {
  formatRelativeDate,
  getPreviewText,
  getNoteTitleColor,
  getNoteTypeIcon,
} from '@/utils/noteUtils';
import { NoteTagList } from './NoteTagList';
import { MoreHorizontal, Pin, Archive, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  view: 'grid' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, isSelected, view }) => {
  const { selectNote, deleteNote, toggleArchiveNote, togglePinNote } = useNotesContext();

  const handleSelect = () => {
    selectNote(note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(note.id);
  };

  const handleArchiveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleArchiveNote(note.id);
  };

  const handlePinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinNote(note.id);
  };

  // Get the icon for the note type
  const IconComponent = React.useMemo(() => {
    const iconName = getNoteTypeIcon(note.type);
    // @ts-ignore - Dynamic import of Lucide icons
    return require('lucide-react')[
      iconName
        .split('-')
        .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
        .join('')
    ] as LucideIcon;
  }, [note.type]);

  return (
    <div
      className={cn(
        'group rounded-md border border-border overflow-hidden transition-all',
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-accent/50',
        note.pinned && 'border-primary/30',
        view === 'grid' ? 'p-4' : 'p-3 mb-2',
        note.archived && 'opacity-70'
      )}
      onClick={handleSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <IconComponent className={cn('h-4 w-4 mr-2', getNoteTitleColor(note.type))} />
          <h3
            className={cn(
              'font-medium text-foreground truncate',
              view === 'grid' ? 'text-base' : 'text-sm'
            )}
          >
            {note.title}
          </h3>
        </div>

        <div className="flex items-center">
          {note.pinned && <Pin className="h-3.5 w-3.5 text-primary fill-primary mr-1" />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePinToggle}>
                <Pin className="h-4 w-4 mr-2" />
                {note.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveToggle}>
                {note.archived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {view === 'grid' && (
        <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {getPreviewText(note.content)}
        </div>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        <NoteTagList tags={note.tags} />
      </div>

      <div className="text-xs text-muted-foreground mt-2">{formatRelativeDate(note.updatedAt)}</div>
    </div>
  );
};
