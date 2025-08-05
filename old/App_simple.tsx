import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import GradeSelector from './components/GradeSelector';
import CardView from './components/CardView_simple';
import AutoPlay from './components/AutoPlay';
import ProgressDashboard from './components/ProgressDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import FeedbackToast from './components/FeedbackToast';
import { LoadingOverlay } from './components/SimpleLoadingSpinner';
import { dataService } from './services/dataService';
import { errorService } from './services/errorService';
import type { Grade } from './types';

const AppContent: React.FC = () => {
  const { state, actions } = useAppContext();
  const [showProgressDashboard, setShowProgressDashboard] = React.useState(false);

  // Initialize error service
  React.useEffect(() => {
    errorService.registerErrorHandler('TTS_ERROR', (error) => {
      console.error('TTS Error handled:', error);
    });
  }, [actions]);

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

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay loading={state.loading.isLoading} />
      
      {/* Feedback Toast */}
      <FeedbackToast 
        feedback={state.feedback} 
        onRemove={actions.removeFeedback} 
      />
      
      {/* Main App */}
      <div className="min-h-screen">
        {!state.currentGrade ? (
          /* Grade Selection Screen */
          <>
            {/* Simple Header */}
            <header className="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
              <div className="flex items-center justify-between p-4">
                <h1 className="text-xl font-bold text-gray-900">영어 학습 카드</h1>
                <button
                  onClick={() => setShowProgressDashboard(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  진도 보기
                </button>
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
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-xl text-gray-700 mb-4">문장을 불러오는 중...</div>
              <button
                onClick={() => {
                  actions.setGrade(undefined);
                  actions.setSentences([]);
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                학년 다시 선택
              </button>
            </div>
          </div>
        ) : (
          /* Card Learning Screen */
          <>
            {/* Simple Header */}
            <header className="fixed top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      actions.setGrade(undefined);
                      actions.setSentences([]);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    ← 뒤로
                  </button>
                  <button
                    onClick={() => setShowProgressDashboard(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    진도
                  </button>
                </div>
                
                {/* Auto Play - Simplified */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={actions.toggleAutoPlay}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      state.autoPlay.isActive
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {state.autoPlay.isActive ? '자동재생 중단' : '자동재생'}
                  </button>
                  
                  <select
                    value={state.autoPlay.speed}
                    onChange={(e) => actions.setAutoPlaySpeed(e.target.value as any)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="slow">느림</option>
                    <option value="normal">보통</option>
                    <option value="fast">빠름</option>
                  </select>
                </div>
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