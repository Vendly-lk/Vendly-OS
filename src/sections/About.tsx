import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BulletIcon } from '../components/icons/BulletIcon';
import { ScrollCue } from '../components/ScrollCue';
import { usePageScroll } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts, type } from '../theme';

/**
 * "About us / Risk of fake orders" — Figma frame "Desktop - 3" (node 27:1324),
 * the one screen in this project taken from Figma directly rather than the PDF.
 *
 * The gradient plate is a 1440 x 293 rounded rectangle hung at y = -182, so only
 * its lower ~111px and its bottom corner radii sit inside the frame; it reads as
 * the colour band at the seam with the section above. Its colours flip with the
 * theme: pink-to-green on dark, red-to-orange on light.
 *
 * Copy rows are positioned individually rather than as one flowing block. In
 * Figma the copy is a single text layer whose bullet rows are indented with
 * literal spaces, with the red marks floating over it as a separate column; as
 * one string, the marks and their rows would drift apart wherever a platform
 * measures a space differently. The `top` values are calibrated so painted
 * glyphs — not line boxes — land where the reference render puts them.
 */

export const ABOUT_HEIGHT = 1024;

const BLOCK = { left: 92, top: 247, width: 1302 } as const;

const BULLETS = [
  { text: "Customer places an order, but doesn't pick up the phone", textTop: 293, icon: { size: 20, left: 26, top: 314 } },
  { text: 'Send a parcel, but it keeps canceling it', textTop: 351, icon: { size: 20, left: 26, top: 372 } },
  { text: 'Repeated returns increase courier costs', textTop: 409, icon: { size: 24, left: 24, top: 428 } },
  { text: 'Trouble with courier company for courier charges', textTop: 467, icon: { size: 20, left: 26, top: 488 } },
  { text: 'There is no way to verify new customers', textTop: 525, icon: { size: 20, left: 26, top: 546 } },
] as const;

export function About() {
  const { scrollToSection } = usePageScroll();
  const { theme, themeName } = useTheme();
  const plate =
    themeName === 'dark'
      ? [colors.gradientFrom, colors.gradientTo]
      : ['#ff0000', '#ffba00'];

  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <LinearGradient
        colors={plate as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.plate}
      />

      <View style={styles.block}>
        <Text style={[styles.eyebrow, { color: theme.text }]}>About us</Text>

        <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
          Risk of fake orders
        </Text>

        <Text style={[styles.intro, { color: theme.textMuted }]}>
          Vendly is a powerful fraud detection tool for your business that scans and accurately
          verifies your orders
        </Text>

        {BULLETS.map(({ text, textTop, icon }) => (
          <View key={text}>
            <View style={[styles.bulletMark, { left: icon.left, top: icon.top }]}>
              <BulletIcon size={icon.size} />
            </View>
            <Text style={[styles.bulletText, { top: textTop, color: theme.text }]}>{text}</Text>
          </View>
        ))}

        <Text style={[styles.outro, { color: theme.textMuted }]}>
          Vendly helps you avoid that risk. Check your customer's previous order records now to
          avoid any further losses.
        </Text>
      </View>

      <View style={styles.scrollCue}>
        <ScrollCue onPress={() => scrollToSection('categories')} label="Scroll to categories" />
      </View>

      <TopBar />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: 1440,
    height: ABOUT_HEIGHT,
    overflow: 'hidden',
  },
  plate: {
    position: 'absolute',
    left: 0,
    top: -182,
    width: 1440,
    height: 293,
    borderRadius: 102,
  },

  block: {
    position: 'absolute',
    left: BLOCK.left,
    top: BLOCK.top,
    width: BLOCK.width,
  },
  eyebrow: {
    position: 'absolute',
    top: 2,
    fontFamily: fonts.eyebrow,
    ...type.eyebrow,
  },
  heading: {
    position: 'absolute',
    top: 64,
    fontFamily: fonts.heading,
    ...type.heading,
  },
  intro: {
    position: 'absolute',
    top: 136,
    width: BLOCK.width,
    fontFamily: fonts.body,
    ...type.body,
  },
  bulletMark: {
    position: 'absolute',
  },
  bulletText: {
    position: 'absolute',
    left: 76,
    fontFamily: fonts.body,
    ...type.bullet,
  },
  outro: {
    position: 'absolute',
    top: 640,
    width: BLOCK.width,
    fontFamily: fonts.body,
    ...type.body,
  },

  scrollCue: {
    position: 'absolute',
    left: 685,
    top: 941,
  },
});
