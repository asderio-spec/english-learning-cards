import type { Meta, StoryObj } from '@storybook/react';
import { typography, responsiveTypography } from './typography';
import { 
  getTypographyStyle, 
  getHeadingStyle, 
  getBodyStyle, 
  getCaptionStyle,
  getDisplayStyle,
  pxToRem,
  getRelativeLineHeight,
  getTextTruncationStyle
} from './typographyUtils';

const meta: Meta = {
  title: 'Design System/Tokens/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Linear Design System의 타이포그래피 토큰입니다. 읽기 쉽고 계층적인 텍스트 시스템을 제공합니다.

## 타이포그래피 구조
- **Display**: 가장 큰 제목 (32px)
- **Heading**: H1~H4 제목 (28px~18px)
- **Body**: 본문 텍스트 (18px~14px)
- **Caption**: 작은 텍스트 (14px~11px)

모든 타이포그래피는 Inter 폰트를 기본으로 사용하며, 반응형을 지원합니다.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 타이포그래피 샘플 컴포넌트
const TypographySample = ({ 
  title, 
  style, 
  children = "The quick brown fox jumps over the lazy dog. 빠른 갈색 여우가 게으른 개를 뛰어넘습니다." 
}: {
  title: string;
  style: React.CSSProperties;
  children?: React.ReactNode;
}) => (
  <div className="mb-6 p-4 border border-gray-200 rounded-lg">
    <div className="flex items-baseline justify-between mb-3">
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      <div className="text-xs text-gray-500 font-mono">
        {style.fontSize} / {style.lineHeight} / {style.fontWeight}
      </div>
    </div>
    <div style={style}>
      {children}
    </div>
    <div className="mt-2 text-xs text-gray-400 font-mono">
      Letter spacing: {style.letterSpacing}
    </div>
  </div>
);

// 디스플레이 타이포그래피
export const Display: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Display Typography</h2>
      <p className="text-gray-600 mb-8">
        가장 큰 제목에 사용되는 디스플레이 타이포그래피입니다. 
        랜딩 페이지의 메인 제목이나 중요한 헤드라인에 사용합니다.
      </p>
      
      <TypographySample
        title="Display"
        style={getDisplayStyle()}
      >
        Linear Design System
      </TypographySample>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">사용 예제</h4>
        <div className="space-y-3">
          <div style={getDisplayStyle()}>
            혁신적인 디자인 시스템
          </div>
          <div style={getDisplayStyle()}>
            Welcome to the Future
          </div>
          <div style={getDisplayStyle()}>
            2024년 새로운 시작
          </div>
        </div>
      </div>
    </div>
  )
};

// 헤딩 타이포그래피
export const Headings: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Heading Typography</h2>
      <p className="text-gray-600 mb-8">
        계층적 정보 구조를 만드는 헤딩 타이포그래피입니다. 
        H1부터 H4까지 4단계의 크기를 제공합니다.
      </p>
      
      <TypographySample
        title="Heading 1 (H1)"
        style={getHeadingStyle('h1')}
      >
        페이지 메인 제목
      </TypographySample>
      
      <TypographySample
        title="Heading 2 (H2)"
        style={getHeadingStyle('h2')}
      >
        섹션 제목
      </TypographySample>
      
      <TypographySample
        title="Heading 3 (H3)"
        style={getHeadingStyle('h3')}
      >
        서브섹션 제목
      </TypographySample>
      
      <TypographySample
        title="Heading 4 (H4)"
        style={getHeadingStyle('h4')}
      >
        작은 제목
      </TypographySample>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">계층 구조 예제</h4>
        <div className="space-y-4">
          <div style={getHeadingStyle('h1')}>1. 메인 챕터</div>
          <div style={getHeadingStyle('h2')} className="ml-4">1.1 주요 섹션</div>
          <div style={getHeadingStyle('h3')} className="ml-8">1.1.1 서브섹션</div>
          <div style={getHeadingStyle('h4')} className="ml-12">1.1.1.1 세부 항목</div>
        </div>
      </div>
    </div>
  )
};

// 본문 타이포그래피
export const Body: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Body Typography</h2>
      <p className="text-gray-600 mb-8">
        본문 텍스트에 사용되는 타이포그래피입니다. 
        읽기 편한 크기와 행간으로 설계되었습니다.
      </p>
      
      <TypographySample
        title="Body Large"
        style={getBodyStyle('large')}
      >
        큰 본문 텍스트입니다. 중요한 설명이나 인트로 텍스트에 사용합니다. 
        이 크기는 사용자의 주의를 끌면서도 읽기 편한 크기입니다.
      </TypographySample>
      
      <TypographySample
        title="Body Medium"
        style={getBodyStyle('medium')}
      >
        일반적인 본문 텍스트입니다. 대부분의 콘텐츠에서 사용되는 기본 크기입니다. 
        긴 글을 읽을 때 눈의 피로를 최소화하도록 최적화되었습니다.
      </TypographySample>
      
      <TypographySample
        title="Body Small"
        style={getBodyStyle('small')}
      >
        작은 본문 텍스트입니다. 부가적인 정보나 세부 설명에 사용합니다. 
        공간이 제한적인 곳에서 사용하되, 가독성을 해치지 않는 선에서 사용합니다.
      </TypographySample>
      
      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">실제 사용 예제</h4>
        <div className="space-y-4">
          <div>
            <div style={getHeadingStyle('h2')}>디자인 시스템의 중요성</div>
            <div style={getBodyStyle('large')} className="mt-2 text-gray-700">
              현대의 디지털 제품 개발에서 디자인 시스템은 필수적인 요소가 되었습니다.
            </div>
            <div style={getBodyStyle('medium')} className="mt-3 text-gray-600">
              디자인 시스템은 일관된 사용자 경험을 제공하고, 개발 효율성을 높이며, 
              브랜드 아이덴티티를 강화하는 역할을 합니다. 특히 여러 팀이 협업하는 
              환경에서는 더욱 중요한 역할을 합니다.
            </div>
            <div style={getBodyStyle('small')} className="mt-2 text-gray-500">
              * 이 내용은 예시를 위한 샘플 텍스트입니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 캡션 타이포그래피
export const Caption: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Caption Typography</h2>
      <p className="text-gray-600 mb-8">
        작은 텍스트나 부가 정보에 사용되는 캡션 타이포그래피입니다. 
        라벨, 메타데이터, 도움말 텍스트 등에 사용합니다.
      </p>
      
      <TypographySample
        title="Caption Large"
        style={getCaptionStyle('large')}
      >
        큰 캡션 텍스트입니다. 중요한 라벨이나 메타 정보에 사용합니다.
      </TypographySample>
      
      <TypographySample
        title="Caption Medium"
        style={getCaptionStyle('medium')}
      >
        일반적인 캡션 텍스트입니다. 폼 라벨이나 버튼 텍스트에 사용합니다.
      </TypographySample>
      
      <TypographySample
        title="Caption Small"
        style={getCaptionStyle('small')}
      >
        가장 작은 캡션 텍스트입니다. 저작권 정보나 면책 조항에 사용합니다.
      </TypographySample>
      
      <div className="mt-8 p-4 bg-orange-50 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">UI 컴포넌트에서의 사용</h4>
        <div className="space-y-4">
          {/* 폼 예제 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div style={getCaptionStyle('large')} className="text-gray-700 mb-1">
              이메일 주소 *
            </div>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="example@email.com"
            />
            <div style={getCaptionStyle('medium')} className="text-gray-500 mt-1">
              로그인에 사용할 이메일 주소를 입력하세요
            </div>
          </div>
          
          {/* 카드 예제 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div style={getHeadingStyle('h4')}>제품 이름</div>
            <div style={getBodyStyle('medium')} className="mt-1 text-gray-600">
              제품에 대한 간단한 설명이 들어갑니다.
            </div>
            <div className="flex justify-between items-center mt-3">
              <div style={getCaptionStyle('large')} className="text-gray-500">
                2024.01.15
              </div>
              <div style={getCaptionStyle('small')} className="text-gray-400">
                © 2024 Company
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 폰트 가중치
export const FontWeights: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Font Weights</h2>
      <p className="text-gray-600 mb-8">
        다양한 폰트 가중치를 제공하여 텍스트의 중요도와 계층을 표현할 수 있습니다.
      </p>
      
      <div className="space-y-4">
        {Object.entries(typography.fontWeight).map(([name, weight]) => (
          <div key={name} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
            <div className="w-20 text-sm text-gray-600 font-mono">
              {weight}
            </div>
            <div className="w-24 text-sm text-gray-600 capitalize">
              {name}
            </div>
            <div 
              style={{ 
                fontWeight: weight,
                fontSize: '18px',
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">사용 가이드라인</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Light (300):</strong> 장식적인 텍스트나 특별한 강조가 필요한 경우</p>
          <p><strong>Normal (400):</strong> 일반적인 본문 텍스트</p>
          <p><strong>Medium (500):</strong> 약간의 강조가 필요한 텍스트</p>
          <p><strong>Semibold (600):</strong> 제목이나 중요한 정보</p>
          <p><strong>Bold (700):</strong> 주요 제목이나 강한 강조</p>
          <p><strong>Extrabold (800):</strong> 매우 강한 강조나 브랜딩 요소</p>
        </div>
      </div>
    </div>
  )
};

// 반응형 타이포그래피
export const Responsive: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Responsive Typography</h2>
      <p className="text-gray-600 mb-8">
        화면 크기에 따라 자동으로 조정되는 반응형 타이포그래피입니다. 
        모바일에서는 더 작은 크기, 데스크톱에서는 더 큰 크기를 사용합니다.
      </p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Display 반응형</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              모바일: {responsiveTypography.display.mobile.fontSize} / 
              데스크톱: {responsiveTypography.display.desktop.fontSize}
            </div>
            <div style={{
              fontSize: responsiveTypography.display.mobile.fontSize,
              lineHeight: responsiveTypography.display.mobile.lineHeight,
              fontWeight: typography.display.fontWeight,
              letterSpacing: typography.display.letterSpacing,
              fontFamily: typography.fontFamily.sans.join(', ')
            }}>
              반응형 디스플레이 제목
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Heading 1 반응형</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              모바일: {responsiveTypography.heading.h1.mobile.fontSize} / 
              데스크톱: {responsiveTypography.heading.h1.desktop.fontSize}
            </div>
            <div style={{
              fontSize: responsiveTypography.heading.h1.mobile.fontSize,
              lineHeight: responsiveTypography.heading.h1.mobile.lineHeight,
              fontWeight: typography.heading.h1.fontWeight,
              letterSpacing: typography.heading.h1.letterSpacing,
              fontFamily: typography.fontFamily.sans.join(', ')
            }}>
              반응형 H1 제목
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Heading 2 반응형</h3>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-2">
              모바일: {responsiveTypography.heading.h2.mobile.fontSize} / 
              데스크톱: {responsiveTypography.heading.h2.desktop.fontSize}
            </div>
            <div style={{
              fontSize: responsiveTypography.heading.h2.mobile.fontSize,
              lineHeight: responsiveTypography.heading.h2.mobile.lineHeight,
              fontWeight: typography.heading.h2.fontWeight,
              letterSpacing: typography.heading.h2.letterSpacing,
              fontFamily: typography.fontFamily.sans.join(', ')
            }}>
              반응형 H2 제목
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">반응형 구현 방법</h4>
        <div className="text-sm text-blue-700">
          <p className="mb-2">CSS 미디어 쿼리를 사용하여 768px 이상에서 더 큰 크기를 적용합니다:</p>
          <pre className="bg-blue-100 p-2 rounded text-xs font-mono">
{`/* 모바일 기본 */
font-size: 24px;

/* 데스크톱 */
@media (min-width: 768px) {
  font-size: 28px;
}`}
          </pre>
        </div>
      </div>
    </div>
  )
};

// 텍스트 잘림 유틸리티
export const TextTruncation: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Text Truncation</h2>
      <p className="text-gray-600 mb-8">
        긴 텍스트를 제한된 공간에 표시할 때 사용하는 텍스트 잘림 유틸리티입니다.
      </p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">한 줄 잘림</h3>
          <div className="w-64 border border-gray-200 rounded-lg p-3">
            <div style={{
              ...getBodyStyle('medium'),
              ...getTextTruncationStyle(1)
            }}>
              이것은 매우 긴 텍스트입니다. 한 줄을 넘어가면 말줄임표(...)로 표시됩니다.
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">두 줄 잘림</h3>
          <div className="w-64 border border-gray-200 rounded-lg p-3">
            <div style={{
              ...getBodyStyle('medium'),
              ...getTextTruncationStyle(2)
            }}>
              이것은 매우 긴 텍스트입니다. 두 줄을 넘어가면 말줄임표(...)로 표시됩니다. 
              여러 줄의 텍스트를 제한할 때 유용합니다.
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">세 줄 잘림</h3>
          <div className="w-64 border border-gray-200 rounded-lg p-3">
            <div style={{
              ...getBodyStyle('medium'),
              ...getTextTruncationStyle(3)
            }}>
              이것은 매우 긴 텍스트입니다. 세 줄을 넘어가면 말줄임표(...)로 표시됩니다. 
              카드 컴포넌트나 리스트 아이템에서 설명 텍스트를 표시할 때 자주 사용됩니다. 
              사용자는 전체 내용을 보려면 클릭하거나 호버할 수 있습니다.
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">사용 시 주의사항</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• 중요한 정보는 잘리지 않도록 주의하세요</p>
          <p>• 전체 텍스트를 볼 수 있는 방법을 제공하세요 (툴팁, 모달 등)</p>
          <p>• 다국어 지원 시 텍스트 길이 차이를 고려하세요</p>
          <p>• 접근성을 위해 title 속성을 추가하는 것을 권장합니다</p>
        </div>
      </div>
    </div>
  )
};

// 단위 변환 유틸리티
export const UnitConversion: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Unit Conversion</h2>
      <p className="text-gray-600 mb-8">
        픽셀 단위를 rem 단위로 변환하거나 상대적 행간을 계산하는 유틸리티입니다.
      </p>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">픽셀 → rem 변환</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">픽셀 (px)</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">rem (16px 기준)</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">미리보기</th>
                </tr>
              </thead>
              <tbody>
                {[12, 14, 16, 18, 20, 24, 28, 32].map(px => (
                  <tr key={px} className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-sm">{px}px</td>
                    <td className="px-4 py-2 font-mono text-sm">{pxToRem(px)}</td>
                    <td className="px-4 py-2">
                      <div style={{ fontSize: `${px}px` }}>
                        Sample Text
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">상대적 행간 계산</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">폰트 크기</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">행간</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">상대값</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">미리보기</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(typography.body).map(([size, styles]) => (
                  <tr key={size} className="border-t border-gray-200">
                    <td className="px-4 py-2 font-mono text-sm">{styles.fontSize}</td>
                    <td className="px-4 py-2 font-mono text-sm">{styles.lineHeight}</td>
                    <td className="px-4 py-2 font-mono text-sm">
                      {getRelativeLineHeight(styles.fontSize, styles.lineHeight)}
                    </td>
                    <td className="px-4 py-2">
                      <div style={{
                        fontSize: styles.fontSize,
                        lineHeight: styles.lineHeight,
                        width: '200px'
                      }}>
                        여러 줄 텍스트의<br />행간을 확인할 수<br />있는 예제입니다.
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">rem 단위 사용의 장점</h4>
        <div className="text-sm text-green-700 space-y-1">
          <p>• 사용자의 브라우저 폰트 크기 설정을 존중합니다</p>
          <p>• 접근성이 향상됩니다 (시각 장애인 등)</p>
          <p>• 일관된 스케일링이 가능합니다</p>
          <p>• 반응형 디자인에서 더 예측 가능한 결과를 제공합니다</p>
        </div>
      </div>
    </div>
  )
};

// 전체 타이포그래피 시스템
export const AllTypography: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Typography System</h2>
      <p className="text-gray-600 mb-8">
        Linear Design System의 전체 타이포그래피 시스템을 한눈에 볼 수 있습니다.
      </p>
      
      <div className="space-y-8">
        {/* Display */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">Display</h3>
          <div style={getDisplayStyle()}>
            Display Typography
          </div>
        </div>
        
        {/* Headings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">Headings</h3>
          <div className="space-y-3">
            <div style={getHeadingStyle('h1')}>Heading 1 - Main Page Title</div>
            <div style={getHeadingStyle('h2')}>Heading 2 - Section Title</div>
            <div style={getHeadingStyle('h3')}>Heading 3 - Subsection Title</div>
            <div style={getHeadingStyle('h4')}>Heading 4 - Small Title</div>
          </div>
        </div>
        
        {/* Body */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Body Text</h3>
          <div className="space-y-3">
            <div style={getBodyStyle('large')}>
              Body Large - 중요한 설명이나 인트로 텍스트에 사용합니다.
            </div>
            <div style={getBodyStyle('medium')}>
              Body Medium - 일반적인 본문 텍스트로 가장 많이 사용됩니다.
            </div>
            <div style={getBodyStyle('small')}>
              Body Small - 부가적인 정보나 세부 설명에 사용합니다.
            </div>
          </div>
        </div>
        
        {/* Caption */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-600">Caption</h3>
          <div className="space-y-2">
            <div style={getCaptionStyle('large')}>
              Caption Large - 중요한 라벨이나 메타 정보
            </div>
            <div style={getCaptionStyle('medium')}>
              Caption Medium - 폼 라벨이나 버튼 텍스트
            </div>
            <div style={getCaptionStyle('small')}>
              Caption Small - 저작권 정보나 면책 조항
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-4">실제 콘텐츠 예제</h4>
        <article className="space-y-4">
          <header>
            <div style={getDisplayStyle()}>
              Linear Design System
            </div>
            <div style={getBodyStyle('large')} className="text-gray-600 mt-2">
              현대적이고 확장 가능한 디자인 시스템
            </div>
          </header>
          
          <section>
            <div style={getHeadingStyle('h2')}>
              시작하기
            </div>
            <div style={getBodyStyle('medium')} className="text-gray-700 mt-2">
              Linear Design System은 일관된 사용자 경험을 제공하기 위해 설계된 
              포괄적인 디자인 시스템입니다. 개발자와 디자이너가 함께 사용할 수 있는 
              컴포넌트와 가이드라인을 제공합니다.
            </div>
            
            <div style={getHeadingStyle('h3')} className="mt-6">
              주요 특징
            </div>
            <div style={getBodyStyle('medium')} className="text-gray-700 mt-2">
              • 접근성을 고려한 디자인<br />
              • 반응형 레이아웃 지원<br />
              • 다크 모드 완벽 지원<br />
              • TypeScript 완전 지원
            </div>
            
            <div style={getCaptionStyle('medium')} className="text-gray-500 mt-4">
              마지막 업데이트: 2024년 1월
            </div>
          </section>
        </article>
      </div>
    </div>
  )
};