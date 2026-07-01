# Stitch Milton Keynes — Website

An animated, single-page website for **Stitch Milton Keynes**, a family-run custom
embroidery and printed-workwear business. It ships as one self-contained
`index.html` with a real-time **3D garment customiser** powered by three.js.

> **Live file:** `index.html` — open it straight in a browser, or host it anywhere static.

---

## Contents

- [Overview](#overview)
- [Quick start](#quick-start)
- [Page sections](#page-sections)
- [The 3D design studio](#the-3d-design-studio)
- [Design system](#design-system)
- [Animation & interaction](#animation--interaction)
- [Files](#files)
- [Editing guide](#editing-guide)
- [Real content & links](#real-content--links)
- [Deploying](#deploying)
- [Notes](#notes)

---

## Overview

| | |
|---|---|
| **Business** | Stitch Milton Keynes — custom embroidery & printed workwear |
| **Positioning** | Family run, no minimum order, bring-your-own garments, UK-wide delivery |
| **Deliverable** | One animated landing page (hero → services → showcase → brands → process → promise → studio → reviews → contact) |
| **Signature feature** | Interactive 3D garment customiser (hoodie / t-shirt / polo) |
| **Tone** | Warm, family-first, tactile, craft-led |
| **Stack** | Plain HTML/CSS/JS, no build step. three.js r160 via CDN import map. |

Everything (markup, styling, page logic, and the 3D studio) lives in a single
`index.html`. There is **no build step and no framework** — it is meant to be
easy to read, tweak, and host.

---

## Quick start

Just open the file:

```bash
# double-click index.html, or:
xdg-open index.html      # Linux
open index.html          # macOS
```

The 3D studio pulls three.js from a public CDN over HTTPS, which browsers allow
even from a `file://` page, so the studio works on a plain double-click **as long
as you are online**. If you prefer to serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Page sections

1. **Nav** — sticky; transparent over the hero, frosts on scroll. Stitch mark at
   left, links + "Quote me" CTA at right. Collapses to a slide-in drawer on mobile.
2. **Hero** — headline with a self-drawing stitched underline, a faux-3D
   **embroidered logo patch** (float + cursor parallax tilt + cursor-tracking
   sheen), and a needle-and-stitch flourish in the corner.
3. **Marquee** — scrolling band of services on deep teal.
4. **Services** — four cards: Custom Embroidery, Printed Workwear, Personalised
   Gifts, Your Own Garments.
5. **Showcase band** — dark panel, "Every patch, a little piece of craft," with
   floating logo + accent patches.
6. **Brands** — six **embroidered example patches** (invented demo brands) that
   **flip on hover / focus**.
7. **Process** — three steps on a draw-on-scroll stitched thread path.
8. **Promise** — "With family in mind" family-values band.
9. **Design studio** — the interactive 3D garment customiser (see below).
10. **Reviews** — placeholder testimonials + link to the real reviews page.
11. **Contact / footer** — real address, phone, hours, and social links.

---

## The 3D design studio

Lives in the `#studio` section, powered by **three.js r160** (loaded through an
import map). The studio code is kept **inline** in `index.html` rather than in a
separate `studio3d.js` on purpose: a local module import is blocked by the browser
on a `file://` page, whereas an inline module whose only import is the HTTPS CDN
works everywhere. The block is clearly delimited and commented.

**Capabilities**

- **Three garments** — hoodie (hood, drawstrings, kangaroo pocket), t-shirt (crew
  neck), polo (folded collar, placket, buttons, cuffs), built as real 3D meshes.
- **PBR fabric** — cloth sheen + a procedural woven normal map, soft studio
  lighting, environment reflections (procedural `RoomEnvironment`), and a soft
  contact shadow.
- **Drag to rotate** — OrbitControls; gentle auto-rotate when idle.
- **Upload your design** — projected onto the chest as a curved "print" that wraps
  the body.
- **Resize** the design with a slider; **click the garment** to reposition the print.
- **6 fabric colours** (white, teal, navy, charcoal, gold, burgundy) + instant
  garment switching.
- **Persistence** — garment, colour, size, print, and its position are saved to
  `localStorage` under `smkStudio3d_v1`.

**Robustness**

- A loading spinner shows until the first frame renders.
- If WebGL is unavailable, a graceful "needs WebGL" fallback is shown instead.
- Textures and geometries are disposed when you re-upload or switch garments.
- WebGL is **not capturable** by DOM-screenshot tools — the studio only renders in
  a real browser tab.

---

## Design system

**Colours** (from the real brand logo)

| Token | Hex | Use |
|---|---|---|
| Teal | `#2EA7D5` | Primary brand / merrow border |
| Teal dark | `#1A88B0` | Thread shading, text accents |
| Deep | `#0A3F54` → `#072E3D` | Dark panels / footer |
| Twill | `#ECE9F1` / `#D6D1DC` | Cool light-grey fabric |
| Ink | `#16282F` | Body text |
| Ink soft | `#5A6970` | Secondary text |
| Gold / Burgundy / Navy | `#C79A3B` / `#6E2233` / `#16305A` | Accents & studio colours |

**Type** (Google Fonts)

- **Newsreader** (serif) — headlines, editorial accents
- **Hanken Grotesque** (sans) — body, UI, labels
- **Kaushan Script** — the "Stitch" wordmark accent

No em dashes anywhere in the copy (per brand preference).

---

## Animation & interaction

- Self-drawing stitched underline in the hero headline
- Faux-3D logo patch: float + mouse-parallax tilt + cursor-tracking sheen
- Corner needle-and-stitch flourish
- Drifting ambient thread dots
- Scrolling services marquee
- Scroll-reveals (staggered) on every section and card
- Draw-on-scroll stitched dividers + process thread path
- Brand patches flip on hover / keyboard focus
- Nav frosts on scroll
- Reveals use an IntersectionObserver **plus** a throttled scroll/resize safety-net
  sweep, so nothing stays hidden even under fast scrolling or when the page is
  scaled/embedded.

**Motion toggle** — a small pill (bottom-right) switches between `Lively` and
`Calm`, which pauses ambient motion and the studio's auto-rotate. It is remembered
in `localStorage` and defaults to `Calm` when the OS requests reduced motion.
`prefers-reduced-motion` is fully honoured.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire website — markup, styles, page logic, and the inline 3D studio |
| `assets/favicon.svg` | Site favicon (stitch mark) |
| `README.md` | This file |

The logo, hero patch, and the six brand patches are **inline SVG** (crisp,
themeable, no extra requests, and they pick up the page's web fonts).

---

## Editing guide

- **Copy & colours** — the CSS design tokens live in the `:root` block near the top
  of `index.html`; text is in the markup below it.
- **Brand patches** — the six demo brands are generated from the `brands` array in
  the page `<script>` (name, shape, colours, icon). Edit that array to change them,
  or replace with real client logos.
- **Studio colours / garments** — edit `COLORS` and the garment builders in the
  inline studio module, plus the matching control markup (`#smk-color-btns`,
  `#smk-garment-btns`).
- **Studio lighting/materials** — tuned in `boot()` (lights) and `fabricMaterial()`.
- Prefer small, targeted edits; the design is intentionally consistent across
  sections.

---

## Real content & links

- **Address** — Unit 22 Galley Lane Farm, Galley Lane, Milton Keynes, MK17 9AA
  (visitors by appointment)
- **Phone** — 01525 261250 · **Mobile** — 07793 244379
- **Hours** — Monday to Friday, 9:30 to 17:00
- **Website / quote** — https://www.stitchmiltonkeynes.co.uk/
- **Social** — [Facebook](https://www.facebook.com/stitchmiltonkeynes/),
  [Instagram](https://www.instagram.com/_stitchmiltonkeynes/), LinkedIn

The external "Get a quote / See the collection / Read our reviews" buttons point at
the live site homepage. Swap in deep links (catalogue, store, reviews pages) once
the exact URLs are confirmed.

---

## Deploying

Any static host works. For **GitHub Pages**: enable Pages for this repo/branch and
it will serve `index.html` at the site root. The studio's three.js import map uses
absolute HTTPS CDN URLs, so it works identically whether opened locally or hosted.

---

## Notes

- **Review quotes are placeholders** (generic, unattributed) so nothing is
  misrepresented as a real testimonial — swap in real ones when ready.
- **The six brand patches are invented demos** (MK-area names) to show range, not
  real clients.
- **The 3D studio requires WebGL** and an internet connection (to fetch three.js
  from the CDN); it only renders in a live browser tab, not in flat screenshots.
