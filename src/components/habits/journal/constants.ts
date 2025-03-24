
import { TagColor, EntityType } from '@/types/core';
import { Quote } from '@/types/timer/models';

// Journal templates with different prompts and formats
export const journalTemplates = {
  gratitude: {
    name: 'Gratitude Journal',
    description: 'Express gratitude for things in your life',
    initialContent: '## Gratitude Journal\n\nToday, I am grateful for:\n\n1. \n2. \n3. \n\n### Reflections\n\n',
    prompts: [
      'What made you smile today?',
      'Name three people who helped you recently and why you\'re grateful for them.',
      'What simple pleasure are you thankful for?',
      'What aspect of your health do you appreciate today?',
      'What opportunity are you grateful for right now?'
    ],
    tags: [
      { name: 'gratitude', color: 'green' as TagColor },
      { name: 'journal', color: 'blue' as TagColor }
    ]
  },
  
  reflection: {
    name: 'Daily Reflection',
    description: 'Reflect on your day and experiences',
    initialContent: '## Daily Reflection\n\n### Today\'s highlights:\n\n- \n\n### Challenges faced:\n\n- \n\n### What I learned:\n\n- \n\n### Tomorrow, I will:\n\n- \n',
    prompts: [
      'What was the most meaningful part of your day?',
      'What challenged you today and how did you respond?',
      'What would you do differently if you could repeat today?',
      'What progress did you make toward your goals?',
      'What did you learn about yourself today?'
    ],
    tags: [
      { name: 'reflection', color: 'purple' as TagColor },
      { name: 'journal', color: 'blue' as TagColor }
    ]
  },
  
  mindfulness: {
    name: 'Mindfulness Journal',
    description: 'Practice awareness and presence',
    initialContent: '## Mindfulness Journal\n\n### Present moment awareness:\n\nRight now, I notice...\n\n- \n\n### Body scan:\n\n- \n\n### Thoughts and emotions:\n\n- \n\n### Intention for practice:\n\n- \n',
    prompts: [
      'What sensations do you notice in your body right now?',
      'Describe your breathing without changing it.',
      'What emotions are present for you in this moment?',
      'What thoughts keep recurring today?',
      'How does your environment affect your state of mind right now?'
    ],
    tags: [
      { name: 'mindfulness', color: 'teal' as TagColor },
      { name: 'journal', color: 'blue' as TagColor }
    ]
  }
};

// Journal tags for different journal types
export const getJournalTags = (journalType: string) => {
  switch (journalType) {
    case 'gratitude':
      return [
        { name: 'gratitude', color: 'green' as TagColor },
        { name: 'journal', color: 'blue' as TagColor }
      ];
    case 'reflection':
      return [
        { name: 'reflection', color: 'purple' as TagColor },
        { name: 'journal', color: 'blue' as TagColor }
      ];
    case 'mindfulness':
      return [
        { name: 'mindfulness', color: 'teal' as TagColor },
        { name: 'journal', color: 'blue' as TagColor }
      ];
    default:
      return [
        { name: 'journal', color: 'blue' as TagColor }
      ];
  }
};

// Example quotes for different journal types - FIXED to match the Quote interface
const gratitudeQuotes: Quote[] = [
  { id: 'g1', text: 'Gratitude turns what we have into enough.', author: 'Aesop', isFavorite: false, category: 'gratitude' },
  { id: 'g2', text: 'Gratitude is the fairest blossom that springs from the soul.', author: 'Henry Ward Beecher', isFavorite: false, category: 'gratitude' },
  { id: 'g3', text: 'Gratitude is the healthiest of all human emotions.', author: 'Zig Ziglar', isFavorite: false, category: 'gratitude' }
];

const reflectionQuotes: Quote[] = [
  { id: 'r1', text: 'By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.', author: 'Confucius', isFavorite: false, category: 'reflection' },
  { id: 'r2', text: 'Follow effective action with quiet reflection. From the quiet reflection will come even more effective action.', author: 'Peter Drucker', isFavorite: false, category: 'reflection' },
  { id: 'r3', text: 'Reflection is the lamp of the heart. If it departs, the heart will have no light.', author: 'Imam Al-Haddad', isFavorite: false, category: 'reflection' }
];

const mindfulnessQuotes: Quote[] = [
  { id: 'm1', text: 'The present moment is the only time over which we have dominion.', author: 'Thích Nhất Hạnh', isFavorite: false, category: 'mindfulness' },
  { id: 'm2', text: 'The best way to capture moments is to pay attention. This is how we cultivate mindfulness.', author: 'Jon Kabat-Zinn', isFavorite: false, category: 'mindfulness' },
  { id: 'm3', text: 'Mindfulness isn't difficult, we just need to remember to do it.', author: 'Sharon Salzberg', isFavorite: false, category: 'mindfulness' }
];

export const getJournalQuotes = (journalType: string): Quote[] => {
  switch (journalType) {
    case 'gratitude':
      return gratitudeQuotes;
    case 'reflection':
      return reflectionQuotes;
    case 'mindfulness':
      return mindfulnessQuotes;
    default:
      // If no specific type, provide a mix
      return [...gratitudeQuotes, ...reflectionQuotes, ...mindfulnessQuotes].slice(0, 3);
  }
};
