/**
 * Quiz state machine for the Quiz screen (§6.4, §4.1 Steps 6–7).
 *
 * Owns "which question, what did they pick, what is Johnny saying" so `app/quiz.tsx` stays
 * a thin view — the same split `useStoryPlayback` uses for the lesson screen, and for the
 * same reason: the reveal timers and speech handles need cleanup on unmount.
 *
 * The child is a pre-reader, so every prompt and every one of Johnny's lines is spoken
 * through the `lib/speech.ts` seam (never `expo-speech` directly) exactly like the story
 * narration and the phonics breakdown.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

import type { Quiz } from '@/constants/quiz';
import type { JohnnyState } from '@/components/lesson/johnny';
import { speechEngine, type SpeakHandle } from '@/lib/speech';

/** 'asking' = input live; 'revealing' = answer locked and showing; 'summary' = §6.4 completion. */
export type QuizPhase = 'asking' | 'revealing' | 'summary';

/**
 * Reveal hold times. Both sit inside the §7 "under ~2s, calming pace" budget; the wrong
 * answer holds longer so the highlighted correct choice has time to register.
 */
const CORRECT_ADVANCE_MS = 1200;
const WRONG_ADVANCE_MS = 1800;

/**
 * Beat before a question is read aloud. Gives the screen a calm entrance (§7) and keeps
 * the first prompt clear of the outgoing lesson screen's speech-stopping unmount cleanup.
 */
const PROMPT_DELAY_MS = 600;

/**
 * Johnny never tells the child they were wrong (§4.3, §6.3) — a miss gets encouragement
 * and a point at the answer, not a correction.
 */
const CORRECT_LINES = ['Yes! You got it!', 'That is right! Great job!'];
const WRONG_LINES = ['Good try! This one is the answer.', 'Nice try! Here is the answer.'];

export function useQuiz(quiz: Quiz) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [phase, setPhase] = useState<QuizPhase>('asking');
  const [starsEarned, setStarsEarned] = useState(0);
  const [johnnyLine, setJohnnyLine] = useState<string | null>(null);
  const [johnnyState, setJohnnyState] = useState<JohnnyState>('idle');

  const total = quiz.questions.length;
  const question = quiz.questions[questionIndex];

  // Every pending timer and utterance, so unmount can cancel all of them.
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const handleRef = useRef<SpeakHandle | null>(null);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Read each new question aloud as it appears; cancel if the child answers first or leaves.
  useEffect(() => {
    if (phase !== 'asking' || !question) {
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      if (!cancelled) {
        handleRef.current = speechEngine.speak({ tokens: [question.prompt], rate: 0.8 });
      }
    }, PROMPT_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase, question]);

  // Cancel everything in flight when the screen goes away (§ no speech left playing).
  useEffect(
    () => () => {
      clearTimers();
      handleRef.current?.cancel();
      speechEngine.stop();
    },
    [clearTimers],
  );

  /**
   * §6.4: a correct answer celebrates and moves on; a wrong one gets encouragement plus a
   * highlight of the correct choice, then moves on. Either way the child is never stuck.
   */
  const answer = useCallback(
    (choiceId: string) => {
      if (phase !== 'asking' || !question) {
        return; // Input is locked during the reveal.
      }

      const isCorrect = choiceId === question.correctId;
      const lines = isCorrect ? CORRECT_LINES : WRONG_LINES;
      const line = lines[questionIndex % lines.length];

      setSelectedId(choiceId);
      setPhase('revealing');
      setJohnnyState(isCorrect ? 'celebrate' : 'encourage');
      setJohnnyLine(line);
      if (isCorrect) {
        setStarsEarned((stars) => stars + 1); // One star per question answered correctly.
      }

      handleRef.current?.cancel();
      handleRef.current = speechEngine.speak({ tokens: [line], rate: 0.8 });

      addTimer(() => {
        const next = questionIndex + 1;
        setSelectedId(null);
        setJohnnyLine(null);
        setJohnnyState('idle');
        if (next < total) {
          setQuestionIndex(next);
          setPhase('asking');
        } else {
          setPhase('summary'); // §6.4 Completion.
        }
      }, isCorrect ? CORRECT_ADVANCE_MS : WRONG_ADVANCE_MS);
    },
    [addTimer, phase, question, questionIndex, total],
  );

  return {
    question,
    questionIndex,
    total,
    phase,
    selectedId,
    starsEarned,
    johnnyLine,
    johnnyState,
    answer,
  };
}
