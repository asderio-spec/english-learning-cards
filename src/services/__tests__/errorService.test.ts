import { describe, it, expect, beforeEach, vi } from 'vitest';
import { errorService } from '../errorService';
import { TTSError, ErrorType, ErrorSeverity } from '../../types';

describe('ErrorService', () => {
  beforeEach(() => {
    // Reset any state if needed
    vi.clearAllMocks();
  });

  describe('createError', () => {
    it('should create a basic error object', () => {
      const error = errorService.createError(
        'GENERAL_ERROR',
        'Test error message',
        'MEDIUM'
      );

      expect(error).toMatchObject({
        type: 'GENERAL_ERROR',
        message: 'Test error message',
        severity: 'MEDIUM',
        isRetryable: false
      });
      expect(error.id).toBeDefined();
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should create a retryable error with action', () => {
      const retryAction = vi.fn();
      const error = errorService.createError(
        'NETWORK_ERROR',
        'Network failed',
        'HIGH',
        'Connection timeout',
        true,
        retryAction
      );

      expect(error).toMatchObject({
        type: 'NETWORK_ERROR',
        message: 'Network failed',
        severity: 'HIGH',
        details: 'Connection timeout',
        isRetryable: true,
        retryAction
      });
    });
  });

  describe('createTTSError', () => {
    it('should create TTS error for NOT_SUPPORTED', () => {
      const ttsError = new TTSError('Browser not supported', 'NOT_SUPPORTED');
      const error = errorService.createTTSError(ttsError);

      expect(error).toMatchObject({
        type: 'TTS_ERROR',
        message: '이 브라우저에서는 음성 기능을 지원하지 않습니다',
        severity: 'HIGH',
        isRetryable: false
      });
    });

    it('should create TTS error for NETWORK_ERROR', () => {
      const ttsError = new TTSError('Network failed', 'NETWORK_ERROR');
      const retryAction = vi.fn();
      const error = errorService.createTTSError(ttsError, retryAction);

      expect(error).toMatchObject({
        type: 'TTS_ERROR',
        message: '네트워크 연결을 확인하고 다시 시도해주세요',
        severity: 'MEDIUM',
        isRetryable: true,
        retryAction
      });
    });

    it('should create TTS error for SYNTHESIS_FAILED', () => {
      const ttsError = new TTSError('Synthesis failed', 'SYNTHESIS_FAILED');
      const error = errorService.createTTSError(ttsError);

      expect(error).toMatchObject({
        type: 'TTS_ERROR',
        message: '음성 재생에 실패했습니다. 다시 시도해주세요',
        severity: 'MEDIUM',
        isRetryable: true
      });
    });
  });

  describe('createNetworkError', () => {
    it('should create network error with retry action', () => {
      const originalError = new Error('Connection failed');
      const retryAction = vi.fn();
      const error = errorService.createNetworkError(originalError, retryAction);

      expect(error).toMatchObject({
        type: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요',
        severity: 'HIGH',
        details: 'Connection failed',
        isRetryable: true,
        retryAction
      });
    });
  });

  describe('createStorageError', () => {
    it('should create storage error', () => {
      const originalError = new Error('Storage quota exceeded');
      const error = errorService.createStorageError(originalError);

      expect(error).toMatchObject({
        type: 'STORAGE_ERROR',
        message: '데이터 저장 중 오류가 발생했습니다',
        severity: 'MEDIUM',
        details: 'Storage quota exceeded',
        isRetryable: false
      });
    });
  });

  describe('createDataLoadError', () => {
    it('should create data load error with retry action', () => {
      const originalError = new Error('Failed to fetch');
      const retryAction = vi.fn();
      const error = errorService.createDataLoadError(originalError, retryAction);

      expect(error).toMatchObject({
        type: 'DATA_LOAD_ERROR',
        message: '데이터를 불러오는 중 오류가 발생했습니다',
        severity: 'HIGH',
        details: 'Failed to fetch',
        isRetryable: true,
        retryAction
      });
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return user-friendly message for TTS error', () => {
      const error = errorService.createError('TTS_ERROR', 'TTS failed', 'MEDIUM', undefined, true);
      const message = errorService.getUserFriendlyMessage(error);
      
      expect(message).toBe('TTS failed 다시 시도하거나 텍스트로 학습을 계속하세요.');
    });

    it('should return user-friendly message for non-retryable TTS error', () => {
      const error = errorService.createError('TTS_ERROR', 'TTS not supported', 'HIGH', undefined, false);
      const message = errorService.getUserFriendlyMessage(error);
      
      expect(message).toBe('TTS not supported 텍스트로 학습을 계속하세요.');
    });

    it('should return user-friendly message for network error', () => {
      const error = errorService.createError('NETWORK_ERROR', 'Network failed', 'HIGH');
      const message = errorService.getUserFriendlyMessage(error);
      
      expect(message).toBe('Network failed 인터넷 연결을 확인하고 다시 시도해주세요.');
    });
  });

  describe('getSuggestedActions', () => {
    it('should return retry action for retryable error', () => {
      const retryAction = vi.fn();
      const error = errorService.createError('NETWORK_ERROR', 'Network failed', 'HIGH', undefined, true, retryAction);
      const actions = errorService.getSuggestedActions(error);
      
      expect(actions).toHaveLength(2); // retry + refresh
      expect(actions[0]).toMatchObject({
        label: '다시 시도',
        action: retryAction
      });
      expect(actions[1].label).toBe('새로고침');
    });

    it('should return continue action for TTS error', () => {
      const error = errorService.createError('TTS_ERROR', 'TTS failed', 'MEDIUM');
      const actions = errorService.getSuggestedActions(error);
      
      expect(actions).toHaveLength(1);
      expect(actions[0].label).toBe('텍스트로 계속');
    });

    it('should return refresh action for data load error', () => {
      const error = errorService.createError('DATA_LOAD_ERROR', 'Load failed', 'HIGH');
      const actions = errorService.getSuggestedActions(error);
      
      expect(actions).toHaveLength(1);
      expect(actions[0].label).toBe('새로고침');
    });
  });

  describe('registerErrorHandler and handleError', () => {
    it('should register and call custom error handler', () => {
      const customHandler = vi.fn();
      errorService.registerErrorHandler('TTS_ERROR', customHandler);
      
      const error = errorService.createError('TTS_ERROR', 'Test error', 'MEDIUM');
      errorService.handleError(error);
      
      expect(customHandler).toHaveBeenCalledWith(error);
    });

    it('should log unhandled errors', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = errorService.createError('GENERAL_ERROR', 'Unhandled error', 'MEDIUM');
      errorService.handleError(error);
      
      expect(consoleSpy).toHaveBeenCalledWith(`[${error.type}] ${error.message}`, error);
      
      consoleSpy.mockRestore();
    });
  });
});