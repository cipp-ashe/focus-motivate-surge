
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { Link } from 'react-router-dom';
import VoiceRecorder from './VoiceRecorder';
import VoiceNotesList from './VoiceNotesList';

const VoiceNotesDashboardCard = () => {
  const { notes } = useVoiceNotes();
  
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          Voice Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-center mb-4">
          <VoiceRecorder compact={true} />
        </div>
        
        <div className="mt-4 max-h-[250px] overflow-y-auto">
          <VoiceNotesList compact={true} limit={5} />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link to="/voice-notes">View All</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VoiceNotesDashboardCard;
