/**
 * The illustrated backdrop for one picture-book page (§6.2), and the page-turn animation.
 *
 * Renders two stacked layers — the page being left and the page being entered — and
 * cross-fades them while sliding both horizontally, so a turn reads as a page moving
 * rather than a hard cut. Sentence changes *within* a page never reach this component,
 * so the artwork stays perfectly still while the text card advances.
 *
 * Artwork is optional. Any page whose `background` key is missing from `PAGE_ART` renders
 * a placeholder — a warm fill plus the page's `artBrief` in small muted type — so the
 * whole flow is testable before the illustrations exist. Dropping a file into `PAGE_ART`
 * is the only change needed to light a page up; nothing here needs editing.
 */
import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { getPageArt, type Page } from '@/constants/content';
import { PAGE_SLIDE_RATIO, PAGE_TURN_MS } from '@/constants/story-motion';
import type { Tokens } from '@/constants/tokens';
import { useTokens } from '@/hooks/use-tokens';

type PageBackgroundProps = {
  page: Page | undefined;
  /** The page rendered after this one; its art is prefetched so a turn never pops. */
  nextPage?: Page;
  /** 1 when moving forward through the book, -1 when going back. */
  direction: 1 | -1;
};

export function PageBackground({ page, nextPage, direction }: PageBackgroundProps) {
  const { width } = useWindowDimensions();
  const tokens = useTokens();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);

  /** The page on its way out, mounted only for the length of the turn. */
  const [outgoing, setOutgoing] = useState<Page | undefined>(undefined);
  const shownRef = useRef<Page | undefined>(undefined);

  const progress = useSharedValue(1);
  const slide = useSharedValue(0);
  /**
   * The slide distance of the turn currently playing. Held in a shared value rather
   * than read from props so the outgoing layer keeps animating against the offset it
   * started with — a direction change mid-turn would otherwise teleport it sideways.
   */
  const turnOffset = useSharedValue(0);

  // Read through refs so the turn effect depends only on the page: a direction or
  // resize change must never re-enter it and strand the outgoing layer.
  const directionRef = useRef(direction);
  directionRef.current = direction;
  const widthRef = useRef(width);
  widthRef.current = width;

  useEffect(() => {
    const previous = shownRef.current;
    shownRef.current = page;

    // First paint, or a re-render that didn't change the page: show it outright.
    if (!page || !previous || previous.id === page.id) {
      return;
    }

    const offset = directionRef.current * widthRef.current * PAGE_SLIDE_RATIO;
    setOutgoing(previous);

    // Start from wherever the previous turn had got to, rather than snapping to 0.
    // Interrupting a turn (a child tapping Next three times) then reads as continuous
    // motion instead of the incoming page popping to full opacity.
    progress.value = 1 - progress.value;
    slide.value = slide.value + offset;
    turnOffset.value = offset;

    progress.value = withTiming(1, { duration: PAGE_TURN_MS, easing: Easing.inOut(Easing.ease) });
    slide.value = withTiming(0, { duration: PAGE_TURN_MS, easing: Easing.inOut(Easing.ease) });

    const timer = setTimeout(() => setOutgoing(undefined), PAGE_TURN_MS);
    return () => clearTimeout(timer);
  }, [page, progress, slide, turnOffset]);

  // Warm the next page's artwork while the child is still reading this one. Only remote
  // sources need this; `require`d art is already in the bundle.
  useEffect(() => {
    const art = nextPage ? getPageArt(nextPage.background) : null;
    if (typeof art === 'string') {
      Image.prefetch(art);
    }
  }, [nextPage]);

  const incomingStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateX: slide.value }],
  }));

  // Trails the incoming page by exactly one slide-width, so the pair moves as one sheet.
  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateX: slide.value - turnOffset.value }],
  }));

  return (
    <View style={styles.root} pointerEvents="none">
      {outgoing ? (
        <Animated.View style={[StyleSheet.absoluteFill, outgoingStyle]}>
          <PageArt page={outgoing} styles={styles} />
        </Animated.View>
      ) : null}
      {page ? (
        <Animated.View style={[StyleSheet.absoluteFill, incomingStyle]}>
          <PageArt page={page} styles={styles} />
        </Animated.View>
      ) : null}
    </View>
  );
}

/** One page's artwork, or the designer-facing placeholder when it doesn't exist yet. */
function PageArt({ page, styles }: { page: Page; styles: ReturnType<typeof makeStyles> }) {
  const art = getPageArt(page.background);

  if (art !== null) {
    return <Image source={art} style={StyleSheet.absoluteFill} contentFit="cover" />;
  }

  return (
    <View style={styles.placeholder}>
      {page.artBrief ? <Text style={styles.artBrief}>{page.artBrief}</Text> : null}
    </View>
  );
}

function makeStyles(t: Tokens) {
  return StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
    },
    placeholder: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: t.colors.bgFallback,
      justifyContent: 'flex-end',
      padding: t.spacing.lg,
    },
    artBrief: {
      ...t.type.body,
      fontSize: Math.round(13 * t.scale),
      lineHeight: Math.round(13 * t.scale * 1.4),
      color: t.colors.textMuted,
      textAlign: 'center',
      maxWidth: t.contentMaxWidth,
      alignSelf: 'center',
    },
  });
}
