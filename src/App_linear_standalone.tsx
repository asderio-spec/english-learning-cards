import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import { LoadingOverlay } from './components/SimpleLoadingSpinner';
import { dataService } from './services/dataService';
import { ttsService } from './services/ttsService';
import { errorService } from './services/errorService';
import type { Grade } from './types';

// 간단한 CardView 컴포넌트 (디자인 시스템 의존성 제거)
const SimpleCardView: React.FC<{
  sentence: any;
  isFlipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleImportant: () => void;
  currentIndex: number;
  totalCount: number;
}> = ({
  sentence,
  isFlipped,
  onFlip,
  onNext,
  onPrevious,
  onToggleImportant,
  currentIndex,
  totalCount
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handlePlayAudio = React.useCallback(async () => {
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      const text = isFlipped ? sentence.english : sentence.korean;
      const language = isFlipped ? 'en' : 'ko';
      await ttsService.speak(text, language);
      setIsPlayingAudio(false);
    } catch (error) {
      setIsPlayingAudio(false);
      console.error('TTS Error:', error);
    }
  }, [isPlayingAudio, isFlipped, sentence]);

  return (
    <div 
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px'
      }}
    >
      {/* Progress */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          background: 'var(--surface-primary)',
          borderRadius: '20px',
          padding: '8px 16px',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)'
          }}>
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '32px' }}>
        <div
          onClick={onFlip}
          style={{
            background: 'var(--surface-primary)',
            borderRadius: '16px',
            padding: '48px 32px',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            border: '1px solid var(--border-primary)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          {/* Language Badge */}
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '24px',
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
            color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)'
          }}>
            {isFlipped ? 'English' : '한국어'}
          </div>

          {/* Text */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: isFlipped ? '20px' : '24px',
              lineHeight: isFlipped ? '28px' : '32px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {isFlipped ? sentence.english : sentence.korean}
            </p>
          </div>

          {/* Hint */}
          <div style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)'
          }}>
            클릭하여 {isFlipped ? '한국어' : '영어'} 보기
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            background: currentIndex === 0 ? 'var(--surface-secondary)' : '#3b82f6',
            color: currentIndex === 0 ? 'var(--text-tertiary)' : '#ffffff',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Audio */}
        <button
          onClick={handlePlayAudio}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            background: isPlayingAudio ? '#ef4444' : '#10b981',
            color: '#ffffff',
            transition: 'all 0.2s ease'
          }}
        >
          {isPlayingAudio ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 106 0v-6a3 3 0 00-6 0v6z" />
            </svg>
          )}
        </button>

        {/* Important */}
        <button
          onClick={onToggleImportant}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: sentence.isImportant ? 'none' : '1px solid var(--border-primary)',
            cursor: 'pointer',
            background: sentence.isImportant ? '#f59e0b' : 'var(--surface-primary)',
            color: sentence.isImportant ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={currentIndex === totalCount - 1}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: currentIndex === totalCount - 1 ? 'not-allowed' : 'pointer',
            background: currentIndex === totalCount - 1 ? 'var(--surface-secondary)' : '#3b82f6',
            color: currentIndex === totalCount - 1 ? 'var(--text-tertiary)' : '#ffffff',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard Guide */}
      <div style={{
        background: 'var(--surface-secondary)',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          textAlign: 'center'
        }}>
          <div style={{
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-secondary)'
          }}>
            키보드 단축키
          </div>
          <div style={{ lineHeight: '18px' }}>
            <span style={{ marginRight: '16px' }}>← → : 이전/다음</span>
            <span style={{ marginRight: '16px' }}>Space : 듣기</span>
            <span style={{ marginRight: '16px' }}>Enter : 뒤집기</span>
            <span>I : 중요 표시</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { state, actions } = useAppContext();
  const [showProgressDashboard, setShowProgressDashboard] = React.useState(false);

  // Initialize error service
  React.useEffect(() => {
    try {
      errorService.registerErrorHandler('TTS_ERROR', (error) => {
        console.error('TTS Error handled:', error);
      });
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }, []);

  // Load initial data
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const importantSentences = dataService.getImportantSentences();
        const importantSentenceIds = importantSentences.map(sentence => sentence.id);
        
        if (importantSentenceIds.length > 0) {
          actions.loadStoredData({
            importantSentences: importantSentenceIds
          });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, [actions]);

  // Navigation handlers
  const handleNext = () => {
    if (state.autoPlay.isActive) {
      actions.toggleAutoPlay();
    }
    
    if (state.currentSentenceIndex < state.sentences.length - 1) {
      actions.setCurrentSentenceIndex(state.currentSentenceIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (state.autoPlay.isActive) {
      actions.toggleAutoPlay();
    }
    
    if (state.currentSentenceIndex > 0) {
      actions.setCurrentSentenceIndex(state.currentSentenceIndex - 1);
    }
  };

  const handleToggleImportant = () => {
    const currentSentence = state.sentences[state.currentSentenceIndex];
    if (currentSentence) {
      dataService.toggleImportant(currentSentence.id);
      actions.toggleImportant(currentSentence.id);
    }
  };

  const handleFlip = () => {
    if (state.autoPlay.isActive) {
      actions.toggleAutoPlay();
    }
    actions.flipCard();
  };

  // Linear 디자인 시스템 CSS 변수 설정
  React.useEffect(() => {
    const root = document.documentElement;

    // Linear 디자인 시스템 색상 변수 설정
    root.style.setProperty('--bg-primary', '#f8fafc');
    root.style.setProperty('--bg-secondary', '#f1f5f9');
    root.style.setProperty('--surface-primary', '#ffffff');
    root.style.setProperty('--surface-secondary', '#f8fafc');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#64748b');
    root.style.setProperty('--text-tertiary', '#94a3b8');
    root.style.setProperty('--border-primary', '#e2e8f0');
    root.style.setProperty('--border-secondary', '#f1f5f9');
    root.style.setProperty('--semantic-primary-bg', '#dbeafe');
    root.style.setProperty('--semantic-primary-text-strong', '#1e40af');
    root.style.setProperty('--semantic-success-bg', '#dcfce7');
    root.style.setProperty('--semantic-success-text-strong', '#166534');
    root.style.setProperty('--semantic-warning-bg', '#fef3c7');
    root.style.setProperty('--semantic-warning-text-strong', '#92400e');
    root.style.setProperty('--semantic-error-bg', '#fee2e2');
    root.style.setProperty('--semantic-error-text-strong', '#991b1b');
    root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)');
    root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
    root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)');
  }, []);

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay loading={state.loading.isLoading} />
      
      {/* Main App with Linear Design */}
      <div 
        style={{ 
          minHeight: '100vh', 
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: 'var(--bg-primary)'
        }}
      >
        {!state.currentGrade ? (
          /* Grade Selection Screen */
          <>
            {/* Header */}
            <header 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                background: 'var(--surface-primary)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid var(--border-primary)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  maxWidth: '1200px',
                  margin: '0 auto'
                }}
              >
                <h1 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  영어 학습 카드
                </h1>
              </div>
            </header>

            {/* Main Content */}
            <main style={{ paddingTop: '80px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'calc(100vh - 80px)',
                  padding: '32px 16px'
                }}
              >
                <div style={{ width: '100%', maxWidth: '1200px' }}>
                  {/* Header */}
                  <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2
                      style={{
                        fontSize: '32px',
                        lineHeight: '40px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      학년을 선택하세요
                    </h2>
                    <p
                      style={{
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: 'var(--text-secondary)',
                        fontWeight: 400,
                        margin: 0
                      }}
                    >
                      영어 문장 학습을 시작하세요
                    </p>
                  </div>

                  {/* Grade Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '24px',
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}
                  >
                    {[
                      { id: 'middle1' as Grade, name: '중1' },
                      { id: 'middle2' as Grade, name: '중2' },
                      { id: 'middle3' as Grade, name: '중3' },
                      { id: 'high1' as Grade, name: '고1' },
                      { id: 'high2' as Grade, name: '고2' },
                      { id: 'high3' as Grade, name: '고3' },
                    ].map((grade) => {
                      const sentences = dataService.getSentencesByGrade(grade.id);

                      return (
                        <div
                          key={grade.id}
                          onClick={() => {
                            actions.setGrade(grade.id);
                            actions.setSentences(sentences);
                          }}
                          style={{
                            background: 'var(--surface-primary)',
                            borderRadius: '12px',
                            padding: '32px 24px',
                            minHeight: '160px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            border: '1px solid var(--border-primary)',
                            boxShadow: 'var(--shadow-md)',
                            transition: 'all 0.2s ease',
                            transform: 'translateY(0)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                          }}
                        >
                          <div
                            style={{
                              fontSize: '24px',
                              lineHeight: '32px',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              marginBottom: '8px'
                            }}
                          >
                            {grade.name}
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              lineHeight: '20px',
                              color: 'var(--text-secondary)',
                              fontWeight: 500
                            }}
                          >
                            {sentences.length}개 문장
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </main>
          </>
        ) : state.sentences.length === 0 ? (
          /* Loading State */
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              background: 'var(--bg-primary)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{
                  fontSize: '20px',
                  color: 'var(--text-primary)',
                  marginBottom: '16px'
                }}
              >
                문장을 불러오는 중...
              </div>
              <button
                onClick={() => {
                  actions.setGrade(undefined);
                  actions.setSentences([]);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'var(--surface-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                학년 다시 선택
              </button>
            </div>
          </div>
        ) : (
          /* Card Learning Screen */
          <>
            {/* Header */}
            <header 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                background: 'var(--surface-primary)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid var(--border-primary)'
              }}
            >
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  maxWidth: '1200px',
                  margin: '0 auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => {
                      actions.setGrade(undefined);
                      actions.setSentences([]);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    뒤로
                  </button>
                </div>
                
                <h1 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  {['중1', '중2', '중3', '고1', '고2', '고3'][['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'].indexOf(state.currentGrade)]} 학습
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={actions.toggleAutoPlay}
                    style={{
                      padding: '8px 12px',
                      background: state.autoPlay.isActive ? '#ef4444' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {state.autoPlay.isActive ? '자동재생 중단' : '자동재생'}
                  </button>
                </div>
              </div>
            </header>

            <main style={{ paddingTop: '80px' }}>
              <SimpleCardView
                sentence={state.sentences[state.currentSentenceIndex]}
                isFlipped={state.isCardFlipped}
                onFlip={handleFlip}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onToggleImportant={handleToggleImportant}
                currentIndex={state.currentSentenceIndex}
                totalCount={state.sentences.length}
              />
            </main>
          </>
        )}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;