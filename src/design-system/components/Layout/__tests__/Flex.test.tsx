import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Flex from '../Flex';

describe('Flex Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Flex>Flex content</Flex>);
      const flex = screen.getByText('Flex content');
      expect(flex).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <Flex>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Flex>
      );
      
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Base Styles', () => {
    it('has display flex by default', () => {
      render(<Flex>Flex display</Flex>);
      const flex = screen.getByText('Flex display');
      expect(flex).toHaveStyle({ display: 'flex' });
    });

    it('has inline-flex when inline is true', () => {
      render(<Flex inline>Inline flex</Flex>);
      const flex = screen.getByText('Inline flex');
      expect(flex).toHaveStyle({ display: 'inline-flex' });
    });

    it('has flex class', () => {
      render(<Flex>Flex class</Flex>);
      const flex = screen.getByText('Flex class');
      expect(flex).toHaveClass('flex');
    });
  });

  describe('Direction', () => {
    it('applies default direction (row)', () => {
      render(<Flex>Default direction</Flex>);
      const flex = screen.getByText('Default direction');
      expect(flex).toHaveStyle({ flexDirection: 'row' });
    });

    it('applies column direction', () => {
      render(<Flex direction="column">Column direction</Flex>);
      const flex = screen.getByText('Column direction');
      expect(flex).toHaveStyle({ flexDirection: 'column' });
    });

    it('applies row-reverse direction', () => {
      render(<Flex direction="row-reverse">Row reverse</Flex>);
      const flex = screen.getByText('Row reverse');
      expect(flex).toHaveStyle({ flexDirection: 'row-reverse' });
    });

    it('applies column-reverse direction', () => {
      render(<Flex direction="column-reverse">Column reverse</Flex>);
      const flex = screen.getByText('Column reverse');
      expect(flex).toHaveStyle({ flexDirection: 'column-reverse' });
    });
  });

  describe('Alignment', () => {
    it('applies default align (stretch)', () => {
      render(<Flex>Default align</Flex>);
      const flex = screen.getByText('Default align');
      expect(flex).toHaveStyle({ alignItems: 'stretch' });
    });

    it('applies start alignment', () => {
      render(<Flex align="start">Start align</Flex>);
      const flex = screen.getByText('Start align');
      expect(flex).toHaveStyle({ alignItems: 'flex-start' });
    });

    it('applies center alignment', () => {
      render(<Flex align="center">Center align</Flex>);
      const flex = screen.getByText('Center align');
      expect(flex).toHaveStyle({ alignItems: 'center' });
    });

    it('applies end alignment', () => {
      render(<Flex align="end">End align</Flex>);
      const flex = screen.getByText('End align');
      expect(flex).toHaveStyle({ alignItems: 'flex-end' });
    });

    it('applies baseline alignment', () => {
      render(<Flex align="baseline">Baseline align</Flex>);
      const flex = screen.getByText('Baseline align');
      expect(flex).toHaveStyle({ alignItems: 'baseline' });
    });
  });

  describe('Justify Content', () => {
    it('applies default justify (start)', () => {
      render(<Flex>Default justify</Flex>);
      const flex = screen.getByText('Default justify');
      expect(flex).toHaveStyle({ justifyContent: 'flex-start' });
    });

    it('applies start justify', () => {
      render(<Flex justify="start">Start justify</Flex>);
      const flex = screen.getByText('Start justify');
      expect(flex).toHaveStyle({ justifyContent: 'flex-start' });
    });

    it('applies center justify', () => {
      render(<Flex justify="center">Center justify</Flex>);
      const flex = screen.getByText('Center justify');
      expect(flex).toHaveStyle({ justifyContent: 'center' });
    });

    it('applies end justify', () => {
      render(<Flex justify="end">End justify</Flex>);
      const flex = screen.getByText('End justify');
      expect(flex).toHaveStyle({ justifyContent: 'flex-end' });
    });

    it('applies space-between justify', () => {
      render(<Flex justify="space-between">Space between</Flex>);
      const flex = screen.getByText('Space between');
      expect(flex).toHaveStyle({ justifyContent: 'space-between' });
    });

    it('applies space-around justify', () => {
      render(<Flex justify="space-around">Space around</Flex>);
      const flex = screen.getByText('Space around');
      expect(flex).toHaveStyle({ justifyContent: 'space-around' });
    });

    it('applies space-evenly justify', () => {
      render(<Flex justify="space-evenly">Space evenly</Flex>);
      const flex = screen.getByText('Space evenly');
      expect(flex).toHaveStyle({ justifyContent: 'space-evenly' });
    });
  });

  describe('Wrap', () => {
    it('applies default wrap (nowrap)', () => {
      render(<Flex>Default wrap</Flex>);
      const flex = screen.getByText('Default wrap');
      expect(flex).toHaveStyle({ flexWrap: 'nowrap' });
    });

    it('applies wrap', () => {
      render(<Flex wrap="wrap">Wrap</Flex>);
      const flex = screen.getByText('Wrap');
      expect(flex).toHaveStyle({ flexWrap: 'wrap' });
    });

    it('applies wrap-reverse', () => {
      render(<Flex wrap="wrap-reverse">Wrap reverse</Flex>);
      const flex = screen.getByText('Wrap reverse');
      expect(flex).toHaveStyle({ flexWrap: 'wrap-reverse' });
    });
  });

  describe('Gap', () => {
    it('does not apply gap by default', () => {
      render(<Flex>No gap</Flex>);
      const flex = screen.getByText('No gap');
      expect(flex).not.toHaveStyle({ gap: expect.anything() });
    });

    it('applies custom gap', () => {
      render(<Flex gap={4}>Custom gap</Flex>);
      const flex = screen.getByText('Custom gap');
      expect(flex).toHaveStyle({ gap: '16px' });
    });
  });

  describe('Flex Properties', () => {
    it('applies flex-grow', () => {
      render(<Flex grow={1}>Flex grow</Flex>);
      const flex = screen.getByText('Flex grow');
      expect(flex).toHaveStyle({ flexGrow: 1 });
    });

    it('applies flex-shrink', () => {
      render(<Flex shrink={0}>Flex shrink</Flex>);
      const flex = screen.getByText('Flex shrink');
      expect(flex).toHaveStyle({ flexShrink: 0 });
    });

    it('applies flex-basis with string value', () => {
      render(<Flex basis="200px">Flex basis string</Flex>);
      const flex = screen.getByText('Flex basis string');
      expect(flex).toHaveStyle({ flexBasis: '200px' });
    });

    it('applies flex-basis with number value', () => {
      render(<Flex basis={200}>Flex basis number</Flex>);
      const flex = screen.getByText('Flex basis number');
      expect(flex).toHaveStyle({ flexBasis: 200 });
    });

    it('applies multiple flex properties', () => {
      render(<Flex grow={1} shrink={0} basis="auto">Multiple flex props</Flex>);
      const flex = screen.getByText('Multiple flex props');
      expect(flex).toHaveStyle({ 
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 'auto'
      });
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Flex ref={ref}>Ref flex</Flex>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByText('Ref flex'));
    });

    it('applies custom className', () => {
      render(<Flex className="custom-class">Custom class</Flex>);
      const flex = screen.getByText('Custom class');
      expect(flex).toHaveClass('flex', 'custom-class');
    });

    it('applies custom styles', () => {
      render(
        <Flex style={{ backgroundColor: 'green', color: 'white' }}>
          Custom styles
        </Flex>
      );
      const flex = screen.getByText('Custom styles');
      // Check that custom styles are applied via style attribute
      expect(flex.style.backgroundColor).toBe('green');
      expect(flex.style.color).toBe('white');
    });

    it('spreads additional props', () => {
      render(<Flex data-testid="custom-flex" title="Custom Title">Custom props</Flex>);
      const flex = screen.getByText('Custom props');
      expect(flex).toHaveAttribute('data-testid', 'custom-flex');
      expect(flex).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Complex Layouts', () => {
    it('handles complex flex layout', () => {
      render(
        <Flex 
          direction="column" 
          align="center" 
          justify="space-between" 
          wrap="wrap"
          gap={4}
          grow={1}
        >
          Complex layout
        </Flex>
      );
      
      const flex = screen.getByText('Complex layout');
      expect(flex).toHaveStyle({
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        flexGrow: 1
      });
    });
  });
});