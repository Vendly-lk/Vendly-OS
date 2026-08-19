import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

export const PANEL_WIDTH = 240;

export type CategoryData = {
  id: string;
  number: string;
  title: string;
  numberColor: string;
  image: ImageSourcePropType;
};

const BUTTON = { width: 144, height: 53 } as const;
const CONTENT_LEFT = 13;
const CONTENT_WIDTH = PANEL_WIDTH - CONTENT_LEFT * 2;

/**
 * Every column shares one fixed vertical rhythm — number, then title, then
 * button, then a clean, fully-contained photo — instead of the six different
 * (and in two cases entirely missing) photo positions and four different
 * button positions this was originally ported with. See git history / the
 * README for what that looked like: images overlapping titles in 4 of 6
 * columns, and 2 columns with no visible photo at all, because their peek
 * images sat entirely above the frame. This trades that inherited chaos for a
 * uniform, professional grid — same content, same per-category colors and
 * photos, consistent placement.
 */
const NUMBER_INK_TOP = 380;
const TITLE_INK_TOP = 470;
const BUTTON_TOP = 560;
const IMAGE_TOP = 650;
const IMAGE_HEIGHT = 330;

const NUMBER_SVG_BASELINE_Y = 60;
/** container-top -> rendered-ink-top offset at 66px Inter/NUMBER_SVG_BASELINE_Y,
 *  calibrated against the app's own measured output (not derived analytically —
 *  react-native-svg's web output didn't match canvas font-metric predictions). */
const NUMBER_INK_OFFSET = 11;
/** Same calibration for the 24px Inter title. */
const TITLE_INK_OFFSET = 5;

export function CategoryPanel({ data }: { data: CategoryData }) {
  return (
    <View style={styles.panel}>
      <Svg
        pointerEvents="none"
        style={[styles.numberSvg, { top: NUMBER_INK_TOP - NUMBER_INK_OFFSET }]}
        width={216}
        height={100}
      >
        <SvgText
          x={0}
          y={NUMBER_SVG_BASELINE_Y}
          fontFamily="Inter_400Regular"
          fontSize={66}
          fill={data.numberColor}
          stroke="#ffffff"
          strokeWidth={1}
        >
          {data.number}
        </SvgText>
      </Svg>

      <Text style={[styles.title, { top: TITLE_INK_TOP - TITLE_INK_OFFSET }]}>{data.title}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View more in ${data.title}`}
        style={styles.button}
      >
        <Text style={styles.buttonLabel}>View More</Text>
      </Pressable>

      <Image source={data.image} resizeMode="cover" style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: PANEL_WIDTH,
    height: 1024,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  numberSvg: {
    position: 'absolute',
    left: CONTENT_LEFT,
  },
  title: {
    position: 'absolute',
    left: CONTENT_LEFT,
    width: CONTENT_WIDTH,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    lineHeight: 29,
  },
  button: {
    position: 'absolute',
    left: CONTENT_LEFT,
    top: BUTTON_TOP,
    width: BUTTON.width,
    height: BUTTON.height,
    borderRadius: BUTTON.height / 2,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  buttonLabel: {
    position: 'absolute',
    left: 15,
    top: 16,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  image: {
    position: 'absolute',
    left: 0,
    top: IMAGE_TOP,
    width: PANEL_WIDTH,
    height: IMAGE_HEIGHT,
  },
});
