import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';

export const PANEL_WIDTH = 240;

export type CategoryData = {
  id: string;
  number: string;
  title: string;
  numberColor: string;
  /** Absent for "General Store": its source stroke color is an invalid 5-digit
   *  hex ("#ffcfc"), which real browsers drop — the number renders with no
   *  outline there. Reproduced as observed rather than guessed-and-fixed. */
  numberStroke: string | null;
  image: ImageSourcePropType;
  /** The peek image's own box. Width is always PANEL_WIDTH: the source's much
   *  wider `w-[...]` classes are overridden by Tailwind's `img { max-width:
   *  100% }` preflight rule resolving against the 240px panel, confirmed by
   *  reading the live computed layout rather than the (ineffective) source
   *  class. `left`/`top` do apply as authored. */
  imageTop: number;
  imageLeft: number;
  imageHeight: number;
  /** Ink-top of the number and title glyphs, calibrated against Inter's actual
   *  rendered metrics rather than derived from the source's broken flex `gap`
   *  (two of six panels use an invalid negative gap value that real browsers
   *  drop to 0; positioning off final measured ink sidesteps needing to model
   *  that quirk at all). */
  numberInkTop: number;
  titleInkTop: number;
  buttonTop: number;
};

const BUTTON = { width: 144, height: 53 } as const;
const CONTENT_LEFT = 13;
/** The SVG text's own baseline, kept well clear of the box's top edge so a
 *  66px ascender never clips. */
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
      <Image
        source={data.image}
        resizeMode="cover"
        style={[
          styles.image,
          { top: data.imageTop, left: data.imageLeft, height: data.imageHeight },
        ]}
      />

      {/* Painted after the image (unlike the source, where the image paints
       *  last and sits on top, covering the title and making the "View More"
       *  button unclickable in 4 of 6 columns) so the copy stays readable and
       *  the CTA stays tappable. Same positions, corrected paint order. */}
      <Svg
        pointerEvents="none"
        style={[styles.numberSvg, { top: data.numberInkTop - NUMBER_INK_OFFSET }]}
        width={216}
        height={100}
      >
        <SvgText
          x={0}
          y={NUMBER_SVG_BASELINE_Y}
          fontFamily="Inter_400Regular"
          fontSize={66}
          fill={data.numberColor}
          stroke={data.numberStroke ?? 'none'}
          strokeWidth={data.numberStroke ? 1 : 0}
        >
          {data.number}
        </SvgText>
      </Svg>

      <Text style={[styles.title, { top: data.titleInkTop - TITLE_INK_OFFSET }]}>{data.title}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View more in ${data.title}`}
        style={[styles.button, { top: data.buttonTop }]}
      >
        <Text style={styles.buttonLabel}>View More</Text>
      </Pressable>
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
  image: {
    position: 'absolute',
    width: PANEL_WIDTH,
  },
  numberSvg: {
    position: 'absolute',
    left: CONTENT_LEFT,
  },
  title: {
    position: 'absolute',
    left: CONTENT_LEFT,
    width: 219,
    color: '#000000',
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
  },
  button: {
    position: 'absolute',
    left: CONTENT_LEFT,
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
});
