import React from 'react';
import './App.css';

// 타입 정의
type Grade = 'middle1' | 'middle2' | 'middle3' | 'high1' | 'high2' | 'high3';

interface Sentence {
  id: string;
  korean: string;
  english: string;
  grade: Grade;
  isImportant?: boolean;
  studyCount?: number;
  lastStudied?: Date;
}

// 샘플 데이터 (실제 데이터 서비스에서 가져올 수 있음)
const sampleData: Record<Grade, Sentence[]> = {
  middle1: [
    { id: 'm1_001', korean: '안녕하세요.', english: 'Hello.', grade: 'middle1' },
    { id: 'm1_002', korean: '제 이름은 김민수입니다.', english: 'My name is Kim Minsu.', grade: 'middle1' },
    { id: 'm1_003', korean: '만나서 반갑습니다.', english: 'Nice to meet you.', grade: 'middle1' },
    { id: 'm1_004', korean: '저는 13살입니다.', english: 'I am 13 years old.', grade: 'middle1' },
    { id: 'm1_005', korean: '저는 학생입니다.', english: 'I am a student.', grade: 'middle1' },
    { id: 'm1_006', korean: '이것은 책입니다.', english: 'This is a book.', grade: 'middle1' },
    { id: 'm1_007', korean: '저것은 펜입니다.', english: 'That is a pen.', grade: 'middle1' },
    { id: 'm1_008', korean: '여기는 교실입니다.', english: 'This is a classroom.', grade: 'middle1' },
    { id: 'm1_009', korean: '저기는 도서관입니다.', english: 'That is a library.', grade: 'middle1' },
    { id: 'm1_010', korean: '오늘은 월요일입니다.', english: 'Today is Monday.', grade: 'middle1' },
  ],
  middle2: [
    { id: 'm2_001', korean: '저는 어제 영화를 봤습니다.', english: 'I watched a movie yesterday.', grade: 'middle2' },
    { id: 'm2_002', korean: '내일 친구를 만날 예정입니다.', english: 'I will meet my friend tomorrow.', grade: 'middle2' },
    { id: 'm2_003', korean: '지금 숙제를 하고 있습니다.', english: 'I am doing homework now.', grade: 'middle2' },
    { id: 'm2_004', korean: '저는 피자를 좋아합니다.', english: 'I like pizza.', grade: 'middle2' },
    { id: 'm2_005', korean: '그는 축구를 잘 합니다.', english: 'He plays soccer well.', grade: 'middle2' },
  ],
  middle3: [
    { id: 'm3_001', korean: '저는 3년 동안 영어를 공부했습니다.', english: 'I have studied English for 3 years.', grade: 'middle3' },
    { id: 'm3_002', korean: '만약 비가 오면 집에 있을 거예요.', english: 'If it rains, I will stay home.', grade: 'middle3' },
    { id: 'm3_003', korean: '그녀는 노래를 부르는 것을 좋아합니다.', english: 'She likes singing songs.', grade: 'middle3' },
  ],
  high1: [
    { id: 'h1_001', korean: '환경 보호는 매우 중요합니다.', english: 'Environmental protection is very important.', grade: 'high1' },
    { id: 'h1_002', korean: '기술의 발전은 우리 삶을 변화시켰습니다.', english: 'The advancement of technology has changed our lives.', grade: 'high1' },
  ],
  high2: [
    { id: 'h2_001', korean: '글로벌화는 세계를 더 가깝게 만들었습니다.', english: 'Globalization has made the world closer.', grade: 'high2' },
  ],
  high3: [
    { id: 'h3_001', korean: '지속 가능한 발전이 미래의 핵심입니다.', english: 'Sustainable development is the key to the future.', grade: 'high3' },
  ]
};

// TTS 서비스
class TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPlaying = false;

  async speak(text: string, language: 'ko' | 'en'): Promise<void> {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    this.stop();

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          this.isPlaying = true;
        };

        utterance.onend = () => {
          this.isPlaying = false;
          this.currentUtterance = null;
          resolve();
        };

        utterance.onerror = (event) => {
          this.isPlaying = false;
          this.currentUtterance = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.currentUtterance) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
      this.isPlaying = false;
    }
  }

  get playing(): boolean {
    return this.isPlaying;
  }
}

// 메인 앱 컴포넌트
const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<'grade' | 'card' | 'progress'>('grade');
  const [selectedGrade, setSelectedGrade] = React.useState<Grade | null>(null);
  const [sentences, setSentences] = React.useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [importantSentences, setImportantSentences] = React.useState<Set<string>>(new Set());
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState({ isActive: false, speed: 'normal' as 'slow' | 'normal' | 'fast' });
  const [showProgressDashboard, setShowProgressDashboard] = React.useState(false);

  const ttsService = React.useMemo(() => new TTSService(), []);

  const grades = [
    { id: 'middle1' as Grade, name: '중1', count: sampleData.middle1.length },
    { id: 'middle2' as Grade, name: '중2', count: sampleData.middle2.length },
    { id: 'middle3' as Grade, name: '중3', count: sampleData.middle3.length },
    { id: 'high1' as Grade, name: '고1', count: sampleData.high1.length },
    { id: 'high2' as Grade, name: '고2', count: sampleData.high2.length },
    { id: 'high3' as Grade, name: '고3', count: sampleData.high3.length },
  ];

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

  // 자동재생 기능
  React.useEffect(() => {
    if (!autoPlay.isActive || sentences.length === 0) return;

    const speeds = { slow: 5000, normal: 3000, fast: 2000 };
    const interval = setInterval(() => {
      if (!isFlipped) {
        setIsFlipped(true);
      } else {
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(prev => prev + 1);
          setIsFlipped(false);
        } else {
          setAutoPlay(prev => ({ ...prev, isActive: false }));
        }
      }
    }, speeds[autoPlay.speed]);

    return () => clearInterval(interval);
  }, [autoPlay.isActive, autoPlay.speed, currentSentenceIndex, sentences.length, isFlipped]);

  const handleGradeSelect = (gradeId: Grade) => {
    setSelectedGrade(gradeId);
    setSentences(sampleData[gradeId] || []);
    setCurrentSentenceIndex(0);
    setIsFlipped(false);
    setCurrentView('card');
  };

  const handleNext = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    if (autoPlay.isActive) {
      setAutoPlay(prev => ({ ...prev, isActive: false }));
    }
    setIsFlipped(!isFlipped);
  };

  const handleToggleImportant = () => {
    const currentSentence = sentences[currentSentenceIndex];
    if (currentSentence) {
      const newImportantSentences = new Set(importantSentences);
      if (newImportantSentences.has(currentSentence.id)) {
        newImportantSentences.delete(currentSentence.id);
      } else {
        newImportantSentences.add(currentSentence.id);
      }
      setImportantSentences(newImportantSentences);
      
      // 문장 데이터 업데이트
      setSentences(prev => prev.map(sentence => 
        sentence.id === currentSentence.id 
          ? { ...sentence, isImportant: newImportantSentences.has(currentSentence.id) }
          : sentence
      ));
    }
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
      ttsService.stop();
      setIsPlayingAudio(false);
      return;
    }

    const currentSentence = sentences[currentSentenceIndex];
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
  };

  // 키보드 네비게이션
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentView !== 'card') return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (currentSentenceIndex > 0) handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentSentenceIndex < sentences.length - 1) handleNext();
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
  }, [currentView, currentSentenceIndex, sentences.length, isFlipped]);

  // 학년 선택 화면
  if (currentView === 'grade') {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h1 
              style={{
                fontSize: '32px',
                lineHeight: '40px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '16px',
                letterSpacing: '-0.02em'
              }}
            >
              영어 카드 학습
            </h1>
            <p 
              style={{
                fontSize: '18px',
                lineHeight: '28px',
                color: 'var(--text-secondary)',
                fontWeight: 400
              }}
            >
              학년을 선택하여 학습을 시작하세요
            </p>
          </div>

          {/* Controls */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <button
              onClick={() => setShowProgressDashboard(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#3b82f6',
                color: '#ffffff',
                border: '1px solid #3b82f6',
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

          {/* Grade Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '24px',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            {grades.map((grade, index) => (
              <div
                key={grade.id}
                onClick={() => handleGradeSelect(grade.id)}
                style={{
                  background: 'var(--surface-primary)',
                  borderRadius: '12px',
                  padding: '32px',
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
                  transform: 'translateY(0)',
                  animation: `slideUp 0.6s ease ${index * 0.1}s both`
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
                    fontSize: '12px',
                    lineHeight: '16px',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}
                >
                  {grade.count}개 문장
                </div>
              </div>
            ))}
          </div>
        </div>

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
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>학습 진도</h2>
                <button
                  onClick={() => setShowProgressDashboard(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    style={{
                      padding: '16px',
                      background: 'var(--surface-secondary)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{grade.name}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        총 {grade.count}개 문장
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleGradeSelect(grade.id);
                        setShowProgressDashboard(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      학습하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // 카드 학습 화면
  if (currentView === 'card' && selectedGrade && sentences.length > 0) {
    const currentSentence = sentences[currentSentenceIndex];
    const isImportant = importantSentences.has(currentSentence.id);

    return (
      <div 
        style={{
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Header */}
        <header 
          style={{
            background: 'var(--surface-primary)',
            borderBottom: '1px solid var(--border-primary)',
            padding: '16px'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setCurrentView('grade')}
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
              >
                📊 진도
              </button>
            </div>
            
            <h1 
              style={{
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              {grades.find(g => g.id === selectedGrade)?.name} 학습
            </h1>
            
            {/* Auto Play Controls */}
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
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {autoPlay.isActive ? '중단' : '자동재생'}
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

        {/* Main content */}
        <div 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px'
          }}
        >
          {/* Progress */}
          <div
            style={{
              background: 'var(--surface-primary)',
              border: '2px solid var(--border-primary)',
              borderRadius: '8px',
              padding: '8px 16px',
              marginBottom: '32px',
              display: 'inline-block'
            }}
          >
            <span 
              style={{
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 500,
                color: 'var(--text-primary)'
              }}
            >
              {currentSentenceIndex + 1} / {sentences.length}
            </span>
          </div>

          {/* Learning Card */}
          <div
            onClick={handleFlip}
            style={{
              width: '100%',
              maxWidth: '600px',
              minHeight: '300px',
              marginBottom: '32px',
              background: 'var(--surface-primary)',
              borderRadius: '12px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              border: 'none',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Important indicator */}
            {isImportant && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '20px'
                }}
              >
                ⭐
              </div>
            )}

            {/* Language indicator */}
            <div 
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 500,
                color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)',
                backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
                padding: '4px 12px',
                borderRadius: '20px',
                marginBottom: '24px'
              }}
            >
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p 
                style={{
                  fontSize: '24px',
                  lineHeight: '32px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}
              >
                {isFlipped ? currentSentence.english : currentSentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div 
              style={{
                fontSize: '11px',
                lineHeight: '14px',
                color: 'var(--text-tertiary)',
                marginTop: '24px'
              }}
            >
              클릭하여 {isFlipped ? '한국어' : '영어'} 보기
            </div>
          </div>

          {/* Controls */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}
          >
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={currentSentenceIndex === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                minHeight: '44px',
                background: currentSentenceIndex === 0 ? 'var(--surface-secondary)' : '#64748b',
                color: currentSentenceIndex === 0 ? 'var(--text-tertiary)' : '#ffffff',
                border: `1px solid ${currentSentenceIndex === 0 ? 'var(--border-primary)' : '#64748b'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentSentenceIndex === 0 ? 0.6 : 1
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            {/* Audio */}
            <button
              onClick={handlePlayAudio}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                minHeight: '44px',
                background: isPlayingAudio ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlayingAudio ? '🔇' : '🔊'}
              {isPlayingAudio ? '중단' : '발음'}
            </button>

            {/* Important */}
            <button
              onClick={handleToggleImportant}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                minHeight: '44px',
                background: isImportant ? '#fbbf24' : 'var(--surface-secondary)',
                color: isImportant ? '#ffffff' : 'var(--text-secondary)',
                border: `1px solid ${isImportant ? '#fbbf24' : 'var(--border-primary)'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⭐
              {isImportant ? '중요' : '표시'}
            </button>

            {/* Flip */}
            <button
              onClick={handleFlip}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                minHeight: '44px',
                background: '#3b82f6',
                color: '#ffffff',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔄
              뒤집기
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentSentenceIndex === sentences.length - 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                minHeight: '44px',
                background: currentSentenceIndex === sentences.length - 1 ? 'var(--surface-secondary)' : '#64748b',
                color: currentSentenceIndex === sentences.length - 1 ? 'var(--text-tertiary)' : '#ffffff',
                border: `1px solid ${currentSentenceIndex === sentences.length - 1 ? 'var(--border-primary)' : '#64748b'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: currentSentenceIndex === sentences.length - 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentSentenceIndex === sentences.length - 1 ? 0.6 : 1
              }}
            >
              다음
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Instructions */}
          <div
            style={{
              maxWidth: '500px',
              textAlign: 'center',
              background: 'var(--surface-secondary)',
              borderRadius: '8px',
              padding: '16px'
            }}
          >
            <div 
              style={{
                fontSize: '14px',
                lineHeight: '20px',
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}
            >
              <strong style={{ color: 'var(--text-primary)' }}>키보드 단축키:</strong>
              <br />
              • ← → : 이전/다음 카드 • Enter: 뒤집기 • Space: 발음 듣기 • I: 중요 표시
            </div>
          </div>
        </div>

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
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>학습 진도</h2>
                <button
                  onClick={() => setShowProgressDashboard(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    style={{
                      padding: '16px',
                      background: selectedGrade === grade.id ? 'var(--semantic-primary-bg)' : 'var(--surface-secondary)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: selectedGrade === grade.id ? '2px solid var(--semantic-primary-text-strong)' : '1px solid var(--border-primary)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {grade.name} {selectedGrade === grade.id && '(현재 학습 중)'}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                        총 {grade.count}개 문장
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (selectedGrade !== grade.id) {
                          handleGradeSelect(grade.id);
                        }
                        setShowProgressDashboard(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        background: selectedGrade === grade.id ? '#10b981' : '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedGrade === grade.id ? '계속하기' : '학습하기'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Important Sentences */}
              {importantSentences.size > 0 && (
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                    ⭐ 중요 문장 ({importantSentences.size}개)
                  </h3>
                  <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                    {Array.from(importantSentences).map((sentenceId) => {
                      const sentence = sentences.find(s => s.id === sentenceId);
                      if (!sentence) return null;
                      
                      return (
                        <div
                          key={sentenceId}
                          style={{
                            padding: '12px',
                            background: 'var(--semantic-warning-bg)',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            fontSize: '14px'
                          }}
                        >
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                            {sentence.korean}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {sentence.english}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 로딩 또는 오류 상태
  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
          문장을 불러오는 중...
        </div>
        <button
          onClick={() => setCurrentView('grade')}
          style={{
            padding: '12px 24px',
            background: '#64748b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          학년 선택으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default App;