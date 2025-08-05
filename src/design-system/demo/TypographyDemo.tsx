/**
 * Linear 디자인 시스템 - 타이포그래피 데모 컴포넌트
 * 모든 타이포그래피 스타일을 시각적으로 보여주는 데모
 */

import React from 'react';
import { 
  getDisplayStyle, 
  getHeadingStyle, 
  getBodyStyle, 
  getCaptionStyle
} from '../tokens/typographyUtils';

export const TypographyDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center mb-12">
        <h1 style={getDisplayStyle()} className="mb-4">
          Linear Typography System
        </h1>
        <p style={getBodyStyle('large')} className="text-neutral-600">
          Complete typography system with responsive design and accessibility features
        </p>
      </div>

      {/* Display Typography */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Display Typography
        </h2>
        <div className="space-y-4">
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Display (32px / 40px / 700 / -0.02em)
            </p>
            <div style={getDisplayStyle()}>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Display Responsive (28px → 32px)
            </p>
            <div className="text-display-responsive">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </div>
      </section>

      {/* Heading Typography */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Heading Typography
        </h2>
        <div className="space-y-4">
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H1 (28px / 36px / 700 / -0.02em)
            </p>
            <h1 style={getHeadingStyle('h1')}>
              The quick brown fox jumps over the lazy dog
            </h1>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H1 Responsive (24px → 28px)
            </p>
            <h1 className="text-h1-responsive">
              The quick brown fox jumps over the lazy dog
            </h1>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H2 (24px / 32px / 600 / -0.01em)
            </p>
            <h2 style={getHeadingStyle('h2')}>
              The quick brown fox jumps over the lazy dog
            </h2>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H2 Responsive (20px → 24px)
            </p>
            <h2 className="text-h2-responsive">
              The quick brown fox jumps over the lazy dog
            </h2>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H3 (20px / 28px / 600 / -0.01em)
            </p>
            <h3 style={getHeadingStyle('h3')}>
              The quick brown fox jumps over the lazy dog
            </h3>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              H4 (18px / 26px / 600 / 0em)
            </p>
            <h4 style={getHeadingStyle('h4')}>
              The quick brown fox jumps over the lazy dog
            </h4>
          </div>
        </div>
      </section>

      {/* Body Typography */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Body Typography
        </h2>
        <div className="space-y-4">
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Body Large (18px / 28px / 400 / 0em)
            </p>
            <p style={getBodyStyle('large')}>
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Body Medium (16px / 24px / 400 / 0em)
            </p>
            <p style={getBodyStyle('medium')}>
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Body Small (14px / 20px / 400 / 0em)
            </p>
            <p style={getBodyStyle('small')}>
              The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
              ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>

      {/* Caption Typography */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Caption Typography
        </h2>
        <div className="space-y-4">
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Caption Large (14px / 20px / 500 / 0.01em)
            </p>
            <p style={getCaptionStyle('large')}>
              The quick brown fox jumps over the lazy dog. Used for larger captions, 
              labels, and secondary information.
            </p>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Caption Medium (12px / 16px / 500 / 0.01em)
            </p>
            <p style={getCaptionStyle('medium')}>
              The quick brown fox jumps over the lazy dog. Used for standard captions, 
              form labels, and metadata.
            </p>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Caption Small (11px / 14px / 500 / 0.02em)
            </p>
            <p style={getCaptionStyle('small')}>
              The quick brown fox jumps over the lazy dog. Used for small captions, 
              timestamps, and fine print.
            </p>
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Font Weights
        </h2>
        <div className="space-y-4">
          <div style={getBodyStyle('medium')}>
            <p className="font-light">Light (300) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-normal">Normal (400) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-medium">Medium (500) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-semibold">Semibold (600) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-bold">Bold (700) - The quick brown fox jumps over the lazy dog</p>
            <p className="font-extrabold">Extrabold (800) - The quick brown fox jumps over the lazy dog</p>
          </div>
        </div>
      </section>

      {/* Text Utilities */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Text Utilities
        </h2>
        <div className="space-y-4">
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Single Line Truncation
            </p>
            <div className="w-64 border border-neutral-200 p-3 rounded">
              <p style={getBodyStyle('medium')} className="text-truncate">
                This is a very long text that should be truncated with ellipsis when it exceeds the container width
              </p>
            </div>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Multi-line Truncation (2 lines)
            </p>
            <div className="w-64 border border-neutral-200 p-3 rounded">
              <p style={getBodyStyle('medium')} className="text-truncate-2">
                This is a very long text that should be truncated after two lines with ellipsis when it exceeds the container height. This demonstrates the multi-line truncation utility.
              </p>
            </div>
          </div>
          
          <div>
            <p style={getCaptionStyle('medium')} className="text-neutral-500 mb-2">
              Multi-line Truncation (3 lines)
            </p>
            <div className="w-64 border border-neutral-200 p-3 rounded">
              <p style={getBodyStyle('medium')} className="text-truncate-3">
                This is a very long text that should be truncated after three lines with ellipsis when it exceeds the container height. This demonstrates the multi-line truncation utility with more content to show the effect properly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Behavior */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Responsive Behavior
        </h2>
        <div className="space-y-4">
          <p style={getBodyStyle('medium')} className="text-neutral-600">
            Resize your browser window to see how the responsive typography classes adapt:
          </p>
          <div className="bg-neutral-50 p-6 rounded-lg space-y-4">
            <div className="text-display-responsive">Display Responsive</div>
            <div className="text-h1-responsive">H1 Responsive</div>
            <div className="text-h2-responsive">H2 Responsive</div>
          </div>
          <div className="text-sm text-neutral-500">
            <p>• Display: 28px on mobile → 32px on desktop (768px+)</p>
            <p>• H1: 24px on mobile → 28px on desktop (768px+)</p>
            <p>• H2: 20px on mobile → 24px on desktop (768px+)</p>
          </div>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <h2 style={getHeadingStyle('h2')} className="border-b border-neutral-200 pb-2">
          Accessibility Features
        </h2>
        <div className="space-y-4">
          <div className="bg-success-50 border border-success-200 p-4 rounded-lg">
            <h3 style={getHeadingStyle('h4')} className="text-success-800 mb-2">
              ✓ WCAG 2.1 AA Compliant
            </h3>
            <ul style={getBodyStyle('small')} className="text-success-700 space-y-1">
              <li>• All font sizes meet minimum 11px requirement</li>
              <li>• Line heights are at least 1.2 for optimal readability</li>
              <li>• Proper heading hierarchy (h1 → h2 → h3 → h4)</li>
              <li>• Sufficient color contrast ratios</li>
              <li>• Responsive design for all screen sizes</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TypographyDemo;