/**
 * Phoneme lexicon for The Creation, plus the sentence builder the story is authored with.
 *
 * The script is reading-level tuned and must appear in the app exactly as written, so
 * pages are authored by pasting the sentence verbatim — `s('The world is a big place.')`
 * — rather than by hand-assembling word objects. `s()` splits on whitespace and attaches
 * each token's sounds from `LEX`, which is keyed by *normalized* text: capitalization and
 * punctuation are stripped for the lookup, so "The", "the", "light." and "light," all find
 * the one authored entry. One word, one definition, however it appears in the prose.
 *
 * A token with no entry simply gets no phonemes. That degrades gracefully — `phonics.ts`
 * skips zero-phoneme words when building its index and falls back to a letter-by-letter
 * split — and the `__DEV__` warning below names the missing word so it never passes
 * silently.
 *
 * ## Where a split was a judgement call
 * Several words here are irregular, multi-syllable, or (for the snake's hiss) not really
 * phonics at all. Those carry a `TODO(phonics)` marker rather than a confident guess:
 * they need a curriculum call before this ships to children.
 */
import {
  blend,
  digraph,
  p,
  rControlled,
  silent,
  vowelTeam,
  type Phoneme,
  type Sentence,
} from '@/constants/content';

/**
 * Mirrors `normalize` in `phonics.ts`. Duplicated on purpose: importing it would close a
 * cycle (content-creation → creation-words → phonics → content-library → content-creation).
 */
const key = (token: string) => token.toLowerCase().replace(/[^a-z]/g, '');

/**
 * "S-see" and "s-sure" are the snake's playful lisp, not a spelling pattern — no English
 * word doubles its opening s like that. So both break down as the real word underneath,
 * shared with the plain entry below to keep them identical: a child who taps "S-see" is
 * asking what the word says, and the honest answer is "see".
 */
const SEE: Phoneme[] = [p('s'), vowelTeam('ee', 'ee')];

/**
 * Every distinct word in the script (130 of them), keyed by normalized text.
 *
 * The `-ed` suffix is authored as a single tile whose sound varies by word — /d/ in
 * "lived", /t/ in "looked", /id/ in "rested". TODO(phonics): confirm that teaching `-ed`
 * as one unit (rather than splitting e + d) matches the curriculum.
 */
export const LEX: Record<string, Phoneme[]> = {
  a: [p('a', 'uh')],
  // TODO(phonics): proper noun. Split as a-d-a-m; confirm the second "a" is /uh/.
  adam: [p('a'), p('d'), p('a', 'uh'), p('m')],
  // TODO(phonics): irregular — "ai" says /eh/ here, not its usual /ay/.
  again: [p('a', 'uh'), p('g'), vowelTeam('ai', 'eh'), p('n')],
  all: [p('a', 'aw'), digraph('ll', 'l')],
  along: [p('a', 'uh'), p('l'), p('o', 'aw'), digraph('ng', 'ng')],
  and: [p('a'), p('n'), p('d')],
  // TODO(phonics): three syllables, well past the Tier 1 pattern set.
  animals: [p('a'), p('n'), p('i'), p('m'), p('a', 'uh'), p('l'), p('s', 'z')],
  // TODO(phonics): compound (any + more); confirm whether to teach it as two parts.
  anymore: [p('a'), p('n'), p('y', 'ee'), p('m'), rControlled('ore', 'or')],
  are: [rControlled('ar', 'ar'), silent('e')],
  at: [p('a'), p('t')],
  ate: [p('a', 'ay'), p('t'), silent('e')],
  be: [p('b'), p('e', 'ee')],
  beat: [p('b'), vowelTeam('ea', 'ee'), p('t')],
  // TODO(phonics): "eau" is a one-off spelling; likely better taught as a sight word.
  beautiful: [p('b'), vowelTeam('eau', 'yoo'), p('t'), p('i', 'ih'), p('f'), p('u', 'uh'), p('l')],
  big: [p('b'), p('i'), p('g')],
  birds: [p('b'), rControlled('ir', 'er'), p('d'), p('s', 'z')],
  bite: [p('b'), p('i', 'eye'), p('t'), silent('e')],
  blue: [blend('bl', 'bl'), vowelTeam('ue', 'oo')],
  broke: [blend('br', 'br'), p('o', 'oh'), p('k'), silent('e')],
  but: [p('b'), p('u'), p('t')],
  by: [p('b'), p('y', 'eye')],
  called: [p('c', 'k'), p('a', 'aw'), digraph('ll', 'l'), p('ed', 'd')],
  came: [p('c', 'k'), p('a', 'ay'), p('m'), silent('e')],
  can: [p('c', 'k'), p('a'), p('n')],
  cant: [p('c', 'k'), p('a'), p('n'), p('t')],
  cried: [blend('cr', 'cr'), vowelTeam('ie', 'eye'), p('d')],
  day: [p('d'), vowelTeam('ay', 'ay')],
  did: [p('d'), p('i'), p('d')],
  dont: [p('d'), p('o', 'oh'), p('n'), p('t')],
  dry: [blend('dr', 'dr'), p('y', 'eye')],
  eat: [vowelTeam('ea', 'ee'), p('t')],
  // TODO(phonics): proper noun.
  eden: [p('e', 'ee'), p('d'), p('e', 'uh'), p('n')],
  // TODO(phonics): proper noun.
  eve: [p('e', 'ee'), p('v'), silent('e')],
  // TODO(phonics): compound (every + thing), four syllables.
  everything: [p('e'), p('v'), rControlled('er', 'er'), p('y', 'ee'), digraph('th', 'th'), p('i'), digraph('ng', 'ng')],
  // TODO(phonics): compound (every + where).
  everywhere: [p('e'), p('v'), rControlled('er', 'er'), p('y', 'ee'), digraph('wh', 'w'), rControlled('ere', 'air')],
  family: [p('f'), p('a'), p('m'), p('i', 'ih'), p('l'), p('y', 'ee')],
  felt: [p('f'), p('e'), p('l'), p('t')],
  first: [p('f'), rControlled('ir', 'er'), blend('st', 'st')],
  fish: [p('f'), p('i'), digraph('sh', 'sh')],
  five: [p('f'), p('i', 'eye'), p('v'), silent('e')],
  flap: [blend('fl', 'fl'), p('a'), p('p')],
  for: [p('f'), rControlled('or', 'or')],
  four: [p('f'), rControlled('our', 'or')],
  from: [blend('fr', 'fr'), p('o'), p('m')],
  fruit: [blend('fr', 'fr'), vowelTeam('ui', 'oo'), p('t')],
  garden: [p('g'), rControlled('ar', 'ar'), p('d'), p('e', 'uh'), p('n')],
  go: [p('g'), p('o', 'oh')],
  god: [p('g'), p('o'), p('d')],
  gods: [p('g'), p('o'), p('d'), p('s', 'z')],
  ground: [blend('gr', 'gr'), vowelTeam('ou', 'ow'), p('n'), p('d')],
  happy: [p('h'), p('a'), digraph('pp', 'p'), p('y', 'ee')],
  have: [p('h'), p('a'), p('v'), silent('e')],
  he: [p('h'), p('e', 'ee')],
  hid: [p('h'), p('i'), p('d')],
  hills: [p('h'), p('i'), digraph('ll', 'l'), p('s', 'z')],
  him: [p('h'), p('i'), p('m')],
  his: [p('h'), p('i'), p('s', 'z')],
  in: [p('i'), p('n')],
  is: [p('i'), p('s', 'z')],
  it: [p('i'), p('t')],
  its: [p('i'), p('t'), p('s')],
  // TODO(phonics): proper noun; the initial J and the /z/ are both irregular here.
  jesus: [p('j'), p('e', 'ee'), p('s', 'z'), p('u', 'uh'), p('s')],
  just: [p('j'), p('u'), blend('st', 'st')],
  // TODO(phonics): silent k is a Tier 2 pattern arriving early.
  knew: [silent('k'), p('n'), vowelTeam('ew', 'oo')],
  land: [p('l'), p('a'), p('n'), p('d')],
  lets: [p('l'), p('e'), p('t'), p('s')],
  light: [p('l'), digraph('igh', 'eye'), p('t')],
  like: [p('l'), p('i', 'eye'), p('k'), silent('e')],
  lived: [p('l'), p('i'), p('v'), p('ed', 'd')],
  looked: [p('l'), vowelTeam('oo', 'oo'), p('k'), p('ed', 't')],
  made: [p('m'), p('a'), p('d'), silent('e')],
  moon: [p('m'), vowelTeam('oo', 'oo'), p('n')],
  // TODO(phonics): three syllables; the "ai" in the second is an unstressed /uh/.
  mountains: [p('m'), vowelTeam('ou', 'ow'), p('n'), p('t'), vowelTeam('ai', 'uh'), p('n'), p('s', 'z')],
  name: [p('n'), p('a', 'ay'), p('m'), silent('e')],
  names: [p('n'), p('a', 'ay'), p('m'), silent('e'), p('s', 'z')],
  night: [p('n'), digraph('igh', 'eye'), p('t')],
  no: [p('n'), p('o', 'oh')],
  not: [p('n'), p('o'), p('t')],
  // TODO(phonics): "ce" saying /sh/ is a one-off; likely a sight word at this level.
  ocean: [p('o', 'oh'), p('c', 'sh'), vowelTeam('ea', 'uh'), p('n')],
  oh: [p('o', 'oh'), silent('h')],
  // TODO(phonics): irregular — "one" says /wun/; the letters do not predict it.
  one: [p('o', 'wuh'), p('n'), silent('e')],
  // TODO(phonics): "eo" saying /ee/ is irregular; commonly taught as a sight word.
  people: [p('p'), vowelTeam('eo', 'ee'), p('p'), p('l'), silent('e')],
  place: [blend('pl', 'pl'), p('a', 'ay'), p('c', 's'), silent('e')],
  rested: [p('r'), p('e'), blend('st', 'st'), p('ed', 'id')],
  rule: [p('r'), p('u', 'oo'), p('l'), silent('e')],
  sad: [p('s'), p('a'), p('d')],
  // "said" is irregular — the ai team says /e/ here, not its usual /ay/.
  said: [p('s'), vowelTeam('ai', 'eh'), p('d')],
  see: SEE,
  seven: [p('s'), p('e'), p('v'), p('e', 'uh'), p('n')],
  she: [digraph('sh', 'sh'), p('e', 'ee')],
  six: [p('s'), p('i'), p('x')],
  sky: [p('s'), p('k'), p('y', 'eye')],
  snake: [p('s'), p('n'), p('a'), p('k'), silent('e')],
  sneaky: [p('s'), p('n'), vowelTeam('ea', 'ee'), p('k'), p('y', 'ee')],
  // TODO(phonics): compound (some + one), and inherits the irregular "one".
  someone: [p('s'), p('o', 'uh'), p('m'), p('e', 'wuh'), p('n'), silent('e')],
  // TODO(phonics): compound (some + thing).
  something: [p('s'), p('o', 'uh'), p('m'), digraph('th', 'th'), p('i'), digraph('ng', 'ng')],
  splash: [blend('spl', 'spl'), p('a'), digraph('sh', 'sh')],
  // The snake's lisp — teaches the real word "see". See the note on SEE above.
  ssee: SEE,
  // The snake's lisp on "sure", which is itself irregular: the s says /sh/.
  ssure: [p('s', 'sh'), rControlled('ur', 'ur'), silent('e')],
  stars: [blend('st', 'st'), rControlled('ar', 'ar'), p('s', 'z')],
  stay: [blend('st', 'st'), vowelTeam('ay', 'ay')],
  sun: [p('s'), p('u'), p('n')],
  take: [p('t'), p('a', 'ay'), p('k'), silent('e')],
  that: [digraph('th', 'th'), p('a'), p('t')],
  the: [digraph('th', 'th'), p('e', 'uh')],
  // TODO(phonics): "eir" saying /air/ is irregular; usually taught as a sight word.
  their: [digraph('th', 'th'), rControlled('eir', 'air')],
  them: [digraph('th', 'th'), p('e'), p('m')],
  then: [digraph('th', 'th'), p('e'), p('n')],
  they: [digraph('th', 'th'), vowelTeam('ey', 'ay')],
  this: [digraph('th', 'th'), p('i'), p('s')],
  three: [digraph('th', 'th'), p('r'), vowelTeam('ee', 'ee')],
  to: [p('t'), p('o', 'oo')],
  // TODO(phonics): three syllables with an unstressed opening.
  together: [p('t'), p('o', 'uh'), p('g'), p('e', 'eh'), digraph('th', 'th'), rControlled('er', 'er')],
  too: [p('t'), vowelTeam('oo', 'oo')],
  tricked: [blend('tr', 'tr'), p('i'), digraph('ck', 'k'), p('ed', 't')],
  // TODO(phonics): silent w — irregular, and "two" is usually taught as a sight word.
  two: [p('t'), silent('w'), p('o', 'oo')],
  uh: [p('u', 'uh'), silent('h')],
  very: [p('v'), p('e'), p('r'), p('y', 'ee')],
  // TODO(phonics): "was" is irregular — the a says /uh/ and the s says /z/. Confirm
  // whether it should be taught as a sight word instead of sounded out.
  was: [p('w'), p('a', 'uh'), p('s', 'z')],
  we: [p('w'), p('e', 'ee')],
  // TODO(phonics): "ere" says /er/ here but /air/ in "where" — same letters, two sounds.
  were: [p('w'), rControlled('ere', 'er')],
  what: [digraph('wh', 'w'), p('a', 'uh'), p('t')],
  // TODO(phonics): see "were" — the "ere" split is a curriculum call.
  where: [digraph('wh', 'w'), rControlled('ere', 'air')],
  will: [p('w'), p('i'), digraph('ll', 'l')],
  world: [p('w'), rControlled('or', 'er'), p('l'), p('d')],
  // TODO(phonics): "or" says /er/ after w, as in "world".
  worry: [p('w'), rControlled('or', 'er'), digraph('rr', 'r'), p('y', 'ee')],
  // TODO(phonics): silent w, as in "knew"'s silent k.
  wrong: [silent('w'), p('r'), p('o', 'aw'), digraph('ng', 'ng')],
  you: [p('y'), vowelTeam('ou', 'oo')],
  youll: [p('y'), vowelTeam('ou', 'oo'), digraph('ll', 'l')],
  yummy: [p('y'), p('u'), digraph('mm', 'm'), p('y', 'ee')],
};

/**
 * Build a `Sentence` from a line of the script, exactly as written.
 *
 * Tokens keep their original capitalization and punctuation — that is what the child
 * reads, what the speech engine says, and (via the normalized lookup) still what resolves
 * to the right phonemes.
 */
export function s(text: string): Sentence {
  return {
    words: text
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => {
        const phonemes = LEX[key(token)];
        if (__DEV__ && !phonemes) {
          console.warn(`[creation] no phonemes authored for "${token}" — add it to LEX.`);
        }
        return { text: token, phonemes: phonemes ?? [] };
      }),
  };
}
