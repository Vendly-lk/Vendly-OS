import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { usePageScroll } from './ScaledPage';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { SECTION_TOP } from '../layout';
import { useNavigation } from '../Navigation';
import { useTheme } from '../ThemeContext';
import { NAV, colors, fonts, type } from '../theme';

/**
 * The nav that sits on every framed screen: wordmark, three links, the
 * light/dark toggle, Login, and the "Start For Free" pill. Geometry is identical
 * across every page of the design, so it lives here once.
 *
 * The CTA pill inverts with the theme (black-on-light, white-on-dark), and its
 * 24px side padding from the design is deliberately not reproduced — the label
 * is set nowrap there and overflows that inset, so honouring it would wrap
 * "Start For Free" onto two lines.
 */

export type TopBarProps = {
  /** Some frames sit on their own ground and want the bar transparent. */
  onNavPress?: (label: string) => void;
  onLoginPress?: () => void;
  onStartForFreePress?: () => void;
  showToggle?: boolean;
};

export function TopBar({
  onNavPress,
  onLoginPress,
  onStartForFreePress,
  showToggle = true,
}: TopBarProps) {
  const { theme, themeName, toggleTheme } = useTheme();
  const { navigate } = useNavigation();
  const { scrollToY } = usePageScroll();
  const isDark = themeName === 'dark';
  const goSignIn = onLoginPress ?? (() => navigate('signin'));
  const goStart = onStartForFreePress ?? (() => navigate('signin'));
  const toggle = useInteraction();
  const knobShift = useToggleAnimation(isDark, 220);

  /**
   * "Why Vendly ?" is the one nav label with a section behind it, so it scrolls
   * there. The other two are left inert on purpose: the design has no pricing
   * screen, and its third label is literal placeholder text ("xxxxxxxxxxxx") —
   * inventing destinations for them would be inventing the site.
   */
  const jumpTo = (label: string) => {
    if (label === 'Why Vendly ?') scrollToY(SECTION_TOP.about);
  };

  return (
    <>
      <Image
        source={require('../../assets/vendly-logo.png')}
        style={styles.logoMark}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Text style={[styles.wordmark, { color: theme.text }]} accessibilityLabel="Vendly.lk">
        endly.
        <Text style={[styles.wordmark, { color: colors.accent }]}>lk</Text>
      </Text>

      {NAV.links.map(({ label, left }) => (
        <NavLink
          key={label}
          label={label}
          left={left}
          color={theme.text}
          onPress={() => (onNavPress ? onNavPress(label) : jumpTo(label))}
        />
      ))}

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
                  outputRange: [NAV.toggle.knobInset, NAV.toggle.width - NAV.toggle.knob - NAV.toggle.knobInset],
                }),
                backgroundColor: knobShift.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#ffcc00', '#000000'],
                }),
              },
            ]}
          />
          <View style={[styles.toggleIcon, { left: 20 }]} pointerEvents="none">
            <SunIcon color={isDark ? '#8e8e93' : '#000000'} />
          </View>
          <View style={[styles.toggleIcon, { left: 85 }]} pointerEvents="none">
            <MoonIcon color={isDark ? '#ffffff' : '#8e8e93'} />
          </View>
        </Pressable>
      ) : null}

      <LoginLink color={theme.text} onPress={goSignIn} />
      <StartForFree bg={theme.ctaBg} label={theme.ctaLabel} onPress={goStart} />
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
    <Svg width={20} height={20} viewBox="0 0 24 24">
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
    <Svg width={20} height={20} viewBox="0 0 24 24">
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
  logoMark: {
    position: 'absolute',
    left: -25.056,
    top: -46,
    width: 72,
    height: 108,
  },
  wordmark: {
    position: 'absolute',
    left: 54.15,
    top: 41.2,
    width: 85.854,
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
    left: NAV.toggle.left,
    top: NAV.toggle.top,
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
    left: NAV.loginLeft,
    top: 17,
    padding: 10,
  },
  loginLabel: {
    fontFamily: fonts.login,
    ...type.login,
  },

  ctaWrap: {
    position: 'absolute',
    left: NAV.ctaBox.left,
    top: NAV.ctaBox.top,
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
