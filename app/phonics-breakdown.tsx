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
import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';
import { speechEngine, type SpeakHandle } from '@/lib/speech';

/** Job A opening line — an invitation (§6.3). Job B would swap this for reassurance. */
const JOB_A_INTRO = "Ooh, let's look at this word!";

export default function PhonicsBreakdownScreen() {
  const router = useRouter();
  const { word } = useLocalSearchParams<{ word?: string }>();
  const displayWord = word ?? '';
  const phonemes = useMemo(() => breakDownWord(displayWord), [displayWord]);
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

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

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: t.overlays.scrim,
      alignItems: 'center',
      justifyContent: 'center',
      padding: t.spacing.lg,
    },
    card: {
      ...t.card,
      paddingVertical: t.spacing.xl,
      paddingHorizontal: t.spacing.lg,
      alignItems: 'center',
      gap: t.spacing.lg,
      maxWidth: t.contentMaxWidth,
      width: '100%',
    },
    word: {
      ...t.type.display,
      color: t.colors.textPrimary,
    },
    tiles: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: t.spacing.sm,
    },
    johnny: {
      position: 'absolute',
      left: t.spacing.lg,
      bottom: t.spacing.lg,
    },
  });
}
