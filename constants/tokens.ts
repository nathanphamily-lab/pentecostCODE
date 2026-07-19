/**
 * Design tokens — the single source of truth for colors, type, and surface
 * styling. Every screen and component reads from here; no raw hex belongs in
 * `app/` or `components/`.
 *
 * Numeric values are authored against a 1366pt-wide iPad landscape frame (the
 * Figma design width) and multiplied by a scale factor at runtime — see
 * `hooks/use-tokens.ts`. Colors, radii, border widths and shadow geometry are
 * deliberately NOT scaled: a 4px border or a 20px radius that grows with the
 * viewport reads as a bug rather than as responsive design.
 */

import { Platform } from 'react-native';

/** The design frame these numbers were authored against. */
export const DESIGN_WIDTH = 1366;

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.3;

/**
 * Viewport width -> type/spacing scale factor, clamped so text stays legible on
 * a phone and doesn't balloon on a wide desktop window.
 */
export function scaleFor(width: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, width / DESIGN_WIDTH));
}

export const palette = {
  /** Headings and body copy. */
  textPrimary: '#2E2A22',
  /** Secondary copy — subtitles, captions. */
  textMuted: '#7A6E56',
  /** Labels sitting on a content card. */
  textCardLabel: '#4A4234',
  /** Links, e.g. "See all". */
  accent: '#C77A2E',
  /** Active nav label and highlights. */
  accentBright: '#F5A623',
  /** Active bottom-nav tab background. */
  navPill: '#FDECCB',
  /** Hairline rules and the nav's top border. */
  divider: '#ECE6D8',
  /** Cards, sheets, the nav bar. */
  surface: '#FFFFFF',
  /** Inactive bottom-nav label. */
  navInactive: '#9AA0A8',
  /**
   * Stand-in for the illustrated sky/rainbow/hills backdrop. The real screen
   * background is an image (see `backgroundImage` below and
   * `components/screen-background.tsx`); this is what shows until that asset
   * lands, and what fills any letterboxing around it.
   */
  bgFallback: '#FDF6E7',
} as const;

/**
 * Colors carried over from the pre-restyle screens that the new design system
 * doesn't specify yet. Centralized here at their existing values so nothing is
 * left inline — they get retinted when those screens are designed.
 */
export const semantic = {
  correct: '#2A9D8F',
  /** Gentle "not quite" tint for a wrong quiz pick — never alarming (§4.3). */
  incorrect: '#E29578',
  /** Genuine failure, e.g. a rejected sign-in. Grown-up UI only. */
  error: '#E71D36',
  highlight: '#FFE066',
  highlightStrong: '#FFB703',
  tileBackground: '#EAF4F4',
  tileBorder: '#E6E6E6',
  tileMuted: '#9AA0A6',
  onAccent: '#FFFFFF',
  scrim: '#000000',
} as const;

/** Translucent washes used for floating controls and modal scrims. */
export const overlays = {
  /** Frosted circle behind icon buttons sitting on artwork. */
  control: 'rgba(255, 255, 255, 0.7)',
  /** Softer variant, e.g. the progress-bar track. */
  controlSoft: 'rgba(255, 255, 255, 0.55)',
  /** Dim behind a modal sheet. */
  scrim: 'rgba(20, 30, 40, 0.35)',
} as const;

/** Avatar background choices for child profiles. */
export const avatarColors: readonly string[] = [
  '#FF9F1C',
  '#E71D36',
  '#9B5DE5',
  '#2EC4B6',
  '#06D6A0',
  '#00BBF9',
] as const;

export const fontFamily = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

/**
 * The illustrated screen backdrop. Set this to
 * `require('@/assets/images/<file>')` once the artwork is exported and every
 * screen picks it up — `ScreenBackground` falls back to a flat warm color
 * while it's null.
 */
export const backgroundImage: number | null = null;

/**
 * Drop shadows. On web `boxShadow` reproduces the Figma blur faithfully; native
 * needs the iOS shadow* quartet and Android's `elevation`, neither of which
 * maps exactly, so both are emitted and the platform picks.
 */
function shadow(options: {
  offsetY: number;
  radius: number;
  color: string;
  opacity: number;
  elevation: number;
  css: string;
}) {
  if (Platform.OS === 'web') {
    return { boxShadow: options.css };
  }
  return {
    shadowColor: options.color,
    shadowOffset: { width: 0, height: options.offsetY },
    shadowOpacity: options.opacity,
    shadowRadius: options.radius,
    elevation: options.elevation,
  };
}

export function makeTokens(scale: number) {
  const type = (
    family: string,
    size: number,
    lineHeightRatio = 1.3
  ) => ({
    fontFamily: family,
    fontSize: Math.round(size * scale),
    lineHeight: Math.round(size * scale * lineHeightRatio),
  });

  return {
    scale,
    colors: palette,
    semantic,
    overlays,
    avatarColors,
    fontFamily,
    backgroundImage,

    /**
     * Widest a centered reading column grows to. Caps line length on iPad
     * landscape and desktop, where full-bleed text would be unreadable.
     */
    contentMaxWidth: Math.round(560 * scale),

    /** Lift for round floating controls (play button, icon buttons). */
    controlShadow: shadow({
      offsetY: 3,
      radius: 8,
      color: '#000000',
      opacity: 0.2,
      elevation: 4,
      css: '0px 3px 8px rgba(0, 0, 0, 0.2)',
    }),

    /** Type scale — sizes are for the 1366 frame, scaled at runtime. */
    type: {
      /** Greeting / h1. */
      h1: type(fontFamily.bold, 38, 1.15),
      subtitle: type(fontFamily.regular, 20, 1.4),
      sectionHeader: type(fontFamily.bold, 24, 1.25),
      link: type(fontFamily.semiBold, 16, 1.4),
      cardLabel: type(fontFamily.semiBold, 17, 1.35),
      navLabel: type(fontFamily.semiBold, 14, 1.3),
      body: type(fontFamily.regular, 16, 1.5),
      /** Large reading type for the story card — sized for shared-screen reading. */
      storyWord: type(fontFamily.semiBold, 30, 1.33),
      /** Quiz question prompt. */
      prompt: type(fontFamily.bold, 28, 1.25),
      /** The single focus word in the phonics breakdown. */
      display: type(fontFamily.bold, 52, 1.15),
      /** Celebration headline, e.g. the quiz summary title. */
      celebration: type(fontFamily.bold, 34, 1.2),
    },

    /** Content card: rounded, white-bordered, softly shadowed. */
    card: {
      borderRadius: 20,
      borderWidth: 4,
      borderColor: palette.surface,
      backgroundColor: palette.surface,
      ...shadow({
        offsetY: 5,
        radius: 12,
        color: '#000000',
        opacity: 0.18,
        elevation: 6,
        css: '0px 5px 12px rgba(0, 0, 0, 0.18)',
      }),
    },

    /** Bottom nav bar chrome. */
    nav: {
      height: Math.round(84 * scale),
      /** Spreadable style for the bar itself. */
      bar: {
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderTopColor: palette.divider,
        ...shadow({
          offsetY: -3,
          radius: 6,
          color: '#1A1A1F',
          opacity: 0.12,
          elevation: 12,
          css: '0px -3px 6px rgba(26, 26, 31, 0.12)',
        }),
      },
      pill: {
        backgroundColor: palette.navPill,
        borderRadius: 999,
        paddingHorizontal: Math.round(16 * scale),
        paddingVertical: Math.round(6 * scale),
      },
      activeLabelColor: palette.accentBright,
      inactiveLabelColor: palette.navInactive,
      dotSize: Math.round(5 * scale),
    },

    /** 4pt spacing ramp, scaled. */
    spacing: {
      xs: Math.round(4 * scale),
      sm: Math.round(8 * scale),
      md: Math.round(16 * scale),
      lg: Math.round(24 * scale),
      xl: Math.round(32 * scale),
    },
  };
}

export type Tokens = ReturnType<typeof makeTokens>;

/**
 * Unscaled tokens, for the rare module-level constant that can't call the hook.
 * Prefer `useTokens()` in components so values track the viewport.
 */
export const staticTokens = makeTokens(1);
