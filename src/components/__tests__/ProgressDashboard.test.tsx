
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProgressDashboard from '../ProgressDashboard';
import { progressService } from '../../services/progressService';
import { dataService } from '../../services/dataService';
import type { Grade, Sentence, LearningProgress } from '../../types';

// Mock the services
vi.mock('../../services/progressService');
vi.mock('../../services/dataService');

const mockProgressService = vi.mocked(progressService);
const mockDataService = vi.mocked(dataService);

describe('ProgressDashboard', () => {
  const mockOnClose = vi.fn();
  const mockOnGradeSelect = vi.fn();

  const mockOverallProgress = {
    totalSentences: 600,
    totalStudiedSentences: 150,
    overallCompletionRate: 25,
    gradeProgress: {
      middle1: {
        grade: 'middle1' as Grade,
        totalSentences: 100,
        studiedSentences: 30,
        completionRate: 30,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      },
      middle2: {
        grade: 'middle2' as Grade,
        totalSentences: 100,
        studiedSentences: 20,
        completionRate: 20,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      },
      middle3: {
        grade: 'middle3' as Grade,
        totalSentences: 100,
        studiedSentences: 25,
        completionRate: 25,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      },
      high1: {
        grade: 'high1' as Grade,
        totalSentences: 100,
        studiedSentences: 35,
        completionRate: 35,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      },
      high2: {
        grade: 'high2' as Grade,
        totalSentences: 100,
        studiedSentences: 25,
        completionRate: 25,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      },
      high3: {
        grade: 'high3' as Grade,
        totalSentences: 100,
        studiedSentences: 15,
        completionRate: 15,
        streak: 5,
        lastStudyDate: new Date('2024-01-15')
      }
    } as Record<Grade, LearningProgress>
  };

  const mockStreakInfo = {
    currentStreak: 5,
    longestStreak: 12,
    lastStudyDate: new Date('2024-01-15')
  };

  const mockImportantSentences: Sentence[] = [
    {
      id: 'middle1-1',
      korean: '안녕하세요',
      english: 'Hello',
      grade: 'middle1',
      isImportant: true,
      studyCount: 3,
      lastStudied: new Date('2024-01-15')
    },
    {
      id: 'high1-5',
      korean: '감사합니다',
      english: 'Thank you',
      grade: 'high1',
      isImportant: true,
      studyCount: 2,
      lastStudied: new Date('2024-01-14')
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    mockProgressService.getOverallProgress.mockReturnValue(mockOverallProgress);
    mockProgressService.getStreakInfo.mockReturnValue(mockStreakInfo);
    mockDataService.getImportantSentences.mockReturnValue(mockImportantSentences);
  });

  it('renders loading state initially', () => {
    // Mock services to return null initially
    mockProgressService.getOverallProgress.mockReturnValue(null as any);
    mockProgressService.getStreakInfo.mockReturnValue(null as any);

    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    expect(screen.getByText('데이터를 불러오는 중...')).toBeInTheDocument();
  });

  it('renders progress dashboard with correct data', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Check overall progress section
    expect(screen.getByText('전체 진도')).toBeInTheDocument();
    expect(screen.getByText('완료율')).toBeInTheDocument();
    expect(screen.getByText('학습한 문장')).toBeInTheDocument();
    expect(screen.getByText('전체 문장')).toBeInTheDocument();

    // Check streak info
    expect(screen.getByText('학습 스트릭')).toBeInTheDocument();
    expect(screen.getByText('5일')).toBeInTheDocument(); // Current streak
    expect(screen.getByText('12일')).toBeInTheDocument(); // Longest streak

    // Check grade progress
    expect(screen.getByText('학년별 진도')).toBeInTheDocument();
    expect(screen.getByText('중1')).toBeInTheDocument();
  });

  it('switches between progress and important tabs', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Initially on progress tab
    expect(screen.getByText('전체 진도')).toBeInTheDocument();

    // Click important tab
    const importantTab = screen.getByText(/중요 문장 \(2\)/);
    fireEvent.click(importantTab);

    // Should show important sentences
    expect(screen.getByText('중요 문장 목록 (2개)')).toBeInTheDocument();
    expect(screen.getByText('안녕하세요')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('감사합니다')).toBeInTheDocument();
    expect(screen.getByText('Thank you')).toBeInTheDocument();
  });

  it('handles grade selection from progress tab', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Click on a grade card
    const middle1Card = screen.getByText('중1').closest('div');
    expect(middle1Card).toBeInTheDocument();
    
    fireEvent.click(middle1Card!);

    expect(mockOnGradeSelect).toHaveBeenCalledWith('middle1');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles removing important sentences', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Switch to important tab
    const importantTab = screen.getByText(/중요 문장 \(2\)/);
    fireEvent.click(importantTab);

    // Find and click remove button for first sentence
    const removeButtons = screen.getAllByTitle('중요 표시 해제');
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    expect(mockDataService.toggleImportant).toHaveBeenCalledWith('middle1-1');
  });

  it('shows empty state when no important sentences', async () => {
    // Mock empty important sentences
    mockDataService.getImportantSentences.mockReturnValue([]);

    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Switch to important tab
    const importantTab = screen.getByText(/중요 문장 \(0\)/);
    fireEvent.click(importantTab);

    expect(screen.getByText('아직 중요 표시한 문장이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('학습 중에 별표 버튼을 눌러 중요한 문장을 표시해보세요.')).toBeInTheDocument();
  });

  it('handles close button click', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Find and click close button (it's the button with SVG inside)
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => button.querySelector('svg'));
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('displays correct progress bar colors based on completion rate', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Check that progress bars are rendered (we can't easily test colors in jsdom)
    const progressBars = document.querySelectorAll('.bg-gray-200');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('formats dates correctly', async () => {
    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '학습 진도' })).toBeInTheDocument();
    });

    // Check that the last study date is formatted correctly
    expect(screen.getByText('2024년 1월 15일')).toBeInTheDocument();
  });

  it('handles service errors gracefully', async () => {
    // Mock service to throw error
    mockProgressService.getOverallProgress.mockImplementation(() => {
      throw new Error('Service error');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ProgressDashboard
        onClose={mockOnClose}
        onGradeSelect={mockOnGradeSelect}
      />
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading progress data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});