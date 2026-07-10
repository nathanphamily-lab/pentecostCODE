import { ScrollView, StyleSheet } from 'react-native';

import { ContentRow } from '@/components/home/content-row';
import { HomeHeader } from '@/components/home/home-header';
import { ThemedView } from '@/components/themed-view';
import { HOME_ROWS } from '@/constants/home-content';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <ScrollView contentContainerStyle={styles.rows} showsVerticalScrollIndicator={false}>
        {HOME_ROWS.map((row) => (
          <ContentRow key={row.id} row={row} />
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
