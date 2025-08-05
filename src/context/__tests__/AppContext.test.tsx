import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import type { Grade } from '../../types';

// Test component to interact with the context
const TestComponent = () => {
  const { state, actions } = useAppContext();

  return (
    <div>
      <div data-testid="current-grade">{state.currentGrade || 'none'}</div>
      <div data-testid="card-flipped">{state.isCardFlipped.toString()}</div>
      <div data-testid="auto-play-active">{state.autoPlay.isActive.toString()}</div>
      <div data-testid="auto-play-speed">{state.autoPlay.speed}</div>
      <div data-testid="sentence-index">{state.currentSentenceIndex}</div>
      <div data-testid="important-count">{state.importantSentences.length}</div>
      
      <button onClick={() => actions.setGrade('middle1' as Grade)}>
        Set Grade
      </button>
      <button onClick={() => actions.flipCard()}>
        Flip Card
      </button>
      <button onClick={() => actions.toggleAutoPlay()}>
        Toggle Auto Play
      </button>
      <button onClick={() => actions.setAutoPlaySpeed('fast')}>
        Set Fast Speed
      </button>
      <button onClick={() => actions.toggleImportant('test-sentence-1')}>
        Toggle Important
      </button>
    </div>
  );
};

describe('AppContext', () => {
  it('should provide initial state', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    expect(screen.getByTestId('current-grade')).toHaveTextContent('none');
    expect(screen.getByTestId('card-flipped')).toHaveTextContent('false');
    expect(screen.getByTestId('auto-play-active')).toHaveTextContent('false');
    expect(screen.getByTestId('auto-play-speed')).toHaveTextContent('normal');
    expect(screen.getByTestId('sentence-index')).toHaveTextContent('0');
    expect(screen.getByTestId('important-count')).toHaveTextContent('0');
  });

  it('should update grade when setGrade is called', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Set Grade'));
    expect(screen.getByTestId('current-grade')).toHaveTextContent('middle1');
  });

  it('should flip card when flipCard is called', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Flip Card'));
    expect(screen.getByTestId('card-flipped')).toHaveTextContent('true');
    
    fireEvent.click(screen.getByText('Flip Card'));
    expect(screen.getByTestId('card-flipped')).toHaveTextContent('false');
  });

  it('should toggle auto play when toggleAutoPlay is called', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Toggle Auto Play'));
    expect(screen.getByTestId('auto-play-active')).toHaveTextContent('true');
    
    fireEvent.click(screen.getByText('Toggle Auto Play'));
    expect(screen.getByTestId('auto-play-active')).toHaveTextContent('false');
  });

  it('should update auto play speed when setAutoPlaySpeed is called', async () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Set Fast Speed'));
    
    // Wait for the async action to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(screen.getByTestId('auto-play-speed')).toHaveTextContent('fast');
  });

  it('should toggle important sentences when toggleImportant is called', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    fireEvent.click(screen.getByText('Toggle Important'));
    expect(screen.getByTestId('important-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Toggle Important'));
    expect(screen.getByTestId('important-count')).toHaveTextContent('0');
  });

  it('should throw error when useAppContext is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppContext must be used within an AppProvider');

    console.error = originalError;
  });
});