import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { GUTTER, SectionHeading, SectionLead, styles as kit } from './kit';

/**
 * The reference site closes its middle with "Grow around the world" over a map.
 * The equivalent here is smaller and more honest about the product: one island,
 * every courier, with the cities orders actually come from.
 *
 * The island is drawn as a rough silhouette rather than traced from survey data
 * — it is a decorative locator, and it is marked as such to assistive tech.
 */

export const COVERAGE_HEIGHT = 1024;

const COURIERS = ['Koombiyo', 'PromptXpress', 'Domex', 'Aramex', 'DHL', 'SL Post'];

/** Rough positions on the silhouette, in its own 300 x 560 space. */
const CITIES = [
  { name: 'Jaffna', x: 128, y: 52 },
  { name: 'Anuradhapura', x: 132, y: 178 },
  { name: 'Trincomalee', x: 208, y: 176 },
  { name: 'Kandy', x: 158, y: 300 },
  { name: 'Colombo', x: 78, y: 356 },
  { name: 'Batticaloa', x: 232, y: 300 },
  { name: 'Galle', x: 120, y: 494 },
];

const ISLAND =
  'M150 8c26 0 44 22 52 48 9 30 26 52 34 84 9 34 20 62 22 96 2 33-6 62-14 92-9 34-18 66-38 96-16 24-36 44-58 44-24 0-44-22-58-48-16-30-24-64-28-98-4-36-2-70 6-104 8-32 22-58 34-88 10-26 18-50 26-74C136 26 140 8 150 8Z';

export function Coverage() {
  const { theme, themeName } = useTheme();
  const onScreen = useIsSectionActive('coverage');
  const dark = themeName === 'dark';
  const land = dark ? 'rgba(0,178,255,0.16)' : 'rgba(1,56,113,0.10)';
  const coast = dark ? 'rgba(0,178,255,0.55)' : 'rgba(1,56,113,0.45)';
  const chipBorder = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.14)';

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <SectionHeading visible={onScreen} color={theme.text} top={186} width={820}>
        Every district,{'\n'}every courier.
      </SectionHeading>

      <SectionLead visible={onScreen} color={theme.textMuted} top={356} width={560}>
        Order histories follow the buyer, not the courier. Whoever carried the parcel that came
        back, it still counts against the number that ordered it.
      </SectionLead>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 2}>
        <View style={styles.chips}>
          {COURIERS.map(courier => (
            <View key={courier} style={[styles.chip, { borderColor: chipBorder }]}>
              <Text style={[styles.chipLabel, { color: theme.text }]}>{courier}</Text>
            </View>
          ))}
        </View>
      </Reveal>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 3}>
        <View style={styles.mapWrap} accessibilityLabel="Map of Sri Lanka with major cities">
          <Svg width={300} height={560} viewBox="0 0 300 560">
            <Path d={ISLAND} fill={land} stroke={coast} strokeWidth={2} />
            {CITIES.map(city => (
              <Circle key={city.name} cx={city.x} cy={city.y} r={6} fill={colors.accent} />
            ))}
          </Svg>
          {CITIES.map(city => (
            <Text
              key={city.name}
              style={[styles.city, { left: city.x + 16, top: city.y - 10, color: theme.textMuted }]}
            >
              {city.name}
            </Text>
          ))}
        </View>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: {
    position: 'absolute',
    left: GUTTER,
    top: 540,
    width: 580,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  chipLabel: {
    fontFamily: fonts.cta,
    fontSize: 18,
  },
  mapWrap: {
    position: 'absolute',
    left: 880,
    top: 210,
    width: 460,
    height: 580,
  },
  city: {
    position: 'absolute',
    fontFamily: fonts.ui,
    fontSize: 15,
  },
});
