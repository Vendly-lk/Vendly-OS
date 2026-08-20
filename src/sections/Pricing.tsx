import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { useNavigation } from '../Navigation';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { PAGE_W, SectionHeading, SectionLead, styles as kit } from './kit';

/**
 * "For anyone from entrepreneurs to enterprise" on the reference site is a row
 * of tiers. This is that page — and it gives the nav's "Pricing" link somewhere
 * to go, which until now was one of two labels pointing nowhere.
 *
 * No design export and no given price list: the tiers below are placeholders
 * with plainly fake figures, structured so real ones can drop straight in.
 */

export const PRICING_HEIGHT = 1024;

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    cadence: 'first 50 checks a month',
    blurb: 'For the side hustle still packing orders at the kitchen table.',
    features: ['50 order checks', 'WhatsApp and chat orders', 'Single user'],
    featured: false,
  },
  {
    id: 'growing',
    name: 'Growing',
    price: 'LKR 2,900',
    cadence: 'per month',
    blurb: 'For the shop shipping every day and losing real money to returns.',
    features: ['Unlimited checks', 'All channels', 'Courier history', 'Three users'],
    featured: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    price: "Let's talk",
    cadence: 'custom',
    blurb: 'For teams with their own systems and their own risk rules.',
    features: ['API access', 'Custom rules', 'Priority support', 'Unlimited users'],
    featured: false,
  },
];

const CARD = { top: 400, width: 380, height: 480, gap: 32 };

export function Pricing() {
  const { theme, themeName } = useTheme();
  const onScreen = useIsSectionActive('pricing');
  const { navigate } = useNavigation();
  const dark = themeName === 'dark';

  const rowWidth = PLANS.length * CARD.width + (PLANS.length - 1) * CARD.gap;
  const rowLeft = (PAGE_W - rowWidth) / 2;

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <SectionHeading visible={onScreen} color={theme.text} top={150} width={1100} align="center">
        Start free. Pay when it pays.
      </SectionHeading>

      <SectionLead
        visible={onScreen}
        color={theme.textMuted}
        top={272}
        width={760}
        align="center"
      >
        One refused parcel costs more than a month of Vendly. Every plan checks the same history.
      </SectionLead>

      {PLANS.map((plan, index) => (
        <Reveal key={plan.id} visible={onScreen} delay={REVEAL_STAGGER * (2 + index)}>
          <PlanCard
            plan={plan}
            left={rowLeft + index * (CARD.width + CARD.gap)}
            dark={dark}
            text={theme.text}
            muted={theme.textMuted}
            onPress={() => navigate('signin')}
          />
        </Reveal>
      ))}

      <TopBar />
    </View>
  );
}

function PlanCard({
  plan,
  left,
  dark,
  text,
  muted,
  onPress,
}: {
  plan: (typeof PLANS)[number];
  left: number;
  dark: boolean;
  text: string;
  muted: string;
  onPress: () => void;
}) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const lift = useToggleAnimation(highlighted && !pressed, 160);

  const hairline = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
  const fill = plan.featured
    ? dark
      ? 'rgba(0,178,255,0.10)'
      : 'rgba(1,56,113,0.05)'
    : dark
      ? 'rgba(255,255,255,0.03)'
      : '#ffffff';

  return (
    <Animated.View
      style={[
        styles.card,
        {
          left,
          top: CARD.top,
          borderColor: plan.featured ? colors.accent : hairline,
          borderWidth: plan.featured ? 2 : 1,
          backgroundColor: fill,
          transform: [
            { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
          ],
        },
      ]}
    >
      {plan.featured ? (
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>Most sellers pick this</Text>
        </View>
      ) : null}

      <Text style={[styles.name, { color: muted }]}>{plan.name}</Text>
      <Text style={[styles.price, { color: text }]}>{plan.price}</Text>
      <Text style={[styles.cadence, { color: muted }]}>{plan.cadence}</Text>
      <Text style={[styles.blurb, { color: muted }]}>{plan.blurb}</Text>

      {plan.price === "Let's talk"
        ? null
        : plan.features.map((feature, i) => (
            <Text key={feature} style={[styles.feature, { color: text, top: 300 + i * 30 }]}>
              {feature}
            </Text>
          ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Choose the ${plan.name} plan`}
        onPress={onPress}
        {...handlers}
        style={[
          styles.cta,
          clickable,
          {
            backgroundColor: plan.featured ? colors.accent : 'transparent',
            borderColor: plan.featured ? colors.accent : hairline,
            opacity: pressed ? 0.85 : 1,
          },
          focusVisible && focusRing(colors.accent, 3),
        ]}
      >
        <Text
          style={[
            styles.ctaLabel,
            { color: plan.featured ? '#ffffff' : text },
          ]}
        >
          {plan.price === "Let's talk" ? 'Contact us' : 'Start free'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD.width,
    height: CARD.height,
    borderRadius: 28,
    paddingHorizontal: 34,
    paddingTop: 34,
  },
  tag: {
    position: 'absolute',
    right: 26,
    top: 26,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.accent,
  },
  tagLabel: {
    color: '#ffffff',
    fontFamily: fonts.ui,
    fontSize: 13,
  },
  name: {
    fontFamily: fonts.ui,
    fontSize: 17,
  },
  price: {
    marginTop: 14,
    fontFamily: fonts.display,
    fontSize: 46,
    lineHeight: 56,
  },
  cadence: {
    marginTop: 2,
    fontFamily: fonts.cta,
    fontSize: 16,
  },
  blurb: {
    marginTop: 20,
    fontFamily: fonts.cta,
    fontSize: 17,
    lineHeight: 26,
  },
  feature: {
    position: 'absolute',
    left: 34,
    fontFamily: fonts.cta,
    fontSize: 17,
  },
  cta: {
    position: 'absolute',
    left: 34,
    right: 34,
    bottom: 34,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: fonts.cta,
    fontSize: 18,
  },
});
