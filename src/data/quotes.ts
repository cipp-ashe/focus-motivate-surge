
import { Quote } from "../types/timer";

// Make sure each quote has an id and isFavorite property
export const quotes: Quote[] = [
  { id: "1", text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: ['motivation', 'growth'], isFavorite: false },
  { id: "2", text: "Focus on being productive instead of busy.", author: "Tim Ferriss", category: ['focus'], isFavorite: false },
  { id: "3", text: "Small progress is still progress.", author: "Unknown", category: ['persistence', 'growth'], isFavorite: false },
  { id: "4", text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: ['motivation', 'persistence'], isFavorite: false },
  { id: "5", text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: ['motivation', 'focus'], isFavorite: false },
  { id: "6", text: "The future depends on what you do today.", author: "Mahatma Gandhi", category: ['focus', 'growth'], isFavorite: false },
  { id: "7", text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: ['motivation', 'growth'], isFavorite: false },
  { id: "8", text: "Everything you can imagine is real.", author: "Pablo Picasso", category: ['creativity'], isFavorite: false },
  { id: "9", text: "Make each day your masterpiece.", author: "John Wooden", category: ['motivation', 'focus'], isFavorite: false },
  { id: "10", text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: ['motivation', 'growth'], isFavorite: false },
  { id: "11", text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: ['motivation'], isFavorite: false },
  { id: "12", text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: ['persistence', 'growth'], isFavorite: false },
  { id: "13", text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: ['focus', 'motivation'], isFavorite: false },
  { id: "14", text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: ['persistence', 'focus'], isFavorite: false },
  { id: "15", text: "What makes you different is what makes you powerful.", author: "Unknown", category: ['creativity', 'growth'], isFavorite: false },
  { id: "16", text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", category: ['creativity', 'learning'], isFavorite: false },
  { id: "17", text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: ['growth', 'persistence'], isFavorite: false },
  { id: "18", text: "Life is not a matter of holding good cards, but of playing a poor hand well.", author: "Robert Louis Stevenson", category: ['persistence', 'creativity'], isFavorite: false },
  { id: "19", text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: ['learning', 'motivation'], isFavorite: false },
  { id: "20", text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.", author: "Albert Einstein", category: ['learning', 'creativity'], isFavorite: false },
  { id: "21", text: "The ability to simplify means to eliminate the unnecessary so that the necessary may speak.", author: "Hans Hofmann", category: ['focus', 'creativity'], isFavorite: false },
  { id: "22", text: "Have no fear of perfection - you'll never reach it.", author: "Salvador Dalí", category: ['growth', 'creativity'], isFavorite: false },
  { id: "23", text: "If I have seen further than others, it is by standing upon the shoulders of giants.", author: "Isaac Newton", category: ['learning', 'growth'], isFavorite: false },
  { id: "24", text: "The secret of change is to focus all your energy, not on fighting the old, but on building the new.", author: "Socrates", category: ['focus', 'growth'], isFavorite: false },
  { id: "25", text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: ['creativity', 'motivation'], isFavorite: false },
  { id: "26", text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", category: ['focus', 'persistence'], isFavorite: false },
  { id: "27", text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau", category: ['motivation', 'growth'], isFavorite: false },
  { id: "28", text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", category: ['growth', 'persistence'], isFavorite: false },
  { id: "29", text: "Knowing is not enough; we must apply. Willing is not enough; we must do.", author: "Johann Wolfgang von Goethe", category: ['learning', 'persistence'], isFavorite: false },
  { id: "30", text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein", category: ['growth', 'motivation'], isFavorite: false },
  { id: "31", text: "Resilience is not about bouncing back, but about growing stronger after each challenge.", author: "Unknown", category: ['persistence', 'growth'], isFavorite: false },
  { id: "32", text: "Every question you ask opens a door to new possibilities.", author: "Unknown", category: ['learning', 'creativity'], isFavorite: false },
  { id: "33", text: "The world needs people who see things differently.", author: "Unknown", category: ['creativity', 'growth'], isFavorite: false },
  { id: "34", text: "Innovation is seeing what everyone sees but thinking what no one has thought.", author: "Unknown", category: ['creativity', 'learning'], isFavorite: false },
  { id: "35", text: "Change begins where comfort ends.", author: "Unknown", category: ['growth', 'persistence'], isFavorite: false },
  { id: "36", text: "Curiosity is the compass that leads us to the undiscovered.", author: "Unknown", category: ['learning', 'creativity'], isFavorite: false },
  { id: "37", text: "The best way to solve a problem is to understand it completely.", author: "Unknown", category: ['learning', 'focus'], isFavorite: false },
  { id: "38", text: "Purpose is not something you find; it's something you create through your actions.", author: "Unknown", category: ['motivation', 'growth'], isFavorite: false },
  { id: "39", text: "Vision without strategy is a dream; vision with execution is a legacy.", author: "Unknown", category: ['focus', 'persistence'], isFavorite: false },
  
  // Adding gratitude quotes
  { id: "40", text: "Gratitude turns what we have into enough.", author: "Melody Beattie", category: ['gratitude', 'growth'], isFavorite: false },
  { id: "41", text: "Gratitude is the healthiest of all human emotions.", author: "Zig Ziglar", category: ['gratitude', 'motivation'], isFavorite: false },
  { id: "42", text: "When I started counting my blessings, my whole life turned around.", author: "Willie Nelson", category: ['gratitude', 'growth'], isFavorite: false },
  { id: "43", text: "Gratitude is not only the greatest of virtues, but the parent of all others.", author: "Cicero", category: ['gratitude', 'motivation'], isFavorite: false },
  { id: "44", text: "The more grateful I am, the more beauty I see.", author: "Mary Davis", category: ['gratitude', 'creativity'], isFavorite: false },
  
  // Adding reflection quotes
  { id: "45", text: "The unexamined life is not worth living.", author: "Socrates", category: ['reflection', 'learning'], isFavorite: false },
  { id: "46", text: "Your vision will become clear only when you can look into your own heart.", author: "Carl Jung", category: ['reflection', 'growth'], isFavorite: false },
  { id: "47", text: "Life can only be understood backwards; but it must be lived forwards.", author: "Søren Kierkegaard", category: ['reflection', 'learning'], isFavorite: false },
  
  // Adding mindfulness quotes
  { id: "48", text: "The present moment is the only time over which we have dominion.", author: "Thích Nhất Hạnh", category: ['mindfulness', 'focus'], isFavorite: false },
  { id: "49", text: "Mindfulness isn't difficult. We just need to remember to do it.", author: "Sharon Salzberg", category: ['mindfulness', 'focus'], isFavorite: false },
  { id: "50", text: "The best way to capture moments is to pay attention. This is how we cultivate mindfulness.", author: "Jon Kabat-Zinn", category: ['mindfulness', 'focus'], isFavorite: false }
];
