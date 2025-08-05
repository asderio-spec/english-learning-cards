import type { Meta, StoryObj } from '@storybook/react';
import { spacing, semanticSpacing, componentSpacing, breakpoints, containerMaxWidth, grid, layout } from './spacing';
import { 
  getSpacingValue, 
  createContainerStyle, 
  createFlexStyle, 
  createStackStyle,
  createPaddingStyle,
  createMarginStyle,
  createGridContainerStyle,
  createGridItemStyle
} from './spacingUtils';

const meta: Meta = {
  title: 'Design System/Tokens/Spacing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Linear Design System의 간격 토큰입니다. 일관된 간격과 레이아웃을 위한 체계적인 간격 시스템을 제공합니다.

## 간격 시스템
- **기본 간격**: 4px 기준의 수치 스케일 (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24...)
- **의미적 간격**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
- **컴포넌트 간격**: 각 컴포넌트에 최적화된 간격 값들
- **반응형 간격**: 화면 크기에 따라 조정되는 간격

모든 간격은 4px의 배수로 구성되어 픽셀 퍼펙트한 디자인을 보장합니다.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 간격 시각화 컴포넌트
const SpacingVisualizer = ({ size, value, label }: { size: string; value: string; label?: string }) => (
  <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
    <div className="w-16 text-sm font-mono text-gray-600">{size}</div>
    <div className="w-16 text-sm font-mono text-gray-500">{value}</div>
    <div 
      className="bg-blue-500 h-4"
      style={{ width: value }}
    />
    {label && <div className="text-sm text-gray-600">{label}</div>}
  </div>
);

// 기본 간격 스토리
export const BasicSpacing: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Basic Spacing Scale</h2>
      <p className="text-gray-600 mb-8">
        4px 기준의 기본 간격 스케일입니다. 모든 간격은 4의 배수로 구성되어 있습니다.
      </p>
      
      <div className="space-y-3">
        {Object.entries(spacing).slice(0, 15).map(([key, value]) => (
          <SpacingVisualizer 
            key={key} 
            size={key} 
            value={value}
            label={key === '0' ? 'None' : key === '1' ? 'Minimal' : key === '4' ? 'Base' : key === '8' ? 'Large' : ''}
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">사용 가이드라인</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>0-2 (0-8px):</strong> 매우 작은 간격, 관련된 요소들 사이</p>
          <p><strong>3-4 (12-16px):</strong> 기본 간격, 일반적인 요소들 사이</p>
          <p><strong>5-6 (20-24px):</strong> 중간 간격, 섹션 내 그룹들 사이</p>
          <p><strong>8-12 (32-48px):</strong> 큰 간격, 주요 섹션들 사이</p>
          <p><strong>16+ (64px+):</strong> 매우 큰 간격, 페이지 레벨 구분</p>
        </div>
      </div>
    </div>
  )
};

// 의미적 간격 스토리
export const SemanticSpacing: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Semantic Spacing</h2>
      <p className="text-gray-600 mb-8">
        의미를 가진 간격 이름들입니다. 코드에서 더 직관적으로 사용할 수 있습니다.
      </p>
      
      <div className="space-y-3">
        {Object.entries(semanticSpacing).map(([key, value]) => (
          <SpacingVisualizer 
            key={key} 
            size={key} 
            value={value}
            label={
              key === 'xs' ? 'Extra Small' :
              key === 'sm' ? 'Small' :
              key === 'md' ? 'Medium' :
              key === 'lg' ? 'Large' :
              key === 'xl' ? 'Extra Large' :
              key.includes('xl') ? 'Extra Extra Large' : ''
            }
          />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">사용 예제</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div style={{ marginLeft: getSpacingValue('xs') }} className="w-8 h-8 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">xs 간격 (4px)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div style={{ marginLeft: getSpacingValue('md') }} className="w-8 h-8 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">md 간격 (16px)</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div style={{ marginLeft: getSpacingValue('xl') }} className="w-8 h-8 bg-gray-400 rounded"></div>
            <span className="text-sm text-gray-600">xl 간격 (32px)</span>
          </div>
        </div>
      </div>
    </div>
  )
};

// 컴포넌트 간격 스토리
export const ComponentSpacing: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Component Spacing</h2>
      <p className="text-gray-600 mb-8">
        각 컴포넌트에 최적화된 간격 값들입니다. 일관된 컴포넌트 디자인을 보장합니다.
      </p>
      
      <div className="space-y-8">
        {/* 버튼 간격 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Spacing</h3>
          <div className="space-y-4">
            {Object.entries(componentSpacing.button).map(([size, padding]) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-12 text-sm font-mono text-gray-600">{size}</div>
                <button 
                  className="bg-blue-500 text-white rounded border-2 border-blue-600"
                  style={{
                    paddingLeft: padding.x,
                    paddingRight: padding.x,
                    paddingTop: padding.y,
                    paddingBottom: padding.y
                  }}
                >
                  Button {size.toUpperCase()}
                </button>
                <div className="text-sm text-gray-500">
                  x: {padding.x}, y: {padding.y}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 카드 간격 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Card Spacing</h3>
          <div className="space-y-4">
            {Object.entries(componentSpacing.card).map(([size, padding]) => (
              <div key={size} className="flex items-start gap-4">
                <div className="w-12 text-sm font-mono text-gray-600">{size}</div>
                <div 
                  className="bg-white border border-gray-200 rounded-lg"
                  style={{ padding }}
                >
                  <h4 className="font-semibold mb-1">Card {size.toUpperCase()}</h4>
                  <p className="text-sm text-gray-600">
                    이 카드는 {padding} 패딩을 사용합니다.
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  padding: {padding}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 스택 간격 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stack Spacing</h3>
          <div className="space-y-4">
            {Object.entries(componentSpacing.stack).map(([size, gap]) => (
              <div key={size} className="flex items-start gap-4">
                <div className="w-12 text-sm font-mono text-gray-600">{size}</div>
                <div style={createStackStyle(size as keyof typeof componentSpacing.stack)}>
                  <div className="bg-gray-200 p-2 rounded text-sm">Item 1</div>
                  <div className="bg-gray-200 p-2 rounded text-sm">Item 2</div>
                  <div className="bg-gray-200 p-2 rounded text-sm">Item 3</div>
                </div>
                <div className="text-sm text-gray-500">
                  gap: {gap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 레이아웃 시스템 스토리
export const LayoutSystem: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Layout System</h2>
      <p className="text-gray-600 mb-8">
        컨테이너, 그리드, 플렉스 등 레이아웃을 구성하는 시스템들입니다.
      </p>
      
      <div className="space-y-8">
        {/* 컨테이너 크기 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Container Sizes</h3>
          <div className="space-y-3">
            {Object.entries(containerMaxWidth).map(([size, width]) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-8 text-sm font-mono text-gray-600">{size}</div>
                <div className="w-20 text-sm font-mono text-gray-500">{width}</div>
                <div 
                  className="bg-blue-100 h-8 border-l-4 border-blue-500 flex items-center px-3"
                  style={{ width: `min(${width}, 100%)`, maxWidth: '400px' }}
                >
                  <span className="text-sm text-blue-700">Container {size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 브레이크포인트 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Breakpoints</h3>
          <div className="space-y-3">
            {Object.entries(breakpoints).map(([name, width]) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-16 text-sm font-mono text-gray-600">{name}</div>
                <div className="w-20 text-sm font-mono text-gray-500">{width}</div>
                <div className="text-sm text-gray-600">
                  {name === 'mobile' ? '모바일 디바이스' :
                   name === 'tablet' ? '태블릿 디바이스' :
                   name === 'desktop' ? '데스크톱 디바이스' :
                   '와이드 스크린'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Z-Index 레이어 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Z-Index Layers</h3>
          <div className="space-y-2">
            {Object.entries(layout.zIndex).map(([name, value]) => (
              <div key={name} className="flex items-center gap-4">
                <div className="w-16 text-sm font-mono text-gray-600">{name}</div>
                <div className="w-16 text-sm font-mono text-gray-500">{value}</div>
                <div className="text-sm text-gray-600">
                  {name === 'base' ? '기본 레이어' :
                   name === 'dropdown' ? '드롭다운 메뉴' :
                   name === 'modal' ? '모달 대화상자' :
                   name === 'toast' ? '토스트 알림' :
                   name === 'tooltip' ? '툴팁' :
                   `${name} 레이어`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 그리드 시스템 스토리
export const GridSystem: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Grid System</h2>
      <p className="text-gray-600 mb-8">
        12컬럼 기반의 그리드 시스템입니다. 반응형 레이아웃을 쉽게 구성할 수 있습니다.
      </p>
      
      <div className="space-y-8">
        {/* 기본 그리드 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">12 Column Grid</h3>
          <div style={createGridContainerStyle()}>
            {Array.from({ length: 12 }, (_, i) => (
              <div 
                key={i}
                className="bg-blue-100 border border-blue-200 p-2 text-center text-sm"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* 그리드 스팬 예제 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Grid Spans</h3>
          <div style={createGridContainerStyle()}>
            <div 
              style={createGridItemStyle(6)}
              className="bg-green-100 border border-green-200 p-4 text-center"
            >
              6 columns
            </div>
            <div 
              style={createGridItemStyle(6)}
              className="bg-green-100 border border-green-200 p-4 text-center"
            >
              6 columns
            </div>
            <div 
              style={createGridItemStyle(4)}
              className="bg-purple-100 border border-purple-200 p-4 text-center"
            >
              4 columns
            </div>
            <div 
              style={createGridItemStyle(8)}
              className="bg-purple-100 border border-purple-200 p-4 text-center"
            >
              8 columns
            </div>
            <div 
              style={createGridItemStyle(12)}
              className="bg-orange-100 border border-orange-200 p-4 text-center"
            >
              12 columns (full width)
            </div>
          </div>
        </div>
        
        {/* 그리드 거터 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Grid Gutters</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-16 text-sm font-mono">Mobile</span>
              <span className="w-16 text-sm font-mono text-gray-500">{grid.gutter.mobile}</span>
              <div className="text-sm text-gray-600">모바일 디바이스용 간격</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-16 text-sm font-mono">Tablet</span>
              <span className="w-16 text-sm font-mono text-gray-500">{grid.gutter.tablet}</span>
              <div className="text-sm text-gray-600">태블릿 디바이스용 간격</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-16 text-sm font-mono">Desktop</span>
              <span className="w-16 text-sm font-mono text-gray-500">{grid.gutter.desktop}</span>
              <div className="text-sm text-gray-600">데스크톱 디바이스용 간격</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 플렉스 시스템 스토리
export const FlexSystem: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Flex System</h2>
      <p className="text-gray-600 mb-8">
        플렉스박스 기반의 레이아웃 시스템입니다. 다양한 정렬과 배치를 쉽게 구현할 수 있습니다.
      </p>
      
      <div className="space-y-8">
        {/* 기본 플렉스 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Basic Flex</h3>
          <div style={createFlexStyle('row', 'start', 'center', 'md')} className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-blue-100 p-3 rounded">Item 1</div>
            <div className="bg-blue-100 p-3 rounded">Item 2</div>
            <div className="bg-blue-100 p-3 rounded">Item 3</div>
          </div>
        </div>
        
        {/* 정렬 옵션 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Justify Content</h3>
          <div className="space-y-4">
            {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map(justify => (
              <div key={justify}>
                <div className="text-sm text-gray-600 mb-2">justify="{justify}"</div>
                <div style={createFlexStyle('row', justify, 'center', 'sm')} className="bg-gray-50 p-4 rounded-lg">
                  <div className="bg-green-100 p-2 rounded text-sm">A</div>
                  <div className="bg-green-100 p-2 rounded text-sm">B</div>
                  <div className="bg-green-100 p-2 rounded text-sm">C</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 정렬 옵션 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Align Items</h3>
          <div className="space-y-4">
            {(['start', 'center', 'end', 'stretch'] as const).map(align => (
              <div key={align}>
                <div className="text-sm text-gray-600 mb-2">align="{align}"</div>
                <div style={createFlexStyle('row', 'start', align, 'sm')} className="bg-gray-50 p-4 rounded-lg h-20">
                  <div className="bg-purple-100 p-2 rounded text-sm">Short</div>
                  <div className="bg-purple-100 p-2 rounded text-sm">Medium<br/>Height</div>
                  <div className="bg-purple-100 p-2 rounded text-sm">Tall<br/>Content<br/>Here</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

// 패딩과 마진 유틸리티 스토리
export const PaddingMargin: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Padding & Margin Utilities</h2>
      <p className="text-gray-600 mb-8">
        패딩과 마진을 쉽게 적용할 수 있는 유틸리티 함수들입니다.
      </p>
      
      <div className="space-y-8">
        {/* 패딩 예제 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Padding Examples</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">Uniform Padding (md)</div>
              <div 
                style={{ padding: getSpacingValue('md') }}
                className="bg-blue-50 border-2 border-dashed border-blue-200 inline-block"
              >
                <div className="bg-blue-100 p-2 rounded">Content with uniform padding</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-2">Custom Padding (top: lg, right: md, bottom: sm, left: xs)</div>
              <div 
                style={createPaddingStyle('lg', 'md', 'sm', 'xs')}
                className="bg-green-50 border-2 border-dashed border-green-200 inline-block"
              >
                <div className="bg-green-100 p-2 rounded">Content with custom padding</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 마진 예제 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Margin Examples</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="bg-purple-100 p-2 rounded inline-block">First Item</div>
            <div 
              style={createMarginStyle('sm', 'md', 'sm', 'md')}
              className="bg-purple-100 p-2 rounded inline-block"
            >
              Item with custom margins
            </div>
            <div className="bg-purple-100 p-2 rounded inline-block">Third Item</div>
          </div>
        </div>
        
        {/* 스택 레이아웃 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stack Layouts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">Vertical Stack (md gap)</div>
              <div style={createStackStyle('md', 'vertical')} className="bg-gray-50 p-4 rounded-lg">
                <div className="bg-orange-100 p-3 rounded">Item 1</div>
                <div className="bg-orange-100 p-3 rounded">Item 2</div>
                <div className="bg-orange-100 p-3 rounded">Item 3</div>
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600 mb-2">Horizontal Stack (lg gap)</div>
              <div style={createStackStyle('lg', 'horizontal')} className="bg-gray-50 p-4 rounded-lg">
                <div className="bg-orange-100 p-3 rounded">Item 1</div>
                <div className="bg-orange-100 p-3 rounded">Item 2</div>
                <div className="bg-orange-100 p-3 rounded">Item 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 실제 사용 예제 스토리
export const RealWorldExamples: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Real World Examples</h2>
      <p className="text-gray-600 mb-8">
        실제 UI에서 간격 시스템을 사용하는 예제들입니다.
      </p>
      
      <div className="space-y-8">
        {/* 카드 레이아웃 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Card Layout</h3>
          <div style={createGridContainerStyle()}>
            {Array.from({ length: 3 }, (_, i) => (
              <div 
                key={i}
                style={createGridItemStyle(4)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-32 bg-gray-200"></div>
                <div style={{ padding: componentSpacing.card.md }}>
                  <h4 className="font-semibold mb-2">Card Title {i + 1}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    카드 내용이 들어갑니다. 적절한 패딩으로 읽기 편하게 구성되었습니다.
                  </p>
                  <div style={createFlexStyle('row', 'between', 'center')}>
                    <span className="text-sm text-gray-500">2024.01.15</span>
                    <button 
                      style={{
                        paddingLeft: componentSpacing.button.sm.x,
                        paddingRight: componentSpacing.button.sm.x,
                        paddingTop: componentSpacing.button.sm.y,
                        paddingBottom: componentSpacing.button.sm.y
                      }}
                      className="bg-blue-500 text-white rounded text-sm"
                    >
                      더보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 폼 레이아웃 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Form Layout</h3>
          <div className="max-w-md bg-white border border-gray-200 rounded-lg" style={{ padding: componentSpacing.card.lg }}>
            <h4 className="text-lg font-semibold mb-6">회원가입</h4>
            <div style={createStackStyle('lg', 'vertical')}>
              <div style={createStackStyle('xs', 'vertical')}>
                <label className="text-sm font-medium text-gray-700">이름</label>
                <input 
                  type="text" 
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div style={createStackStyle('xs', 'vertical')}>
                <label className="text-sm font-medium text-gray-700">이메일</label>
                <input 
                  type="email" 
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="이메일을 입력하세요"
                />
              </div>
              
              <div style={createStackStyle('xs', 'vertical')}>
                <label className="text-sm font-medium text-gray-700">비밀번호</label>
                <input 
                  type="password" 
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div style={createFlexStyle('row', 'end', 'center', 'sm')}>
                <button 
                  style={{
                    paddingLeft: componentSpacing.button.md.x,
                    paddingRight: componentSpacing.button.md.x,
                    paddingTop: componentSpacing.button.md.y,
                    paddingBottom: componentSpacing.button.md.y
                  }}
                  className="bg-gray-200 text-gray-700 rounded"
                >
                  취소
                </button>
                <button 
                  style={{
                    paddingLeft: componentSpacing.button.md.x,
                    paddingRight: componentSpacing.button.md.x,
                    paddingTop: componentSpacing.button.md.y,
                    paddingBottom: componentSpacing.button.md.y
                  }}
                  className="bg-blue-500 text-white rounded"
                >
                  가입하기
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 네비게이션 레이아웃 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation Layout</h3>
          <div className="bg-white border border-gray-200 rounded-lg" style={{ padding: `${getSpacingValue('md')} ${getSpacingValue('lg')}` }}>
            <div style={createFlexStyle('row', 'between', 'center')}>
              <div style={createFlexStyle('row', 'start', 'center', 'lg')}>
                <div className="text-xl font-bold">Logo</div>
                <nav style={createFlexStyle('row', 'start', 'center', 'md')}>
                  <a href="#" className="text-gray-700 hover:text-gray-900">홈</a>
                  <a href="#" className="text-gray-700 hover:text-gray-900">제품</a>
                  <a href="#" className="text-gray-700 hover:text-gray-900">회사소개</a>
                  <a href="#" className="text-gray-700 hover:text-gray-900">연락처</a>
                </nav>
              </div>
              
              <div style={createFlexStyle('row', 'end', 'center', 'sm')}>
                <button className="text-gray-700 hover:text-gray-900 px-3 py-2">로그인</button>
                <button 
                  style={{
                    paddingLeft: componentSpacing.button.md.x,
                    paddingRight: componentSpacing.button.md.x,
                    paddingTop: componentSpacing.button.md.y,
                    paddingBottom: componentSpacing.button.md.y
                  }}
                  className="bg-blue-500 text-white rounded"
                >
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};