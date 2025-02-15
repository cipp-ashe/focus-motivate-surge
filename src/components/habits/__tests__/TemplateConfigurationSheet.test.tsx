
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplateConfigurationSheet from '../TemplateConfigurationSheet';
import { ActiveTemplate } from '../types';

const mockTemplate: ActiveTemplate = {
  templateId: 'test-1',
  habits: [],
  customized: false,
  activeDays: ['Mon', 'Wed', 'Fri'],
};

describe('TemplateConfigurationSheet', () => {
  const defaultProps = {
    selectedTemplate: mockTemplate,
    isCreatingTemplate: false,
    newTemplateName: '',
    onNewTemplateNameChange: vi.fn(),
    onUpdateDays: vi.fn(),
    onClose: vi.fn(),
    onUpdateTemplate: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders correctly when open', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    expect(screen.getByText('Configure Template')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onSave when the save button is clicked', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('updates active days when a day is toggled', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    const dayButton = screen.getByRole('button', { name: /mon/i });
    fireEvent.click(dayButton);
    expect(defaultProps.onUpdateDays).toHaveBeenCalled();
  });
});
