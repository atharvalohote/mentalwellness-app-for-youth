# Mindful AI Companion - Google Gen AI Exchange Hackathon Project

A React Native application built with TypeScript, Tamagui, and Google's Generative AI (Gemini) to provide mental health support and emotional well-being assistance.

## 🧠 About

The Mindful AI Companion is designed to help users manage their mental health through:
- **Secure PIN-based authentication** with biometric support
- **Mood tracking and check-ins** with interactive emoji selection
- **AI-powered conversations** tailored to user's emotional state
- **Emergency SOS functionality** for crisis situations
- **Local data storage** with Realm database for privacy

## 🚀 Features

### 🔐 Security & Privacy
- **App Lock Screen**: 4-digit PIN setup and authentication
- **Biometric Authentication**: Touch ID/Face ID support (ready for implementation)
- **Local Data Storage**: All conversations and mood data stored locally with Realm
- **No Cloud Dependencies**: Complete privacy and offline functionality

### 💭 Mood & Mental Health
- **Interactive Mood Check-in**: 6 different mood states with animated emoji selection
- **Context-Aware AI**: Responses tailored to user's current emotional state
- **Two Interaction Modes**: "Talk about it" and "Express it" for different needs
- **Conversation History**: Persistent chat history with timestamps

### 🤖 AI Integration
- **Google Gemini Pro**: Advanced language model for empathetic responses
- **Context-Aware Prompts**: AI responses consider mood and interaction context
- **Real-time Chat**: Instant responses with typing indicators
- **Emergency Support**: SOS button with crisis resources

### 🎨 Modern UI/UX
- **Tamagui Design System**: Consistent, beautiful, and performant UI
- **Smooth Animations**: Bouncy mood selection and smooth transitions
- **Responsive Design**: Works perfectly on all screen sizes
- **Accessibility**: Screen reader support and proper contrast ratios

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript for type safety
- **UI Library**: Tamagui for design system and performance
- **Navigation**: React Navigation v7
- **Database**: Realm for local data storage
- **AI**: Google Generative AI (Gemini Pro)
- **Authentication**: AsyncStorage + Biometric APIs
- **State Management**: React Hooks and Context

## 📱 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Google AI API Key
- iOS Simulator or Android Emulator (for mobile testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SanityAi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Google AI API**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `src/constants/config.js` with your API key:
   ```javascript
   export const GOOGLE_AI_CONFIG = {
     API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
     // ... rest of config
   };
   ```

4. **Run the application**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

## 🎯 User Flow

1. **First Launch**: User creates a 4-digit PIN for app security
2. **Daily Check-in**: User selects their current mood from 6 options
3. **Interaction Choice**: User chooses to "Talk about it" or "Express it"
4. **AI Conversation**: Context-aware chat with Google Gemini
5. **Emergency Support**: SOS button available for crisis situations

## 🏗️ Architecture

### Project Structure
```
SanityAi/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── AppLockScreen.tsx    # PIN setup and authentication
│   │   ├── HomeScreen.tsx       # Mood selection and navigation
│   │   └── ChatScreen.tsx       # AI conversation interface
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx     # Main navigation stack
│   ├── services/           # API services
│   │   └── googleAI.js          # Google AI integration
│   ├── db/                 # Database configuration
│   │   └── RealmConfig.ts       # Realm schemas and service
│   ├── constants/          # Configuration and design system
│   │   ├── config.js            # App configuration
│   │   └── designSystem.ts      # Design tokens and styles
│   └── utils/              # Utility functions
├── tamagui.config.ts       # Tamagui configuration
├── tsconfig.json          # TypeScript configuration
└── App.js                 # Main app component
```

### Database Schema
- **Message**: Chat messages with mood and context
- **UserSession**: Conversation sessions with timestamps
- **MoodEntry**: Mood tracking history

## 🔧 Configuration

### Google AI Settings
```javascript
GENERATION_CONFIG: {
  temperature: 0.7,        // Balanced creativity
  topK: 40,               // Response diversity
  topP: 0.95,             // Response quality
  maxOutputTokens: 1024,  // Response length
}
```

### Design System
- **Colors**: Off-white background, dark blue text, primary blue accents
- **Typography**: Nunito font family with consistent sizing
- **Spacing**: 8px base unit with consistent scale
- **Components**: Tamagui-based with custom styling

## 🚀 Deployment

### For Hackathon Demo

1. **Web Version** (Recommended for demo):
   ```bash
   npm run web
   ```
   Share the localhost URL or deploy to Expo hosting

2. **Mobile App**:
   - Use Expo Go app to scan QR code
   - Or build standalone app with `expo build`

3. **Development Build**:
   ```bash
   expo run:ios
   expo run:android
   ```

## 🎨 Customization

### Adding New Moods
Edit `MOODS` array in `HomeScreen.tsx`:
```typescript
const MOODS: Mood[] = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  // Add new moods here
];
```

### Modifying AI Behavior
Update prompts in `ChatScreen.tsx`:
```typescript
const createContextPrompt = (userInput, mood, context) => {
  // Customize AI responses here
};
```

### Styling Changes
Modify `src/constants/designSystem.ts` for colors, typography, and spacing.

## 📝 Hackathon Features

This project demonstrates:
- ✅ **Google Gen AI Integration**: Advanced language model usage
- ✅ **Modern React Native**: TypeScript, Tamagui, and best practices
- ✅ **Security & Privacy**: Local storage and authentication
- ✅ **Mental Health Focus**: Empathetic AI for emotional support
- ✅ **Beautiful UI/UX**: Smooth animations and intuitive design
- ✅ **Cross-Platform**: Works on iOS, Android, and Web
- ✅ **Production Ready**: Error handling, loading states, and accessibility

## 🚨 Emergency Resources

The app includes SOS functionality with these resources:
- **911**: Emergency Services
- **988**: Suicide & Crisis Lifeline
- **741741**: Crisis Text Line (Text HOME)

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📄 License

MIT License - feel free to use for your own projects!

---

**Built for Google Gen AI Exchange Hackathon** 🏆

*Supporting mental health through AI-powered conversations*
