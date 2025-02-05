# Get Focused, Get Motivated, Surge Ahead

A modern lightweight productivity app that combines a customizable timer with task management and motivational quotes to help you stay focused and productive.

## Features

- **Smart Timer System**
  - Flexible timer with compact and expanded views
  - Visual progress tracking with circular display
  - Customizable sound notifications
  - Keyboard shortcuts for quick control

- **Task Management**
  - Create and track tasks
  - Task completion history
  - Email summary functionality
  - Task metrics and analytics

- **Motivational Features**
  - Dynamic quote display
  - Favorite quotes collection
  - Floating quotes for ambient motivation
  - Completion celebrations

- **Modern UI/UX**
  - Clean, responsive interface using shadcn/ui
  - Dark/light theme support
  - Accessible design with ARIA support
  - Smooth transitions and animations

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Edge Functions**: Supabase
- **Email Relay**: Resend
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Jest with React Testing Library

## Getting Started

1. **Prerequisites**
   - Node.js (LTS version recommended)
   - npm or yarn package manager

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]

   # Navigate to project directory
   cd focus-motivate-surge

   # Install dependencies
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add necessary environment variables (see `.env.example` if available)

4. **Development**
   ```bash
   # Start development server
   npm run dev

   # Run tests
   npm test

   # Lint code
   npm run lint

   # Build for production
   npm run build
   ```

## Project Structure

```
src/
├── components/        # React components
│   ├── timer/        # Timer-related components
│   ├── tasks/        # Task management components
│   ├── quotes/       # Quote display components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── integrations/     # External service integrations
```

## Component Architecture

### Timer System
- **Core Components**
  - `Timer`: Main container component orchestrating timer functionality
  - `TimerCircle`: Visual circular progress indicator with SVG animations
  - `TimerDisplay`: Digital time display with formatting
  - `TimerCompactView`/`TimerExpandedView`: Responsive layout variants
  - `TimerControls`: Play, pause, reset, and skip controls
  - `TimerHeader`: Timer status and mode indicators
  - `TimerMetrics`: Statistics and performance tracking display

- **Custom Hooks**
  - `useTimer`: Core timer logic and state management
  - `useTimerState`: Timer state and transitions
  - `useTimerControls`: Control actions and handlers
  - `useTimerEffects`: Side effects management
  - `useTimerMetrics`: Performance tracking calculations
  - `useTimerShortcuts`: Keyboard shortcuts implementation
  - `useTimerA11y`: Accessibility features and announcements

### Task Management
- **Components**
  - `TaskManager`: Main task management container
  - `TaskList`: Sortable list of active tasks
  - `TaskTable`: Detailed task view with metrics
  - `TaskRow`: Individual task item with actions
  - `TaskInput`: New task creation interface
  - `CompletedTasks`: Historical task view
  - `EmailSummaryModal`: Task summary email configuration

- **Custom Hooks**
  - `useTaskManager`: Task state and operations management
  - `useTaskOperations`: CRUD operations for tasks
  - `useLoadingState`: Loading states handling
  - `useTransition`: Smooth state transitions

### Quote System
- **Components**
  - `QuoteDisplay`: Main quote presentation
  - `FavoriteQuotes`: Saved quotes collection
  - `FloatingQuotes`: Ambient motivational display

- **Custom Hooks**
  - `useQuoteManager`: Quote fetching and management
  - `useTransition`: Animation handling for quote changes

### Utility Components
- **Audio System**
  - `SoundSelector`: Notification sound customization
  - `useAudio`: Audio playback management

- **UI Components**
  - Comprehensive set of shadcn/ui components
  - Custom toast notifications system
  - Responsive dialog components
  - Accessible form elements

## State Management

### Core Interfaces

#### Timer State and Metrics
```typescript
interface TimerMetrics {
  startTime: Date | null;
  endTime: Date | null;
  pauseCount: number;
  expectedTime: number;
  actualDuration: number;
  favoriteQuotes: number;
  pausedTime: number;
  lastPauseTimestamp: Date | null;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}
```

#### Task Management
```typescript
interface Task {
  id: string;
  name: string;
  metrics?: TimerMetrics;
  completed?: boolean;
}

interface TaskSummary {
  taskName: string;
  completed: boolean;
  metrics?: TimerMetrics;
  relatedQuotes: Quote[];
}
```

#### Quote System
```typescript
interface Quote {
  text: string;
  author: string;
  categories: ('motivation' | 'focus' | 'creativity' | 'learning' | 'persistence' | 'growth')[];
  timestamp?: string;
  task?: string;
}
```

## Integration Features

### Supabase and Resend Integration
- Task summary email delivery via Resend through Supabase Edge Function
- Daily task summaries with metrics and related quotes
- Error handling and retry mechanisms

### Application State
- Real-time timer state management
- Multi-task selection and bulk operations
- Quote categorization and task association
- Metrics calculation and performance tracking

## Key Features Deep Dive

### Timer System
- Precise time tracking with pause/resume capability
- Efficiency ratio calculation: (expectedTime / netEffectiveTime) * 100
- Extension time tracking for overtime sessions
- Motivational toast notifications during key events

### Task Management
- Multi-select tasks with Ctrl/Cmd + Click
- Task metrics tracking including pause counts and duration
- Email summary generation with formatted daily reports
- Quote association with specific tasks

### Quote System
- **Smart Quote Selection**
  - Context-aware quote selection based on task keywords
  - Automatic categorization into focus, creativity, learning, persistence, motivation, and growth
  - Quote pool management with shuffling for variety
  - 15-second auto-cycling for continuous motivation

- **Task Integration**
  - Intelligent matching of quotes to task context
  - Keyword analysis for category determination
  - Fallback to motivation/focus categories when no specific match
  - Task association tracking with timestamps

- **User Interaction**
  - Like/favorite quote functionality with task context
  - Smooth transition animations between quotes
  - Toast notifications for favorite additions
  - Quote history tracking with task correlation

- **Performance Features**
  - Quote pool pre-shuffling for performance
  - Transition state management
  - Debounced quote cycling
  - Optimized re-rendering with state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
