import React from 'react';
import { Card } from '../components/Card';

const CardDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f6f8fa' }}>
      <h2 style={{ marginBottom: '24px', color: '#24292e' }}>Card Component Demo</h2>
      
      {/* Variants Demo */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#586069' }}>Variants</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Card variant="default" style={{ width: '200px' }}>
            <h4>Default Card</h4>
            <p>This is a default card with subtle shadow and border.</p>
          </Card>
          
          <Card variant="elevated" style={{ width: '200px' }}>
            <h4>Elevated Card</h4>
            <p>This is an elevated card with more prominent shadow.</p>
          </Card>
          
          <Card variant="outlined" style={{ width: '200px' }}>
            <h4>Outlined Card</h4>
            <p>This is an outlined card with border and no shadow.</p>
          </Card>
        </div>
      </section>

      {/* Padding Demo */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#586069' }}>Padding Sizes</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Card padding="sm" style={{ width: '180px' }}>
            <h4>Small Padding</h4>
            <p>16px padding</p>
          </Card>
          
          <Card padding="md" style={{ width: '180px' }}>
            <h4>Medium Padding</h4>
            <p>24px padding (default)</p>
          </Card>
          
          <Card padding="lg" style={{ width: '180px' }}>
            <h4>Large Padding</h4>
            <p>32px padding</p>
          </Card>
        </div>
      </section>

      {/* Interactive Demo */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#586069' }}>Interactive Cards</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Card 
            interactive 
            onClick={() => alert('Default interactive card clicked!')}
            style={{ width: '200px' }}
          >
            <h4>Interactive Default</h4>
            <p>Click me! I have hover effects and am keyboard accessible.</p>
          </Card>
          
          <Card 
            variant="elevated"
            interactive 
            onClick={() => alert('Elevated interactive card clicked!')}
            style={{ width: '200px' }}
          >
            <h4>Interactive Elevated</h4>
            <p>I lift up on hover with enhanced shadow.</p>
          </Card>
          
          <Card 
            variant="outlined"
            interactive 
            onClick={() => alert('Outlined interactive card clicked!')}
            style={{ width: '200px' }}
          >
            <h4>Interactive Outlined</h4>
            <p>My border changes color on hover.</p>
          </Card>
        </div>
      </section>

      {/* Full Width Demo */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#586069' }}>Full Width Card</h3>
        <Card fullWidth padding="lg">
          <h4>Full Width Card</h4>
          <p>This card takes up the full width of its container. It's useful for content that needs to span the entire available space.</p>
        </Card>
      </section>

      {/* Complex Content Demo */}
      <section>
        <h3 style={{ marginBottom: '16px', color: '#586069' }}>Complex Content</h3>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <Card variant="elevated" interactive>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#5E6AD2',
                marginRight: '12px'
              }}></div>
              <div>
                <h4 style={{ margin: 0, color: '#24292e' }}>User Profile</h4>
                <p style={{ margin: 0, color: '#586069', fontSize: '14px' }}>@username</p>
              </div>
            </div>
            <p style={{ color: '#586069', lineHeight: '1.5' }}>
              This card contains complex content with multiple elements, 
              demonstrating how the Card component handles various layouts.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #e1e4e8'
            }}>
              <button style={{ 
                padding: '6px 12px', 
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}>
                Follow
              </button>
              <button style={{ 
                padding: '6px 12px', 
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}>
                Message
              </button>
            </div>
          </Card>

          <Card variant="default">
            <h4 style={{ color: '#24292e', marginTop: 0 }}>Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#5E6AD2' }}>1,234</div>
                <div style={{ fontSize: '14px', color: '#586069' }}>Views</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00C896' }}>567</div>
                <div style={{ fontSize: '14px', color: '#586069' }}>Likes</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CardDemo;