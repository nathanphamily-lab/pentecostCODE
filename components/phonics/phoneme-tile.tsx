/**
 * A single phoneme tile for the Phonics Breakdown screen (§6.3).
 *
 * Shows one grapheme ("s", "sh", "igh", …). While its sound is playing the tile
 * lights up (§6.3 Animation). Silent letters (e.g. the "e" in snake) render grayed
 * with a small "silent" label. Digraphs come through as a single wider tile.
 */
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { isGroupedPhoneme, type Phoneme } from '@/constants/content';
import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

type PhonemeTileProps = {
  phoneme: Phoneme;
  /** True while this phoneme's sound is playing. */
  lit: boolean;
};

export function PhonemeTile({ phoneme, lit }: PhonemeTileProps) {
  const { grapheme } = phoneme;
  const silent = phoneme.type === 'silent';
  // Digraphs, blends, vowel teams and r-controlled vowels are all multi-letter graphemes
  // that read as one sound, so they share the single wider tile (§6.3).
  const grouped = isGroupedPhoneme(phoneme);
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  return (
    <View
      style={[
        styles.tile,
        grouped && styles.grouped,
        silent && styles.silent,
        lit && !silent && styles.lit,
      ]}>
      <Text style={[styles.grapheme, silent && styles.silentText]}>{grapheme}</Text>
      {silent ? <Text style={styles.silentLabel}>silent</Text> : null}
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    tile: {
      minWidth: 56,
      paddingVertical: 14,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: t.semantic.tileBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    grouped: {
      paddingHorizontal: t.spacing.lg,
    },
    lit: {
      backgroundColor: t.semantic.highlight,
    },
    silent: {
      backgroundColor: t.semantic.tileBorder,
    },
    grapheme: {
      ...t.type.celebration,
      color: t.colors.textPrimary,
    },
    silentText: {
      color: t.semantic.tileMuted,
    },
    silentLabel: {
      ...t.type.navLabel,
      fontSize: Math.round(12 * t.scale),
      color: t.semantic.tileMuted,
      marginTop: 2,
    },
  });
}
