import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: React.forwardRef<HTMLButtonElement, any>(({ children, whileHover, whileTap, transition, animate, ...props }, ref) => (
      <button ref={ref} {...props}>
        {children}
      </button>
    )),
    div: React.forwardRef<HTMLDivElement, any>(({ children, animate, transition, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    ))
  }
}));

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('renders with custom type', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('renders with aria-label', () => {
      render(<Button aria-label="Custom label">Click</Button>);
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toBeInTheDocument();
    });

    it('renders with aria-describedby', () => {
      render(
        <>
          <Button aria-describedby="description">Click</Button>
          <div id="description">Button description</div>
        </>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        backgroundColor: '#5E6AD2',
        color: '#FFFFFF'
      });
    });

    it('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        backgroundColor: '#00D2FF',
        color: '#FFFFFF'
      });
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      // Check that the button renders without throwing errors
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Ghost');
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        minHeight: '40px',
        fontSize: '14px'
      });
    });

    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        minHeight: '32px',
        fontSize: '12px'
      });
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        minHeight: '48px',
        fontSize: '16px'
      });
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveStyle({ opacity: '0.6' });
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles loading state', () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      
      // Check for loading spinner
      const spinner = button.querySelector('div');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveStyle({
        width: '16px',
        height: '16px',
        border: '2px solid currentColor'
      });
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('shows loading spinner and hides icons when loading', () => {
      render(
        <Button loading icon={<span data-testid="icon">Icon</span>}>
          Loading
        </Button>
      );
      
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
      expect(screen.getByRole('button').querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('renders with left icon', () => {
      render(
        <Button icon={<span data-testid="left-icon">←</span>}>
          With Icon
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(
        <Button iconRight={<span data-testid="right-icon">→</span>}>
          With Icon
        </Button>
      );
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('renders with both icons', () => {
      render(
        <Button 
          icon={<span data-testid="left-icon">←</span>}
          iconRight={<span data-testid="right-icon">→</span>}
        >
          Both Icons
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('renders with full width', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: '100%' });
    });

    it('renders with auto width by default', () => {
      render(<Button>Auto Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ width: 'auto' });
    });
  });

  describe('Interactions', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Enter key press', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Press Enter</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles Space key press', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Press Space</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not handle other key presses', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Other Keys</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Escape}');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents click when disabled', async () => {
      const handleClick = vi.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('prevents click when loading', async () => {
      const handleClick = vi.fn();
      render(<Button loading onClick={handleClick}>Loading</Button>);
      
      const button = screen.getByRole('button');
      await userEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('is focusable by default', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    it('is not focusable when disabled', () => {
      render(<Button disabled>Not Focusable</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toBeDisabled();
    });

    it('has proper ARIA attributes', () => {
      render(
        <Button 
          aria-label="Custom button"
          aria-describedby="button-description"
        >
          ARIA Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
      expect(button).toHaveAttribute('aria-describedby', 'button-description');
    });

    it('has proper disabled ARIA state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('has proper loading ARIA state', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toBe(screen.getByRole('button'));
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Custom Class</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('spreads additional props', () => {
      render(<Button data-testid="custom-button" title="Custom Title">Custom Props</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Style Consistency', () => {
    it('maintains consistent font family', () => {
      render(<Button>Font Test</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
      });
    });

    it('has proper border radius', () => {
      render(<Button>Border Radius</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ borderRadius: '8px' });
    });

    it('has proper cursor styles', () => {
      render(<Button>Cursor</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'pointer' });
    });

    it('has disabled cursor when disabled', () => {
      render(<Button disabled>Disabled Cursor</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'not-allowed' });
    });

    it('has loading cursor when loading', () => {
      render(<Button loading>Loading Cursor</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ cursor: 'not-allowed' });
    });
  });
});