import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackToast from '../FeedbackToast';
import type { UserFeedback } from '../../types';

const mockFeedback: UserFeedback[] = [
  {
    id: '1',
    type: 'success',
    message: 'Success message',
    duration: 3000
  },
  {
    id: '2',
    type: 'error',
    message: 'Error message',
    duration: 5000,
    action: {
      label: 'Retry',
      handler: vi.fn()
    }
  },
  {
    id: '3',
    type: 'warning',
    message: 'Warning message'
  },
  {
    id: '4',
    type: 'info',
    message: 'Info message'
  }
];

describe('FeedbackToast', () => {
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all feedback messages', () => {
    render(<FeedbackToast feedback={mockFeedback} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should render action button when provided', () => {
    render(<FeedbackToast feedback={mockFeedback} onRemove={mockOnRemove} />);
    
    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  it('should call action handler when action button is clicked', () => {
    const actionHandler = vi.fn();
    const feedbackWithAction: UserFeedback[] = [{
      id: '1',
      type: 'error',
      message: 'Error with action',
      action: {
        label: 'Retry',
        handler: actionHandler
      }
    }];

    render(<FeedbackToast feedback={feedbackWithAction} onRemove={mockOnRemove} />);
    
    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    
    expect(actionHandler).toHaveBeenCalledTimes(1);
  });

  it('should call onRemove when close button is clicked', () => {
    render(<FeedbackToast feedback={[mockFeedback[0]]} onRemove={mockOnRemove} />);
    
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => 
      button.querySelector('svg') && !button.textContent?.includes('Retry')
    );
    
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton!);
    
    expect(mockOnRemove).toHaveBeenCalledWith('1');
  });

  it('should render correct icons for different feedback types', () => {
    render(<FeedbackToast feedback={mockFeedback} onRemove={mockOnRemove} />);
    
    // Check that SVG elements are rendered (they don't have role="img" by default)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it('should apply correct colors for different feedback types', () => {
    render(<FeedbackToast feedback={mockFeedback} onRemove={mockOnRemove} />);
    
    // Find the toast containers by looking for the parent div with the background color classes
    const successToast = screen.getByText('Success message').closest('.bg-green-500');
    const errorToast = screen.getByText('Error message').closest('.bg-red-500');
    const warningToast = screen.getByText('Warning message').closest('.bg-orange-500');
    const infoToast = screen.getByText('Info message').closest('.bg-blue-500');
    
    expect(successToast).toBeInTheDocument();
    expect(errorToast).toBeInTheDocument();
    expect(warningToast).toBeInTheDocument();
    expect(infoToast).toBeInTheDocument();
  });

  it('should render empty when no feedback provided', () => {
    const { container } = render(<FeedbackToast feedback={[]} onRemove={mockOnRemove} />);
    
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('should handle feedback without action gracefully', () => {
    const feedbackWithoutAction: UserFeedback[] = [{
      id: '1',
      type: 'info',
      message: 'Info without action'
    }];

    render(<FeedbackToast feedback={feedbackWithoutAction} onRemove={mockOnRemove} />);
    
    expect(screen.getByText('Info without action')).toBeInTheDocument();
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });
});