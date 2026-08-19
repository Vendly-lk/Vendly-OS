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

Every screen is authored on a fixed **1440-wide** canvas. `ScaledPage`
(`src/components/ScaledPage.tsx`) scales that canvas to the viewport width and
scrolls it vertically, rather than re-flowing the composition responsively — so
every component positions itself in raw design pixels and the numbers in the
source can be read straight off the design.

Layout is refined on both `onLayout` and a `Dimensions` `change` listener, so it
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

- **Category rail** — at rest each column shows an outlined number, title and
  "View More" pill. Bringing a column forward (hover on web, tap on native)
  floods it with the category's brand colour, drops in the product photo, and
  moves the title and pill down the panel.
- **Testimonials** — the carousel dots select a slide, which drives which card is
  emphasised rather than being decorative.
- **Login / Start For Free** — route to the sign-in screen.

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

Video playback could not be confirmed here either: Chrome will not start media
in a document it is not compositing, so the element reports loaded
(`readyState: 4`), correctly boxed at `0, 304, 1280, 720`, looping and muted, but
paused. The wiring is verified; the playing is not.

Screenshots could not be captured in this environment — the browser pane does not
composite frames when it is not displayed — so verification is numeric rather
than visual. Worth an eyeball regardless.

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
