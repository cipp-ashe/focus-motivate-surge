
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@/components/ThemeProvider';
import { TemplateSelectionSheet } from '../TemplateSelectionSheet';

// Mock the recommendedTemplates
vi.mock('@/data/recommendedTemplates', () => ({
  getRecommendedTemplates: () => [
    {
      id: 'test-template',
      name: 'Test Template',
      description: 'This is a test template',
      category: 'Test',
      defaultHabits: []
    }
  ]
}));

describe('TemplateSelectionSheet', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider>
        <TemplateSelectionSheet
          open={true}
          onOpenChange={() => {}}
          onSelect={() => {}}
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Add Habit Template')).toBeInTheDocument();
  });

  // Add more tests as needed
});
