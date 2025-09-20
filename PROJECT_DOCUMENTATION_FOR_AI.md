# SanityAI - Complete Project Documentation for AI Understanding

## 🎯 **Project Overview**

**SanityAI** is a comprehensive mental health companion app built with React Native, TypeScript, and Google's Gemini AI. The app provides AI-powered emotional support, mood tracking, therapy tools, and journaling capabilities to help users manage their mental health and emotional well-being.

---

## 🏗️ **Technical Architecture**

### **Core Technology Stack**
- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript (strict mode enabled)
- **UI Framework**: Custom design system with React Native Paper
- **Navigation**: React Navigation v7 (Stack + Tab Navigators)
- **Database**: AsyncStorage (local) + Realm (configured but using AsyncStorage)
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Styling**: Custom design system with consistent spacing, colors, typography
- **Icons**: Expo Vector Icons (Ionicons)
- **Fonts**: Nunito (Google Fonts)

### **Project Structure**
```
SanityAI/
├── App.tsx                          # Main app entry point
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── ui/                     # Core UI components
│   │   │   ├── AppCard.tsx         # Reusable card component
│   │   │   ├── Header.tsx          # Basic header
│   │   │   ├── ScreenWrapper.tsx   # Screen layout wrapper
│   │   │   ├── Text.tsx            # Typography component
│   │   │   ├── UnifiedHeader.tsx   # Advanced header
│   │   │   └── UnifiedLayout.tsx   # Advanced layout
│   │   ├── mood/                   # Mood-related components
│   │   │   ├── MoodContextModal.tsx # Mood context input
│   │   │   ├── MoodPieChart.tsx    # 7-day mood visualization
│   │   │   └── MoodSelectionGrid.tsx # Mood selection interface
│   │   └── dialogs/                # Dialog components
│   │       └── ModernDialog.tsx    # Reusable dialog system
│   ├── screens/                    # App screens
│   │   ├── AppLockScreen.tsx       # PIN authentication
│   │   ├── SanctuaryDashboard.tsx  # Main dashboard
│   │   ├── chat/
│   │   │   └── BestieChatScreen.tsx # AI chat interface
│   │   ├── journal/
│   │   │   ├── JournalEntryScreen.tsx # Journal writing
│   │   │   └── JournalScreen.tsx   # Journal home
│   │   ├── mood/
│   │   │   └── MoodSelectionScreen.tsx # Daily mood check-in
│   │   └── therapy/
│   │       ├── ArtStudioScreen.tsx # Creative therapy
│   │       ├── CbtChallengeScreen.tsx # CBT exercises
│   │       ├── MindfulMomentScreen.tsx # Breathing exercises
│   │       └── TherapyMenuScreen.tsx # Therapy selection
│   ├── navigation/                 # Navigation configuration
│   │   ├── AppNavigator.tsx        # Root navigation (auth flow)
│   │   ├── MaterialTabNavigator.tsx # Main tab navigation
│   │   └── TherapyStackNavigator.tsx # Therapy screens stack
│   ├── services/                   # Core functionality
│   │   ├── googleAI.js             # Google AI integration
│   │   ├── HapticService.ts        # Haptic feedback
│   │   ├── JournalAnalysisService.ts # AI journal analysis
│   │   └── MoodDatabase.ts         # Mood data management
│   ├── db/                         # Data persistence
│   │   └── RealmConfig.ts          # Realm database configuration
│   ├── data/                       # Static data
│   │   └── therapyData.ts          # Therapy categories and data
│   ├── constants/                  # Design system
│   │   ├── config.js               # App configuration
│   │   └── designSystem.ts         # Design tokens and themes
│   └── types/                      # TypeScript definitions
│       ├── mood.ts                 # Mood-related types
│       └── therapy.ts              # Therapy-related types
```

---

## 🎨 **Design System & UI/UX**

### **Color Palette**
```typescript
COLORS = {
  // Primary Colors
  offwhite: '#FFF8F0',
  darkblue: '#2D1B69',
  
  // Fun Vibrant Colors
  primaryBlue: '#6C5CE7',
  lightBlue: '#A29BFE',
  successGreen: '#00B894',
  warningRed: '#E17055',
  
  // Fun Accent Colors
  purple: '#6C5CE7',
  pink: '#FD79A8',
  orange: '#FDCB6E',
  teal: '#00CEC9',
  yellow: '#FDCB6E',
  mint: '#00B894',
  
  // Chat Bubbles
  userBubble: '#6C5CE7',
  aiBubble: '#F8F9FA',
  
  // Text Colors
  primaryText: '#2D1B69',
  secondaryText: '#636E72',
  lightText: '#B2BEC3',
  
  // Background Colors
  cardBackground: '#FFFFFF',
  modalBackground: 'rgba(45, 27, 105, 0.3)',
}
```

### **Typography System**
```typescript
TYPOGRAPHY = {
  fontFamily: {
    regular: 'Nunito_400Regular',
    medium: 'Nunito_500Medium',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
  },
  sizes: {
    xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, xxxl: 32,
  }
}
```

### **Spacing & Layout**
```typescript
SPACING = { xs: 4, sm: 8, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 48 }
RADIUS = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999 }
```

---

## 🔄 **App Flow & Navigation**

### **Authentication Flow**
```
App Start
├── Check AsyncStorage for 'app_pin'
├── If no PIN → AppLockScreen (setup flow)
│   ├── Enter 4-digit PIN
│   ├── Confirm PIN
│   ├── Store in AsyncStorage
│   └── Navigate to Main App
└── If PIN exists → AppLockScreen (verification)
    ├── Enter PIN
    ├── Verify against stored PIN
    └── Navigate to Main App
```

### **Main App Navigation**
```
Main App (Authenticated)
├── MaterialTabNavigator
│   ├── Sanctuary Tab → SanctuaryDashboard
│   ├── Chat Tab → BestieChatScreen
│   ├── Therapy Tab → TherapyStackNavigator
│   │   ├── TherapyMenuScreen
│   │   ├── MindfulMomentScreen
│   │   ├── ArtStudioScreen
│   │   ├── CbtChallengeScreen
│   │   ├── JournalEntryScreen
│   │   └── MoodSelectionScreen
│   └── Journal Tab → JournalScreen
```

---

## 🤖 **AI Integration & Features**

### **Google AI Configuration**
```javascript
GOOGLE_AI_CONFIG = {
  API_KEY: 'AIzaSyD15cCs8Dlm1eBciuJR8BuMR8ZXOL--0VM',
  MODEL_NAME: 'gemini-2.5-flash',
  GENERATION_CONFIG: {
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
}
```

### **AI Personality System**
The app supports multiple AI personalities for different therapeutic approaches:

1. **Supportive Bestie** 🤗
   - Empathetic, warm, understanding
   - Provides emotional support and encouragement
   - Uses gentle, caring language

2. **Motivational Bestie** 💪
   - Energetic, positive, goal-focused
   - Helps users achieve goals and overcome challenges
   - Uses uplifting, encouraging language

3. **Therapeutic Bestie** 🧠
   - Professional yet warm
   - Provides therapeutic techniques (mindfulness, CBT)
   - Focuses on mental well-being

4. **Creative Bestie** 🎨
   - Imaginative, inspiring
   - Helps with creative expression
   - Suggests creative exercises

### **Context-Aware AI Responses**
The AI considers multiple context factors:
- **User's current mood** (from mood tracking)
- **Therapy session type** (mindfulness, CBT, art therapy)
- **Personality type** (supportive, motivational, therapeutic, creative)
- **Session start time** and duration
- **Conversation history** (when available)

---

## 📱 **Core Features & Functionality**

### **1. Sanctuary Dashboard**
- **Purpose**: Main hub for daily mental health activities
- **Features**:
  - Time-based greeting (Good morning/afternoon/evening)
  - Daily mood check-in with streak tracking
  - 7-day mood overview with pie chart visualization
  - Quick access to all app features
  - Emergency support button with crisis helplines
  - Gamification elements (streak, points)

### **2. Mood Tracking System**
- **Daily Check-in**: Users select from 8 mood options
- **Mood Options**: Happy, Sad, Anxious, Tired, Frustrated, Calm, Excited, Grateful
- **Context Collection**: Optional reason/context for mood
- **Statistics**: Current streak, most frequent mood, weekly data
- **Visualization**: 7-day mood pie chart
- **Data Storage**: AsyncStorage with MoodDatabase service

### **3. AI Chat System (BestieChatScreen)**
- **Real-time Conversation**: Instant AI responses
- **Personality Selection**: 4 different AI personalities
- **Context Awareness**: Responses based on mood and therapy type
- **Message History**: Persistent chat history
- **Typing Indicators**: Animated typing dots
- **Quick Actions**: Pre-defined conversation starters
- **Error Handling**: Graceful fallbacks for API failures

### **4. Journal System**
- **Journal Entry Screen**: Rich text writing interface
- **Prompt System**: 6 different journal prompts
  - Gratitude Journal
  - Daily Reflection
  - Emotional Check-in
  - Goal Setting
  - Challenge Processing
  - Free Writing
- **AI Analysis**: Sentiment analysis and tagging (planned)
- **Data Persistence**: AsyncStorage with journal entries

### **5. Therapy Tools**
- **Mindful Moment**: Guided breathing exercises
- **Art Studio**: Creative expression through art generation
- **CBT Challenge**: Cognitive Behavioral Therapy exercises
- **Therapy Menu**: Organized therapy categories and recommendations

### **6. Emergency Support**
- **Crisis Helplines**: Direct phone links to mental health services
- **SOS Button**: Quick access to emergency resources
- **Professional Services**: KIRAN, Vandrevala Foundation, iCall, AASRA
- **Emergency Response**: 911 integration

---

## 🗄️ **Data Management**

### **Database Schema (AsyncStorage)**
```typescript
// Message Interface
interface Message {
  _id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sessionId: string;
}

// User Session Interface
interface UserSession {
  _id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
}

// Mood Entry Interface
interface MoodEntry {
  _id: string;
  mood: string;
  timestamp: Date;
  reason?: string;
}

// Journal Entry Interface
interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  timestamp: Date;
  sentiment?: string;
  tags?: string[];
  mood?: string;
  isAnalyzed: boolean;
}
```

### **Data Storage Keys**
- `app_pin`: User's 4-digit PIN
- `messages`: Chat message history
- `userSessions`: Conversation sessions
- `moodEntries`: Mood tracking data
- `journalEntries`: Journal entries
- `bestie_chat_history`: AI chat history
- `weekly_mood_data`: Weekly mood statistics

---

## 🔐 **Security & Privacy**

### **Authentication**
- **PIN-based Security**: 4-digit PIN with confirmation
- **Local Storage**: All data stored locally on device
- **No Cloud Dependencies**: Complete privacy and offline functionality
- **Biometric Ready**: Placeholder for Touch ID/Face ID

### **Data Privacy**
- **Local-First**: All user data stays on device
- **No User Tracking**: No analytics or user behavior tracking
- **Secure API Calls**: Only mood/context sent to AI (no personal data)
- **Encrypted Storage**: AsyncStorage provides basic encryption

---

## 🎯 **User Experience Features**

### **Haptic Feedback System**
```typescript
HapticService = {
  light(), medium(), heavy(),           // Impact feedback
  success(), warning(), error(),        // Notification feedback
  selection(),                          // Selection feedback
  patterns: {
    breathing: { inhale(), exhale(), hold() },
    moodSelection: { positive(), neutral(), negative() },
    messageSent(), aiResponse(),
    artCreated(), checkInComplete(),
    streakAchievement(), sosPressed(),
    pinInput(), pinComplete(), pinError()
  }
}
```

### **Animation System**
- **Mood Cards**: Scale, rotation, and pulse animations
- **Message Bubbles**: Fade-in with slide-up effect
- **Typing Indicator**: Bouncing dots with opacity changes
- **Button Presses**: Scale animation on interaction
- **Screen Transitions**: Smooth card-style transitions

### **Accessibility Features**
- **Screen Reader Support**: Proper accessibility labels
- **High Contrast**: Accessible color combinations
- **Large Touch Targets**: Minimum 44px touch areas
- **Keyboard Navigation**: Full keyboard support
- **Haptic Feedback**: Tactile feedback for interactions

---

## 🚀 **Development & Deployment**

### **Scripts Available**
```json
{
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "emulator": "./start-android-emulator.sh",
  "android-with-emulator": "npm run emulator && expo start --android",
  "type-check": "tsc --noEmit",
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
  "clean": "expo r -c"
}
```

### **Dependencies**
- **Core**: React Native 0.81.4, Expo SDK 54
- **Navigation**: React Navigation v7
- **UI**: React Native Paper, Expo Vector Icons
- **AI**: Google Generative AI
- **Storage**: AsyncStorage, Realm (configured)
- **Fonts**: Expo Google Fonts (Nunito)
- **Haptics**: Expo Haptics
- **Gradients**: Expo Linear Gradient

---

## 🔮 **Future Enhancement Opportunities**

### **Immediate Improvements**
1. **Firebase Integration**: Replace AsyncStorage with Firestore
2. **Push Notifications**: Daily mood reminders
3. **Offline Mode**: Cached AI responses
4. **Biometric Auth**: Touch ID/Face ID implementation
5. **Data Export**: Export mood/journal data

### **Advanced Features**
1. **Predictive Analytics**: Mood pattern prediction
2. **Crisis Detection**: AI-powered crisis intervention
3. **Therapist Integration**: Professional mental health support
4. **Community Features**: Peer support groups
5. **Wearable Integration**: Health data correlation

### **AI Enhancements**
1. **Custom Models**: Train specialized mental health models
2. **Multimodal AI**: Image and voice analysis
3. **Personalization**: User-specific AI personality adaptation
4. **Therapy Recommendations**: AI-driven therapy suggestions
5. **Progress Tracking**: AI-powered mental health insights

---

## 📊 **Current Limitations & Technical Debt**

### **Data Persistence**
- Messages not saved between sessions
- No user profile or preferences storage
- Limited mood history tracking

### **AI Features**
- No conversation memory between sessions
- No personalized AI responses
- No mood-based AI personality adaptation

### **User Experience**
- No onboarding flow
- No help or tutorial system
- Limited accessibility features
- No dark mode support

### **Performance**
- No image optimization
- No lazy loading
- No caching strategies
- No offline functionality

---

## 🎯 **Key Integration Points for AI**

### **Current AI Usage**
1. **Chat Conversations**: Context-aware responses based on mood and personality
2. **Journal Analysis**: Sentiment analysis and tagging (planned)
3. **Therapy Recommendations**: AI-driven therapy suggestions
4. **Mood Insights**: Pattern recognition and insights

### **AI Enhancement Opportunities**
1. **Crisis Detection**: Analyze user messages for crisis indicators
2. **Personalized Therapy**: AI-driven therapy plan customization
3. **Progress Tracking**: AI-powered mental health progress analysis
4. **Predictive Analytics**: Forecast mood patterns and triggers
5. **Multimodal Analysis**: Process text, voice, and behavioral data

---

## 🔧 **Configuration & Environment**

### **Environment Variables**
- `GOOGLE_AI_API_KEY`: Google AI API key
- `EXPO_PUBLIC_API_URL`: API endpoint (if using backend)
- `EXPO_PUBLIC_ANALYTICS_KEY`: Analytics key (if implemented)

### **Build Configuration**
- **Expo SDK**: 54.0.7
- **React Native**: 0.81.4
- **TypeScript**: 5.9.2
- **Node**: 16+ required
- **Platforms**: iOS, Android, Web

---

This documentation provides a comprehensive overview of the SanityAI project for AI understanding and integration. The app is a sophisticated mental health companion that leverages Google's Gemini AI to provide personalized, empathetic support through multiple interaction modalities including chat, journaling, mood tracking, and therapy tools.
