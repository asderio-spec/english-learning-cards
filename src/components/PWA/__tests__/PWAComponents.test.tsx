/**
 * PWA 컴포넌트들의 테스트
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallPrompt, InstallButton } from '../InstallPrompt';
import { OfflineIndicator, ConnectionStatus } from '../OfflineIndicator';
import { UpdatePrompt, UpdateButton } from '../UpdatePrompt';
import { PWAProvider } from '../PWAProvider';

// Mock PWA hooks
jest.mock('../../../hooks/usePWA', () => ({
  usePWAInstall: () => ({
    canInstall: true,
    isInstalled: false,
    isInstalling: false,
    promptInstall: jest.fn().mockResolvedValue(true),
    isSupported: true
  }),
  useNetworkStatus: () => ({
    isOnline: true,
    connectionQuality: 'fast',
    testConnection: jest.fn().mockResolvedValue('fast')
  }),
  useServiceWorker: () => ({
    status: 'active',
    hasUpdate: true,
    isUpdating: false,
    updateApp: jest.fn().mockResolvedValue(true),
    checkForAppUpdates: jest.fn().mockResolvedValue(true),
    isSupported: true
  }),
  usePWA: () => ({
    install: {
      canInstall: true,
      isInstalled: false,
      isInstalling: false,
      promptInstall: jest.fn().mockResolvedValue(true),
      isSupported: true
    },
    network: {
      isOnline: true,
      connectionQuality: 'fast',
      testConnection: jest.fn().mockResolvedValue('fast')
    },
    cache: {
      cacheSize: 1024,
      isClearing: false,
      clearCache: jest.fn().mockResolvedValue(true),
      removeFromCache: jest.fn().mockResolvedValue(true),
      updateCacheSize: jest.fn(),
      formatSize: (bytes: number) => `${bytes} B`
    },
    serviceWorker: {
      status: 'active',
      hasUpdate: true,
      isUpdating: false,
      updateApp: jest.fn().mockResolvedValue(true),
      checkForAppUpdates: jest.fn().mockResolvedValue(true),
      isSupported: true
    },
    isSupported: true
  })
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('InstallPrompt', () => {
  it('renders install prompt when installable', () => {
    render(<InstallPrompt show={true} />);
    
    expect(screen.getByText('앱 설치')).toBeInTheDocument();
    expect(screen.getByText('설치')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<InstallPrompt show={true} onClose={onClose} />);
    
    const closeButton = screen.getByText('나중에');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('handles install button click', async () => {
    const onInstalled = jest.fn();
    render(<InstallPrompt show={true} onInstalled={onInstalled} />);
    
    const installButton = screen.getByText('설치');
    fireEvent.click(installButton);
    
    await waitFor(() => {
      expect(onInstalled).toHaveBeenCalled();
    });
  });

  it('shows compact version correctly', () => {
    render(<InstallPrompt show={true} compact={true} />);
    
    expect(screen.getByText('앱을 설치하여 더 빠르게 이용하세요!')).toBeInTheDocument();
  });

  it('shows custom message when provided', () => {
    const customMessage = '커스텀 설치 메시지';
    render(<InstallPrompt show={true} message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

describe('InstallButton', () => {
  it('renders install button when installable', () => {
    render(<InstallButton />);
    
    expect(screen.getByText('앱 설치')).toBeInTheDocument();
  });

  it('shows custom children text', () => {
    render(<InstallButton>커스텀 설치</InstallButton>);
    
    expect(screen.getByText('커스텀 설치')).toBeInTheDocument();
  });
});

describe('OfflineIndicator', () => {
  it('does not render when online', () => {
    const { container } = render(<OfflineIndicator />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders offline message when offline', () => {
    // Mock offline state
    jest.mocked(require('../../../hooks/usePWA').useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionQuality: 'offline',
      testConnection: jest.fn().mockResolvedValue('offline')
    });

    render(<OfflineIndicator />);
    
    expect(screen.getByText(/인터넷 연결이 끊어졌습니다/)).toBeInTheDocument();
  });

  it('shows custom offline message', () => {
    jest.mocked(require('../../../hooks/usePWA').useNetworkStatus).mockReturnValue({
      isOnline: false,
      connectionQuality: 'offline',
      testConnection: jest.fn().mockResolvedValue('offline')
    });

    const customMessage = '커스텀 오프라인 메시지';
    render(<OfflineIndicator offlineMessage={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

describe('ConnectionStatus', () => {
  it('renders online status correctly', () => {
    render(<ConnectionStatus showLabel={true} />);
    
    expect(screen.getByText('온라인')).toBeInTheDocument();
  });

  it('renders without label by default', () => {
    render(<ConnectionStatus />);
    
    expect(screen.queryByText('온라인')).not.toBeInTheDocument();
  });
});

describe('UpdatePrompt', () => {
  it('renders update prompt when update is available', () => {
    render(<UpdatePrompt show={true} />);
    
    expect(screen.getByText('업데이트 사용 가능')).toBeInTheDocument();
    expect(screen.getByText('업데이트')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<UpdatePrompt show={true} onClose={onClose} />);
    
    const closeButton = screen.getByText('나중에');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('handles update button click', async () => {
    const onUpdated = jest.fn();
    render(<UpdatePrompt show={true} onUpdated={onUpdated} />);
    
    const updateButton = screen.getByText('업데이트');
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalled();
    });
  });

  it('shows custom message when provided', () => {
    const customMessage = '커스텀 업데이트 메시지';
    render(<UpdatePrompt show={true} message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

describe('UpdateButton', () => {
  it('renders update button when update is available', () => {
    render(<UpdateButton />);
    
    expect(screen.getByText('업데이트')).toBeInTheDocument();
  });

  it('shows custom children text', () => {
    render(<UpdateButton>커스텀 업데이트</UpdateButton>);
    
    expect(screen.getByText('커스텀 업데이트')).toBeInTheDocument();
  });
});

describe('PWAProvider', () => {
  it('renders children correctly', () => {
    render(
      <PWAProvider>
        <div>Test Content</div>
      </PWAProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides PWA context to children', () => {
    const TestComponent = () => {
      const { usePWAContext } = require('../PWAProvider');
      const context = usePWAContext();
      return <div>PWA Context Available: {context ? 'Yes' : 'No'}</div>;
    };

    render(
      <PWAProvider>
        <TestComponent />
      </PWAProvider>
    );
    
    expect(screen.getByText('PWA Context Available: Yes')).toBeInTheDocument();
  });

  it('handles auto show install prompt setting', () => {
    render(
      <PWAProvider autoShowInstallPrompt={false}>
        <div>Test Content</div>
      </PWAProvider>
    );
    
    // Should not show install prompt automatically
    expect(screen.queryByText('앱 설치')).not.toBeInTheDocument();
  });

  it('handles offline indicator setting', () => {
    render(
      <PWAProvider showOfflineIndicator={false}>
        <div>Test Content</div>
      </PWAProvider>
    );
    
    // Should not show offline indicator
    expect(screen.queryByText(/인터넷 연결/)).not.toBeInTheDocument();
  });
});