
import { 
  Home, 
  ListTodo, 
  Clock, 
  Image, 
  BookOpen, 
  Mic, 
  Settings, 
  Activity
} from 'lucide-react';
import { NavItem } from './NavigationDropdown';

export const TASKS_ITEMS: NavItem[] = [
  { path: '/tasks', icon: ListTodo, label: 'Task List' },
  { path: '/timer', icon: Clock, label: 'Timer' },
  { path: '/screenshots', icon: Image, label: 'Screenshots' }
];

export const NOTES_ITEMS: NavItem[] = [
  { path: '/notes', icon: BookOpen, label: 'Journal' },
  { path: '/voice-notes', icon: Mic, label: 'Voice Notes' }
];

export const SETTINGS_ITEMS: NavItem[] = [
  { path: '/settings', icon: Settings, label: 'Settings' },
  { path: '/habits', icon: Activity, label: 'Habits' }
];

export const NAV_CATEGORIES = {
  tasks: {
    icon: ListTodo,
    label: 'Tasks',
    items: TASKS_ITEMS,
    paths: TASKS_ITEMS.map(item => item.path)
  },
  notes: {
    icon: BookOpen,
    label: 'Notes',
    items: NOTES_ITEMS,
    paths: NOTES_ITEMS.map(item => item.path)
  },
  settings: {
    icon: Settings,
    label: 'Settings',
    items: SETTINGS_ITEMS,
    paths: SETTINGS_ITEMS.map(item => item.path)
  }
};
