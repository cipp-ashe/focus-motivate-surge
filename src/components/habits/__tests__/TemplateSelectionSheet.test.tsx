
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateSelectionSheet from '../TemplateSelectionSheet';
import { HabitTemplate } from '../types';

const mockTemplates: HabitTemplate[] = [
  {
    id: 'test-1',
    name: 'Test Template 1',
    description: 'Test Description 1',
    category: 'Test',
    defaultHabits: [],
    defaultDays: ['Mon', 'Wed', 'Fri'],
    duration: null,
  },
];

describe('TemplateSelectionSheet', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    allTemplates: mockTemplates,
    activeTemplateIds: [],
    onSelectTemplate: vi.fn(),
    onCreateTemplate: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<TemplateSelectionSheet {...defaultProps} />);
    expect(screen.getByText('Configure Templates')).toBeInTheDocument();
  });

  it('shows available templates', () => {
    render(<TemplateSelectionSheet {...defaultProps} />);
    expect(screen.getByText('Test Template 1')).toBeInTheDocument();
  });

  it('calls onSelectTemplate when a template is selected', () => {
    render(<TemplateSelectionSheet {...defaultProps} />);
    const addButton = screen.getByRole('button', { name: /add template/i });
    fireEvent.click(addButton);
    expect(defaultProps.onSelectTemplate).toHaveBeenCalledWith('test-1');
  });

  it('calls onCreateTemplate when create button is clicked', () => {
    render(<TemplateSelectionSheet {...defaultProps} />);
    const createButton = screen.getByRole('button', { name: /create new template/i });
    fireEvent.click(createButton);
    expect(defaultProps.onCreateTemplate).toHaveBeenCalled();
  });
});

