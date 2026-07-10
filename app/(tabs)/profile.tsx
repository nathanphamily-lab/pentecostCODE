import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProfiles } from '@/lib/profile-context';

export default function ProfileScreen() {
  const { selectedProfile, clearSelection } = useProfiles();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedText style={styles.subtitle}>Coming soon</ThemedText>
      {selectedProfile && (
        <ThemedText style={styles.current}>Reading as {selectedProfile.name}</ThemedText>
      )}
      <Pressable style={styles.action} onPress={() => clearSelection()}>
        <ThemedText type="link">Switch child profile</ThemedText>
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
  current: {
    opacity: 0.6,
    fontSize: 14,
    marginTop: 8,
  },
  action: {
    marginTop: 12,
    paddingVertical: 8,
  },
});
