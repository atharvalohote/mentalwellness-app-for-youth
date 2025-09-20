import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  View,
  TextInput,
  ScrollView as RNScrollView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, SHADOWS, LAYOUT } from '../../constants/designSystem';
import { GoogleAIService } from '../../services/googleAI';
import Text from '../../components/ui/Text';
import AppCard from '../../components/ui/AppCard';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import HapticService from '../../services/HapticService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatContext {
  mood?: string;
  therapy?: string;
  personality?: string;
  sessionStart?: Date;
}

interface BestieChatScreenProps {
  navigation: any;
  route?: {
    params?: {
      mood?: string;
      therapy?: string;
      personality?: string;
    };
  };
}

const BestieChatScreen: React.FC<BestieChatScreenProps> = ({ navigation, route }) => {
  const { mood, therapy, personality } = route?.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext>({
    mood,
    therapy,
    personality,
    sessionStart: new Date(),
  });
  
  const scrollViewRef = useRef<RNScrollView>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  // AI Personality Configuration
  const getAIPersonality = useCallback(() => {
    const personalities = {
      supportive: {
        name: 'Supportive Bestie',
        emoji: '🤗',
        prompt: `You are a supportive, empathetic AI companion named Bestie. You're here to provide emotional support, encouragement, and a listening ear. You're warm, understanding, and always try to help users feel better about themselves and their situations. You use gentle, caring language and offer practical advice when appropriate.`,
        welcomeMessage: "Hi there! I'm your supportive bestie 🤗 I'm here to listen, encourage, and help you through whatever you're going through. How are you feeling today?",
      },
      motivational: {
        name: 'Motivational Bestie',
        emoji: '💪',
        prompt: `You are a motivational AI companion named Bestie. You're energetic, positive, and focused on helping users achieve their goals and overcome challenges. You provide encouragement, celebrate achievements, and help users stay motivated. You use uplifting language and are always ready to cheer them on.`,
        welcomeMessage: "Hey! I'm your motivational bestie 💪 Ready to crush some goals and overcome challenges together? What's on your mind today?",
      },
      therapeutic: {
        name: 'Therapeutic Bestie',
        emoji: '🧠',
        prompt: `You are a therapeutic AI companion named Bestie. You provide gentle guidance, help users process emotions, and offer therapeutic techniques like mindfulness, cognitive reframing, and emotional regulation. You're professional yet warm, and always prioritize the user's mental well-being.`,
        welcomeMessage: "Hello! I'm your therapeutic bestie 🧠 I'm here to help you process emotions and provide gentle guidance. What would you like to explore together?",
      },
      creative: {
        name: 'Creative Bestie',
        emoji: '🎨',
        prompt: `You are a creative AI companion named Bestie. You help users express themselves through art, writing, and creative activities. You're imaginative, inspiring, and help users tap into their creative potential. You suggest creative exercises and help users explore their artistic side.`,
        welcomeMessage: "Hi! I'm your creative bestie 🎨 Let's explore your imagination and create something amazing together! What creative adventure shall we embark on?",
      },
    };

    return personalities[personality as keyof typeof personalities] || personalities.supportive;
  }, [personality]);

  // Initialize chat with welcome message
  useEffect(() => {
    const aiPersonality = getAIPersonality();
    const welcomeMessage: Message = {
      id: 'welcome',
      text: aiPersonality.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    loadChatHistory();
  }, [getAIPersonality]);

  // Load chat history from storage
  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('bestie_chat_history');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save chat history to storage
  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('bestie_chat_history', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem('bestie_chat_history');
      const aiPersonality = getAIPersonality();
      const welcomeMessage: Message = {
        id: 'welcome',
        text: aiPersonality.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      HapticService.success();
    } catch (error) {
      console.error('Error clearing chat history:', error);
      HapticService.error();
    }
  };

  // Animate send button
  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Start typing animation
  const startTypingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Stop typing animation
  const stopTypingAnimation = () => {
    typingAnimation.stopAnimation();
    typingAnimation.setValue(0);
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    animateSendButton();

    // Start typing animation
    startTypingAnimation();

    try {
      // Prepare chat history for AI
      const chatHistory = newMessages
        .filter(msg => !msg.isTyping)
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.text }],
        }));

      // Get AI personality and create enhanced prompt
      const aiPersonality = getAIPersonality();
      const contextPrompt = `
${aiPersonality.prompt}

Current context:
- User's mood: ${chatContext.mood || 'Not specified'}
- Therapy session: ${chatContext.therapy || 'General chat'}
- Session started: ${chatContext.sessionStart?.toLocaleTimeString()}

Please respond as Bestie, maintaining your personality while being helpful and supportive. Keep responses conversational and under 200 words.
      `;

      // Add context to the conversation
      const enhancedHistory = [
        { role: 'user', parts: [{ text: contextPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. I\'m ready to chat as your supportive AI companion.' }] },
        ...chatHistory.slice(0, -1), // Exclude the last user message
      ];

      // Get AI response
      const aiResponse = await GoogleAIService.chatWithHistory(enhancedHistory, userMessage.text);
      
      // Stop typing animation
      stopTypingAnimation();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      
      HapticService.patterns.aiResponse();
    } catch (error) {
      console.error('Error getting AI response:', error);
      stopTypingAnimation();
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. 💙",
        isUser: false,
        timestamp: new Date(),
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      HapticService.error();
    } finally {
      setIsLoading(false);
    }
  };

  // Render typing indicator
  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
        <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
        <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
      </View>
    </View>
  );

  // Render message
  const renderMessage = (message: Message, index: number) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userMessageBubble : styles.aiMessageBubble,
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
        <Text
          variant="regular"
          size="xs"
          color={message.isUser ? COLORS.cardBackground : COLORS.lightText}
          style={styles.messageTime}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  // Quick actions for new conversations
  const renderQuickActions = () => {
    if (messages.length > 1 || isLoading) return null;

    const allQuickActions = [
      { text: "How are you feeling?", icon: "heart", color: COLORS.purple },
      { text: "I need some advice", icon: "bulb", color: COLORS.teal },
      { text: "Tell me something positive", icon: "sunny", color: COLORS.yellow },
      { text: "Help me relax", icon: "leaf", color: COLORS.successGreen },
      { text: "I'm stressed", icon: "flash", color: COLORS.warningRed },
      { text: "I'm anxious", icon: "alert-circle", color: COLORS.pink },
      { text: "I'm sad", icon: "sad", color: COLORS.lightBlue },
      { text: "I'm angry", icon: "flame", color: COLORS.orange },
      { text: "I need motivation", icon: "rocket", color: COLORS.darkblue },
      { text: "I'm lonely", icon: "people-outline", color: COLORS.secondaryText },
      { text: "I'm overwhelmed", icon: "layers", color: COLORS.orange },
      { text: "I need sleep help", icon: "moon", color: COLORS.darkblue },
      { text: "I'm grateful", icon: "gift", color: COLORS.mint },
      { text: "I want to vent", icon: "chatbubbles", color: COLORS.pink },
      { text: "I need distraction", icon: "game-controller", color: COLORS.teal },
      { text: "I'm proud", icon: "trophy", color: COLORS.yellow },
    ];

    // Randomly select 4 suggestions
    const shuffled = [...allQuickActions].sort(() => 0.5 - Math.random());
    const quickActions = shuffled.slice(0, 4);

    return (
      <View style={styles.quickActionsContainer}>
        <Text variant="semibold" size="md" color={COLORS.primaryText} style={styles.quickActionsTitle}>
          Quick Start
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionButton, { backgroundColor: action.color }]}
              onPress={() => {
                setInputText(action.text);
                HapticService.light();
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={action.icon as any} size={24} color={COLORS.cardBackground} />
              <Text variant="semibold" size="sm" color={COLORS.cardBackground} style={styles.quickActionText}>
                {action.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const aiPersonality = getAIPersonality();

  return (
    <ScreenWrapper 
      title={`${aiPersonality.name} ${aiPersonality.emoji}`}
      canGoBack={true}
    >
      <View style={styles.chatContainer}>
        <RNScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {renderQuickActions()}
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && renderTypingIndicator()}
        </RNScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor={COLORS.lightText}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                editable={!isLoading}
              />
              <View style={styles.inputActions}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearChatHistory}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.lightText} />
                </TouchableOpacity>
                <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                  <TouchableOpacity
                    onPress={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor: inputText.trim() && !isLoading ? COLORS.purple : COLORS.disabledColor,
                      }
                    ]}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={COLORS.cardBackground} 
                    />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.offwhite,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  quickActionsContainer: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  quickActionsTitle: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
    width: '100%',
  },
  quickActionButton: {
    width: (screenWidth - SPACING.md * 2 - SPACING.md) / 2,
    height: 80,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    elevation: 4,
  },
  quickActionText: {
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
  messageContainer: {
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  userMessageBubble: {
    backgroundColor: COLORS.purple,
    borderBottomRightRadius: RADIUS.sm,
  },
  aiMessageBubble: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: RADIUS.sm,
  },
  messageText: {
    lineHeight: 20,
  },
  messageTime: {
    marginTop: SPACING.xs,
    opacity: 0.7,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderBottomLeftRadius: RADIUS.sm,
    ...SHADOWS.sm,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.purple,
    marginHorizontal: 1,
  },
  inputContainer: {
    backgroundColor: COLORS.offwhite,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl + 30, // Higher padding for tab navigation
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    color: COLORS.primaryText,
    maxHeight: 100,
    paddingVertical: SPACING.xs,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  clearButton: {
    padding: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'transparent',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
});

export default BestieChatScreen;
