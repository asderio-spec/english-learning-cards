import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { Sentence } from '../types';
import { TTSError } from '../types';
import { ttsService } from '../services/ttsService';
import { errorService } from '../services/errorService';
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

// Animation variants for card entrance
const cardEntranceVariants = {
    initial: {
        opacity: 0,
        scale: 0.8,
        y: 50
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: -50,
    }
};

// Animation variants for card sides
const cardSideVariants = {
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3 }
    },
    hidden: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.3 }
    }
};

// Animation variants for button interactions
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

const CardView: React.FC<CardViewProps> = React.memo(({
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

    // State for managing animation and interaction
    const [isAnimating, setIsAnimating] = useState(false);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioError, setAudioError] = useState<string | null>(null);
    const [ttsRetryCount, setTtsRetryCount] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // Memoized values for performance optimization
    const currentText = useMemo(() =>
        isFlipped ? sentence.english : sentence.korean,
        [isFlipped, sentence.english, sentence.korean]
    );

    const currentLanguage = useMemo(() =>
        isFlipped ? 'en' : 'ko',
        [isFlipped]
    );

    const progressText = useMemo(() =>
        `${currentIndex + 1} / ${totalCount}`,
        [currentIndex, totalCount]
    );

    const isFirstCard = useMemo(() => currentIndex === 0, [currentIndex]);
    const isLastCard = useMemo(() => currentIndex === totalCount - 1, [currentIndex, totalCount]);

    // Memoized handlers for performance optimization
    const handleFlip = useCallback(() => {
        if (!isAnimating) {
            setIsAnimating(true);
            onFlip();
            // Visual feedback for card flip
            actions.showInfo('카드를 뒤집었습니다', 1500);
            // Reset animation state after animation completes
            setTimeout(() => setIsAnimating(false), 600);
        }
    }, [isAnimating, onFlip, actions]);

    const handleNext = useCallback(() => {
        if (!isAnimating && !isLastCard) {
            // Stop any playing audio when navigating
            if (isPlayingAudio) {
                ttsService.stop();
                setIsPlayingAudio(false);
            }
            onNext();
            actions.showInfo(`${currentIndex + 2}/${totalCount} 카드로 이동`, 1500);
        } else if (isLastCard) {
            actions.showWarning('마지막 카드입니다', 2000);
        }
    }, [isAnimating, isLastCard, currentIndex, totalCount, onNext, actions, isPlayingAudio]);

    const handlePrevious = useCallback(() => {
        if (!isAnimating && !isFirstCard) {
            // Stop any playing audio when navigating
            if (isPlayingAudio) {
                ttsService.stop();
                setIsPlayingAudio(false);
            }
            onPrevious();
            actions.showInfo(`${currentIndex}/${totalCount} 카드로 이동`, 1500);
        } else if (isFirstCard) {
            actions.showWarning('첫 번째 카드입니다', 2000);
        }
    }, [isAnimating, isFirstCard, currentIndex, onPrevious, actions, isPlayingAudio, totalCount]);

    // Handle audio playback with enhanced error handling
    const handlePlayAudio = useCallback(async () => {
        if (isPlayingAudio) {
            // Stop current audio
            ttsService.stop();
            setIsPlayingAudio(false);
            setAudioError(null);
            actions.showInfo('음성 재생을 중단했습니다');
            return;
        }

        // Show loading feedback
        actions.setLoading({
            isLoading: true,
            message: '음성을 준비하는 중...'
        });

        try {
            setIsPlayingAudio(true);
            setAudioError(null);

            // Use memoized values for text and language
            const text = currentText;
            const language = currentLanguage;

            // Check TTS support first
            if (!ttsService.isSupported()) {
                throw new Error('TTS not supported');
            }

            await ttsService.speak(text, language);

            // Success feedback
            setIsPlayingAudio(false);
            actions.setLoading({ isLoading: false });
            setTtsRetryCount(0); // Reset retry count on success

        } catch (error) {
            setIsPlayingAudio(false);
            actions.setLoading({ isLoading: false });

            // Create appropriate error based on error type
            let appError;
            if (error instanceof TTSError) {
                appError = errorService.createTTSError(error, () => {
                    if (ttsRetryCount < 3) {
                        setTtsRetryCount(prev => prev + 1);
                        handlePlayAudio();
                    }
                });
            } else {
                appError = errorService.createError(
                    'TTS_ERROR',
                    '음성 재생 중 오류가 발생했습니다',
                    'MEDIUM',
                    error instanceof Error ? error.message : 'Unknown error',
                    true,
                    () => {
                        if (ttsRetryCount < 3) {
                            setTtsRetryCount(prev => prev + 1);
                            handlePlayAudio();
                        }
                    }
                );
            }

            // Add error to global state
            actions.addError(appError);

            // Show user-friendly error message
            const userMessage = errorService.getUserFriendlyMessage(appError);
            const retryAction = appError.isRetryable && ttsRetryCount < 3 ? {
                label: '다시 시도',
                handler: () => {
                    setTtsRetryCount(prev => prev + 1);
                    handlePlayAudio();
                }
            } : undefined;

            actions.showError(userMessage, 5000, retryAction);

            setAudioError(appError.message);

            // Clear local error after 5 seconds
            setTimeout(() => setAudioError(null), 5000);
        }
    }, [isPlayingAudio, currentText, currentLanguage, actions, ttsRetryCount]);

    // Handle swipe gestures for mobile
    const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 100; // Minimum swipe distance
        const velocity = 500; // Minimum swipe velocity

        if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocity) {
            if (info.offset.x > 0) {
                // Swiped right - go to previous
                handlePrevious();
            } else {
                // Swiped left - go to next
                handleNext();
            }
        }
    }, [handleNext, handlePrevious]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Prevent default behavior for all our handled keys
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    handlePrevious();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    handleNext();
                    break;
                case ' ':
                    event.preventDefault();
                    // Spacebar for audio playback
                    handlePlayAudio();
                    break;
                case 'Enter':
                    event.preventDefault();
                    handleFlip();
                    break;
                case 'Escape':
                    event.preventDefault();
                    // Stop audio on escape
                    if (isPlayingAudio) {
                        ttsService.stop();
                        setIsPlayingAudio(false);
                        setAudioError(null);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleFlip, handleNext, handlePrevious, handlePlayAudio, isPlayingAudio]);

    // Set drag constraints based on card width
    useEffect(() => {
        if (cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            setDragConstraints({ left: -cardWidth * 0.3, right: cardWidth * 0.3 });
        }
    }, []);

    // Enhanced toggle important with feedback
    const handleToggleImportant = useCallback(() => {
        onToggleImportant();
        const message = sentence.isImportant
            ? '중요 표시를 해제했습니다'
            : '중요 문장으로 표시했습니다';
        actions.showSuccess(message, 2000);
    }, [onToggleImportant, sentence.isImportant, actions]);

    // Cleanup audio when sentence changes or component unmounts
    useEffect(() => {
        return () => {
            ttsService.stop();
            setIsPlayingAudio(false);
            setAudioError(null);
            setTtsRetryCount(0);
        };
    }, [sentence.id]);

    // Stop audio when card flips to prevent confusion
    useEffect(() => {
        if (isPlayingAudio) {
            ttsService.stop();
            setIsPlayingAudio(false);
        }
    }, [isFlipped]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 sm:pt-24">
            {/* Progress indicator - Mobile optimized */}
            <motion.div
                className="mb-6 sm:mb-8 text-sm sm:text-base text-gray-700"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                role="status"
                aria-live="polite"
                aria-label={`현재 ${currentIndex + 1}번째 카드, 총 ${totalCount}개 카드 중`}
            >
                {progressText}
            </motion.div>

            {/* Main card container - Mobile optimized */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={sentence.id}
                        ref={cardRef}
                        className="relative w-full h-64 sm:h-80 lg:h-96 cursor-pointer"
                        variants={cardEntranceVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 0.5,
                            ease: "easeOut",
                        }}
                        drag="x"
                        dragConstraints={dragConstraints}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        whileDrag={{ scale: 1.02 }}
                        onClick={handleFlip}
                        role="button"
                        tabIndex={0}
                        aria-label={`카드 뒤집기. 현재 ${isFlipped ? '영어' : '한국어'} 면 표시 중`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleFlip();
                            }
                        }}
                    >
                        {/* Card content - Simple conditional rendering */}
                        <div className="relative w-full h-full">
                            <AnimatePresence mode="wait">
                                {!isFlipped ? (
                                    /* Front side (Korean) */
                                    <motion.div
                                        key="korean"
                                        className="absolute inset-0 w-full h-full"
                                        variants={cardSideVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg border border-blue-200 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                                            <motion.div
                                                className="text-base sm:text-lg text-blue-700 mb-3 sm:mb-4 font-semibold"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                aria-label="언어: 한국어"
                                            >
                                                한국어
                                            </motion.div>
                                            <motion.div
                                                className="text-lg sm:text-xl lg:text-2xl font-medium text-blue-900 text-center leading-relaxed px-2 min-h-[3rem] flex items-center justify-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                role="text"
                                                aria-label={`한국어 문장: ${sentence.korean}`}
                                            >
                                                {sentence.korean}
                                            </motion.div>
                                            <motion.div
                                                className="mt-4 sm:mt-6 text-xs sm:text-sm text-blue-600 text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                aria-label="사용법 안내"
                                            >
                                                카드를 클릭하여 영어 문장 보기
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* Back side (English) */
                                    <motion.div
                                        key="english"
                                        className="absolute inset-0 w-full h-full"
                                        variants={cardSideVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg border border-green-200 p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                                            <motion.div
                                                className="text-base sm:text-lg text-green-700 mb-3 sm:mb-4 font-semibold"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                                aria-label="언어: 영어"
                                            >
                                                English
                                            </motion.div>
                                            <motion.div
                                                className="text-lg sm:text-xl lg:text-2xl font-medium text-green-900 text-center leading-relaxed px-2 min-h-[3rem] flex items-center justify-center"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                role="text"
                                                aria-label={`영어 문장: ${sentence.english}`}
                                            >
                                                {sentence.english}
                                            </motion.div>
                                            <motion.div
                                                className="mt-4 sm:mt-6 text-xs sm:text-sm text-green-600 text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                aria-label="사용법 안내"
                                            >
                                                카드를 클릭하여 한국어 문장 보기
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Control buttons - Mobile optimized */}
                <motion.div
                    className="flex justify-between items-center mt-4 sm:mt-6 px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    role="toolbar"
                    aria-label="카드 컨트롤"
                >
                    {/* Previous button */}
                    <motion.button
                        onClick={handlePrevious}
                        disabled={isFirstCard}
                        className={`
              flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-colors touch-manipulation focus:ring-4
              ${isFirstCard
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:ring-blue-300'
                            }
            `}
                        variants={buttonVariants}
                        whileTap="tap"
                        whileHover={!isFirstCard ? "hover" : undefined}
                        aria-label={isFirstCard ? "이전 카드 없음" : "이전 카드로 이동 (왼쪽 화살표 키)"}
                        aria-disabled={isFirstCard}
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </motion.button>

                    {/* Center controls */}
                    <div className="flex space-x-3 sm:space-x-4">
                        {/* Audio button */}
                        <motion.button
                            onClick={handlePlayAudio}
                            className={`
                flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-colors relative touch-manipulation focus:ring-4
                ${isPlayingAudio
                                    ? 'bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:ring-red-300'
                                    : audioError
                                        ? 'bg-orange-600 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-800 focus:ring-orange-300'
                                        : 'bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 focus:ring-green-300'
                                } text-white
              `}
                            variants={buttonVariants}
                            whileTap="tap"
                            whileHover="hover"
                            aria-label={
                                isPlayingAudio
                                    ? "음성 재생 중단 (스페이스바)"
                                    : audioError
                                        ? "음성 재생 오류 발생, 다시 시도 (스페이스바)"
                                        : `${isFlipped ? '영어' : '한국어'} 음성 재생 (스페이스바)`
                            }
                            aria-pressed={isPlayingAudio}
                            title={audioError || (isPlayingAudio ? "음성 중단 (스페이스바)" : "음성 재생 (스페이스바)")}
                        >
                            {isPlayingAudio ? (
                                // Stop icon when playing
                                <motion.svg
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <path d="M6 6h12v12H6z" />
                                </motion.svg>
                            ) : audioError ? (
                                // Warning icon when error
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            ) : (
                                // Play icon when ready
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
                                </svg>
                            )}
                        </motion.button>

                        {/* Important button */}
                        <motion.button
                            onClick={handleToggleImportant}
                            className={`
                flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-colors touch-manipulation focus:ring-4
                ${sentence.isImportant
                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600 focus:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-300'
                                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:ring-gray-300'
                                }
              `}
                            variants={buttonVariants}
                            whileTap="tap"
                            whileHover="hover"
                            aria-label={sentence.isImportant ? "중요 문장 표시 해제하기" : "중요 문장으로 표시하기"}
                            aria-pressed={sentence.isImportant}
                        >
                            <motion.svg
                                className="w-5 h-5 sm:w-6 sm:h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                animate={sentence.isImportant ? { rotate: [0, -10, 10, 0] } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </motion.svg>
                        </motion.button>
                    </div>

                    {/* Next button */}
                    <motion.button
                        onClick={handleNext}
                        disabled={isLastCard}
                        className={`
              flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-colors touch-manipulation focus:ring-4
              ${isLastCard
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:ring-blue-300'
                            }
            `}
                        variants={buttonVariants}
                        whileTap="tap"
                        whileHover={!isLastCard ? "hover" : undefined}
                        aria-label={isLastCard ? "다음 카드 없음" : "다음 카드로 이동 (오른쪽 화살표 키)"}
                        aria-disabled={isLastCard}
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </motion.div>
            </div>

            {/* Card flip instruction - Mobile optimized - Moved below controls */}
            <motion.div
                className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-sm px-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                role="region"
                aria-label="사용법 안내"
            >
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200">
                    <p className="font-medium text-gray-700 mb-2">📖 사용법</p>
                    <p>카드를 클릭하여 뒤집거나, 좌우 버튼으로 이동하세요.</p>
                    <p className="mt-1">🔊 음성 버튼으로 발음을 들어보세요.</p>
                    <p className="mt-1">⭐ 중요한 문장은 별표로 표시하세요.</p>
                    <div className="mt-3 text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-2">
                        <p className="hidden sm:block">⌨️ 키보드: ← → (이동), Enter (뒤집기), Space (음성), Esc (음성 중단)</p>
                        <p>📱 카드를 좌우로 스와이프하여 이동</p>
                    </div>
                </div>
                {audioError && (
                    <motion.div
                        className="mt-3 text-xs text-orange-800 bg-orange-100 px-3 py-2 rounded-lg border border-orange-200"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        role="alert"
                        aria-live="assertive"
                    >
                        ⚠️ {audioError}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
});

export default CardView;