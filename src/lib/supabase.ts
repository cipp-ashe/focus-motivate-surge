
import { createClient } from '@supabase/supabase-js';
import type { Note } from '@/types/notes';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const sendNotesSummaryEmail = async (email: string, notes: Note[], clearNotes = false) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: {
        email,
        notes,
        clearNotes,
        type: 'notes'
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error sending notes summary:', error);
    toast.error('Failed to send summary email');
    throw error;
  }
};
