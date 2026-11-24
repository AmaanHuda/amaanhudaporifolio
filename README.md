# Amaan — portfolio · "Mission Control, 1984"

Static site: **HTML + CSS + vanilla JS + GSAP + ScrollTrigger + Lenis**. No build step.
Theme: retro-futurism — synthwave sunset, neon perspective grid, chrome type, CRT scanlines,
HUD readouts, stepped (8-bit) easing and VHS glitches.

## Run it
```bash
python -m http.server 8000     # or: npx serve .
# open http://localhost:8000
```
Deploy by uploading the folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages.

## Edit your content
Everything about you lives in **`js/data.js`** — name, tagline, about text, education, experience, projects, skills and contact links. Replace every `[placeholder]`.

- **Photo:** put a portrait at `assets/profile.jpg`; it appears inside the CRT monitor. Until then a chrome "A" over a synthwave sun shows.
- **Project covers:** `assets/covers/*.svg` are placeholders. Swap in real screenshots (4:3) and update `cover:` in `data.js`.

## Updating your resume
The download buttons (hero nav, contact terminal, footer) all point to **`assets/Amaan-Huda-Resume.pdf`**.
To update it, replace that file with your new PDF using the same name and redeploy. To use a different filename, change `resume.file` in `js/data.js`.
A static site can't accept uploads from the browser and keep them, because that needs a server. Swapping the file is the "upload".

## Live GitHub panel
Section 06 pulls public data for `github.user` in `data.js` straight from the browser. No token or build step is needed.
- Profile stats and the 4 most recently pushed repos come from `api.github.com`.
- The contribution calendar comes from `github-contributions-api.jogruber.de`, a free public mirror of the GitHub graph.
Responses are cached for 30 minutes per visitor. If either service is down, the panel says so and links to your profile.

## Files
| File | What it does |
|---|---|
| `js/data.js` | All content |
| `js/main.js` | Every animation and interaction |
| `js/hero-shader.js` | WebGL synthwave horizon: stars, striped sun, mountains, scrolling neon grid |
| `css/style.css` | Palette, type, layout, responsive rules |
| `js/vendor/` | GSAP, ScrollTrigger, Lenis (local copies) |
| `_backup-original/` | The previous (red/black) version, untouched |

## Animation map
1. **Boot:** CRT power-on → terminal log types out with a stepped progress bar → screen collapses to a line → 14 horizontal stripes wipe away from the centre. Skip with Enter / Esc / the button.
2. **Hero:** WebGL synthwave horizon (cursor pans the camera); chrome name drops in with a shine sweep; role line types out; HUD panels wipe in with stepped easing and decode their text.
3. **Warp jump (scroll):** grid throttles up and the sun sets, the name's letters fly past the camera, a hyperspace starfield takes over and the phrase decodes like a teletype; then the content rises over it.
4. **About:** every word is revealed by a cyan block-cursor wipe (scroll-scrubbed); the paragraph types itself; the CRT monitor powers on.
5. **Education:** pinned rolodex — each file flips up over its top edge as you scroll; LEDs and a split-flap counter track progress.
6. **Experience:** rows wipe in with stepped easing; the row at screen centre lights up with a neon bar and its date flips like a Solari board; click to expand.
7. **Projects:** list tilts like a slot-machine drum around the centre line; a floating retro TV switches channel with a static burst and vertical roll; clicking opens a **CRT power-on** dialog (and powers off on close).
8. **Tunnel (desktop):** fly through rotating neon frames past the project covers while the phrase lights up word by word.
9. **Skills:** an oscilloscope whose amplitude and frequency follow scroll velocity; accordion chips pop in.
10. **Contact:** sunset bands sweep in from alternating sides, the title skids in, the `TRANSMIT.EXE` terminal powers on.
11. **Footer:** striped sun rises over an endlessly rolling grid; chrome name bounces in; marquee "end of transmission".

Plus: Lenis smooth scroll, a reticle cursor with context labels, a fuel-gauge section rail, a `T+ %` readout, global CRT scanlines with a rolling tracking bar, and `prefers-reduced-motion` support.

## Tweak the look
Colours are CSS variables at the top of `css/style.css` (`--void`, `--magenta`, `--cyan`, `--sun1..3`, `--chrome`). Fonts: Michroma (display), VT323 (HUD/terminal), Space Grotesk (body).
