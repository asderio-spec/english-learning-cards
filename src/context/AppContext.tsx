import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction, Grade, PlaybackSpeed, LearningProgress } from '../types';
import { createActions } from './actions';
import type { AppActions } from './actions';
import { progressService } from '../services/progressService';
import { storageService } from '../services/storageService';
import { preferencesService } from '../services/preferencesService';


// Initial state
const initialState: AppState = {
  currentGrade: undefined,
  currentSentenceIndex: 0,
  sentences: [],
  isCardFlipped: false,
  autoPlay: {
    isActive: false,
    speed: 'normal' as PlaybackSpeed,
  },
  progress: {} as Record<Grade, LearningProgress>,
  importantSentences: [],
  errors: [],
  loading: { isLoading: false },
  feedback: [],
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_GRADE':
      return {
        ...state,
        currentGrade: action.payload,
        currentSentenceIndex: 0,
        isCardFlipped: false,
      };

    case 'SET_SENTENCES':
      return {
        ...state,
        sentences: action.payload,
        currentSentenceIndex: 0,
        isCardFlipped: false,
      };

    case 'SET_CURRENT_SENTENCE_INDEX':
      return {
        ...state,
        currentSentenceIndex: action.payload,
        isCardFlipped: false,
      };

    case 'FLIP_CARD':
      return {
        ...state,
        isCardFlipped: !state.isCardFlipped,
      };

    case 'TOGGLE_IMPORTANT': {
      const sentenceId = action.payload;
      const isCurrentlyImportant = state.importantSentences.includes(sentenceId);
      
      return {
        ...state,
        importantSentences: isCurrentlyImportant
          ? state.importantSentences.filter(id => id !== sentenceId)
          : [...state.importantSentences, sentenceId],
        sentences: state.sentences.map(sentence =>
          sentence.id === sentenceId
            ? { ...sentence, isImportant: !sentence.isImportant }
            : sentence
        ),
      };
    }

    case 'TOGGLE_AUTO_PLAY':
      return {
        ...state,
        autoPlay: {
          ...state.autoPlay,
          isActive: !state.autoPlay.isActive,
        },
      };

    case 'SET_AUTO_PLAY_SPEED':
      return {
        ...state,
        autoPlay: {
          ...state.autoPlay,
          speed: action.payload,
        },
      };

    case 'UPDATE_PROGRESS': {
      const { grade, sentenceId } = action.payload;
      
      // Use the progress service to save progress (includes streak management)
      progressService.saveProgress(grade, sentenceId);
      
      // Get updated progress from the service
      const updatedProgress = progressService.getProgress(grade);
      
      // Update sentence study count in local state
      const updatedSentences = state.sentences.map(sentence =>
        sentence.id === sentenceId
          ? {
              ...sentence,
              studyCount: sentence.studyCount + 1,
              lastStudied: new Date(),
            }
          : sentence
      );

      return {
        ...state,
        sentences: updatedSentences,
        progress: {
          ...state.progress,
          [grade]: updatedProgress,
        },
      };
    }

    case 'LOAD_STORED_DATA':
      return {
        ...state,
        ...action.payload,
      };

    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };

    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload),
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'ADD_FEEDBACK':
      return {
        ...state,
        feedback: [...state.feedback, action.payload],
      };

    case 'REMOVE_FEEDBACK':
      return {
        ...state,
        feedback: state.feedback.filter(feedback => feedback.id !== action.payload),
      };

    case 'CLEAR_FEEDBACK':
      return {
        ...state,
        feedback: [],
      };

    default:
      return state;
  }
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: AppActions;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const actions = createActions(dispatch);

  // Load stored data on initialization
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Load complete stored data
        const completeData = await storageService.loadCompleteData();
        if (completeData) {
          // Load important sentences
          const importantSentences = await storageService.loadImportantSentences();
          
          // Load user preferences
          const preferences = await preferencesService.getAllPreferences();
          
          // Dispatch loaded data to state
          dispatch({
            type: 'LOAD_STORED_DATA',
            payload: {
              importantSentences,
              progress: completeData.progress || {},
              autoPlay: {
                isActive: false,
                speed: preferences.autoPlaySpeed
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading stored data in AppProvider:', error);
      }
    };

    loadStoredData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;