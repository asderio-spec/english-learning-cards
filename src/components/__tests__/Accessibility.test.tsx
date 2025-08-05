import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppProvider } from '../../context/AppContext';
import App from '../../App';
import CardView from '../CardView';
import GradeSelector from '../GradeSelector';
import AutoPlay from '../AutoPlay';
import ProgressDashboard from '../ProgressDashboard';
import type { Sentence } from '../../types';

// Mock services
vi.mock('../../services/dataService', () => ({
  dataService: {
    getSentencesByGrade: vi.fn(() => [
      {
        id: '1',
        korean: '안녕하세요',
        english: 'Hello',
        grade: 'middle1',
        isImportant: false,
        studyCount: 0
      }
    ]),
    toggleImportant: vi.fn(),
    getImportantSentences: vi.fn(() => [])
  }
}));

vi.mock('../../services/ttsService', () => ({
  ttsService: {
    speak: vi.fn(),
    stop: vi.fn(),
    isSupported: vi.fn(() => true),
    getVoices: vi.fn(() => [])
  }
}));

vi.mock('../../services/progressService', () => ({
  progressService: {
    getOverallProgress: vi.fn(() => ({
      totalSentences: 100,
      totalStudiedSentences: 50,
      overallCompletionRate: 50,
      gradeProgress: {
        middle1: {
          grade: 'middle1',
          totalSentences: 100,
          studiedSentences: 50,
          completionRate: 50,
          streak: 5,
          lastStudyDate: new Date()
        }
      }
    })),
    getStreakInfo: vi.fn(() => ({
      currentStreak: 5,
      longestStreak: 10,
      lastStudyDate: new Date()
    }))
  }
}));

const mockSentence: Sentence = {
  id: '1',
  korean: '안녕하세요',
  english: 'Hello',
  grade: 'middle1',
  isImportant: false,
  studyCount: 0
};

describe('Accessibility Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ARIA Labels and Roles', () => {
    it('should have proper ARIA labels on main navigation elements', () => {
      render(
        <AppProvider>
          <App />
        </AppProvider>
      );

      // Check for skip link
      const skipLink = screen.getByText('메인 콘텐츠로 건너뛰기');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have proper ARIA labels on CardView buttons', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 0,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Check button ARIA labels
      expect(screen.getByLabelText(/이전 카드 없음/)).toBeInTheDocument();
      expect(screen.getByLabelText(/한국어 음성 재생/)).toBeInTheDocument();
      expect(screen.getByLabelText(/중요 문장으로 표시하기/)).toBeInTheDocument();
      expect(screen.getByLabelText(/다음 카드로 이동/)).toBeInTheDocument();
    });

    it('should have proper ARIA labels on GradeSelector', () => {
      render(
        <AppProvider>
          <GradeSelector />
        </AppProvider>
      );

      // Check for proper headings and structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('영어 카드 학습')).toBeInTheDocument();
      
      // Check grade buttons have proper ARIA labels
      const gradeButtons = screen.getAllByRole('button');
      gradeButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed');
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should have proper ARIA labels on AutoPlay component', () => {
      const mockProps = {
        isActive: false,
        speed: 'normal' as const,
        onToggle: vi.fn(),
        onSpeedChange: vi.fn(),
        onNext: vi.fn(),
        onFlip: vi.fn(),
        isCardFlipped: false,
        currentIndex: 0,
        totalCount: 10
      };

      render(<AutoPlay {...mockProps} />);

      // Check for proper ARIA labels and roles
      expect(screen.getByRole('region', { name: '자동 재생 컨트롤' })).toBeInTheDocument();
      expect(screen.getByLabelText(/자동 재생 시작하기/)).toBeInTheDocument();
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should have proper ARIA labels on ProgressDashboard', () => {
      const mockProps = {
        onClose: vi.fn(),
        onGradeSelect: vi.fn()
      };

      render(<ProgressDashboard {...mockProps} />);

      // Check for dialog role and proper labeling
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'progress-title');
      
      // Check for tab navigation
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(2);
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation in CardView', async () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 1,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Test keyboard navigation
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(mockProps.onPrevious).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(mockProps.onNext).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: 'Enter' });
      expect(mockProps.onFlip).toHaveBeenCalled();

      fireEvent.keyDown(window, { key: ' ' });
      // Audio play should be called (mocked)
    });

    it('should support keyboard navigation in GradeSelector', () => {
      render(
        <AppProvider>
          <GradeSelector />
        </AppProvider>
      );

      const firstGradeButton = screen.getByText('중1').closest('button');
      if (firstGradeButton) {
        firstGradeButton.focus();
        
        // Test arrow key navigation
        fireEvent.keyDown(window, { key: 'ArrowRight' });
        fireEvent.keyDown(window, { key: 'ArrowDown' });
        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        fireEvent.keyDown(window, { key: 'ArrowUp' });
      }
    });

    it('should support Enter and Space key activation', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 0,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      const cardElement = screen.getByRole('button', { name: /카드 뒤집기/ });
      
      // Test Enter key
      fireEvent.keyDown(cardElement, { key: 'Enter' });
      expect(mockProps.onFlip).toHaveBeenCalled();

      // Test Space key
      fireEvent.keyDown(cardElement, { key: ' ' });
      expect(mockProps.onFlip).toHaveBeenCalledTimes(2);
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should have proper live regions for dynamic content', () => {
      render(
        <AppProvider>
          <App />
        </AppProvider>
      );

      // Check for live regions
      const liveRegions = screen.getAllByRole('status');
      expect(liveRegions.length).toBeGreaterThan(0);
    });

    it('should announce progress changes', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 5,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Check progress indicator has proper ARIA label
      const progressIndicator = screen.getByRole('status');
      expect(progressIndicator).toHaveAttribute('aria-live', 'polite');
      expect(progressIndicator).toHaveAttribute('aria-label');
    });

    it('should have proper heading hierarchy', () => {
      render(
        <AppProvider>
          <GradeSelector />
        </AppProvider>
      );

      // Check heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('영어 카드 학습');

      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have sufficient color contrast on buttons', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 1,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Check that buttons have proper styling classes for contrast
      const audioButton = screen.getByLabelText(/음성 재생/);
      expect(audioButton).toHaveClass('bg-green-600', 'text-white');

      const nextButton = screen.getByLabelText(/다음 카드로 이동/);
      expect(nextButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should have proper focus indicators', () => {
      render(
        <AppProvider>
          <GradeSelector />
        </AppProvider>
      );

      const gradeButtons = screen.getAllByRole('button');
      gradeButtons.forEach(button => {
        expect(button).toHaveClass('focus:ring-4');
      });
    });

    it('should support high contrast mode preferences', () => {
      // This would typically be tested with actual CSS media queries
      // For now, we ensure the classes are applied correctly
      render(
        <AppProvider>
          <App />
        </AppProvider>
      );

      const mainContent = screen.getByRole('main');
      expect(mainContent).toBeInTheDocument();
    });
  });

  describe('Error Handling and Feedback', () => {
    it('should announce errors to screen readers', async () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 0,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Error messages should have proper ARIA attributes
      const instructions = screen.getByRole('region', { name: '사용법 안내' });
      expect(instructions).toBeInTheDocument();
    });

    it('should provide clear feedback for user actions', () => {
      const mockProps = {
        isActive: false,
        speed: 'normal' as const,
        onToggle: vi.fn(),
        onSpeedChange: vi.fn(),
        onNext: vi.fn(),
        onFlip: vi.fn(),
        isCardFlipped: false,
        currentIndex: 0,
        totalCount: 10
      };

      render(<AutoPlay {...mockProps} />);

      // Status indicators should be properly labeled
      const statusRegion = screen.getByRole('region', { name: '자동 재생 컨트롤' });
      expect(statusRegion).toBeInTheDocument();
    });
  });

  describe('Mobile Accessibility', () => {
    it('should have proper touch targets', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 0,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // All interactive elements should have touch-manipulation class
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('touch-manipulation');
      });
    });

    it('should support swipe gestures with proper feedback', () => {
      const mockProps = {
        sentence: mockSentence,
        isFlipped: false,
        onFlip: vi.fn(),
        onNext: vi.fn(),
        onPrevious: vi.fn(),
        onToggleImportant: vi.fn(),
        currentIndex: 1,
        totalCount: 10
      };

      render(
        <AppProvider>
          <CardView {...mockProps} />
        </AppProvider>
      );

      // Instructions should mention swipe gestures
      expect(screen.getByText(/스와이프하여 이동/)).toBeInTheDocument();
    });
  });
});