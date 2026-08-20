/**
 * Design tokens for the Vendly marketing site.
 *
 * Every screen is authored on a 1440-wide artboard, so all numbers here and in
 * the components are raw design pixels; `ScaledPage` / `ScaledFrame` map that
 * canvas onto the real viewport.
 *
 * Values are lifted from the design PDF, where text is drawn as vector glyphs —
 * so `get_drawings()` gives exact painted ink boxes and fills, not guesses.
 */

export const FRAME = {
  width: 1440,
  height: 1024,
} as const;

export type ThemeName = 'light' | 'dark';

export type Palette = {
  name: ThemeName;
  /** Hero / page ground. */
  pageBg: string;
  /** Sections authored on plain white or plain black. */
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  /** "Start For Free" pill inverts between themes. */
  ctaBg: string;
  ctaLabel: string;
  /** Outline pills ("View More", email capture). */
  hairline: string;
};

export const palettes: Record<ThemeName, Palette> = {
  light: {
    name: 'light',
    pageBg: '#e1e1e1',
    surface: '#ffffff',
    text: '#000000',
    textMuted: '#8c8b8b',
    accent: '#00b2ff',
    ctaBg: '#000000',
    ctaLabel: '#ffffff',
    hairline: '#000000',
  },
  dark: {
    name: 'dark',
    pageBg: '#000000',
    surface: '#000000',
    text: '#ffffff',
    textMuted: '#8c8b8b',
    accent: '#00b2ff',
    ctaBg: '#ffffff',
    ctaLabel: '#000000',
    hairline: '#ffffff',
  },
};

/** Colours that do not flip with the theme. */
export const colors = {
  background: '#000000',
  text: '#ffffff',
  textMuted: '#8c8b8b',
  accent: '#00b2ff',
  bullet: '#ff0000',

  gradientFrom: '#ffb4b4',
  gradientTo: '#456c4b',

  ctaBackground: '#ffffff',
  ctaBorder: 'rgba(255, 255, 255, 0.3)',
  ctaLabel: '#000000',

  scrollCueFill: '#434343',
  scrollCueBorder: '#ffffff',

  /** Category rail. */
  panelBg: '#f5f5f5',
  scrollCueRed: '#ff6262',
  submitBlue: '#1877d2',
  highlightNavy: '#013871',
  signInNavy: '#023971',
} as const;

/**
 * "TharLon" is specified for the Desktop-3 body copy but is not published on
 * Google Fonts, and the design itself renders it with an Arial-class fallback.
 * Arimo is metric-compatible with Arial, so it reproduces the design identically
 * across web, iOS and Android instead of inheriting three platform defaults.
 */
export const fonts = {
  nav: 'WendyOne_400Regular',
  login: 'VarelaRound_400Regular',
  cta: 'Outfit_400Regular',
  wordmark: 'BeVietnamPro_700Bold',
  eyebrow: 'TenaliRamakrishna_400Regular',
  heading: 'Suwannaphum_400Regular',
  body: 'Arimo_400Regular',
  ui: 'Inter_400Regular',
  uiBold: 'Inter_700Bold',
  display: 'Outfit_700Bold',
  /** The GO Back disc on the category pages. */
  splash: 'RubikWetPaint_400Regular',
} as const;

/** Line heights match what the design resolves "normal" leading to (~1.45x). */
export const type = {
  nav: { fontSize: 25, lineHeight: 30 },
  login: { fontSize: 29, lineHeight: 35 },
  cta: { fontSize: 22, lineHeight: 26 },
  wordmark: { fontSize: 20, lineHeight: 25 },
  eyebrow: { fontSize: 40, lineHeight: 58 },
  heading: { fontSize: 48, lineHeight: 70 },
  body: { fontSize: 36, lineHeight: 52 },
  bullet: { fontSize: 40, lineHeight: 58 },
} as const;

/**
 * Shared nav geometry — identical on every framed screen in the design, scaled
 * up ~25% from the original artboard export for a more prominent bar. The
 * logo/wordmark on the left and the toggle/login/CTA cluster on the right are
 * additionally pushed out to the page's true edges by `TopBar` itself (see
 * `useCanvasEdgeInset`) — these numbers are their position on the 1440 frame
 * before that edge push is added.
 */
export const NAV = {
  links: [
    { label: 'Why Vendly ?', left: 254 },
    { label: 'Pricing', left: 425 },
    { label: 'xxxxxxxxxxxx', left: 540 },
  ],
  linkTop: 36,
  loginLeft: 1110,
  ctaBox: { left: 1250, top: 12, width: 190, height: 62, radius: 62 },
  toggle: { left: 947, top: 6, width: 154, height: 72, knob: 60, knobInset: 6 },
} as const;
