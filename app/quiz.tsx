/**
 * Quiz screen (AppSpec §6.4, §4.1 Steps 6–7).
 *
 * Fires automatically after the last sentence of a story (`app/lesson.tsx` replaces itself
 * with this route). Asks 1–3 comprehension questions with picture-based answer choices:
 * a correct pick celebrates and moves on, a wrong pick gets encouragement plus a highlight
 * of the right answer and moves on anyway, so the child is never stuck. The last question
 * leads to a summary of stars earned and a way back Home.
 *
 * The layout deliberately mirrors `app/lesson.tsx` — same background bands, same
 * SafeAreaView skeleton, same progress bar and bottom-left Johnny — so the story and its
 * quiz read as one continuous place. All quiz state lives in `useQuiz`; this file is
 * just the layout.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Johnny } from '@/components/lesson/johnny';
import { ProgressBar } from '@/components/lesson/progress-bar';
import { AnswerChoice, type AnswerChoiceState } from '@/components/quiz/answer-choice';
import { QuizSummary } from '@/components/quiz/quiz-summary';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getSceneBackground, type QuizQuestion } from '@/constants/content';
import { getStoryContent } from '@/constants/content-library';
import type { Tokens } from '@/constants/tokens';
import { useQuiz, type QuizPhase } from '@/hooks/use-quiz';
import { useTokens } from '@/hooks/use-tokens';

/**
 * §6.4: on reveal the correct choice always highlights — whether or not it was the one
 * picked — the wrong pick is marked gently, and the rest fade back.
 */
function choiceState(
  choiceIndex: number,
  question: QuizQuestion,
  selectedIndex: number | null,
  phase: QuizPhase,
): AnswerChoiceState {
  if (phase === 'asking') {
    return 'idle';
  }
  if (question.choices[choiceIndex].isCorrect) {
    return 'correct';
  }
  if (choiceIndex === selectedIndex) {
    return 'wrong';
  }
  return 'dimmed';
}

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  // The story carries its own quiz, so one lookup gives both the questions and — via the
  // same scene key — the background, keeping the quiz in the place the story just left.
  const story = useMemo(() => getStoryContent(id), [id]);
  const scene = useMemo(() => getSceneBackground(story.background), [story.background]);
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const { question, questionIndex, total, phase, selectedIndex, starsEarned, johnnyLine, johnnyState, answer } =
    useQuiz(story.quiz);

  // §4.1 Step 7: back to Home. Falls back to a replace when the quiz was opened directly
  // (deep link) and there is no stack to dismiss.
  const goHome = useCallback(() => {
    if (router.canGoBack()) {
      router.dismissTo('/');
    } else {
      router.replace('/');
    }
  }, [router]);

  // Questions answered so far; the summary counts them all as done.
  const completed = phase === 'summary' ? total : questionIndex;

  return (
    <View style={styles.root}>
      {/* Placeholder illustrated scene: two-band sky/ground (§7, real art later). */}
      <View style={[styles.band, { backgroundColor: scene.sky }]} />
      <View style={[styles.band, styles.ground, { backgroundColor: scene.ground }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top row: back arrow + question progress. */}
        <View style={styles.topRow}>
          <Pressable
            onPress={goHome}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            hitSlop={12}
            style={styles.iconButton}>
            <IconSymbol name="chevron.left" size={28} color={tokens.colors.textPrimary} />
          </Pressable>
          <View style={styles.progressWrap}>
            <ProgressBar current={completed} total={total} />
          </View>
        </View>

        {/* Center: the question and its picture choices, or the summary once finished. */}
        <View style={styles.center}>
          {phase === 'summary' ? (
            <QuizSummary starsEarned={starsEarned} total={total} onDone={goHome} />
          ) : question ? (
            <View style={styles.card}>
              <Text style={styles.prompt}>{question.prompt}</Text>
              <View style={styles.choices}>
                {question.choices.map((choice, choiceIndex) => (
                  <AnswerChoice
                    key={`${choice.label}-${choiceIndex}`}
                    choice={choice}
                    state={choiceState(choiceIndex, question, selectedIndex, phase)}
                    onPress={() => answer(choiceIndex)}
                    disabled={phase !== 'asking'}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>

        {/* Bottom row: Johnny (left), reacting, with whatever he is saying (§4.3). */}
        <View style={styles.bottomRow}>
          <Johnny state={phase === 'summary' ? 'celebrate' : johnnyState} />
          {johnnyLine ? (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{johnnyLine}</Text>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    band: {
      ...StyleSheet.absoluteFillObject,
      bottom: '35%',
    },
    ground: {
      top: '65%',
      bottom: 0,
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
    card: {
      ...t.card,
      paddingVertical: t.spacing.lg,
      paddingHorizontal: t.spacing.lg,
      alignItems: 'center',
      gap: t.spacing.lg,
      maxWidth: t.contentMaxWidth,
      width: '100%',
      alignSelf: 'center',
    },
    prompt: {
      ...t.type.prompt,
      color: t.colors.textPrimary,
      textAlign: 'center',
    },
    choices: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: t.spacing.md,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: t.spacing.sm,
      paddingBottom: t.spacing.sm,
    },
    bubble: {
      flex: 1,
      backgroundColor: t.colors.surface,
      borderRadius: t.card.borderRadius,
      paddingVertical: t.spacing.sm,
      paddingHorizontal: t.spacing.md,
      marginBottom: t.spacing.sm,
      ...t.controlShadow,
    },
    bubbleText: {
      ...t.type.cardLabel,
      color: t.colors.textPrimary,
    },
  });
}
