import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePageScroll } from '../components/ScaledPage';
import { ScrollCue } from '../components/ScrollCue';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';

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
  const { scrollToSection } = usePageScroll();
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
        What People Say About Us !
      </Text>

      {QUOTES.map((quote, index) => (
        <QuoteCard
          key={quote}
          quote={quote}
          left={CARD.firstLeft + index * CARD.pitch}
          color={theme.text}
          active={index === activeSlide}
          position={index + 1}
          total={QUOTES.length}
          onSelect={() => setActiveSlide(index)}
        />
      ))}

      <View style={styles.dots}>
        {QUOTES.map((quote, index) => (
          <Dot
            key={quote}
            selected={index === activeSlide}
            color={theme.text}
            label={`Show testimonial ${index + 1} of ${QUOTES.length}`}
            onPress={() => setActiveSlide(index)}
          />
        ))}
      </View>

      <View style={styles.cue}>
        <ScrollCue onPress={() => scrollToSection('footer')} label="Scroll to newsletter" />
      </View>
    </View>
  );
}

/**
 * A quote card. The design marks the middle card as the live slide with a solid
 * border while the outer two fade; selecting a card promotes it, so the cards
 * and the dots drive the same state instead of the dots being decorative.
 */
function QuoteCard({
  quote,
  left,
  color,
  active,
  position,
  total,
  onSelect,
}: {
  quote: string;
  left: number;
  color: string;
  active: boolean;
  position: number;
  total: number;
  onSelect: () => void;
}) {
  const { hovered, focusVisible, handlers } = useInteraction();
  const lit = useToggleAnimation(active || hovered, 200);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Testimonial ${position} of ${total}: ${quote}`}
      accessibilityState={{ selected: active }}
      onPress={onSelect}
      {...handlers}
      style={[styles.cardHit, { left }, clickable, focusVisible && focusRing(colors.accent, 4)]}
    >
      <Animated.View
        style={[
          styles.card,
          {
            borderColor: color,
            opacity: lit.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
          },
        ]}
      >
        <Text style={[styles.quote, { color }]}>{quote}</Text>
      </Animated.View>
    </Pressable>
  );
}

/**
 * The dot is 15px in the design, which is well under a comfortable target, so
 * the pressable area is padded out around it while the painted dot keeps its
 * size.
 */
function Dot({
  selected,
  color,
  label,
  onPress,
}: {
  selected: boolean;
  color: string;
  label: string;
  onPress: () => void;
}) {
  const { hovered, focusVisible, handlers } = useInteraction();
  const grow = useToggleAnimation(selected || hovered, 180);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      {...handlers}
      style={[styles.dotHit, clickable, focusVisible && focusRing(colors.accent, 0)]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: selected ? color : '#8c8b8b',
            transform: [{ scale: grow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }],
          },
        ]}
      />
    </Pressable>
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
  cardHit: {
    position: 'absolute',
    top: CARD.top,
    width: CARD.width,
    height: CARD.height,
    borderRadius: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderRadius: 20,
  },
  quote: {
    position: 'absolute',
    left: TEXT_INSET,
    top: QUOTE_INK_TOP - CARD.top - QUOTE_INK_OFFSET - 2,
    width: CARD.width - TEXT_INSET * 2,
    fontFamily: fonts.heading,
    fontSize: 20,
    lineHeight: 34,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 676 - 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 19 - 24,
  },
  dotHit: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
