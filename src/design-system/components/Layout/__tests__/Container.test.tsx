import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Container from '../Container';

describe('Container Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Container>Container content</Container>);
      const container = screen.getByText('Container content');
      expect(container).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <Container>
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>
      );
      
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('Max Width', () => {
    it('applies default max width (lg)', () => {
      render(<Container>Default max width</Container>);
      const container = screen.getByText('Default max width');
      expect(container).toHaveStyle({ maxWidth: '1024px' });
    });

    it('applies small max width', () => {
      render(<Container maxWidth="sm">Small max width</Container>);
      const container = screen.getByText('Small max width');
      expect(container).toHaveStyle({ maxWidth: '640px' });
    });

    it('applies medium max width', () => {
      render(<Container maxWidth="md">Medium max width</Container>);
      const container = screen.getByText('Medium max width');
      expect(container).toHaveStyle({ maxWidth: '768px' });
    });

    it('applies large max width', () => {
      render(<Container maxWidth="lg">Large max width</Container>);
      const container = screen.getByText('Large max width');
      expect(container).toHaveStyle({ maxWidth: '1024px' });
    });

    it('applies extra large max width', () => {
      render(<Container maxWidth="xl">XL max width</Container>);
      const container = screen.getByText('XL max width');
      expect(container).toHaveStyle({ maxWidth: '1280px' });
    });

    it('applies 2xl max width', () => {
      render(<Container maxWidth="2xl">2XL max width</Container>);
      const container = screen.getByText('2XL max width');
      expect(container).toHaveStyle({ maxWidth: '1536px' });
    });

    it('applies no max width', () => {
      render(<Container maxWidth="none">No max width</Container>);
      const container = screen.getByText('No max width');
      expect(container).toHaveStyle({ maxWidth: 'none' });
    });
  });

  describe('Centering', () => {
    it('centers by default', () => {
      render(<Container>Centered</Container>);
      const container = screen.getByText('Centered');
      expect(container).toHaveStyle({ margin: '0 auto' });
    });

    it('does not center when centered is false', () => {
      render(<Container centered={false}>Not centered</Container>);
      const container = screen.getByText('Not centered');
      expect(container).toHaveStyle({ margin: '0' });
    });
  });

  describe('Padding', () => {
    it('applies padding by default', () => {
      render(<Container>With padding</Container>);
      const container = screen.getByText('With padding');
      expect(container).toHaveStyle({ padding: '0 16px' });
    });

    it('does not apply padding when padding is false', () => {
      render(<Container padding={false}>No padding</Container>);
      const container = screen.getByText('No padding');
      expect(container).toHaveStyle({ padding: '0' });
    });

    it('applies non-responsive padding', () => {
      render(<Container responsivePadding={false}>Non-responsive</Container>);
      const container = screen.getByText('Non-responsive');
      expect(container).toHaveStyle({ padding: '0 24px' });
    });
  });

  describe('Full Height', () => {
    it('does not use full height by default', () => {
      render(<Container>Normal height</Container>);
      const container = screen.getByText('Normal height');
      expect(container).toHaveStyle({ 
        height: 'auto',
        minHeight: 'auto'
      });
    });

    it('uses full height when fullHeight is true', () => {
      render(<Container fullHeight>Full height</Container>);
      const container = screen.getByText('Full height');
      expect(container).toHaveStyle({ 
        height: '100%',
        minHeight: '100vh'
      });
    });
  });

  describe('Base Styles', () => {
    it('has full width', () => {
      render(<Container>Full width</Container>);
      const container = screen.getByText('Full width');
      expect(container).toHaveStyle({ width: '100%' });
    });

    it('has container class', () => {
      render(<Container>Container class</Container>);
      const container = screen.getByText('Container class');
      expect(container).toHaveClass('container');
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Container ref={ref}>Ref container</Container>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByText('Ref container'));
    });

    it('applies custom className', () => {
      render(<Container className="custom-class">Custom class</Container>);
      const container = screen.getByText('Custom class');
      expect(container).toHaveClass('container', 'custom-class');
    });

    it('applies custom styles', () => {
      render(
        <Container style={{ backgroundColor: 'red', color: 'white' }}>
          Custom styles
        </Container>
      );
      const container = screen.getByText('Custom styles');
      // Check that custom styles are applied via style attribute
      expect(container.style.backgroundColor).toBe('red');
      expect(container.style.color).toBe('white');
    });

    it('spreads additional props', () => {
      render(<Container data-testid="custom-container" title="Custom Title">Custom props</Container>);
      const container = screen.getByText('Custom props');
      expect(container).toHaveAttribute('data-testid', 'custom-container');
      expect(container).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Responsive Padding', () => {
    it('sets CSS variables for responsive padding', () => {
      render(<Container responsivePadding>Responsive padding</Container>);
      const container = screen.getByText('Responsive padding');
      
      const computedStyle = getComputedStyle(container);
      expect(computedStyle.getPropertyValue('--container-padding-mobile')).toBe('16px');
      expect(computedStyle.getPropertyValue('--container-padding-tablet')).toBe('24px');
      expect(computedStyle.getPropertyValue('--container-padding-desktop')).toBe('32px');
    });

    it('does not set CSS variables when responsive padding is disabled', () => {
      render(<Container responsivePadding={false}>No responsive padding</Container>);
      const container = screen.getByText('No responsive padding');
      
      const computedStyle = getComputedStyle(container);
      expect(computedStyle.getPropertyValue('--container-padding-mobile')).toBe('');
      expect(computedStyle.getPropertyValue('--container-padding-tablet')).toBe('');
      expect(computedStyle.getPropertyValue('--container-padding-desktop')).toBe('');
    });
  });
});