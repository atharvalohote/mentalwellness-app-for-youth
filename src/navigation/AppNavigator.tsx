import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import AppLockScreen from '../screens/AppLockScreen';
import MaterialTabNavigator from './MaterialTabNavigator';

const Stack = createStackNavigator();

interface AppNavigatorProps {}

const AppNavigator: React.FC<AppNavigatorProps> = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const hasPin = await AsyncStorage.getItem('app_pin');
      setIsAuthenticated(!!hasPin);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // In a real app, you might want to keep the PIN but just log out
      // For this demo, we'll clear the PIN to show the lock screen again
      await AsyncStorage.removeItem('app_pin');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    // You could add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
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
              },
            };
          },
        }}
      >
        {!isAuthenticated ? (
          // Authentication Flow
          <Stack.Screen name="AppLock">
            {() => <AppLockScreen onUnlock={handleUnlock} />}
          </Stack.Screen>
        ) : (
          // Main App Flow - Material Tab Navigator
          <Stack.Screen 
            name="MainApp" 
            options={{
              title: 'SanityAI',
              headerShown: false,
            }}
          >
            {() => <MaterialTabNavigator />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
