// src/components/ScreenWrapper.tsx
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../../constants/designSystem';
import { Header } from './Header';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
  canGoBack?: boolean;
  onSOSPress?: () => void;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  title, 
  canGoBack,
  onSOSPress 
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {title && (
          <Header 
            title={title} 
            canGoBack={canGoBack}
            onSOSPress={onSOSPress}
          />
        )}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {children}
          </View>
        </ScrollView>
      </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  content: {
    paddingHorizontal: SPACING.md,
    flex: 1,
  },
});
