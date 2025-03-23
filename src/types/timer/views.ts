
import { MutableRefObject } from "react";

export interface TimerExpandedViewRef {
  expand: () => void;
  collapse: () => void;
  toggleExpansion: () => void;
  isExpanded: boolean;
  saveNotes?: () => void;
  notesRef?: React.RefObject<HTMLTextAreaElement>;
  handleSave?: () => void;
}
