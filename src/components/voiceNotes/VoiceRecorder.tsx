
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceNotes } from '@/contexts/voiceNotes/VoiceNotesContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Define interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error?: { error: string };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

// Define constructor
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface VoiceRecorderProps {
  onComplete?: (text: string) => void;
  compact?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onComplete, compact = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const { addNote } = useVoiceNotes();

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== 'undefined') {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
          }
          
          if (currentTranscript) {
            setTranscript(prev => prev + currentTranscript);
          }
        };

        recognition.onerror = (event: SpeechRecognitionEvent) => {
          console.error('Speech recognition error', event.error);
          toast.error(`Error recording: ${event.error || 'Unknown error'}. Please try again.`);
          stopRecording();
        };

        recognitionRef.current = recognition;
      } else {
        toast.error('Speech recognition is not supported in your browser.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping on unmount
        }
      }
    };
  }, []);

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not available');
      return;
    }
    
    try {
      setTranscript('');
      setIsRecording(true);
      recognitionRef.current.start();
      
      if (!compact) {
        toast.success('Recording started. Speak now...');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      setIsRecording(false);
      setIsProcessing(true);
      recognitionRef.current.stop();
      
      if (transcript.trim()) {
        // Save to voice notes
        addNote(transcript.trim());
        
        // Call the onComplete callback if provided
        if (onComplete) {
          onComplete(transcript.trim());
        }
        
        if (!compact) {
          toast.success('Voice note saved');
        }
      } else {
        if (!compact) {
          toast.info('No speech detected');
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Failed to save voice note');
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  return (
    <div className={cn("flex flex-col items-center", compact ? "gap-2" : "gap-4")}>
      {/* Recording button */}
      <div className="relative">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          size={compact ? "icon" : "lg"}
          className={cn(
            compact ? "h-10 w-10" : "h-16 w-16 rounded-full",
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isProcessing ? (
            <Loader2 className={cn("animate-spin", compact ? "h-4 w-4" : "h-6 w-6")} />
          ) : isRecording ? (
            <Square className={compact ? "h-4 w-4" : "h-6 w-6"} />
          ) : (
            <Mic className={compact ? "h-4 w-4" : "h-6 w-6"} />
          )}
        </Button>
        {isRecording && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
            Recording...
          </div>
        )}
      </div>
      
      {/* Live transcript display */}
      {isRecording && transcript && !compact && (
        <div className="w-full max-w-md bg-card p-3 rounded-lg shadow-sm border border-border max-h-32 overflow-y-auto mb-2">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
      
      {/* Instruction text */}
      {!compact && (
        <p className="text-center text-sm text-muted-foreground">
          {isRecording 
            ? "Tap the button again to stop recording" 
            : "Tap the microphone to start recording"}
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;
