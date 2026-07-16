/**
 * Quiz content model + placeholder questions for the Quiz screen (§6.4, §4.1 Step 6).
 *
 * Shaped like `constants/stories.ts` and keyed by story id, so the quiz screen looks one
 * up from a route param exactly the way `getStory()` works. These are dummy comprehension
 * questions written against the placeholder CREATION sentences, so every answer is
 * findable in the story the child just heard.
 *
 * `emoji` is the placeholder "picture" (§6.4 picture-based choices) until real illustrated
 * answer art exists (§7) — same stand-in strategy as Johnny's face and the story's
 * two-band background. Real art drops in as an added `image` field without touching layout.
 * `color` values come from the crayon-box palette already used in `constants/home-content.ts`.
 */

export type AnswerChoice = {
  id: string;
  /** Placeholder picture until real answer illustrations exist. */
  emoji: string;
  /** Short caption under the picture; also the accessibility label. */
  label: string;
  /** Placeholder card tint (§7 crayon-box palette). */
  color: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** 2–3 picture choices (§6.4 Format). */
  choices: AnswerChoice[];
  /** Must match one `choices[].id`. */
  correctId: string;
};

export type Quiz = {
  storyId: string;
  /** 1–3 questions (§6.4 Format). */
  questions: QuizQuestion[];
};

/** The Creation (Genesis 1) — placeholder questions, not a final assessment. */
export const CREATION_QUIZ: Quiz = {
  storyId: 'creation',
  questions: [
    {
      id: 'q-1',
      prompt: 'What did God make first?',
      choices: [
        { id: 'q1-sky', emoji: '☀️', label: 'the sky', color: '#8ECAE6' },
        { id: 'q1-fish', emoji: '🐟', label: 'the fish', color: '#90DBF4' },
      ],
      correctId: 'q1-sky',
    },
    {
      id: 'q-2',
      prompt: 'God said, "Let there be..."',
      choices: [
        { id: 'q2-light', emoji: '💡', label: 'light', color: '#FFD166' },
        { id: 'q2-moon', emoji: '🌙', label: 'the moon', color: '#CDB4DB' },
        { id: 'q2-snake', emoji: '🐍', label: 'a snake', color: '#B5E48C' },
      ],
      correctId: 'q2-light',
    },
    {
      id: 'q-3',
      prompt: 'Where was the snake?',
      choices: [
        { id: 'q3-grass', emoji: '🌿', label: 'in the grass', color: '#B5E48C' },
        { id: 'q3-sky', emoji: '☁️', label: 'in the sky', color: '#8ECAE6' },
      ],
      correctId: 'q3-grass',
    },
  ],
};

/** Keyed by story id so the quiz screen can look one up from a route param. */
export const QUIZZES: Record<string, Quiz> = {
  [CREATION_QUIZ.storyId]: CREATION_QUIZ,
};

/** The quiz shown when no `storyId` is provided; mirrors `DEFAULT_STORY`. */
export const DEFAULT_QUIZ = CREATION_QUIZ;

export function getQuiz(storyId?: string | null): Quiz {
  if (storyId && QUIZZES[storyId]) {
    return QUIZZES[storyId];
  }
  return DEFAULT_QUIZ;
}
