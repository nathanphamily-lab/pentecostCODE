import { View, type ViewProps } from 'react-native';

import { useTokens } from '@/hooks/use-tokens';

export type ThemedViewProps = ViewProps & {
  /**
   * Paints nothing, letting the illustrated `ScreenBackground` show through.
   * Use for screen-level containers that sit on the backdrop.
   */
  transparent?: boolean;
  /** Paints the card/nav surface color instead of the screen background. */
  surface?: boolean;
};

export function ThemedView({
  style,
  transparent = false,
  surface = false,
  ...otherProps
}: ThemedViewProps) {
  const { colors } = useTokens();

  const backgroundColor = transparent
    ? 'transparent'
    : surface
      ? colors.surface
      : colors.bgFallback;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
