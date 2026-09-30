# Deploying dellagana.uk from a clean staged copy

Never deploy the repo folder itself. `wrangler.jsonc` points its assets at `.`, and a Netlify deploy of
the repo root would publish the same folder. Either way `docs/` (the spec, the CV source), `DESIGN.md`,
`tools/` and anything else in the repo would go public. Always stage first, then deploy only the staged
folder.

## Exactly these files ship

| File                                       | What it is                                        |
| ------------------------------------------ | ------------------------------------------------- |
| `index.html`                               | The page                                          |
| `styles.css`                               | All styles                                        |
| `main.js`                                  | Scroll loop, clock, card cycle, copy-email        |
| `fonts/archivo-condensed-italic-850.woff2` | Name and titles                                   |
| `fonts/inter-tight-var.woff2`              | Body                                              |
| `fonts/jetbrains-mono-var.woff2`           | Fact sheet and labels                             |
| `fonts/instrument-serif-italic.woff2`      | Big quote                                         |
| `fonts/OFL.txt`                            | Font licence (the OFL asks for it to travel with the fonts) |
| `cv.pdf`                                   | The CV, without the phone number                  |
| `og.jpg`                                   | 1200x630 share image                              |
| `favicon.svg`, `favicon.png`               | Tab icons                                         |
| `apple-touch-icon.png`                     | Home-screen icon                                  |
| `robots.txt`, `sitemap.xml`                | For search engines                                |
| `img/*.avif`, `img/*.webp`, `img/*.jpg`    | Project screenshots, once they exist (none yet)   |

Nothing else ships, and in particular none of these:

- `docs/`
- `DESIGN.md`
- `tools/`
- `wrangler.jsonc`
- `.assetsignore`
- `.superpowers/`
- any screenshots or Lighthouse reports from checking the site

## Steps

1. **Stage and check.** `tools/stage.sh` copies the files above into a new temp folder and checks them:
   nothing private included, no phone-like number in any file or in the PDF text, no Instagram, no
   "paying clients". It prints the folder path. It needs `pdftotext` (`brew install poppler`).

   ```sh
   STAGE=$(tools/stage.sh) && echo "$STAGE" && ls -R "$STAGE"
   ```

2. **Look at it.** Serve the staged folder (for example `npx serve "$STAGE"`) and check it at 390px and at
   1280px, and once with reduced motion on.

3. **Salvo checks `cv.pdf`** before its first deploy (spec: "He still sees the PDF before it goes live").

4. **Deploy the staged folder only**, after a heads-up to Salvo. Use the Netlify site `sh-studios-admin`
   (id `e27efa17-c0f0-4a74-98fb-d0f40314ad2f`), which holds dellagana.uk and www:

   ```sh
   netlify deploy --prod --dir "$STAGE" --site e27efa17-c0f0-4a74-98fb-d0f40314ad2f
   ```

   Do not touch DNS, the iCloud MX records or the Cloudflare settings.

   If `wrangler deploy` is ever used instead, `.assetsignore` in the repo root keeps `docs/`, `tools/`,
   `DESIGN.md` and `wrangler.jsonc` out. That is only a safety net: the staged folder is still the way to deploy.

5. **After the deploy**, run these checks:
   - `curl -sS --max-redirs 0 https://dellagana.uk/ | grep -c 'Salvatori (Salvo) Della-Gana'` returns
     at least 1.
   - `curl -sI https://www.dellagana.uk/` shows a redirect to `https://dellagana.uk/`.
   - Salvo gets one screenshot.
   - Submit `https://dellagana.uk/sitemap.xml` in Search Console.

## Regenerating cv.pdf, og.jpg and the icons

`tools/render-assets.mjs` renders `docs/cv/cv-source.html` to `cv.pdf`, the hero to `og.jpg`, and
`favicon.svg` to the two PNGs. Serve the repo root on port 8080, then:

```sh
npm i --no-save playwright-core && node tools/render-assets.mjs
```

Edit the CV in `docs/cv/cv-source.html`. It must never contain the phone number.

## Adding the project screenshots

The hero card and the work rows show designed placeholders (title cards and wireframes) because the
screenshots are not in the repo yet. For each project (`rinse`, `kent`, `hub`):

1. Capture the top of the live site at 1600x1000. Export `img/work-<name>-800.{avif,webp,jpg}` and
   `img/work-<name>-1600.{avif,webp,jpg}`.
2. In `index.html`, put a `<picture>` inside the matching `.slide` (hero card), replacing the `.poster`.
   Do the same inside the matching `.row__thumb` (work rows):

   ```html
   <picture>
     <source type="image/avif" srcset="/img/work-rinse-800.avif 800w, /img/work-rinse-1600.avif 1600w" sizes="(max-width: 900px) 88vw, 34vw" />
     <source type="image/webp" srcset="/img/work-rinse-800.webp 800w, /img/work-rinse-1600.webp 1600w" sizes="(max-width: 900px) 88vw, 34vw" />
     <img src="/img/work-rinse-800.jpg" width="800" height="500" alt="" decoding="async" />
   </picture>
   ```

   Give the first hero slide `fetchpriority="high"` on its `img`. Give the work-row images `loading="lazy"`.
   Keep `alt=""`, because the row and card text already name the project.
3. Re-run Lighthouse, since images change the LCP.

## Adding Salvo's photo

Replace the `<span class="portrait__mono">` inside `.portrait` with
`<img src="/img/salvo-160.avif" width="80" height="100" alt="Salvo Della-Gana" />`, and remove
`aria-hidden` from the `figure`. The frame, corner marks and crop are already styled.
