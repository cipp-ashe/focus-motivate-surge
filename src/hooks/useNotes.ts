
// Re-export the useNotes hook from the data folder for backward compatibility
import { useNotes as useNotesData } from './data/useNotes';

export const useNotes = useNotesData;
