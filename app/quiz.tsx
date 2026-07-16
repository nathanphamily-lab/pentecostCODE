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
import { getQuiz, type QuizQuestion } from '@/constants/quiz';
import { getStory } from '@/constants/stories';
import { Fonts } from '@/constants/theme';
import { useQuiz, type QuizPhase } from '@/hooks/use-quiz';

/**
 * §6.4: on reveal the correct choice always highlights — whether or not it was the one
 * picked — the wrong pick is marked gently, and the rest fade back.
 */
function choiceState(
  choiceId: string,
  question: QuizQuestion,
  selectedId: string | null,
  phase: QuizPhase,
): AnswerChoiceState {
  if (phase === 'asking') {
    return 'idle';
  }
  if (choiceId === question.correctId) {
    return 'correct';
  }
  if (choiceId === selectedId) {
    return 'wrong';
  }
  return 'dimmed';
}

export default function QuizScreen() {
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  const quiz = useMemo(() => getQuiz(storyId), [storyId]);
  // Same background as the story it follows, so the quiz feels like the same scene.
  const story = useMemo(() => getStory(storyId), [storyId]);

  const { question, questionIndex, total, phase, selectedId, starsEarned, johnnyLine, johnnyState, answer } =
    useQuiz(quiz);

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
      <View style={[styles.band, { backgroundColor: story.background.sky }]} />
      <View style={[styles.band, styles.ground, { backgroundColor: story.background.ground }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top row: back arrow + question progress. */}
        <View style={styles.topRow}>
          <Pressable
            onPress={goHome}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            hitSlop={12}
            style={styles.iconButton}>
            <IconSymbol name="chevron.left" size={28} color="#1B2430" />
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
                {question.choices.map((choice) => (
                  <AnswerChoice
                    key={choice.id}
                    choice={choice}
                    state={choiceState(choice.id, question, selectedId, phase)}
                    onPress={() => answer(choice.id)}
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

const styles = StyleSheet.create({
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrap: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  prompt: {
    fontFamily: Fonts.rounded,
    fontSize: 28,
    fontWeight: '700',
    color: '#1B2430',
    textAlign: 'center',
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    paddingBottom: 8,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bubbleText: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '600',
    color: '#1B2430',
  },
});
