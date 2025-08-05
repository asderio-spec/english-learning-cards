// Progress Service Integration tests
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import type { Grade } from '../../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock dataService
vi.mock('../../services/dataService', () => ({
  dataService: {
    getSentencesByGrade: vi.fn((grade: Grade) => {
      return Array.from({ length: 5 }, (_, i) => ({
        id: `${grade}-${i}`,
        korean: `한글 문장 ${i}`,
        english: `English sentence ${i}`,
        grade,
        isImportant: false,
        studyCount: 0,
        lastStudied: undefined
      }));
    }),
    updateStudyCount: vi.fn(),
  },
}));

// Test component to access context
const TestComponent = () => {
  const { state, actions } = useAppContext();
  
  return (
    <div>
      <div data-testid="current-grade">{state.currentGrade || 'none'}</div>
      <div data-testid="progress-studied">{state.progress.middle1?.studiedSentences || 0}</div>
      <div data-testid="progress-completion">{state.progress.middle1?.completionRate || 0}</div>
      <div data-testid="progress-streak">{state.progress.middle1?.streak || 0}</div>
      <button 
        data-testid="update-progress" 
        onClick={() => actions.updateProgress('middle1', 'middle1-0')}
      >
        Update Progress
      </button>
      <button 
        data-testid="get-streak" 
        onClick={() => {
          const streak = actions.getCurrentStreak();
          const element = document.getElementById('streak-result');
          if (element) element.textContent = streak.toString();
        }}
      >
        Get Streak
      </button>
      <div id="streak-result" data-testid="streak-result">0</div>
    </div>
  );
};

describe('Progress Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Mock Date for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should integrate progress service with context', async () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Initial state
    expect(getByTestId('progress-studied')).toHaveTextContent('0');
    expect(getByTestId('progress-completion')).toHaveTextContent('0');
    expect(getByTestId('progress-streak')).toHaveTextContent('0');

    // Update progress
    await act(async () => {
      getByTestId('update-progress').click();
    });

    // Check updated state
    expect(getByTestId('progress-studied')).toHaveTextContent('1');
    expect(getByTestId('progress-completion')).toHaveTextContent('20'); // 1/5 * 100
    expect(getByTestId('progress-streak')).toHaveTextContent('1');
  });

  it('should track streak correctly across multiple updates', async () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // First study session
    await act(async () => {
      getByTestId('update-progress').click();
    });

    // Get streak
    await act(async () => {
      getByTestId('get-streak').click();
    });
    expect(getByTestId('streak-result')).toHaveTextContent('1');

    // Next day
    vi.setSystemTime(new Date('2024-01-16T10:00:00Z'));
    
    await act(async () => {
      getByTestId('update-progress').click();
    });

    await act(async () => {
      getByTestId('get-streak').click();
    });
    expect(getByTestId('streak-result')).toHaveTextContent('2');
  });

  it('should persist progress data', async () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await act(async () => {
      getByTestId('update-progress').click();
    });

    // Verify localStorage was called with the unified storage key
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'english-card-learning-data',
      expect.any(String)
    );
  });

  it('should provide access to progress service methods through actions', async () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    await act(async () => {
      getByTestId('update-progress').click();
    });

    // Test that we can access progress service methods
    const TestComponentWithMethods = () => {
      const { actions } = useAppContext();
      
      return (
        <div>
          <button 
            data-testid="get-overall-progress"
            onClick={() => {
              const overall = actions.getOverallProgress();
              const element = document.getElementById('overall-result');
              if (element) element.textContent = overall.totalStudiedSentences.toString();
            }}
          >
            Get Overall Progress
          </button>
          <div id="overall-result" data-testid="overall-result">0</div>
          
          <button 
            data-testid="check-studied"
            onClick={() => {
              const isStudied = actions.isSentenceStudied('middle1', 'middle1-0');
              const element = document.getElementById('studied-result');
              if (element) element.textContent = isStudied.toString();
            }}
          >
            Check if Studied
          </button>
          <div id="studied-result" data-testid="studied-result">false</div>
        </div>
      );
    };

    const { getByTestId: getByTestId2 } = render(
      <AppProvider>
        <TestComponentWithMethods />
      </AppProvider>
    );

    await act(async () => {
      getByTestId2('get-overall-progress').click();
    });
    expect(getByTestId2('overall-result')).toHaveTextContent('1');

    await act(async () => {
      getByTestId2('check-studied').click();
    });
    expect(getByTestId2('studied-result')).toHaveTextContent('true');
  });
});