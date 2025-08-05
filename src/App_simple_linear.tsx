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
}

// 간단한 Linear 스타일 영어 카드 학습 앱
const App: React.FC = () => {
    const [currentView, setCurrentView] = React.useState<'grade' | 'card'>('grade');
    const [selectedGrade, setSelectedGrade] = React.useState<Grade | null>(null);
    const [sentences, setSentences] = React.useState<Sentence[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(0);
    const [isFlipped, setIsFlipped] = React.useState(false);
    const [importantSentences, setImportantSentences] = React.useState<Set<string>>(new Set());
    const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

    const grades = [
        { id: 'middle1' as Grade, name: '중1' },
        { id: 'middle2' as Grade, name: '중2' },
        { id: 'middle3' as Grade, name: '중3' },
        { id: 'high1' as Grade, name: '고1' },
        { id: 'high2' as Grade, name: '고2' },
        { id: 'high3' as Grade, name: '고3' },
    ];

    // 실제 문장 데이터
    const actualSentences: Record<Grade, Sentence[]> = React.useMemo(() => ({
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
    }), []);

    // Linear 디자인 시스템 CSS 변수 설정
    React.useEffect(() => {
        const root = document.documentElement;
        
        // 색상 변수
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

    // TTS 서비스
    const ttsService = React.useMemo(() => ({
        speak: async (text: string, language: 'ko' | 'en'): Promise<void> => {
            if (!('speechSynthesis' in window)) {
                throw new Error('Speech synthesis not supported');
            }

            return new Promise((resolve, reject) => {
                try {
                    speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = language === 'ko' ? 'ko-KR' : 'en-US';
                    utterance.rate = 0.9;
                    utterance.pitch = 1.0;
                    utterance.volume = 1.0;
                    utterance.onend = () => resolve();
                    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
                    speechSynthesis.speak(utterance);
                } catch (error) {
                    reject(error);
                }
            });
        },
        stop: () => {
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        }
    }), []);

    const handleGradeSelect = (gradeId: Grade) => {
        setSelectedGrade(gradeId);
        setSentences(actualSentences[gradeId] || []);
        setCurrentSentenceIndex(0);
        setIsFlipped(false);
        setCurrentView('card');
    };

    const handleNext = () => {
        if (currentSentenceIndex < sentences.length - 1) {
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
                        {grades.map((grade, index) => {
                            const sentenceCount = actualSentences[grade.id]?.length || 0;

                            return (
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
                                            fontSize: '12px',
                                            lineHeight: '16px',
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

                        <div
                            style={{
                                fontSize: '14px',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            {currentSentenceIndex + 1} / {sentences.length}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main
                    style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '32px 16px'
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '600px' }}>
                        {/* Card */}
                        <div
                            onClick={handleFlip}
                            style={{
                                background: 'var(--surface-primary)',
                                borderRadius: '16px',
                                padding: '48px 32px',
                                minHeight: '300px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: '1px solid var(--border-primary)',
                                boxShadow: 'var(--shadow-lg)',
                                transition: 'all 0.2s ease',
                                marginBottom: '32px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                            }}
                        >
                            {/* Language indicator */}
                            <div
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    marginBottom: '24px',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    backgroundColor: isFlipped ? 'var(--semantic-success-bg)' : 'var(--semantic-primary-bg)',
                                    color: isFlipped ? 'var(--semantic-success-text-strong)' : 'var(--semantic-primary-text-strong)'
                                }}
                            >
                                {isFlipped ? 'English' : '한국어'}
                            </div>

                            {/* Text content */}
                            <div
                                style={{
                                    fontSize: isFlipped ? '20px' : '24px',
                                    lineHeight: isFlipped ? '28px' : '32px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: '24px'
                                }}
                            >
                                {isFlipped ? currentSentence.english : currentSentence.korean}
                            </div>

                            {/* Hint */}
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: 'var(--text-tertiary)'
                                }}
                            >
                                클릭하여 {isFlipped ? '한국어' : '영어'} 보기
                            </div>
                        </div>

                        {/* Controls */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '16px'
                            }}
                        >
                            <button
                                onClick={handlePrevious}
                                disabled={currentSentenceIndex === 0}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 16px',
                                    background: currentSentenceIndex === 0 ? 'var(--surface-secondary)' : 'var(--surface-primary)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '8px',
                                    color: currentSentenceIndex === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                    cursor: currentSentenceIndex === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                이전
                            </button>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={handlePlayAudio}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: isPlayingAudio ? '#ef4444' : '#10b981',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    🔊 {isPlayingAudio ? '중단' : '듣기'}
                                </button>

                                <button
                                    onClick={handleToggleImportant}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 16px',
                                        background: isImportant ? '#f59e0b' : 'var(--surface-primary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: '8px',
                                        color: isImportant ? '#ffffff' : 'var(--text-primary)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    ⭐ {isImportant ? '중요' : '표시'}
                                </button>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentSentenceIndex === sentences.length - 1}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 16px',
                                    background: currentSentenceIndex === sentences.length - 1 ? 'var(--surface-secondary)' : 'var(--surface-primary)',
                                    border: '1px solid var(--border-primary)',
                                    borderRadius: '8px',
                                    color: currentSentenceIndex === sentences.length - 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                    cursor: currentSentenceIndex === sentences.length - 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                다음
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Keyboard Shortcuts */}
                        <div
                            style={{
                                marginTop: '32px',
                                padding: '16px',
                                background: 'var(--surface-secondary)',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: 'var(--text-tertiary)',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontWeight: 500, marginBottom: '8px' }}>키보드 단축키:</div>
                            <div>← → : 이전/다음 | Space : 듣기 | Enter : 뒤집기 | I : 중요 표시</div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return null;
};

export default App;