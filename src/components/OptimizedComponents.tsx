/**
 * Performance-optimized components using React.memo, useMemo, and useCallback
 * React.memo, useMemo, useCallback을 사용한 성능 최적화 컴포넌트들
 */

import React, { memo, useMemo, useCallback } from 'react';
import { componentUtils, callbackUtils, performanceMonitor } from '../utils/performanceUtils';
import type { Grade, Sentence } from '../types';

// Optimized Button component
interface OptimizedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export const OptimizedButton = memo<OptimizedButtonProps>(({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  performanceMonitor.useRenderTime('OptimizedButton');
  
  const buttonClasses = useMemo(() => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    return `${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`.trim();
  }, [variant, disabled, className]);
  
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);
  
  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}, componentUtils.shallowEqual);

// Optimized Card component
interface OptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

export const OptimizedCard = memo<OptimizedCardProps>(({
  children,
  className = '',
  padding = 'md',
  shadow = true,
}) => {
  performanceMonitor.useRenderTime('OptimizedCard');
  
  const cardClasses = useMemo(() => {
    const baseClasses = 'bg-white rounded-lg border border-gray-200';
    const paddingClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    const shadowClasses = shadow ? 'shadow-sm hover:shadow-md transition-shadow' : '';
    
    return `${baseClasses} ${paddingClasses[padding]} ${shadowClasses} ${className}`.trim();
  }, [padding, shadow, className]);
  
  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}, componentUtils.shallowEqual);

// Optimized Sentence Card component
interface OptimizedSentenceCardProps {
  sentence: Sentence;
  isFlipped: boolean;
  onFlip: () => void;
  onToggleImportant: () => void;
  currentIndex: number;
  totalCount: number;
}

export const OptimizedSentenceCard = memo<OptimizedSentenceCardProps>(({
  sentence,
  isFlipped,
  onFlip,
  onToggleImportant,
  currentIndex,
  totalCount,
}) => {
  performanceMonitor.useRenderTime('OptimizedSentenceCard');
  
  const progressPercentage = useMemo(() => {
    return totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  }, [currentIndex, totalCount]);
  
  const cardContent = useMemo(() => {
    return isFlipped ? sentence.korean : sentence.english;
  }, [isFlipped, sentence.korean, sentence.english]);
  
  const importantButtonText = useMemo(() => {
    return sentence.isImportant ? '★ 중요' : '☆ 중요';
  }, [sentence.isImportant]);
  
  const handleFlip = useCallback(() => {
    onFlip();
  }, [onFlip]);
  
  const handleToggleImportant = useCallback(() => {
    onToggleImportant();
  }, [onToggleImportant]);
  
  return (
    <OptimizedCard className="max-w-2xl mx-auto" padding="lg">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{currentIndex + 1} / {totalCount}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Card content */}
      <div className="text-center mb-6">
        <div className="min-h-[120px] flex items-center justify-center">
          <p className="text-xl font-medium text-gray-900">
            {cardContent}
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center space-x-4">
        <OptimizedButton onClick={handleFlip}>
          {isFlipped ? '영어 보기' : '한국어 보기'}
        </OptimizedButton>
        <OptimizedButton
          onClick={handleToggleImportant}
          variant={sentence.isImportant ? 'primary' : 'secondary'}
        >
          {importantButtonText}
        </OptimizedButton>
      </div>
    </OptimizedCard>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.sentence.id === nextProps.sentence.id &&
    prevProps.sentence.isImportant === nextProps.sentence.isImportant &&
    prevProps.isFlipped === nextProps.isFlipped &&
    prevProps.currentIndex === nextProps.currentIndex &&
    prevProps.totalCount === nextProps.totalCount
  );
});

// Optimized Grade Selector component
interface OptimizedGradeSelectorProps {
  onGradeSelect: (grade: Grade) => void;
  selectedGrade?: Grade;
}

export const OptimizedGradeSelector = memo<OptimizedGradeSelectorProps>(({
  onGradeSelect,
  selectedGrade,
}) => {
  performanceMonitor.useRenderTime('OptimizedGradeSelector');
  
  const grades: Grade[] = useMemo(() => [
    'elementary1', 'elementary2', 'elementary3',
    'elementary4', 'elementary5', 'elementary6',
    'middle1', 'middle2', 'middle3',
    'high1', 'high2', 'high3'
  ], []);
  
  const gradeLabels = useMemo(() => ({
    elementary1: '초등 1학년', elementary2: '초등 2학년', elementary3: '초등 3학년',
    elementary4: '초등 4학년', elementary5: '초등 5학년', elementary6: '초등 6학년',
    middle1: '중등 1학년', middle2: '중등 2학년', middle3: '중등 3학년',
    high1: '고등 1학년', high2: '고등 2학년', high3: '고등 3학년',
  }), []);
  
  const handleGradeSelect = useCallback((grade: Grade) => {
    onGradeSelect(grade);
  }, [onGradeSelect]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">학년을 선택하세요</h2>
        <p className="text-lg text-gray-600">학습할 학년을 선택하면 해당 수준의 영어 문장을 학습할 수 있습니다.</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {grades.map((grade) => (
          <OptimizedButton
            key={grade}
            onClick={() => handleGradeSelect(grade)}
            variant={selectedGrade === grade ? 'primary' : 'secondary'}
            className="h-16 text-lg"
          >
            {gradeLabels[grade]}
          </OptimizedButton>
        ))}
      </div>
    </div>
  );
}, componentUtils.shallowEqual);

// Optimized Progress Item component
interface OptimizedProgressItemProps {
  grade: Grade;
  progress: {
    total: number;
    completed: number;
    important: number;
  };
  onClick: (grade: Grade) => void;
}

export const OptimizedProgressItem = memo<OptimizedProgressItemProps>(({
  grade,
  progress,
  onClick,
}) => {
  performanceMonitor.useRenderTime('OptimizedProgressItem');
  
  const progressPercentage = useMemo(() => {
    return progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  }, [progress.completed, progress.total]);
  
  const gradeLabel = useMemo(() => {
    const labels: Record<Grade, string> = {
      elementary1: '초등 1학년', elementary2: '초등 2학년', elementary3: '초등 3학년',
      elementary4: '초등 4학년', elementary5: '초등 5학년', elementary6: '초등 6학년',
      middle1: '중등 1학년', middle2: '중등 2학년', middle3: '중등 3학년',
      high1: '고등 1학년', high2: '고등 2학년', high3: '고등 3학년',
    };
    return labels[grade];
  }, [grade]);
  
  const handleClick = useCallback(() => {
    onClick(grade);
  }, [grade, onClick]);
  
  return (
    <OptimizedCard className="cursor-pointer hover:shadow-lg transition-shadow">
      <div onClick={handleClick}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{gradeLabel}</h3>
          <span className="text-sm text-gray-500">
            {progress.completed}/{progress.total}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>진도율: {Math.round(progressPercentage)}%</span>
          <span>중요: {progress.important}개</span>
        </div>
      </div>
    </OptimizedCard>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.grade === nextProps.grade &&
    prevProps.progress.total === nextProps.progress.total &&
    prevProps.progress.completed === nextProps.progress.completed &&
    prevProps.progress.important === nextProps.progress.important
  );
});

// Export all optimized components
export {
  OptimizedButton as Button,
  OptimizedCard as Card,
  OptimizedSentenceCard as SentenceCard,
  OptimizedGradeSelector as GradeSelector,
  OptimizedProgressItem as ProgressItem,
};