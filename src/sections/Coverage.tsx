import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { SriLankaMap } from '../components/SriLankaMap';
import { clickable, focusRing, useInteraction } from '../interaction';
import { colors, fonts } from '../theme';
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

const COURIERS = [
  { name: 'Koombiyo', url: 'https://www.koombiyodelivery.lk' },
  { name: 'PromptXpress', url: 'https://promptxpress.com' },
  { name: 'Domex', url: 'https://domex.lk' },
  { name: 'Aramex', url: 'https://www.aramex.com/lk/en' },
  { name: 'DHL', url: 'https://www.dhl.com/lk-en/home.html' },
  { name: 'SL Post', url: 'https://www.slpost.gov.lk' },
];

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
            <CourierChip
              key={courier.name}
              name={courier.name}
              url={courier.url}
              borderColor={chipBorder}
              textColor={theme.text}
            />
          ))}
        </View>
      </Reveal>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 3}>
        <View style={styles.mapWrap}>
          <SriLankaMap width={MAP.width} height={MAP.height} />
        </View>
      </Reveal>

      <TopBar />
    </View>
  );
}

function CourierChip({
  name,
  url,
  borderColor,
  textColor,
}: {
  name: string;
  url: string;
  borderColor: string;
  textColor: string;
}) {
  const { hovered, focusVisible, handlers } = useInteraction();

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${name} (opens in a new tab)`}
      onPress={() => Linking.openURL(url)}
      {...handlers}
      style={[
        styles.chip,
        { borderColor: hovered ? colors.accent : borderColor },
        clickable,
        focusVisible && focusRing(colors.accent, 3),
      ]}
    >
      <Text style={[styles.chipLabel, { color: hovered ? colors.accent : textColor }]}>
        {name}
      </Text>
    </Pressable>
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
});
