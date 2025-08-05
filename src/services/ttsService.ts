// TTS Service implementation using Web Speech API

import type { TTSService } from '../types';
import { TTSError, TTSErrorCode } from '../types';

export class TTSServiceImpl implements TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;

  /**
   * Clean text for TTS by removing grade and sentence number information
   * @param text - Original text that may contain grade/number info
   * @returns Cleaned text suitable for TTS
   */
  private cleanTextForTTS(text: string): string {
    // Remove patterns like "Middle 1 sentence 1:", "중1 문장 1:", etc.
    let cleanedText = text
      // Remove English grade patterns
      .replace(/^(Middle|High)\s*\d+\s*(sentence|Sentence)\s*\d+\s*[:：]\s*/i, '')
      .replace(/^(Middle|High)\s*\d+\s*[:：]\s*/i, '')
      .replace(/^(Grade|grade)\s*\d+\s*[:：]\s*/i, '')
      
      // Remove Korean grade patterns
      .replace(/^(중|고)\d+\s*(문장|번째|번|과)\s*\d+\s*[:：]\s*/i, '')
      .replace(/^(중학교|고등학교)\s*\d+학년\s*[:：]\s*/i, '')
      .replace(/^(중|고)\d+\s*[:：]\s*/i, '')
      .replace(/^(중학|고등)\s*\d+\s*[:：]\s*/i, '')
      
      // Remove number patterns at the beginning
      .replace(/^\d+\.\s*/, '')
      .replace(/^\d+[:：]\s*/, '')
      .replace(/^\d+번\s*[:：]\s*/i, '')
      .replace(/^\d+과\s*[:：]\s*/i, '')
      
      // Remove lesson/unit patterns
      .replace(/^(Lesson|Unit|Chapter)\s*\d+\s*[:：]\s*/i, '')
      .replace(/^(레슨|단원|과정)\s*\d+\s*[:：]\s*/i, '')
      
      // Remove any remaining patterns with numbers and colons
      .replace(/^[A-Za-z가-힣]*\s*\d+\s*[:：]\s*/, '')
      
      // Clean up extra whitespace and punctuation
      .replace(/^\s*[-–—]\s*/, '') // Remove leading dashes
      .replace(/^\s*[•·]\s*/, '') // Remove bullet points
      .trim();

    // If cleaning results in empty string or very short string, return original
    return (cleanedText && cleanedText.length > 2) ? cleanedText : text;
  }

  /**
   * Speaks the given text in the specified language
   * @param text - Text to be spoken
   * @param language - Language code ('ko' for Korean, 'en' for English)
   * @returns Promise that resolves when speech is complete or rejects on error
   */
  async speak(text: string, language: 'ko' | 'en'): Promise<void> {
    if (!this.isSupported()) {
      throw new TTSError('Speech synthesis is not supported in this browser', TTSErrorCode.NOT_SUPPORTED);
    }

    // Stop any currently playing speech
    this.stop();

    // Clean the text before speaking
    const cleanedText = this.cleanTextForTTS(text);

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        this.currentUtterance = utterance;

        // Set language and voice
        utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
        
        // Try to find a suitable voice for the language
        const voices = this.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(language === 'ko' ? 'ko' : 'en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Set speech parameters
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Set up event handlers
        utterance.onstart = () => {
          this.isPlaying = true;
        };

        utterance.onend = () => {
          this.isPlaying = false;
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.isPlaying = false;
          this.currentUtterance = null;
          
          let errorCode = TTSErrorCode.SYNTHESIS_FAILED;
          if (event.error === 'network') {
            errorCode = 'NETWORK_ERROR' as any;
          }
          
          reject(new TTSError(`Speech synthesis failed: ${event.error}`, errorCode));
        };

        // Start speaking
        speechSynthesis.speak(utterance);

      } catch (error) {
        this.isPlaying = false;
        this.currentUtterance = null;
        reject(new TTSError(
          `Failed to initialize speech synthesis: ${error instanceof Error ? error.message : 'Unknown error'}`,
          TTSErrorCode.SYNTHESIS_FAILED
        ));
      }
    });
  }

  /**
   * Stops the current speech synthesis
   */
  stop(): void {
    if (this.currentUtterance || speechSynthesis.speaking) {
      speechSynthesis.cancel();
      this.isPlaying = false;
      this.currentUtterance = null;
    }
  }

  /**
   * Checks if speech synthesis is supported in the current browser
   * @returns true if supported, false otherwise
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           window.speechSynthesis !== undefined &&
           'SpeechSynthesisUtterance' in window && 
           window.SpeechSynthesisUtterance !== undefined;
  }

  /**
   * Gets available voices for speech synthesis
   * @returns Array of available SpeechSynthesisVoice objects
   */
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported() || !window.speechSynthesis) {
      return [];
    }

    return window.speechSynthesis.getVoices();
  }

  /**
   * Gets the current playing state
   * @returns true if currently playing speech, false otherwise
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Gets voices filtered by language
   * @param language - Language code ('ko' or 'en')
   * @returns Array of voices for the specified language
   */
  getVoicesByLanguage(language: 'ko' | 'en'): SpeechSynthesisVoice[] {
    const voices = this.getVoices();
    const langPrefix = language === 'ko' ? 'ko' : 'en';
    
    return voices.filter(voice => voice.lang.startsWith(langPrefix));
  }

  /**
   * Sets the speech rate for future utterances
   * @param rate - Speech rate (0.1 to 10, default is 1)
   */
  setRate(_rate: number): void {
    // Rate will be applied to the next utterance
    // This is a utility method for future enhancements
  }

  /**
   * Waits for voices to be loaded (some browsers load voices asynchronously)
   * @returns Promise that resolves when voices are available
   */
  waitForVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = this.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      // Some browsers load voices asynchronously
      const handleVoicesChanged = () => {
        const updatedVoices = this.getVoices();
        if (updatedVoices.length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve(updatedVoices);
        }
      };

      speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      
      // Fallback timeout in case voices never load
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve(this.getVoices());
      }, 3000);
    });
  }
}

// Export a singleton instance
export const ttsService = new TTSServiceImpl();