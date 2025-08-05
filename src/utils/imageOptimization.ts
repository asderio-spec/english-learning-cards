/**
 * Image optimization utilities for better performance
 * 성능 향상을 위한 이미지 최적화 유틸리티
 */

/**
 * WebP support detection
 * WebP 지원 감지
 */
export const webpSupport = {
  isSupported: (() => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  })(),
  
  /**
   * Get optimized image format
   * 최적화된 이미지 형식 가져오기
   */
  getOptimalFormat: (originalFormat: string): string => {
    if (webpSupport.isSupported && ['jpg', 'jpeg', 'png'].includes(originalFormat.toLowerCase())) {
      return 'webp';
    }
    return originalFormat;
  },
};

/**
 * Responsive image utilities
 * 반응형 이미지 유틸리티
 */
export const responsiveImages = {
  /**
   * Generate srcset for responsive images
   * 반응형 이미지를 위한 srcset 생성
   */
  generateSrcSet: (basePath: string, sizes: number[], format: string = 'webp'): string => {
    return sizes
      .map(size => `${basePath}-${size}w.${format} ${size}w`)
      .join(', ');
  },

  /**
   * Generate sizes attribute
   * sizes 속성 생성
   */
  generateSizes: (breakpoints: Array<{ minWidth?: number; size: string }>): string => {
    return breakpoints
      .map(bp => bp.minWidth ? `(min-width: ${bp.minWidth}px) ${bp.size}` : bp.size)
      .join(', ');
  },

  /**
   * Common responsive image configurations
   * 일반적인 반응형 이미지 구성
   */
  presets: {
    hero: {
      sizes: [320, 640, 768, 1024, 1280, 1920],
      sizesAttr: '(min-width: 1280px) 1280px, (min-width: 768px) 100vw, 100vw',
    },
    card: {
      sizes: [200, 400, 600],
      sizesAttr: '(min-width: 768px) 400px, 200px',
    },
    thumbnail: {
      sizes: [64, 128, 256],
      sizesAttr: '(min-width: 768px) 128px, 64px',
    },
    avatar: {
      sizes: [32, 64, 128],
      sizesAttr: '(min-width: 768px) 64px, 32px',
    },
  },
};

/**
 * Lazy loading utilities
 * 지연 로딩 유틸리티
 */
export const lazyLoading = {
  /**
   * Intersection Observer for lazy loading
   * 지연 로딩을 위한 Intersection Observer
   */
  createObserver: (
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver | null => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return null;
    }

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    };

    return new IntersectionObserver(callback, defaultOptions);
  },

  /**
   * Lazy load image hook
   * 이미지 지연 로딩 훅
   */
  useLazyImage: (src: string, placeholder?: string) => {
    const [imageSrc, setImageSrc] = useState(placeholder || '');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      const observer = lazyLoading.createObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              
              // Create a new image to preload
              const imageLoader = new Image();
              
              imageLoader.onload = () => {
                setImageSrc(src);
                setIsLoaded(true);
                observer?.unobserve(img);
              };
              
              imageLoader.onerror = () => {
                setIsError(true);
                observer?.unobserve(img);
              };
              
              imageLoader.src = src;
            }
          });
        },
        { rootMargin: '50px' }
      );

      if (observer && imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (observer && imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, [src]);

    return { imgRef, imageSrc, isLoaded, isError };
  },
};

/**
 * Image compression utilities
 * 이미지 압축 유틸리티
 */
export const imageCompression = {
  /**
   * Compress image using canvas
   * 캔버스를 사용한 이미지 압축
   */
  compressImage: (
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: string;
    } = {}
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        format = 'image/webp',
      } = options;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          format,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * Get optimal image dimensions
   * 최적 이미지 크기 계산
   */
  getOptimalDimensions: (
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } => {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = originalWidth;
    let height = originalHeight;
    
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  },
};

/**
 * Optimized Image component
 * 최적화된 이미지 컴포넌트
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  sizes,
  priority = false,
  onLoad,
  onError,
}) => {
  const { imgRef, imageSrc, isLoaded, isError } = lazyLoading.useLazyImage(
    src,
    placeholder
  );

  // Generate WebP version if supported
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    
    const extension = src.split('.').pop()?.toLowerCase();
    if (extension && webpSupport.isSupported && ['jpg', 'jpeg', 'png'].includes(extension)) {
      return src.replace(new RegExp(`\\.${extension}$`), '.webp');
    }
    
    return src;
  }, [src]);

  // Generate srcset for responsive images
  const srcSet = useMemo(() => {
    if (!src || !width) return undefined;
    
    const basePath = src.replace(/\.[^/.]+$/, '');
    const extension = webpSupport.getOptimalFormat(src.split('.').pop() || 'jpg');
    
    return responsiveImages.generateSrcSet(
      basePath,
      [width * 0.5, width, width * 1.5, width * 2].map(Math.round),
      extension
    );
  }, [src, width]);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  if (isError) {
    return React.createElement('div', {
      className: `bg-gray-200 flex items-center justify-center ${className}`,
      style: { width, height }
    }, React.createElement('span', {
      className: 'text-gray-500 text-sm'
    }, '이미지를 불러올 수 없습니다'));
  }

  return React.createElement('img', {
    ref: priority ? undefined : imgRef,
    src: priority ? optimizedSrc : imageSrc,
    srcSet: srcSet,
    sizes: sizes,
    alt: alt,
    width: width,
    height: height,
    className: `transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    } ${className}`,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    onLoad: handleLoad,
    onError: handleError
  });
};

/**
 * Image preloading utilities
 * 이미지 사전 로딩 유틸리티
 */
export const imagePreloading = {
  /**
   * Preload critical images
   * 중요한 이미지 사전 로딩
   */
  preloadCriticalImages: (imagePaths: string[]) => {
    if (typeof window === 'undefined') return;

    imagePaths.forEach((path) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    });
  },

  /**
   * Preload image with promise
   * Promise를 사용한 이미지 사전 로딩
   */
  preloadImage: (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  /**
   * Preload multiple images
   * 여러 이미지 사전 로딩
   */
  preloadImages: async (srcs: string[]): Promise<HTMLImageElement[]> => {
    try {
      return await Promise.all(srcs.map(imagePreloading.preloadImage));
    } catch (error) {
      console.warn('Failed to preload some images:', error);
      return [];
    }
  },
};

// Import React hooks
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';