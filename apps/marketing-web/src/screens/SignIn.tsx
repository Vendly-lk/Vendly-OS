import React, { useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { clickable, focusRing, useInteraction, useToggleAnimation } from '../interaction';
import { colors, fonts } from '../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

          <SignInForm />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Or Sign In With</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialButton label="Sign in with Google">
              <GoogleIcon />
            </SocialButton>
            <SocialButton label="Sign in with Apple">
              <AppleIcon />
            </SocialButton>
            <SocialButton label="Sign in with Facebook">
              <FacebookIcon />
            </SocialButton>
          </View>

          <View style={styles.footnote}>
            <Text style={styles.footnoteText}>Already have a Vendly account? </Text>
            <FootnoteLink />
          </View>
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
  value: string;
  onChangeText: (next: string) => void;
  error?: string | null;
  secureTextEntry?: boolean;
  inputMode?: 'email';
  autoComplete?: 'email' | 'current-password';
  textContentType?: 'emailAddress' | 'password';
  returnKeyType?: 'next' | 'go';
  onSubmitEditing?: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  trailing?: React.ReactNode;
};

/**
 * The design labels its fields with placeholder text only, which disappears the
 * moment anyone types — leaving a filled form with unlabelled boxes. The label
 * here starts as that placeholder and floats up into the top of the field once
 * it is focused or filled, so the resting state matches the design exactly while
 * a filled field still says what it holds.
 */
function Field({
  label,
  top,
  value,
  onChangeText,
  error,
  secureTextEntry,
  inputMode,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  inputRef,
  trailing,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const floated = useToggleAnimation(focused || value.length > 0, 150);

  return (
    <View style={[styles.fieldWrap, { top }]}>
      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldInvalid,
        ]}
      >
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.fieldLabel,
            {
              top: floated.interpolate({ inputRange: [0, 1], outputRange: [27, 8] }),
              fontSize: floated.interpolate({ inputRange: [0, 1], outputRange: [20, 13] }),
              color: error ? '#b42318' : focused ? colors.signInNavy : '#6d6d6d',
            },
          ]}
        >
          {label}
        </Animated.Text>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.fieldInput}
          secureTextEntry={secureTextEntry}
          inputMode={inputMode}
          keyboardType={inputMode === 'email' ? 'email-address' : undefined}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          accessibilityLabel={label}
          aria-invalid={!!error}
        />

        {trailing}
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.fieldError}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

type Errors = { email?: string; password?: string };

/**
 * Validation runs on submit rather than on every keystroke, so the form does not
 * scold anyone mid-way through typing their address.
 */
function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const button = useInteraction();
  const eye = useInteraction();

  const onSubmit = () => {
    const next: Errors = {};
    if (!email.trim()) next.email = 'Enter your email address.';
    else if (!EMAIL.test(email.trim())) next.email = 'That does not look like an email address.';
    if (!password) next.password = 'Enter your password.';

    setErrors(next);
    setStatus(null);

    if (next.email) {
      emailRef.current?.focus();
      return;
    }
    if (next.password) {
      passwordRef.current?.focus();
      return;
    }
    setStatus('Sign-in is not connected to a backend yet.');
  };

  return (
    <>
      <Field
        label="Email Address"
        top={299}
        value={email}
        onChangeText={next => {
          setEmail(next);
          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        inputMode="email"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        inputRef={emailRef}
      />

      <Field
        label="Password"
        top={397}
        value={password}
        onChangeText={next => {
          setPassword(next);
          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
        secureTextEntry={!reveal}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        inputRef={passwordRef}
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
            accessibilityState={{ checked: reveal }}
            onPress={() => setReveal(v => !v)}
            {...eye.handlers}
            style={[styles.reveal, clickable, eye.focusVisible && focusRing(colors.signInNavy, 2)]}
          >
            <Text style={[styles.revealLabel, eye.highlighted && styles.revealLabelActive]}>
              {reveal ? 'Hide' : 'Show'}
            </Text>
          </Pressable>
        }
      />

      <Pressable
        accessibilityRole="button"
        onPress={onSubmit}
        {...button.handlers}
        style={[
          styles.signIn,
          clickable,
          button.highlighted && styles.signInHover,
          button.pressed && styles.signInPressed,
          button.focusVisible && focusRing(colors.accent, 3),
        ]}
      >
        <Text style={styles.signInLabel}>SIGN IN</Text>
      </Pressable>

      {status ? (
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {status}
        </Text>
      ) : null}
    </>
  );
}

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  const { pressed, focusVisible, highlighted, handlers } = useInteraction();
  const lift = useToggleAnimation(highlighted && !pressed, 150);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      {...handlers}
      style={[styles.socialHit, clickable, focusVisible && focusRing(colors.signInNavy, 3)]}
    >
      <Animated.View
        style={{
          opacity: pressed ? 0.75 : 1,
          transform: [
            { translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
          ],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

function FootnoteLink() {
  const { hovered, focusVisible, handlers } = useInteraction();

  return (
    <Pressable
      accessibilityRole="link"
      {...handlers}
      style={[clickable, focusVisible && focusRing(colors.signInNavy, 2)]}
    >
      <Text style={[styles.footnoteLink, hovered && styles.footnoteLinkHover]}>Log in</Text>
    </Pressable>
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

  fieldWrap: {
    position: 'absolute',
    left: 126,
    width: 555,
  },
  field: {
    width: '100%',
    height: 78,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    paddingBottom: 12,
  },
  fieldFocused: {
    borderWidth: 2,
    borderColor: colors.signInNavy,
  },
  fieldInvalid: {
    borderWidth: 2,
    borderColor: '#b42318',
  },
  fieldLabel: {
    position: 'absolute',
    left: 23,
    fontFamily: fonts.ui,
  },
  fieldInput: {
    fontFamily: fonts.ui,
    fontSize: 20,
    color: '#000000',
    paddingRight: 64,
  },
  fieldError: {
    marginTop: 6,
    fontFamily: fonts.ui,
    fontSize: 15,
    color: '#b42318',
  },
  reveal: {
    position: 'absolute',
    right: 14,
    top: 24,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  revealLabel: {
    fontFamily: fonts.ui,
    fontSize: 16,
    color: '#4a4a4a',
  },
  revealLabelActive: {
    color: colors.signInNavy,
    textDecorationLine: 'underline',
  },
  status: {
    position: 'absolute',
    left: 207,
    top: 616,
    width: 393,
    textAlign: 'center',
    fontFamily: fonts.ui,
    fontSize: 15,
    color: colors.signInNavy,
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
  signInHover: {
    backgroundColor: '#02509c',
  },
  signInPressed: {
    opacity: 0.9,
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
    top: 668 - 8,
    width: 393,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 68 - 16,
  },
  socialHit: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footnote: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 757,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
  footnoteText: {
    fontFamily: fonts.ui,
    fontSize: 20,
    color: '#3d3d3d',
  },
  footnoteLink: {
    fontFamily: fonts.ui,
    fontSize: 20,
    color: '#3d3d3d',
    textDecorationLine: 'underline',
  },
  footnoteLinkHover: {
    color: colors.signInNavy,
  },
});
