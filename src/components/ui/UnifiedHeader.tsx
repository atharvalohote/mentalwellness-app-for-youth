import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/designSystem';
import Text from './Text';
import HapticService from '../../services/HapticService';

interface UnifiedHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onRightPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightText?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  showRightButton?: boolean;
  rightButtonDisabled?: boolean;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onRightPress,
  rightIcon,
  rightText,
  showBackButton = false,
  showRightButton = false,
  rightButtonDisabled = false,
  backgroundColor = COLORS.cardBackground,
  titleColor = COLORS.primaryText,
  subtitleColor = COLORS.secondaryText,
}) => {
  const handleBackPress = () => {
    HapticService.light();
    onBack?.();
  };

  const handleRightPress = () => {
    HapticService.light();
    onRightPress?.();
  };

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.headerContent}>
        {/* Left side - Back button */}
        <View style={styles.leftSection}>
          {showBackButton && onBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={titleColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center - Title and subtitle */}
        <View style={styles.centerSection}>
          <Text variant="bold" size="lg" color={titleColor} style={styles.title}>
            {title}
          </Text>
          {subtitle && (
            <Text variant="regular" size="sm" color={subtitleColor} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right side - Action button */}
        <View style={styles.rightSection}>
          {showRightButton && onRightPress && rightIcon && (
            <TouchableOpacity
              style={[
                styles.rightButton,
                rightText && styles.rightButtonWithText,
                rightButtonDisabled && styles.rightButtonDisabled
              ]}
              onPress={handleRightPress}
              activeOpacity={0.7}
              disabled={rightButtonDisabled}
            >
              <Ionicons 
                name={rightIcon} 
                size={20} 
                color={rightButtonDisabled ? COLORS.lightText : COLORS.cardBackground} 
              />
              {rightText && (
                <Text 
                  variant="medium" 
                  size="sm" 
                  color={rightButtonDisabled ? COLORS.lightText : COLORS.cardBackground} 
                  style={styles.rightButtonText}
                >
                  {rightText}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.purple,
    ...SHADOWS.md,
    minHeight: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    width: 60,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  rightButton: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minWidth: 60,
    alignItems: 'center',
    flexDirection: 'row',
    ...SHADOWS.md,
  },
  rightButtonWithText: {
    paddingHorizontal: SPACING.md,
  },
  rightButtonDisabled: {
    backgroundColor: COLORS.borderColor,
    opacity: 0.6,
  },
  rightButtonText: {
    marginLeft: SPACING.xs,
  },
});

export default UnifiedHeader;
