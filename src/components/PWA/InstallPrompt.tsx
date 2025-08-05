/**
 * PWA 설치 프롬프트 컴포넌트
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '../../hooks/usePWA';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';

interface InstallPromptProps {
  /** 프롬프트 표시 여부 */
  show?: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** 설치 완료 콜백 */
  onInstalled?: () => void;
  /** 커스텀 메시지 */
  message?: string;
  /** 컴팩트 모드 */
  compact?: boolean;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  show = true,
  onClose,
  onInstalled,
  message,
  compact = false
}) => {
  const { canInstall, isInstalling, promptInstall, isSupported } = usePWAInstall();

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      onInstalled?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!isSupported || !canInstall || !show) {
    return null;
  }

  const defaultMessage = compact 
    ? "앱을 설치하여 더 빠르게 이용하세요!"
    : "English Card Learning 앱을 홈 화면에 설치하여 더 편리하게 이용하세요. 오프라인에서도 학습할 수 있습니다.";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: compact ? -20 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: compact ? -20 : 50 }}
        transition={{ duration: 0.3 }}
        className={`
          fixed z-50 
          ${compact 
            ? 'top-4 left-4 right-4' 
            : 'bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md'
          }
        `}
      >
        <Card variant="elevated" className="p-4">
          <div className={`flex items-start gap-3 ${compact ? 'flex-row' : 'flex-col sm:flex-row'}`}>
            {/* 앱 아이콘 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
            </div>

            {/* 메시지 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                앱 설치
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 ${compact ? 'text-sm' : 'text-sm mb-3'}`}>
                {message || defaultMessage}
              </p>
            </div>

            {/* 액션 버튼들 */}
            <div className={`flex gap-2 ${compact ? 'flex-row' : 'flex-col sm:flex-row w-full sm:w-auto'}`}>
              <Button
                variant="primary"
                size={compact ? "sm" : "md"}
                onClick={handleInstall}
                disabled={isInstalling}
                className="whitespace-nowrap"
              >
                {isInstalling ? '설치 중...' : '설치'}
              </Button>
              
              {onClose && (
                <Button
                  variant="ghost"
                  size={compact ? "sm" : "md"}
                  onClick={handleClose}
                  className="whitespace-nowrap"
                >
                  나중에
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 간단한 설치 버튼 컴포넌트
 */
export const InstallButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}> = ({ 
  variant = 'primary', 
  size = 'md',
  children = '앱 설치'
}) => {
  const { canInstall, isInstalling, promptInstall, isSupported } = usePWAInstall();

  if (!isSupported || !canInstall) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={promptInstall}
      disabled={isInstalling}
    >
      {isInstalling ? '설치 중...' : children}
    </Button>
  );
};