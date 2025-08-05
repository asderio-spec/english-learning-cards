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
      <div className="h-16"></div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        
        {/* Progress */}
        <div className="mb-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg mb-8">
          <motion.div
            key={`${sentence.id}-${isFlipped}`}
            className="bg-white rounded-3xl shadow-xl border p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer"
            onClick={onFlip}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Language indicator */}
            <div className={`text-sm font-semibold mb-6 px-3 py-1 rounded-full ${
              isFlipped 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content */}
            <div className="text-center flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-gray-900 leading-relaxed">
                {isFlipped ? sentence.english : sentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div className="text-xs text-gray-500 mt-6">
              클릭하여 {isFlipped ? '한국어' : '영어'} 보기
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Audio */}
          <button
            onClick={handlePlayAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isPlayingAudio
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
              </svg>
            )}
          </button>

          {/* Important */}
          <button
            onClick={onToggleImportant}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              sentence.isImportant
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              currentIndex === totalCount - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 max-w-md text-center">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>사용법:</strong></p>
            <p>• 카드 클릭 또는 Enter: 뒤집기</p>
            <p>• ← → 키: 이전/다음 카드</p>
            <p>• 스페이스바: 음성 재생</p>
            <p>• 🔊 음성 버튼: 발음 듣기</p>
            <p>• ⭐ 별표: 중요 문장 표시</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;