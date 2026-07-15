/**
 * Text-to-speech seam for the app.
 *
 * The TTS vendor is still open (AppSpec §2, §8.1, §8.3 — ElevenLabs / AWS Polly /
 * Expo Speech). Every screen and hook imports ONLY from this module, never
 * `expo-speech` directly, so swapping in a real vendor later is a matter of
 * writing one more adapter and reassigning `speechEngine` below.
 *
 * ## Why a timer drives the token callbacks
 * Two Expo Speech limitations (SDK 54) shape this design:
 *   - `Speech.pause()`/`resume()` are iOS/Web only (not Android).
 *   - `Speech.speak`'s `onBoundary` word event is not reliable cross-platform.
 * So we do NOT lean on native word-boundary events for highlighting. Instead the
 * adapter kicks off audio with `Speech.speak(...)` and separately runs a timer
 * chain that fires `onToken(i)` per token using an *estimated* duration. A real
 * vendor that exposes genuine per-token timings implements the same interface and
 * feeds `onToken` from real data — the UI never changes.
 */
import * as Speech from 'expo-speech';

export type SpeakHandle = {
  /** Stop audio and cancel any pending token callbacks for this utterance. */
  cancel: () => void;
};

export type SpeakOptions = {
  /** Ordered tokens: words for a story sentence, phoneme sounds for a breakdown. */
  tokens: string[];
  /** Fires as each token *begins*, in order. */
  onToken?: (index: number) => void;
  /** Fires once the whole utterance finishes naturally (not on cancel/stop). */
  onDone?: () => void;
  onError?: (error: unknown) => void;
  /** Speech rate; defaults to a slow, child-friendly pace. */
  rate?: number;
};

export type SpeechEngine = {
  speak(options: SpeakOptions): SpeakHandle;
  /** Stop whatever is currently speaking immediately. */
  stop(): void;
};

/** Slow and calm for early readers (§7 "calming pace"). */
const DEFAULT_RATE = 0.75;

/**
 * Estimated speaking time for a single token, used to pace the highlight timer.
 * Roughly proportional to length with a floor so short words/phonemes still get a
 * visible beat. Tuned against DEFAULT_RATE; a real vendor replaces this with truth.
 */
function estimateTokenDurationMs(token: string, rate: number): number {
  const base = 260 + token.length * 90; // ms at rate 1.0
  return base / Math.max(rate, 0.1);
}

function createExpoSpeechEngine(): SpeechEngine {
  // Timers for the in-flight utterance so `stop()`/`cancel()` can clear them.
  let timers: ReturnType<typeof setTimeout>[] = [];

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function stop() {
    clearTimers();
    Speech.stop();
  }

  function speak({ tokens, onToken, onDone, onError, rate = DEFAULT_RATE }: SpeakOptions): SpeakHandle {
    // A fresh utterance supersedes any previous one.
    stop();

    if (tokens.length === 0) {
      onDone?.();
      return { cancel: () => {} };
    }

    // Audio: one call for the whole phrase so it sounds natural.
    Speech.speak(tokens.join(' '), {
      rate,
      onError: (error) => onError?.(error),
    });

    // Highlight pacing: schedule onToken(i) at cumulative estimated offsets.
    let elapsed = 0;
    tokens.forEach((token, index) => {
      timers.push(setTimeout(() => onToken?.(index), elapsed));
      elapsed += estimateTokenDurationMs(token, rate);
    });
    // onDone fires after the last token's estimated duration elapses.
    timers.push(setTimeout(() => onDone?.(), elapsed));

    return { cancel: stop };
  }

  return { speak, stop };
}

/**
 * The active engine. Swap this assignment for a real-vendor adapter later without
 * touching any screen or hook.
 */
export const speechEngine: SpeechEngine = createExpoSpeechEngine();
