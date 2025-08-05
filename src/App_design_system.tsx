import React from 'react';
import './App.css';
import { ThemeProvider } from './design-system/context/ThemeContext';
import Button from './design-system/components/Button/Button';
import Card from './design-system/components/Card/Card';

// 간단한 디자인 시스템 적용 앱
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'grade' | 'card'>('grade');
  const [selectedGrade, setSelectedGrade] = React.useState<string>('');

  const grades = [
    { id: 'middle1', name: '중1', description: '중학교 1학년' },
    { id: 'middle2', name: '중2', description: '중학교 2학년' },
    { id: 'middle3', name: '중3', description: '중학교 3학년' },
    { id: 'high1', name: '고1', description: '고등학교 1학년' },
    { id: 'high2', name: '고2', description: '고등학교 2학년' },
    { id: 'high3', name: '고3', description: '고등학교 3학년' },
  ];

  const sampleSentences = [
    { korean: '안녕하세요.', english: 'Hello.' },
    { korean: '제 이름은 김민수입니다.', english: 'My name is Kim Minsu.' },
    { korean: '만나서 반갑습니다.', english: 'Nice to meet you.' },
    { korean: '저는 13살입니다.', english: 'I am 13 years old.' },
    { korean: '저는 학생입니다.', english: 'I am a student.' },
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
      <div className="min-h-screen" style={{ 
        background: 'var(--surface-secondary)',
        padding: 'var(--spacing-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-4)',
              fontFamily: 'var(--font-sans)'
            }}>
              영어 카드 학습
            </h1>
            <p style={{
              fontSize: 'var(--text-xl)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)'
            }}>
              학년을 선택하여 학습을 시작하세요
            </p>
          </div>

          {/* Grade Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-6)',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {grades.map((grade, index) => (
              <Card
                key={grade.id}
                variant="elevated"
                padding="lg"
                interactive
                animate
                animationDelay={index * 0.1}
                onClick={() => handleGradeSelect(grade.id)}
                aria-label={`${grade.description} 학습 시작`}
              >
                <div style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--spacing-3)'
                }}>
                  <div style={{
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 'var(--font-bold)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {grade.name}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {grade.description}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-sans)'
                  }}>
                    100개 문장
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = sampleSentences[currentSentenceIndex];
  const selectedGradeInfo = grades.find(g => g.id === selectedGrade);

  return (
    <div className="min-h-screen" style={{ 
      background: 'var(--surface-secondary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border-primary)',
        padding: 'var(--spacing-4)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setCurrentView('grade')}
            icon={
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
          >
            뒤로
          </Button>
          
          <h1 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-bold)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
          }}>
            {selectedGradeInfo?.description} 학습
          </h1>
          
          <div></div>
        </div>
      </header>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-8)',
        gap: 'var(--spacing-8)'
      }}>
        {/* Progress */}
        <Card variant="outlined" padding="sm">
          <span style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-medium)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)'
          }}>
            {currentSentenceIndex + 1} / {sampleSentences.length}
          </span>
        </Card>

        {/* Learning Card */}
        <Card
          variant="elevated"
          padding="lg"
          interactive
          onClick={handleFlip}
          style={{
            width: '100%',
            maxWidth: '600px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-6)',
            cursor: 'pointer'
          }}
          aria-label={`카드를 클릭하여 ${isFlipped ? '한국어' : '영어'} 보기`}
        >
          {/* Language indicator */}
          <div style={{
            padding: 'var(--spacing-2) var(--spacing-3)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            fontFamily: 'var(--font-sans)',
            backgroundColor: isFlipped ? 'var(--success-100)' : 'var(--primary-100)',
            color: isFlipped ? 'var(--success-700)' : 'var(--primary-700)'
          }}>
            {isFlipped ? 'English' : '한국어'}
          </div>

          {/* Text content */}
          <div style={{
            textAlign: 'center',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-medium)',
              color: 'var(--text-primary)',
              lineHeight: '1.6',
              fontFamily: 'var(--font-sans)'
            }}>
              {isFlipped ? currentSentence.english : currentSentence.korean}
            </p>
          </div>

          {/* Hint */}
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-sans)'
          }}>
            클릭하여 {isFlipped ? '한국어' : '영어'} 보기
          </div>
        </Card>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-4)'
        }}>
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
            aria-label="이전 문장"
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
            aria-label="카드 뒤집기"
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
            aria-label="다음 문장"
          >
            다음
          </Button>
        </div>

        {/* Instructions */}
        <Card variant="outlined" padding="md" style={{ maxWidth: '500px' }}>
          <div style={{
            textAlign: 'center',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.5'
          }}>
            <div style={{ 
              fontWeight: 'var(--font-semibold)', 
              marginBottom: 'var(--spacing-2)',
              color: 'var(--text-primary)'
            }}>
              사용법
            </div>
            <div>• 카드 클릭: 뒤집기</div>
            <div>• 이전/다음 버튼: 문장 이동</div>
            <div>• 뒤집기 버튼: 카드 뒤집기</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="light" enableSystemTheme>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;