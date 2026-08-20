import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { fonts } from '../theme';

/**
 * The furniture the added sections share.
 *
 * These pages have no design export behind them — they are modelled on the
 * reference site's section shapes — so the type scale and rhythm live here
 * rather than being re-guessed six times. The frames that *do* come from a
 * design keep their own measured geometry and do not use any of this.
 */

export const PAGE_W = 1440;
export const PAGE_H = 1024;
/** The margin the designed frames use, so the new pages line up with them. */
export const GUTTER = 92;

export const HEADING_SIZE = 70;
export const HEADING_LEADING = 84;

export function SectionHeading({
  children,
  color,
  visible,
  delay = 0,
  top = 150,
  width = 900,
  align = 'left',
}: PropsWithChildren<{
  color: string;
  visible: boolean;
  delay?: number;
  top?: number;
  width?: number;
  align?: 'left' | 'center';
}>) {
  return (
    <Reveal visible={visible} delay={delay}>
      <Text
        accessibilityRole="header"
        style={[
          styles.heading,
          {
            color,
            top,
            width,
            left: align === 'center' ? (PAGE_W - width) / 2 : GUTTER,
            textAlign: align,
          },
        ]}
      >
        {children}
      </Text>
    </Reveal>
  );
}

export function SectionLead({
  children,
  color,
  visible,
  delay = REVEAL_STAGGER,
  top = 260,
  width = 720,
  align = 'left',
}: PropsWithChildren<{
  color: string;
  visible: boolean;
  delay?: number;
  top?: number;
  width?: number;
  align?: 'left' | 'center';
}>) {
  return (
    <Reveal visible={visible} delay={delay}>
      <Text
        style={[
          styles.lead,
          {
            color,
            top,
            width,
            left: align === 'center' ? (PAGE_W - width) / 2 : GUTTER,
            textAlign: align,
          },
        ]}
      >
        {children}
      </Text>
    </Reveal>
  );
}

/** A card with the soft border the reference site uses on dark grounds. */
export function Card({
  children,
  style,
  hairline,
  fill,
}: PropsWithChildren<{ style?: object | object[]; hairline: string; fill: string }>) {
  return (
    <View style={[styles.card, { borderColor: hairline, backgroundColor: fill }, style as never]}>
      {children}
    </View>
  );
}

export const styles = StyleSheet.create({
  section: {
    width: PAGE_W,
    height: PAGE_H,
    overflow: 'hidden',
  },
  heading: {
    position: 'absolute',
    fontFamily: fonts.display,
    fontSize: HEADING_SIZE,
    lineHeight: HEADING_LEADING,
  },
  lead: {
    position: 'absolute',
    fontFamily: fonts.cta,
    fontSize: 24,
    lineHeight: 36,
  },
  card: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
});
