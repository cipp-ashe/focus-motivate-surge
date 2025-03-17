
import { 
  CalendarCheck, 
  Timer, 
  BookHeart, 
  ScrollText, 
  Image, 
  Mic,
  Clock,
  BarChart,
  CheckSquare
} from 'lucide-react';
import { DashboardCardProps } from './DashboardCard';

export const dashboardCards: Omit<DashboardCardProps, 'icon' | 'iconColor'>[] = [
  {
    to: "/tasks",
    title: "Tasks",
    description: "Organize and manage your daily tasks and to-dos",
    metrics: [
      { label: "Categories", value: "7", icon: CheckSquare },
      { label: "Focus", value: "High", icon: BarChart }
    ]
  },
  {
    to: "/timer",
    title: "Timer",
    description: "Stay focused with our Pomodoro technique timer",
    metrics: [
      { label: "Duration", value: "25 min", icon: Clock },
      { label: "Sessions", value: "4", icon: BarChart }
    ]
  },
  {
    to: "/habits",
    title: "Habits",
    description: "Build and track new habits for daily improvement",
    metrics: [
      { label: "Consistency", value: "Daily", icon: CalendarCheck },
      { label: "Templates", value: "5+", icon: CheckSquare }
    ]
  },
  {
    to: "/notes",
    title: "Notes",
    description: "Capture and organize your thoughts and ideas",
    metrics: [
      { label: "Format", value: "Markdown", icon: ScrollText },
      { label: "Storage", value: "Secure", icon: CheckSquare }
    ]
  },
  {
    to: "/screenshots",
    title: "Screenshots",
    description: "Save and organize visual references and information",
    metrics: [
      { label: "Capture", value: "Easy", icon: Image },
      { label: "Text", value: "OCR", icon: ScrollText }
    ]
  },
  {
    to: "/voice-notes",
    title: "Voice Notes",
    description: "Record and transcribe voice memos and ideas",
    metrics: [
      { label: "Recording", value: "HD", icon: Mic },
      { label: "Storage", value: "Cloud", icon: CheckSquare }
    ]
  }
];

export const iconColorMap: Record<string, string> = {
  "Tasks": "text-primary",
  "Timer": "text-purple-400",
  "Habits": "text-cyan-400",
  "Notes": "text-amber-400",
  "Screenshots": "text-blue-400",
  "Voice Notes": "text-rose-400"
};

export const iconMap: Record<string, any> = {
  "Tasks": CalendarCheck,
  "Timer": Timer,
  "Habits": BookHeart,
  "Notes": ScrollText,
  "Screenshots": Image,
  "Voice Notes": Mic
};
