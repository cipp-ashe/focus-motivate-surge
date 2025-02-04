import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmailSummaryModal } from "@/components/EmailSummaryModal";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { FloatingQuotes } from "@/components/quotes/FloatingQuotes";
import { TaskList, type Task } from "@/components/tasks/TaskList";
import { CompletionCelebration } from "@/components/timer/CompletionCelebration";
import { type Quote } from "@/types/timer/models";
import { type TimerStateMetrics } from "@/types/metrics";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Code, Info } from "lucide-react";
import { Link } from "react-router-dom";

const ComponentExamples: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'example1',
      name: 'Complete Documentation',
      completed: false,
      duration: 25
    },
    {
      id: 'example2',
      name: 'Review Code',
      completed: false,
      duration: 15
    }
  ]);

  const [completedTasks, setCompletedTasks] = useState<Task[]>([
    {
      id: 'completed1',
      name: 'Write Tests (Cleared)',
      completed: true,
      duration: 30,
      metrics: {
        expectedTime: 1800,
        actualDuration: 1750,
        pauseCount: 2,
        favoriteQuotes: 1,
        pausedTime: 300,
        extensionTime: 0,
        netEffectiveTime: 1450,
        efficiencyRatio: 95,
        completionStatus: 'Completed On Time'
      }
    },
    {
      id: 'completed2',
      name: 'Fix Bugs (Cleared)',
      completed: true,
      duration: 45,
      metrics: {
        expectedTime: 2700,
        actualDuration: 2500,
        pauseCount: 3,
        favoriteQuotes: 2,
        pausedTime: 450,
        extensionTime: 300,
        netEffectiveTime: 2350,
        efficiencyRatio: 87,
        completionStatus: 'Completed Late'
      }
    }
  ]);

  const [favoriteQuotes] = useState<Quote[]>([
    {
      text: "Stay focused on your goals",
      author: "Anonymous",
      categories: ['focus', 'motivation']
    },
    {
      text: "Small progress is still progress",
      author: "Unknown",
      categories: ['persistence', 'growth']
    }
  ]);

  const metrics: TimerStateMetrics = {
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
    startTime: null,
    endTime: null,
    lastPauseTimestamp: null
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-8 text-foreground">
      {/* Header with Theme Toggle and Dev Icon */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>
        <Link
          to="/"
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Back to app"
        >
          <Code className="h-5 w-5 text-primary" />
        </Link>
      </div>

      <main className="space-y-12">
        {/* Timer Example */}
        <section className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-8 border-b border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
            <h2 className="text-xl font-medium text-primary mb-2">Timer Example</h2>
            <p className="text-muted-foreground">Interactive timer with progress display</p>
          </div>

          <div className="p-8">
            <TimerCircle 
              size="large"
              isRunning={false}
              timeLeft={300}
              minutes={5}
              circumference={282.74}
              a11yProps={{
                "aria-label": "Timer showing 5 minutes remaining",
                "aria-valuemax": 300,
                "aria-valuenow": 300,
                role: "timer"
              }}
            />
          </div>
        </section>

        {/* Task Management */}
        <section className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-8 border-b border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
            <h2 className="text-xl font-medium text-primary mb-2">Task Management</h2>
            <p className="text-muted-foreground">Task list with metrics tracking</p>
          </div>

          <div className="p-8">
            <TaskList
              tasks={tasks}
              completedTasks={completedTasks}
              onTaskAdd={(task) => setTasks([...tasks, task])}
              onTaskSelect={() => {}}
              onTasksClear={() => setTasks([])}
              onSelectedTasksClear={() => {}}
              onSummaryEmailSent={() => {}}
              favorites={favoriteQuotes}
              onTasksUpdate={setTasks}
            />
          </div>
        </section>

        {/* Quotes */}
        <section className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-8 border-b border-border/50 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
            <h2 className="text-xl font-medium text-primary mb-2">Motivational Quotes</h2>
            <p className="text-muted-foreground">Floating quotes with physics-based animation</p>
          </div>

          <div className="p-8">
            <div className="h-[300px] relative bg-muted/30 rounded-lg">
              <FloatingQuotes favorites={favoriteQuotes} />
            </div>
          </div>
        </section>

        {showEmailModal && (
          <EmailSummaryModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            tasks={completedTasks}
            favorites={favoriteQuotes}
            metrics={metrics}
          />
        )}

        {showCelebration && (
          <CompletionCelebration
            onComplete={() => setShowCelebration(false)}
            metrics={metrics}
          />
        )}
      </main>
    </div>
  );
};

export default ComponentExamples;
