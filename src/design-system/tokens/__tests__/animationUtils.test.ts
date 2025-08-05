/**
 * @jest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  useReducedMotion,
  getAnimationDuration,
  getMotionVariant,
  createTransition,
  createHoverAnimation,
  createFocusAnimation,
  createPressAnimation,
  calculateStaggerDelay,
  getSpringConfig,
  springConfig
} from '../animationUtils';
import { animations, motionVariants } from '../animations';

// Mock window.matchMedia
const mockMatchMedia = vi.fn();

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('animationUtils', () => {
  describe('useReducedMotion', () => {
    it('should return false when prefers-reduced-motion is not set', () => {
      mockMatchMedia.mockReturnValue({
        matches: false,
      });

      const result = useReducedMotion();
      expect(result).toBe(false);
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should return true when prefers-reduced-motion is reduce', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
      });

      const result = useReducedMotion();
      expect(result).toBe(true);
    });
  });

  describe('getAnimationDuration', () => {
    it('should return normal duration when reduced motion is not preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = getAnimationDuration('normal');
      expect(result).toBe(animations.duration.normal);
    });

    it('should return minimal duration when reduced motion is preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      
      const result = getAnimationDuration('normal');
      expect(result).toBe('0.01ms');
    });

    it('should respect respectReducedMotion parameter', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      
      const result = getAnimationDuration('normal', false);
      expect(result).toBe(animations.duration.normal);
    });
  });

  describe('getMotionVariant', () => {
    it('should return original variant when reduced motion is not preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = getMotionVariant('fadeIn');
      expect(result).toEqual(motionVariants.fadeIn);
    });

    it('should return modified variant with minimal duration when reduced motion is preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      
      const result = getMotionVariant('fadeIn');
      expect(result.transition.duration).toBe(0.001);
    });
  });

  describe('createTransition', () => {
    it('should create transition for single property', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createTransition('opacity');
      expect(result).toBe(`opacity ${animations.duration.normal} ${animations.easing.smooth} ${animations.duration.instant}`);
    });

    it('should create transition for multiple properties', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createTransition(['opacity', 'transform']);
      expect(result).toContain('opacity');
      expect(result).toContain('transform');
      expect(result).toContain(',');
    });

    it('should use custom duration and easing', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createTransition('opacity', 'fast', 'easeIn', 'slow');
      expect(result).toBe(`opacity ${animations.duration.fast} ${animations.easing.easeIn} ${animations.duration.slow}`);
    });
  });

  describe('createHoverAnimation', () => {
    it('should create hover animation with default scale', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createHoverAnimation();
      expect(result).toHaveProperty('transition');
      expect(result).toHaveProperty('&:hover');
      expect(result['&:hover'].transform).toBe(`scale(${animations.scale.lg})`);
    });

    it('should create hover animation with custom scale', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createHoverAnimation('1.2');
      expect(result['&:hover'].transform).toBe('scale(1.2)');
    });
  });

  describe('createFocusAnimation', () => {
    it('should create focus animation with outline', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createFocusAnimation();
      expect(result).toHaveProperty('transition');
      expect(result).toHaveProperty('&:focus-visible');
      expect(result['&:focus-visible'].outline).toBe('2px solid var(--color-primary-500)');
    });
  });

  describe('createPressAnimation', () => {
    it('should create press animation with default scale', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = createPressAnimation();
      expect(result).toHaveProperty('transition');
      expect(result).toHaveProperty('&:active');
      expect(result['&:active'].transform).toBe(`scale(${animations.scale.md})`);
    });
  });

  describe('calculateStaggerDelay', () => {
    it('should calculate stagger delay correctly', () => {
      expect(calculateStaggerDelay(0)).toBe(0);
      expect(calculateStaggerDelay(1)).toBe(0.1);
      expect(calculateStaggerDelay(2)).toBe(0.2);
    });

    it('should respect max delay', () => {
      expect(calculateStaggerDelay(20, 0.1, 1)).toBe(1);
    });

    it('should use custom base delay', () => {
      expect(calculateStaggerDelay(1, 0.2)).toBe(0.2);
    });
  });

  describe('getSpringConfig', () => {
    it('should return spring config when reduced motion is not preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: false });
      
      const result = getSpringConfig('gentle');
      expect(result).toEqual(springConfig.gentle);
    });

    it('should return tween config when reduced motion is preferred', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      
      const result = getSpringConfig('gentle');
      expect(result).toEqual({
        type: 'tween',
        duration: 0.001
      });
    });
  });
});