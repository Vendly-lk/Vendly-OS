import React from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { fonts } from '../theme';

/**
 * The full-bleed page behind a category's "View More": the brand colour edge to
 * edge, a 350px "Vendly" wordmark, the product shot over it, and a GO Back disc.
 *
 * It opens the way the prototype does — the column's colour wipes across to fill
 * the frame, revealing the wordmark that sits behind it, while the product grows
 * from its place in the rail to its place here. So the panel is clipped from the
 * column's own rect out to the full 1440, and the product is interpolated
 * between the two rects rather than cross-faded.
 */

export const DETAIL_WIDTH = 1440;
export const DETAIL_HEIGHT = 1024;

export type DetailArt = { left: number; top: number; width: number; height: number };

export type CategoryDetailSpec = {
  background: string;
  /** The 350px wordmark's own offset; the design nudges it per category. */
  wordmark: { left: number; top: number };
  art: DetailArt;
  /** Nav rules and icons go dark on the pale grounds. */
  ink: string;
};

type Props = {
  spec: CategoryDetailSpec;
  image: ImageSourcePropType;
  title: string;
  /** 0 -> collapsed into the column, 1 -> filling the frame. */
  progress: Animated.Value;
  /** The rail column this opened from, in page coordinates. */
  from: { left: number; width: number };
  /** Where the product sits in the rail's hovered state. */
  fromArt: DetailArt;
  onClose: () => void;
};

export function CategoryDetail({
  spec,
  image,
  title,
  progress,
  from,
  fromArt,
  onClose,
}: Props) {
  const between = (a: number, b: number) =>
    progress.interpolate({ inputRange: [0, 1], outputRange: [a, b] });

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          backgroundColor: spec.background,
          left: between(from.left, 0),
          width: between(from.width, DETAIL_WIDTH),
        },
      ]}
    >
      {/* Held at the panel's own width so the contents stay put in page space
       *  while the panel wipes across them, which is what reveals the wordmark. */}
      <Animated.View style={[styles.stage, { left: between(-from.left, 0) }]}>
        <Text style={[styles.wordmark, { left: spec.wordmark.left, top: spec.wordmark.top }]}>
          Vendly
        </Text>

        <Animated.Image
          source={image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          accessibilityLabel={title}
          style={[
            styles.art,
            {
              left: between(fromArt.left + from.left, spec.art.left),
              top: between(fromArt.top, spec.art.top),
              width: between(fromArt.width, spec.art.width),
              height: between(fromArt.height, spec.art.height),
            },
          ]}
        />

        <Animated.View style={[styles.chrome, { opacity: progress }]} pointerEvents="box-none">
          <View style={styles.panelIcon}>
            <Svg width={34} height={34} viewBox="0 0 24 24">
              <Rect
                x={2.5}
                y={4}
                width={19}
                height={16}
                rx={2}
                fill="none"
                stroke={spec.ink}
                strokeWidth={2}
              />
              <Rect x={4.5} y={6} width={5} height={12} rx={1} fill={spec.ink} />
            </Svg>
          </View>

          <View style={styles.rules}>
            {[0, 1, 2, 3, 4].map(i => (
              <View key={i} style={[styles.rule, { backgroundColor: spec.ink }]} />
            ))}
          </View>

          <View style={styles.account}>
            <Svg width={51} height={51} viewBox="0 0 24 24">
              <Circle cx={12} cy={12} r={9.2} fill="none" stroke={spec.ink} strokeWidth={1.7} />
              <Circle cx={12} cy={9.6} r={3.1} fill="none" stroke={spec.ink} strokeWidth={1.7} />
              <Path
                d="M5.9 19.2c1.2-2.6 3.4-3.9 6.1-3.9s4.9 1.3 6.1 3.9"
                fill="none"
                stroke={spec.ink}
                strokeWidth={1.7}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          <GoBack onPress={onClose} title={title} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

function GoBack({ onPress, title }: { onPress: () => void; title: string }) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const grow = useToggleAnimation(highlighted && !pressed, 150);

  return (
    <Animated.View
      style={[
        styles.goBackWrap,
        { transform: [{ scale: grow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Go back from ${title}`}
        onPress={onPress}
        {...handlers}
        style={[styles.goBack, clickable, { opacity: pressed ? 0.85 : 1 }, focusVisible && focusRing('#ffffff', 4)]}
      >
        <Text style={styles.goBackLabel}>GO</Text>
        <Text style={styles.goBackLabel}>Back</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    height: DETAIL_HEIGHT,
    overflow: 'hidden',
  },
  stage: {
    position: 'absolute',
    top: 0,
    width: DETAIL_WIDTH,
    height: DETAIL_HEIGHT,
  },

  wordmark: {
    position: 'absolute',
    width: 1679,
    color: '#ffffff',
    fontFamily: fonts.nav,
    fontSize: 350,
    lineHeight: 369,
  },
  art: {
    position: 'absolute',
  },

  chrome: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DETAIL_WIDTH,
    height: DETAIL_HEIGHT,
  },
  panelIcon: {
    position: 'absolute',
    left: 22,
    top: 46,
  },
  rules: {
    position: 'absolute',
    left: 455,
    top: 57,
    width: 529,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 36,
  },
  rule: {
    width: 77,
    height: 3,
  },
  account: {
    position: 'absolute',
    left: 1371,
    top: 28,
  },

  goBackWrap: {
    position: 'absolute',
    left: 1288,
    top: 878,
  },
  goBack: {
    width: 109,
    height: 109,
    borderRadius: 54.5,
    backgroundColor: '#F93333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackLabel: {
    color: '#ffffff',
    fontFamily: fonts.splash,
    fontSize: 24,
    lineHeight: 28,
    textAlign: 'center',
  },
});
