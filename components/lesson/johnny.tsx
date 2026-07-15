/**
 * Johnny the mascot placeholder (§4.3, §6.2): a friendly guide pinned in the
 * bottom-left corner of lesson and phonics screens.
 *
 * For now this is a static colored avatar. Real artwork and the idle / celebrate /
 * encourage / point animations (§4.3) come later; the `state` prop is reserved so
 * callers can already express intent without a visual change yet.
 */
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

export type JohnnyState = 'idle' | 'point' | 'celebrate' | 'encourage';

type JohnnyProps = {
  /** Reserved for future animations; no visual effect yet. */
  state?: JohnnyState;
  size?: number;
};

export function Johnny({ state = 'idle', size = 84 }: JohnnyProps) {
  // `state` is reserved for future animations; it has no visual effect yet.
  void state;
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  avatar: {
    backgroundColor: '#FFB703',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  face: {
    textAlign: 'center',
  },
  name: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    fontWeight: '700',
    color: '#1B2430',
  },
});
