import React from 'react';
import { ThemeProvider } from './design-system/context/ThemeContext';
import Button from './design-system/components/Button/Button';
import Card from './design-system/components/Card/Card';
import { typography } from './design-system/tokens/typography';
import { spacing } from './design-system/tokens/spacing';
import './design-system/styles/globals.css';

// Linear 디자인 시스템을 적용한 영어 카드 학습 앱
const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'grade' | 'card'>('grade');
  const [selectedGrade, setSelectedGrade] = React.useState<string>('');

  const grades = [
    { id: 'middle1', name: '중1' },
    { id: 'middle2', name: '중2' },
    { id: 'middle3', name: '중3' },
    { id: 'high1', name: '고1' },
    { id: 'high2', name: '고2' },
    { id: 'high3', name: '고3' },
  ];

  const sampleSentences = [
    { korean: '안녕하세요.', english: 'Hello.' },
    { korean: '제 이름은 김민수입니다.', english: 'My name is Kim Minsu.' },
    { korean: '만나서 반갑습니다.', english: 'Nice to meet you.' },
  ];

  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setCurrentView('card');
  };

  const handleNext = () => {
    if (currentSentenceIndex < sampleSentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (currentView === 'grade') {
    return (
      <ThemeProvider>
        <div 
          style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[4]
          }}
        >
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: spacing[12] }}>
              <h1 
                style={{
                  ...typography.display,
                  color: 'var(--text-primary)',
                  marginBottom: spacing[4],
                  fontFamily: typography.fontFamily.sans.join(', ')
                }}
              >
                영어 카드 학습
              </h1>
              <p 
                style={{
                  ...typography.body.large,
                  color: 'var(--text-secondary)',
                  fontFamily: typography.fontFamily.sans.join(', ')
                }}
              >
                학년을 선택하여 학습을 시작하세요
              </p>
            </div>

            {/* Grade Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: spacing[6],
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              {grades.map((grade) => (
                <Card
                  key={grade.id}
                  variant="elevated"
                  padding="lg"
                  interactive
                  animate
                  animationDelay={grades.indexOf(grade) * 0.1}
                  onClick={() => handleGradeSelect(grade.id)}
                  style={{
                    minHeight: '160px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div 
                    style={{
                      ...typography.heading.h2,
                      color: 'var(--text-primary)',
                      marginBottom: spacing[2],
                      fontFamily: typography.fontFamily.sans.join(', ')
                    }}
                  >
                    {grade.name}
                  </div>
                  <div 
                    style={{
                      ...typography.caption.medium,
                      color: 'var(--text-secondary)',
                      fontFamily: typography.fontFamily.sans.join(', ')
                    }}
                  >
                    100개 문장
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const currentSentence = sampleSentences[currentSentenceIndex];

  return (
    <ThemeProvider>
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <header 
          style={{
            background: 'var(--surface-primary)',
            borderBottom: '1px solid var(--border-primary)',
            padding: spacing[4]
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            <Button
              variant="ghost"
              onClick={() => setCurrentView('grade')}
              icon={
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            >
              뒤로
            </Button>
            
            <h1 
              style={{
                ...typography.heading.h3,
                color: 'var(--text-primary)',
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              {grades.find(g => g.id === selectedGrade)?.name} 학습
            </h1>
            
            <div></div>
          </div>
        </header>

        {/* Main content */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing[8]
          }}
        >
          {/* Progress */}
          <Card
            variant="outlined"
            padding="sm"
            style={{
              marginBottom: spacing[8],
              display: 'inline-block'
            }}
          >
            <span 
              style={{
                ...typography.caption.medium,
                color: 'var(--text-primary)',
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              {currentSentenceIndex + 1} / {sampleSentences.length}
            </span>
          </Card>

          {/* Learning Card */}
          <Card
            variant="elevated"
            padding="lg"
            interactive
            animate
            onClick={handleFlip}
            style={{
              width: '100%',
              maxWidth: '600px',
              minHeight: '300px',
              marginBottom: spacing[8],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            {/* Language indicator */}
            <div 
              style={{
                ...typography.caption.large,
                color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)',
                backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
                padding: `${spacing[1]} ${spacing[3]}`,
                borderRadius: '20px',
                marginBottom: spacing[6],
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p 
                style={{
                  ...typography.heading.h2,
                  color: 'var(--text-primary)',
                  lineHeight: '1.5',
                  fontFamily: typography.fontFamily.sans.join(', ')
                }}
              >
                {isFlipped ? currentSentence.english : currentSentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div 
              style={{
                ...typography.caption.small,
                color: 'var(--text-tertiary)',
                marginTop: spacing[6],
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              클릭하여 {isFlipped ? '한국어' : '영어'} 보기
            </div>
          </Card>

          {/* Controls */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[4],
              marginBottom: spacing[8]
            }}
          >
            {/* Previous */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePrevious}
              disabled={currentSentenceIndex === 0}
              icon={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              }
            >
              이전
            </Button>

            {/* Flip */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleFlip}
              icon={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              뒤집기
            </Button>

            {/* Next */}
            <Button
              variant="secondary"
              size="lg"
              onClick={handleNext}
              disabled={currentSentenceIndex === sampleSentences.length - 1}
              iconRight={
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              }
            >
              다음
            </Button>
          </div>

          {/* Instructions */}
          <Card
            variant="default"
            padding="md"
            style={{
              maxWidth: '400px',
              textAlign: 'center',
              background: 'var(--surface-secondary)'
            }}
          >
            <div 
              style={{
                ...typography.caption.large,
                color: 'var(--text-secondary)',
                fontFamily: typography.fontFamily.sans.join(', ')
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>사용법:</strong>
              <br />
              • 카드 클릭: 뒤집기
              <br />
              • 버튼: 이전/다음 카드
              <br />
              • 🔄 버튼: 카드 뒤집기
            </div>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;