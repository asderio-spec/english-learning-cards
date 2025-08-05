/**
 * 앱 업데이트 프롬프트 컴포넌트
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useServiceWorker } from '../../hooks/usePWA';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';

interface UpdatePromptProps {
  /** 프롬프트 표시 여부 */
  show?: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** 업데이트 완료 콜백 */
  onUpdated?: () => void;
  /** 커스텀 메시지 */
  message?: string;
  /** 자동 표시 여부 */
  autoShow?: boolean;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({
  show,
  onClose,
  onUpdated,
  message,
  autoShow = true
}) => {
  const { hasUpdate, isUpdating, updateApp, isSupported } = useServiceWorker();

  const shouldShow = show !== undefined ? show : (autoShow && hasUpdate);

  const handleUpdate = async () => {
    const success = await updateApp();
    if (success) {
      onUpdated?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!isSupported || !shouldShow) {
    return null;
  }

  const defaultMessage = "새로운 버전이 사용 가능합니다. 업데이트하여 최신 기능을 이용하세요.";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <Card variant="elevated" className="p-4">
          <div className="flex items-start gap-3">
            {/* 업데이트 아이콘 */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
              </div>
            </div>

            {/* 메시지 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                업데이트 사용 가능
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {message || defaultMessage}
              </p>

              {/* 액션 버튼들 */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? '업데이트 중...' : '업데이트'}
                </Button>
                
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                  >
                    나중에
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * 간단한 업데이트 버튼 컴포넌트
 */
export const UpdateButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}> = ({ 
  variant = 'primary', 
  size = 'sm',
  children = '업데이트'
}) => {
  const { hasUpdate, isUpdating, updateApp, isSupported } = useServiceWorker();

  if (!isSupported || !hasUpdate) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={updateApp}
      disabled={isUpdating}
    >
      {isUpdating ? '업데이트 중...' : children}
    </Button>
  );
};

/**
 * Service Worker 상태 표시 컴포넌트
 */
export const ServiceWorkerStatus: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = false }) => {
  const { status, hasUpdate, isSupported } = useServiceWorker();

  if (!isSupported) {
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return hasUpdate ? 'text-yellow-500' : 'text-green-500';
      case 'installing':
      case 'waiting':
        return 'text-blue-500';
      case 'redundant':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    if (hasUpdate) return '업데이트 대기';
    
    switch (status) {
      case 'active':
        return '활성';
      case 'installing':
        return '설치 중';
      case 'waiting':
        return '대기 중';
      case 'redundant':
        return '비활성';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`} />
      {showLabel && (
        <span className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      )}
    </div>
  );
};