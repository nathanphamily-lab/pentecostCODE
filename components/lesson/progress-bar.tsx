/**
 * Progress bar (§6.2): a rounded track with a fill plus an "X / Y" label showing how many
 * steps are complete — sentences on the Lesson screen, questions on the Quiz screen.
 */
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

type ProgressBarProps = {
  /** Steps completed so far. */
  current: number;
  /** Total steps. */
  total: number;
  /** Overrides the default "X / Y" readout, e.g. "Page 2 of 3" on the Story screen. */
  label?: string;
};

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(current, total));
  const pct = total > 0 ? (clamped / total) * 100 : 0;
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label ?? `${clamped} / ${total}`}
      </Text>
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
    },
    track: {
      flex: 1,
      height: 12,
      borderRadius: 6,
      backgroundColor: t.overlays.controlSoft,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 6,
      backgroundColor: t.semantic.correct,
    },
    label: {
      ...t.type.link,
      color: t.colors.textPrimary,
      minWidth: 44,
      textAlign: 'right',
    },
  });
}
