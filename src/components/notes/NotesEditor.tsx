import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteTag } from '@/types/notes';
import { useNotesContext } from '@/contexts/notes/NotesContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Save,
  Trash,
  FileText,
  BookOpen,
  CheckSquare,
  Activity,
  Code,
  Pin,
  Archive,
  ArchiveRestore,
  Download,
  Tags,
} from 'lucide-react';
import { formatDate, downloadNoteAsMarkdown } from '@/utils/noteUtils';
import { NoteTagList } from './NoteTagList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface NotesEditorProps {
  note: Note;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({ note }) => {
  const {
    updateNote,
    deleteNote,
    selectNote,
    toggleArchiveNote,
    togglePinNote,
    addTagToNote,
    removeTagFromNote,
  } = useNotesContext();
  const { toast } = useToast();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [selectedTags, setSelectedTags] = useState<NoteTag[]>(note.tags);
  const [tagColor, setTagColor] = useState<string>('default');
  const [isMobile, setIsMobile] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setSelectedTags(note.tags);
  }, [note]);

  // Autoresize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title for your note',
        variant: 'destructive',
      });
      return;
    }

    updateNote(note.id, {
      title,
      content,
      tags: selectedTags,
    });

    toast({
      title: 'Note saved',
      description: 'Your changes have been saved',
    });
  };

  const handleDelete = () => {
    deleteNote(note.id);
    setIsDeleteDialogOpen(false);
  };

  const handleBack = () => {
    selectNote(null);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const newTag: NoteTag = {
      id: `tag-${Date.now()}`,
      name: tagInput.trim(),
      color: tagColor as any,
    };

    addTagToNote(note.id, newTag);
    setTagInput('');
    setTagColor('default');
  };

  const handleRemoveTag = (tagId: string) => {
    removeTagFromNote(note.id, tagId);
  };

  const handleChangeNoteType = (type: 'standard' | 'journal' | 'task' | 'habit' | 'markdown') => {
    updateNote(note.id, { type });

    toast({
      title: 'Note type changed',
      description: `This note is now a ${type} note`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background dark:bg-background animate-fade-in">
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack} className="md:hidden mr-2">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>

          <div>
            <h2 className="text-lg font-medium">Editor</h2>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatDate(note.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleSave} title="Save note">
            <Save className="h-5 w-5" />
            <span className="sr-only">Save</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Note type</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleChangeNoteType('standard')}>
                <FileText className="h-4 w-4 mr-2" />
                Standard Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeNoteType('journal')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Journal Entry
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeNoteType('task')}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Task Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeNoteType('habit')}>
                <Activity className="h-4 w-4 mr-2" />
                Habit Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleChangeNoteType('markdown')}>
                <Code className="h-4 w-4 mr-2" />
                Markdown Note
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Archive className="h-5 w-5" />
                <span className="sr-only">More actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => togglePinNote(note.id)}>
                <Pin className="h-4 w-4 mr-2" />
                {note.pinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleArchiveNote(note.id)}>
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
              <DropdownMenuItem onClick={() => downloadNoteAsMarkdown(note)}>
                <Download className="h-4 w-4 mr-2" />
                Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsTagDialogOpen(true)}>
                <Tags className="h-4 w-4 mr-2" />
                Manage Tags
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-medium border-0 border-b border-border rounded-none px-0 h-auto focus-visible:ring-0"
        />

        <div className="flex flex-wrap gap-1 mt-2">
          <NoteTagList tags={selectedTags} onRemove={handleRemoveTag} interactive />

          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-2 text-xs"
              onClick={() => setIsTagDialogOpen(true)}
            >
              Manage
            </Button>
          )}
        </div>

        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing here..."
          className="min-h-[300px] resize-none border-0 focus-visible:ring-0 p-0 text-base leading-relaxed"
        />
      </div>

      {isMobile && (
        <div className="border-t border-border p-3 flex justify-end space-x-2">
          <Button variant="default" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tag Management Dialog */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>Add or remove tags from this note</DialogDescription>
          </DialogHeader>

          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Tag Name</label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
            <div className="w-24">
              <label className="text-sm font-medium mb-1 block">Color</label>
              <select
                value={tagColor}
                onChange={(e) => setTagColor(e.target.value)}
                className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm"
                aria-label="Tag color"
              >
                <option value="default">Default</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="yellow">Yellow</option>
                <option value="green">Green</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="pink">Pink</option>
                <option value="teal">Teal</option>
              </select>
            </div>
            <Button type="button" onClick={handleAddTag}>
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mb-1 block">Current Tags</label>
            <div className="flex flex-wrap gap-1 min-h-[100px] border border-input rounded-md p-2">
              {selectedTags.length > 0 ? (
                <NoteTagList tags={selectedTags} onRemove={handleRemoveTag} interactive />
              ) : (
                <p className="text-sm text-muted-foreground">No tags added yet</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsTagDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
