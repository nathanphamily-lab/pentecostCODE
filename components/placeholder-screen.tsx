import { Href, Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type PlaceholderAction = {
  label: string;
  href: Href;
  /** When true, dismisses back to the previous screen instead of pushing. */
  dismissTo?: boolean;
};

export type PlaceholderScreenProps = {
  title: string;
  subtitle?: string;
  actions?: PlaceholderAction[];
};

/**
 * Phase 3.1 placeholder. Renders a centered title + "Coming soon" line and,
 * optionally, a set of navigation buttons so the §3.2 flow is tappable while
 * every screen is still content-free.
 */
export function PlaceholderScreen({
  title,
  subtitle = 'Coming soon',
  actions,
}: PlaceholderScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{title}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      {actions?.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          dismissTo={action.dismissTo}
          style={styles.action}>
          <ThemedText type="link">{action.label}</ThemedText>
        </Link>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  subtitle: {
    opacity: 0.6,
  },
  action: {
    marginTop: 12,
    paddingVertical: 8,
  },
});
