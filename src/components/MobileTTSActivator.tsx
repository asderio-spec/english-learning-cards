import React, { useState, useEffect } from 'react';
import { ttsService } from '../services/ttsService';

interface MobileTTSActivatorProps {
  onActivated?: () => void;
}

export const MobileTTSActivator: React.FC<MobileTTSActivatorProps> = ({ onActivated }) => {
  const [isActivated, setIsActivated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      return isMobileDevice || isTouchDevice;
    };

    setIsMobile(checkMobile());

    // Check if TTS has already been activated
    const ttsActivated = localStorage.getItem('tts-activated');
    if (ttsActivated === 'true') {
      setIsActivated(true);
    }
  }, []);

  const activateTTS = async () => {
    try {
      // Create a silent utterance to activate TTS on mobile
      const testUtterance = new SpeechSynthesisUtterance('');
      testUtterance.volume = 0;
      speechSynthesis.speak(testUtterance);
      
      // Wait a moment for the activation
      setTimeout(() => {
        speechSynthesis.cancel();
        setIsActivated(true);
        localStorage.setItem('tts-activated', 'true');
        onActivated?.();
      }, 100);
    } catch (error) {
      console.warn('Failed to activate TTS:', error);
      // Still mark as activated to avoid showing the prompt repeatedly
      setIsActivated(true);
      localStorage.setItem('tts-activated', 'true');
      onActivated?.();
    }
  };

  // Don't show on desktop or if already activated
  if (!isMobile || isActivated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-xl">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M9 9a3 3 0 000 6v-6z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            음성 기능 활성화
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            모바일에서 음성 기능을 사용하려면 한 번 활성화가 필요합니다. 
            아래 버튼을 터치해주세요.
          </p>
        </div>
        
        <button
          onClick={activateTTS}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          음성 기능 활성화
        </button>
        
        <p className="text-xs text-gray-500 mt-3">
          이 작업은 한 번만 필요합니다
        </p>
      </div>
    </div>
  );
};

export default MobileTTSActivator;