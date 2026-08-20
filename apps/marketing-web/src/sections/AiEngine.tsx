import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { fonts } from '../theme';
import { GUTTER, styles as kit } from './kit';

/**
 * "Hyperdriven by AI" in the reference site is a full-bleed coloured band that
 * breaks the page's light/dark rhythm. This is the equivalent: the scoring
 * engine on its own ground, which stays the same in both themes on purpose —
 * the break is the point.
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

  return (
    <View style={kit.section}>
      <LinearGradient
        colors={['#0b1f4d', '#141048', '#2a0f5c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Reveal visible={onScreen}>
        <Text accessibilityRole="header" style={styles.heading}>
          Scored before it ships.
        </Text>
      </Reveal>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER}>
        <Text style={styles.lead}>
          Every order is read against the buyer own history — not a blocklist someone else wrote.
          The signals that actually cost Sri Lankan sellers money, weighted the way they actually
          behave.
        </Text>
      </Reveal>

      {SIGNALS.map((signal, index) => (
        <Reveal key={signal.label} visible={onScreen} delay={REVEAL_STAGGER * (2 + index * 0.6)}>
          <View style={[styles.chip, { top: 540 + index * 74 }]}>
            <View style={styles.dot}>
              <Svg width={12} height={12} viewBox="0 0 12 12">
                <Circle cx={6} cy={6} r={5} fill="#00e0ff" />
              </Svg>
            </View>
            <Text style={styles.chipLabel}>{signal.label}</Text>
            <Text style={styles.chipWeight}>{signal.weight}</Text>
          </View>
        </Reveal>
      ))}

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 3}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreCaption}>Order #4821</Text>
          <Text style={styles.score}>72</Text>
          <Text style={styles.scoreVerdict}>Ask for prepayment</Text>
          <View style={styles.meterTrack}>
            <LinearGradient
              colors={['#00e0ff', '#7b5cff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.meterFill}
            />
          </View>
          <Text style={styles.scoreNote}>
            3 refused deliveries in 90 days, 2 with the same courier.
          </Text>
        </View>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    position: 'absolute',
    left: GUTTER,
    top: 190,
    width: 900,
    color: '#ffffff',
    fontFamily: fonts.display,
    fontSize: 70,
    lineHeight: 84,
  },
  lead: {
    position: 'absolute',
    left: GUTTER,
    top: 320,
    width: 640,
    color: 'rgba(255,255,255,0.72)',
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
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  dot: {
    marginRight: 14,
  },
  chipLabel: {
    flex: 1,
    color: '#ffffff',
    fontFamily: fonts.cta,
    fontSize: 19,
  },
  chipWeight: {
    color: 'rgba(255,255,255,0.6)',
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
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(6,10,32,0.6)',
    padding: 38,
  },
  scoreCaption: {
    color: 'rgba(255,255,255,0.55)',
    fontFamily: fonts.ui,
    fontSize: 15,
  },
  score: {
    marginTop: 18,
    color: '#ffffff',
    fontFamily: fonts.display,
    fontSize: 128,
    lineHeight: 138,
  },
  scoreVerdict: {
    color: '#00e0ff',
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 36,
  },
  meterTrack: {
    marginTop: 26,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  meterFill: {
    width: '72%',
    height: 10,
    borderRadius: 5,
  },
  scoreNote: {
    marginTop: 22,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fonts.cta,
    fontSize: 17,
    lineHeight: 26,
  },
});
