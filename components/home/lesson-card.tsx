import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { isUnlocked, type Content } from '@/constants/content';
import { semantic, type Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

const CARD_WIDTH = 128;
const THUMB_HEIGHT = 96;

/** Fallback tint for a library item with no thumbnail yet (§7 crayon-box palette). */
const DEFAULT_THUMBNAIL = '#90DBF4';

/**
 * A single Home lesson card (§6.1): a placeholder colored thumbnail + title.
 * Active cards navigate to the Lesson screen carrying their content id; locked cards
 * render grayed out with a lock icon and are non-interactive ("not yet unlocked").
 *
 * Lock state is derived, not authored: an item is playable only once it is `ready` and
 * its `unlockedBy` prerequisites are met (§6.1).
 */
export function LessonCard({ item }: { item: Content }) {
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const locked = !isUnlocked(item);

  const thumbnail = (
    <View style={styles.container}>
      <View
        style={[
          styles.thumb,
          { backgroundColor: item.thumbnail ?? DEFAULT_THUMBNAIL },
          locked && styles.locked,
        ]}>
        {locked && (
          <View style={styles.lockOverlay}>
            <IconSymbol name="lock.fill" size={28} color={semantic.onAccent} />
          </View>
        )}
      </View>
      <ThemedText
        type="defaultSemiBold"
        numberOfLines={2}
        style={[styles.title, locked && styles.lockedTitle]}>
        {item.title}
      </ThemedText>
    </View>
  );

  if (locked) {
    return thumbnail;
  }

  return (
    <Link href={{ pathname: '/lesson', params: { id: item.id } }} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={item.title}>
        {thumbnail}
      </Pressable>
    </Link>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    container: {
      width: CARD_WIDTH,
      gap: 6,
    },
    thumb: {
      ...t.card,
      width: CARD_WIDTH,
      height: THUMB_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      // `card.backgroundColor` is overridden by the item's own crayon color,
      // applied inline after this style.
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
}
