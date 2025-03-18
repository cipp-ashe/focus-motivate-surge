
import { Quote } from "@/types/timer/models";
import { Tag } from "@/types/notes";
import { quotes } from "@/data/quotes";

// Journal type templates
export interface JournalTemplate {
  title: string;
  prompts: string[];
  placeholderText: string;
  initialContent: string;
}

// Use the central quotes collection and filter by relevant categories
export const getJournalQuotes = (journalType: string): Quote[] => {
  const categoryMap: Record<string, string[]> = {
    gratitude: ['gratitude'],
    reflection: ['reflection', 'learning'],
    mindfulness: ['mindfulness', 'focus']
  };
  
  const relevantCategories = categoryMap[journalType] || ['motivation', 'growth'];
  
  return quotes.filter(quote => 
    quote.category.some(cat => 
      relevantCategories.includes(cat)
    )
  );
};

export const journalTemplates: Record<string, JournalTemplate> = {
  gratitude: {
    title: "Gratitude Journal",
    prompts: [
      "What are you grateful for today?",
      "Who made a positive impact on your day?",
      "What small joy did you experience?",
      "What challenge are you thankful for?",
      "What about your surroundings are you appreciative of?"
    ],
    placeholderText: "Write about what you're grateful for...",
    initialContent: "## Today I'm grateful for:\n\n1. \n2. \n3. \n\n## Why these matter to me:\n\n"
  },
  reflection: {
    title: "Reflection Journal",
    prompts: [
      "What went well today?",
      "What challenged you?",
      "What did you learn?",
      "What would you do differently?",
      "What are you looking forward to?"
    ],
    placeholderText: "Reflect on your day...",
    initialContent: "## Reflections:\n\n### What went well:\n\n\n### What challenged me:\n\n\n### What I learned:\n\n"
  },
  mindfulness: {
    title: "Mindfulness Journal",
    prompts: [
      "What are you noticing right now?",
      "How does your body feel?",
      "What emotions are present?",
      "What thoughts are you observing?",
      "What sensations are you aware of?"
    ],
    placeholderText: "Notice the present moment...",
    initialContent: "## Present moment awareness:\n\n### I notice:\n\n\n### I feel:\n\n\n### I observe:\n\n"
  }
};

// Standard journal tags
export const getJournalTags = (journalType: string): Tag[] => [
  { name: 'journal', color: 'default' },
  { name: journalType, color: 'default' }
];
