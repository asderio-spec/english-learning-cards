import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import CardView from './components/CardView_linear';
import ErrorBoundary from './components/ErrorBoundary';
import FeedbackToast from './components/FeedbackToast';
import { LoadingOverlay } from './components/SimpleLoadingSpinner';
import GradeSelector from './components/GradeSelector';
import ProgressDashboard from './components/ProgressDashboard_linear';
import { dataService } from './services/dataService';
import { errorService } from './services/errorService';
import type { Grade } from './types';

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

  const handleProgressGradeSelect = async (grade: Grade) => {
    try {
      actions.setGrade(grade);
      const sentences = dataService.getSentencesByGrade(grade);
      actions.setSentences(sentences);
      setShowProgressDashboard(false);
    } catch (error) {
      console.error('Failed to load sentences for grade:', grade, error);
    }
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
      
      {/* Feedback Toast */}
      <FeedbackToast 
        feedback={state.feedback} 
        onRemove={actions.removeFeedback} 
      />
      
      {/* Main App with Linear Design */}
      <div 
        style={{ 
          minHeight: '100vh', 
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: 'var(--bg-primary)'
        }}
      >
        {!state.currentGrade ? (
          /* Grade Selection Screen with Linear Design */
          <>
            {/* Linear Style Header */}
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
                <button
                  onClick={() => setShowProgressDashboard(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
                  }}
                >
                  📊 진도 보기
                </button>
              </div>
            </header>

            {/* Linear Style Main Content */}
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

                  {/* Grade Grid with Linear Design */}
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
                    ].map((grade, index) => {
                      const sentenceCount = dataService.getSentencesByGrade(grade.id).length;

                      return (
                        <div
                          key={grade.id}
                          onClick={() => {
                            actions.setGrade(grade.id);
                            const sentences = dataService.getSentencesByGrade(grade.id);
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
                            {sentenceCount}개 문장
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </main>

            {showProgressDashboard && (
              <ProgressDashboard
                onClose={() => setShowProgressDashboard(false)}
                onGradeSelect={handleProgressGradeSelect}
              />
            )}
          </>
        ) : state.sentences.length === 0 ? (
          /* Loading State with Linear Design */
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--surface-primary)';
                }}
              >
                학년 다시 선택
              </button>
            </div>
          </div>
        ) : (
          /* Card Learning Screen with Linear Design */
          <>
            {/* Linear Style Header */}
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-secondary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    뒤로
                  </button>
                  <button
                    onClick={() => setShowProgressDashboard(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: '#3b82f6',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                    }}
                  >
                    📊 진도
                  </button>
                </div>
                
                {/* Auto Play Controls */}
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
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {state.autoPlay.isActive ? '자동재생 중단' : '자동재생'}
                  </button>
                  
                  <select
                    value={state.autoPlay.speed}
                    onChange={(e) => actions.setAutoPlaySpeed(e.target.value as any)}
                    style={{
                      padding: '6px 8px',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: 'var(--surface-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="slow">느림</option>
                    <option value="normal">보통</option>
                    <option value="fast">빠름</option>
                  </select>
                </div>
              </div>
            </header>

            <main style={{ paddingTop: '80px' }}>
              <CardView
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

            {showProgressDashboard && (
              <ProgressDashboard
                onClose={() => setShowProgressDashboard(false)}
                onGradeSelect={handleProgressGradeSelect}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;