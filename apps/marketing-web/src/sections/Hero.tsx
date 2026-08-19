import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

import { usePageScroll } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { useNavigation } from '../Navigation';
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
  const { navigate } = useNavigation();
  const { scrollToSection } = usePageScroll();
  const isDark = themeName === 'dark';
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(() => AppState.currentState !== 'background');

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

  // Browsers stop background media to save power, and asking a hidden video to
  // play just races that and rejects. Following the page's own visibility keeps
  // the loop off while nobody is watching it.
  //
  // The test is "not backgrounded" rather than "is active" deliberately: if a
  // platform reports some third state, the video should still play. Failing the
  // other way would leave the hero permanently frozen on its poster.
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => setVisible(state !== 'background'));
    return () => sub.remove();
  }, []);

  const player = useVideoPlayer(require('../../assets/site/hero.mp4'), instance => {
    instance.loop = true;
    instance.muted = true;
  });

  useEffect(() => {
    if (reduceMotion || !visible) player.pause();
    else player.play();
  }, [player, reduceMotion, visible]);

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

      <HeroCta
        bg={theme.ctaBg}
        label={theme.ctaLabel}
        onPress={() => navigate('signin')}
      />

      <WhyLink color={theme.text} onPress={() => scrollToSection('about')} />

      <TopBar />
    </View>
  );
}

/** The hero's primary action, matching the nav pill's hover behaviour. */
function HeroCta({ bg, label, onPress }: { bg: string; label: string; onPress: () => void }) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const lift = useToggleAnimation(highlighted && !pressed, 160);

  return (
    <Animated.View
      style={[
        styles.ctaWrap,
        {
          transform: [
            { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
          ],
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        {...handlers}
        style={[
          styles.cta,
          clickable,
          { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
          focusVisible && focusRing(colors.accent, 4),
        ]}
      >
        <Text numberOfLines={1} style={[styles.ctaLabel, { color: label }]}>
          Start For Free
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function WhyLink({ color, onPress }: { color: string; onPress: () => void }) {
  const { hovered, pressed, focusVisible, highlighted, handlers } = useInteraction();
  const grow = useToggleAnimation(highlighted);

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      {...handlers}
      style={[styles.whyLink, clickable, focusVisible && focusRing(color, 3)]}
    >
      <Text style={[styles.whyLabel, { color, opacity: pressed ? 0.6 : 1 }]}>
        Why We Build Vendly
      </Text>
      <Animated.View
        style={[
          styles.whyUnderline,
          {
            backgroundColor: color,
            transform: [{ scaleX: grow }],
            opacity: hovered || focusVisible ? 1 : 0,
          },
        ]}
      />
    </Pressable>
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
  ctaWrap: {
    position: 'absolute',
    left: 40,
    top: 899,
  },
  cta: {
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
  whyUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -3,
    height: 2,
    borderRadius: 1,
  },
});
