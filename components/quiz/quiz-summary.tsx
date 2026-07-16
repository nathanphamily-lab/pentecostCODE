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
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';

type QuizSummaryProps = {
  starsEarned: number;
  total: number;
  onDone: () => void;
};

export function QuizSummary({ starsEarned, total, onDone }: QuizSummaryProps) {
  const stars = Array.from({ length: total }, (_, i) => i < starsEarned);

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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 20,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: '700',
    color: '#1B2430',
    textAlign: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 44,
  },
  starEmpty: {
    opacity: 0.3,
  },
  subtitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '600',
    color: '#1B2430',
    textAlign: 'center',
  },
  button: {
    minHeight: 56,
    paddingHorizontal: 36,
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: '#2A9D8F',
  },
  buttonLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
});
