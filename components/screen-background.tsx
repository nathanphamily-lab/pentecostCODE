import { Image } from 'expo-image';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTokens } from '@/hooks/use-tokens';

export type ScreenBackgroundProps = ViewProps & {
  children?: React.ReactNode;
};

/**
 * The illustrated sky/rainbow/hills backdrop that sits behind every screen.
 *
 * The artwork isn't exported yet, so this renders a flat warm color for now.
 * Point `backgroundImage` in `constants/tokens.ts` at the asset and it swaps in
 * everywhere — no screen needs to change. The fallback color also fills any
 * letterboxing around the image on aspect ratios it doesn't cover.
 */
export function ScreenBackground({ children, style, ...rest }: ScreenBackgroundProps) {
  const { colors, backgroundImage } = useTokens();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bgFallback }, style]}
      {...rest}>
      {backgroundImage != null && (
        <Image
          source={backgroundImage}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          pointerEvents="none"
          accessible={false}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
