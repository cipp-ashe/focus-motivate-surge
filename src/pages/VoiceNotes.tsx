
import React, { useState } from 'react';
import { Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceRecorder from '@/components/voiceNotes/VoiceRecorder';
import VoiceNotesList from '@/components/voiceNotes/VoiceNotesList';

const VoiceNotesPage = () => {
  const [activeTab, setActiveTab] = useState("recorder");

  return (
    <div className="container py-6 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Voice Notes</h1>
      
      <Tabs defaultValue="recorder" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="recorder" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span>Recorder</span>
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recorder">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Record Voice Note</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <VoiceRecorder onComplete={() => setActiveTab("notes")} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Your Voice Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <VoiceNotesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceNotesPage;
