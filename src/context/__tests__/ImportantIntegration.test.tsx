import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';
import type { Grade } from '../../types';

// Test component to interact with context
const TestComponent: React.FC = () => {
  const { state, actions } = useAppContext();
  
  const mockSentences = [
    {
      id: 'test_001',
      korean: '안녕하세요.',
      english: 'Hello.',
      grade: 'middle1' as Grade,
      isImportant: false,
      studyCount: 0,
    },
    {
      id: 'test_002',
      korean: '감사합니다.',
      english: 'Thank you.',
      grade: 'middle1' as Grade,
      isImportant: false,
      studyCount: 0,
    }
  ];
  
  return (
    <div>
      <div data-testid="sentences-count">{state.sentences.length}</div>
      <div data-testid="important-count">{state.importantSentences.length}</div>
      <div data-testid="current-sentence-important">
        {state.sentences[state.currentSentenceIndex]?.isImportant ? 'true' : 'false'}
      </div>
      
      <button 
        data-testid="set-sentences" 
        onClick={() => actions.setSentences(mockSentences)}
      >
        Set Sentences
      </button>
      
      <button 
        data-testid="toggle-important" 
        onClick={() => {
          const currentSentence = state.sentences[state.currentSentenceIndex];
          if (currentSentence) {
            actions.toggleImportant(currentSentence.id);
          }
        }}
      >
        Toggle Important
      </button>
    </div>
  );
};

describe('Important Functionality Integration', () => {
  it('should update important sentences in state when toggled', () => {
    render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );

    // Set sentences first
    fireEvent.click(screen.getByTestId('set-sentences'));
    
    // Check initial state
    expect(screen.getByTestId('sentences-count')).toHaveTextContent('2');
    expect(screen.getByTestId('current-sentence-important')).toHaveTextContent('false');
    expect(screen.getByTestId('important-count')).toHaveTextContent('0');

    // Toggle important
    fireEvent.click(screen.getByTestId('toggle-important'));

    // Check state updates
    expect(screen.getByTestId('current-sentence-important')).toHaveTextContent('true');
    expect(screen.getByTestId('important-count')).toHaveTextContent('1');

    // Toggle back
    fireEvent.click(screen.getByTestId('toggle-important'));

    // Check state reverts
    expect(screen.getByTestId('current-sentence-important')).toHaveTextContent('false');
    expect(screen.getByTestId('important-count')).toHaveTextContent('0');
  });
});