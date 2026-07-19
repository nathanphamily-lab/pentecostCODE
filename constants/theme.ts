/**
 * Compatibility layer over the design tokens in `./tokens.ts`.
 *
 * The app is light-only — the new design is a warm, illustrated light theme and
 * there is no dark counterpart. Rather than tear `useColorScheme` out of every
 * call site, both entries below point at the same warm palette, so dark mode is
 * a no-op instead of a broken half-state.
 *
 * New code should import from `@/constants/tokens` (via `useTokens()`) instead.
 */

import { Platform } from 'react-native';

import { fontFamily, palette } from './tokens';

const warm = {
  text: palette.textPrimary,
  background: palette.bgFallback,
  tint: palette.accent,
  icon: palette.textMuted,
  tabIconDefault: palette.navInactive,
  tabIconSelected: palette.accentBright,
};

export const Colors = {
  light: warm,
  dark: warm,
};

export const Fonts = Platform.select({
  default: {
    sans: fontFamily.regular,
    serif: 'serif',
    rounded: fontFamily.regular,
    mono: 'monospace',
  },
  web: {
    sans: `${fontFamily.regular}, system-ui, -apple-system, sans-serif`,
    serif: "Georgia, 'Times New Roman', serif",
    rounded: `${fontFamily.regular}, system-ui, sans-serif`,
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
