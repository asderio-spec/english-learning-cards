/**
 * PWA 기능을 제공하는 Provider 컴포넌트
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { InstallPrompt } from './InstallPrompt';
import { OfflineIndicator } from './OfflineIndicator';
import { UpdatePrompt } from './UpdatePrompt';

interface PWAContextType {
  showInstallPrompt: boolean;
  setShowInstallPrompt: (show: boolean) => void;
  showUpdatePrompt: boolean;
  setShowUpdatePrompt: (show: boolean) => void;
  pwaState: ReturnType<typeof usePWA>;
}

const PWAContext = createContext<PWAContextType | null>(null);

export const usePWAContext = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWAContext must be used within PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
  /** 자동 설치 프롬프트 표시 여부 */
  autoShowInstallPrompt?: boolean;
  /** 자동 업데이트 프롬프트 표시 여부 */
  autoShowUpdatePrompt?: boolean;
  /** 오프라인 인디케이터 표시 여부 */
  showOfflineIndicator?: boolean;
  /** 설치 프롬프트 지연 시간 (ms) */
  installPromptDelay?: number;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({
  children,
  autoShowInstallPrompt = true,
  autoShowUpdatePrompt = true,
  showOfflineIndicator = true,
  installPromptDelay = 30000 // 30초 후 표시
}) => {
  const pwaState = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);

  // 설치 프롬프트 자동 표시 로직
  useEffect(() => {
    if (!autoShowInstallPrompt || installPromptDismissed) return;

    let timer: NodeJS.Timeout;

    if (pwaState.install.canInstall) {
      // 일정 시간 후 설치 프롬프트 표시
      timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, installPromptDelay);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [pwaState.install.canInstall, autoShowInstallPrompt, installPromptDelay, installPromptDismissed]);

  // 업데이트 프롬프트 자동 표시 로직
  useEffect(() => {
    if (autoShowUpdatePrompt && pwaState.serviceWorker.hasUpdate) {
      setShowUpdatePrompt(true);
    }
  }, [pwaState.serviceWorker.hasUpdate, autoShowUpdatePrompt]);

  // 로컬 스토리지에서 설치 프롬프트 해제 상태 복원
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-prompt-dismissed');
    if (dismissed === 'true') {
      setInstallPromptDismissed(true);
    }
  }, []);

  const handleInstallPromptClose = () => {
    setShowInstallPrompt(false);
    setInstallPromptDismissed(true);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };

  const handleInstallComplete = () => {
    setShowInstallPrompt(false);
    setInstallPromptDismissed(true);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };

  const handleUpdateComplete = () => {
    setShowUpdatePrompt(false);
  };

  const contextValue: PWAContextType = {
    showInstallPrompt,
    setShowInstallPrompt,
    showUpdatePrompt,
    setShowUpdatePrompt,
    pwaState
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
      
      {/* 오프라인 인디케이터 */}
      {showOfflineIndicator && <OfflineIndicator />}
      
      {/* 설치 프롬프트 */}
      <InstallPrompt
        show={showInstallPrompt}
        onClose={handleInstallPromptClose}
        onInstalled={handleInstallComplete}
      />
      
      {/* 업데이트 프롬프트 */}
      <UpdatePrompt
        show={showUpdatePrompt}
        onClose={() => setShowUpdatePrompt(false)}
        onUpdated={handleUpdateComplete}
      />
    </PWAContext.Provider>
  );
};