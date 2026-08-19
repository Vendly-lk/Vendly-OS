import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { colors } from '../theme';

/**
 * Figma node 222:62 "Chevron down" — the scroll affordance pinned to the bottom
 * centre of the frame. A 70px disc filled #434343 with a 1px white ring.
 *
 * The exported glyph is a 38.5 x 21.25 SVG whose stroke centreline runs
 * (2,2) -> (19.25,19.25) -> (36.5,2). Figma sizes that glyph into a 36 x 18 box
 * inset 25% / 37.5% inside the disc, i.e. a uniform 36/34.5 = 1.0435 scale of the
 * centreline bounds. Applying that scale in the disc's own 70x70 coordinate space
 * puts the vertices at (17,26), (35,44) and (53,26) with a 4.17 stroke — which is
 * the exported artwork placed at its designed geometry, not a redrawn glyph.
 *
 * The disc is drawn inside the same SVG rather than as a bordered View: a 1px
 * View border shrinks the child content box to 68px, which would squash a 70-unit
 * viewBox by ~3%. A circle of r=34.5 with a 1px centred stroke occupies exactly
 * the same 70px box the frame specifies.
 */

const SIZE = 70;

export type ScrollCueProps = {
  onPress?: () => void;
  label?: string;
};

export function ScrollCue({ onPress, label = 'Scroll down' }: ScrollCueProps) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const nudge = useToggleAnimation(highlighted, 160);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...handlers}
      style={[styles.disc, clickable, focusVisible && focusRing(colors.accent, 4)]}
    >
      <Animated.View
        style={{
          opacity: pressed ? 0.75 : 1,
          transform: [
            { translateY: nudge.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }) },
          ],
        }}
      >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={SIZE / 2 - 0.5}
          fill={colors.scrollCueFill}
          stroke={colors.scrollCueBorder}
          strokeWidth={1}
        />
        <Path
          d="M17 26L35 44L53 26"
          stroke={colors.scrollCueBorder}
          strokeWidth={4.17}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: SIZE,
    height: SIZE,
  },
});
