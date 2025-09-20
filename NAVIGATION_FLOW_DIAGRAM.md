# SanityAI - Navigation Flow Diagrams

## 🔄 Main App Flow

```
┌─────────────────┐
│   App Start     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Font Loading   │
│   (Nunito)      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ AppNavigator    │
│ Check Auth      │
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ Auth?   │
    └────┬────┘
         │
    ┌────▼────┐        ┌──────────────┐
    │   No    │        │     Yes      │
    └────┬────┘        └──────┬───────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│ AppLockScreen   │  │  HomeScreen     │
│                 │  │                 │
│ • PIN Setup     │  │ • Mood Select   │
│ • PIN Verify    │  │ • Action Buttons│
│ • Biometric     │  │ • Quick Actions │
└─────────┬───────┘  └─────────┬───────┘
          │                    │
          │                    │
          ▼                    │
┌─────────────────┐            │
│   onUnlock()    │            │
│                 │            │
│ isAuthenticated │            │
│    = true       │            │
└─────────┬───────┘            │
          │                    │
          └────────┬───────────┘
                   │
                   ▼
            ┌─────────────────┐
            │  HomeScreen     │
            │                 │
            │ • Welcome Msg   │
            │ • 8 Mood Cards  │
            │ • Talk/Express  │
            │ • SOS Info      │
            └─────────┬───────┘
                      │
                      │ navigation.navigate('Chat', {mood, context})
                      │
                      ▼
            ┌─────────────────┐
            │  ChatScreen     │
            │                 │
            │ • AI Chat       │
            │ • Message Hist  │
            │ • Typing Anim   │
            │ • SOS Button    │
            └─────────┬───────┘
                      │
                      │ navigation.goBack()
                      │
                      ▼
            ┌─────────────────┐
            │  HomeScreen     │
            │   (Return)      │
            └─────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────────┐
│ App Launch      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Check AsyncStorage│
│   'app_pin'     │
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ PIN     │
    │ Exists? │
    └────┬────┘
         │
    ┌────▼────┐        ┌──────────────┐
    │   No    │        │     Yes      │
    └────┬────┘        └──────┬───────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│   New User      │  │ Returning User  │
│                 │  │                 │
│ isSettingUp     │  │ isSettingUp     │
│    = true       │  │    = false      │
└─────────┬───────┘  └─────────┬───────┘
          │                    │
          ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│ PIN Setup Flow  │  │ PIN Verify Flow │
│                 │  │                 │
│ 1. Enter PIN    │  │ 1. Enter PIN    │
│ 2. Confirm PIN  │  │ 2. Verify PIN   │
│ 3. Store PIN    │  │ 3. Unlock App   │
│ 4. Unlock App   │  │                 │
└─────────┬───────┘  └─────────┬───────┘
          │                    │
          └────────┬───────────┘
                   │
                   ▼
            ┌─────────────────┐
            │   HomeScreen    │
            │   (Unlocked)    │
            └─────────────────┘
```

## 🏠 HomeScreen User Journey

```
┌─────────────────┐
│  HomeScreen     │
│                 │
│ "Welcome back!" │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Mood Selection │
│                 │
│ 😊 😔 😰 😴    │
│ 😤 😌 🤩 😌    │
│                 │
│ 8 Animated Cards│
└─────────┬───────┘
          │
          ▼
    ┌─────────┐
    │ Mood    │
    │Selected?│
    └────┬────┘
         │
    ┌────▼────┐        ┌──────────────┐
    │   No    │        │     Yes      │
    └────┬────┘        └──────┬───────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│ Action Buttons  │  │ Action Buttons  │
│                 │  │                 │
│ • Talk (disabled)│  │ • Talk (enabled)│
│ • Express (disabled)│ │ • Express (enabled)│
└─────────────────┘  └─────────┬───────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │ Action Selected │
                    │                 │
                    │ • Talk about it │
                    │ • Express it    │
                    └─────────┬───────┘
                              │
                              │ navigation.navigate('Chat', {mood, context})
                              │
                              ▼
                    ┌─────────────────┐
                    │  ChatScreen     │
                    │                 │
                    │ • Welcome Msg   │
                    │ • AI Chat       │
                    │ • Message Input │
                    └─────────────────┘
```

## 💬 ChatScreen User Journey

```
┌─────────────────┐
│  ChatScreen     │
│                 │
│ • Header        │
│ • Messages      │
│ • Input Area    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Welcome Message │
│                 │
│ Based on mood   │
│ and context     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Types      │
│ Message         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Send Message    │
│                 │
│ • Animate Button│
│ • Add to Chat   │
│ • Show Typing   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ AI Processing   │
│                 │
│ • Typing Dots   │
│ • Google AI     │
│ • Generate Resp │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ AI Response     │
│                 │
│ • Stop Typing   │
│ • Add Message   │
│ • Animate In    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Continue Chat   │
│                 │
│ • More Messages │
│ • Back to Home  │
│ • SOS Access    │
└─────────────────┘
```

## 🎨 Animation Flow

```
┌─────────────────┐
│ User Interaction│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Trigger Animation│
│                 │
│ • Button Press  │
│ • Mood Select   │
│ • Message Send  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Animation Types │
│                 │
│ • Scale         │
│ • Rotation      │
│ • Pulse         │
│ • Fade          │
│ • Slide         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Native Driver   │
│                 │
│ • 60fps         │
│ • Smooth        │
│ • Performant    │
└─────────────────┘
```

## 🔧 Data Flow

```
┌─────────────────┐
│ User Input      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ React State     │
│                 │
│ • useState      │
│ • useEffect     │
│ • useRef        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ AsyncStorage    │
│                 │
│ • PIN Storage   │
│ • Persistence   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Google AI API   │
│                 │
│ • Gemini Model  │
│ • Context Aware │
│ • Response Gen  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ UI Update       │
│                 │
│ • Message Add   │
│ • Animation     │
│ • State Update  │
└─────────────────┘
```

## 🚀 Feature Expansion Map

```
Current App
├── Authentication
│   ├── PIN Setup ✅
│   ├── PIN Verify ✅
│   └── Biometric (placeholder)
├── Mood Selection
│   ├── 8 Moods ✅
│   ├── Animations ✅
│   └── Color Coding ✅
├── AI Chat
│   ├── Google Gemini ✅
│   ├── Context Aware ✅
│   └── Animated UI ✅
└── Navigation
    ├── Stack Navigator ✅
    └── Conditional Auth ✅

Potential Additions
├── Profile Management
│   ├── User Settings
│   ├── Preferences
│   └── Avatar
├── Mood Tracking
│   ├── History
│   ├── Trends
│   └── Analytics
├── Enhanced Chat
│   ├── Message History
│   ├── Export Chat
│   └── Chat Themes
├── Additional Screens
│   ├── Onboarding
│   ├── Settings
│   ├── History
│   └── Emergency
├── Advanced Features
│   ├── Push Notifications
│   ├── Offline Mode
│   ├── Dark Mode
│   └── Accessibility
└── Navigation Enhancements
    ├── Tab Navigator
    ├── Drawer Navigator
    └── Deep Linking
```

This comprehensive documentation provides a complete overview of the current app structure and serves as a roadmap for future development and feature additions.
