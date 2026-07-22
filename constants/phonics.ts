/**
 * Word → phoneme lookup for the Phonics Breakdown screen (§6.3, Job A).
 *
 * When a child taps a word during a story, that word is split into its sounds. The sounds
 * themselves are authored on each `Word` in the content library, so this file no longer
 * holds any word data — it just indexes the library by word text and provides the
 * letter-by-letter fallback for anything unmapped.
 *
 * The screen only receives the tapped word as a route param (no story id), so the index is
 * global across all content. That is deliberate: a word breaks down the same way wherever
 * a child meets it.
 */
import { p, type Phoneme } from '@/constants/content';
import { CONTENT } from '@/constants/content-library';

export type { Phoneme };

/** Strip anything that isn't a letter so "sky!" / "God," look up cleanly. */
function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

/**
 * Built on first use rather than at module load: the library imports content modules,
 * and a top-level walk here would run before they finish initializing.
 */
let index: Map<string, Phoneme[]> | null = null;

function getIndex(): Map<string, Phoneme[]> {
  if (index) {
    return index;
  }
  const built = new Map<string, Phoneme[]>();

  const add = (word: { text: string; phonemes: Phoneme[] }) => {
    const key = normalize(word.text);
    // First definition wins, so an authored story word is never shadowed by a stub.
    if (key && word.phonemes.length > 0 && !built.has(key)) {
      built.set(key, word.phonemes);
    }
  };

  for (const item of CONTENT) {
    // Stubs carry an unsplit placeholder target word; indexing it would show one fat
    // tile instead of the letter-by-letter fallback, which is worse.
    if (item.status !== 'ready') {
      continue;
    }
    if (item.type === 'story') {
      item.pages.forEach((page) => page.sentences.forEach((sentence) => sentence.words.forEach(add)));
    } else {
      add(item.targetWord);
    }
  }

  index = built;
  return built;
}

/**
 * Return the phoneme breakdown for a word: the authored split when the library has one,
 * otherwise a simple letter-by-letter split so every tapped word shows *something*.
 */
export function breakDownWord(word: string): Phoneme[] {
  const key = normalize(word);
  const authored = getIndex().get(key);
  if (authored) {
    return authored;
  }
  return key.split('').map((char) => p(char));
}
