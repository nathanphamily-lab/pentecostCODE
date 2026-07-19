import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

export type TabBarItemProps = {
  icon: IconSymbolName;
  label: string;
  focused: boolean;
};

/**
 * One bottom-nav tab. The active tab gets a rounded pill, the bright accent
 * label and a small dot beneath it; inactive tabs are plain and gray.
 *
 * This renders through the `tabBarIcon` slot (which already receives `focused`)
 * with the navigator's own label switched off, so the pill can wrap the icon
 * and label together without replacing the tab bar or touching any navigation
 * behavior.
 */
export function TabBarItem({ icon, label, focused }: TabBarItemProps) {
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const color = focused ? tokens.nav.activeLabelColor : tokens.nav.inactiveLabelColor;

  return (
    <View style={styles.container}>
      <View style={[styles.pill, focused && styles.pillActive]}>
        <IconSymbol name={icon} size={tokens.type.navLabel.fontSize + 8} color={color} />
        <ThemedText type="navLabel" color={color} numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
      <View style={[styles.dot, !focused && styles.dotHidden]} />
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: t.spacing.xs,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: t.spacing.sm,
      paddingHorizontal: t.nav.pill.paddingHorizontal,
      paddingVertical: t.nav.pill.paddingVertical,
      borderRadius: t.nav.pill.borderRadius,
    },
    pillActive: {
      backgroundColor: t.nav.pill.backgroundColor,
    },
    dot: {
      width: t.nav.dotSize,
      height: t.nav.dotSize,
      borderRadius: t.nav.dotSize / 2,
      backgroundColor: t.nav.activeLabelColor,
    },
    // Kept in the layout so the pill doesn't shift when focus changes.
    dotHidden: {
      opacity: 0,
    },
  });
}
