// Integration test for the complete application flow
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

const mockSpeechSynthesisUtterance = vi.fn().mockImplementation((text: string) => ({
  text,
  lang: '',
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  onstart: null,
  onend: null,
  onerror: null,
}));

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis
});

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance
});

describe('Application Integration Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should render the application without crashing', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Should show grade selector initially
    expect(screen.getByText(/학년을 선택하세요/)).toBeInTheDocument();
  });

  it('should allow grade selection and show cards', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select middle1 grade
    const middle1Button = screen.getByText('중1');
    fireEvent.click(middle1Button);

    // Should show card view
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });
  });

  it('should handle card flipping', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade and wait for cards to load
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Click to flip card
    const card = screen.getByTestId('card-view');
    fireEvent.click(card);

    // Should show flipped state
    await waitFor(() => {
      expect(card).toHaveClass('flipped');
    });
  });

  it('should handle navigation between cards', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Navigate to next card
    const nextButton = screen.getByLabelText('다음 카드');
    fireEvent.click(nextButton);

    // Should update card index
    await waitFor(() => {
      expect(screen.getByTestId('card-counter')).toHaveTextContent('2');
    });
  });

  it('should handle TTS functionality', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Click TTS button
    const ttsButton = screen.getByLabelText('음성 재생');
    fireEvent.click(ttsButton);

    // Should call speech synthesis
    expect(mockSpeechSynthesisUtterance).toHaveBeenCalled();
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
  });

  it('should handle important sentence toggling', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Toggle important
    const importantButton = screen.getByLabelText('중요 표시');
    fireEvent.click(importantButton);

    // Should update important state
    await waitFor(() => {
      expect(importantButton).toHaveClass('important');
    });

    // Should save to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should handle auto play functionality', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Toggle auto play
    const autoPlayButton = screen.getByLabelText('자동 재생');
    fireEvent.click(autoPlayButton);

    // Should show auto play as active
    await waitFor(() => {
      expect(autoPlayButton).toHaveClass('active');
    });
  });

  it('should show progress dashboard', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Select grade
    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Open progress dashboard
    const progressButton = screen.getByLabelText('진도 보기');
    fireEvent.click(progressButton);

    // Should show progress dashboard
    await waitFor(() => {
      expect(screen.getByTestId('progress-dashboard')).toBeInTheDocument();
    });
  });

  it('should persist data across sessions', async () => {
    // First session - mark a sentence as important
    const { unmount } = render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('중요 표시'));
    
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    unmount();

    // Second session - should load the important sentence
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Should show as important
    await waitFor(() => {
      expect(screen.getByLabelText('중요 표시')).toHaveClass('important');
    });
  });

  it('should handle keyboard navigation', async () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Test arrow key navigation
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    
    await waitFor(() => {
      expect(screen.getByTestId('card-counter')).toHaveTextContent('2');
    });

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    
    await waitFor(() => {
      expect(screen.getByTestId('card-counter')).toHaveTextContent('1');
    });

    // Test space bar for card flip
    fireEvent.keyDown(document, { key: ' ' });
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toHaveClass('flipped');
    });
  });

  it('should handle responsive design', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Should show mobile-optimized layout
    expect(document.body).toHaveClass('mobile');
  });

  it('should handle error states gracefully', async () => {
    // Mock localStorage error
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('중1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('card-view')).toBeInTheDocument();
    });

    // Should still work despite storage error
    fireEvent.click(screen.getByLabelText('중요 표시'));
    
    // Should not crash the app
    expect(screen.getByTestId('card-view')).toBeInTheDocument();
  });
});