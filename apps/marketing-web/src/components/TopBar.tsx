import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

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
  const isDark = themeName === 'dark';
  const goSignIn = onLoginPress ?? (() => navigate('signin'));
  const goStart = onStartForFreePress ?? (() => navigate('signin'));

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
        <Pressable
          key={label}
          accessibilityRole="link"
          onPress={() => onNavPress?.(label)}
          style={[styles.navItem, { left }]}
        >
          <Text style={[styles.navLabel, { color: theme.text }]}>{label}</Text>
        </Pressable>
      ))}

      {showToggle ? (
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onPress={toggleTheme}
          style={styles.toggleTrack}
        >
          <View
            style={[
              styles.toggleKnob,
              isDark
                ? { left: NAV.toggle.width - NAV.toggle.knob - NAV.toggle.knobInset, backgroundColor: '#000000' }
                : { left: NAV.toggle.knobInset, backgroundColor: '#ffcc00' },
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

      <Pressable accessibilityRole="link" onPress={goSignIn} style={styles.loginHit}>
        <Text style={[styles.loginLabel, { color: theme.text }]}>Login</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={goStart}
        style={[styles.cta, { backgroundColor: theme.ctaBg }]}
      >
        <Text numberOfLines={1} style={[styles.ctaLabel, { color: theme.ctaLabel }]}>
          Start For Free
        </Text>
      </Pressable>
    </>
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

  cta: {
    position: 'absolute',
    left: NAV.ctaBox.left,
    top: NAV.ctaBox.top,
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
