import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Sentence } from '../types';
import { ttsService } from '../services/ttsService';
import { useAppContext } from '../context/AppContext';

interface CardViewProps {
  sentence: Sentence;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleImportant: () => void;
  currentIndex: number;
  totalCount: number;
}

const CardView: React.FC<CardViewProps> = ({
  sentence,
  isFlipped,
  onFlip,
  onNext,
  onPrevious,
  onToggleImportant,
  currentIndex,
  totalCount
}) => {
  const { actions } = useAppContext();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio handler
  const handlePlayAudio = useCallback(async () => {
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      const text = isFlipped ? sentence.english : sentence.korean;
      const language = isFlipped ? 'en' : 'ko';
      await ttsService.speak(text, language);
      setIsPlayingAudio(false);
    } catch (error) {
      setIsPlayingAudio(false);
      actions.showError('음성 재생에 실패했습니다', 2000);
    }
  }, [isPlayingAudio, isFlipped, sentence, actions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < totalCount - 1) onNext();
          break;
        case ' ':
          event.preventDefault();
          handlePlayAudio();
          break;
        case 'Enter':
          event.preventDefault();
          onFlip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCount, onNext, onPrevious, onFlip, handlePlayAudio]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header space */}
      <div className="h-16 sm:h-20"></div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-sm border border-gray-200">
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mb-6 sm:mb-8">
          <motion.div
            key={`${sentence.id}-${isFlipped}`}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px] flex flex-col items-center justify-center cursor-pointer"
            onClick={onFlip}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Language indicator */}
            <div className={`text-sm sm:text-base font-semibold mb-6 sm:mb-8 px-4 sm:px-5 py-2 sm:py-3 rounded-full shadow-sm ${
              isFlipped 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-blue-100 text-blue-700 border border-blue-200'
            }`}>
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content - Large, readable fonts */}
            <div className="text-center flex-1 flex items-center justify-center px-2 sm:px-4">
              <p className={`font-medium leading-relaxed ${
                isFlipped 
                  ? 'text-emerald-900 text-lg sm:text-xl lg:text-2xl xl:text-3xl' 
                  : 'text-blue-900 text-xl sm:text-2xl lg:text-3xl xl:text-4xl'
              }`}>
                {isFlipped ? sentence.english : sentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 text-center">
              <span className="hidden sm:inline">클릭하여 {isFlipped ? '한국어' : '영어'} 보기</span>
              <span className="sm:hidden">탭하여 {isFlipped ? '한국어' : '영어'} 보기</span>
            </div>
          </motion.div>
        </div>

        {/* Controls - Clean and responsive */}
        <div className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-sm'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Audio - Prominent center button */}
          <button
            onClick={handlePlayAudio}
            className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${
              isPlayingAudio
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <motion.svg 
                className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path d="M6 6h12v12H6z" />
              </motion.svg>
            ) : (
              <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
              </svg>
            )}
          </button>

          {/* Important */}
          <button
            onClick={onToggleImportant}
            className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 ${
              sentence.isImportant
                ? 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-xl'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:shadow-xl'
            }`}
          >
            <motion.svg 
              className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              animate={sentence.isImportant ? { rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
              currentIndex === totalCount - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-sm'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl hover:scale-105'
            }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Instructions - Clean and minimal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md lg:max-w-lg text-center mx-4 shadow-sm border border-gray-100">
          <div className="text-xs sm:text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-700 mb-3">📖 사용법</p>
            <div className="grid grid-cols-2 gap-2 text-left">
              <p>• 카드 클릭: 뒤집기</p>
              <p>• 🔊 음성 재생</p>
              <p>• ← → 키: 이동</p>
              <p>• ⭐ 중요 표시</p>
            </div>
            <div className="hidden sm:block mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
              <p>키보드: Enter (뒤집기), Space (음성), ← → (이동)</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom safe area */}
      <div className="h-4 sm:h-6"></div>
    </div>
  );
};

export default CardView;