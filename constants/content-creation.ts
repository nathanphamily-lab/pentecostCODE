/**
 * The Creation (Genesis 1) — Tier 1, the one `ready` item in the library (§5.2).
 *
 * Migrated verbatim from the old `constants/stories.ts` + `constants/quiz.ts`: the same
 * six placeholder sentences and the same three comprehension questions, now carrying the
 * phoneme data each word needs for the Phonics Breakdown (§6.3). Nothing here is new
 * content — the wording is still the simple, CVC-friendly placeholder, not a final
 * abridged script (§8.2).
 *
 * Word-level phonemes replace the old global `WORD_BREAKDOWNS` map: a word's sounds now
 * travel with the sentence that uses it, so a story is self-contained.
 */
import {
  blend,
  digraph,
  p,
  rControlled,
  silent,
  vowelTeam,
  type StoryContent,
  type Word,
} from '@/constants/content';

/**
 * Every distinct word in the story, defined once and reused across sentences ("the"
 * appears six times). Keeps the sentence definitions below readable and guarantees a
 * word breaks down identically wherever it appears.
 */
const W = {
  a: { text: 'a', phonemes: [p('a', 'uh')] },
  and: { text: 'and', phonemes: [p('a'), p('n'), p('d')] },
  andCap: { text: 'And', phonemes: [p('a'), p('n'), p('d')] },
  be: { text: 'be', phonemes: [p('b'), p('e', 'ee')] },
  birds: { text: 'birds', phonemes: [p('b'), rControlled('ir', 'er'), p('d'), p('s')] },
  fish: { text: 'fish', phonemes: [p('f'), p('i'), digraph('sh', 'sh')] },
  god: { text: 'God', phonemes: [p('g'), p('o'), p('d')] },
  good: { text: 'good', phonemes: [p('g'), vowelTeam('oo', 'oo'), p('d')] },
  grass: { text: 'grass', phonemes: [blend('gr', 'gr'), p('a'), digraph('ss', 's')] },
  he: { text: 'He', phonemes: [p('h'), p('e', 'ee')] },
  in: { text: 'In', phonemes: [p('i'), p('n')] },
  inLower: { text: 'in', phonemes: [p('i'), p('n')] },
  it: { text: 'it', phonemes: [p('i'), p('t')] },
  let: { text: 'let', phonemes: [p('l'), p('e'), p('t')] },
  light: { text: 'light', phonemes: [p('l'), digraph('igh', 'eye'), p('t')] },
  made: { text: 'made', phonemes: [p('m'), p('a'), p('d'), silent('e')] },
  moon: { text: 'moon', phonemes: [p('m'), vowelTeam('oo', 'oo'), p('n')] },
  // "said" is irregular — the ai team says /e/ here, not its usual /ay/.
  said: { text: 'said', phonemes: [p('s'), vowelTeam('ai', 'eh'), p('d')] },
  saw: { text: 'saw', phonemes: [p('s'), vowelTeam('aw', 'aw')] },
  sky: { text: 'sky', phonemes: [p('s'), p('k'), p('y', 'eye')] },
  snake: { text: 'snake', phonemes: [p('s'), p('n'), p('a'), p('k'), silent('e')] },
  start: { text: 'start', phonemes: [blend('st', 'st'), rControlled('ar', 'ar'), p('t')] },
  sun: { text: 'sun', phonemes: [p('s'), p('u'), p('n')] },
  that: { text: 'that', phonemes: [digraph('th', 'th'), p('a'), p('t')] },
  the: { text: 'the', phonemes: [digraph('th', 'th'), p('e', 'uh')] },
  // TODO(phonics): "there" is irregular (/ther/) and the right tile split is a curriculum
  // call — "e-r-e" as one r-controlled chunk is a guess. Confirm before this ships.
  there: { text: 'there', phonemes: [digraph('th', 'th'), rControlled('ere', 'air')] },
  // TODO(phonics): "was" is irregular — the a says /uh/ and the s says /z/. Confirm
  // whether it should be taught as a sight word instead of sounded out.
  was: { text: 'was', phonemes: [p('w'), p('a', 'uh'), p('s', 'z')] },
} satisfies Record<string, Word>;

export const CREATION: StoryContent = {
  id: 'creation',
  type: 'story',
  category: 'bibleStories',
  title: 'The Creation',
  tier: 1,
  phonicsFocus: ['cvc', 'sight-words'],
  skills: ['pronunciation', 'comprehension'],
  thumbnail: '#8ECAE6',
  order: 0,
  status: 'ready',
  background: 'creation-sky-field',

  sentences: [
    { words: [W.in, W.the, W.start, W.god, W.made, W.the, W.sky] },
    { words: [W.god, W.said, W.let, W.there, W.be, W.light] },
    { words: [W.he, W.made, W.the, W.sun, W.and, W.the, W.moon] },
    { words: [W.god, W.made, W.the, W.fish, W.and, W.the, W.birds] },
    { words: [W.he, W.made, W.a, W.snake, W.inLower, W.the, W.grass] },
    { words: [W.andCap, W.god, W.saw, W.that, W.it, W.was, W.good] },
  ],

  quiz: [
    {
      prompt: 'What did God make first?',
      choices: [
        { label: 'the sky', image: '☀️', isCorrect: true, color: '#8ECAE6' },
        { label: 'the fish', image: '🐟', isCorrect: false, color: '#90DBF4' },
      ],
    },
    {
      prompt: 'God said, "Let there be..."',
      choices: [
        { label: 'light', image: '💡', isCorrect: true, color: '#FFD166' },
        { label: 'the moon', image: '🌙', isCorrect: false, color: '#CDB4DB' },
        { label: 'a snake', image: '🐍', isCorrect: false, color: '#B5E48C' },
      ],
    },
    {
      prompt: 'Where was the snake?',
      choices: [
        { label: 'in the grass', image: '🌿', isCorrect: true, color: '#B5E48C' },
        { label: 'in the sky', image: '☁️', isCorrect: false, color: '#8ECAE6' },
      ],
    },
  ],
};
