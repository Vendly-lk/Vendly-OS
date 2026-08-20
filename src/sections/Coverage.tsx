import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { useTheme } from '../ThemeContext';
import { SriLankaMap } from '../components/SriLankaMap';
import { fonts } from '../theme';
import { GUTTER, SectionHeading, SectionLead, styles as kit } from './kit';

/**
 * "Every district, every courier" — the reference site's rotating globe, scoped
 * to the one island this product actually operates on.
 *
 * The map itself is `SriLankaMap`: a lit, extruded relief of the real coastline
 * on web, and the same coastline drawn flat on native. Both read the same
 * geography, so they cannot drift apart.
 */

export const COVERAGE_HEIGHT = 1024;

const COURIERS = ['Koombiyo', 'PromptXpress', 'Domex', 'Aramex', 'DHL', 'SL Post'];

const MAP = { left: 720, top: 150, width: 640, height: 740 };

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
        <View style={styles.mapWrap}>
          <SriLankaMap width={MAP.width} height={MAP.height} />
        </View>
      </Reveal>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 4}>
        <Text style={[styles.credit, { color: theme.textMuted }]}>
          Coastline: geoBoundaries / OpenStreetMap (ODbL 1.0)
        </Text>
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
    left: MAP.left,
    top: MAP.top,
    width: MAP.width,
    height: MAP.height,
  },
  credit: {
    position: 'absolute',
    left: MAP.left,
    top: MAP.top + MAP.height + 14,
    fontFamily: fonts.ui,
    fontSize: 13,
  },
});
