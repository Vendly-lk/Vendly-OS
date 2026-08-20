import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { GUTTER, styles as kit } from './kit';

/**
 * "Hyperdriven by AI" in the reference site is a full-bleed coloured band that
 * breaks the page's light/dark rhythm. This page instead follows the site's
 * own light/dark surface like every other section — a special one-off ground
 * here read as a mismatch with the rest of the site rather than a highlight.
 *
 * No design export for this page; the signal names are the checks the product
 * describes elsewhere on the site.
 */

export const AI_HEIGHT = 1024;

const SIGNALS = [
  { label: 'Refused deliveries', weight: 'High' },
  { label: 'Unreachable on phone', weight: 'High' },
  { label: 'Repeat returns', weight: 'Medium' },
  { label: 'Courier disputes', weight: 'Medium' },
  { label: 'New number, big cart', weight: 'Watch' },
];

export function AiEngine() {
  const onScreen = useIsSectionActive('ai');
  const { theme, themeName } = useTheme();
  const dark = themeName === 'dark';
  const hairline = dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.14)';
  const chipFill = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const cardFill = dark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  const trackFill = dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)';

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <Reveal visible={onScreen}>
        <Text accessibilityRole="header" style={[styles.heading, { color: theme.text }]}>
          Scored before it ships.
        </Text>
      </Reveal>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER}>
        <Text style={[styles.lead, { color: theme.textMuted }]}>
          Every order is read against the buyer own history — not a blocklist someone else wrote.
          The signals that actually cost Sri Lankan sellers money, weighted the way they actually
          behave.
        </Text>
      </Reveal>

      {SIGNALS.map((signal, index) => (
        <Reveal key={signal.label} visible={onScreen} delay={REVEAL_STAGGER * (2 + index * 0.6)}>
          <View
            style={[
              styles.chip,
              { top: 540 + index * 74, borderColor: hairline, backgroundColor: chipFill },
            ]}
          >
            <View style={styles.dot}>
              <Svg width={12} height={12} viewBox="0 0 12 12">
                <Circle cx={6} cy={6} r={5} fill={colors.accent} />
              </Svg>
            </View>
            <Text style={[styles.chipLabel, { color: theme.text }]}>{signal.label}</Text>
            <Text style={[styles.chipWeight, { color: theme.textMuted }]}>{signal.weight}</Text>
          </View>
        </Reveal>
      ))}

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 3}>
        <View style={[styles.scoreCard, { borderColor: hairline, backgroundColor: cardFill }]}>
          <Text style={[styles.scoreCaption, { color: theme.textMuted }]}>Order #4821</Text>
          <Text style={[styles.score, { color: theme.text }]}>72</Text>
          <Text style={[styles.scoreVerdict, { color: colors.accent }]}>Ask for prepayment</Text>
          <View style={[styles.meterTrack, { backgroundColor: trackFill }]}>
            <LinearGradient
              colors={[colors.accent, colors.highlightNavy]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.meterFill}
            />
          </View>
          <Text style={[styles.scoreNote, { color: theme.textMuted }]}>
            3 refused deliveries in 90 days, 2 with the same courier.
          </Text>
        </View>
      </Reveal>

      <TopBar />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    position: 'absolute',
    left: GUTTER,
    top: 190,
    width: 900,
    fontFamily: fonts.display,
    fontSize: 70,
    lineHeight: 84,
  },
  lead: {
    position: 'absolute',
    left: GUTTER,
    top: 320,
    width: 640,
    fontFamily: fonts.cta,
    fontSize: 22,
    lineHeight: 34,
  },
  chip: {
    position: 'absolute',
    left: GUTTER,
    width: 560,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  dot: {
    marginRight: 14,
  },
  chipLabel: {
    flex: 1,
    fontFamily: fonts.cta,
    fontSize: 19,
  },
  chipWeight: {
    fontFamily: fonts.ui,
    fontSize: 15,
  },
  scoreCard: {
    position: 'absolute',
    left: 800,
    top: 400,
    width: 520,
    height: 440,
    borderRadius: 28,
    borderWidth: 1,
    padding: 38,
  },
  scoreCaption: {
    fontFamily: fonts.ui,
    fontSize: 15,
  },
  score: {
    marginTop: 18,
    fontFamily: fonts.display,
    fontSize: 128,
    lineHeight: 138,
  },
  scoreVerdict: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 36,
  },
  meterTrack: {
    marginTop: 26,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  meterFill: {
    width: '72%',
    height: 10,
    borderRadius: 5,
  },
  scoreNote: {
    marginTop: 22,
    fontFamily: fonts.cta,
    fontSize: 17,
    lineHeight: 26,
  },
});
