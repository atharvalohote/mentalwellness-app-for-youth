import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, LAYOUT } from '../../constants/designSystem';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  alwaysBounceVertical?: boolean;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  scrollable = true,
  keyboardAvoiding = false,
  backgroundColor = COLORS.offwhite,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  bounces = true,
  alwaysBounceVertical = false,
}) => {
  const containerStyle = [
    styles.container,
    { backgroundColor }
  ];

  const scrollContentStyle = [
    styles.scrollContent,
    contentContainerStyle
  ];

  if (keyboardAvoiding) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={containerStyle}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {scrollable ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={scrollContentStyle}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              bounces={bounces}
              alwaysBounceVertical={alwaysBounceVertical}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={containerStyle}>
              {children}
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {scrollable ? (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={scrollContentStyle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          bounces={bounces}
          alwaysBounceVertical={alwaysBounceVertical}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: LAYOUT.safeAreaHorizontal,
    paddingTop: LAYOUT.safeAreaVertical,
    paddingBottom: SPACING.xl, // Reduced padding for better spacing
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
});

export default UnifiedLayout;
