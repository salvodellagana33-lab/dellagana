# Learnings — dellagana portfolio

**2026-04-09 — Single-file portfolio build**
- Observation: `min-height: 2.05em` on the hero name element prevents a layout jump during the scramble animation before text is set, keeping above-the-fold layout stable.
- Action: Always reserve space for dynamically populated text elements that start empty, especially when using font-size `clamp`.
- Confidence: high

**2026-04-09 — Single-file portfolio build**
- Observation: Canvas `mousemove` listener on the element itself misses events when the cursor is over child DOM elements layered on top. Attaching to `window` and converting coordinates via `getBoundingClientRect` is more reliable for full-viewport canvases.
- Action: For full-viewport interaction canvases, bind `mousemove` to `window` not the canvas element.
- Confidence: high

**2026-04-09 — Single-file portfolio build**
- Observation: `prefers-reduced-motion` must gate both `requestAnimationFrame` loops AND CSS `animation` keyframes. CSS animations don't stop just because JS animations are conditionally skipped — they need their own `@media (prefers-reduced-motion: reduce)` override.
- Action: Always pair a JS reduced-motion check with a CSS `@media (prefers-reduced-motion: reduce)` block that zeroes transitions and animations.
- Confidence: high
