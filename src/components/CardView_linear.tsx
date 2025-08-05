import React, { useState, useCallback, useEffect } from 'react';
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
        case 'i':
        case 'I':
          event.preventDefault();
          onToggleImportant();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCount, onNext, onPrevious, onFlip, handlePlayAudio, onToggleImportant]);

  return (
    <div 
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      {/* Progress Indicator */}
      <div 
        style={{
          marginBottom: '32px'
        }}
      >
        <div 
          style={{
            background: 'var(--surface-primary)',
            borderRadius: '20px',
            padding: '8px 16px',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <span 
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}
          >
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div 
        style={{
          width: '100%',
          maxWidth: '600px',
          marginBottom: '32px'
        }}
      >
        <div
          onClick={onFlip}
          style={{
            background: 'var(--surface-primary)',
            borderRadius: '16px',
            padding: '48px 32px',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.2s ease',
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          {/* Language Indicator */}
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '24px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
              color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)'
            }}
          >
            {isFlipped ? 'English' : '한국어'}
          </div>

          {/* Text Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            <p
              style={{
                fontSize: isFlipped ? '20px' : '24px',
                lineHeight: isFlipped ? '28px' : '32px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0
              }}
            >
              {isFlipped ? sentence.english : sentence.korean}
            </p>
          </div>

          {/* Hint */}
          <div
            style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)'
            }}
          >
            클릭하여 {isFlipped ? '한국어' : '영어'} 보기
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            background: currentIndex === 0 ? 'var(--surface-secondary)' : '#3b82f6',
            color: currentIndex === 0 ? 'var(--text-tertiary)' : '#ffffff',
            transition: 'all 0.2s ease',
            boxShadow: currentIndex === 0 ? 'none' : 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            if (currentIndex > 0) {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentIndex > 0) {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Audio Button */}
        <button
          onClick={handlePlayAudio}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            background: isPlayingAudio ? '#ef4444' : '#10b981',
            color: '#ffffff',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isPlayingAudio ? '#dc2626' : '#059669';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isPlayingAudio ? '#ef4444' : '#10b981';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isPlayingAudio ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
            </svg>
          )}
        </button>

        {/* Important Button */}
        <button
          onClick={onToggleImportant}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            background: sentence.isImportant ? '#f59e0b' : 'var(--surface-primary)',
            color: sentence.isImportant ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
            boxShadow: 'var(--shadow-md)',
            borderWidth: sentence.isImportant ? '0' : '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border-primary)'
          }}
          onMouseEnter={(e) => {
            if (sentence.isImportant) {
              e.currentTarget.style.background = '#d97706';
            } else {
              e.currentTarget.style.background = '#fef3c7';
              e.currentTarget.style.color = '#92400e';
            }
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = sentence.isImportant ? '#f59e0b' : 'var(--surface-primary)';
            e.currentTarget.style.color = sentence.isImportant ? '#ffffff' : 'var(--text-secondary)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={currentIndex === totalCount - 1}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer',
            background: currentIndex === totalCount - 1 ? 'var(--surface-secondary)' : '#3b82f6',
            color: currentIndex === totalCount - 1 ? 'var(--text-tertiary)' : '#ffffff',
            transition: 'all 0.2s ease',
            boxShadow: currentIndex === totalCount - 1 ? 'none' : 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            if (currentIndex < totalCount - 1) {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentIndex < totalCount - 1) {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div
        style={{
          background: 'var(--surface-secondary)',
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            textAlign: 'center'
          }}
        >
          <div 
            style={{
              fontWeight: 600,
              marginBottom: '8px',
              color: 'var(--text-secondary)'
            }}
          >
            키보드 단축키
          </div>
          <div style={{ lineHeight: '18px' }}>
            <span style={{ marginRight: '16px' }}>← → : 이전/다음</span>
            <span style={{ marginRight: '16px' }}>Space : 듣기</span>
            <span style={{ marginRight: '16px' }}>Enter : 뒤집기</span>
            <span>I : 중요 표시</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;