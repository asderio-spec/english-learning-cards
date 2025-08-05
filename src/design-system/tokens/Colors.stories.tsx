import type { Meta, StoryObj } from '@storybook/react';
import { colors } from './colors';

const meta: Meta = {
  title: 'Design System/Tokens/Colors',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Linear Design System의 색상 토큰입니다. 일관된 색상 사용을 위해 정의된 색상 팔레트를 제공합니다.

## 색상 구조
- **Primary**: 브랜드 메인 색상 (파란색 계열)
- **Secondary**: 보조 색상 (청록색 계열)  
- **Neutral**: 텍스트 및 배경용 회색 계열
- **Semantic**: 상태를 나타내는 색상 (성공, 경고, 오류, 정보)

각 색상은 50부터 900까지의 명도 단계를 가지며, 500이 기본 색상입니다.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 색상 팔레트 표시 컴포넌트
const ColorPalette = ({ title, colorScale, description }: {
  title: string;
  colorScale: Record<string, string>;
  description?: string;
}) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
      {Object.entries(colorScale).map(([shade, color]) => (
        <div key={shade} className="text-center">
          <div 
            className="w-full h-16 rounded-lg border border-gray-200 mb-2 flex items-center justify-center text-xs font-mono"
            style={{ backgroundColor: color }}
          >
            <span 
              className={`px-2 py-1 rounded ${
                ['50', '100', '200', '300'].includes(shade) 
                  ? 'text-gray-800 bg-white bg-opacity-75' 
                  : 'text-white bg-black bg-opacity-25'
              }`}
            >
              {shade}
            </span>
          </div>
          <div className="text-xs font-mono text-gray-600">{color}</div>
        </div>
      ))}
    </div>
  </div>
);

// 색상 대비 표시 컴포넌트
const ContrastDemo = ({ title, backgroundColor, textColor, description }: {
  title: string;
  backgroundColor: string;
  textColor: string;
  description: string;
}) => (
  <div className="mb-4">
    <div 
      className="p-4 rounded-lg border"
      style={{ backgroundColor, color: textColor }}
    >
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm">{description}</p>
      <div className="text-xs font-mono mt-2 opacity-75">
        배경: {backgroundColor} / 텍스트: {textColor}
      </div>
    </div>
  </div>
);

// Primary 색상 스토리
export const Primary: Story = {
  render: () => (
    <div className="p-6">
      <ColorPalette 
        title="Primary Colors"
        colorScale={colors.primary}
        description="브랜드의 메인 색상입니다. 주요 액션 버튼, 링크, 활성 상태 등에 사용됩니다."
      />
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">사용 예제</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ContrastDemo
            title="Primary Button"
            backgroundColor={colors.primary[500]}
            textColor={colors.white}
            description="주요 액션 버튼에 사용되는 색상 조합입니다."
          />
          <ContrastDemo
            title="Primary Link"
            backgroundColor={colors.white}
            textColor={colors.primary[600]}
            description="링크 텍스트에 사용되는 색상 조합입니다."
          />
          <ContrastDemo
            title="Primary Background"
            backgroundColor={colors.primary[50]}
            textColor={colors.primary[900]}
            description="강조 배경에 사용되는 색상 조합입니다."
          />
        </div>
      </div>
    </div>
  )
};

// Secondary 색상 스토리
export const Secondary: Story = {
  render: () => (
    <div className="p-6">
      <ColorPalette 
        title="Secondary Colors"
        colorScale={colors.secondary}
        description="보조 색상입니다. 보조 액션 버튼, 강조 요소, 장식적 요소에 사용됩니다."
      />
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">사용 예제</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ContrastDemo
            title="Secondary Button"
            backgroundColor={colors.secondary[500]}
            textColor={colors.white}
            description="보조 액션 버튼에 사용되는 색상 조합입니다."
          />
          <ContrastDemo
            title="Accent Element"
            backgroundColor={colors.secondary[100]}
            textColor={colors.secondary[800]}
            description="강조 요소에 사용되는 색상 조합입니다."
          />
          <ContrastDemo
            title="Info Badge"
            backgroundColor={colors.secondary[600]}
            textColor={colors.white}
            description="정보 배지에 사용되는 색상 조합입니다."
          />
        </div>
      </div>
    </div>
  )
};

// Neutral 색상 스토리
export const Neutral: Story = {
  render: () => (
    <div className="p-6">
      <ColorPalette 
        title="Neutral Colors"
        colorScale={colors.neutral}
        description="텍스트, 배경, 테두리 등에 사용되는 중성 색상입니다. 가장 많이 사용되는 색상 팔레트입니다."
      />
      
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">사용 예제</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-semibold mb-3">텍스트 계층</h5>
            <div className="space-y-2">
              <ContrastDemo
                title="Primary Text"
                backgroundColor={colors.white}
                textColor={colors.neutral[900]}
                description="메인 텍스트 (제목, 중요한 내용)"
              />
              <ContrastDemo
                title="Secondary Text"
                backgroundColor={colors.white}
                textColor={colors.neutral[600]}
                description="보조 텍스트 (설명, 메타 정보)"
              />
              <ContrastDemo
                title="Disabled Text"
                backgroundColor={colors.white}
                textColor={colors.neutral[400]}
                description="비활성화된 텍스트"
              />
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-3">배경 및 테두리</h5>
            <div className="space-y-2">
              <ContrastDemo
                title="Card Background"
                backgroundColor={colors.neutral[50]}
                textColor={colors.neutral[900]}
                description="카드나 패널의 배경색"
              />
              <ContrastDemo
                title="Border Color"
                backgroundColor={colors.white}
                textColor={colors.neutral[200]}
                description="테두리 색상 (실제로는 border로 사용)"
              />
              <ContrastDemo
                title="Divider"
                backgroundColor={colors.white}
                textColor={colors.neutral[300]}
                description="구분선 색상"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// Semantic 색상 스토리
export const Semantic: Story = {
  render: () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ColorPalette 
            title="Success Colors"
            colorScale={colors.success}
            description="성공, 완료, 승인 상태를 나타내는 색상입니다."
          />
          <div className="mt-4">
            <ContrastDemo
              title="Success Message"
              backgroundColor={colors.success[500]}
              textColor={colors.white}
              description="성공 메시지나 알림에 사용됩니다."
            />
          </div>
        </div>
        
        <div>
          <ColorPalette 
            title="Warning Colors"
            colorScale={colors.warning}
            description="주의, 경고 상태를 나타내는 색상입니다."
          />
          <div className="mt-4">
            <ContrastDemo
              title="Warning Message"
              backgroundColor={colors.warning[500]}
              textColor={colors.white}
              description="경고 메시지나 알림에 사용됩니다."
            />
          </div>
        </div>
        
        <div>
          <ColorPalette 
            title="Error Colors"
            colorScale={colors.error}
            description="오류, 실패, 위험 상태를 나타내는 색상입니다."
          />
          <div className="mt-4">
            <ContrastDemo
              title="Error Message"
              backgroundColor={colors.error[500]}
              textColor={colors.white}
              description="오류 메시지나 알림에 사용됩니다."
            />
          </div>
        </div>
        
        <div>
          <ColorPalette 
            title="Info Colors"
            colorScale={colors.info}
            description="정보, 안내 상태를 나타내는 색상입니다."
          />
          <div className="mt-4">
            <ContrastDemo
              title="Info Message"
              backgroundColor={colors.info[500]}
              textColor={colors.white}
              description="정보 메시지나 알림에 사용됩니다."
            />
          </div>
        </div>
      </div>
    </div>
  )
};

// 모든 색상 팔레트
export const AllColors: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Color Palette</h2>
      
      <ColorPalette 
        title="Primary"
        colorScale={colors.primary}
        description="브랜드 메인 색상"
      />
      
      <ColorPalette 
        title="Secondary"
        colorScale={colors.secondary}
        description="보조 색상"
      />
      
      <ColorPalette 
        title="Neutral"
        colorScale={colors.neutral}
        description="중성 색상"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ColorPalette 
          title="Success"
          colorScale={colors.success}
        />
        
        <ColorPalette 
          title="Warning"
          colorScale={colors.warning}
        />
        
        <ColorPalette 
          title="Error"
          colorScale={colors.error}
        />
        
        <ColorPalette 
          title="Info"
          colorScale={colors.info}
        />
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">특수 색상</h4>
        <div className="flex gap-4">
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200 mb-2"
              style={{ backgroundColor: colors.white }}
            />
            <div className="text-xs font-mono">White</div>
            <div className="text-xs font-mono text-gray-600">{colors.white}</div>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200 mb-2"
              style={{ backgroundColor: colors.black }}
            />
            <div className="text-xs font-mono text-white bg-black px-1 rounded">Black</div>
            <div className="text-xs font-mono text-gray-600">{colors.black}</div>
          </div>
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-lg border border-gray-200 mb-2 bg-transparent"
              style={{ 
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
              }}
            />
            <div className="text-xs font-mono">Transparent</div>
            <div className="text-xs font-mono text-gray-600">{colors.transparent}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 다크 모드 색상
export const DarkMode: Story = {
  render: () => (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Dark Mode Colors</h2>
      <p className="text-gray-300 mb-8">
        다크 모드에서는 색상의 명도가 반전되어 사용됩니다. 
        예를 들어, 라이트 모드에서 neutral-900을 사용했다면 다크 모드에서는 neutral-100을 사용합니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">라이트 모드 → 다크 모드</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colors.neutral[900] }}></div>
                <span className="text-sm">neutral-900</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-gray-600" style={{ backgroundColor: colors.neutral[100] }}></div>
                <span className="text-sm">neutral-100</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: colors.neutral[50] }}></div>
                <span className="text-sm">neutral-50</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colors.neutral[800] }}></div>
                <span className="text-sm">neutral-800</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: colors.white }}></div>
                <span className="text-sm">white</span>
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: colors.neutral[900] }}></div>
                <span className="text-sm">neutral-900</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">다크 모드 예제</h4>
          <div className="space-y-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.neutral[800], color: colors.neutral[100] }}
            >
              <div className="font-semibold">카드 컴포넌트</div>
              <div className="text-sm opacity-75">다크 모드에서의 카드 배경과 텍스트</div>
            </div>
            
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: colors.primary[600], color: colors.white }}
            >
              <div className="font-semibold">Primary Button</div>
              <div className="text-sm opacity-90">다크 모드에서도 동일한 primary 색상 사용</div>
            </div>
            
            <div 
              className="p-3 rounded-lg border"
              style={{ 
                backgroundColor: colors.neutral[900], 
                color: colors.neutral[200],
                borderColor: colors.neutral[700]
              }}
            >
              <div className="font-semibold">Input Field</div>
              <div className="text-sm opacity-75">다크 모드 입력 필드 스타일</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// 접근성 및 대비
export const Accessibility: Story = {
  render: () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Color Accessibility</h2>
      <p className="text-gray-600 mb-8">
        모든 색상 조합은 WCAG 2.1 AA 기준(4.5:1 대비)을 만족합니다. 
        중요한 텍스트는 AAA 기준(7:1 대비)을 권장합니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4 text-green-600">✓ 권장 조합 (AA 이상)</h4>
          <div className="space-y-3">
            <ContrastDemo
              title="Primary Text"
              backgroundColor={colors.white}
              textColor={colors.neutral[900]}
              description="대비 비율: 16.7:1 (AAA)"
            />
            <ContrastDemo
              title="Secondary Text"
              backgroundColor={colors.white}
              textColor={colors.neutral[600]}
              description="대비 비율: 7.2:1 (AAA)"
            />
            <ContrastDemo
              title="Primary Button"
              backgroundColor={colors.primary[500]}
              textColor={colors.white}
              description="대비 비율: 7.2:1 (AAA)"
            />
            <ContrastDemo
              title="Success Message"
              backgroundColor={colors.success[500]}
              textColor={colors.white}
              description="대비 비율: 5.1:1 (AA)"
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4 text-red-600">✗ 피해야 할 조합</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: colors.neutral[300], color: colors.neutral[400] }}
              >
                <div className="font-semibold">낮은 대비</div>
                <div className="text-sm">대비 비율: 1.8:1 (부족)</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: colors.primary[400], color: colors.primary[500] }}
              >
                <div className="font-semibold">유사한 색상</div>
                <div className="text-sm">대비 비율: 1.2:1 (부족)</div>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <div 
                className="p-3 rounded"
                style={{ backgroundColor: colors.white, color: colors.neutral[300] }}
              >
                <div className="font-semibold">연한 텍스트</div>
                <div className="text-sm">대비 비율: 2.9:1 (부족)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">접근성 도구</h4>
        <p className="text-blue-700 text-sm">
          색상 대비를 확인하려면 브라우저 개발자 도구의 접근성 탭을 사용하거나, 
          WebAIM Contrast Checker 같은 온라인 도구를 활용하세요.
        </p>
      </div>
    </div>
  )
};