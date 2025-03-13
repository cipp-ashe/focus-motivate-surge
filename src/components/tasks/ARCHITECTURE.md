
# Task Management System Architecture

This document outlines the architecture and design decisions for the task management system.

## 1. Core Components

### Task Data Flow

```
TaskContext (Provider)
    │
    ├── TaskManager
    │       │
    │       ├── TaskEventHandler (Event handling)
    │       │
    │       └── TaskManagerContent
    │               │
    │               ├── TaskInput (Create new tasks)
    │               │
    │               └── TaskList (Display active tasks)
    │
    └── CompletedTasks (Display completed/dismissed tasks)
```

### Event System

The application uses an event-based architecture to communicate between components:

- `eventBus`: Central event emitter/listener
- `TaskEventHandler`: Handles task-related events
- Custom browser events for UI updates (e.g., `force-task-update`)

## 2. Data Models

### Task

The core data model is the `Task` interface, which supports multiple task types:

- Regular tasks
- Timer tasks
- Journal tasks
- Checklist tasks
- Screenshot tasks
- Voice note tasks

Each task type has specific fields and behaviors while sharing common properties.

### Task State

Tasks exist in different states throughout their lifecycle:

- Active (pending, started, in-progress, delayed)
- Completed
- Dismissed

## 3. Storage Strategy

Tasks are persisted using `localStorage` with dedicated storage modules:

- `activeTasksStorage`: Manages active tasks
- `completedTasksStorage`: Manages completed/dismissed tasks
- `taskRelationshipStorage`: Manages relationships between tasks and other entities

A verification system periodically checks for data consistency.

## 4. Component Patterns

### UI Components

UI components follow these patterns:

1. **Controlled Components**: Input components receive values and handlers from parents
2. **Container/Content Pattern**: Logic is separated from presentation
3. **Composition**: Complex components are composed of smaller, focused components

### Event Handlers

Components communicate through events rather than direct props to reduce coupling:

```javascript
// Example of event emission
eventBus.emit('task:update', { taskId, updates });

// Example of event listening
eventBus.on('task:update', handleTaskUpdate);
```

## 5. Integration Points

### Habit System Integration

Tasks integrate with the habit system:

- Habit tasks are created based on habit schedules
- Task completion/dismissal affects habit tracking
- Custom event handling connects the two systems

### Timer Integration

Timer tasks connect to the timer system:

- Selection of tasks in the task list can set the timer
- Timer completion affects task status

## 6. Styling and Design

Components use:

- Tailwind CSS for styling
- Shadcn/UI for base components
- Consistent theming and transitions

## 7. Best Practices

- **Separation of Concerns**: Business logic separate from presentation
- **Consistent Documentation**: JSDoc for all components and interfaces
- **Type Safety**: TypeScript interfaces and types for all data
- **Error Handling**: Consistent error handling pattern with fallbacks
- **Logging**: Strategic logging for debugging and monitoring
