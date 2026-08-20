import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';
import { GUTTER, PAGE_W, SectionHeading, SectionLead, styles as kit } from './kit';

/**
 * "Check every order, wherever it comes from" — the channels Sri Lankan sellers
 * actually take orders on, as a row of tiles.
 *
 * Modelled on the reference site's "Sell everywhere people shop" band, where a
 * two-tone headline sits over a row of surfaces. No design export exists for
 * this page; the copy is a first pass drawn from the product's own framing.
 */

export const CHANNELS_HEIGHT = 1024;

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', note: 'Orders from chat', tint: '#25D366' },
  { id: 'facebook', label: 'Facebook', note: 'Page & Marketplace', tint: '#1877F2' },
  { id: 'instagram', label: 'Instagram', note: 'DMs and comments', tint: '#E1306C' },
  { id: 'store', label: 'Your store', note: 'Checkout orders', tint: '#00b2ff' },
  { id: 'cod', label: 'Cash on delivery', note: 'The risky ones', tint: '#F2BD1E' },
];

const CARD = { top: 470, width: 232, height: 300, gap: 26 };

export function Channels() {
  const { theme, themeName } = useTheme();
  const onScreen = useIsSectionActive('channels');
  const dark = themeName === 'dark';
  const hairline = dark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)';
  const fill = dark ? 'rgba(255,255,255,0.04)' : '#ffffff';

  const rowWidth = CHANNELS.length * CARD.width + (CHANNELS.length - 1) * CARD.gap;
  const rowLeft = (PAGE_W - rowWidth) / 2;

  return (
    <View style={[kit.section, { backgroundColor: theme.surface }]}>
      <SectionHeading visible={onScreen} color={theme.text} top={186} width={1100}>
        Check every order,{'\n'}
        <Text style={{ color: theme.textMuted }}>wherever it came from.</Text>
      </SectionHeading>

      <SectionLead visible={onScreen} color={theme.textMuted} top={368} width={820}>
        Chat apps, social, your own checkout — Vendly reads them all the same way, so one
        customer's history follows them across every channel you sell on.
      </SectionLead>

      {CHANNELS.map((channel, index) => (
        <Reveal key={channel.id} visible={onScreen} delay={REVEAL_STAGGER * (2 + index * 0.5)}>
          <View
            style={[
              styles.card,
              {
                left: rowLeft + index * (CARD.width + CARD.gap),
                top: CARD.top,
                borderColor: hairline,
                backgroundColor: fill,
              },
            ]}
          >
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    channel.id === 'facebook' || channel.id === 'instagram'
                      ? '#ffffff'
                      : channel.tint,
                },
              ]}
            >
              {channel.id === 'facebook' ? (
                <Image
                  source={require('../../assets/social/facebook.webp')}
                  style={styles.badgeImage}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              ) : channel.id === 'instagram' ? (
                <Image
                  source={require('../../assets/social/instagram.webp')}
                  style={styles.badgeImage}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <ChannelGlyph id={channel.id} />
              )}
            </View>
            <Text style={[styles.cardLabel, { color: theme.text }]}>{channel.label}</Text>
            <Text style={[styles.cardNote, { color: theme.textMuted }]}>{channel.note}</Text>
          </View>
        </Reveal>
      ))}

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 5}>
        <Text style={[styles.footnote, { color: theme.textMuted }]}>
          One number. One history. Every channel.
        </Text>
      </Reveal>

      <TopBar />
    </View>
  );
}

function ChannelGlyph({ id }: { id: string }) {
  const white = '#ffffff';
  if (id === 'whatsapp' || id === 'facebook' || id === 'instagram') {
    return (
      <Svg width={30} height={30} viewBox="0 0 24 24">
        {id === 'whatsapp' ? (
          <Path
            d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm4.3 12.4c-.2.5-1.1 1-1.5 1-.4.1-.9.1-1.4-.1a11 11 0 0 1-5.3-4.6c-.4-.6-.7-1.4-.7-2.1 0-.8.4-1.2.6-1.4.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3-.1.5.3.6 1.4 1.9 2.6 2.4.2.1.4.1.5 0l.6-.7c.2-.2.3-.2.5-.1l1.5.7c.2.1.3.2.3.3 0 .2 0 .8-.2 1.1Z"
            fill={white}
          />
        ) : id === 'facebook' ? (
          <Path
            d="M15.4 12.4h-2.2V20h-3.2v-7.6H8.4V9.7h1.6V8.2c0-2 .9-3.2 3.2-3.2h2v2.7h-1.2c-.9 0-1 .3-1 .9v1.1h2.2l-.8 2.7Z"
            fill={white}
          />
        ) : (
          <>
            <Rect x={4} y={4} width={16} height={16} rx={5} fill="none" stroke={white} strokeWidth={1.9} />
            <Circle cx={12} cy={12} r={3.6} fill="none" stroke={white} strokeWidth={1.9} />
            <Circle cx={16.6} cy={7.4} r={1.2} fill={white} />
          </>
        )}
      </Svg>
    );
  }
  if (id === 'store') {
    return (
      <Svg width={30} height={30} viewBox="0 0 24 24">
        <Path d="M4 9h16l-1 10H5L4 9Z" fill="none" stroke={white} strokeWidth={1.9} strokeLinejoin="round" />
        <Path d="M9 9V7a3 3 0 0 1 6 0v2" fill="none" stroke={white} strokeWidth={1.9} strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg width={30} height={30} viewBox="0 0 24 24">
      <Rect x={2.5} y={6} width={19} height={12} rx={2} fill="none" stroke={white} strokeWidth={1.9} />
      <Circle cx={12} cy={12} r={2.6} fill="none" stroke={white} strokeWidth={1.9} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD.width,
    height: CARD.height,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 26,
    paddingTop: 30,
  },
  badge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeImage: {
    width: 34,
    height: 34,
  },
  cardLabel: {
    marginTop: 118,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 30,
  },
  cardNote: {
    marginTop: 8,
    fontFamily: fonts.cta,
    fontSize: 17,
    lineHeight: 24,
  },
  footnote: {
    position: 'absolute',
    left: GUTTER,
    top: 840,
    fontFamily: fonts.cta,
    fontSize: 20,
  },
});
