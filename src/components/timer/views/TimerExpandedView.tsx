
import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, Save, X } from "lucide-react";
import { TimerExpandedViewRef } from "@/types/timer/views";
import { Quote } from "@/types/timer";
import { QuoteDisplay } from "../quote/QuoteDisplay";

interface TimerExpandedViewProps {
  taskName: string; // Add taskName to props
  notes?: string;
  onNotesChange?: (notes: string) => void;
  onSave?: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
  quote?: Quote | null;
  onNewQuote?: () => void;
  onAddToFavorites?: (quote: Quote) => void;
  onRemoveFromFavorites?: (quoteId: string) => void;
  onLike?: () => void;
  timerCircleProps: any;
  timerControlsProps: any;
  metrics: any;
  internalMinutes: number;
  handleMinutesChange: (minutes: number) => void;
  selectedSound: any;
  onSoundChange: React.Dispatch<React.SetStateAction<any>>;
  onTestSound: () => void;
  isLoadingAudio?: boolean;
  handleCloseTimer: () => void;
  favorites: Quote[];
  setFavorites: React.Dispatch<React.SetStateAction<Quote[]>>;
}

export const TimerExpandedView = forwardRef<TimerExpandedViewRef, TimerExpandedViewProps>(
  (props, ref) => {
    const {
      taskName,
      notes = "",
      onNotesChange = () => {},
      onSave = () => {},
      onClose = () => {},
      onCollapse = () => {},
      quote = null,
      onNewQuote = () => {},
      onAddToFavorites = () => {},
      onRemoveFromFavorites = () => {},
      onLike = () => {},
    } = props;
    
    const [isExpanded, setIsExpanded] = useState(true);
    const notesRef = useRef<HTMLTextAreaElement>(null);

    const handleSave = () => {
      onSave();
    };

    const expand = () => {
      setIsExpanded(true);
    };

    const collapse = () => {
      setIsExpanded(false);
      handleSave(); // Auto-save on collapse
      onCollapse();
    };

    const toggleExpansion = () => {
      if (isExpanded) {
        collapse();
      } else {
        expand();
      }
    };

    const saveNotes = () => {
      handleSave();
    };

    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      expand,
      collapse,
      toggleExpansion,
      isExpanded,
      saveNotes,
      notesRef,
      handleSave
    }));

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">
          {taskName}
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleSave} title="Save notes" className="h-8 w-8">
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={collapse} title="Collapse view" className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close expanded view" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card/20 p-3 rounded-md mb-3">
        <QuoteDisplay
          quote={quote}
          onNewQuote={onNewQuote}
          onAddToFavorites={onAddToFavorites}
          onRemoveFromFavorites={onRemoveFromFavorites}
        />
      </div>

      <div className="flex-grow flex flex-col">
        <label htmlFor="notes" className="mb-2 text-sm font-medium">
          Notes
        </label>
        <Textarea
          ref={notesRef}
          id="notes"
          placeholder="Take notes during your timer session..."
          className="flex-grow resize-none bg-background/50 focus:bg-background/80 transition-colors"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </div>
  );
  }
);

TimerExpandedView.displayName = "TimerExpandedView";
