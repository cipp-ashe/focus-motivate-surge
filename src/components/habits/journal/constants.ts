
import { Quote } from "@/types/timer/models";
import { Tag } from "@/types/notes";

// Journal type templates
export interface JournalTemplate {
  title: string;
  prompts: string[];
  placeholderText: string;
  initialContent: string;
}

// Add quotes specific to different journal types
export const journalQuotes: Record<string, Quote[]> = {
  gratitude: [
    { 
      text: "Gratitude turns what we have into enough.", 
      author: "Melody Beattie", 
      categories: ["motivation", "growth"] 
    },
    { 
      text: "Gratitude is the healthiest of all human emotions.", 
      author: "Zig Ziglar", 
      categories: ["motivation"] 
    },
    { 
      text: "When I started counting my blessings, my whole life turned around.", 
      author: "Willie Nelson", 
      categories: ["growth"] 
    },
    { 
      text: "Gratitude is not only the greatest of virtues, but the parent of all others.", 
      author: "Cicero", 
      categories: ["motivation"] 
    },
    { 
      text: "The more grateful I am, the more beauty I see.", 
      author: "Mary Davis", 
      categories: ["creativity"] 
    }
  ],
  reflection: [
    { 
      text: "The unexamined life is not worth living.", 
      author: "Socrates", 
      categories: ["learning"] 
    },
    { 
      text: "Your vision will become clear only when you can look into your own heart.", 
      author: "Carl Jung", 
      categories: ["growth"] 
    },
    { 
      text: "Life can only be understood backwards; but it must be lived forwards.", 
      author: "Søren Kierkegaard", 
      categories: ["learning"] 
    }
  ],
  mindfulness: [
    { 
      text: "The present moment is the only time over which we have dominion.", 
      author: "Thích Nhất Hạnh", 
      categories: ["focus"] 
    },
    { 
      text: "Mindfulness isn't difficult. We just need to remember to do it.", 
      author: "Sharon Salzberg", 
      categories: ["focus"] 
    }
  ]
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
