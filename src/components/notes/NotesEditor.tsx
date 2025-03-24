
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/types/notes';
import { toast } from 'sonner';
import { noteStorage } from '@/lib/storage/noteStorage';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface NotesEditorProps {
  noteId?: string;
  initialNote?: Note;
  onSave?: (note: Note) => void;
  onCancel?: () => void;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({
  noteId,
  initialNote,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Populate form with initial note data if provided
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setTags(initialNote.tags || []);
    } else if (noteId) {
      // Fetch note by ID if not provided but ID is available
      const note = noteStorage.getNoteById(noteId);
      if (note) {
        setTitle(note.title || '');
        setContent(note.content || '');
        setTags(note.tags || []);
      }
    }
  }, [initialNote, noteId]);
  
  // Add a tag
  const addTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, tags]);
  
  // Handle Enter key in tag input
  const handleTagKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);
  
  // Remove a tag
  const removeTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags]);
  
  // Save the note
  const handleSave = useCallback(() => {
    if (!title.trim()) {
      toast.error('Please enter a title for the note');
      return;
    }
    
    try {
      const noteData: Note = {
        id: noteId || uuidv4(),
        title: title.trim(),
        content: content.trim(),
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // If updating an existing note, preserve creation date
      if (noteId) {
        const existingNote = noteStorage.getNoteById(noteId);
        if (existingNote) {
          noteData.createdAt = existingNote.createdAt;
        }
      }
      
      // Save the note
      noteStorage.saveNote(noteData);
      
      // Call onSave callback if provided
      if (onSave) {
        onSave(noteData);
      }
      
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  }, [title, content, tags, noteId, onSave]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{noteId ? 'Edit Note' : 'Create New Note'}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            placeholder="Start typing your note here..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              id="tags"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Note
        </Button>
      </CardFooter>
    </Card>
  );
};
