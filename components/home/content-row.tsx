import { ScrollView, StyleSheet } from 'react-native';

import { LessonCard } from '@/components/home/lesson-card';
import { ThemedText } from '@/components/themed-text';
import type { HomeRow } from '@/constants/home-content';

/**
 * One Netflix-style content row (§6.1): a bold title above a horizontally
 * scrollable strip of lesson cards.
 */
export function ContentRow({ row }: { row: HomeRow }) {
  return (
    <>
      <ThemedText type="subtitle" style={styles.title}>
        {row.title}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {row.cards.map((card) => (
          <LessonCard key={card.id} card={card} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  strip: {
    paddingHorizontal: 16,
    gap: 12,
  },
});
