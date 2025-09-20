# SanityAI - Project Structure & Architecture

## 📁 **Clean Project Structure**

### **Root Level**
```
SanityAI/
├── App.tsx                    # Main app entry point (Tamagui)
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript configuration
├── tamagui.config.ts          # Tamagui configuration
├── metro.config.js            # Metro bundler configuration
└── index.js                   # App entry point
```

### **Source Code (`src/`)**

#### **🎨 Components (`src/components/`)**
Organized by functionality:

```
components/
├── ui/                        # Core UI components
│   ├── AppCard.tsx           # Reusable card component
│   ├── Header.tsx            # Basic header component
│   ├── ScreenWrapper.tsx     # Screen layout wrapper
│   ├── Text.tsx              # Typography component
│   ├── UnifiedHeader.tsx     # Advanced header with actions
│   └── UnifiedLayout.tsx     # Advanced layout wrapper
├── mood/                      # Mood-related components
│   ├── MoodContextModal.tsx  # Mood context input modal
│   ├── MoodPieChart.tsx      # 7-day mood visualization
│   └── MoodSelectionGrid.tsx # Mood selection interface
└── dialogs/                   # Dialog components
    └── ModernDialog.tsx      # Reusable dialog system
```

#### **📱 Screens (`src/screens/`)**
Organized by feature:

```
screens/
├── AppLockScreen.tsx         # App authentication
├── SanctuaryDashboard.tsx    # Main dashboard
├── chat/                     # Chat functionality
│   └── BestieChatScreen.tsx  # AI chat interface
├── journal/                  # Journal functionality
│   ├── JournalEntryScreen.tsx # Journal writing
│   └── JournalScreen.tsx     # Journal home
├── mood/                     # Mood tracking
│   └── MoodSelectionScreen.tsx # Daily mood check-in
└── therapy/                  # Therapy tools
    ├── ArtStudioScreen.tsx   # Creative therapy
    ├── CbtChallengeScreen.tsx # CBT exercises
    ├── MindfulMomentScreen.tsx # Breathing exercises
    └── TherapyMenuScreen.tsx # Therapy selection
```

#### **🧭 Navigation (`src/navigation/`)**
Streamlined navigation:

```
navigation/
├── AppNavigator.tsx          # Root navigation (auth flow)
├── MaterialTabNavigator.tsx  # Main tab navigation
└── TherapyStackNavigator.tsx # Therapy screens stack
```

#### **⚙️ Services (`src/services/`)**
Core functionality:

```
services/
├── googleAI.js               # Google AI integration
├── HapticService.ts          # Haptic feedback
├── JournalAnalysisService.ts # AI journal analysis
└── MoodDatabase.ts           # Mood data management
```

#### **🗄️ Database (`src/db/`)**
Data persistence:

```
db/
└── RealmConfig.ts            # Realm database configuration
```

#### **📊 Data (`src/data/`)**
Static data:

```
data/
└── therapyData.ts            # Therapy categories and data
```

#### **🎨 Constants (`src/constants/`)**
Design system:

```
constants/
├── config.js                 # App configuration
└── designSystem.ts           # Design tokens and themes
```

#### **📝 Types (`src/types/`)**
TypeScript definitions:

```
types/
├── mood.ts                   # Mood-related types
└── therapy.ts                # Therapy-related types
```

## 🏗️ **Architecture Overview**

### **App Flow**
1. **App.tsx** → **AppNavigator** → **MaterialTabNavigator**
2. **4 Main Tabs**: Sanctuary, Chat, Therapy, Journal
3. **Therapy Tab** → **TherapyStackNavigator** → Individual therapy screens

### **Key Features**
- **AI-Powered Journal**: Sentiment analysis and tagging
- **Mood Tracking**: Daily check-ins with 7-day visualization
- **Therapy Tools**: CBT, Mindfulness, Creative therapy
- **AI Chat**: Conversational AI for mental health support
- **Secure Storage**: Realm database for offline data

### **Design System**
- **Tamagui**: UI framework for consistent design
- **Material Design**: Following Material You principles
- **Custom Components**: Reusable UI components
- **Responsive**: Adaptive layouts for different screen sizes

## 🧹 **Cleanup Summary**

### **Removed Files**
- ❌ `App.js` (duplicate of App.tsx)
- ❌ `TabNavigator.tsx` (unused navigation)
- ❌ `HomeStackNavigator.tsx` (unused navigation)
- ❌ 8 unused screens (ChatTabScreen, TherapyToolboxScreen, etc.)
- ❌ 7 unused components (MaterialButton, MaterialCard, etc.)
- ❌ 2 unused constants files (materialYouDesign.ts, materialYouTheme.ts)
- ❌ `WebStorageService.ts` (unused service)

### **Reorganized Structure**
- ✅ **Screens**: Grouped by feature (therapy/, journal/, chat/, mood/)
- ✅ **Components**: Grouped by type (ui/, mood/, dialogs/)
- ✅ **Updated Imports**: All import paths corrected
- ✅ **Maintained Functionality**: All active features preserved

### **Benefits**
- 🚀 **Faster Development**: Easier to find and modify files
- 🧹 **Cleaner Codebase**: Removed 20+ unnecessary files
- 📁 **Better Organization**: Logical grouping of related files
- 🔧 **Easier Maintenance**: Clear separation of concerns
- 📱 **Scalable Structure**: Easy to add new features

## 🚀 **Getting Started**

1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm start`
3. **Run on Android**: `npm run android`
4. **Run on iOS**: `npm run ios`

## 📱 **Active Features**

- ✅ **Sanctuary Dashboard**: Main hub with mood tracking
- ✅ **AI Chat**: Conversational mental health support
- ✅ **Therapy Tools**: CBT, Mindfulness, Creative therapy
- ✅ **Journal System**: AI-powered writing with analysis
- ✅ **Mood Tracking**: Daily check-ins with insights
- ✅ **App Lock**: Secure authentication

---

*This structure provides a clean, maintainable, and scalable foundation for the SanityAI mental health application.*
