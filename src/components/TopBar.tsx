import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { useCanvasEdgeInset, usePageScroll } from './ScaledPage';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';

import { useNavigation } from '../Navigation';
import { useTheme } from '../ThemeContext';
import { NAV, colors, fonts, type } from '../theme';

/**
 * The nav that sits on every framed screen: wordmark, three links, the
 * light/dark toggle, Login, and the "Start For Free" pill. Geometry is
 * identical across every page of the design, so it lives here once.
 *
 * The logo and the toggle/login/CTA cluster live inside `EdgeBar`, a plain
 * strip pinned to the page's *true* left/right edges with `left`/`right` and
 * no explicit width — the same technique the footer's backdrop plate already
 * uses reliably. Each control then sits a small, fixed padding in from
 * `EdgeBar`'s own edge. Earlier attempts computed each control's `left` by
 * hand from the canvas inset and cancelled it against the content frame's own
 * offset; any change to one side without the other threw everything off, and
 * it was hard to check at a glance. Nothing here needs to cancel against
 * anything — `EdgeBar` already reaches the corners, so its children just
 * describe their own distance from an edge that is already the right one.
 *
 * The three centre links are unrelated to any of this — they stay inside the
 * ordinary 1440 content frame, at the same fixed position as ever.
 *
 * The CTA pill inverts with the theme (black-on-light, white-on-dark), and its
 * 24px side padding from the design is deliberately not reproduced — the label
 * is set nowrap there and overflows that inset, so honouring it would wrap
 * "Start For Free" onto two lines.
 */

const EDGE_PAD = 32;
const EDGE_GAP = 28;
const BAR_HEIGHT = 100;

export type TopBarProps = {
  /** Some frames sit on their own ground and want the bar transparent. */
  onNavPress?: (label: string) => void;
  onLoginPress?: () => void;
  onStartForFreePress?: () => void;
  showToggle?: boolean;
  /**
   * Pages with a fixed background that doesn't follow the light/dark toggle
   * (the AI engine's dark gradient) need the bar's ink and CTA colours pinned
   * instead of read from the global theme, or the bar goes invisible against it.
   */
  forceInk?: string;
  forceCtaBg?: string;
  forceCtaLabel?: string;
};

export function TopBar({
  onNavPress,
  onLoginPress,
  onStartForFreePress,
  showToggle = true,
  forceInk,
  forceCtaBg,
  forceCtaLabel,
}: TopBarProps) {
  const { theme, themeName, toggleTheme } = useTheme();
  const { navigate } = useNavigation();
  const { scrollToSection } = usePageScroll();
  const canvasEdgeInset = useCanvasEdgeInset();
  const isDark = themeName === 'dark';
  const ink = forceInk ?? theme.text;
  const ctaBg = forceCtaBg ?? theme.ctaBg;
  const ctaLabel = forceCtaLabel ?? theme.ctaLabel;
  const goSignIn = onLoginPress ?? (() => navigate('signin'));
  const goStart = onStartForFreePress ?? (() => navigate('signin'));
  const toggle = useInteraction();
  const knobShift = useToggleAnimation(isDark, 220);

  /**
   * The third label is still inert: it is literal placeholder text
   * ("xxxxxxxxxxxx") in the design, so there is nothing to point it at without
   * inventing a page nobody asked for.
   */
  const jumpTo = (label: string) => {
    if (label === 'Why Vendly ?') scrollToSection('about');
    if (label === 'Pricing') scrollToSection('pricing');
  };

  return (
    <>
      <View
        style={[styles.edgeBar, { left: -canvasEdgeInset, right: -canvasEdgeInset }]}
        pointerEvents="box-none"
      >
        <Image
          source={require('../../assets/vendly-logo.png')}
          style={styles.logoMark}
          resizeMode="contain"
          tintColor={ink}
          accessibilityIgnoresInvertColors
        />
        <Text style={[styles.wordmark, { color: ink }]} accessibilityLabel="Vendly.lk">
          endly.
          <Text style={{ color: colors.accent }}>lk</Text>
        </Text>

        {showToggle ? (
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: isDark }}
            accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onPress={toggleTheme}
            {...toggle.handlers}
            style={[
              styles.toggleTrack,
              clickable,
              toggle.hovered && styles.toggleTrackHover,
              toggle.focusVisible && focusRing(theme.accent),
            ]}
          >
            <Animated.View
              style={[
                styles.toggleKnob,
                {
                  left: knobShift.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      NAV.toggle.knobInset,
                      NAV.toggle.width - NAV.toggle.knob - NAV.toggle.knobInset,
                    ],
                  }),
                  backgroundColor: knobShift.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#ffcc00', '#000000'],
                  }),
                },
              ]}
            />
            <View style={[styles.toggleIcon, { left: 24 }]} pointerEvents="none">
              <SunIcon color={isDark ? '#8e8e93' : '#000000'} />
            </View>
            <View style={[styles.toggleIcon, { left: 100 }]} pointerEvents="none">
              <MoonIcon color={isDark ? '#ffffff' : '#8e8e93'} />
            </View>
          </Pressable>
        ) : null}

        <LoginLink color={ink} onPress={goSignIn} />
        <StartForFree bg={ctaBg} label={ctaLabel} onPress={goStart} />
      </View>

      {NAV.links.map(({ label, left }) => (
        <NavLink
          key={label}
          label={label}
          left={left}
          color={ink}
          onPress={() => (onNavPress ? onNavPress(label) : jumpTo(label))}
        />
      ))}
    </>
  );
}

/**
 * A nav link. The underline grows on hover/focus rather than appearing at full
 * width, and is drawn as a sibling bar so it can animate without the label
 * reflowing the way a text-decoration would.
 */
function NavLink({
  label,
  left,
  color,
  onPress,
}: {
  label: string;
  left: number;
  color: string;
  onPress: () => void;
}) {
  const { hovered, pressed, focusVisible, highlighted, handlers } = useInteraction();
  const grow = useToggleAnimation(highlighted);

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      {...handlers}
      style={[styles.navItem, { left }, clickable, focusVisible && focusRing(color, 4)]}
    >
      <Text style={[styles.navLabel, { color, opacity: pressed ? 0.6 : 1 }]}>{label}</Text>
      <Animated.View
        style={[
          styles.underline,
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

function LoginLink({ color, onPress }: { color: string; onPress: () => void }) {
  const { hovered, pressed, focusVisible, highlighted, handlers } = useInteraction();
  const grow = useToggleAnimation(highlighted);

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      {...handlers}
      style={[styles.loginHit, clickable, focusVisible && focusRing(color, 2)]}
    >
      <Text style={[styles.loginLabel, { color, opacity: pressed ? 0.6 : 1 }]}>Login</Text>
      <Animated.View
        style={[
          styles.underline,
          {
            left: 10,
            right: 10,
            backgroundColor: color,
            transform: [{ scaleX: grow }],
            opacity: hovered || focusVisible ? 1 : 0,
          },
        ]}
      />
    </Pressable>
  );
}

/** The primary action: lifts slightly on hover, settles under the press. */
function StartForFree({
  bg,
  label,
  onPress,
}: {
  bg: string;
  label: string;
  onPress: () => void;
}) {
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

function SunIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={4.5} fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 12 + Math.cos(rad) * 7.5;
        const y1 = 12 + Math.sin(rad) * 7.5;
        const x2 = 12 + Math.cos(rad) * 9.8;
        const y2 = 12 + Math.sin(rad) * 9.8;
        return (
          <Path
            key={deg}
            d={`M${x1} ${y1}L${x2} ${y2}`}
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        );
      })}
    </Svg>
  );
}

function MoonIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2Z"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  /** Reaches the page's true edges — see the module doc comment above. */
  edgeBar: {
    position: 'absolute',
    top: 0,
    height: BAR_HEIGHT,
  },

  logoMark: {
    position: 'absolute',
    left: EDGE_PAD - 6,
    top: -57.5,
    width: 90,
    height: 135,
  },
  wordmark: {
    position: 'absolute',
    left: EDGE_PAD + 93,
    top: 51.5,
    width: 107,
    fontFamily: fonts.wordmark,
    ...type.wordmark,
  },

  navItem: {
    position: 'absolute',
    top: NAV.linkTop,
  },
  navLabel: {
    fontFamily: fonts.nav,
    ...type.nav,
  },
  /** Anchored to the control's own box; scaleX animates it out from the centre. */
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: 2,
    borderRadius: 1,
  },

  toggleTrack: {
    position: 'absolute',
    right: EDGE_PAD + NAV.ctaBox.width + EDGE_GAP + 120 + EDGE_GAP,
    top: 6,
    width: NAV.toggle.width,
    height: NAV.toggle.height,
    borderRadius: NAV.toggle.height / 2,
    backgroundColor: '#e5e5ea',
    justifyContent: 'center',
  },
  toggleTrackHover: {
    backgroundColor: '#dcdce1',
  },
  toggleKnob: {
    position: 'absolute',
    top: NAV.toggle.knobInset - 2,
    width: NAV.toggle.knob,
    height: NAV.toggle.knob,
    borderRadius: NAV.toggle.knob / 2,
  },
  toggleIcon: {
    position: 'absolute',
    top: 20,
  },

  loginHit: {
    position: 'absolute',
    right: EDGE_PAD + NAV.ctaBox.width + EDGE_GAP,
    top: 17,
    padding: 10,
  },
  loginLabel: {
    fontFamily: fonts.login,
    ...type.login,
  },

  ctaWrap: {
    position: 'absolute',
    right: EDGE_PAD,
    top: 12,
  },
  cta: {
    width: NAV.ctaBox.width,
    height: NAV.ctaBox.height,
    borderRadius: NAV.ctaBox.radius,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 13,
    paddingBottom: 11,
  },
  ctaLabel: {
    fontFamily: fonts.cta,
    ...type.cta,
  },
});
