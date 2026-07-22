/**
 * Lesson / Story screen (AppSpec §6.2, §4.1 Steps 1–5).
 *
 * A picture book: each page is one illustrated scene plus one or more sentences. The
 * illustration holds still while the text card advances sentence by sentence, and changes
 * only when the page turns. Tapping a word pauses and opens the Phonics Breakdown; a
 * progress bar tracks pages; Johnny sits bottom-left.
 *
 * Advancing happens four ways — the arrow buttons, a swipe, a tap on the open background,
 * and automatically when a sentence finishes narrating. All of them go through
 * `useStoryPlayback`, which owns position and speech; this file is layout and motion.
 *
 * Motion: a page turn slides and cross-fades the background (`PageBackground`) while the
 * text card fades out and back in. A sentence change *within* a page is a quick text
 * cross-fade only — the background must not move. The card's contents lag the playback
 * position and swap at the fade's trough, so text never changes while it is visible.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Johnny } from '@/components/lesson/johnny';
import { PageBackground } from '@/components/lesson/page-background';
import { ProgressBar } from '@/components/lesson/progress-bar';
import { StoryTextCard } from '@/components/lesson/story-text-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Page, Sentence } from '@/constants/content';
import { getStoryContent } from '@/constants/content-library';
import { PAGE_CARD_FADE_MS, SENTENCE_FADE_MS } from '@/constants/story-motion';
import type { Tokens } from '@/constants/tokens';
import { useStoryPlayback } from '@/hooks/use-story-playback';
import { useTokens } from '@/hooks/use-tokens';

/**
 * How far a horizontal drag must travel to both activate the pan and count as a page
 * turn. One number for both so there is no dead zone between them.
 */
const SWIPE_THRESHOLD = 24;

export default function LessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const story = useMemo(() => getStoryContent(id), [id]);
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const {
    pageIndex,
    pageCount,
    page,
    currentSentence,
    stepIndex,
    wordIndex,
    direction,
    isPlaying,
    isDone,
    canGoPrev,
    togglePlay,
    goNext,
    goPrev,
    onWordTap,
  } = useStoryPlayback(story);

  /* ---- Text card transition ------------------------------------------------ */

  // What the card is currently showing. Lags the live position and catches up at the
  // trough of the fade, so a word is never swapped out from under a child's finger.
  const live = useRef<{ sentence: Sentence | undefined; page: Page | undefined }>({
    sentence: currentSentence,
    page,
  });
  live.current = { sentence: currentSentence, page };

  const [displayed, setDisplayed] = useState(live.current);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cardOpacity = useSharedValue(1);
  const commit = useCallback(() => setDisplayed(live.current), []);
  const settle = useCallback(() => setIsTransitioning(false), []);

  const lastStep = useRef(stepIndex);
  const lastPage = useRef(pageIndex);
  /** Half-duration of the fade in progress; the fade-in reuses the fade-out's timing. */
  const fadeHalf = useRef(SENTENCE_FADE_MS);
  /** True between starting a fade-out and the resulting commit reaching the screen. */
  const awaitingCommit = useRef(false);

  // Fade OUT on a position change. The new text is committed only once the card is
  // fully invisible — the fade back in is driven by that commit landing, below, rather
  // than chained here. Chaining would race the UI thread against React: if the
  // commit's round-trip took longer than the fade-in, the card would reappear still
  // showing the old sentence and then swap in place, in full view.
  useEffect(() => {
    if (stepIndex === lastStep.current) {
      return;
    }
    const isPageTurn = pageIndex !== lastPage.current;
    lastStep.current = stepIndex;
    lastPage.current = pageIndex;

    fadeHalf.current = isPageTurn ? PAGE_CARD_FADE_MS : SENTENCE_FADE_MS;
    awaitingCommit.current = true;
    setIsTransitioning(true);
    cardOpacity.value = withTiming(
      0,
      { duration: fadeHalf.current, easing: Easing.in(Easing.ease) },
      (finished) => {
        'worklet';
        if (finished) {
          runOnJS(commit)();
        }
      },
    );
  }, [stepIndex, pageIndex, cardOpacity, commit]);

  // Fade back IN once the committed text is on screen (still at opacity 0). Keyed on
  // `displayed`, so it runs when the commit lands — not when the fade-out started. An
  // advance that interrupts an in-flight fade-out simply leaves `awaitingCommit` set,
  // and the newest commit owns the fade-in.
  useEffect(() => {
    if (!awaitingCommit.current) {
      return;
    }
    awaitingCommit.current = false;
    cardOpacity.value = withTiming(
      1,
      { duration: fadeHalf.current, easing: Easing.out(Easing.ease) },
      (finished) => {
        'worklet';
        if (finished) {
          runOnJS(settle)();
        }
      },
    );
  }, [displayed, cardOpacity, settle]);

  const cardStyle = useAnimatedStyle(() => ({ opacity: cardOpacity.value }));

  /* ---- Advance triggers ---------------------------------------------------- */

  // An X-axis activation threshold means a swipe never steals a tap from a word, and
  // failing on Y keeps a vertical drag from being read as a page turn. The act-on
  // distance matches the activation distance: anything that was decisive enough to
  // cancel the underlying touch should turn the page, or a child's imprecise drag
  // lands in a dead zone where neither the swipe nor tap-to-advance fires.
  const swipe = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
        .failOffsetY([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
        .onEnd((event, success) => {
          'worklet';
          // `success` is false for a pan the system interrupted; acting on those would
          // turn the page when e.g. a modal appears mid-drag.
          if (!success) {
            return;
          }
          if (event.translationX <= -SWIPE_THRESHOLD) {
            runOnJS(goNext)();
          } else if (event.translationX >= SWIPE_THRESHOLD) {
            runOnJS(goPrev)();
          }
        }),
    [goNext, goPrev],
  );

  // §6.4 / §4.1 Step 6: the quiz appears on its own once the last sentence finishes.
  // `replace`, not `push`, so the spent lesson leaves the stack — otherwise Back from the
  // quiz would land on a finished story that immediately restarts narrating.
  useEffect(() => {
    if (isDone) {
      router.replace({ pathname: '/quiz', params: { id: story.id } });
    }
  }, [isDone, router, story.id]);

  return (
    <GestureDetector gesture={swipe}>
      <View style={styles.root}>
        <PageBackground page={page} nextPage={story.pages[pageIndex + 1]} direction={direction} />

        {/* Tapping the open background turns forward. It sits behind the safe-area
            content, so taps on words and controls never reach it. */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={goNext}
          accessibilityRole="button"
          accessibilityLabel="Next"
        />

        <SafeAreaView style={styles.safe} edges={['top', 'bottom']} pointerEvents="box-none">
          {/* Top row: back arrow + page progress. */}
          <View style={styles.topRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              hitSlop={12}
              style={styles.iconButton}>
              <IconSymbol name="chevron.left" size={28} color={tokens.colors.textPrimary} />
            </Pressable>
            <View style={styles.progressWrap}>
              <ProgressBar
                current={pageIndex + 1}
                total={pageCount}
                label={`Page ${pageIndex + 1} of ${pageCount}`}
              />
            </View>
          </View>

          {/* Center: the story text card. */}
          <View style={styles.center} pointerEvents="box-none">
            {displayed.sentence ? (
              <Animated.View
                style={[styles.cardWrap, cardStyle]}
                // A tap must never land on text that is mid-swap.
                pointerEvents={isTransitioning ? 'none' : 'auto'}>
                <StoryTextCard
                  sentence={displayed.sentence}
                  activeWordIndex={isPlaying && !isTransitioning ? wordIndex : -1}
                  onWordTap={onWordTap}
                />
              </Animated.View>
            ) : null}
          </View>

          {/* Bottom row: Johnny (left), page arrows (center), pause/play (right). */}
          <View style={styles.bottomRow}>
            <Johnny />

            <View style={styles.pager}>
              <Pressable
                onPress={goPrev}
                accessibilityRole="button"
                accessibilityLabel="Previous page"
                hitSlop={16}
                disabled={!canGoPrev}
                style={[styles.pagerButton, !canGoPrev && styles.pagerButtonDisabled]}>
                <IconSymbol name="chevron.left" size={40} color={tokens.colors.textPrimary} />
              </Pressable>
              <Pressable
                onPress={goNext}
                accessibilityRole="button"
                accessibilityLabel="Next page"
                hitSlop={16}
                style={styles.pagerButton}>
                <IconSymbol name="chevron.right" size={40} color={tokens.colors.textPrimary} />
              </Pressable>
            </View>

            <Pressable
              onPress={togglePlay}
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
              hitSlop={12}
              disabled={isDone}
              style={[styles.playButton, isDone && styles.playButtonDisabled]}>
              <IconSymbol
                name={isPlaying ? 'pause.fill' : 'play.fill'}
                size={36}
                color={tokens.semantic.onAccent}
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </GestureDetector>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    safe: {
      flex: 1,
      paddingHorizontal: t.spacing.lg,
      justifyContent: 'space-between',
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingTop: t.spacing.sm,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: t.overlays.control,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressWrap: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: t.spacing.md,
    },
    cardWrap: {
      width: '100%',
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: t.spacing.sm,
    },
    pager: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.md,
      paddingBottom: t.spacing.sm,
    },
    // Deliberately oversized: the primary forward/back affordance for a 3–7 year old.
    pagerButton: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: t.overlays.control,
      alignItems: 'center',
      justifyContent: 'center',
      ...t.controlShadow,
    },
    pagerButtonDisabled: {
      opacity: 0.3,
    },
    playButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: t.semantic.correct,
      alignItems: 'center',
      justifyContent: 'center',
      ...t.controlShadow,
    },
    playButtonDisabled: {
      opacity: 0.4,
    },
  });
}
