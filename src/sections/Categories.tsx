import React, { useCallback, useRef, useState } from 'react';
import { Animated, Easing, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

import { CategoryDetail, CategoryDetailSpec } from './CategoryDetail';
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
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  /** The full-bleed page behind this column's "View More". */
  detail: CategoryDetailSpec;
};

/** How long the column takes to wipe out to full bleed, measured off the
 *  prototype recording: ~450ms out, a little quicker back. */
const OPEN_MS = 450;
const CLOSE_MS = 350;

const CATEGORIES: Category[] = [
  {
    id: 'food-beverages',
    number: '01',
    title: 'Food & Beverages',
    color: '#f2bd1e',
    image: require('../../assets/categories/burger.png'),
    art: { left: -119, top: 384.7, width: 485, height: 264.5 },
    detail: {
      background: '#F2BD1E',
      wordmark: { left: 207, top: 231 },
      art: { left: 178, top: 216, width: 1083, height: 591 },
      ink: '#ffffff',
    },
  },
  {
    id: 'fashion-apparel',
    number: '02',
    title: 'Fashion & Apparel',
    color: '#858585',
    image: require('../../assets/categories/hoodie.png'),
    art: { left: -169, top: 340, width: 579, height: 315.8 },
    detail: {
      background: '#858585',
      wordmark: { left: 150, top: 219 },
      art: { left: 223, top: 127, width: 993, height: 602 },
      ink: '#000000',
    },
  },
  {
    id: 'beauty-health',
    number: '03',
    title: 'Beauty & Health',
    color: '#ff00d0',
    image: require('../../assets/categories/cent.png'),
    art: { left: -225, top: 303, width: 680, height: 371 },
    detail: {
      background: '#E47FD2',
      wordmark: { left: 147, top: 259 },
      art: { left: 230, top: 170, width: 1056, height: 576 },
      ink: '#ffffff',
    },
  },
  {
    id: 'electronics-accessories',
    number: '04',
    title: 'Electronics & Accessories',
    color: '#00d2ff',
    image: require('../../assets/categories/headphone.png'),
    art: { left: -143, top: 346, width: 526, height: 287 },
    detail: {
      background: '#00D2FF',
      wordmark: { left: 147, top: 229 },
      art: { left: 198, top: 122, width: 965, height: 526 },
      ink: '#ffffff',
    },
  },
  {
    id: 'home-lifestyle',
    number: '05',
    title: 'Home & Lifestyle',
    color: '#e9d9c3',
    image: require('../../assets/categories/lamp.png'),
    art: { left: -254, top: 306, width: 750, height: 409 },
    detail: {
      background: '#E9D9C3',
      wordmark: { left: 159, top: 229 },
      art: { left: 159, top: 201, width: 1122, height: 608 },
      ink: '#000000',
    },
  },
  {
    id: 'general-store',
    number: '06',
    title: 'General Store',
    color: '#93836f',
    image: require('../../assets/categories/bag.png'),
    art: { left: -211, top: 330, width: 665, height: 363 },
    // The export for this one arrived empty, so its page is set to the column's
    // own brand colour with the artwork centred on the others' scale.
    detail: {
      background: '#93836F',
      wordmark: { left: 159, top: 229 },
      art: { left: 220, top: 205, width: 1000, height: 545 },
      ink: '#ffffff',
    },
  },
];

export function Categories() {
  const [active, setActive] = useState<string | null>(null);
  const [opened, setOpened] = useState<Category | null>(null);
  const { scrollToSection } = usePageScroll();
  const progress = useRef(new Animated.Value(0)).current;

  const openDetail = useCallback(
    (category: Category) => {
      setOpened(category);
      progress.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: OPEN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    },
    [progress],
  );

  const closeDetail = useCallback(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: CLOSE_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      // Only unmount once it has actually collapsed, so a re-open mid-close
      // does not leave the page half-drawn.
      if (finished) setOpened(null);
    });
  }, [progress]);

  const openedIndex = opened ? CATEGORIES.findIndex(c => c.id === opened.id) : -1;

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
          onOpen={() => openDetail(category)}
        />
      ))}

      <View style={styles.chevron}>
        <ChevronCircleIcon onPress={() => scrollToSection('testimonials')} />
      </View>

      {opened ? (
        <CategoryDetail
          spec={opened.detail}
          image={opened.image}
          title={opened.title}
          progress={progress}
          from={{ left: openedIndex * PANEL_W, width: PANEL_W }}
          fromArt={opened.art}
          onClose={closeDetail}
        />
      ) : null}
    </View>
  );
}

type ColumnProps = {
  category: Category;
  left: number;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onOpen: () => void;
};

function CategoryColumn({
  category,
  left,
  active,
  onActivate,
  onDeactivate,
  onOpen,
}: ColumnProps) {
  const pill = useInteraction();

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
    // A plain View, not a Pressable: the only thing here you can act on is the
    // "View More" button, and nesting that inside another button is invalid HTML
    // (browsers refuse to nest <button>, and the click target becomes ambiguous).
    // Pointer events give the column its hover without claiming to be a control.
    <View
      onPointerEnter={onActivate}
      onPointerLeave={onDeactivate}
      style={[styles.panel, { left }]}
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

      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`View more in ${category.title}`}
        onPress={onOpen}
        {...pill.handlers}
        onHoverIn={() => {
          pill.handlers.onHoverIn();
          onActivate();
        }}
        onFocus={() => {
          pill.handlers.onFocus();
          onActivate();
        }}
        onBlur={() => {
          pill.handlers.onBlur();
          onDeactivate();
        }}
        style={[
          styles.pill,
          clickable,
          pill.focusVisible && focusRing(colors.accent, 3),
          {
            top: move(BUTTON_TOP, BUTTON_TOP_ACTIVE),
            left: move(12, 10),
            width: move(144, 185),
            height: move(53, 57),
            borderColor: fade('#000000', '#ffffff'),
            backgroundColor: fade('#ffffff', 'rgba(255,255,255,0)'),
            transform: [{ scale: pill.pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <Animated.Text style={[styles.pillLabel, { color: fade('#000000', '#ffffff') }]}>
          View More
        </Animated.Text>
      </AnimatedPressable>
    </View>
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
