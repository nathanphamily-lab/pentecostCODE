import { ScrollView, StyleSheet } from 'react-native';

import { LessonCard } from '@/components/home/lesson-card';
import { ThemedText } from '@/components/themed-text';
import type { Content } from '@/constants/content';

/**
 * One Netflix-style content row (§6.1): a bold title above a horizontally
 * scrollable strip of lesson cards, backed by one category of the content library.
 */
export function ContentRow({ title, items }: { title: string; items: Content[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ThemedText type="sectionHeader" style={styles.title}>
        {title}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.strip}>
        {items.map((item) => (
          <LessonCard key={item.id} item={item} />
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
