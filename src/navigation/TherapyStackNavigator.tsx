import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, LAYOUT } from '../constants/designSystem';

// Screens
import TherapyMenuScreen from '../screens/therapy/TherapyMenuScreen';
import MindfulMomentScreen from '../screens/therapy/MindfulMomentScreen';
import ArtStudioScreen from '../screens/therapy/ArtStudioScreen';
import CbtChallengeScreen from '../screens/therapy/CbtChallengeScreen';
import JournalEntryScreen from '../screens/journal/JournalEntryScreen';
import MoodSelectionScreen from '../screens/mood/MoodSelectionScreen';

const Stack = createStackNavigator();

interface TherapyStackNavigatorProps {}

const TherapyStackNavigator: React.FC<TherapyStackNavigatorProps> = () => {
  return (
    <Stack.Navigator
      initialRouteName="TherapyMenu"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureResponseDistance: 50,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
              opacity: current.progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
            },
          };
        },
        transitionSpec: {
          open: {
            animation: 'timing',
            config: {
              duration: LAYOUT.animationDuration.normal,
            },
          },
          close: {
            animation: 'timing',
            config: {
              duration: LAYOUT.animationDuration.normal,
            },
          },
        },
      }}
    >
      <Stack.Screen 
        name="TherapyMenu" 
        component={TherapyMenuScreen}
        options={{
          title: 'Therapy Menu',
        }}
      />
      <Stack.Screen 
        name="MindfulMoment" 
        component={MindfulMomentScreen}
        options={{
          title: 'Mindful Moment',
        }}
      />
      <Stack.Screen 
        name="ArtStudio" 
        component={ArtStudioScreen}
        options={{
          title: 'Art Studio',
        }}
      />
      <Stack.Screen 
        name="CbtChallenge" 
        component={CbtChallengeScreen}
        options={{
          title: 'CBT Challenge',
        }}
      />
      <Stack.Screen 
        name="JournalEntry" 
        component={JournalEntryScreen}
        options={{
          title: 'Journal Entry',
        }}
      />
      <Stack.Screen 
        name="MoodSelection" 
        component={MoodSelectionScreen}
        options={{
          title: 'Daily Check-in',
        }}
      />
    </Stack.Navigator>
  );
};

export default TherapyStackNavigator;
