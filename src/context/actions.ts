import type { AppAction, Grade, Sentence, PlaybackSpeed, AppState, LearningProgress, AppError, LoadingState, UserFeedback } from '../types';
import { progressService } from '../services/progressService';
import { preferencesService } from '../services/preferencesService';
import { dataService } from '../services/dataService';

// Action creators for better type safety and reusability
export const createActions = (dispatch: React.Dispatch<AppAction>) => ({
  // Grade and sentence management
  setGrade: (grade: Grade | undefined) => {
    dispatch({ type: 'SET_GRADE', payload: grade });
  },

  setSentences: (sentences: Sentence[]) => {
    dispatch({ type: 'SET_SENTENCES', payload: sentences });
  },

  setCurrentSentenceIndex: (index: number) => {
    dispatch({ type: 'SET_CURRENT_SENTENCE_INDEX', payload: index });
  },

  // Card interaction
  flipCard: () => {
    dispatch({ type: 'FLIP_CARD' });
  },

  // Important sentences
  toggleImportant: (sentenceId: string) => {
    // Update data service first (handles localStorage)
    dataService.toggleImportant(sentenceId);
    // Then update local state
    dispatch({ type: 'TOGGLE_IMPORTANT', payload: sentenceId });
  },

  // Auto play controls
  toggleAutoPlay: () => {
    dispatch({ type: 'TOGGLE_AUTO_PLAY' });
  },

  setAutoPlaySpeed: async (speed: PlaybackSpeed) => {
    // Save to preferences service
    try {
      await preferencesService.setAutoPlaySpeed(speed);
    } catch (error) {
      console.error('Failed to save auto play speed preference:', error);
    }
    // Update local state
    dispatch({ type: 'SET_AUTO_PLAY_SPEED', payload: speed });
  },

  // Progress tracking
  updateProgress: (grade: Grade, sentenceId: string) => {
    dispatch({ type: 'UPDATE_PROGRESS', payload: { grade, sentenceId } });
  },

  // Data loading
  loadStoredData: (data: Partial<AppState>) => {
    dispatch({ type: 'LOAD_STORED_DATA', payload: data });
  },

  // Navigation helpers
  nextSentence: (currentIndex: number, totalSentences: number) => {
    const nextIndex = currentIndex < totalSentences - 1 ? currentIndex + 1 : 0;
    dispatch({ type: 'SET_CURRENT_SENTENCE_INDEX', payload: nextIndex });
  },

  previousSentence: (currentIndex: number, totalSentences: number) => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalSentences - 1;
    dispatch({ type: 'SET_CURRENT_SENTENCE_INDEX', payload: prevIndex });
  },

  // Progress service helpers
  getProgressForGrade: (grade: Grade) => {
    return progressService.getProgress(grade);
  },

  getCurrentStreak: () => {
    return progressService.getStreak();
  },

  getStreakInfo: () => {
    return progressService.getStreakInfo();
  },

  getOverallProgress: () => {
    return progressService.getOverallProgress();
  },

  isSentenceStudied: (grade: Grade, sentenceId: string) => {
    return progressService.isSentenceStudied(grade, sentenceId);
  },

  resetGradeProgress: (grade: Grade) => {
    progressService.resetGradeProgress(grade);
    // Refresh the progress in state
    const updatedProgress = progressService.getProgress(grade);
    dispatch({ type: 'LOAD_STORED_DATA', payload: { 
      progress: { [grade]: updatedProgress } as Record<Grade, LearningProgress>
    }});
  },

  // Storage management actions
  clearAllData: async () => {
    try {
      await dataService.clearStoredData();
      await progressService.resetAllProgress();
      // Reset state to initial values
      dispatch({ type: 'LOAD_STORED_DATA', payload: {
        currentGrade: undefined,
        currentSentenceIndex: 0,
        sentences: [],
        isCardFlipped: false,
        autoPlay: { isActive: false, speed: 'normal' },
        progress: {} as Record<Grade, LearningProgress>,
        importantSentences: []
      }});
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  },

  // Preferences management
  updateUserPreferences: async (preferences: any) => {
    try {
      await preferencesService.updatePreferences(preferences);
    } catch (error) {
      console.error('Failed to update user preferences:', error);
    }
  },

  getUserPreferences: async () => {
    try {
      return await preferencesService.getAllPreferences();
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return null;
    }
  },

  // Error handling actions
  addError: (error: AppError) => {
    dispatch({ type: 'ADD_ERROR', payload: error });
  },

  removeError: (errorId: string) => {
    dispatch({ type: 'REMOVE_ERROR', payload: errorId });
  },

  clearErrors: () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  },

  // Loading state actions
  setLoading: (loading: LoadingState) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  },

  // User feedback actions
  addFeedback: (feedback: UserFeedback) => {
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    
    // Auto-remove feedback after duration (default 5 seconds)
    const duration = feedback.duration || 5000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FEEDBACK', payload: feedback.id });
    }, duration);
  },

  removeFeedback: (feedbackId: string) => {
    dispatch({ type: 'REMOVE_FEEDBACK', payload: feedbackId });
  },

  clearFeedback: () => {
    dispatch({ type: 'CLEAR_FEEDBACK' });
  },

  // Helper to create and add feedback
  showSuccess: (message: string, duration?: number) => {
    const feedback: UserFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'success',
      message,
      duration
    };
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    
    const feedbackDuration = duration || 3000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FEEDBACK', payload: feedback.id });
    }, feedbackDuration);
  },

  showError: (message: string, duration?: number, action?: { label: string; handler: () => void }) => {
    const feedback: UserFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'error',
      message,
      duration,
      action
    };
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    
    const feedbackDuration = duration || 5000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FEEDBACK', payload: feedback.id });
    }, feedbackDuration);
  },

  showWarning: (message: string, duration?: number) => {
    const feedback: UserFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'warning',
      message,
      duration
    };
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    
    const feedbackDuration = duration || 4000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FEEDBACK', payload: feedback.id });
    }, feedbackDuration);
  },

  showInfo: (message: string, duration?: number) => {
    const feedback: UserFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'info',
      message,
      duration
    };
    dispatch({ type: 'ADD_FEEDBACK', payload: feedback });
    
    const feedbackDuration = duration || 3000;
    setTimeout(() => {
      dispatch({ type: 'REMOVE_FEEDBACK', payload: feedback.id });
    }, feedbackDuration);
  },
});

// Type for the actions object
export type AppActions = ReturnType<typeof createActions>;