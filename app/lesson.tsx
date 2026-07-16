/**
 * Lesson / Story screen (AppSpec §6.2, §4.1 Steps 1–5).
 *
 * Illustrated background + a rounded center card that reads the story aloud, one
 * sentence at a time, highlighting each word in yellow as it is spoken. Tapping a word
 * pauses and opens the Phonics Breakdown; a progress bar tracks sentences; Johnny sits
 * bottom-left; pause/play and a back arrow are the controls.
 *
 * All playback behavior lives in `useStoryPlayback`; this file is just the layout.
 * The story is chosen from an optional `storyId` route param and defaults to Creation.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Johnny } from '@/components/lesson/johnny';
import { ProgressBar } from '@/components/lesson/progress-bar';
import { StoryTextCard } from '@/components/lesson/story-text-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getStory } from '@/constants/stories';
import { useStoryPlayback } from '@/hooks/use-story-playback';

export default function LessonScreen() {
  const router = useRouter();
  const { storyId } = useLocalSearchParams<{ storyId?: string }>();
  const story = useMemo(() => getStory(storyId), [storyId]);

  const { sentenceIndex, wordIndex, isPlaying, isDone, total, currentSentence, togglePlay, onWordTap } =
    useStoryPlayback(story);

  // Sentences completed = current index, plus the last one once the story ends.
  const completed = isDone ? total : sentenceIndex;

  // §6.4 / §4.1 Step 6: the quiz appears on its own once the last sentence finishes.
  // `replace`, not `push`, so the spent lesson leaves the stack — otherwise Back from the
  // quiz would land on a finished story that immediately restarts narrating.
  useEffect(() => {
    if (isDone) {
      router.replace({ pathname: '/quiz', params: { storyId: story.id } });
    }
  }, [isDone, router, story.id]);

  return (
    <View style={styles.root}>
      {/* Placeholder illustrated scene: two-band sky/ground (§7, real art later). */}
      <View style={[styles.band, { backgroundColor: story.background.sky }]} />
      <View style={[styles.band, styles.ground, { backgroundColor: story.background.ground }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top row: back arrow + progress bar. */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back to home"
            hitSlop={12}
            style={styles.iconButton}>
            <IconSymbol name="chevron.left" size={28} color="#1B2430" />
          </Pressable>
          <View style={styles.progressWrap}>
            <ProgressBar current={completed} total={total} />
          </View>
        </View>

        {/* Center: the story text card. */}
        <View style={styles.center}>
          {currentSentence ? (
            <StoryTextCard
              sentence={currentSentence}
              activeWordIndex={isPlaying ? wordIndex : -1}
              onWordTap={onWordTap}
            />
          ) : null}
        </View>

        {/* Bottom row: Johnny (left) + pause/play (right). */}
        <View style={styles.bottomRow}>
          <Johnny />
          <Pressable
            onPress={togglePlay}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            hitSlop={12}
            disabled={isDone}
            style={[styles.playButton, isDone && styles.playButtonDisabled]}>
            <IconSymbol name={isPlaying ? 'pause.fill' : 'play.fill'} size={36} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  band: {
    ...StyleSheet.absoluteFillObject,
    bottom: '35%',
  },
  ground: {
    top: '65%',
    bottom: 0,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrap: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A9D8F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  playButtonDisabled: {
    opacity: 0.4,
  },
});
