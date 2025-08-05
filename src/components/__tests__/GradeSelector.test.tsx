import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GradeSelector from '../GradeSelector';
import { AppProvider } from '../../context/AppContext';
import { dataService } from '../../services/dataService';

// Mock the dataService
vi.mock('../../services/dataService', () => ({
  dataService: {
    getSentencesByGrade: vi.fn(),
  },
}));

const mockDataService = dataService as any;

// Test wrapper with AppProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('GradeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock default return value
    mockDataService.getSentencesByGrade.mockReturnValue([
      { id: '1', korean: '안녕하세요', english: 'Hello', grade: 'middle1', isImportant: false, studyCount: 0 },
      { id: '2', korean: '감사합니다', english: 'Thank you', grade: 'middle1', isImportant: false, studyCount: 0 },
    ]);
  });

  it('renders grade selection interface', () => {
    render(
      <TestWrapper>
        <GradeSelector />
      </TestWrapper>
    );

    // Check title
    expect(screen.getByText('영어 카드 학습')).toBeInTheDocument();
    expect(screen.getByText('학년을 선택하여 학습을 시작하세요')).toBeInTheDocument();

    // Check grade categories
    expect(screen.getByText('중학교')).toBeInTheDocument();
    expect(screen.getByText('고등학교')).toBeInTheDocument();

    // Check all grade buttons
    expect(screen.getByText('중1')).toBeInTheDocument();
    expect(screen.getByText('중2')).toBeInTheDocument();
    expect(screen.getByText('중3')).toBeInTheDocument();
    expect(screen.getByText('고1')).toBeInTheDocument();
    expect(screen.getByText('고2')).toBeInTheDocument();
    expect(screen.getByText('고3')).toBeInTheDocument();
  });

  it('displays sentence count for each grade', () => {
    render(
      <TestWrapper>
        <GradeSelector />
      </TestWrapper>
    );

    // Should show sentence count (mocked to return 2 sentences)
    const sentenceCountElements = screen.getAllByText('2개 문장');
    expect(sentenceCountElements).toHaveLength(6); // 6 grades
  });

  it('handles grade selection', async () => {
    const onGradeSelect = vi.fn();
    
    render(
      <TestWrapper>
        <GradeSelector onGradeSelect={onGradeSelect} />
      </TestWrapper>
    );

    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(mockDataService.getSentencesByGrade).toHaveBeenCalledWith('middle1');
      expect(onGradeSelect).toHaveBeenCalledWith('middle1');
    });
  });

  it('shows selected grade with visual indicator', () => {
    render(
      <TestWrapper>
        <GradeSelector selectedGrade="middle1" />
      </TestWrapper>
    );

    const middle1Button = screen.getByLabelText(/중1 학년 선택.*현재 선택됨/);
    expect(middle1Button).toHaveAttribute('aria-pressed', 'true');
    expect(middle1Button).toHaveClass('border-blue-600', 'bg-blue-50', 'text-blue-800');
  });

  it('handles empty sentence data gracefully', async () => {
    mockDataService.getSentencesByGrade.mockReturnValue([]);
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <TestWrapper>
        <GradeSelector />
      </TestWrapper>
    );

    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('No sentences found for grade: middle1');
    });

    consoleSpy.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <GradeSelector />
      </TestWrapper>
    );

    // Check aria-labels
    expect(screen.getByLabelText(/중1 학년 선택/)).toBeInTheDocument();
    expect(screen.getByLabelText(/중2 학년 선택/)).toBeInTheDocument();
    expect(screen.getByLabelText(/중3 학년 선택/)).toBeInTheDocument();
    expect(screen.getByLabelText(/고1 학년 선택/)).toBeInTheDocument();
    expect(screen.getByLabelText(/고2 학년 선택/)).toBeInTheDocument();
    expect(screen.getByLabelText(/고3 학년 선택/)).toBeInTheDocument();
  });

  it('is responsive and mobile-friendly', () => {
    render(
      <TestWrapper>
        <GradeSelector />
      </TestWrapper>
    );

    // Check for responsive classes
    const gradeButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('선택')
    );

    gradeButtons.forEach(button => {
      expect(button).toHaveClass('hover:scale-105'); // Mobile-friendly hover effect
      expect(button).toHaveClass('focus:ring-4'); // Focus indicator
    });

    // Check for mobile-specific text
    expect(screen.getByText('카드를 터치하여 선택하세요')).toBeInTheDocument();
  });
});