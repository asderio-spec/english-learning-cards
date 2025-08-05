import React, { useState } from 'react';
import { Button } from '../components';

const ButtonDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>
        Button Component Demo
      </h2>
      
      {/* Variants */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Variants
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </section>

      {/* Sizes */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Sizes
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* States */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          States
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleLoadingTest}>
            {loading ? 'Loading...' : 'Test Loading'}
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          With Icons
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button icon={<span>←</span>}>Back</Button>
          <Button iconRight={<span>→</span>}>Next</Button>
          <Button 
            icon={<span>📧</span>} 
            iconRight={<span>↗</span>}
          >
            Send Email
          </Button>
        </div>
      </section>

      {/* Full Width */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Full Width
        </h3>
        <Button fullWidth variant="primary">
          Full Width Button
        </Button>
      </section>

      {/* Accessibility Demo */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Accessibility Features
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button 
            aria-label="Save document"
            icon={<span>💾</span>}
          >
            Save
          </Button>
          <Button 
            aria-describedby="delete-description"
            variant="ghost"
          >
            Delete
          </Button>
        </div>
        <p id="delete-description" style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginTop: '8px' 
        }}>
          This action cannot be undone
        </p>
      </section>

      {/* Interactive Test */}
      <section>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>
          Interactive Test
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button onClick={() => alert('Primary clicked!')}>
            Click Me
          </Button>
          <Button 
            variant="secondary"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                alert('Enter key pressed!');
              }
            }}
          >
            Press Enter
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ButtonDemo;