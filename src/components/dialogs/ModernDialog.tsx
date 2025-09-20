import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/designSystem';
import Text from '../ui/Text';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface DialogButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel' | 'destructive' | 'success' | 'emergency';
  icon?: keyof typeof Ionicons.glyphMap;
  organization?: string;
  phoneNumber?: string;
  description?: string;
}

interface ModernDialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: DialogButton[];
  onClose: () => void;
  type?: 'info' | 'warning' | 'error' | 'success';
  isEmergency?: boolean;
}

const ModernDialog: React.FC<ModernDialogProps> = ({
  visible,
  title,
  message,
  buttons,
  onClose,
  type = 'info',
  isEmergency = false,
}) => {
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(0.8));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTypeIcon = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      case 'success':
        return 'checkmark-circle';
      default:
        return 'information-circle';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'warning':
        return COLORS.orange;
      case 'error':
        return COLORS.warningRed;
      case 'success':
        return COLORS.successGreen;
      default:
        return COLORS.purple;
    }
  };

  const getButtonStyle = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
        return {
          backgroundColor: COLORS.cardBackground,
          borderColor: COLORS.borderColor,
        };
      case 'emergency':
        return {
          backgroundColor: COLORS.cardBackground,
          borderColor: COLORS.borderColor,
        };
      case 'success':
        return {
          backgroundColor: COLORS.cardBackground,
          borderColor: COLORS.borderColor,
        };
      case 'cancel':
        return {
          backgroundColor: COLORS.successGreen,
          borderColor: COLORS.successGreen,
        };
      default:
        return {
          backgroundColor: COLORS.cardBackground,
          borderColor: COLORS.borderColor,
        };
    }
  };

  const getButtonTextColor = (buttonStyle: string) => {
    switch (buttonStyle) {
      case 'destructive':
      case 'success':
        return COLORS.primaryText;
      case 'emergency':
        return COLORS.primaryText;
      case 'cancel':
        return isEmergency ? COLORS.cardBackground : COLORS.cardBackground;
      default:
        return COLORS.primaryText;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.dialog,
                isEmergency && styles.emergencyDialog,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: getTypeColor() }]}>
                  <Ionicons
                    name={getTypeIcon()}
                    size={24}
                    color={COLORS.cardBackground}
                  />
                </View>
                <Text variant="bold" size="lg" color={isEmergency ? COLORS.cardBackground : COLORS.primaryText} style={styles.title}>
                  {title}
                </Text>
              </View>

              {/* Message */}
              <View style={styles.messageContainer}>
                <Text variant="regular" size="md" color={isEmergency ? COLORS.cardBackground : COLORS.secondaryText} style={styles.message}>
                  {message}
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      getButtonStyle(button.style || 'default'),
                      button.organization && styles.simpleButton,
                      button.style === 'cancel' && styles.cancelButton,
                    ]}
                    onPress={() => {
                      button.onPress();
                      onClose();
                    }}
                    activeOpacity={0.8}
                  >
                    {button.style === 'cancel' ? (
                      <View style={styles.cancelButtonContent}>
                        <Text
                          variant="semibold"
                          size="md"
                          color={getButtonTextColor(button.style || 'default')}
                        >
                          {button.text}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.simpleButtonContent}>
                        <Text
                          variant="semibold"
                          size="md"
                          color={getButtonTextColor(button.style || 'default')}
                          style={styles.simpleButtonText}
                        >
                          {button.text}
                        </Text>
                        
                        {button.organization && (
                          <TouchableOpacity
                            style={[
                              styles.callButton,
                              button.style === 'emergency' && styles.emergencyCallButton
                            ]}
                            onPress={() => {
                              button.onPress();
                            }}
                            activeOpacity={0.8}
                          >
                            <Ionicons
                              name="call"
                              size={16}
                              color={COLORS.cardBackground}
                              style={styles.callIcon}
                            />
                            <Text
                              variant="semibold"
                              size="sm"
                              color={COLORS.cardBackground}
                            >
                              Call
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  dialog: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.lg,
    elevation: 10,
  },
  emergencyDialog: {
    backgroundColor: COLORS.warningRed,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  title: {
    flex: 1,
  },
  messageContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  message: {
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    minHeight: 48,
  },
  simpleButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 56,
    alignItems: 'flex-start',
  },
  cancelButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    minHeight: 44,
    marginTop: SPACING.sm,
  },
  cancelButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  simpleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  simpleButtonText: {
    flex: 1,
    textAlign: 'left',
  },
  callButton: {
    backgroundColor: COLORS.successGreen,
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
    minWidth: 70,
  },
  callIcon: {
    marginRight: SPACING.xs,
  },
  emergencyCallButton: {
    backgroundColor: COLORS.warningRed,
  },
});

export default ModernDialog;
