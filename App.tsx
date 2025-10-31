import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * Main App Component
 * Entry point for the Secure Todo List application
 * 
 * Features:
 * - React Navigation for seamless screen transitions
 * - Biometric authentication using expo-local-authentication
 * - Secure todo management with Zustand state management
 * - Persistent storage with AsyncStorage
 * - Clean and modern UI matching the provided design
 * - Comprehensive security checks before CRUD operations
 */

export default function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#6366f1" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};



