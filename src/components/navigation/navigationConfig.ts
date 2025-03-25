import { Home, Calendar, ListChecks, BarChart } from 'lucide-react';

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
    icon: "Edit",
    description: "Manage your notes",
  },
  {
    title: "Journal",
    href: "/journal",
    icon: "Book",
    description: "Write in your journal",
  },
  {
    title: "Timer",
    href: "/timer",
    icon: "AlarmClock",
    description: "Start a timer session",
  },
  {
    title: "Metrics",
    href: "/metrics",
    icon: BarChart, // Use BarChart icon from Lucide
    description: "View your productivity metrics and statistics",
  },
];
