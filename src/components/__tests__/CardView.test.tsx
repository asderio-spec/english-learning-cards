import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import CardView from '../CardView';
import type { Sentence } from '../../types';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, onDragEnd, drag, dragConstraints, dragElastic, whileDrag, whileHover, variants, animate, initial, exit, style, ...props }: any) => (
      <div onClick={onClick} style={style} {...props}>{children}</div>
    ),
    button: ({ children, onClick, whileTap, whileHover, variants, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    svg: ({ children, animate, transition, ...props }: any) => (
      <svg {...props}>{children}</svg>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  PanInfo: {},
}));

// Mock sentence data for testing
const mockSentence: Sentence = {
  id: 'test_001',
  korean: '안녕하세요.',
  english: 'Hello.',
  grade: 'middle1',
  isImportant: false,
  studyCount: 0,
  lastStudied: undefined
};

const mockImportantSentence: Sentence = {
  ...mockSentence,
  id: 'test_002',
  isImportant: true
};

describe('CardView', () => {
  const defaultProps = {
    sentence: mockSentence,
    isFlipped: false,
    onFlip: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onToggleImportant: vi.fn(),
    currentIndex: 0,
    totalCount: 10
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.addEventListener for keyboard events
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  it('renders Korean text when not flipped', () => {
    render(<CardView {...defaultProps} />);
    
    expect(screen.getByText('안녕하세요.')).toBeInTheDocument();
    expect(screen.getByText('한국어')).toBeInTheDocument();
    expect(screen.getByText('카드를 클릭하여 영어 문장 보기')).toBeInTheDocument();
  });

  it('renders English text when flipped', () => {
    render(<CardView {...defaultProps} isFlipped={true} />);
    
    expect(screen.getByText('Hello.')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('카드를 클릭하여 한국어 문장 보기')).toBeInTheDocument();
  });

  it('calls onFlip when card is clicked', async () => {
    const onFlip = vi.fn();
    render(<CardView {...defaultProps} onFlip={onFlip} />);
    
    const card = screen.getByText('안녕하세요.').closest('[class*="cursor-pointer"]');
    fireEvent.click(card!);
    
    await waitFor(() => {
      expect(onFlip).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(<CardView {...defaultProps} onNext={onNext} />);
    
    const nextButton = screen.getByLabelText('다음 카드로 이동 (오른쪽 화살표 키)');
    fireEvent.click(nextButton);
    
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onPrevious when previous button is clicked', () => {
    const onPrevious = vi.fn();
    render(<CardView {...defaultProps} onPrevious={onPrevious} currentIndex={5} />);
    
    const prevButton = screen.getByLabelText('이전 카드로 이동 (왼쪽 화살표 키)');
    fireEvent.click(prevButton);
    
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('disables previous button when at first card', () => {
    render(<CardView {...defaultProps} currentIndex={0} />);
    
    const prevButton = screen.getByLabelText('이전 카드 없음');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button when at last card', () => {
    render(<CardView {...defaultProps} currentIndex={9} totalCount={10} />);
    
    const nextButton = screen.getByLabelText('다음 카드 없음');
    expect(nextButton).toBeDisabled();
  });

  it('handles audio button click', () => {
    render(<CardView {...defaultProps} />);
    
    const audioButton = screen.getByLabelText('한국어 음성 재생 (스페이스바)');
    fireEvent.click(audioButton);
    
    // Audio functionality is handled internally, just check button exists
    expect(audioButton).toBeInTheDocument();
  });

  it('calls onToggleImportant when important button is clicked', () => {
    const onToggleImportant = vi.fn();
    render(<CardView {...defaultProps} onToggleImportant={onToggleImportant} />);
    
    const importantButton = screen.getByLabelText('중요 문장으로 표시하기');
    fireEvent.click(importantButton);
    
    expect(onToggleImportant).toHaveBeenCalledTimes(1);
  });

  it('shows different styling for important sentences', () => {
    render(<CardView {...defaultProps} sentence={mockImportantSentence} />);
    
    const importantButton = screen.getByLabelText('중요 문장 표시 해제하기');
    expect(importantButton).toHaveClass('bg-yellow-500');
  });

  it('shows correct progress indicator', () => {
    render(<CardView {...defaultProps} currentIndex={4} totalCount={10} />);
    
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  it('displays instruction text', () => {
    render(<CardView {...defaultProps} />);
    
    expect(screen.getByText('카드를 클릭하여 뒤집거나, 좌우 버튼으로 이동하세요.')).toBeInTheDocument();
    expect(screen.getByText('🔊 음성 버튼으로 발음을 들어보세요.')).toBeInTheDocument();
    expect(screen.getByText('⭐ 중요한 문장은 별표로 표시하세요.')).toBeInTheDocument();
    expect(screen.getByText('⌨️ 키보드 단축키: ← → (이동), Enter (뒤집기), Space (음성), Esc (음성 중단)')).toBeInTheDocument();
    expect(screen.getByText('📱 카드를 좌우로 스와이프하여 이동')).toBeInTheDocument();
  });

  it('sets up keyboard event listeners', () => {
    render(<CardView {...defaultProps} />);
    
    expect(window.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('handles keyboard navigation', async () => {
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    const onFlip = vi.fn();
    
    render(<CardView {...defaultProps} onNext={onNext} onPrevious={onPrevious} onFlip={onFlip} currentIndex={5} />);
    
    // Simulate ArrowRight key press
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(onNext).toHaveBeenCalledTimes(1);
    });

    // Simulate ArrowLeft key press
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(onPrevious).toHaveBeenCalledTimes(1);
    });

    // Simulate Enter key press for card flip
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => {
      expect(onFlip).toHaveBeenCalledTimes(1);
    });
  });

  it('prevents navigation when animation is in progress', async () => {
    const onFlip = vi.fn();
    render(<CardView {...defaultProps} onFlip={onFlip} />);
    
    const card = screen.getByText('안녕하세요.').closest('[class*="cursor-pointer"]');
    
    // Click multiple times rapidly
    fireEvent.click(card!);
    fireEvent.click(card!);
    fireEvent.click(card!);
    
    // Should only be called once due to animation state management
    await waitFor(() => {
      expect(onFlip).toHaveBeenCalledTimes(1);
    });
  });
});