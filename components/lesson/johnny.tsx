/**
 * Johnny the mascot placeholder (§4.3, §6.2): a friendly guide pinned in the
 * bottom-left corner of lesson and phonics screens.
 *
 * For now this is a static colored avatar. Real artwork and the idle / celebrate /
 * encourage / point animations (§4.3) come later; the `state` prop is reserved so
 * callers can already express intent without a visual change yet.
 */
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

export type JohnnyState = 'idle' | 'point' | 'celebrate' | 'encourage';

type JohnnyProps = {
  /** Reserved for future animations; no visual effect yet. */
  state?: JohnnyState;
  size?: number;
};

export function Johnny({ state = 'idle', size = 84 }: JohnnyProps) {
  // `state` is reserved for future animations; it has no visual effect yet.
  void state;
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  return (
    <View style={styles.container} accessibilityLabel="Johnny" accessibilityRole="image">
      <View
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
        ]}>
        <Text style={[styles.face, { fontSize: size * 0.5 }]}>🙂</Text>
      </View>
      <Text style={styles.name}>Johnny</Text>
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: t.spacing.xs,
    },
    avatar: {
      backgroundColor: t.semantic.highlightStrong,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: t.colors.surface,
      ...t.controlShadow,
    },
    face: {
      textAlign: 'center',
    },
    name: {
      ...t.type.navLabel,
      color: t.colors.textPrimary,
    },
  });
}
