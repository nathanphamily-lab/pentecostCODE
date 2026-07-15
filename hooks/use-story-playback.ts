/**
 * Playback state machine for the Lesson/Story screen (§4.1 Steps 1–5).
 *
 * Owns the "where are we in the story" state and drives the swappable speech engine
 * (`lib/speech.ts`) so `app/lesson.tsx` stays a thin view. Highlighting, auto-advance
 * between sentences, pause/resume, and the tap-to-break-down handoff all live here.
 *
 * Pause/resume is implemented as stop + re-speak-the-remainder (rather than native
 * `Speech.pause`/`resume`, which are iOS-only) so behavior matches on iOS and Android.
 */
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { speechEngine, type SpeakHandle } from '@/lib/speech';
import type { Story } from '@/constants/stories';

export function useStoryPlayback(story: Story) {
  const router = useRouter();

  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Refs mirror state so the speech-engine callbacks (which close over stale state)
  // always read the live position, and so `play()` can resume from it.
  const handleRef = useRef<SpeakHandle | null>(null);
  const sentenceRef = useRef(0);
  const wordRef = useRef(0);
  const doneRef = useRef(false);

  const total = story.sentences.length;

  /** Speak sentence `sIndex` starting at word `fromWord`, auto-advancing at its end. */
  const speakFrom = useCallback(
    (sIndex: number, fromWord: number) => {
      const sentence = story.sentences[sIndex];
      if (!sentence) {
        return;
      }
      sentenceRef.current = sIndex;
      wordRef.current = fromWord;
      setSentenceIndex(sIndex);
      setWordIndex(fromWord);
      setIsPlaying(true);

      handleRef.current?.cancel();
      handleRef.current = speechEngine.speak({
        tokens: sentence.words.slice(fromWord),
        onToken: (i) => {
          const word = fromWord + i;
          wordRef.current = word;
          setWordIndex(word);
        },
        onDone: () => {
          const next = sIndex + 1;
          if (next < total) {
            speakFrom(next, 0); // §4.1 Step 2: keep narrating to the end.
          } else {
            handleRef.current = null;
            doneRef.current = true;
            setIsDone(true);
            setIsPlaying(false);
          }
        },
      });
    },
    [story, total],
  );

  const pause = useCallback(() => {
    handleRef.current?.cancel();
    handleRef.current = null;
    setIsPlaying(false);
  }, []);

  /** Resume (or start) from the current position; no-op once the story is finished. */
  const play = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    speakFrom(sentenceRef.current, wordRef.current);
  }, [speakFrom]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

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

  return {
    sentenceIndex,
    wordIndex,
    isPlaying,
    isDone,
    total,
    currentSentence: story.sentences[sentenceIndex],
    play,
    pause,
    togglePlay,
    onWordTap,
  };
}
