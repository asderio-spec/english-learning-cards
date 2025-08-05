import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TTSServiceImpl } from '../ttsService';
import { TTSError, TTSErrorCode } from '../../types';

// Mock the Web Speech API
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

// Mock voices
const mockVoices = [
  {
    name: 'Korean Voice',
    lang: 'ko-KR',
    localService: true,
    default: false,
    voiceURI: 'ko-KR-voice',
  },
  {
    name: 'English Voice',
    lang: 'en-US',
    localService: true,
    default: true,
    voiceURI: 'en-US-voice',
  },
  {
    name: 'English UK Voice',
    lang: 'en-GB',
    localService: true,
    default: false,
    voiceURI: 'en-GB-voice',
  },
] as SpeechSynthesisVoice[];

describe('TTSServiceImpl', () => {
  let ttsService: TTSServiceImpl;

  beforeEach(() => {
    // Setup global mocks
    global.speechSynthesis = mockSpeechSynthesis as any;
    global.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance as any;
    global.window = { speechSynthesis: mockSpeechSynthesis, SpeechSynthesisUtterance: mockSpeechSynthesisUtterance } as any;

    // Reset mocks
    vi.clearAllMocks();
    mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
    
    ttsService = new TTSServiceImpl();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('isSupported', () => {
    it('should return true when Web Speech API is available', () => {
      expect(ttsService.isSupported()).toBe(true);
    });

    it('should return false when speechSynthesis is not available', () => {
      // Temporarily override the property
      const originalSpeechSynthesis = (global.window as any).speechSynthesis;
      (global.window as any).speechSynthesis = undefined;
      
      const newService = new TTSServiceImpl();
      expect(newService.isSupported()).toBe(false);
      
      // Restore original value
      (global.window as any).speechSynthesis = originalSpeechSynthesis;
    });

    it('should return false when SpeechSynthesisUtterance is not available', () => {
      // Temporarily override the property
      const originalSpeechSynthesisUtterance = (global.window as any).SpeechSynthesisUtterance;
      (global.window as any).SpeechSynthesisUtterance = undefined;
      
      const newService = new TTSServiceImpl();
      expect(newService.isSupported()).toBe(false);
      
      // Restore original value
      (global.window as any).SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
    });
  });

  describe('getVoices', () => {
    it('should return available voices when supported', () => {
      const voices = ttsService.getVoices();
      expect(voices).toEqual(mockVoices);
      expect(mockSpeechSynthesis.getVoices).toHaveBeenCalled();
    });

    it('should return empty array when not supported', () => {
      // Temporarily override the property
      const originalSpeechSynthesis = (global.window as any).speechSynthesis;
      (global.window as any).speechSynthesis = undefined;
      
      const newService = new TTSServiceImpl();
      expect(newService.getVoices()).toEqual([]);
      
      // Restore original value
      (global.window as any).speechSynthesis = originalSpeechSynthesis;
    });
  });

  describe('getVoicesByLanguage', () => {
    it('should return Korean voices for "ko" language', () => {
      const koreanVoices = ttsService.getVoicesByLanguage('ko');
      expect(koreanVoices).toHaveLength(1);
      expect(koreanVoices[0].lang).toBe('ko-KR');
    });

    it('should return English voices for "en" language', () => {
      const englishVoices = ttsService.getVoicesByLanguage('en');
      expect(englishVoices).toHaveLength(2);
      expect(englishVoices.every(voice => voice.lang.startsWith('en'))).toBe(true);
    });
  });

  describe('speak', () => {
    it('should throw error when not supported', async () => {
      // Temporarily override the property
      const originalSpeechSynthesis = (global.window as any).speechSynthesis;
      (global.window as any).speechSynthesis = undefined;
      
      const newService = new TTSServiceImpl();
      
      try {
        await expect(newService.speak('test', 'en')).rejects.toThrow(TTSError);
        await expect(newService.speak('test', 'en')).rejects.toThrow('Speech synthesis is not supported');
      } finally {
        // Restore original value
        (global.window as any).speechSynthesis = originalSpeechSynthesis;
      }
    }, 1000); // Add timeout

    it('should create utterance with correct text and language for English', async () => {
      const speakPromise = ttsService.speak('Hello world', 'en');
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('Hello world');
      
      // Simulate successful speech
      const utteranceInstance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.lang).toBe('en-US');
      
      // Simulate onend event
      if (utteranceInstance.onend) {
        utteranceInstance.onend();
      }
      
      await expect(speakPromise).resolves.toBeUndefined();
    });

    it('should create utterance with correct text and language for Korean', async () => {
      const speakPromise = ttsService.speak('안녕하세요', 'ko');
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith('안녕하세요');
      
      // Simulate successful speech
      const utteranceInstance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.lang).toBe('ko-KR');
      
      // Simulate onend event
      if (utteranceInstance.onend) {
        utteranceInstance.onend();
      }
      
      await expect(speakPromise).resolves.toBeUndefined();
    });

    it('should set preferred voice when available', async () => {
      const speakPromise = ttsService.speak('Hello', 'en');
      
      const utteranceInstance = mockSpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.voice).toEqual(mockVoices[1]); // English voice
      
      // Simulate onend event
      if (utteranceInstance.onend) {
        utteranceInstance.onend();
      }
      
      await speakPromise;
    });

    it('should call speechSynthesis.speak with the utterance', async () => {
      const speakPromise = ttsService.speak('test', 'en');
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
      const calledUtterance = mockSpeechSynthesis.speak.mock.calls[0][0];
      expect(calledUtterance.text).toBe('test');
      
      // Simulate onend event
      if (calledUtterance.onend) {
        calledUtterance.onend();
      }
      
      await speakPromise;
    });

    it('should handle speech synthesis errors', async () => {
      const speakPromise = ttsService.speak('test', 'en');
      
      const utteranceInstance = mockSpeechSynthesis.speak.mock.calls[0][0];
      
      // Simulate error event
      if (utteranceInstance.onerror) {
        utteranceInstance.onerror({ error: 'synthesis-failed' } as any);
      }
      
      await expect(speakPromise).rejects.toThrow(TTSError);
      await expect(speakPromise).rejects.toThrow('Speech synthesis failed');
    });

    it('should handle network errors specifically', async () => {
      const speakPromise = ttsService.speak('test', 'en');
      
      const utteranceInstance = mockSpeechSynthesis.speak.mock.calls[0][0];
      
      // Simulate network error
      if (utteranceInstance.onerror) {
        utteranceInstance.onerror({ error: 'network' } as any);
      }
      
      await expect(speakPromise).rejects.toThrow(TTSError);
      const error = await speakPromise.catch(e => e);
      expect(error.code).toBe(TTSErrorCode.NETWORK_ERROR);
    });

    it('should stop current speech before starting new one', async () => {
      // Start first speech and simulate it starting
      ttsService.speak('first', 'en');
      const firstUtterance = mockSpeechSynthesis.speak.mock.calls[0][0];
      if (firstUtterance.onstart) {
        firstUtterance.onstart();
      }
      
      // Start second speech (should stop first)
      ttsService.speak('second', 'en');
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
      
      // Complete second speech
      const secondUtterance = mockSpeechSynthesis.speak.mock.calls[1][0];
      if (secondUtterance.onend) {
        secondUtterance.onend();
      }
    });
  });

  describe('stop', () => {
    it('should call speechSynthesis.cancel when playing', () => {
      // Start speech to set playing state
      ttsService.speak('test', 'en');
      
      ttsService.stop();
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it('should not call cancel when not playing', () => {
      ttsService.stop();
      expect(mockSpeechSynthesis.cancel).not.toHaveBeenCalled();
    });
  });

  describe('waitForVoices', () => {
    it('should resolve immediately when voices are available', async () => {
      const voices = await ttsService.waitForVoices();
      expect(voices).toEqual(mockVoices);
    });

    it('should wait for voiceschanged event when no voices initially', async () => {
      // Mock no voices initially
      mockSpeechSynthesis.getVoices.mockReturnValueOnce([]);
      
      const voicesPromise = ttsService.waitForVoices();
      
      // Simulate voices becoming available
      mockSpeechSynthesis.getVoices.mockReturnValue(mockVoices);
      
      // Trigger voiceschanged event
      const eventHandler = mockSpeechSynthesis.addEventListener.mock.calls.find(
        call => call[0] === 'voiceschanged'
      )?.[1];
      
      if (eventHandler) {
        eventHandler();
      }
      
      const voices = await voicesPromise;
      expect(voices).toEqual(mockVoices);
    });

    it('should timeout after 3 seconds if voices never load', async () => {
      // Mock no voices
      mockSpeechSynthesis.getVoices.mockReturnValue([]);
      
      // Mock setTimeout to resolve immediately for testing
      vi.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return 1 as any;
      });
      
      const voices = await ttsService.waitForVoices();
      expect(voices).toEqual([]);
      
      vi.restoreAllMocks();
    });
  });

  describe('getIsPlaying', () => {
    it('should return false initially', () => {
      expect(ttsService.getIsPlaying()).toBe(false);
    });

    it('should return true when speech starts', () => {
      ttsService.speak('test', 'en');
      const utteranceInstance = mockSpeechSynthesis.speak.mock.calls[0][0];
      
      // Simulate speech start
      if (utteranceInstance.onstart) {
        utteranceInstance.onstart();
      }
      
      expect(ttsService.getIsPlaying()).toBe(true);
    });

    it('should return false when speech ends', async () => {
      const speakPromise = ttsService.speak('test', 'en');
      const utteranceInstance = mockSpeechSynthesis.speak.mock.calls[0][0];
      
      // Simulate speech start then end
      if (utteranceInstance.onstart) {
        utteranceInstance.onstart();
      }
      
      expect(ttsService.getIsPlaying()).toBe(true);
      
      if (utteranceInstance.onend) {
        utteranceInstance.onend();
      }
      
      await speakPromise;
      expect(ttsService.getIsPlaying()).toBe(false);
    });
  });
});