
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TemplateSelectionSheet from '../TemplateSelectionSheet';
import { HabitTemplate } from '../types';

// Mock data
const mockTemplates: HabitTemplate[] = [
  {
    id: '1',
    name: 'Daily Wellness',
    description: 'Simple daily wellness habits',
    category: 'Wellness',
    defaultHabits: []
  },
  {
    id: '2',
    name: 'Work Productivity',
    description: 'Habits for work productivity',
    category: 'Work',
    defaultHabits: []
  }
];

describe('TemplateSelectionSheet', () => {
  it('renders the sheet when open', () => {
    const mockOnClose = vi.fn();
    const mockSelectTemplate = vi.fn();
    const mockCreateTemplate = vi.fn();
    const mockDeleteCustomTemplate = vi.fn();
    const mockOnOpenChange = vi.fn();

    render(
      <TemplateSelectionSheet
        isOpen={true}
        onClose={mockOnClose}
        customTemplates={mockTemplates}
        activeTemplateIds={[]}
        onSelectTemplate={mockSelectTemplate}
        onCreateTemplate={mockCreateTemplate}
        onDeleteCustomTemplate={mockDeleteCustomTemplate}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.getByText('Choose a template to add to your habits')).toBeInTheDocument();
  });

  it('does not render the sheet when closed', () => {
    const mockOnClose = vi.fn();
    const mockSelectTemplate = vi.fn();
    const mockCreateTemplate = vi.fn();
    const mockDeleteCustomTemplate = vi.fn();
    const mockOnOpenChange = vi.fn();

    render(
      <TemplateSelectionSheet
        isOpen={false}
        onClose={mockOnClose}
        customTemplates={mockTemplates}
        activeTemplateIds={[]}
        onSelectTemplate={mockSelectTemplate}
        onCreateTemplate={mockCreateTemplate}
        onDeleteCustomTemplate={mockDeleteCustomTemplate}
        onOpenChange={mockOnOpenChange}
      />
    );

    expect(screen.queryByText('Choose a template to add to your habits')).not.toBeInTheDocument();
  });

  it('closes the sheet when X is clicked', () => {
    const mockOnClose = vi.fn();
    const mockSelectTemplate = vi.fn();
    const mockCreateTemplate = vi.fn();
    const mockDeleteCustomTemplate = vi.fn();
    const mockOnOpenChange = vi.fn();

    render(
      <TemplateSelectionSheet
        isOpen={true}
        onClose={mockOnClose}
        customTemplates={mockTemplates}
        activeTemplateIds={[]}
        onSelectTemplate={mockSelectTemplate}
        onCreateTemplate={mockCreateTemplate}
        onDeleteCustomTemplate={mockDeleteCustomTemplate}
        onOpenChange={mockOnOpenChange}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });
});
