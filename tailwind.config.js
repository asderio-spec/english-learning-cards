/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Include design system files for proper purging
    "./src/design-system/**/*.{js,ts,jsx,tsx}",
  ],
  // Enable JIT mode for smaller CSS in production
  mode: process.env.NODE_ENV === 'production' ? 'jit' : undefined,
  theme: {
    extend: {
      // Linear 디자인 시스템 색상
      colors: {
        primary: {
          50: '#F0F2FF',
          100: '#E0E4FF',
          200: '#C7CCFF',
          300: '#A5ACFF',
          400: '#8B93FF',
          500: '#5E6AD2',
          600: '#4C5BC7',
          700: '#3D4AB8',
          800: '#2F3A9E',
          900: '#1F2670'
        },
        secondary: {
          50: '#E6FAFE',
          100: '#CCF5FD',
          200: '#99EBFB',
          300: '#66E1F9',
          400: '#33D7F7',
          500: '#00D2FF',
          600: '#00B8E6',
          700: '#009ECC',
          800: '#0084B3',
          900: '#006A99'
        },
        success: {
          50: '#E6FDF5',
          100: '#CCFBEB',
          200: '#99F7D7',
          300: '#66F3C3',
          400: '#33EFAF',
          500: '#00C896',
          600: '#00B087',
          700: '#009878',
          800: '#008069',
          900: '#00685A'
        },
        warning: {
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD399',
          300: '#FFBD66',
          400: '#FFA733',
          500: '#FF6B35',
          600: '#E6602F',
          700: '#CC5529',
          800: '#B34A23',
          900: '#993F1D'
        },
        error: {
          50: '#FFE6E6',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#FF5C5C',
          600: '#E65252',
          700: '#CC4848',
          800: '#B33E3E',
          900: '#993434'
        },
        neutral: {
          50: '#F6F8FA',
          100: '#E1E4E8',
          200: '#D1D5DA',
          300: '#959DA5',
          400: '#6A737D',
          500: '#586069',
          600: '#444D56',
          700: '#2F363D',
          800: '#24292E',
          900: '#1B1F23'
        }
      },
      
      // Linear 디자인 시스템 폰트
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          'SF Mono',
          'Monaco',
          'Inconsolata',
          'Roboto Mono',
          'source-code-pro',
          'Menlo',
          'Consolas',
          'monospace'
        ]
      },
      
      // Linear 디자인 시스템 간격 (4px 기준)
      spacing: {
        '0': '0px',
        '1': '4px',    // xs
        '2': '8px',    // sm  
        '3': '12px',
        '4': '16px',   // md
        '5': '20px',
        '6': '24px',   // lg
        '7': '28px',
        '8': '32px',   // xl
        '9': '36px',
        '10': '40px',
        '11': '44px',  // 최소 터치 타겟
        '12': '48px',  // 2xl
        '14': '56px',
        '16': '64px',  // 3xl
        '18': '72px',
        '20': '80px',  // 4xl
        '24': '96px',  // 5xl
        '28': '112px',
        '32': '128px',
        '36': '144px',
        '40': '160px',
        '44': '176px',
        '48': '192px',
        '52': '208px',
        '56': '224px',
        '60': '240px',
        '64': '256px',
        '72': '288px',
        '80': '320px',
        '96': '384px',
        // 의미적 간격 별칭
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
        // 안전 영역 지원
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      
      // 브레이크포인트 (Linear 디자인 시스템)
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1024px',
        'wide': '1440px',
        'xs': '475px',
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
      },
      
      // 애니메이션 지속시간
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
        'slower': '500ms'
      },
      
      // 애니메이션 이징
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'snappy': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'gentle': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      
      // Linear 디자인 시스템 타이포그래피
      fontSize: {
        'display': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['18px', { lineHeight: '26px', letterSpacing: '0em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', letterSpacing: '0em', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', letterSpacing: '0em', fontWeight: '400' }],
        'caption-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'caption-md': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '500' }],
        'caption-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      
      // 폰트 가중치
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800'
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      // 컨테이너 최대 너비
      maxWidth: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1728px',
        '4xl': '1920px',
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1536px',
      },
      
      // 그리드 시스템
      gridTemplateColumns: {
        'none': 'none',
        '1': 'repeat(1, minmax(0, 1fr))',
        '2': 'repeat(2, minmax(0, 1fr))',
        '3': 'repeat(3, minmax(0, 1fr))',
        '4': 'repeat(4, minmax(0, 1fr))',
        '5': 'repeat(5, minmax(0, 1fr))',
        '6': 'repeat(6, minmax(0, 1fr))',
        '7': 'repeat(7, minmax(0, 1fr))',
        '8': 'repeat(8, minmax(0, 1fr))',
        '9': 'repeat(9, minmax(0, 1fr))',
        '10': 'repeat(10, minmax(0, 1fr))',
        '11': 'repeat(11, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        'auto': 'repeat(auto-fit, minmax(0, 1fr))',
        'auto-sm': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-md': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-lg': 'repeat(auto-fit, minmax(400px, 1fr))',
      },
      
      // 둥근 모서리 (Linear 스타일)
      borderRadius: {
        'none': '0px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-1500': {
          perspective: '1500px',
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.rotate-y-180': {
          transform: 'rotateY(180deg)',
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.overscroll-none': {
          'overscroll-behavior': 'none',
        },
        '.overscroll-y-none': {
          'overscroll-behavior-y': 'none',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
      }
      
      const newComponents = {
        '.btn-touch': {
          'min-height': '44px',
          'min-width': '44px',
          'touch-action': 'manipulation',
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.safe-area-inset': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        },
        
        // 반응형 타이포그래피 컴포넌트
        '.text-display-responsive': {
          'font-size': '28px',
          'line-height': '36px',
          'font-weight': '700',
          'letter-spacing': '-0.02em',
          '@media (min-width: 768px)': {
            'font-size': '32px',
            'line-height': '40px',
          }
        },
        '.text-h1-responsive': {
          'font-size': '24px',
          'line-height': '32px',
          'font-weight': '700',
          'letter-spacing': '-0.02em',
          '@media (min-width: 768px)': {
            'font-size': '28px',
            'line-height': '36px',
          }
        },
        '.text-h2-responsive': {
          'font-size': '20px',
          'line-height': '28px',
          'font-weight': '600',
          'letter-spacing': '-0.01em',
          '@media (min-width: 768px)': {
            'font-size': '24px',
            'line-height': '32px',
          }
        },
        
        // 반응형 간격 컴포넌트
        '.container-responsive': {
          'width': '100%',
          'max-width': '1024px',
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': '16px',
          'padding-right': '16px',
          '@media (min-width: 768px)': {
            'padding-left': '24px',
            'padding-right': '24px',
          },
          '@media (min-width: 1024px)': {
            'padding-left': '32px',
            'padding-right': '32px',
          }
        },
        '.section-spacing': {
          'padding-top': '24px',
          'padding-bottom': '24px',
          '@media (min-width: 768px)': {
            'padding-top': '32px',
            'padding-bottom': '32px',
          },
          '@media (min-width: 1024px)': {
            'padding-top': '48px',
            'padding-bottom': '48px',
          }
        },
        '.stack-spacing': {
          'display': 'flex',
          'flex-direction': 'column',
          'gap': '8px',
          '@media (min-width: 768px)': {
            'gap': '16px',
          },
          '@media (min-width: 1024px)': {
            'gap': '24px',
          }
        },
        '.grid-responsive': {
          'display': 'grid',
          'grid-template-columns': 'repeat(1, 1fr)',
          'gap': '16px',
          '@media (min-width: 768px)': {
            'grid-template-columns': 'repeat(2, 1fr)',
            'gap': '24px',
          },
          '@media (min-width: 1024px)': {
            'grid-template-columns': 'repeat(3, 1fr)',
            'gap': '32px',
          }
        },
        '.card-spacing': {
          'padding': '16px',
          '@media (min-width: 768px)': {
            'padding': '24px',
          },
          '@media (min-width: 1024px)': {
            'padding': '32px',
          }
        },
        
        // 텍스트 잘림 유틸리티
        '.text-truncate': {
          'overflow': 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap'
        },
        '.text-truncate-2': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis'
        },
        '.text-truncate-3': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
          'text-overflow': 'ellipsis'
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
}