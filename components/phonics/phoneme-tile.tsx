/**
 * A single phoneme tile for the Phonics Breakdown screen (§6.3).
 *
 * Shows one grapheme ("s", "sh", "igh", …). While its sound is playing the tile
 * lights up (§6.3 Animation). Silent letters (e.g. the "e" in snake) render grayed
 * with a small "silent" label. Digraphs come through as a single wider tile.
 */
import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import type { Phoneme } from '@/constants/phonics';

const LIT = '#FFE066'; // matches the story word-highlight yellow (§7)

type PhonemeTileProps = {
  phoneme: Phoneme;
  /** True while this phoneme's sound is playing. */
  lit: boolean;
};

export function PhonemeTile({ phoneme, lit }: PhonemeTileProps) {
  const { grapheme, silent, digraph } = phoneme;
  return (
    <View
      style={[
        styles.tile,
        digraph && styles.digraph,
        silent && styles.silent,
        lit && !silent && styles.lit,
      ]}>
      <Text style={[styles.grapheme, silent && styles.silentText]}>{grapheme}</Text>
      {silent ? <Text style={styles.silentLabel}>silent</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 56,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#EAF4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  digraph: {
    paddingHorizontal: 20,
  },
  lit: {
    backgroundColor: LIT,
  },
  silent: {
    backgroundColor: '#E6E6E6',
  },
  grapheme: {
    fontFamily: Fonts.rounded,
    fontSize: 40,
    fontWeight: '700',
    color: '#1B2430',
  },
  silentText: {
    color: '#9AA0A6',
  },
  silentLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    fontWeight: '700',
    color: '#9AA0A6',
    marginTop: 2,
  },
});
