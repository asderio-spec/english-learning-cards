// Error handling service for centralized error management

import type { AppError, ErrorType, ErrorSeverity, TTSError } from '../types';

export class ErrorService {
  private static instance: ErrorService;
  private errorHandlers: Map<ErrorType, (error: AppError) => void> = new Map();

  private constructor() {
    this.setupDefaultHandlers();
  }

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  /**
   * Creates a standardized error object
   */
  createError(
    type: ErrorType,
    message: string,
    severity: ErrorSeverity = 'MEDIUM',
    details?: string,
    isRetryable: boolean = false,
    retryAction?: () => void
  ): AppError {
    return {
      id: this.generateErrorId(),
      type,
      severity,
      message,
      details,
      timestamp: new Date(),
      isRetryable,
      retryAction
    };
  }

  /**
   * Creates a TTS-specific error with appropriate fallback suggestions
   */
  createTTSError(ttsError: TTSError, retryAction?: () => void): AppError {
    let message: string;
    let severity: ErrorSeverity;
    let isRetryable = false;

    switch (ttsError.code) {
      case 'NOT_SUPPORTED':
        message = '이 브라우저에서는 음성 기능을 지원하지 않습니다';
        severity = 'HIGH';
        break;
      case 'NETWORK_ERROR':
        message = '네트워크 연결을 확인하고 다시 시도해주세요';
        severity = 'MEDIUM';
        isRetryable = true;
        break;
      case 'SYNTHESIS_FAILED':
        message = '음성 재생에 실패했습니다. 다시 시도해주세요';
        severity = 'MEDIUM';
        isRetryable = true;
        break;
      default:
        message = '음성 재생 중 오류가 발생했습니다';
        severity = 'MEDIUM';
        isRetryable = true;
    }

    return this.createError(
      'TTS_ERROR',
      message,
      severity,
      ttsError.message,
      isRetryable,
      retryAction
    );
  }

  /**
   * Creates a network error with retry capability
   */
  createNetworkError(originalError: Error, retryAction?: () => void): AppError {
    return this.createError(
      'NETWORK_ERROR',
      '네트워크 연결을 확인해주세요',
      'HIGH',
      originalError.message,
      true,
      retryAction
    );
  }

  /**
   * Creates a storage error
   */
  createStorageError(originalError: Error): AppError {
    return this.createError(
      'STORAGE_ERROR',
      '데이터 저장 중 오류가 발생했습니다',
      'MEDIUM',
      originalError.message,
      false
    );
  }

  /**
   * Creates a data loading error
   */
  createDataLoadError(originalError: Error, retryAction?: () => void): AppError {
    return this.createError(
      'DATA_LOAD_ERROR',
      '데이터를 불러오는 중 오류가 발생했습니다',
      'HIGH',
      originalError.message,
      true,
      retryAction
    );
  }

  /**
   * Registers a custom error handler for a specific error type
   */
  registerErrorHandler(type: ErrorType, handler: (error: AppError) => void): void {
    this.errorHandlers.set(type, handler);
  }

  /**
   * Handles an error using the registered handler
   */
  handleError(error: AppError): void {
    const handler = this.errorHandlers.get(error.type);
    if (handler) {
      handler(error);
    } else {
      console.error('Unhandled error:', error);
    }
  }

  /**
   * Gets user-friendly error message based on error type and context
   */
  getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'TTS_ERROR':
        return error.message + (error.isRetryable ? ' 다시 시도하거나 텍스트로 학습을 계속하세요.' : ' 텍스트로 학습을 계속하세요.');
      case 'NETWORK_ERROR':
        return error.message + ' 인터넷 연결을 확인하고 다시 시도해주세요.';
      case 'STORAGE_ERROR':
        return error.message + ' 브라우저 저장소를 확인해주세요.';
      case 'DATA_LOAD_ERROR':
        return error.message + ' 페이지를 새로고침하거나 다시 시도해주세요.';
      default:
        return error.message;
    }
  }

  /**
   * Gets suggested actions for an error
   */
  getSuggestedActions(error: AppError): Array<{ label: string; action: () => void }> {
    const actions: Array<{ label: string; action: () => void }> = [];

    if (error.isRetryable && error.retryAction) {
      actions.push({
        label: '다시 시도',
        action: error.retryAction
      });
    }

    switch (error.type) {
      case 'TTS_ERROR':
        actions.push({
          label: '텍스트로 계속',
          action: () => {
            // This will be handled by the component
            console.log('Continue with text-only mode');
          }
        });
        break;
      case 'NETWORK_ERROR':
        actions.push({
          label: '새로고침',
          action: () => window.location.reload()
        });
        break;
      case 'DATA_LOAD_ERROR':
        actions.push({
          label: '새로고침',
          action: () => window.location.reload()
        });
        break;
    }

    return actions;
  }

  private setupDefaultHandlers(): void {
    // Default console logging for all error types
    Object.values(['TTS_ERROR', 'NETWORK_ERROR', 'STORAGE_ERROR', 'DATA_LOAD_ERROR', 'GENERAL_ERROR']).forEach(type => {
      this.errorHandlers.set(type as ErrorType, (error: AppError) => {
        console.error(`[${error.type}] ${error.message}`, error);
      });
    });
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance();