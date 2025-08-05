/**
 * 플랫폼별 View 컴포넌트 추상화
 */

import React from 'react';
import { Platform } from '../index';

interface PlatformViewProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | any; // React Native 스타일도 지원
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

/**
 * 플랫폼에 따라 적절한 View 컴포넌트를 렌더링
 */
export const PlatformView: React.FC<PlatformViewProps> = ({
  children,
  className,
  style,
  testID,
  accessible,
  accessibilityLabel,
  accessibilityRole,
  onPress,
  onLongPress,
  ...props
}) => {
  if (Platform.isWeb) {
    // 웹에서는 div 사용
    const webProps: any = {
      className,
      style,
      'data-testid': testID,
      'aria-label': accessibilityLabel,
      role: accessibilityRole,
      ...props
    };

    if (onPress) {
      webProps.onClick = onPress;
      webProps.onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress();
        }
      };
      webProps.tabIndex = 0;
      webProps.role = webProps.role || 'button';
    }

    if (onLongPress) {
      let pressTimer: NodeJS.Timeout;
      webProps.onMouseDown = () => {
        pressTimer = setTimeout(onLongPress, 500);
      };
      webProps.onMouseUp = () => {
        clearTimeout(pressTimer);
      };
      webProps.onMouseLeave = () => {
        clearTimeout(pressTimer);
      };
    }

    return <div {...webProps}>{children}</div>;
  } else {
    // React Native에서는 View 사용
    try {
      const { View, TouchableOpacity } = require('react-native');
      
      const nativeProps = {
        style,
        testID,
        accessible,
        accessibilityLabel,
        accessibilityRole,
        ...props
      };

      if (onPress || onLongPress) {
        return (
          <TouchableOpacity
            {...nativeProps}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {children}
          </TouchableOpacity>
        );
      }

      return <View {...nativeProps}>{children}</View>;
    } catch (error) {
      // React Native가 없는 경우 웹 fallback
      return <div className={className} style={style}>{children}</div>;
    }
  }
};

/**
 * 플랫폼별 Text 컴포넌트
 */
interface PlatformTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | any;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
}

export const PlatformText: React.FC<PlatformTextProps> = ({
  children,
  className,
  style,
  testID,
  accessible,
  accessibilityLabel,
  numberOfLines,
  ellipsizeMode,
  selectable,
  ...props
}) => {
  if (Platform.isWeb) {
    const webStyle: React.CSSProperties = {
      ...style,
      ...(numberOfLines && {
        display: '-webkit-box',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }),
      ...(selectable === false && {
        userSelect: 'none',
        WebkitUserSelect: 'none'
      })
    };

    return (
      <span
        className={className}
        style={webStyle}
        data-testid={testID}
        aria-label={accessibilityLabel}
        {...props}
      >
        {children}
      </span>
    );
  } else {
    try {
      const { Text } = require('react-native');
      
      return (
        <Text
          style={style}
          testID={testID}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel}
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          selectable={selectable}
          {...props}
        >
          {children}
        </Text>
      );
    } catch (error) {
      return <span className={className} style={style}>{children}</span>;
    }
  }
};

/**
 * 플랫폼별 ScrollView 컴포넌트
 */
interface PlatformScrollViewProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties | any;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  onScroll?: (event: any) => void;
  scrollEventThrottle?: number;
  contentContainerStyle?: React.CSSProperties | any;
}

export const PlatformScrollView: React.FC<PlatformScrollViewProps> = ({
  children,
  className,
  style,
  horizontal,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = true,
  onScroll,
  scrollEventThrottle,
  contentContainerStyle,
  ...props
}) => {
  if (Platform.isWeb) {
    const webStyle: React.CSSProperties = {
      ...style,
      overflow: 'auto',
      ...(horizontal && {
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap'
      }),
      ...(!showsVerticalScrollIndicator && {
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      })
    };

    const webClassName = `${className || ''} ${!showsVerticalScrollIndicator ? 'hide-scrollbar' : ''}`.trim();

    return (
      <div
        className={webClassName}
        style={webStyle}
        onScroll={onScroll}
        {...props}
      >
        <div style={contentContainerStyle}>
          {children}
        </div>
      </div>
    );
  } else {
    try {
      const { ScrollView } = require('react-native');
      
      return (
        <ScrollView
          style={style}
          horizontal={horizontal}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          contentContainerStyle={contentContainerStyle}
          {...props}
        >
          {children}
        </ScrollView>
      );
    } catch (error) {
      return (
        <div className={className} style={style}>
          {children}
        </div>
      );
    }
  }
};

/**
 * 플랫폼별 Image 컴포넌트
 */
interface PlatformImageProps {
  source: { uri: string } | string;
  style?: React.CSSProperties | any;
  className?: string;
  alt?: string;
  testID?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onLoad?: () => void;
  onError?: () => void;
}

export const PlatformImage: React.FC<PlatformImageProps> = ({
  source,
  style,
  className,
  alt,
  testID,
  resizeMode = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  if (Platform.isWeb) {
    const src = typeof source === 'string' ? source : source.uri;
    const webStyle: React.CSSProperties = {
      ...style,
      objectFit: resizeMode === 'cover' ? 'cover' : 
                 resizeMode === 'contain' ? 'contain' : 
                 resizeMode === 'stretch' ? 'fill' : 
                 resizeMode
    };

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={webStyle}
        data-testid={testID}
        onLoad={onLoad}
        onError={onError}
        {...props}
      />
    );
  } else {
    try {
      const { Image } = require('react-native');
      
      return (
        <Image
          source={typeof source === 'string' ? { uri: source } : source}
          style={style}
          testID={testID}
          resizeMode={resizeMode}
          onLoad={onLoad}
          onError={onError}
          {...props}
        />
      );
    } catch (error) {
      const src = typeof source === 'string' ? source : source.uri;
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          {...props}
        />
      );
    }
  }
};