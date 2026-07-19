/**
 * The content library — the single registry every content screen reads from.
 *
 * Home derives its rows from `CATEGORY_ROWS` + `getCategoryItems()`, the Lesson and Quiz
 * screens resolve an `id` route param through `getContent()`, and the Phonics Breakdown
 * finds a tapped word's sounds by walking these items. Adding content means adding an
 * entry here — nothing else changes.
 *
 * Only `creation` is `status: 'ready'`. Everything else is a `planned` stub: real enough
 * to render a locked card in the right row and prove the schema, with no script, quiz, or
 * phoneme data yet. Stub titles and thumbnail tints carry over from the old
 * `home-content.ts` so Home looks unchanged.
 */
import { CREATION } from '@/constants/content-creation';
import { p, type Category, type Content, type LessonContent, type StoryContent } from '@/constants/content';

/* -------------------------------------------------------------------------- */
/* Stub builders                                                               */
/* -------------------------------------------------------------------------- */

type StubBase = {
  id: string;
  title: string;
  tier: StoryContent['tier'];
  thumbnail: string;
  order: number;
  unlockedBy?: string[];
};

/** A planned Bible story (§5.2): metadata only, no script or quiz yet. */
function plannedStory(stub: StubBase & { background: string; phonicsFocus: string[] }): StoryContent {
  return {
    ...stub,
    type: 'story',
    category: 'bibleStories',
    skills: ['pronunciation', 'comprehension'],
    status: 'planned',
    sentences: [],
    quiz: [],
  };
}

/** A planned letter / sight-word / special-sound lesson: metadata + its focus word. */
function plannedLesson(
  stub: StubBase & {
    type: LessonContent['type'];
    category: Category;
    targetWord: string;
    targetSound?: string;
    exampleImage?: string;
    phonicsFocus: string[];
    skills?: LessonContent['skills'];
  },
): LessonContent {
  const { targetWord, skills, ...rest } = stub;
  return {
    ...rest,
    skills: skills ?? ['pronunciation'],
    status: 'planned',
    background: 'classroom',
    // A stub's target word is unsplit on purpose — real phonemes land when it is authored.
    targetWord: { text: targetWord, phonemes: [p(targetWord)] },
  };
}

/* -------------------------------------------------------------------------- */
/* The library                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * §3.3 "Start Here": Johnny's ages 0–4 foundational content. All planned — these are the
 * onboarding-style lessons, not yet scripted.
 */
const START_HERE: Content[] = [
  plannedLesson({ id: 'start-meet-johnny', title: 'Meet Johnny', type: 'letter', category: 'startHere', tier: 1, thumbnail: '#FFB4A2', order: 0, targetWord: 'Johnny', phonicsFocus: ['listening'] }),
  plannedLesson({ id: 'start-first-sounds', title: 'First Sounds', type: 'letter', category: 'startHere', tier: 1, thumbnail: '#FFCB77', order: 1, targetWord: 'sound', phonicsFocus: ['letter-sounds'] }),
  plannedLesson({ id: 'start-say-hello', title: 'Say Hello', type: 'sightWord', category: 'startHere', tier: 1, thumbnail: '#B5E48C', order: 2, targetWord: 'hello', phonicsFocus: ['sight-words'] }),
  plannedLesson({ id: 'start-big-small', title: 'Big & Small', type: 'sightWord', category: 'startHere', tier: 1, thumbnail: '#90DBF4', order: 3, targetWord: 'big', phonicsFocus: ['vocabulary'], skills: ['vocabulary'] }),
];

/** §5.2 Biblical Story Scope. Creation is authored; the rest are planned. */
const BIBLE_STORIES: Content[] = [
  CREATION,
  plannedStory({ id: 'noahs-ark', title: "Noah's Ark", tier: 1, thumbnail: '#219EBC', order: 1, background: 'ark-sea', phonicsFocus: ['short-vowels', 'ck-words'], unlockedBy: ['creation'] }),
  plannedStory({ id: 'baby-moses', title: 'Baby Moses', tier: 1, thumbnail: '#FFB703', order: 2, background: 'river-reeds', phonicsFocus: ['long-vowels', 'silent-e'], unlockedBy: ['noahs-ark'] }),
  plannedStory({ id: 'david-and-goliath', title: 'David & Goliath', tier: 2, thumbnail: '#FB8500', order: 3, background: 'battlefield', phonicsFocus: ['blends', 'digraphs'], unlockedBy: ['baby-moses'] }),
  plannedStory({ id: 'daniel-lions-den', title: "Daniel in the Lion's Den", tier: 2, thumbnail: '#E29578', order: 4, background: 'lions-den', phonicsFocus: ['r-controlled'], unlockedBy: ['david-and-goliath'] }),
  plannedStory({ id: 'joseph-and-his-brothers', title: 'Joseph & His Brothers', tier: 3, thumbnail: '#CDB4DB', order: 5, background: 'egypt-road', phonicsFocus: ['multi-syllable', 'complex-vowels'], unlockedBy: ['daniel-lions-den'] }),
  plannedStory({ id: 'sermon-on-the-mount', title: 'Sermon on the Mount', tier: 3, thumbnail: '#7209B7', order: 6, background: 'mountainside', phonicsFocus: ['fluency'], unlockedBy: ['joseph-and-his-brothers'] }),
];

/**
 * §3.3 "Letters A–Z". Deliberately sparse: letters are being reworked to be taught in
 * groups rather than one card per letter, so only a, b and d are stubbed for now (c is
 * intentionally skipped) to prove `order` lets us defer and reorder without renaming ids.
 */
const LETTERS: Content[] = [
  plannedLesson({ id: 'letter-a', title: 'Letter A', type: 'letter', category: 'letters', tier: 1, thumbnail: '#FF9F1C', order: 0, targetWord: 'apple', targetSound: '/æ/', exampleImage: '🍎', phonicsFocus: ['letter-sounds'] }),
  plannedLesson({ id: 'letter-b', title: 'Letter B', type: 'letter', category: 'letters', tier: 1, thumbnail: '#2EC4B6', order: 1, targetWord: 'ball', targetSound: '/b/', exampleImage: '⚽️', phonicsFocus: ['letter-sounds'] }),
  plannedLesson({ id: 'letter-d', title: 'Letter D', type: 'letter', category: 'letters', tier: 1, thumbnail: '#9B5DE5', order: 3, targetWord: 'dog', targetSound: '/d/', exampleImage: '🐶', phonicsFocus: ['letter-sounds'] }),
];

/** §3.3 "Sight Words": high-frequency words by level. */
const SIGHT_WORDS: Content[] = [
  plannedLesson({ id: 'sight-the', title: 'the', type: 'sightWord', category: 'sightWords', tier: 1, thumbnail: '#F15BB5', order: 0, targetWord: 'the', phonicsFocus: ['sight-words'], skills: ['vocabulary'] }),
  plannedLesson({ id: 'sight-and', title: 'and', type: 'sightWord', category: 'sightWords', tier: 1, thumbnail: '#FEE440', order: 1, targetWord: 'and', phonicsFocus: ['sight-words'], skills: ['vocabulary'] }),
  plannedLesson({ id: 'sight-is', title: 'is', type: 'sightWord', category: 'sightWords', tier: 1, thumbnail: '#00F5D4', order: 2, targetWord: 'is', phonicsFocus: ['sight-words'], skills: ['vocabulary'] }),
  plannedLesson({ id: 'sight-you', title: 'you', type: 'sightWord', category: 'sightWords', tier: 2, thumbnail: '#9B5DE5', order: 3, targetWord: 'you', phonicsFocus: ['sight-words'], skills: ['vocabulary'] }),
];

/** §3.3 "Special Sounds": digraphs, blends, trigraphs. */
const SPECIAL_SOUNDS: Content[] = [
  plannedLesson({ id: 'digraph-sh', title: 'SH', type: 'specialSound', category: 'specialSounds', tier: 2, thumbnail: '#06D6A0', order: 0, targetWord: 'ship', targetSound: '/ʃ/', exampleImage: '🚢', phonicsFocus: ['digraphs'] }),
  plannedLesson({ id: 'digraph-ch', title: 'CH', type: 'specialSound', category: 'specialSounds', tier: 2, thumbnail: '#118AB2', order: 1, targetWord: 'chair', targetSound: '/tʃ/', exampleImage: '🪑', phonicsFocus: ['digraphs'] }),
  plannedLesson({ id: 'digraph-th', title: 'TH', type: 'specialSound', category: 'specialSounds', tier: 2, thumbnail: '#EF476F', order: 2, targetWord: 'thumb', targetSound: '/θ/', exampleImage: '👍', phonicsFocus: ['digraphs'] }),
  plannedLesson({ id: 'trigraph-igh', title: 'IGH', type: 'specialSound', category: 'specialSounds', tier: 3, thumbnail: '#FFD166', order: 3, targetWord: 'light', targetSound: '/aɪ/', exampleImage: '💡', phonicsFocus: ['trigraphs'] }),
];

/** §3.3 "Ages 5–7": the advanced tier. */
const ADVANCED: Content[] = [
  plannedLesson({ id: 'advanced-long-vowels', title: 'Long Vowels', type: 'specialSound', category: 'advanced', tier: 2, thumbnail: '#7209B7', order: 0, targetWord: 'cake', phonicsFocus: ['long-vowels'] }),
  plannedLesson({ id: 'advanced-silent-e', title: 'Silent E', type: 'specialSound', category: 'advanced', tier: 2, thumbnail: '#3A0CA3', order: 1, targetWord: 'snake', phonicsFocus: ['silent-e'] }),
  plannedLesson({ id: 'advanced-blends', title: 'Blends', type: 'specialSound', category: 'advanced', tier: 2, thumbnail: '#4361EE', order: 2, targetWord: 'stop', phonicsFocus: ['blends'] }),
  plannedLesson({ id: 'advanced-syllables', title: 'Syllables', type: 'specialSound', category: 'advanced', tier: 3, thumbnail: '#4CC9F0', order: 3, targetWord: 'rabbit', phonicsFocus: ['multi-syllable'], skills: ['fluency'] }),
];

export const CONTENT: Content[] = [
  ...START_HERE,
  ...BIBLE_STORIES,
  ...LETTERS,
  ...SIGHT_WORDS,
  ...SPECIAL_SOUNDS,
  ...ADVANCED,
];

/* -------------------------------------------------------------------------- */
/* Lookup                                                                      */
/* -------------------------------------------------------------------------- */

export const CONTENT_BY_ID: Record<string, Content> = Object.fromEntries(
  CONTENT.map((item) => [item.id, item]),
);

/** The item opened when no `id` param is provided (deep link, or a card built before ids). */
export const DEFAULT_CONTENT = CREATION;

export function getContent(id?: string | null): Content | undefined {
  return id ? CONTENT_BY_ID[id] : undefined;
}

/**
 * Resolve a route param to a playable story, falling back to Creation — the same
 * forgiving behavior the old `getStory()` had, so a bad or missing id never blanks
 * the screen.
 */
export function getStoryContent(id?: string | null): StoryContent {
  const item = getContent(id);
  if (item && item.type === 'story' && item.sentences.length > 0) {
    return item;
  }
  return DEFAULT_CONTENT;
}

/* -------------------------------------------------------------------------- */
/* Home rows                                                                   */
/* -------------------------------------------------------------------------- */

/** The §3.3 content rows, in the order Home renders them. */
export const CATEGORY_ROWS: { category: Category; title: string }[] = [
  { category: 'startHere', title: 'Start Here' },
  { category: 'bibleStories', title: 'Bible Stories' },
  { category: 'letters', title: 'Letters A–Z' },
  { category: 'sightWords', title: 'Sight Words' },
  { category: 'specialSounds', title: 'Special Sounds' },
  { category: 'advanced', title: 'Ages 5–7' },
];

export function getCategoryItems(category: Category): Content[] {
  return CONTENT.filter((item) => item.category === category).sort((a, b) => a.order - b.order);
}
