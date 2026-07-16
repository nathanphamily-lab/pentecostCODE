/**
 * One picture-based answer choice on the Quiz screen (§6.4 Format).
 *
 * The "picture" is a placeholder emoji on a crayon-colored card until real answer art
 * exists (§7) — the same stand-in strategy as Johnny's face and the story background.
 *
 * `correct` plays the §6.4 celebratory pop: a soft scale-up and settle, well under the
 * ~2s / "no rapid flashing" ceiling in §7. `wrong` stays deliberately gentle — the card
 * only dims and takes a muted border, because Johnny never scolds the child (§4.3).
 */
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';

import type { AnswerChoice as AnswerChoiceContent } from '@/constants/quiz';
import { Fonts } from '@/constants/theme';

export type AnswerChoiceState = 'idle' | 'correct' | 'wrong' | 'dimmed';

type AnswerChoiceProps = {
  choice: AnswerChoiceContent;
  state: AnswerChoiceState;
  onPress: () => void;
  disabled?: boolean;
};

const CARD_SIZE = 132; // Far above the §7 48pt minimum tap target for small fingers.
const POP_MS = 220;

export function AnswerChoice({ choice, state, onPress, disabled }: AnswerChoiceProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (state === 'correct') {
      scale.value = withSequence(withTiming(1.12, { duration: POP_MS }), withTiming(1, { duration: POP_MS }));
    }
  }, [scale, state]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={choice.label}
      accessibilityState={{ disabled: !!disabled, selected: state === 'correct' || state === 'wrong' }}>
      <Animated.View style={[styles.container, state === 'dimmed' && styles.dimmed, animatedStyle]}>
        <View
          style={[
            styles.card,
            { backgroundColor: choice.color },
            state === 'correct' && styles.cardCorrect,
            state === 'wrong' && styles.cardWrong,
          ]}>
          <Text style={styles.emoji}>{choice.emoji}</Text>
          {state === 'correct' && <Text style={styles.sparkle}>✨</Text>}
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {choice.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    alignItems: 'center',
    gap: 8,
  },
  dimmed: {
    opacity: 0.35,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardCorrect: {
    borderColor: '#2A9D8F',
  },
  cardWrong: {
    borderColor: '#E29578',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 24,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
    color: '#1B2430',
    textAlign: 'center',
  },
});
