/**
 * The content schema — the single shape every content screen reads from (§5, §6.2–§6.4).
 *
 * Before this file, content lived in four unrelated modules (`stories.ts`, `quiz.ts`,
 * `home-content.ts`, `phonics.ts`) with no link between a Home card and the story it was
 * supposed to open. Everything is now one `Content` union keyed by a stable slug, so a
 * card, a route param, a story, its quiz, and its phoneme data all refer to the same id.
 *
 * The data itself lives in `content-library.ts` (registry + stubs) and
 * `content-creation.ts` (the migrated Creation story). This file is types + the small
 * helpers that read them.
 */

/* -------------------------------------------------------------------------- */
/* Phonemes and words                                                          */
/* -------------------------------------------------------------------------- */

/**
 * How a phoneme renders in the Phonics Breakdown (§6.3 Special rules).
 * `silent` grays out with a "silent" label; `digraph` / `blend` / `vowelTeam` /
 * `rControlled` are multi-letter graphemes that highlight together as one tile.
 */
export type PhonemeType = 'normal' | 'silent' | 'digraph' | 'blend' | 'vowelTeam' | 'rControlled';

export type Phoneme = {
  /** Letters shown on the tile, e.g. "s", "sh", "igh". */
  grapheme: string;
  /** Token spoken by the speech engine for this phoneme; empty for silent letters. */
  sound: string;
  type: PhonemeType;
  /** Real phoneme audio, once a TTS vendor is chosen (§8.1). Falls back to `sound`. */
  audio?: string;
  /** A familiar word using this sound, for the breakdown screen to reference. */
  exampleWord?: string;
};

/**
 * Builders for authoring phoneme arrays. They keep the content files readable —
 * `[p('s'), p('n'), p('a'), p('k'), silent('e')]` instead of five object literals.
 */

/** A plain single-letter sound. Defaults to speaking the letter itself. */
export const p = (grapheme: string, sound = grapheme): Phoneme => ({
  grapheme,
  sound,
  type: 'normal',
});

/** A silent letter (e.g. the "e" in snake) — grayed, with no spoken sound. */
export const silent = (grapheme: string): Phoneme => ({ grapheme, sound: '', type: 'silent' });

/** Two or three letters making one consonant sound: sh, ch, th, igh. */
export const digraph = (grapheme: string, sound: string): Phoneme => ({
  grapheme,
  sound,
  type: 'digraph',
});

/** Consonants that keep their own sounds but are read together: st, gr, nd. */
export const blend = (grapheme: string, sound: string): Phoneme => ({
  grapheme,
  sound,
  type: 'blend',
});

/** Vowels making one sound together: oo, ai, aw, ea. */
export const vowelTeam = (grapheme: string, sound: string): Phoneme => ({
  grapheme,
  sound,
  type: 'vowelTeam',
});

/** A vowel coloured by a following r: ar, ir, er, or. */
export const rControlled = (grapheme: string, sound: string): Phoneme => ({
  grapheme,
  sound,
  type: 'rControlled',
});

/** True for the multi-letter graphemes that render as one grouped tile (§6.3). */
export function isGroupedPhoneme(phoneme: Phoneme): boolean {
  return (
    phoneme.type === 'digraph' ||
    phoneme.type === 'blend' ||
    phoneme.type === 'vowelTeam' ||
    phoneme.type === 'rControlled'
  );
}

export type Word = {
  text: string;
  audio?: string;
  /** Drives the Phonics Breakdown when this word is tapped (§4.1 Step 3). */
  phonemes: Phoneme[];
};

export type Sentence = {
  words: Word[];
  audio?: string;
};

/* -------------------------------------------------------------------------- */
/* Quizzes                                                                     */
/* -------------------------------------------------------------------------- */

export type QuizChoice = {
  /** Short caption under the picture; also the accessibility label. */
  label: string;
  /** Picture answer (§6.4): an emoji placeholder today, an asset key once art exists. */
  image?: string;
  isCorrect: boolean;
  /** Placeholder card tint from the §7 crayon-box palette, until real answer art. */
  color?: string;
};

export type QuizQuestion = {
  prompt: string;
  promptAudio?: string;
  /** 2–3 picture choices (§6.4 Format). Exactly one should be `isCorrect`. */
  choices: QuizChoice[];
};

/* -------------------------------------------------------------------------- */
/* Content items                                                               */
/* -------------------------------------------------------------------------- */

/** The four progress bars on the Progress screen (§3.1). */
export type ReadingSkill = 'pronunciation' | 'comprehension' | 'fluency' | 'vocabulary';

export type ContentType = 'story' | 'letter' | 'sightWord' | 'specialSound';

/** One per Home row, in §3.3 order. */
export type Category =
  | 'startHere'
  | 'bibleStories'
  | 'letters'
  | 'sightWords'
  | 'specialSounds'
  | 'advanced';

/** Reading level (§5.1): 1 = ages 3–4, 2 = ages 5–6, 3 = age 7+. */
export type Tier = 1 | 2 | 3;

/**
 * `status` is the authoring state, not the child's progress: `ready` items are playable,
 * `draft` and `planned` render locked. Actual progress-based gating goes through
 * `unlockedBy` once a progress store exists.
 */
export type ContentStatus = 'ready' | 'draft' | 'planned';

export type BaseContent = {
  /** Stable slug: "creation", "letter-a", "sight-the", "digraph-sh". */
  id: string;
  type: ContentType;
  category: Category;
  title: string;
  tier: Tier;
  /** e.g. ["cvc", "sight-words"] — the §5.2 "Key Phonics Focus" column. */
  phonicsFocus: string[];
  /** Which of the four §3.1 progress skills this item exercises. */
  skills: ReadingSkill[];
  /** Placeholder crayon-box tint (§7) until real illustrated thumbnails exist. */
  thumbnail?: string;
  /** Sequence within the category; lets us defer or reorder without touching ids. */
  order: number;
  /** Prerequisite content ids; the item stays locked until all are completed. */
  unlockedBy?: string[];
  status: ContentStatus;
};

/**
 * One spread of the picture book: a single illustration plus the sentences read over it.
 *
 * The illustration is fixed for the whole page — it only changes when the page turns.
 * Within a page the text card advances sentence by sentence (§6.2: "2–3 lines at a time").
 */
export type Page = {
  /** Stable slug, unique within the story: "creation-p1". */
  id: string;
  /** Illustrated scene asset key for this page, resolved by `getPageArt`. */
  background: string;
  /** Plain-language description of the illustration, for the designer. Doubles as the
   *  on-screen placeholder text until the art for `background` is delivered. */
  artBrief?: string;
  sentences: Sentence[];
};

/** A Bible story → Story Screen (§6.2) followed by its quiz (§6.4). */
export type StoryContent = BaseContent & {
  type: 'story';
  pages: Page[];
  /** Scene key for the quiz backdrop; defaults to the last page's. See `getQuizBackground`. */
  quizBackground?: string;
  quiz: QuizQuestion[];
};

/** A letter, sight word, or special sound → Lesson Screen (§6.2, §3.1). */
export type LessonContent = BaseContent & {
  type: 'letter' | 'sightWord' | 'specialSound';
  background: string;
  /** The focus word; carries the phonemes for its breakdown. */
  targetWord: Word;
  /** e.g. "/æ/". */
  targetSound?: string;
  /** e.g. "🍎" — placeholder picture until real art. */
  exampleImage?: string;
  /** Johnny's opening line for this lesson (§4.3). */
  johnnyIntro?: string;
};

export type Content = StoryContent | LessonContent;

export function isStory(item: Content): item is StoryContent {
  return item.type === 'story';
}

export function isLesson(item: Content): item is LessonContent {
  return item.type !== 'story';
}

/* -------------------------------------------------------------------------- */
/* Unlocking                                                                   */
/* -------------------------------------------------------------------------- */

const NO_COMPLETIONS: ReadonlySet<string> = new Set();

/**
 * §6.1: an item is playable only when it is authored (`ready`) and every prerequisite
 * has been completed. There is no progress store yet, so callers pass nothing and
 * anything with an `unlockedBy` reads as locked — which is the intended prototype state.
 */
export function isUnlocked(
  item: Content,
  completedIds: ReadonlySet<string> = NO_COMPLETIONS,
): boolean {
  if (item.status !== 'ready') {
    return false;
  }
  return (item.unlockedBy ?? []).every((id) => completedIds.has(id));
}

/* -------------------------------------------------------------------------- */
/* Scene backgrounds                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Placeholder two-band scene tints (§7) keyed by the `background` scene key on each item.
 * Real illustrated backgrounds replace this map without changing the content schema —
 * an item keeps saying `background: 'creation-sky-field'` either way.
 */
export type SceneBackground = { sky: string; ground: string };

export const SCENE_BACKGROUNDS: Record<string, SceneBackground> = {
  'creation-sky-field': { sky: '#8ECAE6', ground: '#B5E48C' },
  'ark-sea': { sky: '#219EBC', ground: '#8ECAE6' },
  'river-reeds': { sky: '#FFB703', ground: '#B5E48C' },
  'battlefield': { sky: '#FB8500', ground: '#E29578' },
  'lions-den': { sky: '#E29578', ground: '#9C6644' },
  'egypt-road': { sky: '#CDB4DB', ground: '#FFCB77' },
  'mountainside': { sky: '#90DBF4', ground: '#B5E48C' },
  /** Neutral indoor scene for letter / sight-word / special-sound lessons. */
  classroom: { sky: '#FFE8D6', ground: '#FFCB77' },
};

const FALLBACK_SCENE: SceneBackground = SCENE_BACKGROUNDS['creation-sky-field'];

export function getSceneBackground(key: string): SceneBackground {
  return SCENE_BACKGROUNDS[key] ?? FALLBACK_SCENE;
}

/* -------------------------------------------------------------------------- */
/* Page illustrations                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Real story illustrations, keyed by a page's `background`.
 *
 * Empty until the artwork is delivered. Adding an entry is the *only* change needed to
 * light up a page — the Story screen renders a placeholder (warm fill + the page's
 * `artBrief`) for any key missing here, so the flow is fully testable meanwhile.
 *
 *   'creation-p1': require('@/assets/images/stories/creation-p1.png'),
 *
 * A remote URL works too, and gets prefetched a page ahead so turns never pop.
 */
export const PAGE_ART: Record<string, number | string> = {};

export function getPageArt(key: string): number | string | null {
  return PAGE_ART[key] ?? null;
}

/** Scene key for a story's quiz backdrop: explicit override, else the last page's. */
export function getQuizBackground(story: StoryContent): string {
  return story.quizBackground ?? story.pages[story.pages.length - 1]?.background ?? 'creation-sky-field';
}
