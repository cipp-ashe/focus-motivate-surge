
import React from 'react';
import { EmailSummaryModal } from "@/components/EmailSummaryModal";
import { type Quote } from "@/types/timer/models";
import { type Task } from "@/components/tasks/TaskList";
import { type TimerStateMetrics } from "@/types/metrics";

interface EmailModalProps {
  isActive: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isActive, onClose }) => {
  const demoTask: Task = {
    id: 'demo1',
    name: 'Example Task',
    completed: true,
    duration: 25,
    metrics: {
      expectedTime: 1500,
      actualDuration: 1450,
      pauseCount: 2,
      favoriteQuotes: 1,
      pausedTime: 300,
      extensionTime: 0,
      netEffectiveTime: 1150,
      efficiencyRatio: 95,
      completionStatus: 'Completed On Time'
    }
  };

  const demoTasks: Task[] = [demoTask];

  const demoQuotes: Quote[] = [
    {
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
      categories: ['motivation', 'persistence']
    }
  ];

  const demoMetrics: TimerStateMetrics = {
    expectedTime: 1500,
    actualDuration: 1450,
    pauseCount: 2,
    favoriteQuotes: 1,
    pausedTime: 300,
    extensionTime: 0,
    netEffectiveTime: 1150,
    efficiencyRatio: 95,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null,
    startTime: new Date(),
    endTime: new Date(),
    lastPauseTimestamp: null
  };

  return isActive ? (
    <EmailSummaryModal
      isOpen={true}
      onClose={onClose}
      tasks={demoTasks}
      favorites={demoQuotes}
      metrics={demoMetrics}
    />
  ) : null;
};
