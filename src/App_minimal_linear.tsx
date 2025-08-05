import React, { useState, useCallback, useEffect } from 'react';
import { dataService } from './services/dataService';
import { ttsService } from './services/ttsService';
import type { Grade, Sentence } from './types';

const App: React.FC = () => {
  const [currentGrade, setCurrentGrade] = useState<Grade | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [autoPlay, setAutoPlay] = useState({ isActive: false, speed: 'normal' as 'slow' | 'normal' | 'fast' });
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  // Linear 디자인 시스템 CSS 변수 설정
  useEffect(() => {
    const root = document.documentElement;
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

  // 자동재생 기능
  useEffect(() => {
    if (!autoPlay.isActive || sentences.length === 0) return;

    const speeds = { slow: 5000, normal: 3000, fast: 2000 };
    const interval = setInterval(() => {
      if (!isFlipped) {
        setIsFlipped(true);
        // 카드를 뒤집을 때 본 것으로 표시
        if (sentences[currentIndex]) {
          setViewedCards(prev => new Set([...prev, sentences[currentIndex].id]));
        }
      } else {
        if (currentIndex < sentences.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setIsFlipped(false);
        } else {
          setAutoPlay(prev => ({ ...prev, isActive: false }));
        }
      }
    }, speeds[autoPlay.speed]);

    return () => clearInterval(interval);
  }, [autoPlay.isActive, autoPlay.speed, currentIndex, sentences.length, isFlipped]);

  // 현재 카드를 본 것으로 표시
  useEffect(() => {
    if (sentences[currentIndex]) {
      setViewedCards(prev => new Set([...prev, sentences[currentIndex].id]));
    }
  }, [currentIndex, sentences]);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!currentGrade) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < sentences.length - 1) handleNext();
          break;
        case ' ':
          event.preventDefault();
          handlePlayAudio();
          break;
        case 'Enter':
          event.preventDefault();
          handleFlip();
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          handleToggleImportant();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGrade, currentIndex, sentences.length, isFlipped]);

  const handleGradeSelect = (grade: Grade) => {
    setCurrentGrade(grade);
    const gradeSentences = dataService.getSentencesByGrade(grade);
    setSentences(gradeSentences);
    setCurrentIndex(0);
    setIsFlipped(false);
    // 새 학년 선택시 진도 초기화
    setViewedCards(new Set());
  };

  const handleNext = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    // 현재 카드를 본 것으로 표시
    if (sentences[currentIndex]) {
      setViewedCards(prev => new Set([...prev, sentences[currentIndex].id]));
    }
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    // 현재 카드를 본 것으로 표시
    if (sentences[currentIndex]) {
      setViewedCards(prev => new Set([...prev, sentences[currentIndex].id]));
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    // 카드를 뒤집을 때도 본 것으로 표시
    if (sentences[currentIndex]) {
      setViewedCards(prev => new Set([...prev, sentences[currentIndex].id]));
    }
    setIsFlipped(!isFlipped);
  };

  const handleToggleImportant = () => {
    const currentSentence = sentences[currentIndex];
    if (currentSentence) {
      dataService.toggleImportant(currentSentence.id);
      // 로컬 상태 업데이트
      setSentences(prev => prev.map(sentence =>
        sentence.id === currentSentence.id
          ? { ...sentence, isImportant: !sentence.isImportant }
          : sentence
      ));
    }
  };

  const handlePlayAudio = useCallback(async () => {
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      return;
    }

    const currentSentence = sentences[currentIndex];
    if (!currentSentence) return;

    try {
      setIsPlayingAudio(true);
      const text = isFlipped ? currentSentence.english : currentSentence.korean;
      const language = isFlipped ? 'en' : 'ko';
      await ttsService.speak(text, language);
      setIsPlayingAudio(false);
    } catch (error) {
      setIsPlayingAudio(false);
      console.error('TTS Error:', error);
    }
  }, [isPlayingAudio, isFlipped, sentences, currentIndex]);

  // 학년 선택 화면
  if (!currentGrade) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: 'var(--surface-primary)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-primary)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0
            }}>
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

        {/* Main Content */}
        <main style={{ paddingTop: '80px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 80px)',
            padding: '32px 16px'
          }}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{
                  fontSize: '32px',
                  lineHeight: '40px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}>
                  학년을 선택하세요
                </h2>
                <p style={{
                  fontSize: '18px',
                  lineHeight: '28px',
                  color: 'var(--text-secondary)',
                  fontWeight: 400,
                  margin: 0
                }}>
                  영어 문장 학습을 시작하세요
                </p>
              </div>

              {/* Grade Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {[
                  { id: 'middle1' as Grade, name: '중1' },
                  { id: 'middle2' as Grade, name: '중2' },
                  { id: 'middle3' as Grade, name: '중3' },
                  { id: 'high1' as Grade, name: '고1' },
                  { id: 'high2' as Grade, name: '고2' },
                  { id: 'high3' as Grade, name: '고3' },
                ].map((grade) => {
                  const gradeSentences = dataService.getSentencesByGrade(grade.id);

                  return (
                    <div
                      key={grade.id}
                      onClick={() => handleGradeSelect(grade.id)}
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
                      <div style={{
                        fontSize: '24px',
                        lineHeight: '32px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                      }}>
                        {grade.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: 'var(--text-secondary)',
                        fontWeight: 500
                      }}>
                        {gradeSentences.length}개 문장
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Progress Dashboard Modal */}
        {showProgressDashboard && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px'
            }}
            onClick={() => setShowProgressDashboard(false)}
          >
            <div
              style={{
                background: 'var(--surface-primary)',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: 'var(--shadow-lg)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '24px',
                borderBottom: '1px solid var(--border-primary)'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  학습 진도
                </h2>
                <button
                  onClick={() => setShowProgressDashboard(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px' }}>
                {/* Overall Stats */}
                <div style={{
                  background: 'var(--semantic-primary-bg)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid var(--border-primary)'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    전체 진도
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '16px' 
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-primary-text-strong)',
                        marginBottom: '4px'
                      }}>
                        {[
                          { id: 'middle1' as Grade, name: '중1' },
                          { id: 'middle2' as Grade, name: '중2' },
                          { id: 'middle3' as Grade, name: '중3' },
                          { id: 'high1' as Grade, name: '고1' },
                          { id: 'high2' as Grade, name: '고2' },
                          { id: 'high3' as Grade, name: '고3' },
                        ].reduce((total, grade) => total + dataService.getSentencesByGrade(grade.id).length, 0)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>전체 문장</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-success-text-strong)',
                        marginBottom: '4px'
                      }}>
                        {dataService.getImportantSentences().length}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>중요 문장</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-warning-text-strong)',
                        marginBottom: '4px'
                      }}>
                        {viewedCards.size}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>본 카드</div>
                    </div>
                  </div>
                </div>

                {/* Grade Progress */}
                <div>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    학년별 학습
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '16px' 
                  }}>
                    {[
                      { id: 'middle1' as Grade, name: '중1' },
                      { id: 'middle2' as Grade, name: '중2' },
                      { id: 'middle3' as Grade, name: '중3' },
                      { id: 'high1' as Grade, name: '고1' },
                      { id: 'high2' as Grade, name: '고2' },
                      { id: 'high3' as Grade, name: '고3' },
                    ].map(grade => {
                      const sentences = dataService.getSentencesByGrade(grade.id);
                      const importantSentences = dataService.getImportantSentences();
                      const importantCount = sentences.filter(s => 
                        importantSentences.some(imp => imp.id === s.id)
                      ).length;
                      
                      return (
                        <div
                          key={grade.id}
                          onClick={() => {
                            handleGradeSelect(grade.id);
                            setShowProgressDashboard(false);
                          }}
                          style={{
                            background: 'var(--surface-primary)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '12px',
                            padding: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                          }}
                        >
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            marginBottom: '12px' 
                          }}>
                            <h4 style={{ 
                              fontWeight: 600, 
                              color: 'var(--text-primary)', 
                              margin: 0 
                            }}>
                              {grade.name}
                            </h4>
                            <span style={{ 
                              fontSize: '14px', 
                              fontWeight: 500, 
                              color: 'var(--text-secondary)' 
                            }}>
                              {sentences.length}개 문장
                            </span>
                          </div>
                          
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '8px' 
                          }}>
                            <span style={{ 
                              fontSize: '12px', 
                              color: 'var(--text-tertiary)' 
                            }}>
                              중요 문장: {importantCount}개
                            </span>
                            <span style={{ 
                              fontSize: '12px', 
                              color: 'var(--text-tertiary)' 
                            }}>
                              클릭하여 학습하기
                            </span>
                          </div>
                          
                          <div style={{
                            width: '100%',
                            background: 'var(--border-secondary)',
                            borderRadius: '4px',
                            height: '6px',
                            overflow: 'hidden'
                          }}>
                            <div
                              style={{
                                height: '100%',
                                borderRadius: '4px',
                                width: `${Math.min(100, (importantCount / sentences.length) * 100)}%`,
                                background: 'var(--semantic-primary-text-strong)',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Important Sentences */}
                {dataService.getImportantSentences().length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h3 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)', 
                      marginBottom: '16px',
                      margin: '0 0 16px 0'
                    }}>
                      ⭐ 중요 문장 ({dataService.getImportantSentences().length}개)
                    </h3>
                    <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                      {dataService.getImportantSentences().slice(0, 5).map((sentence) => (
                        <div
                          key={sentence.id}
                          style={{
                            padding: '12px',
                            background: 'var(--semantic-warning-bg)',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}
                        >
                          <div style={{ 
                            fontWeight: 500, 
                            color: 'var(--text-primary)',
                            marginBottom: '4px'
                          }}>
                            {sentence.korean}
                          </div>
                          <div style={{ 
                            color: 'var(--text-secondary)' 
                          }}>
                            {sentence.english}
                          </div>
                        </div>
                      ))}
                      {dataService.getImportantSentences().length > 5 && (
                        <div style={{ 
                          textAlign: 'center', 
                          padding: '8px', 
                          color: 'var(--text-secondary)', 
                          fontSize: '12px' 
                        }}>
                          ... 그 외 {dataService.getImportantSentences().length - 5}개 더
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 카드 학습 화면
  if (sentences.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '20px',
            color: 'var(--text-primary)',
            marginBottom: '16px'
          }}>
            문장을 불러오는 중...
          </div>
          <button
            onClick={() => {
              setCurrentGrade(null);
              setSentences([]);
            }}
            style={{
              padding: '12px 24px',
              background: 'var(--surface-primary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            학년 다시 선택
          </button>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];
  const gradeNames = { middle1: '중1', middle2: '중2', middle3: '중3', high1: '고1', high2: '고2', high3: '고3' };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'var(--surface-primary)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                setCurrentGrade(null);
                setSentences([]);
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
                fontWeight: 500
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
            >
              📊 진도
            </button>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '4px'
            }}>
              {gradeNames[currentGrade]} 학습
            </h1>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: 500
            }}>
              {currentIndex + 1} / {sentences.length} ({viewedCards.size}개 학습완료)
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setAutoPlay(prev => ({ ...prev, isActive: !prev.isActive }))}
              style={{
                padding: '8px 12px',
                background: autoPlay.isActive ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              {autoPlay.isActive ? '자동재생 중단' : '자동재생'}
            </button>
            
            <select
              value={autoPlay.speed}
              onChange={(e) => setAutoPlay(prev => ({ ...prev, speed: e.target.value as any }))}
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

      {/* Main Content */}
      <main style={{ paddingTop: '80px' }}>
        <div style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 16px'
        }}>
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
                {currentIndex + 1} / {sentences.length}
              </span>
            </div>
          </div>

          {/* Card */}
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '32px' }}>
            <div
              onClick={handleFlip}
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
                  {isFlipped ? currentSentence.english : currentSentence.korean}
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
              onClick={handlePrevious}
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
              onClick={handleToggleImportant}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: currentSentence.isImportant ? 'none' : '1px solid var(--border-primary)',
                cursor: 'pointer',
                background: currentSentence.isImportant ? '#f59e0b' : 'var(--surface-primary)',
                color: currentSentence.isImportant ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentIndex === sentences.length - 1}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: currentIndex === sentences.length - 1 ? 'not-allowed' : 'pointer',
                background: currentIndex === sentences.length - 1 ? 'var(--surface-secondary)' : '#3b82f6',
                color: currentIndex === sentences.length - 1 ? 'var(--text-tertiary)' : '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: 'var(--surface-primary)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '500px',
            width: '100%',
            marginBottom: '16px',
            border: '1px solid var(--border-primary)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                학습 진도
              </span>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                {viewedCards.size} / {sentences.length} 완료
              </span>
            </div>
            <div style={{
              width: '100%',
              background: 'var(--border-secondary)',
              borderRadius: '8px',
              height: '8px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '8px',
                  width: `${Math.min(100, (viewedCards.size / sentences.length) * 100)}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              textAlign: 'center',
              marginTop: '8px'
            }}>
              {Math.round((viewedCards.size / sentences.length) * 100)}% 완료
            </div>
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
      </main>

      {/* Progress Dashboard Modal */}
      {showProgressDashboard && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px'
          }}
          onClick={() => setShowProgressDashboard(false)}
        >
          <div
            style={{
              background: 'var(--surface-primary)',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '24px',
              borderBottom: '1px solid var(--border-primary)'
            }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                margin: 0
              }}>
                학습 진도
              </h2>
              <button
                onClick={() => setShowProgressDashboard(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Overall Stats */}
              <div style={{
                background: 'var(--semantic-primary-bg)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid var(--border-primary)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)', 
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  전체 진도
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '16px' 
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 700, 
                      color: 'var(--semantic-primary-text-strong)',
                      marginBottom: '4px'
                    }}>
                      {[
                        { id: 'middle1' as Grade, name: '중1' },
                        { id: 'middle2' as Grade, name: '중2' },
                        { id: 'middle3' as Grade, name: '중3' },
                        { id: 'high1' as Grade, name: '고1' },
                        { id: 'high2' as Grade, name: '고2' },
                        { id: 'high3' as Grade, name: '고3' },
                      ].reduce((total, grade) => total + dataService.getSentencesByGrade(grade.id).length, 0)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>전체 문장</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 700, 
                      color: 'var(--semantic-success-text-strong)',
                      marginBottom: '4px'
                    }}>
                      {dataService.getImportantSentences().length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>중요 문장</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 700, 
                      color: 'var(--semantic-warning-text-strong)',
                      marginBottom: '4px'
                    }}>
                      6
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>학년</div>
                  </div>
                </div>
              </div>

              {/* Grade Progress */}
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: 'var(--text-primary)', 
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  학년별 학습
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '16px' 
                }}>
                  {[
                    { id: 'middle1' as Grade, name: '중1' },
                    { id: 'middle2' as Grade, name: '중2' },
                    { id: 'middle3' as Grade, name: '중3' },
                    { id: 'high1' as Grade, name: '고1' },
                    { id: 'high2' as Grade, name: '고2' },
                    { id: 'high3' as Grade, name: '고3' },
                  ].map(grade => {
                    const sentences = dataService.getSentencesByGrade(grade.id);
                    const importantSentences = dataService.getImportantSentences();
                    const importantCount = sentences.filter(s => 
                      importantSentences.some(imp => imp.id === s.id)
                    ).length;
                    
                    return (
                      <div
                        key={grade.id}
                        onClick={() => {
                          handleGradeSelect(grade.id);
                          setShowProgressDashboard(false);
                        }}
                        style={{
                          background: 'var(--surface-primary)',
                          border: '1px solid var(--border-primary)',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          marginBottom: '12px' 
                        }}>
                          <h4 style={{ 
                            fontWeight: 600, 
                            color: 'var(--text-primary)', 
                            margin: 0 
                          }}>
                            {grade.name}
                          </h4>
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            color: 'var(--text-secondary)' 
                          }}>
                            {sentences.length}개 문장
                          </span>
                        </div>
                        
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '8px' 
                        }}>
                          <span style={{ 
                            fontSize: '12px', 
                            color: 'var(--text-tertiary)' 
                          }}>
                            중요 문장: {importantCount}개
                          </span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: 'var(--text-tertiary)' 
                          }}>
                            클릭하여 학습하기
                          </span>
                        </div>
                        
                        <div style={{
                          width: '100%',
                          background: 'var(--border-secondary)',
                          borderRadius: '4px',
                          height: '6px',
                          overflow: 'hidden'
                        }}>
                          <div
                            style={{
                              height: '100%',
                              borderRadius: '4px',
                              width: `${Math.min(100, (importantCount / sentences.length) * 100)}%`,
                              background: 'var(--semantic-primary-text-strong)',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Important Sentences */}
              {dataService.getImportantSentences().length > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)', 
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    ⭐ 중요 문장 ({dataService.getImportantSentences().length}개)
                  </h3>
                  <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {dataService.getImportantSentences().slice(0, 5).map((sentence) => (
                      <div
                        key={sentence.id}
                        style={{
                          padding: '12px',
                          background: 'var(--semantic-warning-bg)',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <div style={{ 
                          fontWeight: 500, 
                          color: 'var(--text-primary)',
                          marginBottom: '4px'
                        }}>
                          {sentence.korean}
                        </div>
                        <div style={{ 
                          color: 'var(--text-secondary)' 
                        }}>
                          {sentence.english}
                        </div>
                      </div>
                    ))}
                    {dataService.getImportantSentences().length > 5 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '8px', 
                        color: 'var(--text-secondary)', 
                        fontSize: '12px' 
                      }}>
                        ... 그 외 {dataService.getImportantSentences().length - 5}개 더
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;