import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { clickable, focusRing, useInteraction } from '../interaction';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { GUTTER, SectionHeading, styles as kit } from './kit';

/**
 * "Three steps to your first check" — the numbered walk-through the reference
 * site closes on, where each step is a row you can select and the selected one
 * carries the detail.
 *
 * No design export for this page; the steps are written from what the product
 * already claims elsewhere on the site.
 */

export const HOWITWORKS_HEIGHT = 1024;

const STEPS = [
  {
    n: '01',
    title: 'Connect your store',
    body: 'Point Vendly at wherever your orders land — your checkout, your chat inbox, or a plain CSV. Nothing to install on your storefront.',
  },
  {
    n: '02',
    title: 'Check the customer',
    body: 'Paste a phone number and get their whole order history back: what they kept, what they refused, and which couriers they cost you.',
  },
  {
    n: '03',
    title: 'Ship with confidence',
    body: 'Send the parcels worth sending. Ask the risky ones to prepay. Stop paying return freight on orders that were never going to land.',
  },
];

export function HowItWorks() {
  const { theme, themeName } = useTheme();
  const onScreen = useIsSectionActive('howItWorks');
  const [active, setActive] = useState(0);
  const dark = themeName === 'dark';
  const rule = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <SectionHeading visible={onScreen} color={theme.text} top={168} width={900}>
        Three steps to your{'\n'}first check.
      </SectionHeading>

      {STEPS.map((step, index) => (
        <Reveal key={step.n} visible={onScreen} delay={REVEAL_STAGGER * (2 + index)}>
          <Step
            step={step}
            top={430 + index * 148}
            selected={index === active}
            onSelect={() => setActive(index)}
            text={theme.text}
            muted={theme.textMuted}
            rule={rule}
          />
        </Reveal>
      ))}

      <TopBar />
    </View>
  );
}

function Step({
  step,
  top,
  selected,
  onSelect,
  text,
  muted,
  rule,
}: {
  step: (typeof STEPS)[number];
  top: number;
  selected: boolean;
  onSelect: () => void;
  text: string;
  muted: string;
  rule: string;
}) {
  const { hovered, focusVisible, handlers } = useInteraction();
  const lit = selected || hovered;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Step ${step.n}: ${step.title}`}
      accessibilityState={{ selected }}
      onPress={onSelect}
      {...handlers}
      style={[styles.row, { top }, clickable, focusVisible && focusRing(colors.accent, 4)]}
    >
      <View style={[styles.rule, { backgroundColor: lit ? colors.accent : rule }]} />
      <Text style={[styles.n, { color: lit ? colors.accent : muted }]}>{step.n}</Text>
      <Text style={[styles.title, { color: text, opacity: lit ? 1 : 0.65 }]}>{step.title}</Text>
      <Text style={[styles.body, { color: muted, opacity: selected ? 1 : 0 }]}>{step.body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    left: GUTTER,
    width: 1256,
    height: 132,
  },
  rule: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 1256,
    height: 2,
  },
  n: {
    position: 'absolute',
    left: 0,
    top: 30,
    fontFamily: fonts.ui,
    fontSize: 22,
  },
  title: {
    position: 'absolute',
    left: 96,
    top: 22,
    width: 460,
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 42,
  },
  body: {
    position: 'absolute',
    left: 610,
    top: 26,
    width: 646,
    fontFamily: fonts.cta,
    fontSize: 19,
    lineHeight: 29,
  },
});
