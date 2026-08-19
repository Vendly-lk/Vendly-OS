import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { clickable, focusRing, useInteraction, useToggleAnimation } from '../../interaction';

/**
 * The scroll cue at the bottom of the category showcase. Its source asset is an
 * 80x80 SVG (a downward chevron cut out of a solid ring) exported verbatim from
 * the design; path data copied as-is.
 *
 * The design draws it as decoration, but a downward chevron pinned to the foot
 * of a section reads as "there is more below" — so it takes an `onPress` and
 * behaves like the control it looks like, nudging down under the pointer.
 */
const PATH =
  'M40 54L58 36L52.3 30.4L40 42.7L27.7 30.4L22 36L40 54ZM40 80C34.4667 80 29.2667 78.95 24.4 76.85C19.5333 74.75 15.3 71.9 11.7 68.3C8.1 64.7 5.25 60.4667 3.15 55.6C1.05 50.7333 0 45.5333 0 40C0 34.4667 1.05 29.2667 3.15 24.4C5.25 19.5333 8.1 15.3 11.7 11.7C15.3 8.1 19.5333 5.25 24.4 3.15C29.2667 1.05 34.4667 0 40 0C45.5333 0 50.7333 1.05 55.6 3.15C60.4667 5.25 64.7 8.1 68.3 11.7C71.9 15.3 74.75 19.5333 76.85 24.4C78.95 29.2667 80 34.4667 80 40C80 45.5333 78.95 50.7333 76.85 55.6C74.75 60.4667 71.9 64.7 68.3 68.3C64.7 71.9 60.4667 74.75 55.6 76.85C50.7333 78.95 45.5333 80 40 80ZM40 72C48.9333 72 56.5 68.9 62.7 62.7C68.9 56.5 72 48.9333 72 40C72 31.0667 68.9 23.5 62.7 17.3C56.5 11.1 48.9333 8 40 8C31.0667 8 23.5 11.1 17.3 17.3C11.1 23.5 8 31.0667 8 40C8 48.9333 11.1 56.5 17.3 62.7C23.5 68.9 31.0667 72 40 72Z';

export type ChevronCircleIconProps = {
  onPress?: () => void;
  label?: string;
};

export function ChevronCircleIcon({ onPress, label = 'Scroll down' }: ChevronCircleIconProps) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const nudge = useToggleAnimation(highlighted, 160);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      {...handlers}
      style={[styles.hit, clickable, focusVisible && focusRing('#FF6262', 4)]}
    >
      <Animated.View
        style={{
          opacity: pressed ? 0.75 : 1,
          transform: [
            { translateY: nudge.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }) },
          ],
        }}
      >
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <Path d={PATH} fill="#FF6262" />
        </Svg>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
