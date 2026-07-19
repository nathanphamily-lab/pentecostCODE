/**
 * The rounded white text card at the center of the Lesson/Story screen (§6.2).
 *
 * Shows one sentence (2–3 lines) at a time in a large, rounded, child-friendly font.
 * The word currently being spoken gets a yellow highlight (§4.1 Step 2); tapping any
 * word triggers `onWordTap` (§4.1 Step 3 → Phonics Breakdown).
 */
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Sentence } from '@/constants/content';
import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

type StoryTextCardProps = {
  sentence: Sentence;
  /** Index of the word currently spoken; highlighted yellow. -1 for none. */
  activeWordIndex: number;
  onWordTap: (word: string) => void;
};

export function StoryTextCard({ sentence, activeWordIndex, onWordTap }: StoryTextCardProps) {
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  return (
    <View style={styles.card}>
      <View style={styles.words}>
        {sentence.words.map((word, index) => {
          const active = index === activeWordIndex;
          return (
            <Pressable
              key={`${word.text}-${index}`}
              onPress={() => onWordTap(word.text)}
              accessibilityRole="button"
              accessibilityLabel={word.text}
              hitSlop={8}
              style={[styles.wordWrap, active && styles.wordWrapActive]}>
              <Text style={styles.word}>{word.text}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    card: {
      ...t.card,
      paddingVertical: t.spacing.lg,
      paddingHorizontal: t.spacing.lg,
      maxWidth: t.contentMaxWidth,
      width: '100%',
      alignSelf: 'center',
    },
    words: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Padding + margin keep each word a ≥48pt child-friendly tap target (§7).
    wordWrap: {
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.sm,
      marginVertical: 2,
      borderRadius: 12,
    },
    wordWrapActive: {
      backgroundColor: t.semantic.highlight,
    },
    word: {
      ...t.type.storyWord,
      color: t.colors.textPrimary,
      textAlign: 'center',
    },
  });
}
