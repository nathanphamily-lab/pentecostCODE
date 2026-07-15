/**
 * Phoneme model + word breakdowns for the Phonics Breakdown screen (§6.3, Job A).
 *
 * When a child taps a word during a story, that word is split into its sounds, each
 * lighting up as it plays, with silent letters grayed and digraphs grouped. This file
 * holds the breakdown data for the words in the current placeholder stories, plus a
 * letter-by-letter fallback for anything not yet mapped.
 *
 * The `sound` token is what the speech engine speaks for that phoneme. With a generic
 * TTS placeholder this is only approximate (it tends to say letter *names*); a real
 * vendor supplies proper phoneme audio behind `lib/speech.ts` without changing this
 * shape.
 */

export type Phoneme = {
  /** Letters shown on the tile, e.g. "s", "sh", "igh". */
  grapheme: string;
  /** Token spoken by the speech engine for this phoneme. */
  sound: string;
  /** Silent letters (e.g. the "e" in snake) render grayed with a "silent" label. */
  silent?: boolean;
  /** Digraphs/trigraphs (sh, oo, igh…) render as a single grouped tile. */
  digraph?: boolean;
};

/** A silent letter tile has no spoken sound. */
const silent = (grapheme: string): Phoneme => ({ grapheme, sound: '', silent: true });
const digraph = (grapheme: string, sound: string): Phoneme => ({ grapheme, sound, digraph: true });
const letter = (grapheme: string, sound = grapheme): Phoneme => ({ grapheme, sound });

/**
 * Breakdowns for the Creation story's notable words (silent-E and digraph examples).
 * Words not listed here fall back to per-letter graphemes via `breakDownWord`.
 */
export const WORD_BREAKDOWNS: Record<string, Phoneme[]> = {
  snake: [letter('s'), letter('n'), letter('a'), letter('k'), silent('e')],
  made: [letter('m'), letter('a'), letter('d'), silent('e')],
  light: [letter('l'), digraph('igh', 'eye'), letter('t')],
  sky: [letter('s'), letter('k'), letter('y', 'eye')],
  fish: [letter('f'), letter('i'), digraph('sh', 'sh')],
  good: [letter('g'), digraph('oo', 'oo'), letter('d')],
  moon: [letter('m'), digraph('oo', 'oo'), letter('n')],
  saw: [letter('s'), digraph('aw', 'aw')],
  sun: [letter('s'), letter('u'), letter('n')],
  birds: [letter('b'), digraph('ir', 'er'), letter('d'), letter('s')],
};

/** Strip anything that isn't a letter so "sky!" / "God," look up cleanly. */
function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Return the phoneme breakdown for a word: a curated entry when we have one,
 * otherwise a simple letter-by-letter split so every tapped word shows *something*.
 */
export function breakDownWord(word: string): Phoneme[] {
  const key = normalize(word);
  if (WORD_BREAKDOWNS[key]) {
    return WORD_BREAKDOWNS[key];
  }
  return key.split('').map((char) => letter(char));
}
