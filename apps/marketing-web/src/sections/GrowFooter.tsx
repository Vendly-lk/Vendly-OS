import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { Reveal, REVEAL_STAGGER } from '../components/Reveal';
import { useIsSectionActive } from '../components/ScaledPage';
import { TopBar } from '../components/TopBar';
import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { useTheme } from '../ThemeContext';
import { fonts } from '../theme';

/**
 * The closing call-to-action and site footer, on the design's taller 1440 x 1440
 * artboard: "Grow your customers, Grow your Business." over the 3D crowd, an
 * email capture, three link columns and the legal bar.
 *
 * Built from the design's own CSS for this frame, which ships as two variants —
 * "Desktop - 7" (dark) and "Desktop - 9" (light). Where they agree the geometry
 * is shared; where they differ only in colour, the palette switches.
 *
 * They also disagree on the footer link positions, and the light variant carries
 * a literal "SL Flag l Sin" text placeholder with no logo and no social icons.
 * Rather than ship a footer that loses its logo and socials when the theme
 * flips, the dark variant's layout is used for both, recoloured for light.
 */

export const FOOTER_HEIGHT = 1440;

/** Deliberately permissive: enough to catch a typo, not to police addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CANVAS = 1440;

/** The crowd render is drawn at its own 1920 x 957 pixel size, never scaled. */
const CROWD = { width: 1920, height: 957, left: -240, top: 625 } as const;

/**
 * The two decorative rings behind the headline. Figma draws them as 790px
 * ellipses with an arc ratio of 60%, i.e. a hole at 60% of the radius — so they
 * are rings, not discs: outer r 395, inner r 237, a 158px band whose centreline
 * sits at r 316. Each theme places them differently.
 */
const RING = { size: 790, outer: 395, ratio: 0.6 } as const;
const RING_BAND = RING.outer - RING.outer * RING.ratio;
const RING_RADIUS = RING.outer - RING_BAND / 2;

const RINGS = {
  dark: [
    { left: -410, top: 141 },
    { left: 1045, top: 141 },
  ],
  light: [
    { left: -395, top: 123 },
    { left: 1045, top: 118 },
  ],
} as const;

const CAPTURE = { width: 516, height: 68, top: 578, radius: 80 } as const;
const SUBMIT = { width: 127, height: 47, left: 379, top: 10, radius: 80 } as const;

const LINK_COLUMNS = [
  {
    left: 331,
    links: [
      { label: 'what is Vendly.lk', top: 1246 },
      { label: 'News Room', top: 1280 },
      { label: 'Partners', top: 1314 },
    ],
  },
  {
    left: 673,
    links: [
      { label: 'Compare Vendly', top: 1246 },
      { label: 'Guides', top: 1280 },
    ],
  },
  {
    left: 996,
    links: [
      { label: 'Help Center', top: 1246 },
      { label: 'Service Status', top: 1280 },
    ],
  },
];

const LEGAL = [
  { label: 'Terms of Services', left: 196 },
  { label: 'Legal', left: 420 },
  { label: 'Privacy Policy', left: 521 },
  { label: 'Sitemap', left: 706 },
  { label: 'Your Privacy Choices', left: 834 },
];

type SocialName = 'facebook' | 'x' | 'youtube' | 'instagram';

const SOCIAL: { name: SocialName; left: number }[] = [
  { name: 'facebook', left: 1276 },
  { name: 'x', left: 1314 },
  { name: 'youtube', left: 1351 },
  { name: 'instagram', left: 1392 },
];

export function GrowFooter() {
  const { themeName } = useTheme();
  const onScreen = useIsSectionActive('footer');
  const dark = themeName === 'dark';

  const ink = dark ? '#ffffff' : '#000000';
  const hairline = dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  const navScrim = dark ? 'rgba(255,255,255,0.08)' : 'rgba(45,43,43,0.08)';
  const footerLink = dark ? '#ffffff' : '#686666';
  const highlight = dark ? '#026BD7' : '#013871';

  return (
    <View style={[styles.section, { backgroundColor: dark ? '#000000' : '#ffffff' }]}>
      {(dark ? RINGS.dark : RINGS.light).map((ring, index) => (
        <Ring key={ring.left} id={`ring-${index}`} left={ring.left} top={ring.top} dark={dark} />
      ))}

      <Image
        source={require('../../assets/site/footer-crowd.png')}
        style={styles.crowd}
        accessibilityIgnoresInvertColors
        accessibilityLabel="A crowd of stylised 3D characters"
      />

      <Reveal visible={onScreen}>
        <View style={[styles.trustedPill, { borderColor: hairline }]}>
          <Text style={[styles.trustedLabel, { color: ink }]}>Trusted by 45k Business</Text>
        </View>
      </Reveal>

      <Text accessibilityRole="header" style={[styles.headline, { color: ink }]}>
        Grow your <Text style={{ color: highlight }}>customers,</Text>
        {'\n'}Grow your Business.
      </Text>

      <Reveal visible={onScreen} delay={REVEAL_STAGGER * 2}>
        <EmailCapture ink={ink} hairline={hairline} dark={dark} />
      </Reveal>

      <LinearGradient
        colors={
          dark
            ? ['rgba(255,255,255,0.3)', 'rgba(201,192,192,0.222)', 'rgba(4,4,4,0.3)']
            : ['rgba(55,53,53,0.45)', 'rgba(55,53,53,0.45)']
        }
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.footerPlate}
      />

      <Image
        source={require('../../assets/vendly-logo.png')}
        style={styles.footerMark}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
      <Text style={styles.footerWordmark} accessibilityLabel="Vendly.lk">
        endly.<Text style={{ color: '#00b2ff' }}>lk</Text>
      </Text>

      {LINK_COLUMNS.map(column =>
        column.links.map(link => (
          <FooterLink
            key={link.label}
            label={link.label}
            left={column.left}
            top={link.top}
            color={footerLink}
            size={15}
          />
        )),
      )}

      <View style={styles.flag}>
        <Svg width={76} height={38} viewBox="0 0 76 38">
          <Rect x={0} y={0} width={76} height={38} fill="#ffb700" rx={2} />
          <Rect x={4} y={4} width={18} height={30} fill="#00534e" />
          <Rect x={24} y={4} width={12} height={30} fill="#eb7400" />
          <Rect x={38} y={4} width={34} height={30} fill="#8d153a" />
        </Svg>
      </View>
      <Text style={[styles.localeLabel, { color: footerLink }]}>l Sin</Text>
      <View style={styles.localeChevron} pointerEvents="none">
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path
            d="M7 10l5 5 5-5"
            stroke={footerLink}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {LEGAL.map(item => (
        <FooterLink
          key={item.label}
          label={item.label}
          left={item.left}
          top={1396}
          color={footerLink}
          size={20}
        />
      ))}

      {SOCIAL.map(item => (
        <SocialButton key={item.name} name={item.name} left={item.left} />
      ))}

      <View style={[styles.navScrim, { backgroundColor: navScrim }]} pointerEvents="none" />
      <TopBar showToggle={false} />
    </View>
  );
}

/**
 * Drawn as a stroked circle rather than a filled one: the stroke *is* the band,
 * so the hole comes out exactly at the design's 60% ratio. The gradient is
 * pinned in user space so it spans the full 790px height regardless of how the
 * renderer measures a stroked bounding box.
 */
function Ring({
  id,
  left,
  top,
  dark,
}: {
  id: string;
  left: number;
  top: number;
  dark: boolean;
}) {
  const from = dark ? '#ffffff' : '#070606';
  const to = dark ? '#000000' : '#ffffff';

  return (
    <Svg
      width={RING.size}
      height={RING.size}
      style={[styles.ring, { left, top }]}
      pointerEvents="none"
    >
      <Defs>
        <SvgGradient id={id} x1={0} y1={0} x2={0} y2={RING.size} gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={from} stopOpacity={0.12} />
          <Stop offset="1" stopColor={to} stopOpacity={0.12} />
        </SvgGradient>
      </Defs>
      <Circle
        cx={RING.outer}
        cy={RING.outer}
        r={RING_RADIUS}
        stroke={`url(#${id})`}
        strokeWidth={RING_BAND}
        fill="none"
      />
    </Svg>
  );
}

/**
 * The design draws the field and the Submit button but has nothing behind them;
 * this gives them the behaviour the shape promises — validation on submit, an
 * inline error, and a confirmation that replaces the form rather than leaving
 * the reader guessing whether it worked.
 */
function EmailCapture({ ink, hairline, dark }: { ink: string; hairline: string; dark: boolean }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState(false);
  const submit = useInteraction();
  const inputRef = useRef<TextInput>(null);

  const onSubmit = () => {
    const value = email.trim();
    if (!value) {
      setError('Enter your email address to get started.');
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL.test(value)) {
      setError('That does not look like an email address.');
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setDone(true);
  };

  const shell = [
    styles.capture,
    {
      borderColor: error ? '#ff6262' : focused ? ink : hairline,
      backgroundColor: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    },
  ];

  if (done) {
    return (
      <View style={[...shell, styles.captureDone]}>
        <Text accessibilityLiveRegion="polite" style={[styles.captureDoneLabel, { color: ink }]}>
          Thanks — we will be in touch at {email.trim()}.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={shell}>
        <TextInput
          ref={inputRef}
          value={email}
          onChangeText={next => {
            setEmail(next);
            if (error) setError(null);
          }}
          onSubmitEditing={onSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Enter your email address"
          placeholderTextColor={dark ? 'rgba(255,255,255,0.6)' : 'rgba(69,69,69,0.6)'}
          style={[styles.captureInput, { color: ink }]}
          inputMode="email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="go"
          accessibilityLabel="Email address"
          aria-invalid={!!error}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onSubmit}
          {...submit.handlers}
          style={[styles.submit, clickable, submit.focusVisible && focusRing('#ffffff', -4)]}
        >
          <LinearGradient
            colors={submit.highlighted ? ['#02509c', '#0a7ee8'] : ['#013871', '#026BD7']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.submitFill, { opacity: submit.pressed ? 0.85 : 1 }]}
          />
          <Text style={styles.submitLabel}>Submit</Text>
        </Pressable>
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.captureError}>
          {error}
        </Text>
      ) : null}
    </>
  );
}

/** Footer links: underline on hover/focus, matching the nav's behaviour. */
function FooterLink({
  label,
  left,
  top,
  color,
  size,
}: {
  label: string;
  left: number;
  top: number;
  color: string;
  size: number;
}) {
  const { hovered, pressed, focusVisible, highlighted, handlers } = useInteraction();
  const grow = useToggleAnimation(highlighted);

  return (
    <Pressable
      accessibilityRole="link"
      {...handlers}
      style={[styles.linkHit, { left, top }, clickable, focusVisible && focusRing('#00b2ff', 2)]}
    >
      <Text
        style={[
          styles.linkLabel,
          { color, fontSize: size, lineHeight: size + 4, opacity: pressed ? 0.6 : 1 },
        ]}
      >
        {label}
      </Text>
      <Animated.View
        style={[
          styles.linkUnderline,
          {
            backgroundColor: color,
            transform: [{ scaleX: grow }],
            opacity: hovered || focusVisible ? 1 : 0,
          },
        ]}
      />
    </Pressable>
  );
}

function SocialButton({ name, left }: { name: SocialName; left: number }) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const lift = useToggleAnimation(highlighted && !pressed, 150);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Vendly on ${name}`}
      {...handlers}
      style={[styles.socialHit, { left }, clickable, focusVisible && focusRing('#00b2ff', 2)]}
    >
      <Animated.View
        style={{
          opacity: pressed ? 0.75 : 1,
          transform: [
            { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
          ],
        }}
      >
        <SocialIcon name={name} />
      </Animated.View>
    </Pressable>
  );
}

function SocialIcon({ name }: { name: SocialName }) {
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
    <Svg width={20} height={20} viewBox="0 0 24 24">
      {glyph}
    </Svg>
  );
}

const styles = StyleSheet.create({
  section: {
    width: CANVAS,
    height: FOOTER_HEIGHT,
    overflow: 'hidden',
  },

  navScrim: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: CANVAS,
    height: 100,
  },

  ring: {
    position: 'absolute',
  },

  crowd: {
    position: 'absolute',
    left: CROWD.left,
    top: CROWD.top,
    width: CROWD.width,
    height: CROWD.height,
  },

  trustedPill: {
    position: 'absolute',
    left: (CANVAS - 242) / 2,
    top: 320,
    width: 242,
    height: 43,
    borderWidth: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustedLabel: {
    fontFamily: fonts.cta,
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
  },

  headline: {
    position: 'absolute',
    left: (CANVAS - 680) / 2,
    top: 360,
    width: 680,
    fontFamily: fonts.cta,
    fontSize: 70,
    lineHeight: 88,
    textAlign: 'center',
  },

  capture: {
    position: 'absolute',
    left: (CANVAS - CAPTURE.width) / 2,
    top: CAPTURE.top,
    width: CAPTURE.width,
    height: CAPTURE.height,
    borderWidth: 2,
    borderRadius: CAPTURE.radius,
    justifyContent: 'center',
  },
  captureInput: {
    position: 'absolute',
    left: 32,
    width: SUBMIT.left - 40,
    fontFamily: fonts.cta,
    fontSize: 16,
    lineHeight: 20,
  },
  captureDone: {
    alignItems: 'center',
  },
  captureDoneLabel: {
    fontFamily: fonts.cta,
    fontSize: 18,
  },
  captureError: {
    position: 'absolute',
    left: (CANVAS - CAPTURE.width) / 2 + 32,
    top: CAPTURE.top + CAPTURE.height + 8,
    fontFamily: fonts.cta,
    fontSize: 15,
    color: '#ff6262',
  },

  submit: {
    position: 'absolute',
    left: SUBMIT.left,
    top: SUBMIT.top,
    width: SUBMIT.width,
    height: SUBMIT.height,
    borderRadius: SUBMIT.radius,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  submitFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  submitLabel: {
    fontFamily: fonts.cta,
    fontSize: 20,
    lineHeight: 25,
    color: '#ffffff',
  },

  footerPlate: {
    position: 'absolute',
    left: 0,
    top: 1210,
    width: CANVAS,
    height: 230,
  },
  footerMark: {
    position: 'absolute',
    left: -27,
    top: 1144,
    width: 176,
    height: 264,
  },
  footerWordmark: {
    position: 'absolute',
    left: 87,
    top: 1258,
    fontFamily: fonts.wordmark,
    fontSize: 24,
    color: '#ffffff',
  },

  linkHit: {
    position: 'absolute',
    paddingBottom: 2,
  },
  linkLabel: {
    fontFamily: fonts.uiBold,
  },
  linkUnderline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    borderRadius: 1,
  },

  flag: {
    position: 'absolute',
    left: 11,
    top: 1391,
  },
  localeLabel: {
    position: 'absolute',
    left: 101,
    top: 1394,
    fontFamily: fonts.uiBold,
    fontSize: 20,
    lineHeight: 24,
  },
  localeChevron: {
    position: 'absolute',
    left: 148,
    top: 1396,
  },

  socialHit: {
    position: 'absolute',
    top: 1394,
    padding: 5,
  },
});
