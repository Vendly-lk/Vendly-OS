import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { GUTTER, PAGE_W, SectionHeading, styles as kit } from './kit';

/**
 * The proof band: a headline over a row of oversized figures, as the reference
 * site does with its checkout stats.
 *
 * The numbers are the ones the site already puts in its customers' mouths in
 * the testimonials, so this page is not inventing new claims — but they are
 * quotes, not audited figures, and are attributed as such underneath.
 */

export const STATS_HEIGHT = 1024;

const FIGURES = [
  { value: '45k', unit: '', label: 'businesses already checking orders through Vendly' },
  { value: '25', unit: '%', label: 'more completed sales after cleaning up checkout' },
  { value: '45,000', unit: 'LKR', label: 'courier return fees saved in a first month' },
];

export function Stats() {
  const { theme, themeName } = useTheme();
  const onScreen = useIsSectionActive('stats');
  const dark = themeName === 'dark';
  const rule = dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)';
  const colW = (PAGE_W - GUTTER * 2) / 3;

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <SectionHeading visible={onScreen} color={theme.text} top={190} width={1000}>
        There is no cheaper parcel{'\n'}than the one you never sent.
      </SectionHeading>

      {FIGURES.map((figure, index) => (
        <Reveal key={figure.label} visible={onScreen} delay={REVEAL_STAGGER * (2 + index)}>
          <View style={[styles.col, { left: GUTTER + index * colW, width: colW }]}>
            <View style={[styles.rule, { backgroundColor: rule, width: colW - 60 }]} />
            <Text style={[styles.value, { color: theme.text }]}>
              {figure.unit === 'LKR' ? <Text style={styles.unitLead}>LKR </Text> : null}
              {figure.value}
              {figure.unit && figure.unit !== 'LKR' ? (
                <Text style={{ color: colors.accent }}>{figure.unit}</Text>
              ) : null}
            </Text>
            <Text style={[styles.label, { color: theme.textMuted }]}>{figure.label}</Text>
          </View>
        </Reveal>
      ))}

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 5}>
        <Text style={[styles.source, { color: theme.textMuted }]}>
          Figures reported by Vendly sellers, as quoted on this page.
        </Text>
      </Reveal>

      <TopBar />
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    position: 'absolute',
    top: 470,
  },
  rule: {
    height: 2,
    marginBottom: 34,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 96,
    lineHeight: 108,
  },
  unitLead: {
    fontSize: 44,
    lineHeight: 108,
  },
  label: {
    marginTop: 18,
    width: 330,
    fontFamily: fonts.cta,
    fontSize: 19,
    lineHeight: 28,
  },
  source: {
    position: 'absolute',
    left: GUTTER,
    top: 866,
    fontFamily: fonts.cta,
    fontSize: 16,
  },
});
