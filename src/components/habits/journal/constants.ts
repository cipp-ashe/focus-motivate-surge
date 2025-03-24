
/**
 * Journal Constants
 * 
 * Constants for the journal component
 */

import { Color } from '@/types/core';

// Journal tag colors
export const JOURNAL_TAG_COLORS: Color[] = [
  'default',
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'pink',
  'orange',
  'teal'
];

// Journal prompts
export const JOURNAL_PROMPTS = {
  reflection: [
    "What went well with this habit today?",
    "What challenges did you face?",
    "How did you overcome obstacles?",
    "What did you learn from today's practice?",
    "How can you improve tomorrow?"
  ],
  motivation: [
    "Why is this habit important to you?",
    "How did this habit make you feel today?",
    "What benefits have you noticed from this habit?",
    "What are you looking forward to tomorrow?",
    "How does this habit align with your goals?"
  ],
  general: [
    "Record your thoughts about today's habit...",
    "Note your progress and feelings...",
    "Reflect on your experience with this habit...",
    "Write about your journey with this habit...",
    "Document your process and insights..."
  ]
};

// Default journal content
export const DEFAULT_JOURNAL_CONTENT = 
`## Today's Reflection

Write about your experience with this habit today...

## Obstacles & Solutions

What challenges did you face? How did you overcome them?

## Tomorrow's Plan

How will you improve tomorrow?
`;

// Journal tags
export const DEFAULT_JOURNAL_TAGS = [
  { name: 'reflection', color: 'blue' },
  { name: 'success', color: 'green' },
  { name: 'challenge', color: 'red' },
  { name: 'insight', color: 'purple' },
  { name: 'progress', color: 'teal' }
];
