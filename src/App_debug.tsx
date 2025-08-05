import React from 'react';
import './App.css';

// 간단한 디버그용 앱
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              영어 카드 학습
            </h1>
            <p className="text-xl text-gray-600">
              학년을 선택하여 학습을 시작하세요
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {grades.map((grade) => (
              <button
                key={grade.id}
                onClick={() => handleGradeSelect(grade.id)}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200 group min-h-[160px]"
              >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {grade.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    100개 문장
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = sampleSentences[currentSentenceIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('grade')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← 뒤로
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {grades.find(g => g.id === selectedGrade)?.name} 학습
          </h1>
          <div></div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border">
            <span className="text-sm font-medium text-gray-700">
              {currentSentenceIndex + 1} / {sampleSentences.length}
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg mb-8">
          <div
            className="bg-white rounded-3xl shadow-xl border p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer"
            onClick={handleFlip}
          >
            {/* Language indicator */}
            <div className={`text-sm font-semibold mb-6 px-3 py-1 rounded-full ${
              isFlipped 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {isFlipped ? 'English' : '한국어'}
            </div>

            {/* Text content */}
            <div className="text-center flex-1 flex items-center justify-center">
              <p className="text-xl font-medium text-gray-900 leading-relaxed">
                {isFlipped ? currentSentence.english : currentSentence.korean}
              </p>
            </div>

            {/* Hint */}
            <div className="text-xs text-gray-500 mt-6">
              클릭하여 {isFlipped ? '한국어' : '영어'} 보기
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentSentenceIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              currentSentenceIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Flip */}
          <button
            onClick={handleFlip}
            className="w-14 h-14 rounded-full bg-green-600 text-white hover:bg-green-700 flex items-center justify-center transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={currentSentenceIndex === sampleSentences.length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              currentSentenceIndex === sampleSentences.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 max-w-md text-center">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>사용법:</strong></p>
            <p>• 카드 클릭: 뒤집기</p>
            <p>• ← → 버튼: 이전/다음 카드</p>
            <p>• 🔄 버튼: 카드 뒤집기</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;