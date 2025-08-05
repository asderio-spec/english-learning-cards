import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Card from '../Card';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, whileHover, whileTap, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ))
  }
}));

describe('Card Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
    });

    it('renders with custom role', () => {
      render(<Card role="article">Article card</Card>);
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Card aria-label="Custom card">Content</Card>);
      const card = screen.getByLabelText('Custom card');
      expect(card).toBeInTheDocument();
    });

    it('renders with aria-describedby', () => {
      render(
        <>
          <Card aria-describedby="description">Card</Card>
          <div id="description">Card description</div>
        </>
      );
      const card = screen.getByText('Card');
      expect(card).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Variants', () => {
    it('renders default variant by default', () => {
      render(<Card>Default card</Card>);
      const card = screen.getByText('Default card');
      expect(card).toHaveStyle({
        backgroundColor: '#FFFFFF',
        border: '1px solid #E1E4E8'
      });
    });

    it('renders elevated variant', () => {
      render(<Card variant="elevated">Elevated card</Card>);
      const card = screen.getByText('Elevated card');
      expect(card).toHaveStyle({
        backgroundColor: '#FFFFFF',
        border: 'none'
      });
    });

    it('renders outlined variant', () => {
      render(<Card variant="outlined">Outlined card</Card>);
      const card = screen.getByText('Outlined card');
      expect(card).toHaveStyle({
        backgroundColor: '#FFFFFF',
        border: '2px solid #D1D5DA',
        boxShadow: 'none'
      });
    });
  });

  describe('Padding', () => {
    it('renders medium padding by default', () => {
      render(<Card>Medium padding</Card>);
      const card = screen.getByText('Medium padding');
      expect(card).toHaveStyle({
        padding: '24px'
      });
    });

    it('renders small padding', () => {
      render(<Card padding="sm">Small padding</Card>);
      const card = screen.getByText('Small padding');
      expect(card).toHaveStyle({
        padding: '16px'
      });
    });

    it('renders large padding', () => {
      render(<Card padding="lg">Large padding</Card>);
      const card = screen.getByText('Large padding');
      expect(card).toHaveStyle({
        padding: '32px'
      });
    });
  });

  describe('Interactive State', () => {
    it('is not interactive by default', () => {
      render(<Card>Non-interactive</Card>);
      const card = screen.getByText('Non-interactive');
      expect(card).not.toHaveAttribute('role', 'button');
      expect(card).not.toHaveAttribute('tabIndex');
      expect(card).not.toHaveStyle({ cursor: 'pointer' });
    });

    it('becomes interactive when interactive prop is true', () => {
      render(<Card interactive>Interactive card</Card>);
      const card = screen.getByText('Interactive card');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('uses custom role when interactive and role is provided', () => {
      render(<Card interactive role="link">Custom role</Card>);
      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
    });

    it('handles click events when interactive', async () => {
      const handleClick = vi.fn();
      render(<Card interactive onClick={handleClick}>Clickable</Card>);
      
      const card = screen.getByText('Clickable');
      await userEvent.click(card);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle click events when not interactive', async () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Not clickable</Card>);
      
      const card = screen.getByText('Not clickable');
      await userEvent.click(card);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles Enter key press when interactive', async () => {
      const handleClick = vi.fn();
      render(<Card interactive onClick={handleClick}>Press Enter</Card>);
      
      const card = screen.getByText('Press Enter');
      card.focus();
      await userEvent.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press when interactive', async () => {
      const handleClick = vi.fn();
      render(<Card interactive onClick={handleClick}>Press Space</Card>);
      
      const card = screen.getByText('Press Space');
      card.focus();
      await userEvent.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle other key presses', async () => {
      const handleClick = vi.fn();
      render(<Card interactive onClick={handleClick}>Other keys</Card>);
      
      const card = screen.getByText('Other keys');
      card.focus();
      await userEvent.keyboard('{Escape}');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls custom onKeyDown handler', async () => {
      const handleKeyDown = vi.fn();
      render(<Card interactive onKeyDown={handleKeyDown}>Key handler</Card>);
      
      const card = screen.getByText('Key handler');
      card.focus();
      await userEvent.keyboard('{Tab}');
      
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('Layout', () => {
    it('renders with auto width by default', () => {
      render(<Card>Auto width</Card>);
      const card = screen.getByText('Auto width');
      expect(card).toHaveStyle({ width: 'auto' });
    });

    it('renders with full width', () => {
      render(<Card fullWidth>Full width</Card>);
      const card = screen.getByText('Full width');
      expect(card).toHaveStyle({ width: '100%' });
    });

    it('has minimum height', () => {
      render(<Card>Min height</Card>);
      const card = screen.getByText('Min height');
      expect(card).toHaveStyle({ minHeight: '120px' });
    });

    it('has border radius', () => {
      render(<Card>Border radius</Card>);
      const card = screen.getByText('Border radius');
      expect(card).toHaveStyle({ borderRadius: '12px' });
    });

    it('has overflow hidden', () => {
      render(<Card>Overflow</Card>);
      const card = screen.getByText('Overflow');
      expect(card).toHaveStyle({ overflow: 'hidden' });
    });
  });

  describe('Accessibility', () => {
    it('is focusable when interactive', () => {
      render(<Card interactive>Focusable</Card>);
      const card = screen.getByText('Focusable');
      
      card.focus();
      expect(card).toHaveFocus();
    });

    it('is not focusable when not interactive', () => {
      render(<Card>Not focusable</Card>);
      const card = screen.getByText('Not focusable');
      
      expect(card).not.toHaveAttribute('tabIndex');
    });

    it('has proper ARIA attributes', () => {
      render(
        <Card 
          interactive
          aria-label="Custom card"
          aria-describedby="card-description"
        >
          ARIA Card
        </Card>
      );
      
      const card = screen.getByText('ARIA Card');
      expect(card).toHaveAttribute('aria-label', 'Custom card');
      expect(card).toHaveAttribute('aria-describedby', 'card-description');
    });

    it('has button role when interactive without custom role', () => {
      render(<Card interactive>Button role</Card>);
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('respects custom role when provided', () => {
      render(<Card interactive role="article">Custom role</Card>);
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Ref card</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toBe(screen.getByText('Ref card'));
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Custom class</Card>);
      const card = screen.getByText('Custom class');
      expect(card).toHaveClass('custom-class');
    });

    it('spreads additional props', () => {
      render(<Card data-testid="custom-card" title="Custom Title">Custom props</Card>);
      const card = screen.getByText('Custom props');
      expect(card).toHaveAttribute('data-testid', 'custom-card');
      expect(card).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Style Consistency', () => {
    it('has relative positioning', () => {
      render(<Card>Position</Card>);
      const card = screen.getByText('Position');
      expect(card).toHaveStyle({ position: 'relative' });
    });

    it('maintains consistent border radius across variants', () => {
      const { rerender } = render(<Card variant="default">Default</Card>);
      let card = screen.getByText('Default');
      expect(card).toHaveStyle({ borderRadius: '12px' });

      rerender(<Card variant="elevated">Elevated</Card>);
      card = screen.getByText('Elevated');
      expect(card).toHaveStyle({ borderRadius: '12px' });

      rerender(<Card variant="outlined">Outlined</Card>);
      card = screen.getByText('Outlined');
      expect(card).toHaveStyle({ borderRadius: '12px' });
    });

    it('maintains consistent background color across variants', () => {
      const { rerender } = render(<Card variant="default">Default</Card>);
      let card = screen.getByText('Default');
      expect(card).toHaveStyle({ backgroundColor: '#FFFFFF' });

      rerender(<Card variant="elevated">Elevated</Card>);
      card = screen.getByText('Elevated');
      expect(card).toHaveStyle({ backgroundColor: '#FFFFFF' });

      rerender(<Card variant="outlined">Outlined</Card>);
      card = screen.getByText('Outlined');
      expect(card).toHaveStyle({ backgroundColor: '#FFFFFF' });
    });
  });

  describe('Content Rendering', () => {
    it('renders text content', () => {
      render(<Card>Simple text content</Card>);
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('renders complex JSX content', () => {
      render(
        <Card>
          <h3>Card Title</h3>
          <p>Card description</p>
          <button>Action</button>
        </Card>
      );
      
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toBeInTheDocument();
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <Card>
          <span>First child</span>
          <span>Second child</span>
        </Card>
      );
      
      expect(screen.getByText('First child')).toBeInTheDocument();
      expect(screen.getByText('Second child')).toBeInTheDocument();
    });
  });
});