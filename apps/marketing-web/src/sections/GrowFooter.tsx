import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { TopBar } from '../components/TopBar';
import { useTheme } from '../ThemeContext';
import { colors, fonts } from '../theme';

/**
 * The closing call-to-action and site footer, authored on a taller 1440 x 1440
 * artboard: the "Grow your customers, Grow your Business." headline over the 3D
 * crowd, an email capture, three link columns and the legal bar.
 */

export const FOOTER_HEIGHT = 1440;

const LINK_COLUMNS = [
  { center: 397, links: ['what is Vendly.lk', 'News Room', 'Partners'] },
  { center: 734, links: ['Compare Vendly', 'Guides'] },
  { center: 1049, links: ['Help Center', 'Service Status'] },
];

const LEGAL = [
  { label: 'Terms of Services', left: 196 },
  { label: 'Legal', left: 420 },
  { label: 'Privacy Policy', left: 521 },
  { label: 'Sitemap', left: 706 },
  { label: 'Your Privacy Choices', left: 834 },
];

export function GrowFooter() {
  const { theme } = useTheme();

  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Image
        source={require('../../assets/site/footer-crowd.jpg')}
        style={styles.crowd}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessibilityLabel="A crowd of stylised 3D characters"
      />

      <View style={[styles.trustedPill, { borderColor: theme.text }]}>
        <Text style={[styles.trustedLabel, { color: theme.text }]}>Trusted by 45k Business</Text>
      </View>

      <Text accessibilityRole="header" style={[styles.headline, { color: theme.text }]}>
        Grow your <Text style={{ color: colors.highlightNavy }}>customers,</Text>
      </Text>
      <Text style={[styles.headline, styles.headlineSecond, { color: theme.text }]}>
        Grow your Business.
      </Text>

      <View style={[styles.capture, { borderColor: theme.text }]}>
        <TextInput
          placeholder="Enter your email address"
          placeholderTextColor={theme.textMuted}
          style={[styles.captureInput, { color: theme.text }]}
          inputMode="email"
          autoCapitalize="none"
        />
        <Pressable accessibilityRole="button" style={styles.submit}>
          <Text style={styles.submitLabel}>Submit</Text>
        </Pressable>
      </View>

      <View style={styles.footerPlate} />

      <Image
        source={require('../../assets/vendly-logo.png')}
        style={styles.footerMark}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.footerWordmark}>
        endly.
        <Text style={{ color: colors.accent }}>lk</Text>
      </Text>

      {LINK_COLUMNS.map(column => (
        <View key={column.center} style={[styles.linkColumn, { left: column.center - 120 }]}>
          {column.links.map(link => (
            <Pressable key={link} accessibilityRole="link" style={styles.linkHit}>
              <Text style={styles.linkLabel}>{link}</Text>
            </Pressable>
          ))}
        </View>
      ))}

      <View style={styles.flag}>
        <Svg width={76} height={38} viewBox="0 0 76 38">
          <Rect x={0} y={0} width={76} height={38} fill="#ffb700" rx={2} />
          <Rect x={4} y={4} width={18} height={30} fill="#00534e" />
          <Rect x={24} y={4} width={12} height={30} fill="#eb7400" />
          <Rect x={38} y={4} width={34} height={30} fill="#8d153a" />
        </Svg>
      </View>
      <Text style={styles.localeLabel}>l Sin</Text>

      {LEGAL.map(item => (
        <Pressable key={item.label} accessibilityRole="link" style={[styles.legalHit, { left: item.left }]}>
          <Text style={styles.legalLabel}>{item.label}</Text>
        </Pressable>
      ))}

      <View style={styles.social}>
        <SocialIcon name="facebook" />
        <SocialIcon name="x" />
        <SocialIcon name="youtube" />
        <SocialIcon name="instagram" />
      </View>

      <TopBar showToggle={false} />
    </View>
  );
}

function SocialIcon({ name }: { name: 'facebook' | 'x' | 'youtube' | 'instagram' }) {
  const glyph = {
    facebook: (
      <>
        <Circle cx={12} cy={12} r={12} fill="#1877f2" />
        <Path
          d="M15.4 12.4h-2.2V20h-3.2v-7.6H8.4V9.7h1.6V8.2c0-2 .9-3.2 3.2-3.2h2v2.7h-1.2c-.9 0-1 .3-1 .9v1.1h2.2l-.8 2.7Z"
          fill="#ffffff"
        />
      </>
    ),
    x: (
      <>
        <Circle cx={12} cy={12} r={12} fill="#000000" />
        <Path
          d="M6 6h3.3l3 4.2L15.9 6H18l-4.6 5.6L18.4 18H15l-3.2-4.4L8.1 18H6l4.9-6L6 6Z"
          fill="#ffffff"
        />
      </>
    ),
    youtube: (
      <>
        <Circle cx={12} cy={12} r={12} fill="#ff0000" />
        <Path d="M10 8.5 16 12l-6 3.5v-7Z" fill="#ffffff" />
      </>
    ),
    instagram: (
      <>
        <Circle cx={12} cy={12} r={12} fill="#c13584" />
        <Rect x={6} y={6} width={12} height={12} rx={4} fill="none" stroke="#ffffff" strokeWidth={1.8} />
        <Circle cx={12} cy={12} r={3} fill="none" stroke="#ffffff" strokeWidth={1.8} />
        <Circle cx={15.6} cy={8.4} r={1} fill="#ffffff" />
      </>
    ),
  }[name];

  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" accessibilityLabel={name}>
      {glyph}
    </Svg>
  );
}

const styles = StyleSheet.create({
  section: {
    width: 1440,
    height: FOOTER_HEIGHT,
    overflow: 'hidden',
  },
  crowd: {
    position: 'absolute',
    left: -240,
    top: 625,
    width: 1920,
    height: 957,
  },

  trustedPill: {
    position: 'absolute',
    left: 598,
    top: 319,
    width: 244,
    height: 45,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustedLabel: {
    fontFamily: fonts.login,
    fontSize: 20,
  },

  headline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 369,
    textAlign: 'center',
    fontFamily: fonts.login,
    fontSize: 70,
    lineHeight: 88,
  },
  headlineSecond: {
    top: 457,
  },

  capture: {
    position: 'absolute',
    left: 460,
    top: 576,
    width: 520,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 34,
    paddingRight: 10,
  },
  captureInput: {
    flex: 1,
    fontFamily: fonts.login,
    fontSize: 16,
  },
  submit: {
    width: 127,
    height: 47,
    borderRadius: 24,
    backgroundColor: colors.submitBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    color: '#ffffff',
    fontFamily: fonts.login,
    fontSize: 20,
  },

  /** Translucent plate the footer links and legal bar sit on. */
  footerPlate: {
    position: 'absolute',
    left: 0,
    top: 1210,
    width: 1440,
    height: 230,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  footerMark: {
    position: 'absolute',
    left: -27.3,
    top: 1230,
    width: 118,
    height: 177,
  },
  footerWordmark: {
    position: 'absolute',
    left: 62,
    top: 1265,
    color: '#ffffff',
    fontFamily: fonts.wordmark,
    fontSize: 22,
  },

  linkColumn: {
    position: 'absolute',
    top: 1244,
    width: 240,
    alignItems: 'center',
    gap: 12,
  },
  linkHit: {
    paddingVertical: 2,
  },
  linkLabel: {
    color: '#ffffff',
    fontFamily: fonts.uiBold,
    fontSize: 15,
  },

  flag: {
    position: 'absolute',
    left: 11,
    top: 1391,
  },
  localeLabel: {
    position: 'absolute',
    left: 101,
    top: 1395,
    color: '#ffffff',
    fontFamily: fonts.uiBold,
    fontSize: 20,
  },

  legalHit: {
    position: 'absolute',
    top: 1397,
  },
  legalLabel: {
    color: '#ffffff',
    fontFamily: fonts.uiBold,
    fontSize: 20,
  },

  social: {
    position: 'absolute',
    left: 1276,
    top: 1399,
    flexDirection: 'row',
    gap: 20,
  },
});
