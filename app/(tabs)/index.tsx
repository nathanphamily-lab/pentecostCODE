import { ScrollView, StyleSheet } from 'react-native';

import { ContentRow } from '@/components/home/content-row';
import { HomeHeader } from '@/components/home/home-header';
import { ThemedView } from '@/components/themed-view';
import { CATEGORY_ROWS, getCategoryItems } from '@/constants/content-library';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <ScrollView contentContainerStyle={styles.rows} showsVerticalScrollIndicator={false}>
        {CATEGORY_ROWS.map((row) => (
          <ContentRow key={row.category} title={row.title} items={getCategoryItems(row.category)} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rows: {
    paddingBottom: 24,
    gap: 24,
  },
});
