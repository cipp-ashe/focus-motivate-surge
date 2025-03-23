
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Timer } from '../timer/Timer';
import { Quote } from '@/types/timer';
import { TimerStateMetrics } from '@/types/metrics';

describe('Timer Component', () => {
  const mockProps = {
    duration: 300,
    taskName: 'Test Task',
    onComplete: vi.fn(),
    onAddTime: vi.fn(),
    onDurationChange: vi.fn(),
    favorites: [] as Quote[],
    setFavorites: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial state', () => {
    render(<Timer {...mockProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('handles start/pause functionality', () => {
    render(<Timer {...mockProps} />);
    const startButton = screen.getByText(/start/i);
    
    fireEvent.click(startButton);
    expect(screen.getByText(/pause/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/pause/i));
    expect(screen.getByText(/resume/i)).toBeInTheDocument();
  });

  it('updates time correctly', () => {
    render(<Timer {...mockProps} />);
    
    // Start timer
    fireEvent.click(screen.getByText(/start/i));
    
    // Advance timer by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    // Check time display (299 seconds = 4:59)
    expect(screen.getByText('04:59')).toBeInTheDocument();
  });

  it('handles completion', async () => {
    render(<Timer {...mockProps} />);
    
    // Start timer
    fireEvent.click(screen.getByText(/start/i));
    
    // Advance to completion
    act(() => {
      vi.advanceTimersByTime(300000); // 5 minutes
    });
    
    expect(mockProps.onComplete).toHaveBeenCalled();
  });

  it('handles adding time', () => {
    render(<Timer {...mockProps} />);
    
    // Start timer and advance
    fireEvent.click(screen.getByText(/start/i));
    act(() => {
      vi.advanceTimersByTime(290000); // 4:50 minutes
    });
    
    // Add time button should be visible
    const addTimeButton = screen.getByText(/add 5m/i);
    fireEvent.click(addTimeButton);
    
    expect(mockProps.onAddTime).toHaveBeenCalled();
  });

  it('handles duration changes', () => {
    render(<Timer {...mockProps} />);
    
    // Find and change minutes input
    const minutesInput = screen.getByRole('spinbutton');
    fireEvent.change(minutesInput, { target: { value: '10' } });
    fireEvent.blur(minutesInput);
    
    expect(mockProps.onDurationChange).toHaveBeenCalledWith(10);
  });

  it('manages favorites correctly', () => {
    const favorites: Quote[] = [{
      id: 'quote-1',
      text: 'Test quote',
      author: 'Test Author',
      isFavorite: true,
    }];
    
    render(<Timer {...{...mockProps, favorites}} />);
    
    // Verify favorite quote is displayed
    expect(screen.getByText('Test quote')).toBeInTheDocument();
  });
});
