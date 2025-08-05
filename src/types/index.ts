// Core data types for the English Card Learning App

export type Grade = 'middle1' | 'middle2' | 'middle3' | 'high1' | 'high2' | 'high3';

export interface Sentence {
  id: string;
  korean: string;
  english: string;
  grade: Grade;
  isImportant: boolean;
  studyCount: number;
  lastStudied?: Date;
}

export interface LearningProgress {
  grade: Grade;
  totalSentences: number;
  studiedSentences: number;
  completionRate: number;
  streak: number;
  lastStudyDate?: Date;
}

export type PlaybackSpeed = 'slow' | 'normal' | 'fast';

export interface AppState {
  currentGrade?: Grade;
  currentSentenceIndex: number;
  sentences: Sentence[];
  isCardFlipped: boolean;
  autoPlay: {
    isActive: boolean;
    speed: PlaybackSpeed;
  };
  progress: Record<Grade, LearningProgress>;
  importantSentences: string[]; // sentence IDs
  errors: AppError[];
  loading: LoadingState;
  feedback: UserFeedback[];
}

// Action types for state management
export type AppAction =
  | { type: 'SET_GRADE'; payload: Grade | undefined }
  | { type: 'SET_SENTENCES'; payload: Sentence[] }
  | { type: 'SET_CURRENT_SENTENCE_INDEX'; payload: number }
  | { type: 'FLIP_CARD' }
  | { type: 'TOGGLE_IMPORTANT'; payload: string }
  | { type: 'TOGGLE_AUTO_PLAY' }
  | { type: 'SET_AUTO_PLAY_SPEED'; payload: PlaybackSpeed }
  | { type: 'UPDATE_PROGRESS'; payload: { grade: Grade; sentenceId: string } }
  | { type: 'LOAD_STORED_DATA'; payload: Partial<AppState> }
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'ADD_FEEDBACK'; payload: UserFeedback }
  | { type: 'REMOVE_FEEDBACK'; payload: string }
  | { type: 'CLEAR_FEEDBACK' };

// Storage interface
export interface StoredData {
  progress: Record<Grade, LearningProgress>;
  importantSentences: string[];
  sentences: Record<Grade, Sentence[]>;
  userPreferences: {
    autoPlaySpeed: PlaybackSpeed;
    ttsVoiceIndex: number;
  };
}

// Error handling types
export const ErrorType = {
  TTS_ERROR: 'TTS_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  DATA_LOAD_ERROR: 'DATA_LOAD_ERROR',
  GENERAL_ERROR: 'GENERAL_ERROR'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export const ErrorSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;

export type ErrorSeverity = typeof ErrorSeverity[keyof typeof ErrorSeverity];

export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  details?: string;
  timestamp: Date;
  isRetryable: boolean;
  retryAction?: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface UserFeedback {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

// TTS related types
export const TTSErrorCode = {
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SYNTHESIS_FAILED: 'SYNTHESIS_FAILED'
} as const;

export type TTSErrorCode = typeof TTSErrorCode[keyof typeof TTSErrorCode];

export class TTSError extends Error {
  public code: TTSErrorCode;
  
  constructor(message: string, code: TTSErrorCode) {
    super(message);
    this.code = code;
  }
}

// Service interfaces
export interface TTSService {
  speak(text: string, language: 'ko' | 'en'): Promise<void>;
  stop(): void;
  isSupported(): boolean;
  getVoices(): SpeechSynthesisVoice[];
}

export interface ProgressService {
  saveProgress(grade: Grade, sentenceId: string): void;
  getProgress(grade: Grade): LearningProgress;
  updateStreak(): void;
  getStreak(): number;
}

export interface DataService {
  getSentencesByGrade(grade: Grade): Sentence[];
  toggleImportant(sentenceId: string): void;
  getImportantSentences(): Sentence[];
}