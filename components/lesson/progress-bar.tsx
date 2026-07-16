/**
 * Progress bar (§6.2): a rounded track with a fill plus an "X / Y" label showing how many
 * steps are complete — sentences on the Lesson screen, questions on the Quiz screen.
 */
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type ProgressBarProps = {
  /** Steps completed so far. */
  current: number;
  /** Total steps. */
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(current, total));
  const pct = total > 0 ? (clamped / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.label}>
        {clamped} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#2A9D8F',
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
    color: '#1B2430',
    minWidth: 44,
    textAlign: 'right',
  },
});
