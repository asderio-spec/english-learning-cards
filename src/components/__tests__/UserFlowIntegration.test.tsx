import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import App from '../../App';

// Mock TTS Service
vi.mock('../../services/ttsService', () => ({
  ttsService: {
    speak: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
    isSupported: vi.fn().mockReturnValue(true),
    getVoices: vi.fn().mockReturnValue([]),
    getIsPlaying: vi.fn().mockReturnValue(false),
  },
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('User Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should complete full learning flow: grade selection -> card learning -> progress tracking', async () => {
    render(<App />);

    // Step 1: User sees grade selection screen
    expect(screen.getByText('영어 카드 학습')).toBeInTheDocument();
    expect(screen.getByText('학년을 선택하여 학습을 시작하세요')).toBeInTheDocument();

    // Step 2: User selects a grade
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    // Step 3: User should see the card learning interface
    await waitFor(() => {
      expect(screen.getByText(/한국어|English/)).toBeInTheDocument();
    });

    // Step 4: User interacts with cards
    const cardElement = screen.getByRole('button', { name: /카드 뒤집기/ });
    expect(cardElement).toBeInTheDocument();

    // Step 5: User flips the card
    fireEvent.click(cardElement);

    // Step 6: User navigates to next card
    const nextButton = screen.getByLabelText(/다음 카드로 이동/);
    if (!nextButton.hasAttribute('disabled')) {
      fireEvent.click(nextButton);
    }

    // Step 7: User marks a sentence as important
    const importantButton = screen.getByLabelText(/중요 문장/);
    fireEvent.click(importantButton);

    // Step 8: User plays audio
    const audioButton = screen.getByLabelText(/음성 재생/);
    fireEvent.click(audioButton);

    // Verify the flow completed successfully
    expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument(); // Progress indicator
  });

  it('should handle auto-play functionality', async () => {
    render(<App />);

    // Select a grade first
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카드 뒤집기/ })).toBeInTheDocument();
    });

    // Find and activate auto-play
    const autoPlayButton = screen.getByText(/자동 재생/);
    fireEvent.click(autoPlayButton);

    // Verify auto-play is active
    expect(screen.getByText(/중지/)).toBeInTheDocument();
  });

  it('should handle progress dashboard navigation', async () => {
    render(<App />);

    // Select a grade first
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카드 뒤집기/ })).toBeInTheDocument();
    });

    // Look for progress dashboard button
    const progressButton = screen.getByText(/진도/);
    fireEvent.click(progressButton);

    // Should show progress dashboard
    await waitFor(() => {
      expect(screen.getByText(/학습 진도/)).toBeInTheDocument();
    });
  });

  it('should handle keyboard navigation', async () => {
    render(<App />);

    // Select a grade first
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카드 뒤집기/ })).toBeInTheDocument();
    });

    // Test keyboard navigation
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: ' ' }); // Space for audio

    // Should not throw errors and interface should remain functional
    expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
  });

  it('should persist important sentences across sessions', async () => {
    // Mock localStorage to return some saved data
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'english-card-learning-data') {
        return JSON.stringify({
          version: '1.0.0',
          importantSentences: ['test-sentence-1'],
          progress: {},
          preferences: {}
        });
      }
      return null;
    });

    render(<App />);

    // Select a grade
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카드 뒤집기/ })).toBeInTheDocument();
    });

    // Check if important sentences are loaded
    // This would depend on the specific implementation
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('english-card-learning-data');
  });

  it('should handle error states gracefully', async () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    // Select a grade
    const middle1Button = screen.getByLabelText(/중1 학년 선택/);
    fireEvent.click(middle1Button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /카드 뒤집기/ })).toBeInTheDocument();
    });

    // The app should still be functional even if there are errors
    expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});