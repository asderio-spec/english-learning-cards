import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserFeedback } from '../types';
import Card from '../design-system/components/Card/Card';

interface FeedbackToastProps {
  feedback: UserFeedback[];
  onRemove: (id: string) => void;
}

const FeedbackToast: React.FC<FeedbackToastProps> = ({ feedback, onRemove }) => {
  const getIcon = (type: UserFeedback['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getColors = (type: UserFeedback['type']) => {
    switch (type) {
      case 'success':
        return {
          background: 'var(--semantic-success-bg)',
          color: 'var(--semantic-success-text-strong)',
          border: '1px solid var(--semantic-success-text-strong)'
        };
      case 'error':
        return {
          background: 'var(--semantic-error-bg)',
          color: 'var(--semantic-error-text-strong)',
          border: '1px solid var(--semantic-error-text-strong)'
        };
      case 'warning':
        return {
          background: 'var(--semantic-warning-bg)',
          color: 'var(--semantic-warning-text-strong)',
          border: '1px solid var(--semantic-warning-text-strong)'
        };
      case 'info':
        return {
          background: 'var(--semantic-primary-bg)',
          color: 'var(--semantic-primary-text-strong)',
          border: '1px solid var(--semantic-primary-text-strong)'
        };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        maxWidth: '400px',
        width: '100%',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <AnimatePresence>
        {feedback.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card
              variant="elevated"
              padding="md"
              style={{
                ...getColors(item.type),
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {getIcon(item.type)}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <p 
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    margin: 0
                  }}
                >
                  {item.message}
                </p>
                
                {item.action && (
                  <button
                    onClick={item.action.handler}
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      textDecoration: 'underline',
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      opacity: 0.9,
                      padding: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                  >
                    {item.action.label}
                  </button>
                )}
              </div>
              
              <button
                onClick={() => onRemove(item.id)}
                style={{
                  flexShrink: 0,
                  marginLeft: '8px',
                  opacity: 0.7,
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.background = 'none';
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackToast;