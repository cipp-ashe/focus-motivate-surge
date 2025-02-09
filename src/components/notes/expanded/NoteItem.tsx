
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Download, 
  Trash2, 
  Sparkles, 
  Edit2, 
  X, 
  Tag as TagIcon 
} from 'lucide-react';
import type { Note } from '@/hooks/useNotes';

interface NoteItemProps {
  note: Note;
  onEditNote?: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
  onDownloadNote: (note: Note) => void;
}

export const NoteItem = ({
  note,
  onEditNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag,
  onDownloadNote
}: NoteItemProps) => {
  const [tagInput, setTagInput] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);

  return (
    <div className="relative p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-accent/5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-foreground truncate">
              {note.content}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {note.tags.map(tag => (
                <Badge 
                  key={tag.name} 
                  variant="secondary" 
                  className="text-xs px-1.5 h-5 bg-primary/5 hover:bg-primary/10 text-primary/80 hover:text-primary transition-colors"
                >
                  {tag.name}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer opacity-50 hover:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTag(note.id, tag.name);
                    }}
                  />
                </Badge>
              ))}
              {isEditingTags ? (
                <div className="relative">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onAddTag(note.id, tagInput);
                        setTagInput('');
                        setIsEditingTags(false);
                      } else if (e.key === 'Escape') {
                        setIsEditingTags(false);
                        setTagInput('');
                      }
                    }}
                    placeholder="Add tag..."
                    className="h-5 w-16 text-xs px-1.5"
                    autoFocus
                  />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingTags(true)}
                  className="h-5 w-5 p-0 text-primary/50 hover:text-primary"
                >
                  <TagIcon className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownloadNote(note)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          {onEditNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditNote(note)}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteNote(note.id)}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <time>{format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</time>
        {note.updatedAt && (
          <>
            <span>•</span>
            <time>Updated {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}</time>
          </>
        )}
      </div>
    </div>
  );
};
