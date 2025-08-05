import React from 'react';
import { motion } from 'framer-motion';
import type { LoadingState } from '../types';
import Card from '../design-system/components/Card/Card';

interface LoadingSpinnerProps {
  loading: LoadingState;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading, className = '' }) => {
  if (!loading.isLoading) return null;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      className={className}
    >
      {/* Spinner */}
      <motion.div
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          marginBottom: '16px'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            border: '4px solid var(--border-secondary)',
            borderRadius: '50%'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            border: '4px solid transparent',
            borderTopColor: 'var(--semantic-primary-text-strong)',
            borderRadius: '50%'
          }}
        />
      </motion.div>

      {/* Loading message */}
      {loading.message && (
        <motion.p
          style={{
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '8px',
            fontSize: '14px'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading.message}
        </motion.p>
      )}

      {/* Progress bar */}
      {loading.progress !== undefined && (
        <motion.div
          style={{
            width: '192px',
            background: 'var(--border-secondary)',
            borderRadius: '4px',
            height: '8px',
            overflow: 'hidden'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'var(--semantic-primary-text-strong)',
              borderRadius: '4px'
            }}
            initial={{ width: 0 }}
            animate={{ width: `${loading.progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}

      {/* Progress percentage */}
      {loading.progress !== undefined && (
        <motion.span
          style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            marginTop: '8px'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Math.round(loading.progress)}%
        </motion.span>
      )}
    </div>
  );
};

// Overlay version for full-screen loading
export const LoadingOverlay: React.FC<LoadingSpinnerProps> = ({ loading, className = '' }) => {
  if (!loading.isLoading) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card variant="elevated" padding="lg">
          <LoadingSpinner loading={loading} />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;