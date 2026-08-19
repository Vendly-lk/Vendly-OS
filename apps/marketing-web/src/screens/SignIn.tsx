import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { colors, fonts } from '../theme';

/**
 * The sign-in screen: a form panel beside a starry gradient panel.
 *
 * Sits on its own slate ground rather than the marketing pages' themed one, and
 * carries no top nav, so it is reached as a separate route rather than as a
 * section of the scrolling page.
 */

export const SIGNIN_HEIGHT = 1024;

const CARD = { left: 89, top: 104, width: 1258, height: 817 };
const FORM_WIDTH = 782;

/** Doodle positions on the gradient panel, in panel-local coordinates. */
const STARS = [
  [52, 74], [105, 158], [178, 30], [237, 108], [289, 232], [316, 63],
  [190, 152], [126, 268], [284, 336], [437, 30], [389, 106], [133, 334],
];
const COMETS = [[128, 92], [360, 165], [378, 22]];
const PLANETS = [[240, 24], [62, 268]];

export function SignIn() {
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <View style={styles.formPanel}>
          <Image
            source={require('../../assets/site/vendly-mark.jpg')}
            style={styles.mark}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.wordmark}>
            endly.<Text style={{ color: colors.accent }}>lk</Text>
          </Text>

          <Field label="Email Address" top={299} inputMode="email" />
          <Field label="Password" top={397} secureTextEntry />

          <Pressable accessibilityRole="button" style={styles.signIn}>
            <Text style={styles.signInLabel}>SIGN IN</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Or Sign In With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Sign in with Google">
              <GoogleIcon />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Sign in with Apple">
              <AppleIcon />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Sign in with Facebook">
              <FacebookIcon />
            </Pressable>
          </View>

          <Text style={styles.footnote}>
            Already have a Vendly account?{' '}
            <Text style={styles.footnoteLink}>Log in</Text>
          </Text>
        </View>

        <LinearGradient
          colors={['#012f52', '#0079c8', '#00a8ff']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.artPanel}
        >
          <Svg width={476} height={817} viewBox="0 0 476 817">
            {STARS.map(([x, y]) => (
              <Path
                key={`s${x}-${y}`}
                d={starPath(x, y, 9, 4)}
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.6}
                strokeLinejoin="round"
              />
            ))}
            {COMETS.map(([x, y]) => (
              <React.Fragment key={`c${x}-${y}`}>
                <Circle cx={x} cy={y} r={7} fill="none" stroke="#ffffff" strokeWidth={1.6} />
                <Circle cx={x - 2} cy={y - 2} r={1.4} fill="#ffffff" />
                {[0, 5, 10].map(o => (
                  <Path
                    key={o}
                    d={`M${x - 10 - o} ${y - 8 + o}L${x - 20 - o} ${y - 14 + o}`}
                    stroke="#ffffff"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                  />
                ))}
              </React.Fragment>
            ))}
            {PLANETS.map(([x, y]) => (
              <React.Fragment key={`p${x}-${y}`}>
                <Circle cx={x} cy={y} r={8} fill="none" stroke="#ffffff" strokeWidth={1.6} />
                <Ellipse
                  cx={x}
                  cy={y}
                  rx={15}
                  ry={5}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.6}
                  transform={`rotate(-20 ${x} ${y})`}
                />
              </React.Fragment>
            ))}
          </Svg>
        </LinearGradient>
      </View>
    </View>
  );
}

function starPath(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

type FieldProps = {
  label: string;
  top: number;
  secureTextEntry?: boolean;
  inputMode?: 'email';
};

function Field({ label, top, secureTextEntry, inputMode }: FieldProps) {
  return (
    <View style={[styles.field, { top }]}>
      <TextInput
        placeholder={label}
        placeholderTextColor="#6d6d6d"
        style={styles.fieldInput}
        secureTextEntry={secureTextEntry}
        inputMode={inputMode}
        autoCapitalize="none"
        accessibilityLabel={label}
      />
    </View>
  );
}

function GoogleIcon() {
  return (
    <Svg width={44} height={44} viewBox="0 0 48 48">
      <Path fill="#ffc107" d="M43.6 20H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-4Z" />
      <Path fill="#ff3d00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
      <Path fill="#4caf50" d="M24 44c5.2 0 9.8-2 13.3-5.2l-6.2-5.2C29.1 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
      <Path fill="#1976d2" d="M43.6 20H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.7-.4-4Z" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={40} height={46} viewBox="0 0 24 28">
      <Path
        fill="#000000"
        d="M17.5 14.9c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.3 1-4.1 1-.9 0-2.2-1-3.6-1-1.8 0-3.5 1.1-4.5 2.7-1.9 3.3-.5 8.3 1.4 11 .9 1.3 2 2.8 3.4 2.8 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.6.9 2.4-1.3 3.3-2.7c1-1.5 1.5-3 1.5-3.1-.1 0-2.9-1.1-2.9-4.5ZM14.8 6.9c.8-.9 1.3-2.2 1.1-3.5-1.1.1-2.5.8-3.3 1.7-.7.8-1.3 2.1-1.2 3.4 1.3.1 2.6-.6 3.4-1.6Z"
      />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Svg width={50} height={50} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={12} fill="#1877f2" />
      <Path
        d="M15.4 12.4h-2.2V20h-3.2v-7.6H8.4V9.7h1.6V8.2c0-2 .9-3.2 3.2-3.2h2v2.7h-1.2c-.9 0-1 .3-1 .9v1.1h2.2l-.8 2.7Z"
        fill="#ffffff"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    width: 1440,
    height: SIGNIN_HEIGHT,
    backgroundColor: '#a2aeb8',
    overflow: 'hidden',
  },
  card: {
    position: 'absolute',
    left: CARD.left,
    top: CARD.top,
    width: CARD.width,
    height: CARD.height,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  formPanel: {
    width: FORM_WIDTH,
    height: CARD.height,
    backgroundColor: '#d9d9d9',
  },
  artPanel: {
    flex: 1,
    height: CARD.height,
  },

  mark: {
    position: 'absolute',
    left: 243,
    top: 4,
    width: 259,
    height: 388.5,
  },
  wordmark: {
    position: 'absolute',
    left: 416,
    top: 288,
    color: '#ffffff',
    fontFamily: fonts.wordmark,
    fontSize: 40,
  },

  field: {
    position: 'absolute',
    left: 126,
    width: 555,
    height: 78,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  fieldInput: {
    fontFamily: fonts.ui,
    fontSize: 20,
    color: '#000000',
  },

  signIn: {
    position: 'absolute',
    left: 207,
    top: 553,
    width: 393,
    height: 59,
    backgroundColor: colors.signInNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInLabel: {
    color: '#ffffff',
    fontFamily: fonts.ui,
    fontSize: 24,
    letterSpacing: 1,
  },

  dividerRow: {
    position: 'absolute',
    left: 207,
    top: 630,
    width: 393,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
  },
  dividerLabel: {
    fontFamily: fonts.ui,
    fontSize: 24,
    color: '#000000',
  },

  socialRow: {
    position: 'absolute',
    left: 207,
    top: 668,
    width: 393,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 68,
  },

  footnote: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 757,
    textAlign: 'center',
    fontFamily: fonts.ui,
    fontSize: 20,
    color: '#3d3d3d',
  },
  footnoteLink: {
    color: '#3d3d3d',
    textDecorationLine: 'underline',
  },
});
