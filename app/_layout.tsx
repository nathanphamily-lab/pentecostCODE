import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { palette } from '@/constants/tokens';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ProfileProvider, useProfiles } from '@/lib/profile-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, initializing } = useAuth();
  const { selectedProfile } = useProfiles();
  // Fall through on `fontError` so a font-loading failure degrades to the
  // system face rather than leaving the app stuck behind the splash screen.
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const fontsSettled = fontsLoaded || !!fontError;

  useEffect(() => {
    if (!initializing && fontsSettled) {
      SplashScreen.hideAsync();
    }
  }, [initializing, fontsSettled]);

  if (initializing || !fontsSettled) {
    return null;
  }

  return (
    <Stack>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!user && !selectedProfile}>
        <Stack.Screen name="select-profile" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!!user && !!selectedProfile}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lesson" options={{ headerShown: false }} />
        <Stack.Screen name="quiz" options={{ headerShown: false }} />
        <Stack.Screen
          name="phonics-breakdown"
          options={{ presentation: 'transparentModal', animation: 'fade', headerShown: false }}
        />
      </Stack.Protected>
    </Stack>
  );
}

/** Light-only navigation theme, tinted to match the design tokens. */
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.accent,
    background: palette.bgFallback,
    card: palette.surface,
    text: palette.textPrimary,
    border: palette.divider,
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <AuthProvider>
        <ProfileProvider>
          <RootNavigator />
          <StatusBar style="dark" />
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
