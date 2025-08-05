import React from 'react';
import { Container, Grid, Flex } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

const LayoutDemo: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-h2 mb-4">Layout Components Demo</h2>
        <p className="text-body-md text-secondary mb-6">
          Linear 디자인 시스템의 레이아웃 컴포넌트들을 보여주는 데모입니다.
        </p>
      </div>

      {/* Container Demo */}
      <section>
        <h3 className="text-h3 mb-4">Container</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-h4 mb-2">기본 컨테이너 (lg, centered, responsive padding)</h4>
            <Container className="bg-surface-secondary border border-primary rounded-lg">
              <div className="py-4">
                <p className="text-body-md">
                  기본 설정의 컨테이너입니다. 최대 너비 1024px, 중앙 정렬, 반응형 패딩이 적용됩니다.
                </p>
              </div>
            </Container>
          </div>

          <div>
            <h4 className="text-h4 mb-2">다양한 크기의 컨테이너</h4>
            <div className="space-y-2">
              <Container maxWidth="sm" className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">Small (640px)</p>
                </div>
              </Container>
              <Container maxWidth="md" className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">Medium (768px)</p>
                </div>
              </Container>
              <Container maxWidth="lg" className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">Large (1024px)</p>
                </div>
              </Container>
              <Container maxWidth="xl" className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">Extra Large (1280px)</p>
                </div>
              </Container>
            </div>
          </div>

          <div>
            <h4 className="text-h4 mb-2">패딩 옵션</h4>
            <div className="space-y-2">
              <Container padding={false} className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">패딩 없음</p>
                </div>
              </Container>
              <Container responsivePadding={false} className="bg-surface-secondary border border-primary rounded-lg">
                <div className="py-2">
                  <p className="text-caption-md">고정 패딩 (24px)</p>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </section>

      {/* Flex Demo */}
      <section>
        <h3 className="text-h3 mb-4">Flex</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-h4 mb-2">기본 Flex (row, stretch, start)</h4>
            <Flex className="bg-surface-secondary border border-primary rounded-lg p-4" gap={4}>
              <Card className="flex-1">
                <div className="p-4">
                  <p className="text-body-sm">Item 1</p>
                </div>
              </Card>
              <Card className="flex-1">
                <div className="p-4">
                  <p className="text-body-sm">Item 2</p>
                </div>
              </Card>
              <Card className="flex-1">
                <div className="p-4">
                  <p className="text-body-sm">Item 3</p>
                </div>
              </Card>
            </Flex>
          </div>

          <div>
            <h4 className="text-h4 mb-2">Column 방향, Center 정렬</h4>
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              className="bg-surface-secondary border border-primary rounded-lg p-4 h-32" 
              gap={2}
            >
              <Button variant="primary" size="sm">Button 1</Button>
              <Button variant="secondary" size="sm">Button 2</Button>
            </Flex>
          </div>

          <div>
            <h4 className="text-h4 mb-2">Space Between 정렬</h4>
            <Flex 
              justify="space-between" 
              align="center" 
              className="bg-surface-secondary border border-primary rounded-lg p-4"
            >
              <p className="text-body-md">왼쪽 콘텐츠</p>
              <Button variant="ghost" size="sm">액션</Button>
            </Flex>
          </div>

          <div>
            <h4 className="text-h4 mb-2">Wrap 및 다양한 Flex 속성</h4>
            <Flex 
              wrap="wrap" 
              gap={2} 
              className="bg-surface-secondary border border-primary rounded-lg p-4"
            >
              <Button variant="primary" size="sm" className="flex-shrink-0">고정 크기</Button>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm truncate">
                  이 텍스트는 flex-1이 적용되어 남은 공간을 모두 차지합니다. 길어지면 잘립니다.
                </p>
              </div>
              <Button variant="secondary" size="sm" className="flex-shrink-0">또 다른 고정</Button>
            </Flex>
          </div>
        </div>
      </section>

      {/* Grid Demo */}
      <section>
        <h3 className="text-h3 mb-4">Grid</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-h4 mb-2">기본 그리드 (12 컬럼)</h4>
            <Grid columns={4} gap={4} className="bg-surface-secondary border border-primary rounded-lg p-4">
              {Array.from({ length: 8 }, (_, i) => (
                <Card key={i}>
                  <div className="p-4">
                    <p className="text-body-sm">Item {i + 1}</p>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>

          <div>
            <h4 className="text-h4 mb-2">반응형 그리드 (모바일: 1, 태블릿: 2, 데스크톱: 3)</h4>
            <Grid 
              columns={{ mobile: 1, tablet: 2, desktop: 3 }} 
              gap={{ mobile: 2, tablet: 4, desktop: 6 }}
              className="bg-surface-secondary border border-primary rounded-lg p-4"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i}>
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">카드 {i + 1}</h5>
                    <p className="text-body-sm text-secondary">
                      반응형 그리드 아이템입니다. 화면 크기에 따라 레이아웃이 변경됩니다.
                    </p>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>

          <div>
            <h4 className="text-h4 mb-2">Auto-fit 그리드 (최소 너비: 250px)</h4>
            <Grid 
              autoFit 
              minColumnWidth="250px" 
              gap={4}
              className="bg-surface-secondary border border-primary rounded-lg p-4"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Card key={i}>
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">Auto-fit {i + 1}</h5>
                    <p className="text-body-sm text-secondary">
                      자동으로 맞춰지는 그리드입니다. 최소 너비 250px를 유지합니다.
                    </p>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>

          <div>
            <h4 className="text-h4 mb-2">정렬 옵션</h4>
            <Grid 
              columns={3} 
              gap={4} 
              alignItems="center" 
              justifyContent="center"
              className="bg-surface-secondary border border-primary rounded-lg p-4 h-40"
            >
              <Card>
                <div className="p-2">
                  <p className="text-caption-sm">짧은 콘텐츠</p>
                </div>
              </Card>
              <Card>
                <div className="p-4">
                  <p className="text-body-sm">
                    조금 더 긴 콘텐츠가 있는 카드입니다.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-2">
                  <p className="text-caption-sm">또 다른 짧은 콘텐츠</p>
                </div>
              </Card>
            </Grid>
          </div>
        </div>
      </section>

      {/* Complex Layout Example */}
      <section>
        <h3 className="text-h3 mb-4">복합 레이아웃 예제</h3>
        <Container maxWidth="xl">
          <Card>
            <div className="p-6">
              <Flex justify="space-between" align="center" className="mb-6">
                <div>
                  <h4 className="text-h3">대시보드</h4>
                  <p className="text-body-sm text-secondary">레이아웃 컴포넌트를 조합한 예제</p>
                </div>
                <Flex gap={2}>
                  <Button variant="secondary" size="sm">설정</Button>
                  <Button variant="primary" size="sm">새로 만들기</Button>
                </Flex>
              </Flex>

              <Grid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap={4} className="mb-6">
                <Card variant="elevated">
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">통계 1</h5>
                    <p className="text-display text-primary">1,234</p>
                    <p className="text-caption-sm text-secondary">전체 사용자</p>
                  </div>
                </Card>
                <Card variant="elevated">
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">통계 2</h5>
                    <p className="text-display text-primary">567</p>
                    <p className="text-caption-sm text-secondary">활성 사용자</p>
                  </div>
                </Card>
                <Card variant="elevated">
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">통계 3</h5>
                    <p className="text-display text-primary">89%</p>
                    <p className="text-caption-sm text-secondary">만족도</p>
                  </div>
                </Card>
                <Card variant="elevated">
                  <div className="p-4">
                    <h5 className="text-h4 mb-2">통계 4</h5>
                    <p className="text-display text-primary">12</p>
                    <p className="text-caption-sm text-secondary">새 알림</p>
                  </div>
                </Card>
              </Grid>

              <Grid columns={{ mobile: 1, desktop: 2 }} gap={6}>
                <Card>
                  <div className="p-4">
                    <h5 className="text-h4 mb-4">최근 활동</h5>
                    <Flex direction="column" gap={3}>
                      {Array.from({ length: 3 }, (_, i) => (
                        <Flex key={i} align="center" gap={3}>
                          <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-body-sm">사용자 활동 {i + 1}</p>
                            <p className="text-caption-sm text-secondary">2분 전</p>
                          </div>
                        </Flex>
                      ))}
                    </Flex>
                  </div>
                </Card>
                <Card>
                  <div className="p-4">
                    <h5 className="text-h4 mb-4">빠른 액션</h5>
                    <Grid columns={2} gap={2}>
                      <Button variant="secondary" size="sm">액션 1</Button>
                      <Button variant="secondary" size="sm">액션 2</Button>
                      <Button variant="secondary" size="sm">액션 3</Button>
                      <Button variant="secondary" size="sm">액션 4</Button>
                    </Grid>
                  </div>
                </Card>
              </Grid>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
};

export default LayoutDemo;