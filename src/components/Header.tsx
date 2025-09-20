// src/components/Header.tsx
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/designSystem';
import HapticService from '../services/HapticService';
// @ts-expect-error: Text component type declaration missing
import Text from './Text';
// @ts-expect-error: ModernDialog component type declaration missing
import ModernDialog from './ModernDialog';

export interface HeaderProps {
  title: string;
  canGoBack?: boolean;
  onSOSPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  canGoBack, 
  onSOSPress 
}) => {
  const navigation = useNavigation();
  const [showSOSDialog, setShowSOSDialog] = useState(false);

  const handleSOS = () => {
    if (onSOSPress) {
      onSOSPress();
      return;
    }

    HapticService.patterns.sosPressed();
    setShowSOSDialog(true);
  };

  const sosButtons = [
    { 
      text: 'KIRAN (24/7)', 
      organization: 'Ministry of Social Justice & Empowerment',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:9152987821');
      }
    },
    { 
      text: 'Vandrevala Foundation', 
      organization: 'Vandrevala Foundation',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:1800-599-0019');
      }
    },
    { 
      text: 'iCall', 
      organization: 'TISS Mumbai',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:1860-2662-345');
      }
    },
    { 
      text: 'AASRA', 
      organization: 'AASRA Mumbai',
      style: 'success' as const,
      onPress: () => {
        HapticService.medium();
        Linking.openURL('tel:022-25521111');
      }
    },
    { 
      text: 'Emergency (911)', 
      organization: 'Emergency Response',
      style: 'emergency' as const,
      onPress: () => {
        HapticService.heavy();
        Linking.openURL('tel:911');
      }
    },
    { 
      text: 'I\'m Safe', 
      style: 'cancel' as const, 
      onPress: () => HapticService.light() 
    },
  ];

  const handleBackPress = () => {
    HapticService.light();
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          {canGoBack && (
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={COLORS.primaryText} 
            />
          )}
        </TouchableOpacity>

        {/* Title */}
        <Text variant="bold" size="lg" color={COLORS.primaryText} style={styles.title}>
          {title}
        </Text>

        {/* SOS Button */}
        <TouchableOpacity 
          style={styles.sosButton}
          onPress={handleSOS}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="shield-checkmark-outline" 
            size={24} 
            color={COLORS.warningRed} 
          />
        </TouchableOpacity>
      </View>

      <ModernDialog
        visible={showSOSDialog}
        title="Emergency Support"
        message="Professional mental health helplines are available 24/7. Choose a service below to call directly. All services are confidential and staffed by trained professionals."
        buttons={sosButtons}
        onClose={() => setShowSOSDialog(false)}
        type="warning"
        isEmergency={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.cardBackground,
    ...SHADOWS.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  title: {
    textAlign: 'center',
    flex: 1,
  },
  sosButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
});
