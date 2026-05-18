import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PropertySelectionScreen from './src/screens/PropertySelectionScreen';
import MainNavigator from './src/navigation/MainNavigator';
import { colors } from './src/theme/colors';
import type { Property } from './src/types';

function AppContent() {
  const { isLoggedIn, isLoading } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // If user logs out, clear property selection
  useEffect(() => {
    if (!isLoggedIn) {
      setSelectedProperty(null);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!selectedProperty) {
    return <PropertySelectionScreen onSelectProperty={setSelectedProperty} />;
  }

  return (
    <MainNavigator
      property={selectedProperty}
      onBackToPropertySelect={() => setSelectedProperty(null)}
    />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
