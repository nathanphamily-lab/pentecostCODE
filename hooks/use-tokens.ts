import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { makeTokens, scaleFor, type Tokens } from '@/constants/tokens';

/**
 * Design tokens scaled to the current viewport.
 *
 * Memoized on the *scale factor* rather than the raw width, so dragging a
 * desktop window only rebuilds styles when the factor actually moves (and not
 * on every pixel of a resize).
 *
 * Components that need a StyleSheet derived from these should do:
 *
 *   const t = useTokens();
 *   const styles = useMemo(() => makeStyles(t), [t]);
 */
export function useTokens(): Tokens {
  const { width } = useWindowDimensions();
  const scale = scaleFor(width);

  return useMemo(() => makeTokens(scale), [scale]);
}
