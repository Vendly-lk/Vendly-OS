import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, fonts, type } from '../theme';

/**
 * The header of "Desktop - 3": the gradient plate (node 77:51), the Vendly.lk
 * lockup (node 236:58), the nav links (node 77:19) and the Login / Start For Free
 * pair (node 77:31).
 *
 * The plate is a 1440 x 293 rounded rectangle hung at y = -182, so only its lower
 * ~111px and its bottom corner radii sit inside the frame. The logo artwork
 * likewise overhangs the top edge at y = -46; the frame clips both.
 */

const NAV_LINKS = [
  { label: 'Why Vendly ?', left: 254 },
  { label: 'Pricing', left: 410 },
  { label: 'xxxxxxxxxxxx', left: 510 },
] as const;

export type TopBarProps = {
  onNavPress?: (label: string) => void;
  onLoginPress?: () => void;
  onStartForFreePress?: () => void;
};

export function TopBar({ onNavPress, onLoginPress, onStartForFreePress }: TopBarProps) {
  return (
    <>
      <LinearGradient
        colors={[colors.gradientFrom, colors.gradientTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.plate}
      />

      {/* Logo lockup — node 236:58 */}
      <Image
        source={require('../../assets/vendly-logo.png')}
        style={styles.logoMark}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.wordmark} accessibilityLabel="Vendly.lk">
        endly.
        <Text style={styles.wordmarkTld}>lk</Text>
      </Text>

      {/* Nav links — node 77:19 */}
      {NAV_LINKS.map(({ label, left }) => (
        <Pressable
          key={label}
          accessibilityRole="link"
          onPress={() => onNavPress?.(label)}
          style={[styles.navItem, { left }]}
        >
          <Text style={styles.navLabel}>{label}</Text>
        </Pressable>
      ))}

      {/* Login + primary CTA — node 77:31 */}
      <View style={styles.actions}>
        <Pressable accessibilityRole="link" onPress={onLoginPress} style={styles.loginHit}>
          <Text style={styles.loginLabel}>Login</Text>
        </Pressable>

        <Pressable accessibilityRole="button" onPress={onStartForFreePress} style={styles.cta}>
          <Text numberOfLines={1} style={styles.ctaLabel}>
            Start For Free
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  plate: {
    position: 'absolute',
    left: 0,
    top: -182,
    width: 1440,
    height: 293,
    borderRadius: 102,
  },

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
    color: colors.text,
    fontFamily: fonts.wordmark,
    ...type.wordmark,
  },
  wordmarkTld: {
    color: colors.accent,
    fontFamily: fonts.wordmark,
    ...type.wordmark,
  },

  navItem: {
    position: 'absolute',
    top: 32,
  },
  navLabel: {
    color: colors.text,
    fontFamily: fonts.nav,
    ...type.nav,
  },

  actions: {
    position: 'absolute',
    left: 1135,
    top: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 49,
  },
  loginHit: {
    padding: 10,
  },
  loginLabel: {
    color: colors.text,
    fontFamily: fonts.login,
    ...type.login,
  },

  cta: {
    width: 157,
    height: 51,
    borderRadius: 56,
    backgroundColor: colors.ctaBackground,
    borderWidth: 3,
    borderColor: colors.ctaBorder,
    alignItems: 'center',
    justifyContent: 'center',
    // The frame's 13/11 vertical padding is what nudges the label 1px below the
    // pill's centre. Its 24px side padding is not reproduced: the label is set
    // nowrap in Figma and overflows that inset, so honouring it here would only
    // wrap "Start For Free" onto two lines.
    paddingTop: 13,
    paddingBottom: 11,
  },
  ctaLabel: {
    color: colors.ctaLabel,
    fontFamily: fonts.cta,
    ...type.cta,
  },
});
