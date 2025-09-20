import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/designSystem';
import Text from '../ui/Text';
import HapticService from '../../services/HapticService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

interface MoodContextModalProps {
  visible: boolean;
  selectedMood: MoodOption | null;
  onSave: (context: string) => void;
  onClose: () => void;
}

const MoodContextModal: React.FC<MoodContextModalProps> = ({
  visible,
  selectedMood,
  onSave,
  onClose,
}) => {
  const [context, setContext] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(screenHeight));

  useEffect(() => {
    if (visible) {
      setContext('');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSave = () => {
    HapticService.success();
    onSave(context.trim());
    onClose();
  };

  const handleClose = () => {
    HapticService.light();
    onClose();
  };

  if (!visible || !selectedMood) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modal,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
              >
                {/* Header */}
                <View style={styles.header}>
                  <View style={styles.moodDisplay}>
                    <Text variant="bold" size="xxl" style={styles.moodEmoji}>
                      {selectedMood.emoji}
                    </Text>
                    <View style={styles.moodInfo}>
                      <Text variant="bold" size="lg" color={COLORS.primaryText}>
                        {selectedMood.label}
                      </Text>
                      <Text variant="regular" size="sm" color={COLORS.secondaryText}>
                        {selectedMood.description}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color={COLORS.primaryText} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.prompt}>
                    What's making you feel this way?
                  </Text>
                  <Text variant="regular" size="sm" color={COLORS.lightText} style={styles.subPrompt}>
                    (Optional - but it helps us understand you better)
                  </Text>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Share your thoughts..."
                      placeholderTextColor={COLORS.lightText}
                      value={context}
                      onChangeText={setContext}
                      multiline
                      maxLength={500}
                      textAlignVertical="top"
                      autoFocus
                    />
                    <View style={styles.characterCount}>
                      <Text variant="regular" size="xs" color={COLORS.lightText}>
                        {context.length}/500
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                  >
                    <Text variant="semibold" size="md" color={COLORS.secondaryText}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { backgroundColor: selectedMood.color }
                    ]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="checkmark" size={20} color={COLORS.cardBackground} />
                    <Text variant="semibold" size="md" color={COLORS.cardBackground} style={styles.saveButtonText}>
                      Save Entry
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
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
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: screenHeight * 0.8,
    ...SHADOWS.lg,
    elevation: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 40,
    marginRight: SPACING.md,
  },
  moodInfo: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.offwhite,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  prompt: {
    marginBottom: SPACING.xs,
  },
  subPrompt: {
    marginBottom: SPACING.xl,
    fontStyle: 'italic',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    color: COLORS.primaryText,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  skipButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  saveButtonText: {
    marginLeft: SPACING.sm,
  },
});

export default MoodContextModal;
