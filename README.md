# Vendly Marketing Web

A React Native + Expo implementation of the Figma frame **"Desktop - 3"** (node `27:1324`)
from [this file](https://www.figma.com/design/3RNQswrTkP3rn95JYC2Pi4/Untitled) — the black
"About us / Risk of fake orders" screen.

## Running it

```bash
npm run web
```

`npm run ios` and `npm run android` run the same screen natively.

## How the design is reproduced

The frame is a fixed **1440 × 1024** artboard. Rather than re-flow it into a responsive
layout — which would stop it being this design — `ScaledFrame` renders the artboard at its
true size and applies a single uniform scale to fit the viewport, letterboxing against the
same black the design uses as its background. Every component therefore positions itself in
raw Figma pixels, and the numbers in the source can be read straight off the frame.

| Piece | Figma node | Source |
| --- | --- | --- |
| Gradient plate, logo, nav, Login / Start For Free | `77:51`, `236:58`, `77:19`, `77:31` | `src/components/TopBar.tsx` |
| Eyebrow, heading, body copy, bullet rows | `102:238`, `154:27` | `src/components/AboutSection.tsx` |
| Bullet marks | `117:246`, `117:250` | `src/components/icons/BulletIcon.tsx` |
| Scroll chevron | `222:62` | `src/components/ScrollCue.tsx` |
| Colours, fonts, type scale | — | `src/theme.ts` |

`design/desktop-3-reference.png` is the 1440 × 1024 export of the frame, kept so future
changes can be checked against the original.

### Verification

The implementation was measured against that export rather than eyeballed. Element boxes and
glyph-ink positions were read out of the running app and compared to the pixels in the
reference: the gradient plate, logo, bullet marks, CTA pill and chevron land on their exact
Figma coordinates, and all 18 text runs match the reference's ink position vertically to the
pixel. The chevron's outer 70px disc and its 36 × 18 glyph were checked separately.

## Two deliberate deviations

**The body font.** The frame specifies *TharLon* for the body copy and bullet rows, but that
face is not published on Google Fonts, and Figma itself renders the design with an Arial-class
fallback — the reference export is not actually TharLon. This project bundles **Arimo**, which
is metric-compatible with Arial, so the design reproduces identically on web, iOS and Android
instead of inheriting three different platform defaults. Line breaks in both body paragraphs
fall exactly where they fall in the reference. Everything else uses the specified faces
(Wendy One, Varela Round, Outfit, Tenali Ramakrishna, Suwannaphum, Be Vietnam Pro).

**The CTA's side padding.** `Start For Free` is set nowrap in Figma and overflows the pill's
24px horizontal inset. Reproducing that inset as real padding wraps the label onto two lines,
so the pill keeps its 157 × 51 box and 13/11 vertical padding — which is what places the label
1px below centre, as in the design — but not the side padding.

## Notes

- Text rows are positioned individually rather than as one flowing block. In Figma the copy is
  a single text layer whose bullet rows are indented with literal spaces, with the red marks
  floating over it as a separate column; as one string, the marks and their rows would drift
  apart wherever a platform measures a space differently.
- The `top` offsets in `AboutSection` are calibrated so painted glyphs — not line boxes — land
  where the reference render puts them, since a line box sits differently inside its leading in
  each typeface.
- Only this one frame is implemented. The Figma file contains many other frames (logo studies,
  product mockups, dashboards, login screens) that are not part of this screen.
