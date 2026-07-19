import { useMemo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

/**
 * Variants map onto the design type scale in `constants/tokens.ts`.
 * `default`, `title` and `defaultSemiBold` are retained as aliases so existing
 * call sites keep working; prefer the token names for new code.
 */
export type ThemedTextType =
  | 'h1'
  | 'subtitle'
  | 'sectionHeader'
  | 'link'
  | 'cardLabel'
  | 'navLabel'
  | 'body'
  // Aliases.
  | 'default'
  | 'title'
  | 'defaultSemiBold';

export type ThemedTextProps = TextProps & {
  /** Overrides the variant's color. */
  color?: string;
  /** Renders in the muted secondary tone. */
  muted?: boolean;
  type?: ThemedTextType;
};

export function ThemedText({
  style,
  color,
  muted = false,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  const override = muted ? tokens.colors.textMuted : color;

  return (
    <Text style={[styles[type], override != null && { color: override }, style]} {...rest} />
  );
}

function makeStyles(t: Tokens) {
  const { type, colors } = t;

  const h1 = { ...type.h1, color: colors.textPrimary };
  const sectionHeader = { ...type.sectionHeader, color: colors.textPrimary };
  const cardLabel = { ...type.cardLabel, color: colors.textCardLabel };
  const body = { ...type.body, color: colors.textPrimary };

  return StyleSheet.create({
    h1,
    sectionHeader,
    cardLabel,
    body,
    subtitle: { ...type.subtitle, color: colors.textMuted },
    link: { ...type.link, color: colors.accent },
    navLabel: { ...type.navLabel, color: colors.navInactive },

    // Aliases.
    default: body,
    title: h1,
    defaultSemiBold: cardLabel,
  });
}
