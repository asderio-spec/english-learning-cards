import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner, { LoadingOverlay } from '../LoadingSpinner';
import type { LoadingState } from '../../types';

describe('LoadingSpinner', () => {
  it('should not render when loading is false', () => {
    const loading: LoadingState = { isLoading: false };
    const { container } = render(<LoadingSpinner loading={loading} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render spinner when loading is true', () => {
    const loading: LoadingState = { isLoading: true };
    render(<LoadingSpinner loading={loading} />);
    
    // Look for the spinner by its distinctive classes
    const spinnerElement = document.querySelector('.border-t-blue-600');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('should render loading message when provided', () => {
    const loading: LoadingState = { 
      isLoading: true, 
      message: 'Loading data...' 
    };
    render(<LoadingSpinner loading={loading} />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should render progress bar when progress is provided', () => {
    const loading: LoadingState = { 
      isLoading: true, 
      progress: 75 
    };
    render(<LoadingSpinner loading={loading} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should render both message and progress', () => {
    const loading: LoadingState = { 
      isLoading: true, 
      message: 'Processing...', 
      progress: 50 
    };
    render(<LoadingSpinner loading={loading} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const loading: LoadingState = { isLoading: true };
    const { container } = render(
      <LoadingSpinner loading={loading} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('LoadingOverlay', () => {
  it('should not render when loading is false', () => {
    const loading: LoadingState = { isLoading: false };
    const { container } = render(<LoadingOverlay loading={loading} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should render overlay when loading is true', () => {
    const loading: LoadingState = { isLoading: true };
    render(<LoadingOverlay loading={loading} />);
    
    // Check for overlay background by its distinctive classes
    const overlay = document.querySelector('.fixed.bg-black.bg-opacity-50');
    expect(overlay).toBeInTheDocument();
  });

  it('should render loading content in overlay', () => {
    const loading: LoadingState = { 
      isLoading: true, 
      message: 'Loading overlay...' 
    };
    render(<LoadingOverlay loading={loading} />);
    
    expect(screen.getByText('Loading overlay...')).toBeInTheDocument();
  });

  it('should apply custom className to overlay', () => {
    const loading: LoadingState = { isLoading: true };
    render(<LoadingOverlay loading={loading} className="overlay-custom" />);
    
    const overlay = document.querySelector('.fixed.overlay-custom');
    expect(overlay).toBeInTheDocument();
  });
});