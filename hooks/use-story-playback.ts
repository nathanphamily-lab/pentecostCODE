/**
 * Playback state machine for the Lesson/Story screen (§4.1 Steps 1–5).
 *
 * Owns the "where are we in the story" state and drives the swappable speech engine
 * (`lib/speech.ts`) so `app/lesson.tsx` stays a thin view. Highlighting, auto-advance,
 * page turns, pause/resume, and the tap-to-break-down handoff all live here.
 *
 * The story is a picture book: a list of pages, each with one illustration and one or
 * more sentences. Position is tracked as a flat *step* index over
 * `pages × sentences`, so advancing is always `step + 1` — a step that crosses into the
 * next page is what makes the illustration change. Narration waits out the turn
 * animation (`PAGE_TURN_SETTLE_MS`) so a new page is spoken over settled artwork.
 *
 * Pause/resume is implemented as stop + re-speak-the-remainder (rather than native
 * `Speech.pause`/`resume`, which are iOS-only) so behavior matches on iOS and Android.
 */
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';

import { PAGE_TURN_SETTLE_MS } from '@/constants/story-motion';
import { speechEngine, type SpeakHandle } from '@/lib/speech';
import type { StoryContent } from '@/constants/content';

/** Where a flat step lands in the book. */
type Step = { pageIndex: number; sentenceIndex: number };

export function useStoryPlayback(story: StoryContent) {
  const router = useRouter();

  // Flatten pages → sentences once, so traversal (forward, back, auto-advance) is just
  // arithmetic on a single index and page turns fall out of comparing pageIndex.
  const steps: Step[] = useMemo(
    () =>
      story.pages.flatMap((page, pageIndex) =>
        page.sentences.map((_, sentenceIndex) => ({ pageIndex, sentenceIndex })),
      ),
    [story],
  );
  const stepCount = steps.length;
  const pageCount = story.pages.length;

  const [stepIndex, setStepIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);
  /** Which way the last move went; the screen slides the artwork accordingly. */
  const [direction, setDirection] = useState<1 | -1>(1);

  // Refs mirror state so the speech-engine callbacks (which close over stale state)
  // always read the live position, and so `play()` can resume from it.
  const handleRef = useRef<SpeakHandle | null>(null);
  const settleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);
  const wordRef = useRef(0);
  const doneRef = useRef(false);

  /** Drop any in-flight speech and any narration still waiting on a page turn. */
  const silence = useCallback(() => {
    handleRef.current?.cancel();
    handleRef.current = null;
    if (settleRef.current) {
      clearTimeout(settleRef.current);
      settleRef.current = null;
    }
  }, []);

  /**
   * Move to `step` and speak it from `fromWord`, auto-advancing at its end.
   * `delayMs` holds narration back while a page turn plays; the position (and so the
   * artwork) updates immediately.
   */
  const speakFrom = useCallback(
    (step: number, fromWord: number, delayMs = 0) => {
      const at = steps[step];
      const sentence = at && story.pages[at.pageIndex]?.sentences[at.sentenceIndex];
      if (!sentence) {
        return;
      }

      stepRef.current = step;
      wordRef.current = fromWord;
      setStepIndex(step);
      setWordIndex(fromWord);
      setIsPlaying(true);

      silence();

      const begin = () => {
        settleRef.current = null;
        handleRef.current = speechEngine.speak({
          tokens: sentence.words.slice(fromWord).map((word) => word.text),
          onToken: (i) => {
            const word = fromWord + i;
            wordRef.current = word;
            setWordIndex(word);
          },
          onDone: () => {
            const next = step + 1;
            if (next < stepCount) {
              // §4.1 Step 2: keep narrating. Crossing into a new page turns it.
              const turning = steps[next].pageIndex !== at.pageIndex;
              if (turning) {
                setDirection(1);
              }
              speakFrom(next, 0, turning ? PAGE_TURN_SETTLE_MS : 0);
            } else {
              handleRef.current = null;
              doneRef.current = true;
              setIsDone(true);
              setIsPlaying(false);
            }
          },
        });
      };

      if (delayMs > 0) {
        settleRef.current = setTimeout(begin, delayMs);
      } else {
        begin();
      }
    },
    [silence, steps, stepCount, story],
  );

  const pause = useCallback(() => {
    silence();
    setIsPlaying(false);
  }, [silence]);

  /** Resume (or start) from the current position; no-op once the story is finished. */
  const play = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    speakFrom(stepRef.current, wordRef.current);
  }, [speakFrom]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  /**
   * Jump to a step from a deliberate tap or swipe. Restarts the target sentence from its
   * first word (a child who navigates back wants to hear it again, not the tail of it).
   */
  const goTo = useCallback(
    (step: number) => {
      if (doneRef.current || step < 0) {
        return;
      }
      if (step >= stepCount) {
        // Past the last sentence: same ending as auto-advance — on to the quiz.
        silence();
        doneRef.current = true;
        setIsDone(true);
        setIsPlaying(false);
        return;
      }
      const from = steps[stepRef.current];
      const to = steps[step];
      setDirection(step < stepRef.current ? -1 : 1);
      speakFrom(step, 0, from && to && from.pageIndex !== to.pageIndex ? PAGE_TURN_SETTLE_MS : 0);
    },
    [silence, speakFrom, stepCount, steps],
  );

  const goNext = useCallback(() => goTo(stepRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(stepRef.current - 1), [goTo]);

  /**
   * §4.1 Step 3: tapping a word pauses playback and opens the Phonics Breakdown for
   * that word. Playback resumes where it paused when the modal is dismissed (the
   * focus effect below re-runs `play()` on return).
   */
  const onWordTap = useCallback(
    (word: string) => {
      pause();
      router.push({ pathname: '/phonics-breakdown', params: { word } });
    },
    [pause, router],
  );

  // Autoplay when the screen is focused; pause when it loses focus (e.g. the phonics
  // modal opens over it) and on unmount. Returning from the modal re-focuses and
  // resumes from the saved position (§4.1 Step 5).
  useFocusEffect(
    useCallback(() => {
      play();
      return () => pause();
    }, [play, pause]),
  );

  const at = steps[stepIndex];
  const pageIndex = at?.pageIndex ?? 0;

  return {
    pageIndex,
    pageCount,
    page: story.pages[pageIndex],
    sentenceIndex: at?.sentenceIndex ?? 0,
    currentSentence: at ? story.pages[pageIndex]?.sentences[at.sentenceIndex] : undefined,
    stepIndex,
    wordIndex,
    direction,
    isPlaying,
    isDone,
    canGoPrev: stepIndex > 0,
    play,
    pause,
    togglePlay,
    goNext,
    goPrev,
    onWordTap,
  };
}
