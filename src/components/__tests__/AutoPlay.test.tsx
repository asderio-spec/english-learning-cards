import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AutoPlay from '../AutoPlay';
import type { PlaybackSpeed } from '../../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { animate, initial, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      const { animate, initial, exit, transition, variants, whileTap, whileHover, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
  },
}));

describe('AutoPlay Component', () => {
  const mockProps = {
    isActive: false,
    speed: 'normal' as PlaybackSpeed,
    onToggle: vi.fn(),
    onSpeedChange: vi.fn(),
    onNext: vi.fn(),
    onFlip: vi.fn(),
    isCardFlipped: false,
    currentIndex: 0,
    totalCount: 10,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders auto play controls correctly', () => {
    render(<AutoPlay {...mockProps} />);
    
    expect(screen.getByText('자동 재생 시작')).toBeInTheDocument();
    expect(screen.getByText('재생 속도')).toBeInTheDocument();
    expect(screen.getByText('느림')).toBeInTheDocument();
    expect(screen.getByText('보통')).toBeInTheDocument();
    expect(screen.getByText('빠름')).toBeInTheDocument();
  });

  it('shows correct button text when active', () => {
    render(<AutoPlay {...mockProps} isActive={true} />);
    
    expect(screen.getByText('자동 재생 중단')).toBeInTheDocument();
    expect(screen.getByText('자동 재생 중 (보통)')).toBeInTheDocument();
  });

  it('calls onToggle when auto play button is clicked', () => {
    render(<AutoPlay {...mockProps} />);
    
    const toggleButton = screen.getByText('자동 재생 시작');
    fireEvent.click(toggleButton);
    
    expect(mockProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onSpeedChange when speed button is clicked', () => {
    render(<AutoPlay {...mockProps} />);
    
    const fastButton = screen.getByText('빠름');
    fireEvent.click(fastButton);
    
    expect(mockProps.onSpeedChange).toHaveBeenCalledWith('fast');
  });

  it('highlights selected speed', () => {
    render(<AutoPlay {...mockProps} speed="fast" />);
    
    const fastButton = screen.getByText('빠름').closest('button');
    expect(fastButton).toHaveClass('bg-blue-600');
  });

  it('shows progress indicator with correct percentage', () => {
    render(<AutoPlay {...mockProps} currentIndex={2} totalCount={10} />);
    
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('executes auto play sequence when active', async () => {
    const props = {
      ...mockProps,
      isActive: true,
      speed: 'fast' as PlaybackSpeed, // 1500ms intervals
    };

    render(<AutoPlay {...props} />);

    // Fast forward time to trigger first action (flip card)
    vi.advanceTimersByTime(1500);
    
    expect(props.onFlip).toHaveBeenCalledTimes(1);
  });

  it('moves to next card after showing both sides', async () => {
    const props = {
      ...mockProps,
      isActive: true,
      isCardFlipped: true, // Card is already flipped
      speed: 'fast' as PlaybackSpeed,
    };

    render(<AutoPlay {...props} />);

    // Fast forward time to trigger next action (next card)
    vi.advanceTimersByTime(1500);
    
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });

  it('stops auto play when reaching the end', async () => {
    const props = {
      ...mockProps,
      isActive: true,
      isCardFlipped: true,
      currentIndex: 9, // Last card
      totalCount: 10,
      speed: 'fast' as PlaybackSpeed,
    };

    render(<AutoPlay {...props} />);

    // Fast forward time
    vi.advanceTimersByTime(1500);
    
    expect(props.onToggle).toHaveBeenCalledTimes(1);
  });

  it('uses correct timing for different speeds', () => {
    const slowProps = { ...mockProps, isActive: true, speed: 'slow' as PlaybackSpeed };
    const normalProps = { ...mockProps, isActive: true, speed: 'normal' as PlaybackSpeed };
    const fastProps = { ...mockProps, isActive: true, speed: 'fast' as PlaybackSpeed };

    // Test slow speed (4000ms)
    const { rerender } = render(<AutoPlay {...slowProps} />);
    vi.advanceTimersByTime(3999);
    expect(slowProps.onFlip).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(slowProps.onFlip).toHaveBeenCalledTimes(1);

    // Test normal speed (2500ms)
    vi.clearAllMocks();
    rerender(<AutoPlay {...normalProps} />);
    vi.advanceTimersByTime(2499);
    expect(normalProps.onFlip).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(normalProps.onFlip).toHaveBeenCalledTimes(1);

    // Test fast speed (1500ms)
    vi.clearAllMocks();
    rerender(<AutoPlay {...fastProps} />);
    vi.advanceTimersByTime(1499);
    expect(fastProps.onFlip).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fastProps.onFlip).toHaveBeenCalledTimes(1);
  });

  it('clears timer when component unmounts', () => {
    const { unmount } = render(<AutoPlay {...mockProps} isActive={true} />);
    
    // Start auto play
    vi.advanceTimersByTime(100);
    
    // Unmount component
    unmount();
    
    // Timer should be cleared, so advancing time shouldn't trigger callbacks
    vi.advanceTimersByTime(5000);
    expect(mockProps.onFlip).not.toHaveBeenCalled();
  });

  it('restarts timer when speed changes during active auto play', async () => {
    const props = {
      ...mockProps,
      isActive: true,
      speed: 'normal' as PlaybackSpeed,
    };

    const { rerender } = render(<AutoPlay {...props} />);

    // Advance time partially
    vi.advanceTimersByTime(1000);
    expect(props.onFlip).not.toHaveBeenCalled();

    // Change speed to fast
    rerender(<AutoPlay {...props} speed="fast" />);

    // Should trigger after fast interval (1500ms from restart)
    vi.advanceTimersByTime(1500);
    
    expect(props.onFlip).toHaveBeenCalledTimes(1);
  });

  it('shows instructions text', () => {
    render(<AutoPlay {...mockProps} />);
    
    expect(screen.getByText(/자동 재생 시 각 카드의 한글과 영문을 차례로 보여줍니다/)).toBeInTheDocument();
    expect(screen.getByText(/수동으로 카드를 조작하면 자동 재생이 일시 정지됩니다/)).toBeInTheDocument();
  });
});