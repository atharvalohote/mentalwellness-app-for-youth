import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS } from '../../constants/designSystem';
import Text from '../../components/ui/Text';
import HapticService from '../../services/HapticService';
import { GoogleAIService } from '../../services/googleAI';
import ModernDialog from '../../components/dialogs/ModernDialog';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface CbtChallengeScreenProps {
  navigation: any;
  route?: {
    params?: {
      therapy?: any;
    };
  };
}

const CBT_STEPS = [
  { id: 'identify', title: 'Identify', description: 'Identify the negative thought' },
  { id: 'challenge', title: 'Challenge', description: 'Challenge the thought with evidence' },
  { id: 'alternatives', title: 'Alternatives', description: 'Consider alternative perspectives' },
  { id: 'reframe', title: 'Reframe', description: 'Create a balanced thought' },
];

const CBT_PROMPTS = {
  identify: "Welcome! To begin, what is the specific negative thought that's on your mind?",
  challenge: "What evidence do you have that supports this thought? What evidence contradicts it?",
  alternatives: "What would you tell a friend who had this same thought? What other ways could you look at this situation?",
  reframe: "Based on our discussion, what would be a more balanced and realistic way to think about this situation?",
};

const CbtChallengeScreen: React.FC<CbtChallengeScreenProps> = ({ navigation, route }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: CBT_PROMPTS.identify,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, true);
    setIsLoading(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Move to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep < CBT_STEPS.length) {
        // Add AI response for next step
        const nextPrompt = Object.values(CBT_PROMPTS)[nextStep];
        addMessage(nextPrompt, false);
      } else {
        // Session complete
        setIsComplete(true);
        addMessage("Great job! You've completed the CBT challenge. Your reframed thought shows a more balanced perspective.", false);
      }
    } catch (error) {
      console.error('Error in CBT session:', error);
      addMessage("I'm sorry, there was an error. Let's try again.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSession = () => {
    setShowSaveDialog(true);
  };

  const handleSaveToJournal = () => {
    // Create journal entry from the conversation
    const conversationText = messages
      .map(msg => `${msg.isUser ? 'You' : 'AI Buddy'}: ${msg.text}`)
      .join('\n\n');
    
    const journalEntry = {
      title: 'CBT Challenge Session',
      content: conversationText,
      mood: 'reflective',
      therapy: 'CBT Challenge',
      timestamp: new Date(),
    };

    // Navigate to journal with the entry
    navigation.navigate('JournalEntry', {
      preFilledEntry: journalEntry,
      fromCBT: true,
    });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          variant="regular"
          size="md"
          color={message.isUser ? COLORS.cardBackground : COLORS.primaryText}
          style={styles.messageText}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );

  const renderLoadingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primaryText} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text variant="bold" size="lg" color={COLORS.primaryText} style={styles.title}>
              Challenge a Thought
            </Text>
            <View style={styles.progressContainer}>
              <Text variant="medium" size="sm" color={COLORS.secondaryText}>
                Step {currentStep + 1} of {CBT_STEPS.length}: {CBT_STEPS[currentStep]?.title}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((currentStep + 1) / CBT_STEPS.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          {isLoading && renderLoadingIndicator()}
        </ScrollView>

        {/* Input Area */}
        {!isComplete ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your response..."
                placeholderTextColor={COLORS.lightText}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={(!inputText.trim() || isLoading) ? COLORS.lightText : COLORS.cardBackground}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.completeContainer}>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteSession}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={24} color={COLORS.cardBackground} />
              <Text variant="semibold" size="md" color={COLORS.cardBackground} style={styles.completeButtonText}>
                Complete Session & Save to Journal
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {/* Save Dialog */}
      <ModernDialog
        visible={showSaveDialog}
        title="Save to Journal"
        message="Would you like to save this CBT challenge session to your journal? This will help you track your progress and revisit your insights."
        buttons={[
          {
            text: 'Cancel',
            onPress: () => {
              HapticService.light();
              setShowSaveDialog(false);
            },
            style: 'cancel',
          },
          {
            text: 'Save to Journal',
            onPress: () => {
              HapticService.success();
              setShowSaveDialog(false);
              handleSaveToJournal();
            },
            style: 'success',
          },
        ]}
        onClose={() => setShowSaveDialog(false)}
        type="info"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.borderColor,
    borderRadius: RADIUS.sm,
    marginLeft: SPACING.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.teal,
    borderRadius: RADIUS.sm,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  messagesContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  userBubble: {
    backgroundColor: COLORS.teal,
    borderBottomRightRadius: RADIUS.xs,
  },
  aiBubble: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  messageText: {
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.lightText,
    marginHorizontal: 2,
  },
  loadingDotDelay1: {
    // animationDelay: '0.2s',
  },
  loadingDotDelay2: {
    // animationDelay: '0.4s',
  },
  inputContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.primaryText,
    maxHeight: 100,
    marginRight: SPACING.sm,
  },
  sendButton: {
    backgroundColor: COLORS.teal,
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.borderColor,
  },
  completeContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  completeButton: {
    backgroundColor: COLORS.successGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.xl,
    ...SHADOWS.md,
  },
  completeButtonText: {
    marginLeft: SPACING.sm,
  },
});

export default CbtChallengeScreen;
