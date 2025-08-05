import React, { useState, useEffect } from 'react';
import type { Grade, Sentence, LearningProgress } from '../types';
import { progressService } from '../services/progressService';
import { dataService } from '../services/dataService';
import Button from '../design-system/components/Button/Button';
import Card from '../design-system/components/Card/Card';

interface ProgressDashboardProps {
  onClose: () => void;
  onGradeSelect: (grade: Grade) => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = React.memo(({ onClose, onGradeSelect }) => {
  const [overallProgress, setOverallProgress] = useState<{
    totalSentences: number;
    totalStudiedSentences: number;
    overallCompletionRate: number;
    gradeProgress: Record<Grade, LearningProgress>;
  } | null>(null);
  const [streakInfo, setStreakInfo] = useState<{
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: Date | null;
  } | null>(null);
  const [importantSentences, setImportantSentences] = useState<Sentence[]>([]);
  const [selectedTab, setSelectedTab] = useState<'progress' | 'important'>('progress');

  // Grade display names - memoized
  const gradeNames: Record<Grade, string> = React.useMemo(() => ({
    middle1: '중1',
    middle2: '중2',
    middle3: '중3',
    high1: '고1',
    high2: '고2',
    high3: '고3'
  }), []);

  // Load data on component mount
  useEffect(() => {
    loadProgressData();
    loadImportantSentences();
  }, []);

  const loadProgressData = () => {
    try {
      const progress = progressService.getOverallProgress();
      const streak = progressService.getStreakInfo();

      setOverallProgress(progress);
      setStreakInfo(streak);
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };

  const loadImportantSentences = () => {
    try {
      const sentences = dataService.getImportantSentences();
      setImportantSentences(sentences);
    } catch (error) {
      console.error('Error loading important sentences:', error);
    }
  };

  const handleRemoveImportant = (sentenceId: string) => {
    try {
      // Toggle important status in dataService
      dataService.toggleImportant(sentenceId);

      // Reload important sentences
      loadImportantSentences();
    } catch (error) {
      console.error('Error removing important sentence:', error);
    }
  };

  const handleGradeClick = (grade: Grade) => {
    onGradeSelect(grade);
    onClose();
  };

  const getProgressBarColor = (completionRate: number): string => {
    if (completionRate >= 80) return 'bg-green-500';
    if (completionRate >= 60) return 'bg-yellow-500';
    if (completionRate >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '없음';
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!overallProgress || !streakInfo) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}
      >
        <Card variant="elevated" padding="lg" style={{ maxWidth: '400px', width: '100%', margin: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>데이터를 불러오는 중...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="progress-title"
    >
      <Card 
        variant="elevated" 
        padding="sm"
        style={{
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <header 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <h2 
            id="progress-title" 
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            학습 진도
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="진도 대시보드 닫기"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              minHeight: '40px'
            }}
            icon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
          >
            <span style={{ display: 'none' }}>닫기</span>
          </Button>
        </header>

        {/* Tab Navigation */}
        <nav 
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)'
          }}
          role="tablist" 
          aria-label="진도 대시보드 탭"
        >
          <Button
            variant={selectedTab === 'progress' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setSelectedTab('progress')}
            style={{
              flex: 1,
              borderRadius: 0,
              borderBottom: selectedTab === 'progress' ? '2px solid var(--semantic-primary-text-strong)' : 'none'
            }}
            role="tab"
            aria-selected={selectedTab === 'progress'}
            aria-controls="progress-panel"
            id="progress-tab"
          >
            학습 진도
          </Button>
          <Button
            variant={selectedTab === 'important' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setSelectedTab('important')}
            style={{
              flex: 1,
              borderRadius: 0,
              borderBottom: selectedTab === 'important' ? '2px solid var(--semantic-primary-text-strong)' : 'none'
            }}
            role="tab"
            aria-selected={selectedTab === 'important'}
            aria-controls="important-panel"
            id="important-tab"
          >
            중요 문장 ({importantSentences.length})
          </Button>
        </nav>

        {/* Content */}
        <div 
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {selectedTab === 'progress' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} role="tabpanel" id="progress-panel" aria-labelledby="progress-tab">
              {/* Overall Progress */}
              <Card variant="outlined" padding="lg" style={{ background: 'var(--semantic-primary-bg)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>전체 진도</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-primary-text-strong)' 
                      }}
                      aria-label={`완료율 ${overallProgress.overallCompletionRate}퍼센트`}
                    >
                      {overallProgress.overallCompletionRate}%
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>완료율</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-success-text-strong)' 
                      }}
                      aria-label={`학습한 문장 ${overallProgress.totalStudiedSentences}개`}
                    >
                      {overallProgress.totalStudiedSentences}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>학습한 문장</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)' 
                      }}
                      aria-label={`전체 문장 ${overallProgress.totalSentences}개`}
                    >
                      {overallProgress.totalSentences}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>전체 문장</div>
                  </div>
                </div>
              </Card>

              {/* Learning Streak */}
              <Card variant="outlined" padding="lg" style={{ background: 'var(--semantic-warning-bg)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>학습 스트릭</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-warning-text-strong)' 
                      }}
                      aria-label={`현재 스트릭 ${streakInfo.currentStreak}일`}
                    >
                      {streakInfo.currentStreak}일
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>현재 스트릭</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div 
                      style={{ 
                        fontSize: '32px', 
                        fontWeight: 700, 
                        color: 'var(--semantic-error-text-strong)' 
                      }}
                      aria-label={`최고 스트릭 ${streakInfo.longestStreak}일`}
                    >
                      {streakInfo.longestStreak}일
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>최고 스트릭</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {formatDate(streakInfo.lastStudyDate)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>마지막 학습일</div>
                  </div>
                </div>
              </Card>

              {/* Grade Progress */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>학년별 진도</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {(Object.keys(overallProgress.gradeProgress) as Grade[]).map(grade => {
                    const progress = overallProgress.gradeProgress[grade];
                    return (
                      <Card
                        key={grade}
                        variant="elevated"
                        padding="md"
                        interactive={true}
                        onClick={() => handleGradeClick(grade)}
                        aria-label={`${gradeNames[grade]} 학습하기. 진도율 ${progress.completionRate}%, ${progress.studiedSentences}개 중 ${progress.totalSentences}개 문장 학습 완료`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <h4 style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{gradeNames[grade]}</h4>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            {progress.completionRate}%
                          </span>
                        </div>
                        <div 
                          style={{
                            width: '100%',
                            background: 'var(--border-secondary)',
                            borderRadius: '4px',
                            height: '8px',
                            marginBottom: '8px',
                            overflow: 'hidden'
                          }}
                          role="progressbar"
                          aria-valuenow={progress.completionRate}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${gradeNames[grade]} 진도율`}
                        >
                          <div
                            style={{
                              height: '100%',
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                              width: `${progress.completionRate}%`,
                              background: progress.completionRate >= 80 ? 'var(--semantic-success-text-strong)' :
                                         progress.completionRate >= 60 ? 'var(--semantic-warning-text-strong)' :
                                         progress.completionRate >= 40 ? '#f97316' : 'var(--semantic-error-text-strong)'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          <span>{progress.studiedSentences} / {progress.totalSentences} 문장</span>
                          <span>클릭하여 학습하기</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Important Sentences Tab */
            <div role="tabpanel" id="important-panel" aria-labelledby="important-tab">
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
                중요 문장 목록 ({importantSentences.length}개)
              </h3>
              {importantSentences.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <div style={{ color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                    <svg 
                      width="64" 
                      height="64" 
                      style={{ margin: '0 auto 16px', color: 'var(--text-tertiary)' }} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>아직 중요 표시한 문장이 없습니다.</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>학습 중에 별표 버튼을 눌러 중요한 문장을 표시해보세요.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {importantSentences.map(sentence => (
                    <Card
                      key={sentence.id}
                      variant="outlined"
                      padding="md"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span 
                              style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                fontSize: '12px',
                                fontWeight: 500,
                                background: 'var(--semantic-primary-bg)',
                                color: 'var(--semantic-primary-text-strong)',
                                borderRadius: '4px'
                              }}
                            >
                              {gradeNames[sentence.grade]}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                              학습 {sentence.studyCount}회
                            </span>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '4px' }}>{sentence.korean}</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{sentence.english}</p>
                          </div>
                          {sentence.lastStudied && (
                            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                              마지막 학습: {formatDate(sentence.lastStudied)}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImportant(sentence.id)}
                          aria-label={`"${sentence.korean}" 문장의 중요 표시 해제하기`}
                          style={{
                            marginLeft: '16px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            minHeight: '40px',
                            color: '#f59e0b'
                          }}
                          icon={
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          }
                        >
                          <span style={{ display: 'none' }}>중요 해제</span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
});

export default ProgressDashboard;