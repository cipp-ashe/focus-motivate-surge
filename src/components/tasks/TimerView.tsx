import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '@/contexts/tasks/TasksContext';
import { TaskDetail } from '@/components/tasks/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { TimerConfetti } from '@/components/timer/TimerConfetti';

const TimerView: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTask } = useTasks();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [notes, setNotes] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (taskId) {
      const fetchedTask = getTask(taskId);
      if (fetchedTask) {
        setTask(fetchedTask);
        setTime(fetchedTask.timer || 0);
        setNotes(fetchedTask.notes || '');
      }
    }
  }, [taskId, getTask]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const completeTask = async () => {
    if (!task) return;

    setIsRunning(false);
    setShowConfetti(true);

    // Update the task with the final timer value and completion status
    await updateTask({
      ...task,
      timer: time,
      completed: true,
      completedAt: new Date(),
      notes: notes,
    });

    // Optimistically update the local state
    setTask((prevTask) => {
      if (prevTask) {
        return { ...prevTask, completed: true, completedAt: new Date(), timer: time, notes: notes };
      }
      return prevTask;
    });

    setTimeout(() => {
      setShowConfetti(false);
      navigate('/tasks');
    }, 3000);
  };

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((t) => t.toString().padStart(2, '0'))
      .join(':');
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const saveNotes = async () => {
    if (!task) return;

    // Update the task with the current notes
    await updateTask({
      ...task,
      notes: notes,
      timer: time,
    });

    // Optimistically update the local state
    setTask((prevTask) => {
      if (prevTask) {
        return { ...prevTask, notes: notes, timer: time };
      }
      return prevTask;
    });
  };

  if (!task) {
    return (
      <Card>
        <CardContent className="flex items-center space-x-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p>Task not found or loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <TimerConfetti show={showConfetti} width={windowSize.width} height={windowSize.height} />
      <Card>
        <CardContent className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{task.name}</h2>
          <p className="text-muted-foreground">
            Created on {format(new Date(task.createdAt), 'PPP')}
          </p>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>{formatTime(time)}</span>
          </div>
          <div className="flex space-x-4">
            {!task.completed && (
              <>
                {!isRunning ? (
                  <Button variant="purple" onClick={startTimer}>
                    Start
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={pauseTimer}>
                    Pause
                  </Button>
                )}
                <Button variant="ghost" onClick={resetTimer}>
                  Reset
                </Button>
                <Button variant="default" onClick={completeTask}>
                  Complete Task
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          <div>
            <Textarea
              placeholder="Add notes about this task..."
              value={notes}
              onChange={handleNotesChange}
            />
            <Button variant="outline" className="mt-2" onClick={saveNotes}>
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimerView;
