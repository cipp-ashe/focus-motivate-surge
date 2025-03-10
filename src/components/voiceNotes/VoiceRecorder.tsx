
import React, { useState, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onComplete?: () => void;
  compact?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onComplete,
  compact = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addNote } = useVoiceNotes();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [transcript, setTranscript] = useState('');
  
  useEffect(() => {
    // Check if speech recognition is available
    if (typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .slice(event.resultIndex)
          .map(result => result[0].transcript)
          .join('');
        
        setTranscript(currentTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Recording error: ${event.error}. Please try again.`);
        stopRecording();
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognition) return;
    
    try {
      setTranscript('');
      setIsRecording(true);
      recognition.start();
      
      toast.success('Recording started. Speak now...');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Error starting recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recognition) return;
    
    try {
      setIsRecording(false);
      setIsProcessing(true);
      recognition.stop();
      
      if (transcript.trim()) {
        addNote(transcript.trim());
        toast.success('Voice note saved');
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast.warning('No speech detected. Note was not saved.');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Error saving note. Please try again.');
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || !recognition}
          size="icon"
          className={cn(
            "rounded-full w-10 h-10 transition-all duration-300",
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isRecording ? (
            <Square className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        {isRecording && transcript && (
          <div className="w-full mt-2 text-xs text-muted-foreground">
            {transcript.substring(0, 50)}
            {transcript.length > 50 && "..."}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || !recognition}
          size="lg"
          className={cn(
            "rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300",
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>
        {isRecording && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full animate-pulse">
            Recording...
          </div>
        )}
      </div>
      
      {isRecording && transcript && (
        <div className="w-full max-w-md bg-card p-4 rounded-lg shadow-sm mb-6 max-h-32 overflow-y-auto">
          <p className="text-foreground">{transcript}</p>
        </div>
      )}
      
      <p className="text-center text-sm text-muted-foreground mt-2 mb-4">
        {isRecording 
          ? "Tap the button again to stop recording" 
          : "Tap the microphone to start recording a voice note"}
      </p>
    </div>
  );
};

export default VoiceRecorder;
