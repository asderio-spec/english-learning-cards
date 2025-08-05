/**
 * 오프라인 상태 표시 컴포넌트
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetworkStatus } from '../../hooks/usePWA';

interface OfflineIndicatorProps {
  /** 표시 위치 */
  position?: 'top' | 'bottom';
  /** 자동 숨김 시간 (ms) */
  autoHideDelay?: number;
  /** 커스텀 메시지 */
  offlineMessage?: string;
  /** 온라인 복구 메시지 */
  onlineMessage?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  autoHideDelay = 5000,
  offlineMessage = '인터넷 연결이 끊어졌습니다. 오프라인 모드로 계속 이용할 수 있습니다.',
  onlineMessage = '인터넷 연결이 복구되었습니다.'
}) => {
  const { isOnline, connectionQuality } = useNetworkStatus();
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowOnlineMessage(false);
    } else if (wasOffline) {
      setShowOnlineMessage(true);
      setWasOffline(false);
      
      // 온라인 메시지 자동 숨김
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
      }, autoHideDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, autoHideDelay]);

  const getConnectionIcon = () => {
    if (!isOnline) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L18.364 18.364M8.11 8.11l7.78 7.78" />
        </svg>
      );
    }
    
    if (connectionQuality === 'slow') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    );
  };

  const getBackgroundColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (showOnlineMessage) return 'bg-green-500';
    if (connectionQuality === 'slow') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMessage = () => {
    if (!isOnline) return offlineMessage;
    if (showOnlineMessage) return onlineMessage;
    if (connectionQuality === 'slow') return '인터넷 연결이 느립니다.';
    return '';
  };

  const shouldShow = !isOnline || showOnlineMessage || connectionQuality === 'slow';

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
          transition={{ duration: 0.3 }}
          className={`
            fixed left-0 right-0 z-50 
            ${position === 'top' ? 'top-0' : 'bottom-0'}
          `}
        >
          <div className={`${getBackgroundColor()} text-white px-4 py-3 shadow-lg`}>
            <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
              {getConnectionIcon()}
              <span className="text-sm font-medium text-center">
                {getMessage()}
              </span>
              
              {/* 연결 품질 표시 */}
              {isOnline && connectionQuality === 'slow' && (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-white/60 rounded"></div>
                  <div className="w-1 h-4 bg-white/80 rounded"></div>
                  <div className="w-1 h-2 bg-white/40 rounded"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 간단한 연결 상태 아이콘
 */
export const ConnectionStatus: React.FC<{
  className?: string;
  showLabel?: boolean;
}> = ({ className = '', showLabel = false }) => {
  const { isOnline, connectionQuality } = useNetworkStatus();

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (connectionQuality === 'slow') return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return '오프라인';
    if (connectionQuality === 'slow') return '느림';
    return '온라인';
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