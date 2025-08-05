import React, { useState, useEffect } from 'react';
import type { Grade, Sentence } from '../types';
import { dataService } from '../services/dataService';

interface ProgressDashboardProps {
  onClose: () => void;
  onGradeSelect: (grade: Grade) => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onClose, onGradeSelect }) => {
  const [importantSentences, setImportantSentences] = useState<Sentence[]>([]);
  const [selectedTab, setSelectedTab] = useState<'progress' | 'important'>('progress');

  const gradeNames: Record<Grade, string> = {
    middle1: '중1',
    middle2: '중2',
    middle3: '중3',
    high1: '고1',
    high2: '고2',
    high3: '고3'
  };

  const grades: Grade[] = ['middle1', 'middle2', 'middle3', 'high1', 'high2', 'high3'];

  useEffect(() => {
    loadImportantSentences();
  }, []);

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
      dataService.toggleImportant(sentenceId);
      loadImportantSentences();
    } catch (error) {
      console.error('Error removing important sentence:', error);
    }
  };

  const handleGradeClick = (grade: Grade) => {
    onGradeSelect(grade);
    onClose();
  };

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
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface-primary)',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
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
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            학습 진도
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        {/* Tab Navigation */}
        <nav
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <button
            onClick={() => setSelectedTab('progress')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: selectedTab === 'progress' ? 'var(--semantic-primary-bg)' : 'transparent',
              color: selectedTab === 'progress' ? 'var(--semantic-primary-text-strong)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              borderBottom: selectedTab === 'progress' ? '2px solid var(--semantic-primary-text-strong)' : 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedTab !== 'progress') {
                e.currentTarget.style.background = 'var(--surface-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTab !== 'progress') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            학습 진도
          </button>
          <button
            onClick={() => setSelectedTab('important')}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: selectedTab === 'important' ? 'var(--semantic-primary-bg)' : 'transparent',
              color: selectedTab === 'important' ? 'var(--semantic-primary-text-strong)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              borderBottom: selectedTab === 'important' ? '2px solid var(--semantic-primary-text-strong)' : 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (selectedTab !== 'important') {
                e.currentTarget.style.background = 'var(--surface-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTab !== 'important') {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            중요 문장 ({importantSentences.length})
          </button>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Overall Stats */}
              <div
                style={{
                  background: 'var(--semantic-primary-bg)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', margin: 0 }}>
                  전체 진도
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: 'var(--semantic-primary-text-strong)',
                        marginBottom: '4px'
                      }}
                    >
                      {grades.reduce((total, grade) => total + dataService.getSentencesByGrade(grade).length, 0)}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>전체 문장</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: 'var(--semantic-success-text-strong)',
                        marginBottom: '4px'
                      }}
                    >
                      {importantSentences.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>중요 문장</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        color: 'var(--semantic-warning-text-strong)',
                        marginBottom: '4px'
                      }}
                    >
                      {grades.length}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>학년</div>
                  </div>
                </div>
              </div>

              {/* Grade Progress */}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', margin: '0 0 16px 0' }}>
                  학년별 학습
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                  {grades.map(grade => {
                    const sentences = dataService.getSentencesByGrade(grade);
                    const importantCount = sentences.filter(s => importantSentences.some(imp => imp.id === s.id)).length;

                    return (
                      <div
                        key={grade}
                        onClick={() => handleGradeClick(grade)}
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h4 style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                            {gradeNames[grade]}
                          </h4>
                          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                            {sentences.length}개 문장
                          </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            중요 문장: {importantCount}개
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                            클릭하여 학습하기
                          </span>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            background: 'var(--border-secondary)',
                            borderRadius: '4px',
                            height: '6px',
                            overflow: 'hidden'
                          }}
                        >
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
            </div>
          ) : (
            /* Important Sentences Tab */
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', margin: '0 0 16px 0' }}>
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
                  <p style={{ color: 'var(--text-primary)', marginBottom: '8px', margin: '0 0 8px 0' }}>
                    아직 중요 표시한 문장이 없습니다.
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                    학습 중에 별표 버튼을 눌러 중요한 문장을 표시해보세요.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {importantSentences.map(sentence => (
                    <div
                      key={sentence.id}
                      style={{
                        background: 'var(--surface-primary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '12px',
                        padding: '16px'
                      }}
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
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <p style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '4px', margin: '0 0 4px 0' }}>
                              {sentence.korean}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                              {sentence.english}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveImportant(sentence.id)}
                          style={{
                            marginLeft: '16px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'transparent',
                            color: '#f59e0b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef3c7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;