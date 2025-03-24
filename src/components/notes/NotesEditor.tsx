import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note, createNote } from '@/types/notes';
import { eventManager } from '@/lib/events/EventManager';
import TagInput from './TagInput';
import NoteContent from './NoteContent';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

export default function NotesEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);
  const [titleError, setTitleError] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  // Reset title error when title changes
  useEffect(() => {
    if (title.trim() !== '') {
      setTitleError(false);
    }
  }, [title]);

  // Update editor state
  useEffect(() => {
    if (editor) {
      const updateIsEmpty = () => {
        setIsEditorEmpty(editor.isEmpty);
      };

      editor.on('update', updateIsEmpty);
      editor.on('focus', () => setIsEditorFocused(true));
      editor.on('blur', () => setIsEditorFocused(false));

      return () => {
        editor.off('update', updateIsEmpty);
        editor.off('focus');
        editor.off('blur');
      };
    }
  }, [editor]);

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  // Handle tag change
  const handleTagsChange = (newTags: { name: string; color: string }[]) => {
    setTags(newTags);
  };

  // Clear form
  const clearForm = () => {
    setTitle('');
    setContent('');
    setTags([]);
    if (editor) {
      editor.commands.clearContent();
    }
  };

  // Add note
  const addNote = () => {
    if (title.trim() === '') {
      setTitleError(true);
      return;
    }
    
    // Create a new note with proper timestamps
    const now = new Date().toISOString();
    const newNote = {
      title,
      content,
      tags: tags || [],
      createdAt: now,
      updatedAt: now
    };
    
    eventManager.emit('note:add', newNote);
    clearForm();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" className={titleError ? 'text-destructive' : ''}>
          Title {titleError && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id="title"
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          className={titleError ? 'border-destructive' : ''}
        />
        {titleError && (
          <p className="text-destructive text-sm">Title is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <div
          className={cn(
            'border rounded-md min-h-[200px] transition-colors',
            isEditorFocused
              ? 'border-primary ring-1 ring-ring'
              : isEditorEmpty
              ? 'border-input'
              : 'border-input'
          )}
        >
          <NoteContent
            content={content}
            onChange={handleContentChange}
            setEditor={setEditor}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <TagInput tags={tags} onChange={handleTagsChange} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={clearForm}>
          Clear
        </Button>
        <Button onClick={addNote}>Add Note</Button>
      </div>
    </div>
  );
}
