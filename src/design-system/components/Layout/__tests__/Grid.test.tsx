import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Grid from '../Grid';

describe('Grid Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Grid>Grid content</Grid>);
      const grid = screen.getByText('Grid content');
      expect(grid).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <Grid>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Grid>
      );
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Base Styles', () => {
    it('has display grid', () => {
      render(<Grid>Grid display</Grid>);
      const grid = screen.getByText('Grid display');
      expect(grid).toHaveStyle({ display: 'grid' });
    });

    it('has grid class', () => {
      render(<Grid>Grid class</Grid>);
      const grid = screen.getByText('Grid class');
      expect(grid).toHaveClass('grid');
    });
  });

  describe('Columns', () => {
    it('applies default columns (12)', () => {
      render(<Grid>Default columns</Grid>);
      const grid = screen.getByText('Default columns');
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(12, 1fr)' });
    });

    it('applies custom column count', () => {
      render(<Grid columns={6}>Six columns</Grid>);
      const grid = screen.getByText('Six columns');
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(6, 1fr)' });
    });

    it('applies responsive columns with CSS variables', () => {
      render(<Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>Responsive columns</Grid>);
      const grid = screen.getByText('Responsive columns');
      
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(var(--grid-columns), 1fr)' });
      
      const computedStyle = getComputedStyle(grid);
      expect(computedStyle.getPropertyValue('--grid-columns-mobile')).toBe('1');
      expect(computedStyle.getPropertyValue('--grid-columns-tablet')).toBe('2');
      expect(computedStyle.getPropertyValue('--grid-columns-desktop')).toBe('3');
    });
  });

  describe('Auto Fit', () => {
    it('uses auto-fit with default min column width', () => {
      render(<Grid autoFit>Auto fit</Grid>);
      const grid = screen.getByText('Auto fit');
      expect(grid).toHaveStyle({ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
      });
    });

    it('uses auto-fit with custom min column width', () => {
      render(<Grid autoFit minColumnWidth="300px">Custom min width</Grid>);
      const grid = screen.getByText('Custom min width');
      expect(grid).toHaveStyle({ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
      });
    });
  });

  describe('Gap', () => {
    it('applies default gap', () => {
      render(<Grid>Default gap</Grid>);
      const grid = screen.getByText('Default gap');
      expect(grid).toHaveStyle({ gap: '16px' });
    });

    it('applies custom gap', () => {
      render(<Grid gap={6}>Custom gap</Grid>);
      const grid = screen.getByText('Custom gap');
      expect(grid).toHaveStyle({ gap: '24px' });
    });

    it('applies responsive gap with CSS variables', () => {
      render(<Grid gap={{ mobile: 2, tablet: 4, desktop: 6 }}>Responsive gap</Grid>);
      const grid = screen.getByText('Responsive gap');
      
      expect(grid).toHaveStyle({ gap: 'var(--grid-gap)' });
      
      const computedStyle = getComputedStyle(grid);
      expect(computedStyle.getPropertyValue('--grid-gap-mobile')).toBe('8px');
      expect(computedStyle.getPropertyValue('--grid-gap-tablet')).toBe('16px');
      expect(computedStyle.getPropertyValue('--grid-gap-desktop')).toBe('24px');
    });

    it('applies separate row and column gaps', () => {
      render(<Grid rowGap={2} columnGap={4}>Separate gaps</Grid>);
      const grid = screen.getByText('Separate gaps');
      expect(grid).toHaveStyle({ 
        rowGap: '8px',
        columnGap: '16px'
      });
      expect(grid).not.toHaveStyle({ gap: expect.anything() });
    });
  });

  describe('Alignment', () => {
    it('applies default align items (stretch)', () => {
      render(<Grid>Default align</Grid>);
      const grid = screen.getByText('Default align');
      expect(grid).toHaveStyle({ alignItems: 'stretch' });
    });

    it('applies custom align items', () => {
      render(<Grid alignItems="center">Center align</Grid>);
      const grid = screen.getByText('Center align');
      expect(grid).toHaveStyle({ alignItems: 'center' });
    });

    it('applies default justify content (start)', () => {
      render(<Grid>Default justify</Grid>);
      const grid = screen.getByText('Default justify');
      expect(grid).toHaveStyle({ justifyContent: 'start' });
    });

    it('applies custom justify content', () => {
      render(<Grid justifyContent="center">Center justify</Grid>);
      const grid = screen.getByText('Center justify');
      expect(grid).toHaveStyle({ justifyContent: 'center' });
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Grid ref={ref}>Ref grid</Grid>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByText('Ref grid'));
    });

    it('applies custom className', () => {
      render(<Grid className="custom-class">Custom class</Grid>);
      const grid = screen.getByText('Custom class');
      expect(grid).toHaveClass('grid', 'custom-class');
    });

    it('applies custom styles', () => {
      render(
        <Grid style={{ backgroundColor: 'blue', color: 'white' }}>
          Custom styles
        </Grid>
      );
      const grid = screen.getByText('Custom styles');
      // Check that custom styles are applied via style attribute
      expect(grid.style.backgroundColor).toBe('blue');
      expect(grid.style.color).toBe('white');
    });

    it('spreads additional props', () => {
      render(<Grid data-testid="custom-grid" title="Custom Title">Custom props</Grid>);
      const grid = screen.getByText('Custom props');
      expect(grid).toHaveAttribute('data-testid', 'custom-grid');
      expect(grid).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles partial responsive column configuration', () => {
      render(<Grid columns={{ mobile: 1, desktop: 4 }}>Partial responsive</Grid>);
      const grid = screen.getByText('Partial responsive');
      
      const computedStyle = getComputedStyle(grid);
      expect(computedStyle.getPropertyValue('--grid-columns-mobile')).toBe('1');
      expect(computedStyle.getPropertyValue('--grid-columns-tablet')).toBe('1'); // Falls back to mobile
      expect(computedStyle.getPropertyValue('--grid-columns-desktop')).toBe('4');
    });

    it('handles partial responsive gap configuration', () => {
      render(<Grid gap={{ mobile: 2, desktop: 8 }}>Partial gap responsive</Grid>);
      const grid = screen.getByText('Partial gap responsive');
      
      const computedStyle = getComputedStyle(grid);
      expect(computedStyle.getPropertyValue('--grid-gap-mobile')).toBe('8px');
      expect(computedStyle.getPropertyValue('--grid-gap-tablet')).toBe('8px'); // Falls back to mobile
      expect(computedStyle.getPropertyValue('--grid-gap-desktop')).toBe('32px');
    });
  });
});