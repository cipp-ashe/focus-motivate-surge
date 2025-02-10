
import React from 'react';
import { Notes } from '@/components/notes/Notes';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";
import { Link } from 'react-router-dom';

export default function NotesPage() {
  const { isDark, toggleTheme } = useTheme(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/"
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Timer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Notes
          </h1>
          <div className="ml-auto">
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
          <Notes />
        </div>
      </div>
    </div>
  );
}
