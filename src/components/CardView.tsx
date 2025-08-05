import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Sentence } from '../types';
import { ttsService } from '../services/ttsService';
import { useAppContext } from '../context/AppContext';
import Button from '../design-system/components/Button/Button';
import Card from '../design-system/components/Card/Card';

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
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Header space */}
      <div style={{ height: '80px' }}></div>
      
      {/* Main content */}
      <div 
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px'
        }}
      >
        
        {/* Progress */}
        <div style={{ marginBottom: '32px' }}>
          <Card 
            variant="elevated" 
            padding="sm"
            style={{
              borderRadius: '24px',
              display: 'inline-block'
            }}
          >
            <span 
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}
            >
              {currentIndex + 1} / {totalCount}
            </span>
          </Card>
        </div>

        {/* Card */}
        <div 
          style={{
            width: '100%',
            maxWidth: '600px',
            marginBottom: '32px'
          }}
        >
          <Card
            key={`${sentence.id}-${isFlipped}`}
            variant="elevated"
            padding="lg"
            interactive={true}
            onClick={onFlip}
            animate={true}
            style={{
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {/* Language indicator */}
            <div 
              style={{
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '32px',
                padding: '12px 20px',
                borderRadius: '24px',
                backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
                color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)',
                border: `1px solid ${isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)'}`
              }}
            >
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content */}
            <div 
              style={{
                textAlign: 'center',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px'
              }}
            >
              <p 
                style={{
                  fontWeight: 500,
                  lineHeight: 1.5,
                  fontSize: isFlipped ? '24px' : '28px',
                  color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)'
                }}
              >
                {isFlipped ? sentence.english : sentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div 
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                marginTop: '32px',
                textAlign: 'center'
              }}
            >
              클릭하여 {isFlipped ? '한국어' : '영어'} 보기
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {/* Previous */}
          <Button
            variant="primary"
            size="lg"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              minHeight: '56px'
            }}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            <span style={{ display: 'none' }}>이전</span>
          </Button>

          {/* Audio - Prominent center button */}
          <Button
            variant={isPlayingAudio ? "secondary" : "primary"}
            size="lg"
            onClick={handlePlayAudio}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              minHeight: '72px',
              backgroundColor: isPlayingAudio ? '#ef4444' : '#10b981'
            }}
            icon={
              isPlayingAudio ? (
                <motion.svg 
                  width="24" 
                  height="24" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <path d="M6 6h12v12H6z" />
                </motion.svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
                </svg>
              )
            }
          >
            <span style={{ display: 'none' }}>음성</span>
          </Button>

          {/* Important */}
          <Button
            variant={sentence.isImportant ? "primary" : "ghost"}
            size="lg"
            onClick={onToggleImportant}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              minHeight: '56px',
              backgroundColor: sentence.isImportant ? '#f59e0b' : undefined
            }}
            icon={
              <motion.svg 
                width="20" 
                height="20" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                animate={sentence.isImportant ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </motion.svg>
            }
          >
            <span style={{ display: 'none' }}>중요</span>
          </Button>

          {/* Next */}
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={currentIndex === totalCount - 1}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              minHeight: '56px'
            }}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            }
          >
            <span style={{ display: 'none' }}>다음</span>
          </Button>
        </div>

        {/* Instructions */}
        <Card 
          variant="outlined" 
          padding="md"
          style={{
            maxWidth: '500px',
            textAlign: 'center',
            margin: '0 16px'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            <p 
              style={{ 
                fontWeight: 600, 
                color: 'var(--text-primary)', 
                marginBottom: '12px' 
              }}
            >
              📖 사용법
            </p>
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                textAlign: 'left'
              }}
            >
              <p>• 카드 클릭: 뒤집기</p>
              <p>• 🔊 음성 재생</p>
              <p>• ← → 키: 이동</p>
              <p>• ⭐ 중요 표시</p>
            </div>
            <div 
              style={{
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-secondary)',
                fontSize: '10px',
                color: 'var(--text-tertiary)'
              }}
            >
              <p>키보드: Enter (뒤집기), Space (음성), ← → (이동)</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Bottom safe area */}
      <div style={{ height: '24px' }}></div>
    </div>
  );
};

export default CardView;