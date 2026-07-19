/**
 * Quiz completion summary (§6.4 Completion, §4.1 Step 7): stars earned, then back to Home.
 *
 * Stars are for this run only — they are shown and then discarded. Persisting progress
 * needs a field on `ChildProfile` (`lib/profiles.ts`) that does not exist yet; that schema
 * belongs with the Learn/Practice content work, not here.
 *
 * Johnny is not rendered here — the Quiz screen keeps him pinned bottom-left across every
 * phase (§6.2/§4.3) and switches him to `celebrate` when this shows.
 */
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

type QuizSummaryProps = {
  starsEarned: number;
  total: number;
  onDone: () => void;
};

export function QuizSummary({ starsEarned, total, onDone }: QuizSummaryProps) {
  const stars = Array.from({ length: total }, (_, i) => i < starsEarned);
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Great reading!</Text>

      <View style={styles.stars} accessibilityLabel={`You earned ${starsEarned} of ${total} stars`}>
        {stars.map((earned, index) => (
          <Text key={index} style={[styles.star, !earned && styles.starEmpty]}>
            {earned ? '⭐' : '☆'}
          </Text>
        ))}
      </View>

      <Text style={styles.subtitle}>
        You earned {starsEarned} of {total} stars!
      </Text>

      <Pressable
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel="Back home"
        style={styles.button}>
        <Text style={styles.buttonLabel}>Back Home</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    card: {
      ...t.card,
      paddingVertical: t.spacing.xl,
      paddingHorizontal: t.spacing.lg,
      alignItems: 'center',
      gap: t.spacing.lg,
      maxWidth: t.contentMaxWidth,
      width: '100%',
      alignSelf: 'center',
    },
    title: {
      ...t.type.celebration,
      color: t.colors.textPrimary,
      textAlign: 'center',
    },
    stars: {
      flexDirection: 'row',
      gap: t.spacing.sm,
    },
    star: {
      fontSize: 44,
    },
    starEmpty: {
      opacity: 0.3,
    },
    subtitle: {
      ...t.type.subtitle,
      color: t.colors.textPrimary,
      textAlign: 'center',
    },
    button: {
      minHeight: 56,
      paddingHorizontal: t.spacing.xl,
      justifyContent: 'center',
      borderRadius: 28,
      backgroundColor: t.semantic.correct,
    },
    buttonLabel: {
      ...t.type.sectionHeader,
      color: t.semantic.onAccent,
    },
  });
}
