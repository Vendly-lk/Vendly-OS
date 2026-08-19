import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScrollCue } from '../components/ScrollCue';
import { useTheme } from '../ThemeContext';
import { fonts } from '../theme';

/**
 * "What People Say About Us !" — three quote cards with carousel dots.
 *
 * The middle card carries a solid border in the design while the outer two fade
 * out at their edges, marking the centre one as the active slide; the dots pick
 * that up here so the state is actually driven rather than decorative.
 */

export const TESTIMONIALS_HEIGHT = 1024;

const CARD = { width: 425, height: 200, top: 445, pitch: 457, firstLeft: 52 };
const TEXT_INSET = 15;
const QUOTE_INK_TOP = 518.5;
const QUOTE_INK_OFFSET = 6;

const QUOTES = [
  'Our sales increased by 25% just by having a clean, professional checkout page.',
  'We saved over LKR 45,000 in courier returned fees in our very first month',
  'Finally, a system actually built for the Sri Lankan e-commerce market',
];

export function Testimonials() {
  const { theme } = useTheme();
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
        What People Say About Us !
      </Text>

      {QUOTES.map((quote, index) => {
        const isActive = index === activeSlide;
        return (
          <View
            key={quote}
            style={[
              styles.card,
              {
                left: CARD.firstLeft + index * CARD.pitch,
                borderColor: theme.text,
                opacity: isActive ? 1 : 0.55,
              },
            ]}
          >
            <Text style={[styles.quote, { color: theme.text }]}>{quote}</Text>
          </View>
        );
      })}

      <View style={styles.dots}>
        {QUOTES.map((quote, index) => (
          <Pressable
            key={quote}
            accessibilityRole="button"
            accessibilityLabel={`Show testimonial ${index + 1}`}
            accessibilityState={{ selected: index === activeSlide }}
            onPress={() => setActiveSlide(index)}
            style={[
              styles.dot,
              { backgroundColor: index === activeSlide ? theme.text : '#8c8b8b' },
            ]}
          />
        ))}
      </View>

      <View style={styles.cue}>
        <ScrollCue />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: 1440,
    height: TESTIMONIALS_HEIGHT,
    overflow: 'hidden',
  },
  heading: {
    position: 'absolute',
    left: 208.9,
    top: 157,
    fontFamily: fonts.heading,
    fontSize: 70,
    lineHeight: 92,
  },
  card: {
    position: 'absolute',
    top: CARD.top,
    width: CARD.width,
    height: CARD.height,
    borderWidth: 2,
    borderRadius: 20,
  },
  quote: {
    position: 'absolute',
    left: TEXT_INSET,
    top: QUOTE_INK_TOP - CARD.top - QUOTE_INK_OFFSET,
    width: CARD.width - TEXT_INSET * 2,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 34,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 676,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 19,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },
  cue: {
    position: 'absolute',
    left: 685,
    top: 950,
  },
});
