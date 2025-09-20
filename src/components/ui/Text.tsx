import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../../constants/designSystem';

interface TextProps extends RNTextProps {
  variant?: 'regular' | 'medium' | 'semibold' | 'bold';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
  color?: string;
}

const Text: React.FC<TextProps> = ({ 
  variant = 'regular', 
  size = 'md', 
  color = COLORS.primaryText,
  style,
  ...props 
}) => {
  const textStyle = [
    styles.default,
    {
      fontFamily: TYPOGRAPHY.fontFamily[variant],
      fontSize: TYPOGRAPHY.sizes[size],
      color,
    },
    style,
  ];

  return <RNText style={textStyle} {...props} />;
};

const styles = StyleSheet.create({
  default: {
    fontFamily: TYPOGRAPHY.defaultFontFamily,
  },
});

export default Text;
