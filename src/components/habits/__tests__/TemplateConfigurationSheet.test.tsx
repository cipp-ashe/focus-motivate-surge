
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TemplateConfigurationSheet from '../TemplateConfigurationSheet';
import { ActiveTemplate } from '../types';

const mockTemplate: ActiveTemplate = {
  templateId: 'test-1',
  habits: [],
  customized: false,
  activeDays: ['Monday', 'Wednesday', 'Friday'],
};

describe('TemplateConfigurationSheet', () => {
  const defaultProps = {
    selectedTemplate: mockTemplate,
    isCreatingTemplate: false,
    newTemplateName: '',
    onNewTemplateNameChange: vi.fn(),
    onClose: vi.fn(),
    onUpdateTemplate: vi.fn(),
    onUpdateDays: vi.fn(),
    onSave: vi.fn(),
  };

  it('renders correctly with selected template', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    expect(screen.getByText('Edit Template')).toBeInTheDocument();
  });

  it('shows template name input when creating new template', () => {
    render(
      <TemplateConfigurationSheet
        {...defaultProps}
        isCreatingTemplate={true}
      />
    );
    expect(screen.getByLabelText('Template Name')).toBeInTheDocument();
  });

  it('calls onNewTemplateNameChange when template name is updated', () => {
    render(
      <TemplateConfigurationSheet
        {...defaultProps}
        isCreatingTemplate={true}
      />
    );
    const input = screen.getByLabelText('Template Name');
    fireEvent.change(input, { target: { value: 'New Template' } });
    expect(defaultProps.onNewTemplateNameChange).toHaveBeenCalledWith('New Template');
  });

  it('calls onClose when sheet is closed', () => {
    render(<TemplateConfigurationSheet {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});

