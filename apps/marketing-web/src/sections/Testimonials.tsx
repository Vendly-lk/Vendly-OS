import React, { useCallback, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { usePageScroll, useIsSectionActive } from '../components/ScaledPage';
import { ScrollCue } from '../components/ScrollCue';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';

/**
 * "What People Say About Us !" — rebuilt rather than traced.
 *
 * The quotes are the design's own. No names, faces, roles or star ratings are
 * attached to them: the source carries none, and inventing them would be
 * manufacturing endorsements from people who do not exist. The card, the mark
 * and the emphasis carry the section instead, and real attribution can drop into
 * the space under each quote when there is some.
 *
 * One card is live at a time — it holds full contrast and an accent rule while
 * its neighbours recede — and the arrows, the dots and the cards themselves all
 * drive that single piece of state.
 */

export const TESTIMONIALS_HEIGHT = 1024;

const CANVAS = 1440;

const CARD = { width: 400, height: 330, top: 372, gap: 40 } as const;
const ROW_LEFT = (CANVAS - (CARD.width * 3 + CARD.gap * 2)) / 2;

const QUOTES = [
  'Our sales increased by 25% just by having a clean, professional checkout page.',
  'We saved over LKR 45,000 in courier returned fees in our very first month',
  'Finally, a system actually built for the Sri Lankan e-commerce market',
];

export function Testimonials() {
  const { theme, themeName } = useTheme();
  const { scrollToSection } = usePageScroll();
  const onScreen = useIsSectionActive('testimonials');
  const [active, setActive] = useState(1);
  const dark = themeName === 'dark';

  const step = useCallback(
    (delta: number) => setActive(prev => (prev + delta + QUOTES.length) % QUOTES.length),
    [],
  );

  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>Testimonials</Text>

      <Reveal visible={onScreen}>
        <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
          What People Say About Us !
        </Text>
      </Reveal>

      <View style={[styles.rule, { backgroundColor: colors.accent }]} />

      {QUOTES.map((quote, index) => (
        <QuoteCard
          key={quote}
          quote={quote}
          left={ROW_LEFT + index * (CARD.width + CARD.gap)}
          active={index === active}
          dark={dark}
          textColor={theme.text}
          position={index + 1}
          total={QUOTES.length}
          onSelect={() => setActive(index)}
        />
      ))}

      <Arrow
        direction="prev"
        left={ROW_LEFT - 78}
        color={theme.text}
        dark={dark}
        onPress={() => step(-1)}
      />
      <Arrow
        direction="next"
        left={CANVAS - ROW_LEFT + 22}
        color={theme.text}
        dark={dark}
        onPress={() => step(1)}
      />

      <View style={styles.dots}>
        {QUOTES.map((quote, index) => (
          <Dot
            key={quote}
            selected={index === active}
            color={theme.text}
            label={`Show testimonial ${index + 1} of ${QUOTES.length}`}
            onPress={() => setActive(index)}
          />
        ))}
      </View>

      <View style={styles.cue}>
        <ScrollCue onPress={() => scrollToSection('footer')} label="Scroll to newsletter" />
      </View>
    </View>
  );
}

function QuoteCard({
  quote,
  left,
  active,
  dark,
  textColor,
  position,
  total,
  onSelect,
}: {
  quote: string;
  left: number;
  active: boolean;
  dark: boolean;
  textColor: string;
  position: number;
  total: number;
  onSelect: () => void;
}) {
  const { hovered, focusVisible, handlers } = useInteraction();
  const lit = useToggleAnimation(active, 240);
  const raise = useToggleAnimation(active || hovered, 200);

  const surface = dark ? '#141414' : '#ffffff';
  const restBorder = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)';

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
            backgroundColor: surface,
            borderColor: lit.interpolate({
              inputRange: [0, 1],
              outputRange: [restBorder, colors.accent],
            }),
            opacity: lit.interpolate({ inputRange: [0, 1], outputRange: [0.62, 1] }),
            transform: [
              { translateY: raise.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
            ],
          },
        ]}
      >
        <Text style={[styles.mark, { color: colors.accent }]}>&#8220;</Text>

        <Text style={[styles.quote, { color: textColor }]}>{quote}</Text>

        <Animated.View
          style={[
            styles.cardRule,
            { backgroundColor: colors.accent, transform: [{ scaleX: lit }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

function Arrow({
  direction,
  left,
  color,
  dark,
  onPress,
}: {
  direction: 'prev' | 'next';
  left: number;
  color: string;
  dark: boolean;
  onPress: () => void;
}) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const slide = useToggleAnimation(highlighted, 150);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'prev' ? 'Previous testimonial' : 'Next testimonial'}
      onPress={onPress}
      {...handlers}
      style={[
        styles.arrow,
        {
          left,
          borderColor: dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
          backgroundColor: highlighted
            ? dark
              ? 'rgba(255,255,255,0.10)'
              : 'rgba(0,0,0,0.05)'
            : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
        clickable,
        focusVisible && focusRing(colors.accent, 3),
      ]}
    >
      <Animated.View
        style={{
          transform: [
            {
              translateX: slide.interpolate({
                inputRange: [0, 1],
                outputRange: [0, direction === 'prev' ? -3 : 3],
              }),
            },
          ],
        }}
      >
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path
            d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

/**
 * The painted dot stays small while the pressable area around it is padded out
 * to a comfortable target.
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
  const on = useToggleAnimation(selected, 200);

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
            backgroundColor: selected ? colors.accent : hovered ? color : '#8c8b8b',
            width: on.interpolate({ inputRange: [0, 1], outputRange: [10, 34] }),
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    width: CANVAS,
    height: TESTIMONIALS_HEIGHT,
    overflow: 'hidden',
  },

  eyebrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 150,
    textAlign: 'center',
    fontFamily: fonts.uiBold,
    fontSize: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  heading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 190,
    textAlign: 'center',
    fontFamily: fonts.heading,
    fontSize: 62,
    lineHeight: 82,
  },
  rule: {
    position: 'absolute',
    left: (CANVAS - 72) / 2,
    top: 300,
    width: 72,
    height: 3,
    borderRadius: 2,
  },

  cardHit: {
    position: 'absolute',
    top: CARD.top,
    width: CARD.width,
    height: CARD.height,
    borderRadius: 24,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    borderWidth: 2,
    paddingHorizontal: 34,
    paddingTop: 26,
  },
  mark: {
    fontFamily: fonts.display,
    fontSize: 86,
    lineHeight: 92,
  },
  quote: {
    marginTop: 2,
    fontFamily: fonts.ui,
    fontSize: 21,
    lineHeight: 34,
  },
  cardRule: {
    position: 'absolute',
    left: 34,
    bottom: 30,
    width: 56,
    height: 3,
    borderRadius: 2,
  },

  arrow: {
    position: 'absolute',
    top: CARD.top + CARD.height / 2 - 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CARD.top + CARD.height + 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotHit: {
    height: 34,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },

  cue: {
    position: 'absolute',
    left: 685,
    top: 918,
  },
});
