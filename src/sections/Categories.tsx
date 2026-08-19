import React, { useState } from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

import { ChevronCircleIcon } from '../components/icons/ChevronCircleIcon';
import { usePageScroll } from '../components/ScaledPage';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { colors, fonts } from '../theme';

/**
 * The "shop by category" rail: six 240 x 1024 columns.
 *
 * Two states, both taken from the design. At rest every column shows a big
 * outlined number, its title and a "View More" pill on a light panel. Bringing a
 * column forward floods it with the category's brand colour, drops in the
 * product photo, and moves the title and pill down the panel.
 *
 * The design staggers the resting titles and pills by up to 7px between columns
 * and uses six near-but-not-equal outline colours; both are normalised here so
 * the rail reads as one grid.
 */

export const CATEGORIES_HEIGHT = 1024;

const PANEL_W = 240;
const CONTENT_LEFT = 13;

const NUMBER_INK_TOP = 382.3;
const TITLE_INK_TOP = 508;
const BUTTON_TOP = 600;
const TITLE_INK_TOP_ACTIVE = 750.4;
const BUTTON_TOP_ACTIVE = 841;

/** Calibrated in-app: react-native-svg's web text placement does not match
 *  canvas font-metric predictions, so these come from measured output. */
const NUMBER_SVG_BASELINE_Y = 60;
const NUMBER_INK_OFFSET = 11;
const TITLE_INK_OFFSET = 5;

type Category = {
  id: string;
  number: string;
  title: string;
  color: string;
  image: ImageSourcePropType;
  /** Per-product framing from the design; each crop is tuned to its photo. */
  art: { left: number; top: number; width: number; height: number };
};

const CATEGORIES: Category[] = [
  {
    id: 'food-beverages',
    number: '01',
    title: 'Food & Beverages',
    color: '#f2bd1e',
    image: require('../../assets/categories/burger.png'),
    art: { left: -119, top: 384.7, width: 485, height: 264.5 },
  },
  {
    id: 'fashion-apparel',
    number: '02',
    title: 'Fashion & Apparel',
    color: '#858585',
    image: require('../../assets/categories/hoodie.png'),
    art: { left: -169, top: 340, width: 579, height: 315.8 },
  },
  {
    id: 'beauty-health',
    number: '03',
    title: 'Beauty & Health',
    color: '#ff00d0',
    image: require('../../assets/categories/cent.png'),
    art: { left: -225, top: 303, width: 680, height: 371 },
  },
  {
    id: 'electronics-accessories',
    number: '04',
    title: 'Electronics & Accessories',
    color: '#00d2ff',
    image: require('../../assets/categories/headphone.png'),
    art: { left: -143, top: 346, width: 526, height: 287 },
  },
  {
    id: 'home-lifestyle',
    number: '05',
    title: 'Home & Lifestyle',
    color: '#e9d9c3',
    image: require('../../assets/categories/lamp.png'),
    art: { left: -254, top: 306, width: 750, height: 409 },
  },
  {
    id: 'general-store',
    number: '06',
    title: 'General Store',
    color: '#93836f',
    image: require('../../assets/categories/bag.png'),
    art: { left: -211, top: 330, width: 665, height: 363 },
  },
];

export function Categories() {
  const [active, setActive] = useState<string | null>(null);
  const { scrollToSection } = usePageScroll();

  return (
    <View style={styles.section}>
      {CATEGORIES.map((category, index) => (
        <CategoryColumn
          key={category.id}
          category={category}
          left={index * PANEL_W}
          active={active === category.id}
          onActivate={() => setActive(category.id)}
          onDeactivate={() => setActive(prev => (prev === category.id ? null : prev))}
        />
      ))}

      <View style={styles.chevron}>
        <ChevronCircleIcon onPress={() => scrollToSection('testimonials')} />
      </View>
    </View>
  );
}

type ColumnProps = {
  category: Category;
  left: number;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

function CategoryColumn({ category, left, active, onActivate, onDeactivate }: ColumnProps) {
  const { pressed, focusVisible, handlers } = useInteraction();

  // The two states differ in ground colour, artwork and text position, so they
  // are crossfaded rather than swapped outright: at rest the column shows its
  // outlined number; brought forward it floods with the brand colour as the
  // photo fades in and the title and pill travel down the panel.
  const open = useToggleAnimation(active, 260);
  const fade = (from: string, to: string) =>
    open.interpolate({ inputRange: [0, 1], outputRange: [from, to] });
  const move = (from: number, to: number) =>
    open.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  return (
    <Pressable
      onHoverIn={() => {
        handlers.onHoverIn();
        onActivate();
      }}
      onHoverOut={() => {
        handlers.onHoverOut();
        onDeactivate();
      }}
      onPressIn={handlers.onPressIn}
      onPressOut={handlers.onPressOut}
      onPress={active ? onDeactivate : onActivate}
      onFocus={() => {
        handlers.onFocus();
        onActivate();
      }}
      onBlur={() => {
        handlers.onBlur();
        onDeactivate();
      }}
      accessibilityRole="button"
      accessibilityLabel={category.title + ' \u2014 view more'}
      accessibilityState={{ expanded: active }}
      style={[styles.panel, { left }, clickable, focusVisible && focusRing(colors.accent, -3)]}
    >
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: fade(colors.panelBg, category.color) }]}
      />

      <Animated.Image
        source={category.image}
        resizeMode="cover"
        style={[styles.art, category.art, { opacity: open }]}
        accessibilityIgnoresInvertColors
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.number,
          { top: NUMBER_INK_TOP - NUMBER_INK_OFFSET, opacity: move(1, 0) },
        ]}
      >
        <Svg width={216} height={100}>
          <SvgText
            x={0}
            y={NUMBER_SVG_BASELINE_Y}
            fontFamily={fonts.ui}
            fontSize={66}
            fill={category.color}
            stroke="#ffffff"
            strokeWidth={1}
          >
            {category.number}
          </SvgText>
        </Svg>
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          {
            top: move(TITLE_INK_TOP - TITLE_INK_OFFSET, TITLE_INK_TOP_ACTIVE - TITLE_INK_OFFSET),
            color: fade('#000000', '#ffffff'),
          },
        ]}
      >
        {category.title}
      </Animated.Text>

      <Animated.View
        style={[
          styles.pill,
          {
            top: move(BUTTON_TOP, BUTTON_TOP_ACTIVE),
            left: move(12, 10),
            width: move(144, 185),
            height: move(53, 57),
            borderColor: fade('#000000', '#ffffff'),
            backgroundColor: fade('#ffffff', 'rgba(255,255,255,0)'),
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Animated.Text style={[styles.pillLabel, { color: fade('#000000', '#ffffff') }]}>
          View More
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    width: 1440,
    height: CATEGORIES_HEIGHT,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  panel: {
    position: 'absolute',
    top: 0,
    width: PANEL_W,
    height: CATEGORIES_HEIGHT,
    overflow: 'hidden',
  },
  art: {
    position: 'absolute',
  },
  number: {
    position: 'absolute',
    left: CONTENT_LEFT,
  },
  title: {
    position: 'absolute',
    left: CONTENT_LEFT,
    width: PANEL_W - CONTENT_LEFT * 2,
    fontFamily: fonts.ui,
    fontSize: 24,
    lineHeight: 29,
  },
  pill: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    fontFamily: fonts.ui,
    fontSize: 16,
  },
  chevron: {
    position: 'absolute',
    left: 680,
    top: 904,
  },
});
