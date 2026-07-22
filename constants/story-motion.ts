/**
 * Timings for the picture-book page turn (§6.2).
 *
 * Shared by `useStoryPlayback` (which delays narration until a turn lands) and the
 * Story screen's animated layers, so the audio and the artwork stay in step. Keep the
 * feel calm: slow enough to read as a page turning, never bouncy or flickery.
 */

/** Background slide + cross-fade on a page turn. */
export const PAGE_TURN_MS = 400;

/** Each half of the text card's fade-out / fade-in during a page turn. */
export const PAGE_CARD_FADE_MS = 180;

/**
 * Each half of the quick text cross-fade between sentences *within* a page.
 * The background does not move for these.
 */
export const SENTENCE_FADE_MS = 80;

/** How far the background slides during a turn, as a fraction of screen width. */
export const PAGE_SLIDE_RATIO = 0.25;

/**
 * How long narration waits after a page turn starts, so the first sentence of the new
 * page is spoken over settled artwork rather than under the animation.
 */
export const PAGE_TURN_SETTLE_MS = PAGE_TURN_MS;
