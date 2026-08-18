import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, type } from '../theme';
import { BulletIcon } from './icons/BulletIcon';

/**
 * The "About us / Risk of fake orders" block — Figma text node 102:238 plus the
 * bullet column, node 154:27.
 *
 * In Figma the copy is one text layer whose bullet rows are indented with literal
 * spaces, with the red marks floating over it as a separate absolutely-positioned
 * column. Reproducing that as a single flowing string would leave the marks and
 * their rows to drift apart the moment a platform measures a space differently,
 * so each row is placed on the grid the frame actually renders: rows step 58px,
 * body lines step 52px, and every offset below is measured off the Figma export.
 *
 * The `top` values are calibrated so that painted glyphs — not line boxes — land
 * where they land in the reference render. A line box sits differently inside its
 * leading in each typeface, so pinning the boxes to the design's own offsets would
 * have left the body copy 8px high and the heading 15px high against the export.
 */

const BLOCK = { left: 92, top: 247, width: 1302 } as const;

const BULLETS = [
  {
    text: "Customer places an order, but doesn't pick up the phone",
    textTop: 293,
    icon: { size: 20, left: 26, top: 314 },
  },
  {
    text: 'Send a parcel, but it keeps canceling it',
    textTop: 351,
    icon: { size: 20, left: 26, top: 372 },
  },
  {
    text: 'Repeated returns increase courier costs',
    textTop: 409,
    icon: { size: 24, left: 24, top: 428 },
  },
  {
    text: 'Trouble with courier company for courier charges',
    textTop: 467,
    icon: { size: 20, left: 26, top: 488 },
  },
  {
    text: 'There is no way to verify new customers',
    textTop: 525,
    icon: { size: 20, left: 26, top: 546 },
  },
] as const;

export function AboutSection() {
  return (
    <View style={styles.block}>
      <Text style={styles.eyebrow}>About us</Text>

      <Text accessibilityRole="header" style={styles.heading}>
        Risk of fake orders
      </Text>

      <Text style={styles.intro}>
        Vendly is a powerful fraud detection tool for your business that scans and accurately
        verifies your orders
      </Text>

      {BULLETS.map(({ text, textTop, icon }) => (
        <View key={text}>
          <View style={[styles.bulletMark, { left: icon.left, top: icon.top }]}>
            <BulletIcon size={icon.size} />
          </View>
          <Text style={[styles.bulletText, { top: textTop }]}>{text}</Text>
        </View>
      ))}

      <Text style={styles.outro}>
        Vendly helps you avoid that risk. Check your customer's previous order records now to avoid
        any further losses.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    left: BLOCK.left,
    top: BLOCK.top,
    width: BLOCK.width,
  },

  eyebrow: {
    position: 'absolute',
    top: 4,
    color: colors.text,
    fontFamily: fonts.eyebrow,
    ...type.eyebrow,
  },
  heading: {
    position: 'absolute',
    top: 73,
    color: colors.text,
    fontFamily: fonts.heading,
    ...type.heading,
  },
  intro: {
    position: 'absolute',
    top: 136,
    width: BLOCK.width,
    color: colors.textMuted,
    fontFamily: fonts.body,
    ...type.body,
  },

  bulletMark: {
    position: 'absolute',
  },
  bulletText: {
    position: 'absolute',
    left: 76,
    color: colors.text,
    fontFamily: fonts.body,
    ...type.bullet,
  },

  outro: {
    position: 'absolute',
    top: 640,
    width: BLOCK.width,
    color: colors.textMuted,
    fontFamily: fonts.body,
    ...type.body,
  },
});
