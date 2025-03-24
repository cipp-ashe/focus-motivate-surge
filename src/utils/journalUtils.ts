
/**
 * Journal Utilities
 * 
 * Functions for working with journal entries
 */
import { JOURNAL_PROMPTS } from '@/components/habits/journal/constants';

// Get random prompts for a journal entry
export const getRandomPrompts = (count: number = 3): string[] => {
  const allPrompts = [
    ...JOURNAL_PROMPTS.reflection,
    ...JOURNAL_PROMPTS.motivation,
    ...JOURNAL_PROMPTS.general
  ];
  
  // Shuffle and select prompts
  const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Generate a default journal template
export const generateJournalTemplate = (habitName?: string): string => {
  return `## ${habitName || 'Habit'} Reflection

Write about your experience with this habit today...

## Obstacles & Solutions

What challenges did you face? How did you overcome them?

## Tomorrow's Plan

How will you improve tomorrow?
`;
};

// Create a function to extract key insights from journal text
export const extractKeyInsights = (content: string): string[] => {
  // Simple extraction based on structure - in a real app this could be more sophisticated
  const paragraphs = content.split('\n\n');
  const insights: string[] = [];
  
  paragraphs.forEach(para => {
    // Look for bullet points, lists, or sections with insights
    if (para.includes('*') || para.includes('-') || para.includes('#')) {
      // Extract the first line as an insight
      const lines = para.split('\n');
      if (lines[0].trim().length > 0) {
        insights.push(lines[0].replace(/[#\-*]/g, '').trim());
      }
    }
  });
  
  return insights.slice(0, 3); // Return top 3 insights
};
