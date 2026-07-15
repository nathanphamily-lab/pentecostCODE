/**
 * The rounded white text card at the center of the Lesson/Story screen (§6.2).
 *
 * Shows one sentence (2–3 lines) at a time in a large, rounded, child-friendly font.
 * The word currently being spoken gets a yellow highlight (§4.1 Step 2); tapping any
 * word triggers `onWordTap` (§4.1 Step 3 → Phonics Breakdown).
 */
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import type { StorySentence } from '@/constants/stories';

const HIGHLIGHT = '#FFE066'; // crayon-box yellow (§7)

type StoryTextCardProps = {
  sentence: StorySentence;
  /** Index of the word currently spoken; highlighted yellow. -1 for none. */
  activeWordIndex: number;
  onWordTap: (word: string) => void;
};

export function StoryTextCard({ sentence, activeWordIndex, onWordTap }: StoryTextCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.words}>
        {sentence.words.map((word, index) => {
          const active = index === activeWordIndex;
          return (
            <Pressable
              key={`${sentence.id}-${index}`}
              onPress={() => onWordTap(word)}
              accessibilityRole="button"
              accessibilityLabel={word}
              hitSlop={8}
              style={[styles.wordWrap, active && styles.wordWrapActive]}>
              <Text style={styles.word}>{word}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 24,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    // Soft, non-jarring elevation (§7).
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Padding + margin keep each word a ≥48pt child-friendly tap target (§7).
  wordWrap: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
  },
  wordWrapActive: {
    backgroundColor: HIGHLIGHT,
  },
  word: {
    fontFamily: Fonts.rounded,
    fontSize: 30,
    lineHeight: 40,
    fontWeight: Platform.OS === 'ios' ? '600' : '700',
    color: '#1B2430',
    textAlign: 'center',
  },
});
