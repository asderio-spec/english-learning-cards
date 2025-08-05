import type { Meta, StoryObj } from '@storybook/react';
import { Container, Grid, Flex } from './index';

// Mock content components for stories
const PlaceholderCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-100 border border-gray-200 rounded-lg p-4 text-center ${className}`}>
    {children}
  </div>
);

const meta: Meta = {
  title: 'Design System/Components/Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
레이아웃을 구성하는 컴포넌트들입니다. Container, Grid, Flex 컴포넌트를 제공하여 일관된 레이아웃을 구축할 수 있습니다.

## 컴포넌트
- **Container**: 콘텐츠를 중앙 정렬하고 최대 너비를 제한하는 컨테이너
- **Grid**: CSS Grid 기반의 그리드 레이아웃 시스템
- **Flex**: CSS Flexbox 기반의 플렉스 레이아웃 시스템

모든 컴포넌트는 반응형을 지원하며, 부드러운 전환 애니메이션을 제공합니다.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// Container 스토리들
export const ContainerBasic: Story = {
  name: 'Container - Basic',
  render: () => (
    <div className="bg-gray-50 min-h-screen p-4">
      <Container>
        <PlaceholderCard>
          <h2 className="text-xl font-semibold mb-2">기본 컨테이너</h2>
          <p className="text-gray-600">
            이 컨테이너는 중앙 정렬되고 최대 너비가 제한됩니다. 
            반응형 패딩이 자동으로 적용됩니다.
          </p>
        </PlaceholderCard>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 Container 컴포넌트입니다. 콘텐츠를 중앙 정렬하고 적절한 최대 너비를 설정합니다.'
      }
    }
  }
};

export const ContainerSizes: Story = {
  name: 'Container - Sizes',
  render: () => (
    <div className="bg-gray-50 min-h-screen p-4 space-y-8">
      <Container maxWidth="sm">
        <PlaceholderCard>
          <h3 className="font-semibold mb-1">Small Container</h3>
          <p className="text-sm text-gray-600">최대 너비: 640px</p>
        </PlaceholderCard>
      </Container>
      
      <Container maxWidth="md">
        <PlaceholderCard>
          <h3 className="font-semibold mb-1">Medium Container</h3>
          <p className="text-sm text-gray-600">최대 너비: 768px</p>
        </PlaceholderCard>
      </Container>
      
      <Container maxWidth="lg">
        <PlaceholderCard>
          <h3 className="font-semibold mb-1">Large Container</h3>
          <p className="text-sm text-gray-600">최대 너비: 1024px</p>
        </PlaceholderCard>
      </Container>
      
      <Container maxWidth="xl">
        <PlaceholderCard>
          <h3 className="font-semibold mb-1">Extra Large Container</h3>
          <p className="text-sm text-gray-600">최대 너비: 1280px</p>
        </PlaceholderCard>
      </Container>
      
      <Container maxWidth="none">
        <PlaceholderCard>
          <h3 className="font-semibold mb-1">Full Width Container</h3>
          <p className="text-sm text-gray-600">최대 너비 제한 없음</p>
        </PlaceholderCard>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Container의 다양한 크기를 보여줍니다. sm, md, lg, xl, none 크기를 지원합니다.'
      }
    }
  }
};

export const ContainerOptions: Story = {
  name: 'Container - Options',
  render: () => (
    <div className="bg-gray-50 min-h-screen p-4 space-y-8">
      <Container padding={false}>
        <PlaceholderCard className="bg-blue-100 border-blue-200">
          <h3 className="font-semibold mb-1">패딩 없는 컨테이너</h3>
          <p className="text-sm text-gray-600">padding={false}</p>
        </PlaceholderCard>
      </Container>
      
      <Container centered={false}>
        <PlaceholderCard className="bg-green-100 border-green-200">
          <h3 className="font-semibold mb-1">왼쪽 정렬 컨테이너</h3>
          <p className="text-sm text-gray-600">centered={false}</p>
        </PlaceholderCard>
      </Container>
      
      <Container fullHeight>
        <PlaceholderCard className="bg-purple-100 border-purple-200 h-full flex items-center justify-center">
          <div>
            <h3 className="font-semibold mb-1">전체 높이 컨테이너</h3>
            <p className="text-sm text-gray-600">fullHeight={true}</p>
          </div>
        </PlaceholderCard>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Container의 다양한 옵션들을 보여줍니다. 패딩, 정렬, 높이 설정을 조절할 수 있습니다.'
      }
    }
  }
};

// Grid 스토리들
export const GridBasic: Story = {
  name: 'Grid - Basic',
  render: () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">기본 그리드 (12컬럼)</h2>
      <Grid columns={12} gap={4}>
        {Array.from({ length: 12 }, (_, i) => (
          <PlaceholderCard key={i}>
            <span className="text-sm font-mono">{i + 1}</span>
          </PlaceholderCard>
        ))}
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 12컬럼 그리드 레이아웃입니다. 각 아이템이 동일한 너비를 가집니다.'
      }
    }
  }
};

export const GridColumns: Story = {
  name: 'Grid - Different Columns',
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">2 컬럼</h3>
        <Grid columns={2} gap={4}>
          <PlaceholderCard>컬럼 1</PlaceholderCard>
          <PlaceholderCard>컬럼 2</PlaceholderCard>
        </Grid>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">3 컬럼</h3>
        <Grid columns={3} gap={4}>
          <PlaceholderCard>컬럼 1</PlaceholderCard>
          <PlaceholderCard>컬럼 2</PlaceholderCard>
          <PlaceholderCard>컬럼 3</PlaceholderCard>
        </Grid>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">4 컬럼</h3>
        <Grid columns={4} gap={4}>
          <PlaceholderCard>컬럼 1</PlaceholderCard>
          <PlaceholderCard>컬럼 2</PlaceholderCard>
          <PlaceholderCard>컬럼 3</PlaceholderCard>
          <PlaceholderCard>컬럼 4</PlaceholderCard>
        </Grid>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 컬럼 수를 가진 그리드들입니다. 2, 3, 4 컬럼 레이아웃을 보여줍니다.'
      }
    }
  }
};

export const GridResponsive: Story = {
  name: 'Grid - Responsive',
  render: () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">반응형 그리드</h2>
      <p className="text-gray-600 mb-4">
        화면 크기에 따라 컬럼 수가 변경됩니다: 모바일(1컬럼) → 태블릿(2컬럼) → 데스크톱(4컬럼)
      </p>
      <Grid 
        columns={{ mobile: 1, tablet: 2, desktop: 4 }}
        gap={{ mobile: 3, tablet: 4, desktop: 6 }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <PlaceholderCard key={i}>
            <h4 className="font-semibold mb-1">아이템 {i + 1}</h4>
            <p className="text-sm text-gray-600">반응형 그리드 아이템</p>
          </PlaceholderCard>
        ))}
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '반응형 그리드입니다. 화면 크기에 따라 컬럼 수와 간격이 자동으로 조정됩니다.'
      }
    }
  }
};

export const GridAutoFit: Story = {
  name: 'Grid - Auto Fit',
  render: () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">자동 맞춤 그리드</h2>
      <p className="text-gray-600 mb-4">
        최소 너비(250px)를 기준으로 자동으로 컬럼 수가 조정됩니다.
      </p>
      <Grid autoFit minColumnWidth="250px" gap={4}>
        {Array.from({ length: 6 }, (_, i) => (
          <PlaceholderCard key={i}>
            <h4 className="font-semibold mb-1">카드 {i + 1}</h4>
            <p className="text-sm text-gray-600">
              최소 250px 너비를 유지하면서 자동으로 배치됩니다.
            </p>
          </PlaceholderCard>
        ))}
      </Grid>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '자동 맞춤 그리드입니다. 최소 컬럼 너비를 설정하면 화면 크기에 따라 자동으로 컬럼 수가 조정됩니다.'
      }
    }
  }
};

// Flex 스토리들
export const FlexBasic: Story = {
  name: 'Flex - Basic',
  render: () => (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">기본 Flex (Row)</h3>
        <Flex gap={4}>
          <PlaceholderCard>아이템 1</PlaceholderCard>
          <PlaceholderCard>아이템 2</PlaceholderCard>
          <PlaceholderCard>아이템 3</PlaceholderCard>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Column 방향</h3>
        <Flex direction="column" gap={4}>
          <PlaceholderCard>아이템 1</PlaceholderCard>
          <PlaceholderCard>아이템 2</PlaceholderCard>
          <PlaceholderCard>아이템 3</PlaceholderCard>
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 Flex 레이아웃입니다. Row와 Column 방향을 지원합니다.'
      }
    }
  }
};

export const FlexAlignment: Story = {
  name: 'Flex - Alignment',
  render: () => (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Justify Content</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">justify="start"</p>
            <Flex justify="start" gap={4} className="bg-gray-50 p-4 rounded">
              <PlaceholderCard className="w-20">1</PlaceholderCard>
              <PlaceholderCard className="w-20">2</PlaceholderCard>
              <PlaceholderCard className="w-20">3</PlaceholderCard>
            </Flex>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">justify="center"</p>
            <Flex justify="center" gap={4} className="bg-gray-50 p-4 rounded">
              <PlaceholderCard className="w-20">1</PlaceholderCard>
              <PlaceholderCard className="w-20">2</PlaceholderCard>
              <PlaceholderCard className="w-20">3</PlaceholderCard>
            </Flex>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">justify="space-between"</p>
            <Flex justify="space-between" gap={4} className="bg-gray-50 p-4 rounded">
              <PlaceholderCard className="w-20">1</PlaceholderCard>
              <PlaceholderCard className="w-20">2</PlaceholderCard>
              <PlaceholderCard className="w-20">3</PlaceholderCard>
            </Flex>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Align Items</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">align="start"</p>
            <Flex align="start" gap={4} className="bg-gray-50 p-4 rounded h-24">
              <PlaceholderCard className="h-8">1</PlaceholderCard>
              <PlaceholderCard className="h-12">2</PlaceholderCard>
              <PlaceholderCard className="h-6">3</PlaceholderCard>
            </Flex>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">align="center"</p>
            <Flex align="center" gap={4} className="bg-gray-50 p-4 rounded h-24">
              <PlaceholderCard className="h-8">1</PlaceholderCard>
              <PlaceholderCard className="h-12">2</PlaceholderCard>
              <PlaceholderCard className="h-6">3</PlaceholderCard>
            </Flex>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">align="stretch"</p>
            <Flex align="stretch" gap={4} className="bg-gray-50 p-4 rounded h-24">
              <PlaceholderCard>1</PlaceholderCard>
              <PlaceholderCard>2</PlaceholderCard>
              <PlaceholderCard>3</PlaceholderCard>
            </Flex>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Flex의 다양한 정렬 옵션들입니다. justify와 align 속성으로 아이템들을 정렬할 수 있습니다.'
      }
    }
  }
};

export const FlexResponsive: Story = {
  name: 'Flex - Responsive',
  render: () => (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">반응형 Flex</h2>
      <p className="text-gray-600 mb-4">
        화면 크기에 따라 방향이 변경됩니다: 모바일(column) → 데스크톱(row)
      </p>
      <Flex 
        direction={{ mobile: 'column', desktop: 'row' }}
        gap={{ mobile: 3, desktop: 6 }}
        align="stretch"
      >
        <PlaceholderCard className="flex-1">
          <h4 className="font-semibold mb-2">메인 콘텐츠</h4>
          <p className="text-sm text-gray-600">
            반응형 레이아웃에서 메인 콘텐츠 영역입니다.
          </p>
        </PlaceholderCard>
        <PlaceholderCard className="flex-1">
          <h4 className="font-semibold mb-2">사이드바</h4>
          <p className="text-sm text-gray-600">
            모바일에서는 아래로, 데스크톱에서는 옆으로 배치됩니다.
          </p>
        </PlaceholderCard>
      </Flex>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '반응형 Flex 레이아웃입니다. 화면 크기에 따라 방향과 간격이 자동으로 조정됩니다.'
      }
    }
  }
};

export const FlexGrow: Story = {
  name: 'Flex - Grow & Shrink',
  render: () => (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Flex Grow</h3>
        <Flex gap={4}>
          <PlaceholderCard>고정 크기</PlaceholderCard>
          <PlaceholderCard className="flex-grow">grow=1 (남은 공간 차지)</PlaceholderCard>
          <PlaceholderCard>고정 크기</PlaceholderCard>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">다양한 Grow 값</h3>
        <Flex gap={4}>
          <PlaceholderCard className="flex-grow">grow=1</PlaceholderCard>
          <PlaceholderCard style={{ flexGrow: 2 }}>grow=2</PlaceholderCard>
          <PlaceholderCard className="flex-grow">grow=1</PlaceholderCard>
        </Flex>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Flex Wrap</h3>
        <Flex wrap="wrap" gap={4}>
          {Array.from({ length: 8 }, (_, i) => (
            <PlaceholderCard key={i} className="min-w-40">
              아이템 {i + 1}
            </PlaceholderCard>
          ))}
        </Flex>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Flex의 grow, shrink, wrap 속성들을 보여줍니다. 유연한 레이아웃을 만들 수 있습니다.'
      }
    }
  }
};

// 실제 사용 예제
export const RealWorldExamples: Story = {
  name: 'Real World Examples',
  render: () => (
    <div className="bg-gray-50 min-h-screen">
      <Container>
        <div className="py-8 space-y-12">
          {/* 헤더 레이아웃 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">헤더 레이아웃</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <Flex justify="space-between" align="center">
                <div className="text-xl font-semibold">로고</div>
                <Flex gap={4} align="center">
                  <span>메뉴1</span>
                  <span>메뉴2</span>
                  <span>메뉴3</span>
                  <PlaceholderCard className="px-4 py-2 bg-blue-500 text-white">
                    로그인
                  </PlaceholderCard>
                </Flex>
              </Flex>
            </div>
          </div>
          
          {/* 카드 그리드 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">제품 그리드</h2>
            <Grid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap={6}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">제품 {i + 1}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      제품에 대한 간단한 설명이 들어갑니다.
                    </p>
                    <Flex justify="space-between" align="center">
                      <span className="font-bold text-lg">₩29,000</span>
                      <PlaceholderCard className="px-3 py-1 bg-blue-500 text-white text-sm">
                        구매
                      </PlaceholderCard>
                    </Flex>
                  </div>
                </div>
              ))}
            </Grid>
          </div>
          
          {/* 사이드바 레이아웃 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">사이드바 레이아웃</h2>
            <Flex 
              direction={{ mobile: 'column', desktop: 'row' }}
              gap={6}
              align="stretch"
            >
              <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
                <h3 className="text-xl font-semibold mb-4">메인 콘텐츠</h3>
                <p className="text-gray-600 mb-4">
                  메인 콘텐츠 영역입니다. 데스크톱에서는 사이드바와 나란히 표시되고,
                  모바일에서는 세로로 배치됩니다.
                </p>
                <div className="h-40 bg-gray-100 rounded"></div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6" style={{ flexBasis: '300px' }}>
                <h3 className="text-lg font-semibold mb-4">사이드바</h3>
                <Flex direction="column" gap={3}>
                  <PlaceholderCard className="p-3">위젯 1</PlaceholderCard>
                  <PlaceholderCard className="p-3">위젯 2</PlaceholderCard>
                  <PlaceholderCard className="p-3">위젯 3</PlaceholderCard>
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
      </Container>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '실제 웹사이트에서 사용되는 레이아웃 패턴들입니다. 헤더, 카드 그리드, 사이드바 레이아웃 등을 보여줍니다.'
      }
    }
  }
};