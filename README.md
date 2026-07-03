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

- **Real modelled garments** — five real GLTF garments with true fabric folds and
  drape (loaded when hosted): a **t-shirt** (`shirt.glb`), a **men's** and a
  **women's hoodie** (`hoodie.glb`, `hoodie-womens.glb`), and a **men's** and a
  **women's polo** (`polo.glb`, `polo-womens.glb`), all under `assets/models/`. The
  women's hoodie and both polos are photogrammetry scans (each decimated with
  meshoptimizer from ~0.5–0.8M down to ~74–77k vertices and recoloured at runtime),
  each a distinct fitted cut. Each modelled garment is drawn as single-sided shells
  (never `DoubleSide`, which renders these meshes see-through / washed out on some
  software renderers): the thin t-shirt and the scanned garments get an inner shell
  so their single surfaces read solid, and the multi-layer men's hoodie is solid on
  its own.
- **PBR fabric** — cloth sheen + a procedural woven normal map, soft studio
  lighting, environment reflections (procedural `RoomEnvironment`), a soft radial
  contact shadow, and a studio-sweep backdrop.
- **Drag to rotate** — OrbitControls; gentle auto-rotate when idle.
- **Upload your design** — projected onto the garment as a real `DecalGeometry`
  print that conforms to (wraps) the surface, styled to read as raised
  **embroidery** (a normal map is generated from the artwork's alpha, plus stitch
  ridges, sheen and a clearcoat thread highlight).
- **Multiple logos, anywhere** — **click the garment to stamp a logo** on the
  front, the back, the sleeves, wherever the surface faces you; place several at
  once (up to 16). **Click a placed logo to remove it**, or use **Undo** / **Clear**.
- **Real-world sizing** — the slider resizes the most-recent logo and the studio
  reports its true size in **centimetres and inches**.
- **6 fabric colours** (white, teal, navy, charcoal, gold, burgundy) + instant
  garment switching.
- **Persistence** — garment, colour, size, and every placed logo (with position)
  are saved to `localStorage` under `smkStudio3d_v1`.

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
| `assets/OIP.webp` | The real brand logo image (used big in the hero and showcase) |
| `assets/models/shirt.glb` | Realistic t-shirt model for the studio (MIT, see its `.LICENSE`) |
| `assets/models/hoodie.glb` | Realistic men's hoodie model for the studio (MIT, see its `.LICENSE`) |
| `assets/models/hoodie-womens.glb` | Realistic women's hoodie model for the studio (owner-supplied scan, see its `.LICENSE`) |
| `assets/models/polo.glb` | Realistic men's polo model for the studio (owner-supplied scan, see its `.LICENSE`) |
| `assets/models/polo-womens.glb` | Realistic women's polo model for the studio (owner-supplied scan, see its `.LICENSE`) |
| `assets/favicon.svg` | Site favicon (stitch mark) |
| `README.md` | This file |
| `tests/smoke.mjs` | Offline Playwright smoke test of the page and 3D studio |
| `package.json` | `lint` / `test` / `serve` scripts and dev dependencies |
| `.htmlvalidate.json` | HTML linter configuration |
| `.github/workflows/deploy.yml` | Auto-deploys the site to GitHub Pages on push to `main` |
| `.claude/hooks/session-start.sh` | Installs dev tools in Claude Code web sessions |
| `railpack.json` | Railway static-file deploy provider |

The **real logo image** (`assets/OIP.webp`) is featured on the white embroidered
patches in the hero and showcase. A faithful **inline SVG** re-creation of the same
mark handles the nav and footer, where it stays crisp at small sizes and flips to a
light "MILTON KEYNES" on the dark footer. The six brand patches are inline SVG too.

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

## Development

No build step. A few conveniences are wired up:

```bash
npm install       # dev tools (HTML linter, Playwright, three.js for the test)
npm run lint      # validate index.html with html-validate
npm test          # offline smoke test: loads the page + 3D studio in headless Chromium
npm run serve     # preview at http://localhost:8000
```

The smoke test serves three.js from the local install, so it runs fully offline and
checks that the page loads without errors, the studio renders (or shows its WebGL
fallback), and the brand patches and reveals appear.

## Deploying

Any static host works. A **GitHub Pages** workflow (`.github/workflows/deploy.yml`)
publishes the site on every push to `main`. To turn it on once:
**Settings → Pages → Build and deployment → Source: GitHub Actions.** The studio's
three.js import map uses absolute HTTPS CDN URLs, so it works identically whether the
file is opened locally or served from Pages.

---

## Notes

- **Review quotes are placeholders** (generic, unattributed) so nothing is
  misrepresented as a real testimonial — swap in real ones when ready.
- **The six brand patches are invented demos** (MK-area names) to show range, not
  real clients.
- **The 3D studio requires WebGL** and an internet connection (to fetch three.js
  from the CDN); it only renders in a live browser tab, not in flat screenshots.
- **The realistic t-shirt, hoodie and polo models are only loaded when the site is
  served** over http/https (Railway, Pages, or a local server). Opened as a bare
  file the studio falls back to the procedural garments.

## Credits

- T-shirt 3D model (`assets/models/shirt.glb`): from
  [Starklord17/threejs-t-shirt](https://github.com/Starklord17/threejs-t-shirt),
  MIT licensed (Copyright 2023 MaxSM) — see `assets/models/shirt.glb.LICENSE`.
- Men's hoodie 3D model (`assets/models/hoodie.glb`): derived from
  [garbieldpnt/blkkt](https://github.com/garbieldpnt/blkkt) (`hoodie.glb`), MIT
  licensed (Copyright 2025 Garbiboule Leplusbo). Reduced to a single untextured,
  re-centred, height-normalised mesh and recoloured at runtime — see
  `assets/models/hoodie.glb.LICENSE`.
- Women's hoodie 3D model (`assets/models/hoodie-womens.glb`): an owner-supplied
  photogrammetry scan, decimated with the
  [meshoptimizer](https://github.com/zeux/meshoptimizer) simplifier (via
  [glTF-Transform](https://gltf-transform.dev)) from ~771k to ~77k vertices, normals
  recomputed, re-centred and height-normalised, recoloured at runtime. **Its original
  source/licence still needs confirming** — see `assets/models/hoodie-womens.glb.LICENSE`.
- Polo 3D models (`assets/models/polo.glb` men's, `assets/models/polo-womens.glb`
  women's): owner-supplied photogrammetry scans, each decimated with the
  [meshoptimizer](https://github.com/zeux/meshoptimizer) simplifier (via
  [glTF-Transform](https://gltf-transform.dev)) from ~0.5M to ~74k vertices, normals
  recomputed, re-centred and height-normalised, recoloured at runtime. **Their
  original source/licence still needs confirming** — see the matching `.LICENSE`
  files.
