import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lesson" options={{ title: 'Lesson' }} />
        <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
        <Stack.Screen
          name="phonics-breakdown"
          options={{ presentation: 'modal', title: 'Phonics Breakdown' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
