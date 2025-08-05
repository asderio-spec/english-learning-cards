import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import CardView from './components/CardView';
import ErrorBoundary from './components/ErrorBoundary';
import FeedbackToast from './components/FeedbackToast';
import { LoadingOverlay } from './components/LoadingSpinner';
import GradeSelector from './components/GradeSelector';
import ProgressDashboard from './components/ProgressDashboard';
import AutoPlay from './components/AutoPlay';
import { dataService } from './services/dataService';
import { errorService } from './services/errorService';
import type { Grade } from './types';
import Button from './design-system/components/Button/Button';
import './design-system/styles/globals.css';

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

  // CSS 변수 설정
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
      <LoadingOverlay loading={state.loading} />
      
      {/* Feedback Toast */}
      <FeedbackToast 
        feedback={state.feedback} 
        onRemove={actions.removeFeedback} 
      />
      
      {/* Main App */}
      <div style={{ minHeight: '100vh', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
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
                  padding: '16px'
                }}
              >
                <h1 
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)'
                  }}
                >
                  영어 학습 카드
                </h1>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowProgressDashboard(true)}
                >
                  진도 보기
                </Button>
              </div>
            </header>

            <main>
              <GradeSelector />
            </main>

            {showProgressDashboard && (
              <ProgressDashboard
                onClose={() => setShowProgressDashboard(false)}
                onGradeSelect={handleProgressGradeSelect}
              />
            )}
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
              <Button
                variant="secondary"
                onClick={() => {
                  actions.setGrade(undefined);
                  actions.setSentences([]);
                }}
              >
                학년 다시 선택
              </Button>
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
                  padding: '12px 16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      actions.setGrade(undefined);
                      actions.setSentences([]);
                    }}
                    icon={
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    }
                  >
                    뒤로
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowProgressDashboard(true)}
                  >
                    진도
                  </Button>
                </div>
                
                {/* Auto Play */}
                <AutoPlay
                  isActive={state.autoPlay.isActive}
                  speed={state.autoPlay.speed}
                  onToggle={actions.toggleAutoPlay}
                  onSpeedChange={actions.setAutoPlaySpeed}
                  onNext={handleNext}
                  onFlip={handleFlip}
                  isCardFlipped={state.isCardFlipped}
                  currentIndex={state.currentSentenceIndex}
                  totalCount={state.sentences.length}
                />
              </div>
            </header>

            <main>
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