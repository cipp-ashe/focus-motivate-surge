
import React, { useState } from 'react';
import { Mic, FileAudio } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceRecorder from '@/components/voiceNotes/VoiceRecorder';
import VoiceNotesList from '@/components/voiceNotes/VoiceNotesList';
import { ErrorBoundary } from 'react-error-boundary';
import { VoiceNotesProvider } from '@/contexts/voiceNotes/VoiceNotesContext';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/glass-card';

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-md">
    <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Voice Notes</h2>
    <p className="mb-2">There was a problem loading the voice notes component.</p>
    <details className="text-sm text-gray-700 dark:text-gray-300">
      <summary>Technical Details</summary>
      <p className="mt-1">{error.message}</p>
    </details>
  </div>
);

const VoiceNotesPage = () => {
  const [activeTab, setActiveTab] = useState("recorder");

  return (
    <VoiceNotesProvider>
      <div className="container py-6 px-4 max-w-4xl mx-auto animate-fade-in">
        <PageHeader 
          title="Voice Notes" 
          description="Record and manage voice memos and audio notes" 
          icon={FileAudio}
        />
        
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Tabs defaultValue="recorder" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="recorder" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Recorder</span>
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recorder">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="text-lg font-medium">Record Voice Note</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="pt-3">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <VoiceRecorder onComplete={() => setActiveTab("notes")} />
                  </ErrorBoundary>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="notes">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="text-lg font-medium">Your Voice Notes</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="pt-3">
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <VoiceNotesList />
                  </ErrorBoundary>
                </GlassCardContent>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </div>
    </VoiceNotesProvider>
  );
};

export default VoiceNotesPage;
