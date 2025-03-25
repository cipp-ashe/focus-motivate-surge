
import React from 'react';
import { Card } from '@/components/ui/card';

const Journal: React.FC = () => {
  // Log component rendering for debugging
  console.log('Journal page rendering');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 dark:text-white">Journal</h1>
      
      <Card className="p-6 shadow-md bg-background dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Daily Journal</h2>
        <p className="text-muted-foreground dark:text-gray-400 mb-4">
          Record your thoughts, ideas, and reflections here.
        </p>
        
        <textarea 
          className="w-full h-64 p-4 rounded-md border border-border bg-background dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Start writing your journal entry..."
        />
        
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            Save Entry
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Journal;
