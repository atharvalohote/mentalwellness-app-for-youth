# SanityAI - App Workflow & Navigation Documentation

## 📱 App Overview
**SanityAI** is a mental health companion app that provides AI-powered emotional support through mood-based conversations. The app uses Google's Gemini AI to provide personalized, empathetic responses based on the user's current emotional state.

---

## 🏗️ App Architecture

### **Tech Stack**
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6 (Stack Navigator)
- **UI Library**: Custom components with React Native core
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: AsyncStorage for PIN persistence
- **AI Service**: Google Generative AI (Gemini 1.5 Flash)
- **Fonts**: Nunito (Google Fonts)
- **Icons**: Expo Vector Icons (Ionicons)

### **Project Structure**
```
src/
├── components/           # Reusable UI components
│   └── Text.tsx         # Custom Text component with Nunito font
├── constants/           # App configuration and design system
│   ├── config.js        # API keys and app config
│   └── designSystem.ts  # Colors, spacing, typography, shadows
├── db/                  # Database configurations
│   ├── RealmConfig.ts   # Realm database setup (unused)
│   └── WebStorageService.ts # Web storage service (unused)
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx # Main navigation logic
├── screens/             # App screens
│   ├── AppLockScreen.tsx # PIN authentication screen
│   ├── HomeScreen.tsx   # Mood selection and main hub
│   └── ChatScreen.tsx   # AI conversation interface
├── services/            # External services
│   └── googleAI.js      # Google AI integration
└── utils/               # Utility functions (empty)
```

---

## 🔄 Navigation Flow

### **1. App Entry Point**
```
App.js
├── Font Loading (Nunito)
├── SafeAreaProvider
├── TamaguiProvider (unused)
└── AppNavigator
```

### **2. Authentication Flow**
```
AppNavigator
├── Check Authentication Status
│   ├── AsyncStorage.getItem('app_pin')
│   └── Set isAuthenticated state
├── Loading State (null)
└── Conditional Navigation
    ├── If NOT authenticated → AppLockScreen
    └── If authenticated → Main App Flow
```

### **3. Main App Flow**
```
Main App (Authenticated)
├── HomeScreen (Root)
│   ├── Mood Selection
│   ├── Action Buttons
│   └── Navigation to Chat
└── ChatScreen
    ├── AI Conversation
    ├── Message History
    └── Back to Home
```

---

## 📱 Screen-by-Screen Workflow

### **🔐 AppLockScreen**
**Purpose**: PIN-based authentication and setup

**User Journey**:
1. **First Launch**: PIN setup flow
   - Enter 4-digit PIN
   - Confirm PIN
   - Store in AsyncStorage
   - Navigate to HomeScreen

2. **Subsequent Launches**: PIN verification
   - Enter stored PIN
   - Verify against AsyncStorage
   - Navigate to HomeScreen

**Key Features**:
- 4-digit PIN input with keyboard
- PIN confirmation for new users
- Secure storage with AsyncStorage
- Biometric authentication placeholder
- Animated UI with fun shapes and colors

**State Management**:
- `pin`: Current PIN input
- `confirmPin`: PIN confirmation
- `isSettingUp`: New user flow
- `isConfirming`: PIN confirmation step
- `storedPin`: Retrieved from storage

**Navigation**:
- `onUnlock()` → Sets `isAuthenticated = true`
- Triggers navigation to HomeScreen

---

### **🏠 HomeScreen**
**Purpose**: Mood selection and main app hub

**User Journey**:
1. **Welcome Message**: "Welcome back! 👋"
2. **Mood Selection**: Choose from 8 emotional states
   - Happy, Sad, Anxious, Tired, Frustrated, Calm, Excited, Grateful
3. **Action Selection**: Choose interaction type
   - "Talk about it" → Navigate to Chat with context='talk'
   - "Express it" → Navigate to Chat with context='express'
4. **Quick Actions**: SOS information

**Key Features**:
- 8 animated mood cards with colors and emojis
- Fun multi-animation sequences (scale, rotation, pulse)
- Two action buttons with icons
- Responsive design with SafeAreaView
- Consistent Nunito font usage

**State Management**:
- `selectedMood`: Currently selected mood
- `scaleAnimations`: Array of Animated.Value for mood cards
- `rotationAnimations`: Array of Animated.Value for rotations
- `pulseAnimations`: Array of Animated.Value for pulsing

**Navigation**:
- `navigation.navigate('Chat', { mood, context })`
- Passes selected mood and interaction context

**Mood Data Structure**:
```typescript
interface Mood {
  emoji: string;
  label: string;
  value: string;
  color: string;
}
```

---

### **💬 ChatScreen**
**Purpose**: AI-powered conversation interface

**User Journey**:
1. **Welcome Message**: Context-aware greeting based on mood and context
2. **Conversation**: Real-time chat with AI
3. **Message History**: Persistent conversation
4. **SOS Access**: Emergency support information
5. **Back Navigation**: Return to HomeScreen

**Key Features**:
- Real-time AI responses using Google Gemini
- Animated message appearance (fade-in, slide-up)
- Typing indicator with animated dots
- Send button press animations
- Smooth auto-scroll to new messages
- SOS emergency support
- Context-aware AI prompts

**State Management**:
- `messages`: Array of Message objects
- `inputText`: Current input text
- `isLoading`: AI response loading state
- `typingAnimation`: Animated.Value for typing indicator
- `sendButtonScale`: Animated.Value for button press

**Message Data Structure**:
```typescript
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  animatedValue?: Animated.Value;
}
```

**AI Integration**:
- Google Gemini 1.5 Flash model
- Context-aware prompts based on mood and interaction type
- Error handling with fallback messages
- Streaming support (implemented but not used)

**Navigation**:
- `navigation.goBack()` → Return to HomeScreen
- Receives `mood` and `context` parameters from HomeScreen

---

## 🔧 Key Services & Integrations

### **Google AI Service**
**File**: `src/services/googleAI.js`

**Methods**:
- `generateText(prompt)`: Basic text generation
- `generateTextStream(prompt, onChunk)`: Streaming responses
- `chatWithHistory(chatHistory, newMessage)`: Context-aware chat

**Configuration**:
- Model: `gemini-1.5-flash`
- Temperature: 0.7
- Max tokens: 1024
- API Key: Stored in config.js

### **Design System**
**File**: `src/constants/designSystem.ts`

**Components**:
- **COLORS**: Primary, secondary, accent colors
- **SPACING**: Consistent spacing scale
- **RADIUS**: Border radius values
- **TYPOGRAPHY**: Font families and sizes
- **SHADOWS**: Elevation and shadow styles
- **CARD_STYLES**: Predefined card styles
- **CHAT_BUBBLE_STYLES**: Message bubble styles

### **Custom Text Component**
**File**: `src/components/Text.tsx`

**Features**:
- Default Nunito font family
- Variant support (regular, medium, semibold, bold)
- Size support (xs, sm, md, lg, xl, xxl, xxxl)
- Color customization
- Consistent typography across app

---

## 🎨 UI/UX Design Patterns

### **Color Scheme**
- **Primary**: Purple (#6C5CE7)
- **Secondary**: Pink (#FD79A8)
- **Background**: Off-white (#FFF8F0)
- **Text**: Dark blue (#2D3436)
- **Accent**: Yellow, Teal, Mint, Light Blue

### **Animation Patterns**
- **Mood Cards**: Scale, rotation, and pulse animations
- **Messages**: Fade-in with slide-up effect
- **Typing Indicator**: Bouncing dots with opacity changes
- **Buttons**: Scale animation on press
- **Layout**: Smooth transitions with LayoutAnimation

### **Typography**
- **Font Family**: Nunito (system-wide default)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **Sizes**: 12px to 32px scale
- **Line Heights**: Optimized for readability

---

## 🔐 Security & Data Flow

### **Authentication**
- PIN-based authentication
- AsyncStorage for PIN persistence
- No biometric authentication (placeholder only)
- Session management through navigation state

### **Data Storage**
- **AsyncStorage**: PIN storage only
- **In-Memory**: Message history (not persisted)
- **No Database**: Realm and WebStorage configured but unused

### **API Security**
- Google AI API key in config file
- No user data sent to external services beyond AI prompts
- Error handling for API failures

---

## 🚀 Feature Expansion Opportunities

### **Potential New Screens**
1. **ProfileScreen**: User settings and preferences
2. **HistoryScreen**: Past conversations and mood tracking
3. **SettingsScreen**: App configuration and preferences
4. **OnboardingScreen**: First-time user experience
5. **EmergencyScreen**: Crisis support and resources

### **Navigation Enhancements**
1. **Tab Navigator**: Bottom tab navigation for main features
2. **Drawer Navigator**: Side menu for settings and profile
3. **Modal Screens**: Overlay screens for quick actions
4. **Deep Linking**: URL-based navigation support

### **Feature Additions**
1. **Mood Tracking**: Historical mood data and trends
2. **Journaling**: Text-based mood expression
3. **Meditation**: Guided meditation and breathing exercises
4. **Resources**: Mental health resources and articles
5. **Community**: Peer support and sharing
6. **Notifications**: Reminder and check-in notifications
7. **Offline Mode**: Cached responses and offline functionality

### **Technical Improvements**
1. **State Management**: Redux or Zustand for complex state
2. **Database**: Realm or SQLite for data persistence
3. **Authentication**: Biometric authentication implementation
4. **Push Notifications**: Firebase or Expo notifications
5. **Analytics**: User behavior tracking and insights
6. **Testing**: Unit and integration tests
7. **Performance**: Image optimization and lazy loading

---

## 📊 Current Limitations

### **Data Persistence**
- Messages are not saved between sessions
- No user profile or preferences storage
- No mood history tracking

### **Authentication**
- No biometric authentication
- No password reset functionality
- No multi-user support

### **AI Features**
- No conversation memory between sessions
- No personalized AI responses
- No mood-based AI personality adaptation

### **User Experience**
- No onboarding flow
- No help or tutorial system
- No accessibility features
- No dark mode support

---

## 🔄 Navigation State Management

### **Current Flow**
```
App Start
├── Check Authentication
├── Show AppLockScreen (if not authenticated)
├── Show HomeScreen (if authenticated)
└── Navigate to ChatScreen (with mood/context params)
```

### **State Transitions**
1. **Unauthenticated → Authenticated**: PIN setup/verification
2. **Home → Chat**: Mood and context selection
3. **Chat → Home**: Back navigation
4. **Authenticated → Unauthenticated**: Logout (clears PIN)

### **Parameter Passing**
- **HomeScreen → ChatScreen**: `{ mood: string, context: 'talk' | 'express' }`
- **AppLockScreen → AppNavigator**: `onUnlock()` callback

---

This documentation provides a comprehensive overxview of the current app structure and serves as a foundation for planning new features and modifications. The modular architecture makes it easy to add new screens, services, and features while maintaining consistency with the existing design system.
