/**
 * Mobile TTS utilities for better compatibility
 */

export class MobileTTSUtils {
  private static instance: MobileTTSUtils;
  private isInitialized = false;
  private audioContext: AudioContext | null = null;

  static getInstance(): MobileTTSUtils {
    if (!MobileTTSUtils.instance) {
      MobileTTSUtils.instance = new MobileTTSUtils();
    }
    return MobileTTSUtils.instance;
  }

  /**
   * Initialize audio context and TTS for mobile
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        this.audioContext = new AudioContext();
        
        // Resume if suspended
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      }

      // Initialize speech synthesis with a silent utterance
      if ('speechSynthesis' in window) {
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        speechSynthesis.speak(silentUtterance);
        
        // Cancel immediately
        setTimeout(() => {
          speechSynthesis.cancel();
        }, 100);
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize mobile TTS:', error);
      this.isInitialized = true; // Mark as initialized to avoid repeated attempts
    }
  }

  /**
   * Check if device is mobile
   */
  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUA || isTouchDevice;
  }

  /**
   * Check if TTS is supported
   */
  isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 
           'speechSynthesis' in window && 
           'SpeechSynthesisUtterance' in window;
  }

  /**
   * Get optimal TTS settings for mobile
   */
  getMobileOptimizedSettings() {
    return {
      rate: 0.8, // Slower for better comprehension on mobile
      pitch: 1.0,
      volume: 1.0,
      // Add delay before speaking on mobile
      delay: this.isMobileDevice() ? 150 : 50
    };
  }

  /**
   * Enhanced speak function with mobile optimizations
   */
  async speak(text: string, language: 'ko' | 'en'): Promise<void> {
    if (!this.isTTSSupported()) {
      throw new Error('TTS not supported');
    }

    // Initialize if not done
    await this.initialize();

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        const settings = this.getMobileOptimizedSettings();

        // Set language
        utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
        
        // Apply mobile-optimized settings
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;

        // Try to find appropriate voice
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(language === 'ko' ? 'ko' : 'en')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Event handlers
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`TTS Error: ${event.error}`));

        // Speak with delay for mobile compatibility
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, settings.delay);

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return speechSynthesis.speaking;
  }
}

export const mobileTTSUtils = MobileTTSUtils.getInstance();