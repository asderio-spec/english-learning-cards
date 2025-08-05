import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    input: React.forwardRef<HTMLInputElement, any>(({ children, whileFocus, ...props }, ref) => (
      <input ref={ref} {...props} />
    ))
  }
}));

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with custom type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password type', () => {
      render(<Input type="password" />);
      const input = screen.getByDisplayValue('');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders with label', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      expect(label).toBeInTheDocument();
      expect(input).toHaveAccessibleName('Username');
    });

    it('renders with helper text', () => {
      render(<Input helperText="Enter your username" />);
      const helperText = screen.getByText('Enter your username');
      expect(helperText).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Input error errorMessage="This field is required" />);
      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });

    it('prioritizes error message over helper text', () => {
      render(
        <Input 
          error 
          helperText="Helper text" 
          errorMessage="Error message" 
        />
      );
      
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('renders medium size by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({
        height: '40px',
        fontSize: '14px'
      });
    });

    it('renders small size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({
        height: '32px',
        fontSize: '12px'
      });
    });

    it('renders large size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({
        height: '48px',
        fontSize: '16px'
      });
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveStyle({
        backgroundColor: '#F6F8FA',
        cursor: 'not-allowed'
      });
    });

    it('handles error state', () => {
      render(<Input error />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveStyle({
        borderColor: '#FF5C5C'
      });
    });

    it('handles focus state', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await userEvent.click(input);
      expect(input).toHaveFocus();
    });

    it('calls onFocus and onBlur handlers', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      
      await userEvent.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      await userEvent.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icons', () => {
    it('renders with left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('renders with right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✉️</span>} />);
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('adjusts padding when icons are present', () => {
      render(<Input leftIcon={<span>🔍</span>} rightIcon={<span>✉️</span>} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveStyle({
        padding: '0 40px'
      });
    });
  });

  describe('Password Type', () => {
    it('renders password toggle button', () => {
      render(<Input type="password" />);
      const toggleButton = screen.getByRole('button', { name: 'Show password' });
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility on click', async () => {
      render(<Input type="password" />);
      const input = screen.getByDisplayValue('');
      const toggleButton = screen.getByRole('button', { name: 'Show password' });
      
      expect(input).toHaveAttribute('type', 'password');
      
      await userEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
      
      await userEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility with keyboard', async () => {
      render(<Input type="password" />);
      const input = screen.getByDisplayValue('');
      const toggleButton = screen.getByRole('button', { name: 'Show password' });
      
      toggleButton.focus();
      await userEvent.keyboard('{Enter}');
      expect(input).toHaveAttribute('type', 'text');
      
      await userEvent.keyboard(' ');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('Layout', () => {
    it('renders with auto width by default', () => {
      render(<Input />);
      const container = screen.getByRole('textbox').closest('div')?.parentElement;
      expect(container).toHaveStyle({ width: 'auto' });
    });

    it('renders with full width', () => {
      render(<Input fullWidth />);
      const container = screen.getByRole('textbox').closest('div')?.parentElement;
      expect(container).toHaveStyle({ width: '100%' });
    });
  });

  describe('Accessibility', () => {
    it('generates unique IDs', () => {
      render(
        <>
          <Input label="First" />
          <Input label="Second" />
        </>
      );
      
      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0]).toHaveAttribute('id');
      expect(inputs[1]).toHaveAttribute('id');
      expect(inputs[0].getAttribute('id')).not.toBe(inputs[1].getAttribute('id'));
    });

    it('uses provided ID', () => {
      render(<Input id="custom-id" label="Custom" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('associates label with input', () => {
      render(<Input id="test-input" label="Test Label" />);
      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('associates helper text with input', () => {
      render(<Input helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      const helperText = screen.getByText('Helper text');
      
      expect(input).toHaveAttribute('aria-describedby');
      expect(helperText).toHaveAttribute('id');
      expect(input.getAttribute('aria-describedby')).toContain(helperText.getAttribute('id'));
    });

    it('associates error message with input', () => {
      render(<Input error errorMessage="Error message" />);
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Error message');
      
      expect(input).toHaveAttribute('aria-describedby');
      expect(errorMessage).toHaveAttribute('id');
      expect(input.getAttribute('aria-describedby')).toContain(errorMessage.getAttribute('id'));
    });

    it('combines multiple aria-describedby values', () => {
      render(
        <Input 
          aria-describedby="external-description"
          helperText="Helper text"
        />
      );
      
      const input = screen.getByRole('textbox');
      const describedBy = input.getAttribute('aria-describedby');
      
      expect(describedBy).toContain('external-description');
      expect(describedBy).toContain('helper');
    });

    it('has proper ARIA attributes for error state', () => {
      render(<Input error errorMessage="Error message" />);
      const input = screen.getByRole('textbox');
      const errorMessage = screen.getByText('Error message');
      
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(errorMessage).toHaveAttribute('role', 'alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Custom Props', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toBe(screen.getByRole('textbox'));
    });

    it('applies custom className to input', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });

    it('applies custom className to container', () => {
      render(<Input containerClassName="custom-container" />);
      const container = screen.getByRole('textbox').closest('div')?.parentElement;
      expect(container).toHaveClass('custom-container');
    });

    it('applies custom className to label', () => {
      render(<Input label="Test" labelClassName="custom-label" />);
      const label = screen.getByText('Test');
      expect(label).toHaveClass('custom-label');
    });

    it('applies custom className to helper text', () => {
      render(<Input helperText="Helper" helperClassName="custom-helper" />);
      const helper = screen.getByText('Helper');
      expect(helper).toHaveClass('custom-helper');
    });

    it('spreads additional props to input', () => {
      render(<Input data-testid="custom-input" placeholder="Enter text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-testid', 'custom-input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });
  });

  describe('Input Types', () => {
    it('renders email input', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders search input', () => {
      render(<Input type="search" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('renders number input', () => {
      render(<Input type="number" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders tel input', () => {
      render(<Input type="tel" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('renders url input', () => {
      render(<Input type="url" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('User Interactions', () => {
    it('handles text input', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await userEvent.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      await userEvent.type(input, 'test');
      expect(handleChange).toHaveBeenCalledTimes(4); // Once for each character
    });

    it('handles controlled input', () => {
      const { rerender } = render(<Input value="initial" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');
      
      rerender(<Input value="updated" onChange={() => {}} />);
      expect(input).toHaveValue('updated');
    });
  });
});