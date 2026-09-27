# dellagana.uk personal site: design

Date: 27 Sep 2026. Status: Salvo answered every open question on 28 Sep 2026 (see the end).
Mockup: `docs/superpowers/specs/2026-09-27-personal-site-mockup.html` (images are not in the repo, so it
shows the layout and code, not the screenshots).

## Goal

A public CV for Salvatori (Salvo) Della-Gana that:

1. **Gets him a software engineering apprenticeship.** Within one screen an employer sees who he is, what he does
   now, his results, that he is open to work and how to reach him.
2. **Stands out.** Cinematic, award-site feel, without looking like bragging.
3. **Ranks** for "salvo della gana", "salvatori della gana" and "della gana".

Out of scope: a blog, a CMS, SH Studios pricing, branding or footer backlink, a phone number, anything about
other SH people, and the old April portfolio (this site replaces it).

## Decisions already made (Salvo, 26 to 27 Sep 2026)

- **Direction:** Elliott Mangham's newspaper fact-sheet layout with Mat Voyce's giant moving name. Salvo
  clicked both sites in the companion, then said "i like it tho the mockup" and "cool".
- **Dark only.** No light mode.
- **No personal money figures.** The £14,000 resale and £2,000 drone lines are out ("it looks like im
  bragging"). The £1,700 stays because it is a client's result.
- **Content comes from the newer CV** (`~/Downloads/Salvatori_Della-Gana_CV.docx`, 27 Sep).

## The page, top to bottom

1. **Hero** (pinned while you scroll about three screens).
   - **Fact sheet row:** five columns, mono text, a blue dot on each header. The lines type in on load.
     - Intro: name, "Web developer", Southampton with a live clock.
     - Now: co-founder of SH Studios, sixth form at Barton Peveril, IT support at Cool Move Logistics.
     - Year 1 results: Website Development Distinction, App Software Merit, Engineering Merit, GCSE Computer
       Science A.
     - Track record: 8 clients with live sites, writing code since 13, £1,700 booked for a client within a
       day of launch.
     - Connect: a pulsing green "Open to work", "Software eng. apprenticeship", [ Email me ] and
       [ LinkedIn ].
   - **Giant name:** "SALVO" at top left and "DELLA-GANA" at bottom right, condensed italic in blue. The
     letters rise in on load. The H1 is real text: "Salvatori (Salvo) Della-Gana".
   - **Card:** a tilted card between the two lines cycles screenshots of the three projects with a wipe, and
     a "LIVE · url" tag.
   - **On scroll:** the name lines slide off the sides, the facts fade, and the card zooms to fill the screen
     with the caption "Live sites, designed and coded by me, from the first call to aftercare."
2. **Statement.** One paragraph that lights up word by word as you scroll, with the key phrases in blue: who
   he is, SH Studios, coding since 13, looking for a software engineering apprenticeship.
3. **Selected work.** Three rows: Rinse Revive, Kent Chemistry and Revision Hub. Each has a giant title, one
   line of detail and a thumbnail that zooms on hover. The whole row links to the live site in a new tab.
4. **The CV** (new; not in the mockup). The same fact-sheet style, in three columns:
   - **Experience:** SH Studios; Cool Move Logistics; The Chestnut Horse; Figurati; Pryvate beta tester.
   - **Education:** Barton Peveril units and grades; King Edward VI GCSEs; Digital Leader.
   - **Skills:** grouped as on the CV.

   Each experience row shows its title and dates, and opens on click to show the CV bullet points. A
   [ Download CV ] button gives the PDF.

5. **Quotes.** Oliver Ferguson's in large serif italic; Dr Sandip Desai's below it. Both use the CV wording.
6. **Open to work.** A scrolling "Open to work" band. The email is shown large and copies on click, falling
   back to mailto. Also here: LinkedIn, SH Studios, the Southampton time and
   a © line. There is no GitHub link, because Salvo removed it on purpose (commit 5b1b241).

## Content rules

- **No phone number anywhere:** not on the page, not in the source, not in the PDF. A check fails if it
  appears.
- **Clients named:** only Rinse Revive and Kent Chemistry Tutor. Both are on his CV and live. Revision Hub is
  his own project. PK Removals and pitch previews such as Dojo are not used.
- **"8 clients", never "8 paying clients".** The 11 Sep records show 7 of the 8 pay.
- **Voice:** first person and plain. Facts, not boasts. The kitchen porter jobs stay but are short: they show
  reliability.

## Look

- **Colours:** background #07090F, text #E9EEF6, muted #7D8799, blue #3D9BFF. Green #22C55E is used only for
  "Open to work". A light film-grain overlay.
- **Type:**
  - Archivo condensed italic 850 for the name and titles.
  - Inter Tight for body text.
  - JetBrains Mono for the fact sheet.
  - Instrument Serif italic for the big quote.

  All are self-hosted woff2, subset to Latin.

- **`DESIGN.md`** is rewritten to this system. It replaces "Midnight Technical".

## Motion

- Plain JavaScript with one requestAnimationFrame loop driven by scroll position, as in the mockup. No
  libraries.
- The loop stops while the tab is hidden.
- **Reduced motion:** no pinning, no grain animation, the name sits still and all text is visible. Both the CSS
  and the JS are gated, per the April learning.
- **Phone:** the fact sheet shows Intro, Now and Connect only (grades and track record are in the CV section).
  Lines wrap, and there is no sideways scroll.

## SEO

- **Title:** "Salvatori (Salvo) Della-Gana | Web Developer, Southampton", plus a meta description.
- **Name variants in visible text:** Salvatori Della-Gana, Salvo, and "Salvo Della Gana" in the footer.
- **Person JSON-LD:**
  - name "Salvatori Della-Gana"
  - alternateName: Salvo Della-Gana, Salvo Della Gana, Salvatori Della Gana, Della Gana, Dellagana
  - jobTitle
  - worksFor: SH Studios (Organization, url shstudios.uk)
  - affiliation: Barton Peveril Sixth Form College
  - address: Southampton, GB
  - email, url
  - sameAs: https://www.linkedin.com/in/salvo-della-gana-979638405
- **Page basics:** canonical https://dellagana.uk/, Open Graph and Twitter cards with a 1200x630 image of the
  hero, favicon, robots.txt and sitemap.xml.
- **Search Console:** Salvo adds the site under his own Google login, and I walk him through it. Then submit
  the sitemap.
- **Links in:**
  - the LinkedIn website field
  - optionally a link from shstudios.uk (an SH change, so it needs Harry's agreement and is a separate task)
- **Expectation:** the full-name searches can reach first place. "della gana" alone is a shared surname:
  page one is likely, first place is not promised.

## Build

- **A static site with no framework and no build step:**
  - `index.html`, `styles.css`, `main.js`
  - `img/`: AVIF and WebP with a JPEG fallback, via srcset
  - `fonts/`, `cv.pdf`, `og.jpg`, `favicon.svg`, `robots.txt`, `sitemap.xml`
- **The CV PDF** is made from the newer CV with the phone number removed. Salvo sees it before it goes live.
- **Branch and old edits:** work happens on branch `site-v2`, merged to main after Salvo has seen it. First,
  the uncommitted April edits to `index.html` (the Dojo section) and `dojo-screenshot.png` are committed to
  branch `archive/portfolio-2026-04` so nothing is lost.

## Deploy

- **Target:** Netlify site `sh-studios-admin` (id e27efa17), which already holds dellagana.uk and www.
- **Clean copy only:** stage only the published files in a temporary folder. Never `docs/`, `.superpowers/`,
  `DESIGN.md` or `wrangler.jsonc`.
- **One deploy:** `netlify deploy --prod`, only after the local checks pass and after a heads-up to Salvo.
- **Not touched:** DNS, the iCloud MX records and the Cloudflare settings.

## Done means

- **Local preview** at 1280x800 and 390x844: no sideways scroll, nothing cut off, every image loads, no
  console errors. It also works with reduced motion on.
- **Lighthouse on mobile:** Performance 90+, Accessibility 95+, SEO 100.
- **Schema:** the Person data passes validator.schema.org.
- **Phone check:** a search of the staged folder, including the PDF text, finds no phone number.
- **After deploy:**
  - `curl -q --max-redirs 0` on https://dellagana.uk/ returns 200 and contains the H1.
  - www redirects to it.
  - Salvo gets one screenshot.
- `docs/learnings.md` gets an entry.

## Salvo's answers (28 Sep 2026)

1. **LinkedIn:** https://www.linkedin.com/in/salvo-della-gana-979638405 (he gave the uk.linkedin.com form of
   the same profile).
2. **Instagram:** no. It appears nowhere on the site or in the schema.
3. **Quotes:** yes, both can be public.
4. **CV PDF:** yes, published without the phone number. He still sees the PDF before it goes live.
5. **Photo:** later. The first version ships without one, and the Intro column must look finished without
   it.
