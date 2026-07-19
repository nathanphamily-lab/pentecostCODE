import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { semantic } from '@/constants/tokens';

// Placeholder child until profiles arrive (§8.3: one family login, child profiles).
const CHILD_NAME = 'Friend';

/**
 * Home header (§6.1): app logo on the left, a greeting + round avatar chip on
 * the right. Child name/avatar are placeholders until account data exists.
 */
export function HomeHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Image
        source={require('@/assets/images/icon.png')}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="Pentecost"
      />
      <View style={styles.right}>
        <ThemedText type="defaultSemiBold">Hi, {CHILD_NAME}!</ThemedText>
        <View style={styles.avatar}>
          <ThemedText type="defaultSemiBold" style={styles.avatarInitial}>
            {CHILD_NAME.charAt(0)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logo: {
    width: 44,
    height: 44,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semantic.highlightStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: semantic.onAccent,
  },
});
