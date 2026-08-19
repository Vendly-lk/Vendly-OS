# Vendly Marketing Web

A React Native + Expo implementation of the Vendly marketing site, built one section at a
time. There is no real navigation wired up yet — `App.tsx` has a small dev-only switcher
(top-right) for jumping between the screens below while more sections are built out.

## Running it

```bash
npm run web
```

`npm run ios` and `npm run android` run the same screens natively.

## Shared infrastructure

Every screen is a fixed **1440 × 1024** artboard rendered through `ScaledFrame`
(`src/components/ScaledFrame.tsx`), which applies a single uniform scale to fit the viewport —
rather than re-flowing the composition responsively, which would stop it being the design.
Every component positions itself in raw source-of-truth pixels as a result.

`ScaledFrame` re-measures on both `onLayout` and a `Dimensions` `change` listener, so it
re-fits on a live resize (browser window resize, device rotation) and not just on first paint —
the second listener exists because `onLayout` alone was observed to miss at least one resize
path on web.

## Screens

### Desktop - 3 (`src/screens/DesktopThree.tsx`)

The Figma frame **"Desktop - 3"** (node `27:1324`) from
[this file](https://www.figma.com/design/3RNQswrTkP3rn95JYC2Pi4/Untitled) — the black
"About us / Risk of fake orders" screen.

| Piece | Figma node | Source |
| --- | --- | --- |
| Gradient plate, logo, nav, Login / Start For Free | `77:51`, `236:58`, `77:19`, `77:31` | `src/components/TopBar.tsx` |
| Eyebrow, heading, body copy, bullet rows | `102:238`, `154:27` | `src/components/AboutSection.tsx` |
| Bullet marks | `117:246`, `117:250` | `src/components/icons/BulletIcon.tsx` |
| Scroll chevron | `222:62` | `src/components/ScrollCue.tsx` |
| Colours, fonts, type scale | — | `src/theme.ts` |

`design/desktop-3-reference.png` is the 1440 × 1024 export of the frame, kept so future
changes can be checked against the original.

#### Verification

Measured against that export rather than eyeballed. Element boxes and glyph-ink positions were
read out of the running app and compared to the pixels in the reference: the gradient plate,
logo, bullet marks, CTA pill and chevron land on their exact Figma coordinates, and all 18 text
runs match the reference's ink position vertically to the pixel. The chevron's outer 70px disc
and its 36 × 18 glyph were checked separately.

#### Two deliberate deviations

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

#### Notes

- Text rows are positioned individually rather than as one flowing block. In Figma the copy is
  a single text layer whose bullet rows are indented with literal spaces, with the red marks
  floating over it as a separate column; as one string, the marks and their rows would drift
  apart wherever a platform measures a space differently.
- The `top` offsets in `AboutSection` are calibrated so painted glyphs — not line boxes — land
  where the reference render puts them, since a line box sits differently inside its leading in
  each typeface.

### Product Categories (`src/screens/ProductCategories.tsx`)

A six-column "shop by category" rail — General Store, Home & Lifestyle, Electronics &
Accessories, Beauty & Health, Fashion & Apparel, Food & Beverages, numbered 06→01 right to left
(01→06 left to right) — each with a peeking product photo, a title, and a "View More" pill.

Unlike Desktop-3, this wasn't read from Figma directly: it was ported from an **Anima**
(Figma → React) export supplied as a `.rar`, cross-checked by actually running that export's
own Vite dev server and reading its live computed DOM layout — a stronger ground truth than a
screenshot, since it resolves exactly how the browser handles the export's Tailwind arbitrary
values (including two that don't do what their literal class name says — see below).

| Piece | Source |
| --- | --- |
| Per-column layout, number, title, image, CTA | `src/components/CategoryPanel.tsx` |
| Category data (positions, colors, image assets) | `src/screens/ProductCategories.tsx` |
| Bottom scroll-cue icon | `src/components/icons/ChevronCircleIcon.tsx` |

Category photos (`assets/categories/*.png`) are the same source files provided in
`Resources/` — bundled locally rather than fetched from the export's remote `animaapp.com`
CDN URLs.

#### Bugs found in the source, and how they were handled

The supplied `.rar` had real defects — this is a description of what was actually wrong and
fixed, not a design choice:

- **The app couldn't run at all.** `src/screens/MainFrame/index.tsx` (the screen barrel file)
  contained the *entry point's* code instead of a re-export, and the real entry point,
  `src/index.tsx`, was missing entirely. Recreated the entry point and reduced the barrel to
  `export { MainFrame } from "./MainFrame";` so the reference project could actually boot and
  be measured.
- **The "View More" button was unclickable in 4 of 6 columns.** The product `<img>` paints
  after (and therefore on top of) the number/title/button, and in the columns where the image's
  vertical position overlaps that content, it's fully opaque with `pointer-events: auto` —
  confirmed via `document.elementFromPoint()` at the button's own center returning the image,
  not the button, in the running export. `CategoryPanel` paints the image first and the text/CTA
  after, keeping the exact same positions but a working, tappable button.
- **One category number renders with no outline.** "General Store"'s stroke color in the source
  is an invalid 5-digit hex (`#ffcfc`), which real browsers drop — its number silently renders
  with zero stroke width instead of the sibling columns' 1px near-white outline. Reproduced as
  observed (`numberStroke: null`) rather than guessed-and-"fixed", since it's a minor, easy
  change if you'd rather it matched its siblings.
- **The wide `w-[...]` image classes have no effect.** Every category image is coded with a
  width far larger than its column (e.g. 541px in a 240px column), but Tailwind's preflight
  `img { max-width: 100% }` rule resolves against the column and silently caps the *rendered*
  width to exactly 240px regardless — confirmed on the live DOM, not inferred from the class
  name. Not a bug so much as a trap: reproducing the coded width literally would have cropped
  each photo differently than what actually ships. `CategoryPanel` uses the real 240px width
  directly, so RN's own `resizeMode="cover"` crop matches the export's browser-computed crop.

#### Notes

- No real navigation exists yet for "View More" — it's wired up as an accessible, tappable
  button with no destination.
