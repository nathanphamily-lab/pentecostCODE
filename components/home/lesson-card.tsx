import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { HomeCard } from '@/constants/home-content';

const CARD_WIDTH = 128;
const THUMB_HEIGHT = 96;

/**
 * A single Home lesson card (§6.1): a placeholder colored thumbnail + title.
 * Active cards navigate to the Lesson screen; locked cards render grayed out
 * with a lock icon and are non-interactive ("not yet unlocked").
 */
export function LessonCard({ card }: { card: HomeCard }) {
  const thumbnail = (
    <View style={styles.container}>
      <View style={[styles.thumb, { backgroundColor: card.color }, card.locked && styles.locked]}>
        {card.locked && (
          <View style={styles.lockOverlay}>
            <IconSymbol name="lock.fill" size={28} color="#fff" />
          </View>
        )}
      </View>
      <ThemedText
        type="defaultSemiBold"
        numberOfLines={2}
        style={[styles.title, card.locked && styles.lockedTitle]}>
        {card.title}
      </ThemedText>
    </View>
  );

  if (card.locked) {
    return thumbnail;
  }

  return (
    <Link href="/lesson" asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={card.title}>
        {thumbnail}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 6,
  },
  thumb: {
    width: CARD_WIDTH,
    height: THUMB_HEIGHT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: {
    opacity: 0.4,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal: 2,
  },
  lockedTitle: {
    opacity: 0.5,
  },
});
