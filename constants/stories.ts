/**
 * Story content model + placeholder scripts for the Lesson/Story screen (§6.2, §4.1).
 *
 * These are short, Tier-1 placeholder sentences (§5.1) so the reading loop — autoplay
 * narration, per-word highlighting, progress, and tap-to-break-down — can be built and
 * tested now. Real abridged scripts (§8.2) drop straight into `sentences` later without
 * restructuring: a sentence is just an id + its ordered word tokens.
 */

export type StorySentence = {
  id: string;
  /** Ordered word tokens. Spoken text is `words.join(' ')`; each word is tappable. */
  words: string[];
};

export type Story = {
  id: string;
  title: string;
  /** Placeholder two-band scene tint until real illustrations exist (§7). */
  background: { sky: string; ground: string };
  sentences: StorySentence[];
};

/**
 * The Creation (Genesis 1) — Tier 1, "In progress" in the §5.2 scope table.
 * Placeholder wording kept simple and CVC-friendly; not a final script.
 */
export const CREATION: Story = {
  id: 'creation',
  title: 'The Creation',
  background: { sky: '#8ECAE6', ground: '#B5E48C' },
  sentences: [
    { id: 'c-1', words: ['In', 'the', 'start', 'God', 'made', 'the', 'sky'] },
    { id: 'c-2', words: ['God', 'said', 'let', 'there', 'be', 'light'] },
    { id: 'c-3', words: ['He', 'made', 'the', 'sun', 'and', 'the', 'moon'] },
    { id: 'c-4', words: ['God', 'made', 'the', 'fish', 'and', 'the', 'birds'] },
    { id: 'c-5', words: ['He', 'made', 'a', 'snake', 'in', 'the', 'grass'] },
    { id: 'c-6', words: ['And', 'God', 'saw', 'that', 'it', 'was', 'good'] },
  ],
};

/** Keyed by story id so the lesson screen can look one up from a route param. */
export const STORIES: Record<string, Story> = {
  [CREATION.id]: CREATION,
};

/** The story shown when no `storyId` is provided (§ Home wiring: default to Creation). */
export const DEFAULT_STORY = CREATION;

export function getStory(id?: string | null): Story {
  if (id && STORIES[id]) {
    return STORIES[id];
  }
  return DEFAULT_STORY;
}
