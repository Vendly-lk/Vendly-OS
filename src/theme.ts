/**
 * Design tokens for the Vendly marketing site.
 *
 * Values are taken from the Figma frame "Desktop - 3" (node 27:1324) and are
 * expressed in that frame's coordinate space: a 1440 x 1024 canvas. `ScaledFrame`
 * maps that canvas onto whatever viewport the app is running in, so every number
 * in this file — and in the components — is a raw Figma pixel.
 */

export const FRAME = {
  width: 1440,
  height: 1024,
} as const;

export const colors = {
  background: '#000000',
  text: '#ffffff',
  textMuted: '#8c8b8b',
  accent: '#00b2ff',
  bullet: '#ff0000',

  /** Header bar sweeps left -> right across the full frame width. */
  gradientFrom: '#ffb4b4',
  gradientTo: '#456c4b',

  ctaBackground: '#ffffff',
  ctaBorder: 'rgba(255, 255, 255, 0.3)',
  ctaLabel: '#000000',

  scrollCueFill: '#434343',
  scrollCueBorder: '#ffffff',
} as const;

/**
 * The frame specifies "TharLon" for the body copy and bullets, but that face is
 * not published on Google Fonts and Figma itself renders the design with an
 * Arial fallback. Arimo is metric-compatible with Arial, so bundling it
 * reproduces the design exactly and identically on web, iOS and Android instead
 * of inheriting three different platform defaults.
 */
export const fonts = {
  nav: 'WendyOne_400Regular',
  login: 'VarelaRound_400Regular',
  cta: 'Outfit_400Regular',
  wordmark: 'BeVietnamPro_700Bold',
  eyebrow: 'TenaliRamakrishna_400Regular',
  heading: 'Suwannaphum_400Regular',
  body: 'Arimo_400Regular',
} as const;

/**
 * Line heights are the ones the Figma render resolves "normal" leading to
 * (~1.45x), measured off the exported PNG rather than guessed.
 */
export const type = {
  nav: { fontSize: 20, lineHeight: 24 },
  login: { fontSize: 24, lineHeight: 29 },
  cta: { fontSize: 18, lineHeight: 22 },
  wordmark: { fontSize: 16, lineHeight: 20 },
  eyebrow: { fontSize: 40, lineHeight: 58 },
  heading: { fontSize: 48, lineHeight: 70 },
  body: { fontSize: 36, lineHeight: 52 },
  bullet: { fontSize: 40, lineHeight: 58 },
} as const;
