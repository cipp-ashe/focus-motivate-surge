
import React, { useState, useEffect } from 'react';
import { Notes } from '@/components/notes/Notes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";
import { NoteContextProvider } from '@/contexts/notes/hooks';

export default function NotesPage() {
  const { isDark, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('NotesPage mounted');
    
    const timer = setTimeout(() => {
      console.log('NotesPage finished loading');
      setIsLoading(false);
    }, 200);
    
    return () => {
      console.log('NotesPage unmounted');
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Notes
          </h1>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-md shadow-lg rounded-lg border border-primary/20 p-6">
          <NoteContextProvider>
            <Notes />
          </NoteContextProvider>
        </div>
      </div>
    </div>
  );
}
