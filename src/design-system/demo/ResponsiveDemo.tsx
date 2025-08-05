/**
 * Linear 디자인 시스템 - 반응형 시스템 데모
 * 반응형 훅들의 동작을 시각적으로 확인하는 데모
 */

import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import Grid from '../components/Layout/Grid';
import Container from '../components/Layout/Container';
import Flex from '../components/Layout/Flex';
import {
  useBreakpoint,
  useBreakpointUp,
  useBreakpointDown,
  useBreakpointOnly,
  useMediaQuery,
  useDeviceDetection,
  useDeviceOptimizedStyles,
  useResponsiveLayout,
  useResponsiveGrid,
  useTouchOptimization,
  mediaQueries,
} from '../hooks';

const ResponsiveDemo: React.FC = () => {
  // 반응형 훅들 사용
  const breakpoint = useBreakpoint();
  const isTabletUp = useBreakpointUp('tablet');
  const isMobileOnly = useBreakpointOnly('mobile');
  const isDesktopDown = useBreakpointDown('desktop');
  
  // 미디어 쿼리 훅들 사용
  const isDarkMode = useMediaQuery(mediaQueries.darkMode);
  const isTouchDevice = useMediaQuery(mediaQueries.touch);
  const isPortrait = useMediaQuery(mediaQueries.portrait);
  const prefersReducedMotion = useMediaQuery(mediaQueries.reducedMotion);
  
  // 디바이스 감지 훅 사용
  const deviceInfo = useDeviceDetection();
  const optimizedStyles = useDeviceOptimizedStyles();

  return (
    <div className="space-y-8 p-6" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <div>
        <h2 className="text-h2 font-bold mb-4">반응형 시스템 데모</h2>
        <p className="text-body-md mb-6" style={{ color: 'var(--text-secondary)' }}>
          화면 크기를 조정하거나 디바이스를 회전시켜 반응형 동작을 확인해보세요.
        </p>
      </div>

      {/* 현재 브레이크포인트 정보 */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">현재 브레이크포인트</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3">기본 정보</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>현재 브레이크포인트:</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {breakpoint.current}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>화면 크기:</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {breakpoint.width} × {breakpoint.height}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">브레이크포인트 상태</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${breakpoint.isMobile ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>모바일 (&lt; 768px)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${breakpoint.isTablet ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>태블릿 (768px - 1023px)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${breakpoint.isDesktop ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>데스크톱 (1024px - 1439px)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${breakpoint.isWide ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>와이드 (≥ 1440px)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 브레이크포인트 유틸리티 훅들 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">브레이크포인트 유틸리티 훅</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
            <h4 className="text-h4 font-medium mb-2">useBreakpointUp</h4>
            <div className="space-y-1 text-body-sm">
              <div>태블릿 이상: <span className={isTabletUp ? 'text-green-600' : 'text-red-600'}>{isTabletUp ? '✓' : '✗'}</span></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
            <h4 className="text-h4 font-medium mb-2">useBreakpointOnly</h4>
            <div className="space-y-1 text-body-sm">
              <div>모바일만: <span className={isMobileOnly ? 'text-green-600' : 'text-red-600'}>{isMobileOnly ? '✓' : '✗'}</span></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-secondary)' }}>
            <h4 className="text-h4 font-medium mb-2">useBreakpointDown</h4>
            <div className="space-y-1 text-body-sm">
              <div>데스크톱 이하: <span className={isDesktopDown ? 'text-green-600' : 'text-red-600'}>{isDesktopDown ? '✓' : '✗'}</span></div>
            </div>
          </div>
        </div>
      </Card>

      {/* 미디어 쿼리 정보 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">미디어 쿼리 상태</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3">사용자 선호도</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>다크 모드 선호</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${prefersReducedMotion ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>애니메이션 감소 선호</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">디바이스 특성</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isTouchDevice ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>터치 디바이스</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPortrait ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>세로 방향</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 디바이스 감지 정보 */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">디바이스 감지 정보</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3">디바이스 타입</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isMobile ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>모바일</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isTablet ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>태블릿</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isDesktop ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>데스크톱</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">운영체제</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isIOS ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>iOS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isAndroid ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Android</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isWindows ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Windows</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isMacOS ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>macOS</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">브라우저</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isChrome ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Chrome</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isFirefox ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Firefox</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isSafari ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Safari</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${deviceInfo.isEdge ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Edge</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 최적화된 스타일 정보 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">디바이스 최적화 스타일</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3">터치 최적화</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>터치 타겟 크기:</span>
                <span className="font-medium">{optimizedStyles.touchTargetSize}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>호버 효과:</span>
                <span className="font-medium">{optimizedStyles.enableHover ? '활성화' : '비활성화'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>스크롤 동작:</span>
                <span className="font-medium">{optimizedStyles.scrollBehavior}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">성능 최적화</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Will-change:</span>
                <span className="font-medium">{optimizedStyles.willChange}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>폰트 스무딩:</span>
                <span className="font-medium">{optimizedStyles.fontSmoothing}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>픽셀 비율:</span>
                <span className="font-medium">{deviceInfo.pixelRatio}x</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 반응형 레이아웃 예시 */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">반응형 레이아웃 예시</h3>
        
        <div className={`grid gap-4 ${
          breakpoint.isMobile ? 'grid-cols-1' :
          breakpoint.isTablet ? 'grid-cols-2' :
          'grid-cols-3'
        }`}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg text-center"
              style={{ 
                backgroundColor: 'var(--surface-secondary)',
                minHeight: optimizedStyles.touchTargetSize,
              }}
            >
              <div className="text-body-sm font-medium">카드 {i + 1}</div>
              <div className="text-caption-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {breakpoint.current} 레이아웃
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'var(--surface-secondary)' }}>
          <p className="text-caption-md" style={{ color: 'var(--text-secondary)' }}>
            현재 {breakpoint.current} 브레이크포인트에서 {
              breakpoint.isMobile ? '1열' :
              breakpoint.isTablet ? '2열' :
              '3열'
            } 그리드로 표시됩니다.
          </p>
        </div>
      </Card>

      {/* 새로운 반응형 컴포넌트 동작 데모 */}
      <ResponsiveComponentDemo />

      {/* 사용법 가이드 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">사용법 가이드</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-h4 font-medium mb-2">기본 사용법</h4>
            <div className="p-4 rounded-lg font-mono text-caption-md" style={{ backgroundColor: 'var(--surface-secondary)' }}>
              {`import { useBreakpoint, useMediaQuery } from './hooks';

function MyComponent() {
  const { current, isMobile } = useBreakpoint();
  const isTouchDevice = useMediaQuery('(hover: none)');
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      현재 브레이크포인트: {current}
    </div>
  );
}`}
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-2">고급 사용법</h4>
            <div className="p-4 rounded-lg font-mono text-caption-md" style={{ backgroundColor: 'var(--surface-secondary)' }}>
              {`import { useDeviceDetection, useDeviceOptimizedStyles } from './hooks';

function OptimizedComponent() {
  const device = useDeviceDetection();
  const styles = useDeviceOptimizedStyles();
  
  return (
    <button 
      style={{ 
        minHeight: styles.touchTargetSize,
        cursor: device.isTouchDevice ? 'default' : 'pointer'
      }}
    >
      최적화된 버튼
    </button>
  );
}`}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

/**
 * 새로운 반응형 컴포넌트 동작 데모
 */
const ResponsiveComponentDemo: React.FC = () => {
  // 반응형 레이아웃 훅 사용
  const responsiveLayout = useResponsiveLayout({
    columns: { mobile: 1, tablet: 2, desktop: 3, wide: 4 },
    gap: { mobile: 2, tablet: 4, desktop: 6 },
    padding: { mobile: 4, tablet: 6, desktop: 8 },
    maxWidth: 'lg',
    touchOptimized: true,
    enableTransitions: true,
  });

  // 반응형 그리드 훅 사용
  const responsiveGrid = useResponsiveGrid(
    { mobile: 1, tablet: 2, desktop: 4 },
    { mobile: 2, tablet: 4, desktop: 6 }
  );

  // 터치 최적화 훅 사용
  const touchOptimization = useTouchOptimization('md', true);

  return (
    <>
      {/* 반응형 컴포넌트 동작 데모 */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">반응형 컴포넌트 동작</h3>
        
        <div className="space-y-6">
          {/* 반응형 컨테이너 */}
          <div>
            <h4 className="text-h4 font-medium mb-3">반응형 컨테이너</h4>
            <Container 
              maxWidth="lg" 
              responsivePadding={true}
              enableTransitions={true}
              style={{ backgroundColor: 'var(--surface-secondary)', borderRadius: '8px' }}
            >
              <div className="py-4 text-center">
                <p className="text-body-md">
                  화면 크기에 따라 패딩이 자동 조정됩니다
                </p>
                <p className="text-caption-md mt-2" style={{ color: 'var(--text-secondary)' }}>
                  현재 패딩: {responsiveLayout.utils.getPadding()}
                </p>
              </div>
            </Container>
          </div>

          {/* 반응형 그리드 */}
          <div>
            <h4 className="text-h4 font-medium mb-3">반응형 그리드</h4>
            <Grid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap={{ mobile: 2, tablet: 4, desktop: 6 }}
              enableTransitions={true}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg text-center"
                  style={{ 
                    backgroundColor: 'var(--surface-secondary)',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="text-body-sm">아이템 {i + 1}</span>
                </div>
              ))}
            </Grid>
            <p className="text-caption-md mt-2" style={{ color: 'var(--text-secondary)' }}>
              현재 {responsiveGrid.columns}열 그리드, 간격: {responsiveGrid.gap}
            </p>
          </div>

          {/* 반응형 Flex */}
          <div>
            <h4 className="text-h4 font-medium mb-3">반응형 Flex</h4>
            <Flex 
              direction={{ mobile: 'column', tablet: 'row' }}
              gap={{ mobile: 2, tablet: 4 }}
              enableTransitions={true}
              style={{ 
                padding: '16px',
                backgroundColor: 'var(--surface-secondary)',
                borderRadius: '8px',
              }}
            >
              <div style={{ 
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--surface-primary)',
                borderRadius: '6px',
                textAlign: 'center',
              }}>
                <span className="text-body-sm">Flex 아이템 1</span>
              </div>
              <div style={{ 
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--surface-primary)',
                borderRadius: '6px',
                textAlign: 'center',
              }}>
                <span className="text-body-sm">Flex 아이템 2</span>
              </div>
              <div style={{ 
                flex: 1,
                padding: '12px',
                backgroundColor: 'var(--surface-primary)',
                borderRadius: '6px',
                textAlign: 'center',
              }}>
                <span className="text-body-sm">Flex 아이템 3</span>
              </div>
            </Flex>
            <p className="text-caption-md mt-2" style={{ color: 'var(--text-secondary)' }}>
              모바일에서는 세로 방향, 태블릿 이상에서는 가로 방향으로 배치
            </p>
          </div>

          {/* 터치 최적화 버튼 */}
          <div>
            <h4 className="text-h4 font-medium mb-3">터치 최적화 버튼</h4>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="primary" 
                size="sm" 
                touchOptimized={true}
              >
                Small 버튼
              </Button>
              <Button 
                variant="secondary" 
                size="md" 
                touchOptimized={true}
              >
                Medium 버튼
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                touchOptimized={true}
              >
                Large 버튼
              </Button>
            </div>
            <p className="text-caption-md mt-2" style={{ color: 'var(--text-secondary)' }}>
              터치 디바이스: {touchOptimization.isTouchDevice ? '예' : '아니오'} | 
              최소 터치 타겟: {touchOptimization.styles.minHeight}
            </p>
          </div>
        </div>
      </Card>

      {/* 반응형 레이아웃 상태 정보 */}
      <Card variant="default" padding="lg">
        <h3 className="text-h3 font-semibold mb-4">반응형 레이아웃 상태</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-h4 font-medium mb-3">현재 설정</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>컬럼 수:</span>
                <span className="font-medium">{responsiveLayout.utils.getColumns()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>간격:</span>
                <span className="font-medium">{responsiveLayout.utils.getGap()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>패딩:</span>
                <span className="font-medium">{responsiveLayout.utils.getPadding()}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-h4 font-medium mb-3">최적화 설정</h4>
            <div className="space-y-2 text-body-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>호버 효과:</span>
                <span className="font-medium">{responsiveLayout.optimization.enableHover ? '활성화' : '비활성화'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>스크롤 동작:</span>
                <span className="font-medium">{responsiveLayout.optimization.scrollBehavior}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Will-change:</span>
                <span className="font-medium">{responsiveLayout.optimization.willChange}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ResponsiveDemo;