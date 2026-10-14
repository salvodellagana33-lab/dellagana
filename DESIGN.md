# dellagana.uk design system

This replaces "Midnight Technical". It has one theme, dark. The spec is
`docs/superpowers/specs/2026-09-27-personal-site-design.md`. This file is internal and is never deployed.

## Idea

The page is a newspaper fact sheet with a giant moving name, and it should feel cinematic without bragging.
Mono facts sit on top, a condensed italic name fills the screen, and one tilted card holds the work.

## Colour

| Token     | Value                   | Use                                          |
| --------- | ----------------------- | -------------------------------------------- |
| `--bg`    | `#07090F`               | Page background                              |
| `--bg-2`  | `#0C1019`               | Cards, portrait slot, poster panels          |
| `--text`  | `#E9EEF6`               | Body text                                    |
| `--muted` | `#7D8799`               | Secondary text (5.4:1 on bg)                 |
| `--blue`  | `#3D9BFF`               | The name, titles on hover, key phrases, dots |
| `--green` | `#22C55E`               | "Open to work" only                          |
| `--line`  | `rgba(148,163,184,.16)` | Hairlines                                    |

A 6% film-grain layer sits over everything and jitters in four steps. It stays still with reduced motion.

## Type

All fonts are self-hosted woff2, subset to Latin, in `fonts/` (OFL, see `fonts/OFL.txt`).

| Role              | Face                                   | Notes                                                 |
| ----------------- | -------------------------------------- | ----------------------------------------------------- |
| Name, titles      | Archivo italic, width 62, weight 850   | Instanced to one static file (11 KB). Uppercase, line-height 0.8 |
| Body              | Inter Tight 300 to 500                 | 17px body, 300 for big statements                     |
| Fact sheet, labels | JetBrains Mono 400 to 500             | 11 to 12px, uppercase labels tracked 0.1 to 0.25em    |
| Big quote         | Instrument Serif italic                | Only in the Quotes section                            |

The name is sized in CSS: `min(20.3vw, 36vh)`, or `20vh` on phones. "DELLA-GANA" is 4.6em wide plus
0.12em of padding, so it spans the screen without any JS measuring or layout shift. Italic caps overhang
their box (A by 0.04em on the left, V by 0.07em on the right), so every clipped display line gets padding
on both sides. Never use negative tracking on it. This is the lesson from the April clipping fixes.

## Parts

- **Section label (`.k`):** a 7px blue dot, then an uppercase 11px label.
- **Bracket button (`.btn`):** mono uppercase with two corner brackets. On hover the brackets grow into
  a full frame.
- **Leaders (`.leaders`):** a `dl` of label, dotted leader and value, used for grades.
- **Poster (`.poster`):** a CSS title card with browser chrome, used where a project screenshot will go. The
  work rows use the wireframe version (`.wire`), which sketches a page rather than faking a screenshot.
- **Portrait slot (`.portrait`):** a 52x64 ID tile with an "SD" monogram. It is replaced by Salvo's photo
  when he sends one.
- **Experience rows:** native `details`/`summary`, so they open by keyboard and by screen reader for free.

## Motion

- One `requestAnimationFrame` loop in `main.js`, driven by scroll. It runs only while something moves
  and never while the tab is hidden. The clock, the card cycle and all CSS loops pause with the tab too.
- Hero: the letters rise in, the facts type in, and the card drops in. While you scroll, the name lines
  slide off the sides and the card zooms to fill the screen with a caption.
- Statement: words light up in order as you scroll.
- Reduced motion (CSS and JS both gated): no pinning, no grain, no marquee, no card cycle. All text is
  visible and still.
- Without JS, everything is visible. The initial hidden states only apply under `html.js`.

## Accessibility rules

- Real H1 text ("Salvatori (Salvo) Della-Gana"). The giant letters are `aria-hidden`.
- A skip link, landmarks and a visible 2px blue focus ring on everything focusable.
- Links that open a new tab say so to screen readers. Copying the email is announced in a live region.
- Touch targets are at least 24px.
