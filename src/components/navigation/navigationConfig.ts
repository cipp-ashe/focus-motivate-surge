
import { Home, Calendar, ListChecks, BarChart, Edit, Book, AlarmClock, Settings } from 'lucide-react';

export const navigationConfig = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Overview of your day",
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListChecks,
    description: "Manage your tasks",
  },
  {
    title: "Habits",
    href: "/habits",
    icon: Calendar,
    description: "Track your habits",
  },
  {
    title: "Notes",
    href: "/notes",
    icon: Edit,
    description: "Manage your notes",
  },
  {
    title: "Journal",
    href: "/journal",
    icon: Book,
    description: "Write in your journal",
  },
  {
    title: "Timer",
    href: "/timer",
    icon: AlarmClock,
    description: "Start a timer session",
  },
  {
    title: "Metrics",
    href: "/metrics",
    icon: BarChart,
    description: "View your productivity metrics and statistics",
  },
];

// Define NAV_CATEGORIES object that's being imported by HeaderNav and BottomNav
export const NAV_CATEGORIES = {
  tasks: {
    label: "Tasks",
    icon: ListChecks,
    paths: ["/tasks", "/timer"],
    items: [
      { path: "/tasks", label: "Task Manager", icon: ListChecks },
      { path: "/timer", label: "Timer", icon: AlarmClock }
    ]
  },
  notes: {
    label: "Notes",
    icon: Edit,
    paths: ["/notes", "/journal"],
    items: [
      { path: "/notes", label: "Notes", icon: Edit },
      { path: "/journal", label: "Journal", icon: Book }
    ]
  },
  settings: {
    label: "Settings",
    icon: Settings,
    paths: ["/settings", "/habits"],
    items: [
      { path: "/settings", label: "Settings", icon: Settings },
      { path: "/habits", label: "Habits", icon: Calendar },
      { path: "/metrics", label: "Metrics", icon: BarChart }
    ]
  }
};
