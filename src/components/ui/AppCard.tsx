import React from 'react';
import { TouchableOpacity, ViewProps, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS, LAYOUT, SHADOWS } from '../../constants/designSystem';
import HapticService from '../../services/HapticService';

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient' | 'glass';
  color?: string;
  animated?: boolean;
  hapticFeedback?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const AppCard: React.FC<AppCardProps> = ({
  children,
  onPress,
  disabled = false,
  variant = 'default',
  color = COLORS.cardBackground,
  animated = false,
  hapticFeedback = true,
  size = 'medium',
  style,
  ...props
}) => {
  const [scaleValue] = React.useState(new Animated.Value(1));

  const handlePress = () => {
    if (disabled) return;

    if (hapticFeedback) {
      HapticService.light();
    }

    if (animated) {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
          duration: LAYOUT.animationDuration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: LAYOUT.animationDuration.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onPress?.();
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          padding: SPACING.md,
          minHeight: 60,
          borderRadius: RADIUS.md,
        };
      case 'large':
        return {
          padding: SPACING.xl,
          minHeight: 120,
          borderRadius: RADIUS.xl,
        };
      default: // medium
        return {
          padding: SPACING.lg,
          minHeight: 80,
          borderRadius: RADIUS.lg,
        };
    }
  };

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: color,
      opacity: disabled ? 0.6 : 1,
      ...getSizeStyle(),
    };

    switch (variant) {
      case 'elevated':
        return { 
          ...baseStyle, 
          ...SHADOWS.lg,
          elevation: 8,
        };
      case 'outlined':
        return { 
          ...baseStyle, 
          borderWidth: 1.5, 
          borderColor: COLORS.borderColor,
          backgroundColor: 'transparent',
          ...SHADOWS.sm 
        };
      case 'gradient':
        return { 
          ...baseStyle, 
          backgroundColor: COLORS.gradientStart,
          ...SHADOWS.md,
        };
      case 'glass':
        return { 
          ...baseStyle, 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        };
      default:
        return { 
          ...baseStyle, 
          ...SHADOWS.md,
          elevation: 4,
        };
    }
  };

  const CardComponent = onPress ? TouchableOpacity : React.Fragment;
  const cardProps = onPress ? {
    onPress: handlePress,
    activeOpacity: 0.8,
    disabled,
  } : {};

  const animatedStyle = animated ? {
    transform: [{ scale: scaleValue }],
  } : {};

  return (
    <CardComponent {...cardProps}>
      <Animated.View
        style={[
          styles.card,
          getCardStyle(),
          animatedStyle,
          style,
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    position: 'relative',
  },
});

export default AppCard;
