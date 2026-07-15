/**
 * Phonics Breakdown screen — Job A: curiosity tap (AppSpec §3.1, §6.3, §4.1 Step 4).
 *
 * The child tapped a word during a story, so it pauses and the word appears here split
 * into its sounds. Johnny opens with an inviting line, then each phoneme lights up as
 * its sound plays, with silent letters grayed. Tapping anywhere outside the card
 * dismisses the modal and the story resumes where it paused.
 *
 * Job B (mispronunciation correction) reuses this exact screen and changes ONLY the
 * opening line to reassurance. It is blocked on speech recognition (§4.2) and not built.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Johnny } from '@/components/lesson/johnny';
import { PhonemeTile } from '@/components/phonics/phoneme-tile';
import { breakDownWord } from '@/constants/phonics';
import { Fonts } from '@/constants/theme';
import { speechEngine, type SpeakHandle } from '@/lib/speech';

/** Job A opening line — an invitation (§6.3). Job B would swap this for reassurance. */
const JOB_A_INTRO = "Ooh, let's look at this word!";

export default function PhonicsBreakdownScreen() {
  const router = useRouter();
  const { word } = useLocalSearchParams<{ word?: string }>();
  const displayWord = word ?? '';
  const phonemes = useMemo(() => breakDownWord(displayWord), [displayWord]);

  const [litIndex, setLitIndex] = useState(-1);

  // On mount: Johnny's invitation, then play each phoneme's sound in sequence,
  // lighting its tile. Everything cancels cleanly if the screen is dismissed early.
  useEffect(() => {
    let cancelled = false;
    let phonemeHandle: SpeakHandle | null = null;

    const introHandle = speechEngine.speak({
      tokens: [JOB_A_INTRO],
      rate: 0.85,
      onDone: () => {
        if (cancelled) {
          return;
        }
        phonemeHandle = speechEngine.speak({
          tokens: phonemes.map((p) => p.sound),
          onToken: (index) => setLitIndex(index),
          onDone: () => {
            if (!cancelled) {
              setLitIndex(-1);
            }
          },
        });
      },
    });

    return () => {
      cancelled = true;
      introHandle.cancel();
      phonemeHandle?.cancel();
      speechEngine.stop();
    };
  }, [phonemes]);

  return (
    // Backdrop: tapping outside the card dismisses and resumes the story (§6.3 Dismiss).
    <Pressable style={styles.backdrop} onPress={() => router.back()} accessibilityLabel="Resume story">
      {/* Empty onPress keeps card taps from dismissing. */}
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.word}>{displayWord}</Text>
        <View style={styles.tiles}>
          {phonemes.map((phoneme, index) => (
            <PhonemeTile key={`${phoneme.grapheme}-${index}`} phoneme={phoneme} lit={index === litIndex} />
          ))}
        </View>
      </Pressable>

      <View style={styles.johnny}>
        <Johnny state="point" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 30, 40, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 28,
    maxWidth: 560,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  word: {
    fontFamily: Fonts.rounded,
    fontSize: 52,
    fontWeight: '700',
    color: '#1B2430',
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  johnny: {
    position: 'absolute',
    left: 20,
    bottom: 28,
  },
});
