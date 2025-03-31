
import React from 'react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import { PageHeader } from '@/components/ui/page-header';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Journal: React.FC = () => {
  // Log component rendering for debugging
  console.log('Journal page rendering');

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <PageHeader
        title="Journal"
        description="Record your thoughts, ideas, and reflections"
        icon={Pencil}
      />
      
      <GlassCard className="shadow-sm">
        <GlassCardContent>
          <h2 className="text-xl font-semibold mb-4">Daily Journal</h2>
          <p className="text-muted-foreground mb-4">
            Record your thoughts, ideas, and reflections here.
          </p>
          
          <textarea 
            className="w-full h-64 p-4 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start writing your journal entry..."
          />
          
          <div className="mt-4 flex justify-end">
            <Button>
              Save Entry
            </Button>
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};

export default Journal;
