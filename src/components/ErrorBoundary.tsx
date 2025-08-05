import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Card from '../design-system/components/Card/Card';
import Button from '../design-system/components/Button/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              variant="elevated" 
              padding="lg" 
              style={{ 
                maxWidth: '400px', 
                width: '100%', 
                textAlign: 'center' 
              }}
            >
              <motion.div
                style={{
                  color: 'var(--semantic-error-text-strong)',
                  marginBottom: '16px'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg 
                  width="64" 
                  height="64" 
                  style={{ margin: '0 auto' }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </motion.div>

              <motion.h2
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '8px'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                앱에서 오류가 발생했습니다
              </motion.h2>

              <motion.p
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '24px',
                  fontSize: '14px',
                  lineHeight: 1.5
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 다시 시도해주세요.
              </motion.p>

              <motion.div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={this.handleReload}
                >
                  페이지 새로고침
                </Button>
                
                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={this.handleReset}
                >
                  다시 시도
                </Button>
              </motion.div>

              {import.meta.env.DEV && this.state.error && (
                <motion.details
                  style={{
                    marginTop: '24px',
                    textAlign: 'left'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <summary 
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      marginBottom: '8px'
                    }}
                  >
                    개발자 정보 (클릭하여 펼치기)
                  </summary>
                  <div 
                    style={{
                      marginTop: '8px',
                      padding: '12px',
                      background: 'var(--surface-secondary)',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: 'var(--text-secondary)',
                      overflow: 'auto',
                      maxHeight: '160px'
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Stack:</strong>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{this.state.error.stack}</pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </motion.details>
              )}
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;