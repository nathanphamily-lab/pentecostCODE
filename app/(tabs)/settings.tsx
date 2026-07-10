import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/lib/auth-context';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      <ThemedText style={styles.subtitle}>Coming soon</ThemedText>
      {user?.email && <ThemedText style={styles.account}>Signed in as {user.email}</ThemedText>}
      <Pressable style={styles.action} onPress={() => signOut()}>
        <ThemedText type="link">Sign out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  subtitle: {
    opacity: 0.6,
  },
  account: {
    opacity: 0.6,
    fontSize: 14,
    marginTop: 8,
  },
  action: {
    marginTop: 12,
    paddingVertical: 8,
  },
});
