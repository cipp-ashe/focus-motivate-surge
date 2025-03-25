
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TimerBody } from '../timer/components/TimerBody';

describe('TimerBody Component', () => {
  const mockProps = {
    isExpanded: false,
    setIsExpanded: vi.fn(),
    showCompletion: false,
    taskName: 'Test Task',
    timerCircleProps: {
      isRunning: false,
      timeLeft: 300,
      minutes: 5,
      circumference: 283.27,
      size: 'normal' as const,
    },
    timerControlsProps: {
      isRunning: false,
      onToggle: vi.fn(),
      onComplete: vi.fn(),
      onAddTime: vi.fn(),
      metrics: {
        startTime: null,
        endTime: null,
        pauseCount: 0,
        expectedTime: 300,
        actualDuration: 0,
        favoriteQuotes: [] as string[],
        pausedTime: 0,
        lastPauseTimestamp: null,
        extensionTime: 0,
        netEffectiveTime: 0,
        efficiencyRatio: 0,
        completionStatus: null,
        isPaused: false,
        pausedTimeLeft: null,
      },
      showAddTime: false,
      size: 'normal' as const,
    },
    metrics: {
      startTime: null,
      endTime: null,
      pauseCount: 0,
      expectedTime: 300,
      actualDuration: 0,
      favoriteQuotes: [] as string[],
      pausedTime: 0,
      lastPauseTimestamp: null,
      extensionTime: 0,
      netEffectiveTime: 0,
      efficiencyRatio: 0,
      completionStatus: null,
      isPaused: false,
      pausedTimeLeft: null,
      completionDate: null,  // Added missing required property
    },
    internalMinutes: 5,
    handleMinutesChange: vi.fn(),
    selectedSound: 'bell' as const,
    setSelectedSound: vi.fn(),
    testSound: vi.fn(),
    isLoadingAudio: false,
    updateMetrics: vi.fn(),
    expandedViewRef: { current: null },
    handleCloseTimer: vi.fn(),
    favorites: [],
    setFavorites: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders compact view by default', () => {
    render(<TimerBody {...mockProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('toggles between compact and expanded views', () => {
    render(<TimerBody {...mockProps} />);
    
    // Start timer to enable expansion
    fireEvent.click(screen.getByText(/start/i));
    
    // Verify expansion behavior
    expect(mockProps.setIsExpanded).toHaveBeenCalled();
  });

  it('renders sound selector in compact view', () => {
    render(<TimerBody {...mockProps} />);
    expect(screen.getByText(/bell/i)).toBeInTheDocument();
  });

  it('handles timer controls correctly', () => {
    render(<TimerBody {...mockProps} />);
    
    const startButton = screen.getByText(/start/i);
    fireEvent.click(startButton);
    
    expect(mockProps.timerControlsProps.onToggle).toHaveBeenCalled();
  });

  it('updates minutes correctly', () => {
    render(<TimerBody {...mockProps} />);
    
    const minutesInput = screen.getByRole('spinbutton');
    fireEvent.change(minutesInput, { target: { value: '10' } });
    
    expect(mockProps.handleMinutesChange).toHaveBeenCalled();
  });

  it('manages sound settings', () => {
    render(<TimerBody {...mockProps} />);
    
    const soundButton = screen.getByText(/bell/i);
    fireEvent.click(soundButton);
    
    expect(mockProps.setSelectedSound).toHaveBeenCalled();
  });
});
