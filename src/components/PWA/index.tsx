import React from 'react';
import { usePWA } from '../../hooks/usePWA';
import UpdatePrompt from './UpdatePrompt';
import OfflineIndicator from './OfflineIndicator';

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const { 
    isOnline, 
    updateAvailable, 
    installPrompt, 
    updateApp, 
    installApp 
  } = usePWA();

  return (
    <>
      {children}
      
      {/* Update prompt when new version is available */}
      {updateAvailable && (
        <UpdatePrompt onUpdate={updateApp} />
      )}
      
      {/* Offline indicator */}
      <OfflineIndicator isOnline={isOnline} />
      
      {/* Install prompt for PWA */}
      {installPrompt && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={installApp}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            앱 설치
          </button>
        </div>
      )}
    </>
  );
};

export default PWAProvider;