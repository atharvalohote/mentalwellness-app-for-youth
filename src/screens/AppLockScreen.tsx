import React, { useState, useEffect, useRef } from 'react';
import { 
  Alert, 
  TouchableOpacity, 
  StyleSheet, 
  View, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../constants/designSystem';
import Text from '../components/ui/Text';
import HapticService from '../services/HapticService';

interface AppLockScreenProps {
  onUnlock: () => void;
}

const AppLockScreen: React.FC<AppLockScreenProps> = ({ onUnlock }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const pinInputRef = useRef<TextInput>(null);

  useEffect(() => {
    checkExistingPin();
  }, []);

  const checkExistingPin = async () => {
    try {
      const existingPin = await AsyncStorage.getItem('app_pin');
      if (existingPin) {
        setStoredPin(existingPin);
        setIsSettingUp(false);
      } else {
        setIsSettingUp(true);
      }
    } catch (error) {
      console.error('Error checking existing PIN:', error);
    }
  };

  const handlePinChange = (text: string) => {
    // Only allow numeric input and limit to 4 digits
    const numericText = text.replace(/[^0-9]/g, '');
    
    // Haptic feedback for each digit input
    const currentPin = isSettingUp ? (isConfirming ? confirmPin : pin) : pin;
    if (numericText.length > currentPin.length) {
      HapticService.patterns.pinInput();
    }
    
    if (isSettingUp) {
      if (!isConfirming) {
        if (numericText.length <= 4) {
          setPin(numericText);
        }
      } else {
        if (numericText.length <= 4) {
          setConfirmPin(numericText);
        }
      }
    } else {
      if (numericText.length <= 4) {
        setPin(numericText);
      }
    }
  };

  const handlePinSubmit = () => {
    if (isSettingUp) {
      if (!isConfirming) {
        if (pin.length === 4) {
          HapticService.medium();
          setIsConfirming(true);
          setConfirmPin('');
          // Focus on confirm PIN input
          setTimeout(() => {
            pinInputRef.current?.focus();
          }, 100);
        }
      } else {
        if (pin === confirmPin && confirmPin.length === 4) {
          HapticService.patterns.pinComplete();
          handleUnlock();
        } else {
          HapticService.patterns.pinError();
          Alert.alert('Error', 'PINs do not match. Please try again.');
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
        }
      }
    } else {
      if (pin === storedPin && pin.length === 4) {
        HapticService.patterns.pinComplete();
        handleUnlock();
      } else {
        HapticService.patterns.pinError();
        Alert.alert('Error', 'Incorrect PIN. Please try again.');
        setPin('');
      }
    }
  };

  const handleUnlock = async () => {
    if (isSettingUp && isConfirming) {
      if (pin === confirmPin && confirmPin.length === 4) {
        try {
          await AsyncStorage.setItem('app_pin', pin);
          onUnlock();
        } catch (error) {
          Alert.alert('Error', 'Failed to save PIN. Please try again.');
        }
      }
    } else if (!isSettingUp) {
      if (pin === storedPin && pin.length === 4) {
        onUnlock();
      }
    }
  };

  const renderPinDots = () => {
    const currentPin = isSettingUp && isConfirming ? confirmPin : pin;
    const dots = [];
    
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            {
              backgroundColor: i < currentPin.length ? COLORS.primaryBlue : COLORS.lightText,
            }
          ]}
        />
      );
    }
    return dots;
  };

  const renderPinInput = () => {
    const currentPin = isSettingUp && isConfirming ? confirmPin : pin;
    const placeholder = isSettingUp 
      ? (isConfirming ? 'Confirm PIN' : 'Enter PIN')
      : 'Enter PIN';


    return (
      <View style={{ width: '60%', marginBottom: SPACING.xl }}>
        <TextInput
          ref={pinInputRef}
          style={styles.pinInput}
          value={currentPin}
          onChangeText={handlePinChange}
          onSubmitEditing={handlePinSubmit}
          placeholder={placeholder}
          placeholderTextColor={COLORS.lightText}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry={true}
          autoFocus={true}
          returnKeyType="done"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.mainContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="bold" size="xxxl" color={COLORS.darkblue} style={styles.title}>
              Mindful AI Companion
            </Text>
            <Text variant="regular" size="md" color={COLORS.secondaryText} style={styles.subtitle}>
              {isSettingUp
                ? isConfirming
                  ? 'Confirm your 4-digit PIN'
                  : 'Create a 4-digit PIN to secure your app'
                : 'Enter your PIN to continue'}
            </Text>
          </View>

          {/* PIN Dots */}
          <View style={styles.pinDotsContainer}>
            {renderPinDots()}
          </View>

          {/* PIN Input */}
          {renderPinInput()}

          {/* Unlock Button */}
          <TouchableOpacity
            onPress={handlePinSubmit}
            disabled={
              isSettingUp
                ? isConfirming
                  ? confirmPin.length !== 4
                  : pin.length !== 4
                : pin.length !== 4
            }
            style={[
              styles.unlockButton,
              {
                opacity: isSettingUp
                  ? isConfirming
                    ? confirmPin.length === 4 ? 1 : 0.5
                    : pin.length === 4 ? 1 : 0.5
                  : pin.length === 4 ? 1 : 0.5,
              }
            ]}
          >
            <Text variant="bold" size="lg" color={COLORS.cardBackground} style={styles.unlockButtonText}>
              {isSettingUp
                ? isConfirming
                  ? 'Confirm PIN'
                  : 'Continue'
                : 'Unlock'}
            </Text>
          </TouchableOpacity>

          {/* Biometric Option (for future implementation) */}
          {!isSettingUp && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={() => {
                // TODO: Implement biometric authentication
                Alert.alert('Biometric', 'Biometric authentication coming soon!');
              }}
            >
              <Ionicons name="finger-print" size={20} color={COLORS.pink} />
              <Text variant="semibold" size="md" color={COLORS.pink} style={styles.biometricButtonText}>
                Use Biometric Authentication
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  mainContent: {
    alignItems: 'center',
    maxWidth: 300,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.xs,
  },
  pinInputContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    width: '100%',
  },
  pinInput: {
    width: '80%',
    maxWidth: 200,
    height: 60,
    borderWidth: 3,
    borderColor: COLORS.purple,
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamily.bold,
    textAlign: 'center',
    color: COLORS.primaryText,
    backgroundColor: COLORS.cardBackground,
    letterSpacing: 12,
    ...SHADOWS.lg,
  },
  unlockButton: {
    backgroundColor: COLORS.purple,
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    minWidth: 200,
    ...SHADOWS.lg,
    transform: [{ skewX: '-2deg' }],
  },
  unlockButtonText: {
    // Font properties handled by Text component
  },
  biometricButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.pink,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    transform: [{ skewX: '2deg' }],
    flexDirection: 'row',
  },
  biometricButtonText: {
    marginLeft: SPACING.sm,
  },
});

export default AppLockScreen;
