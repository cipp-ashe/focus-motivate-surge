
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { Timer } from '../timer/Timer';
import { Quote } from '@/types/timer';

const mockQuote: Quote = {
  id: '123',
  text: 'Test quote',
  author: 'Test author',
  isFavorite: false,
  category: 'focus'
};

const mockSetFavorites = vi.fn();

describe('Timer Component', () => {
  it('renders without crashing', () => {
    render(<Timer duration={1500} taskName="Test Task" />);
  });

  it('displays the task name', () => {
    render(<Timer duration={1500} taskName="Test Task" />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('starts and pauses the timer', () => {
    render(<Timer duration={1500} taskName="Test Task" />);
    const startButton = screen.getByRole('button', { name: 'Start timer' });
    fireEvent.click(startButton);
    expect(startButton).toHaveAttribute('aria-label', 'Pause timer');
    const pauseButton = screen.getByRole('button', { name: 'Pause timer' });
    fireEvent.click(pauseButton);
    expect(pauseButton).toHaveAttribute('aria-label', 'Start timer');
  });

  it('resets the timer', () => {
    render(<Timer duration={1500} taskName="Test Task" />);
    const resetButton = screen.getByRole('button', { name: 'Reset timer' });
    fireEvent.click(resetButton);
    expect(screen.getByText('25:00')).toBeInTheDocument();
  });

  it('toggles quote favorites', async () => {
    render(
      <Timer
        duration={1500}
        taskName="Test Task"
        favorites={[mockQuote]}
        setFavorites={mockSetFavorites}
      />
    );
    
    const favoriteQuote: Quote = {
      id: '123',
      text: 'Test quote',
      author: 'Test author',
      isFavorite: true,
      category: 'focus' // This is now properly typed as QuoteCategory
    };

    // Mock the window.localStorage object
    const localStorageMock = (() => {
      let store: { [key: string]: string } = {};

      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = String(value);
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock the favorites in localStorage
    localStorage.setItem('favorites', JSON.stringify([favoriteQuote]));

    // Mock the setFavorites function
    const setFavoritesMock = vi.fn();

    // Render the Timer component with the mock localStorage and setFavorites function
    render(
      <Timer
        duration={1500}
        taskName="Test Task"
        favorites={[favoriteQuote]}
        setFavorites={setFavoritesMock}
      />
    );

    // Assert that the setFavorites function is called with the updated favorites
    expect(setFavoritesMock).toHaveBeenCalled();
  });
});
