/**
 * Linear 디자인 시스템 - 색상 시스템 데모
 * 색상 토큰과 테마 시스템의 동작을 확인하기 위한 데모 컴포넌트
 */

// React is imported automatically by Vite
import { colors } from '../tokens/colors';
import { useTheme, ThemeProvider } from '../context/ThemeContext';
import { 
  getColor, 
  checkColorAccessibility, 
  colorToTailwindClass,
  getThemeCSSVariable 
} from '../tokens/colorUtils';

// 색상 팔레트 표시 컴포넌트
function ColorPalette() {
  return (
    <div className="space-y-8">
      <h2 className="text-h2 text-primary mb-6">Linear 색상 팔레트</h2>
      
      {Object.entries(colors).map(([colorName, shades]) => (
        <div key={colorName} className="space-y-2">
          <h3 className="text-h3 capitalize">{colorName}</h3>
          <div className="grid grid-cols-10 gap-2">
            {Object.entries(shades).map(([shade, hex]) => {
              const accessibility = checkColorAccessibility(hex, '#FFFFFF');
              
              return (
                <div
                  key={shade}
                  className="relative group cursor-pointer"
                  style={{ backgroundColor: hex }}
                >
                  <div className="aspect-square w-full min-h-[60px] flex items-center justify-center">
                    <span 
                      className="text-caption-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ 
                        color: accessibility.wcagAA ? '#FFFFFF' : '#000000' 
                      }}
                    >
                      {shade}
                    </span>
                  </div>
                  
                  {/* 툴팁 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-caption-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    <div>{hex}</div>
                    <div>Contrast: {accessibility.contrastRatio}</div>
                    <div>WCAG: {accessibility.wcagAA ? 'AA ✓' : 'AA ✗'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// 테마 전환 버튼 컴포넌트
function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-primary border border-primary rounded-lg">
      <span className="text-body-md text-secondary">
        현재 테마: {theme} ({resolvedTheme})
      </span>
      
      <div className="flex gap-2">
        <button
          onClick={() => setTheme('light')}
          className={`px-3 py-1 rounded text-caption-lg transition-colors ${
            theme === 'light' 
              ? 'bg-primary-500 text-white' 
              : 'bg-surface-secondary text-secondary hover:bg-surface-tertiary'
          }`}
        >
          라이트
        </button>
        
        <button
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded text-caption-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-primary-500 text-white' 
              : 'bg-surface-secondary text-secondary hover:bg-surface-tertiary'
          }`}
        >
          다크
        </button>
        
        <button
          onClick={() => setTheme('system')}
          className={`px-3 py-1 rounded text-caption-lg transition-colors ${
            theme === 'system' 
              ? 'bg-primary-500 text-white' 
              : 'bg-surface-secondary text-secondary hover:bg-surface-tertiary'
          }`}
        >
          시스템
        </button>
        
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded text-caption-lg bg-secondary-500 text-white hover:bg-secondary-600 transition-colors"
        >
          토글
        </button>
      </div>
    </div>
  );
}

// CSS 변수 데모 컴포넌트
function CSSVariableDemo() {
  return (
    <div className="space-y-4">
      <h3 className="text-h3">CSS 변수 데모</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 색상 토큰 CSS 변수 */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-primary-50)' }}>
          <div className="text-body-md" style={{ color: 'var(--color-primary-800)' }}>
            Primary 50 배경 + Primary 800 텍스트
          </div>
          <code className="text-caption-sm text-tertiary">
            background: var(--color-primary-50)<br/>
            color: var(--color-primary-800)
          </code>
        </div>
        
        {/* 테마 CSS 변수 */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-primary)' }}>
          <div className="text-body-md" style={{ color: 'var(--text-primary)' }}>
            테마 기반 색상
          </div>
          <code className="text-caption-sm" style={{ color: 'var(--text-tertiary)' }}>
            background: var(--surface-primary)<br/>
            color: var(--text-primary)<br/>
            border: var(--border-primary)
          </code>
        </div>
      </div>
    </div>
  );
}

// 유틸리티 함수 데모 컴포넌트
function UtilityDemo() {
  const primaryColor = getColor('primary', 500);
  const tailwindClass = colorToTailwindClass('success', 500, 'bg');
  const themeVariable = getThemeCSSVariable('background', 'primary');
  
  return (
    <div className="space-y-4">
      <h3 className="text-h3">유틸리티 함수 데모</h3>
      
      <div className="space-y-2 text-body-sm">
        <div>
          <strong>getColor('primary', 500):</strong> {primaryColor}
        </div>
        <div>
          <strong>colorToTailwindClass('success', 500, 'bg'):</strong> {tailwindClass}
        </div>
        <div>
          <strong>getThemeCSSVariable('background', 'primary'):</strong> {themeVariable}
        </div>
      </div>
      
      <div className="flex gap-2">
        <div 
          className="w-16 h-16 rounded"
          style={{ backgroundColor: primaryColor }}
          title={`Primary 500: ${primaryColor}`}
        />
        <div 
          className={`w-16 h-16 rounded ${tailwindClass}`}
          title={`Tailwind class: ${tailwindClass}`}
        />
        <div 
          className="w-16 h-16 rounded"
          style={{ backgroundColor: themeVariable }}
          title={`Theme variable: ${themeVariable}`}
        />
      </div>
    </div>
  );
}

// 메인 데모 컴포넌트
function ColorDemoContent() {
  return (
    <div className="min-h-screen bg-primary text-primary p-6 transition-colors duration-normal">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-display">Linear 디자인 시스템</h1>
          <p className="text-body-lg text-secondary">
            색상 토큰, 테마 시스템, CSS 변수 데모
          </p>
        </header>
        
        <ThemeToggle />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CSSVariableDemo />
          <UtilityDemo />
        </div>
        
        <ColorPalette />
      </div>
    </div>
  );
}

// 테마 프로바이더로 감싼 메인 컴포넌트
export default function ColorDemo() {
  return (
    <ThemeProvider defaultTheme="system">
      <ColorDemoContent />
    </ThemeProvider>
  );
}