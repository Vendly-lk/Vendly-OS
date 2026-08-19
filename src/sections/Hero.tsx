import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';

/**
 * The opening screen: "Build Your Empire Today!" over the illustration.
 *
 * In the design the CTA and the "Why We Build Vendly" link are painted *under*
 * the illustration and are therefore invisible in the export. They are the
 * screen's primary action, so they are drawn above it here — same coordinates,
 * corrected paint order.
 */

export const HERO_HEIGHT = 1024;

/** Ink-top targets read off the design's vector glyph boxes. */
const HEADLINE_INK_TOP = 236.4;
const HEADLINE_LINE_STEP = 93.4;
/** line-box-top -> painted-cap-top for Outfit Bold at 64px, calibrated in-app. */
const HEADLINE_INK_OFFSET = 17;

export function Hero() {
  const { theme, themeName } = useTheme();
  const isDark = themeName === 'dark';
  const [reduceMotion, setReduceMotion] = useState(false);

  // A 10s loop that plays on its own is exactly what "reduce motion" is for.
  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      if (!cancelled) setReduceMotion(enabled);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  const player = useVideoPlayer(require('../../assets/site/hero.mp4'), instance => {
    instance.loop = true;
    instance.muted = true;
  });

  useEffect(() => {
    if (reduceMotion) player.pause();
    else player.play();
  }, [player, reduceMotion]);

  return (
    <View style={[styles.section, { backgroundColor: theme.pageBg }]}>
      {/* The still is a frame of the same sequence, so it sits underneath as the
       *  poster: it covers the video's first paint and stands in wherever the
       *  video cannot play. */}
      <Image
        source={require('../../assets/site/hero-illustration.jpg')}
        style={styles.illustration}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessibilityLabel="Seller overwhelmed by orders across chat apps and spreadsheets"
      />
      {!reduceMotion ? (
        <VideoView
          player={player}
          style={styles.illustration}
          contentFit="cover"
          nativeControls={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}

      <Text style={[styles.headline, { top: HEADLINE_INK_TOP - HEADLINE_INK_OFFSET, color: theme.text }]}>
        Build Your Empire
      </Text>
      <Text
        style={[
          styles.headline,
          {
            top: HEADLINE_INK_TOP + HEADLINE_LINE_STEP - HEADLINE_INK_OFFSET,
            color: isDark ? colors.accent : theme.text,
          },
        ]}
      >
        Today!
      </Text>

      <Pressable
        accessibilityRole="button"
        style={[styles.cta, { backgroundColor: theme.ctaBg }]}
      >
        <Text numberOfLines={1} style={[styles.ctaLabel, { color: theme.ctaLabel }]}>
          Start For Free
        </Text>
      </Pressable>

      <Pressable accessibilityRole="link" style={styles.whyLink}>
        <Text style={[styles.whyLabel, { color: theme.text }]}>Why We Build Vendly</Text>
      </Pressable>

      <TopBar />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: 1440,
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  illustration: {
    position: 'absolute',
    left: 0,
    top: 304,
    width: 1280,
    height: 720,
  },
  headline: {
    position: 'absolute',
    left: 21,
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 93,
  },
  cta: {
    position: 'absolute',
    left: 40,
    top: 899,
    width: 157,
    height: 51,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.ctaBorder,
  },
  ctaLabel: {
    fontFamily: fonts.cta,
    fontSize: 18,
  },
  whyLink: {
    position: 'absolute',
    left: 282.5,
    top: 906,
  },
  whyLabel: {
    fontFamily: fonts.cta,
    fontSize: 20,
  },
});
