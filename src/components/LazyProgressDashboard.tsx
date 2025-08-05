import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { Grade } from '../types';

// Lazy load the ProgressDashboard component
const ProgressDashboard = React.lazy(() => import('./ProgressDashboard'));

interface LazyProgressDashboardProps {
  onClose: () => void;
  onGradeSelect: (grade: Grade) => void;
}

const LazyProgressDashboard: React.FC<LazyProgressDashboardProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <LoadingSpinner loading={{ isLoading: true, message: '진도 대시보드를 불러오는 중...' }} />
        </div>
      </div>
    }>
      <ProgressDashboard {...props} />
    </Suspense>
  );
};

export default LazyProgressDashboard;