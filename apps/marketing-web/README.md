# Vendly Marketing Web

A React Native + Expo implementation of the Vendly marketing site: a single
scrolling page (hero → about → categories → testimonials → footer) plus a
sign-in screen, in both light and dark themes.

## Running it

```bash
npm run web
```

`npm run ios` and `npm run android` run the same screens natively.

## How it is built

Every screen is authored on a fixed **1440-wide** canvas, and each one is a whole
page of the design rather than a band of a longer document. `ScaledPage`
(`src/components/ScaledPage.tsx`) gives each page exactly one screenful and
scales it to *fit* — `min(vw / 1440, vh / pageHeight)` — so a whole page is
visible at once and scrolling moves between pages rather than through one.
Paging is on, so a scroll settles on a page instead of between two.

Fitting matters more than it sounds: scaling to viewport *width* blows the 1440
canvas up by a third on a 1920 display and pushes the lower half of every page —
the hero's video included — off the bottom edge.

The canvas is never re-flowed, so every component still positions itself in raw
design pixels and the numbers in the source can be read straight off the design.
The fit is refined on both `onLayout` and a `Dimensions` `change` listener, so it
re-fits on a live browser resize or device rotation and not only on first paint.

### Sections

| Section | Height | Source |
| --- | --- | --- |
| Hero — "Build Your Empire Today!" + looping video | 1024 | `src/sections/Hero.tsx` |
| About — "Risk of fake orders" | 1024 | `src/sections/About.tsx` |
| Categories — six-column rail | 1024 | `src/sections/Categories.tsx` |
| Testimonials — "What People Say About Us !" | 1024 | `src/sections/Testimonials.tsx` |
| Grow CTA + footer | 1440 | `src/sections/GrowFooter.tsx` |
| Sign in (separate route) | 1024 | `src/screens/SignIn.tsx` |

Shared: `src/components/TopBar.tsx` (nav, theme toggle, CTA), `src/theme.ts`
(palettes, fonts, type scale), `src/ThemeContext.tsx`, `src/Navigation.tsx`.

### The hero video

The hero illustration in the design is a still frame of a 10s animated sequence,
supplied separately (`assets/site/hero.mp4`, 1280 x 720 — the CDN's 9.2MB
web-encoded copy rather than the 128MB original). It plays there instead, at the
still's exact placement, muted and looping.

The still is kept underneath as the poster: it covers the video's first paint and
stands in wherever the video cannot play. Playback is skipped entirely when the
OS asks for reduced motion — a 10s loop that starts on its own is exactly what
that setting is for — and the still is shown instead.

### Theming

The design ships light and dark variants of every frame, and the nav carries a
sun/moon toggle that drives them. Both are implemented: grounds, text, the CTA
pill (which inverts), and the About gradient plate — pink-to-green on dark,
red-to-orange on light — all flip together. "Today!" picks up the accent blue on
dark exactly as the design shows.

### Interaction

Every control has hover, press and focus states, a pointer cursor on web, and a
keyboard focus ring. The ring follows `:focus-visible` semantics — it appears for
tab users and stays out of a mouse user's way — implemented in
`src/interaction.ts` by tracking the last input modality, since React Native has
no `:focus-visible` of its own. State changes are animated with `Animated`
rather than CSS transitions, which react-native-web does not accept as style
props.

- **Category rail** — at rest each column shows an outlined number, title and
  "View More" pill. Bringing a column forward (hover on web, tap on native)
  floods it with the category's brand colour, drops in the product photo, and
  moves the title and pill down the panel.
- **Testimonials** — the carousel dots select a slide, which drives which card is
  emphasised rather than being decorative.
- **Login / Start For Free** — route to the sign-in screen.
- **Scroll cues** — the chevrons at the foot of each section scroll to the next
  one. They are decoration in the design, but a downward chevron pinned to the
  bottom of a screen reads as a control, so it behaves like one.
- **"Why Vendly ?" / "Why We Build Vendly"** — scroll to the About section. The
  other two nav labels are inert on purpose: the design has no pricing screen and
  its third label is literal placeholder text (`xxxxxxxxxxxx`), so giving them
  destinations would mean inventing the site.

### Forms

Both forms were shapes without behaviour; they now work as they look:

- **Newsletter** — validates on submit, shows an inline error, and replaces
  itself with a confirmation naming the address, rather than leaving the reader
  guessing whether it worked.
- **Sign in** — validates both fields on submit (not per keystroke), moves focus
  to the first field at fault, marks it `aria-invalid`, and offers a show/hide
  password toggle. Fields carry `autoComplete` / `textContentType` so password
  managers fill them. Submitting a valid pair says plainly that sign-in is not
  connected to a backend yet, rather than silently doing nothing.
- **Field labels** — the design labels its fields with placeholder text alone,
  which vanishes as soon as anyone types, leaving a filled form of unlabelled
  boxes. The label now floats into the top of the field once it is focused or
  filled, so the resting state still matches the design while a filled field
  still says what it holds.

## Where the design came from

Two different sources, because Figma Dev Mode was not available on the account's
plan:

- **About** is the one screen taken from Figma directly (frame "Desktop - 3",
  node `27:1324`), verified against `design/desktop-3-reference.png`.
- **Everything else** comes from a 33-page PDF export of the file. Text in that
  PDF is drawn as Type 3 vector glyphs, which means the glyph outlines carry
  exact painted **ink** boxes and fills — better ground truth than measuring
  pixels or inferring from font metrics. Positions, sizes, colours, panel and
  button geometry and image placement rects were all read from there
  programmatically.

### Verification

Element boxes and glyph-ink positions were read out of the running app and
compared against those extracted targets. Every text run checked lands within
**0.5px** of the design, and the structural geometry is exact — the category
columns (number at y=382.3, title at 508), the hover state's photo placement
(`-119, 385, 485, 265`), and the sign-in card (`89, 104, 1258, 817`), fields and
button all match their design coordinates exactly.

The extraction approach also validated itself: re-deriving the already-verified
About screen from the PDF reproduced the numbers measured from Figma earlier
(nav at 254/35, copy block at 92/262.2, body at 395, outro at 899).

Verification here is numeric rather than visual: the browser pane does not
composite frames when it is not displayed, so no screenshot can be taken, and
everything driven by the rendering lifecycle is suspended — animations, smooth
scrolling, focus events and media playback all included. Worth an eyeball
regardless.

Those behaviours were instead verified by driving them directly and reading the
result. Hover transitions the toggle's ground from `#e5e5ea` to `#dcdce1`; the
scroll cues and nav jump to the right page; a keyboard-modality focus paints a
3px ring while a mouse-modality focus paints none; the newsletter and sign-in
forms produce their errors, their focus moves and their confirmations.

The page fit is checked numerically at several viewport sizes: at 1920x1030 and
1366x768 every page renders inside the viewport on both axes, the scroll extent
comes to exactly five pages, the hero video sits fully on screen, and sign-in
needs no scrolling at all.

The one thing left unproven is the hero video actually playing. It reports loaded
(`readyState: 4`), correctly boxed at `0, 304, 1280, 720`, looping and muted, but
a document that is not compositing will not start media. The wiring is verified;
the playing is not.

## Deliberate deviations

**Body font.** The About frame specifies *TharLon*, which is not published on
Google Fonts, and the design itself renders it with an Arial-class fallback.
**Arimo** is bundled instead — metric-compatible with Arial, so it reproduces the
design identically across web, iOS and Android rather than inheriting three
platform defaults. Line breaks in both body paragraphs fall exactly where the
reference puts them.

**CTA side padding.** "Start For Free" is set nowrap in the design and overflows
the pill's 24px horizontal inset; reproducing that inset as real padding wraps
the label onto two lines. The pill keeps its 157 × 51 box and 13/11 vertical
padding — which is what places the label 1px below centre — but not the sides.

**Normalised sloppiness.** The category rail staggers its resting titles and
pills by up to 7px between columns and uses six near-but-not-equal number outline
colours; both are normalised so the rail reads as one grid. Similarly, the hero's
CTA and "Why We Build Vendly" link are painted *under* the illustration in the
export and are invisible there — they are the screen's primary action, so they
are drawn above it here, at the same coordinates.

**One nav per section.** The design gives Hero, About and the footer their own
nav bar and gives Categories and Testimonials none; that is reproduced rather
than replaced with a single sticky header, since the sections' grounds differ too
much (white, black, brand colours) for one floating bar to sit on cleanly.

## Not yet built

The PDF also contains full-screen category detail pages (a brand-coloured screen
per category with the product shot and a "GO Back" control) reached from "View
More". Those are not implemented — "View More" is currently a tappable control
with no destination.
