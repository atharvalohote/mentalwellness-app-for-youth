import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

// Screens
import BestieChatScreen from '../screens/chat/BestieChatScreen';
import TherapyStackNavigator from './TherapyStackNavigator';
import JournalScreen from '../screens/journal/JournalScreen';
import SanctuaryDashboard from '../screens/SanctuaryDashboard';

const Tab = createBottomTabNavigator();

const MaterialTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          switch (route.name) {
            case 'Sanctuary':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chat' : 'chat-outline';
              break;
            case 'Therapy':
              iconName = focused ? 'lightbulb' : 'lightbulb-outline';
              break;
            case 'Journal':
              iconName = focused ? 'book-open' : 'book-open-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 40,
          position: 'absolute',
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_500Medium',
          fontSize: 12,
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Sanctuary" 
        component={SanctuaryDashboard}
        options={{
          title: 'Sanctuary',
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={BestieChatScreen}
        options={{
          title: 'Bestie',
        }}
      />
      <Tab.Screen 
        name="Therapy" 
        component={TherapyStackNavigator}
        options={{
          title: 'Therapy',
        }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{
          title: 'Journal',
        }}
      />
    </Tab.Navigator>
  );
};

export default MaterialTabNavigator;
