import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { PlaybackSpeed } from '../types';
import Button from '../design-system/components/Button/Button';

interface AutoPlayProps {
  isActive: boolean;
  speed: PlaybackSpeed;
  onToggle: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onNext: () => void;
  onFlip: () => void;
  isCardFlipped: boolean;
  currentIndex: number;
  totalCount: number;
}

// Speed configurations in milliseconds
const SPEED_CONFIG = {
  slow: 4000,    // 4 seconds
  normal: 2500,  // 2.5 seconds  
  fast: 1500,    // 1.5 seconds
} as const;

// Animation variants for buttons
const buttonVariants = {
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

const AutoPlay: React.FC<AutoPlayProps> = React.memo(({
  isActive,
  speed,
  onToggle,
  onSpeedChange,
  onNext,
  onFlip,
  isCardFlipped,
  currentIndex,
  totalCount
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<'korean' | 'english'>('korean');

  // Clear timer helper
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto play logic
  const executeAutoPlay = useCallback(() => {
    if (!isActive) return;

    const interval = SPEED_CONFIG[speed];

    timerRef.current = setTimeout(() => {
      if (phaseRef.current === 'korean' && !isCardFlipped) {
        // Show English side
        onFlip();
        phaseRef.current = 'english';
        executeAutoPlay(); // Schedule next action
      } else if (phaseRef.current === 'english' && isCardFlipped) {
        // Move to next card
        if (currentIndex < totalCount - 1) {
          onNext();
          phaseRef.current = 'korean';
          executeAutoPlay(); // Schedule next action
        } else {
          // Reached end, stop auto play
          onToggle();
        }
      } else {
        // Card state doesn't match expected phase, sync up
        if (!isCardFlipped && phaseRef.current === 'english') {
          phaseRef.current = 'korean';
        } else if (isCardFlipped && phaseRef.current === 'korean') {
          phaseRef.current = 'english';
        }
        executeAutoPlay(); // Try again
      }
    }, interval);
  }, [isActive, speed, isCardFlipped, currentIndex, totalCount, onFlip, onNext, onToggle]);

  // Start/stop auto play when isActive changes
  useEffect(() => {
    if (isActive) {
      // Reset phase when starting
      phaseRef.current = isCardFlipped ? 'english' : 'korean';
      executeAutoPlay();
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isActive, executeAutoPlay, clearTimer, isCardFlipped]);

  // Restart timer when speed changes
  useEffect(() => {
    if (isActive) {
      clearTimer();
      executeAutoPlay();
    }
  }, [speed, isActive, clearTimer, executeAutoPlay]);

  // Reset phase when card changes manually
  useEffect(() => {
    phaseRef.current = isCardFlipped ? 'english' : 'korean';
  }, [currentIndex, isCardFlipped]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Speed options - memoized to prevent re-renders
  const speedOptions = React.useMemo(() => [
    { value: 'slow' as PlaybackSpeed, label: '느림', icon: '🐌' },
    { value: 'normal' as PlaybackSpeed, label: '보통', icon: '🚶' },
    { value: 'fast' as PlaybackSpeed, label: '빠름', icon: '🏃' },
  ], []);
  
  // Memoized progress calculation
  const progressPercentage = React.useMemo(() => 
    Math.round(((currentIndex + 1) / totalCount) * 100), 
    [currentIndex, totalCount]
  );

  return (
    <motion.div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label="자동 재생 컨트롤"
    >
      {/* Auto play toggle button */}
      <Button
        variant="primary"
        size="sm"
        onClick={onToggle}
        style={{
          backgroundColor: isActive ? '#ef4444' : '#10b981'
        }}
        aria-label={isActive ? "자동 재생 중단하기" : "자동 재생 시작하기"}
        aria-pressed={isActive}
        icon={
          isActive ? (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )
        }
      >
        {isActive ? '중단' : '자동재생'}
      </Button>

      {/* Speed control - Compact version */}
      <div 
        style={{ display: 'flex', gap: '4px' }} 
        role="radiogroup" 
        aria-label="자동 재생 속도 선택"
      >
        {speedOptions.map((option) => (
          <Button
            key={option.value}
            variant={speed === option.value ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onSpeedChange(option.value)}
            style={{
              width: '32px',
              height: '32px',
              minHeight: '32px',
              fontSize: '12px'
            }}
            aria-label={`재생 속도 ${option.label}으로 설정`}
            aria-pressed={speed === option.value}
            role="radio"
            aria-checked={speed === option.value}
            title={`속도: ${option.label}`}
          >
            {option.icon}
          </Button>
        ))}
      </div>

      {/* Status indicator - Compact */}
      {isActive && (
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            style={{
              width: '8px',
              height: '8px',
              background: 'var(--semantic-success-text-strong)',
              borderRadius: '50%'
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            aria-hidden="true"
          />
          <span>재생중</span>
        </motion.div>
      )}
    </motion.div>
  );
});

export default AutoPlay;