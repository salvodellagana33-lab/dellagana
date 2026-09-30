# RESUME: dellagana.uk personal site (paused 30 Sep 2026)

## Goal

Build Salvo's new personal site on dellagana.uk: a public CV and profile (open to work, SH Studios
co-founder, college and grades, experience, client quotes), extremely cinematic, ranking for "della
gana", "salvatori della gana" and "salvo della gana".

## Done

- **Spec approved** (28 Sep 2026): `docs/superpowers/specs/2026-09-27-personal-site-design.md`.
  Mockup: `docs/superpowers/specs/2026-09-27-personal-site-mockup.html`.
- **April portfolio edits archived** on the LOCAL branch `archive/portfolio-2026-04` (commit
  726fc5d: the Dojo section in `index.html`, `dojo-screenshot.png`, the old "Midnight Technical"
  `DESIGN.md`). Never push this branch: pitch previews stay private.
- `docs/learnings.md` (three April entries) is now committed on main.
- The brainstorm companion server is stopped.
- **Nothing is built and nothing is deployed.** The live site is unchanged.

## Next

1. `git -C ~/Projects/dellagana pull --ff-only`.
2. Invoke `superpowers:writing-plans` and write
   `docs/superpowers/plans/2026-09-28-personal-site.md` from the settled design below (15 tasks,
   exact code, tests and commands). Self-review it against the spec.
3. Commit the plan on main and push.
4. Hand off to Salvo: "Plan complete and saved to … Please review the plan. Which execution
   approach would you prefer?" Offer Subagent-driven vs Native. Recommend **Native**: the tasks share
   class names and IDs across index.html, styles.css, main.js and lib.js, 15 of them run mostly in
   order, and the deploy waits on Salvo's review, so a mistake is cheap.
5. Only after Salvo picks: execute.

Task 1 of the plan changes now that the archive is done: it only runs
`git switch -c site-v2 && git push -u origin site-v2` (learnings are already on main).

## Watch-outs

- **No phone number anywhere public**: page, source, PDF, public repo. Never print the number.
  Check with a count only: `grep -cE '(\+44|0)7[0-9 ]{9,12}' <files>` must print 0.
- The source images live only in the gitignored
  `.superpowers/brainstorm/8153-1790532637/content/work-{rinse,kent,f160}.jpg` (1200x750). Never use
  `work-pk.jpg`. They are screenshots of live sites and can be recaptured if lost.
- `node --test tests/` fails; use `node --test 'tests/*.test.mjs'`.
- The Bash tool is zsh: no word-splitting (use arrays or `bash`), a glob with no match aborts
  (`2>/dev/null || true`), the cwd resets (use absolute paths or `git -C`), and use `/bin/ls`.
- Prettier rewrites files after every Edit/Write (single quotes, no semicolons, printWidth 100,
  arrowParens avoid), including code blocks in Markdown. Tests must tolerate reformatting: `[^>]*`
  in tag regexes, normalised whitespace, `srcset` broken over lines.
- Float and -0 results from `heroFrame`: compare with `near()`, never exact equality.
- A literal `tel:` in tests or docs would trip a naive rule: the rule is `\btel:\s*[+\d]`.
- Never open a mailto in the browser pane (it launches Mail). Test only the stubbed clipboard path.
- Dev server via `preview_start`, never Bash. Screenshots at scale 0.5, once each.
- Submitting to validator.schema.org needs Salvo's explicit yes. The prod deploy needs a heads-up.
- One Netlify deploy only; ask before a second.

## Key paths

- Repo: `~/Projects/dellagana` (public: salvodellagana33-lab/dellagana). main pushed.
- CV source: `~/Downloads/Salvatori_Della-Gana_CV.docx` (contains the phone: never copy it through).
- Netlify site `sh-studios-admin`, id `e27efa17-c0f0-4a74-98fb-d0f40314ad2f` (holds dellagana.uk
  and www). DNS, the iCloud MX records and Cloudflare are never touched.
- LinkedIn: https://www.linkedin.com/in/salvo-della-gana-979638405
- Full design conversation: `~/.claude/projects/-Users-sdg-Projects/112138a8-ff2e-43cc-91a4-8a8a4fc554ac.jsonl`.

---

# Settled plan design (not yet written as the plan)

## Plan header (exact)

- `# dellagana.uk Personal Site Implementation Plan`
- `> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.`
- Then **Goal:**, **Architecture:**, **Tech Stack:**, **Spec:** (path), `## Global Constraints`,
  `## Review Focus`, `---`. Each task: **Files:**, **Interfaces:** (Consumes/Produces), then
  checkbox steps: failing test, run it and see it fail, implement, run it and see it pass, commit.
  Exact code; no placeholders; no "similar to Task N".

## Stack

- Static site, no build step, no libraries: `index.html`, `styles.css`, `main.js` (module), `lib.js`
  (pure helpers imported by main.js and by the tests). `<script type="module" src="main.js">` plus
  `<link rel="modulepreload" href="lib.js">`.
- `package.json`:
  `{"name":"dellagana","private":true,"type":"module","scripts":{"test":"node --test 'tests/*.test.mjs'","check:phone":"node tools/no-phone.mjs","stage":"bash tools/stage.sh"}}`
- **Class gating.** An inline head script adds `js` and
  `setTimeout(() => document.documentElement.classList.add('in'), 3000)`. main.js adds `live` at
  module start, and adds `in` (inside a rAF) once the Archivo font loads or after a 2.5 s race.
  `live` gates the tall heights, row hiding and caption hiding. With no JS all content shows.
- **Contrast on #07090F** (calculated): text about 16, muted #7d8799 about 5.49, name #3d9bff about
  6.95, dim #5a6272 about 3.245 (used only in `.statement .w`, large text 26px+).
- **Tools:** Chrome at `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`; poppler
  (pdftotext, pdfinfo, pdffonts); `magick` with AVIF/WEBP; `textutil`; `netlify`.
- **Preview config** to add to `~/Projects/.claude/launch.json` (pure JSON; add with a node script
  if missing):
  `{"name":"dellagana (static)","runtimeExecutable":"/Users/sdg/.pyenv/shims/python3","runtimeArgs":["-m","http.server","8140","--bind","127.0.0.1","--directory","/Users/sdg/Projects/dellagana"],"port":8140,"url":"http://localhost:8140"}`
- **Lighthouse:**
  `npx --yes lighthouse http://dellagana.uk:8140/ --only-categories=performance,accessibility,seo --output=json --output-path="${TMPDIR:-/tmp}/lh-dellagana.json" --quiet --chrome-flags="--headless=new --host-resolver-rules='MAP dellagana.uk 127.0.0.1'"`
  Scores:
  `node -e 'const r=require(process.argv[1]);for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100));for(const a of["largest-contentful-paint","cumulative-layout-shift","total-blocking-time"])console.log(a,r.audits[a].displayValue)' file`
  If LCP is slow, drop the font race from 2500 to 1000 ms. Fix each failing A11y/SEO audit listed.

## Global Constraints

- No phone anywhere (page, source, PDF, public repo).
- Only Rinse Revive and Kent Chemistry Tutor named; no PK Removals, no Dojo.
- "8 clients", never "8 paying clients". No £14,000 or £2,000 lines; the £1,700 stays.
- No Instagram, no GitHub link. LinkedIn URL as above. First person, plain voice.
- Colours #07090F, #E9EEF6, #7D8799, #3D9BFF; green #22C55E only for Open to work; dim #5A6272
  only for large statement text. Dark only.
- Four self-hosted Latin woff2 fonts. No framework, build step or libraries; one scroll-driven rAF.
- Reduced motion: no pinning, no grain animation, name still, all text visible; CSS and JS gated.
- Phone layout shows Intro, Now and Connect only.
- Title "Salvatori (Salvo) Della-Gana | Web Developer, Southampton"; SEO values as in the spec.
- Deploy: Netlify e27efa17, staged copy only, one `--prod` after a heads-up; DNS, iCloud MX and
  Cloudflare untouched. site-v2 branch; the archive branch is never pushed.
- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100.
- Machine rules: zsh arrays, `curl -q`, the Prettier hook, screenshots at scale 0.5, preview_start,
  the Co-Authored-By trailer. "Other, personal" project: no SH pricing or branding; learnings go in
  `dellagana/docs/learnings.md`.

## Review Focus (each pinned to a task's tests)

1. Phone leaking via PDF text or metadata or the public repo: Task 2 tests (PDF body and Title), the
   pre-commit hook, the history scan, Task 8 CV test, Task 12 stage scan.
2. JS disabled, blocked or crashing hides content: Task 5 inline-script test, Task 6 gating test,
   Task 10 class-removal check.
3. Name fit on narrow, short or ultrawide screens and iOS toolbar resizes: Task 3
   nameSize/shouldRefit tests, Task 10 viewport matrix and toolbar simulation.
4. Email copy with the clipboard denied or missing, or a double click: Task 3 copyOrMail and
   flashLabel tests, Task 10 stubbed click.
5. Reduced motion or low contrast hides text: Task 6 contrast and reduced-motion tests, Task 10
   dump-dom check.

## Tasks

1. **Branch.** (Archive already done, see above.) `git switch -c site-v2`;
   `git push -u origin site-v2`. Note the Cloudflare Workers Builds caveat (the repo is public
   anyway).
2. **Phone guard:** `tools/no-phone.mjs`, `tests/no-phone.test.mjs`, `package.json`, pre-commit
   hook: `printf '#!/bin/sh\nexec "%s" tools/no-phone.mjs\n' "$(command -v node)" > .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`.
   Positive control:
   `textutil -convert txt -stdout ~/Downloads/Salvatori_Della-Gana_CV.docx | node tools/no-phone.mjs --stdin; echo "exit $?"`
   must print exit 1. History: `git log -p --all | node tools/no-phone.mjs --stdin` must exit 0.
3. **lib.js** plus `tests/lib.test.mjs`.
4. **Fonts and images** plus `tests/assets.test.mjs`.
5. **index.html** plus `tests/content.test.mjs` and `tests/helpers.mjs` (FORBIDDEN, norm).
6. **styles.css** plus `tests/css.test.mjs`, plus the DESIGN.md rewrite.
7. **main.js**, the launch.json entry and the first browser check.
8. **cv/cv.html to cv.pdf** plus `tests/cv.test.mjs`.
9. **favicon.svg, apple-touch-icon.png, og.jpg, robots.txt, sitemap.xml, _headers.** Add
   `localRefs` to helpers.mjs; add `tests/site-files.test.mjs` ("every local ref in index.html
   exists", "old assets gone"); `git grep` for references to the old assets, then
   `git rm logo.png og.png og.svg sh-studios-screenshot.png favicon.png`.
10. **Browser checks** across viewports and modes.
11. **Lighthouse** plus a local JSON-LD check.
12. **tools/stage.sh** plus `tests/stage.test.mjs`.
13. **Salvo review gate:** headless desktop.png and phone.png, og.jpg and cv.pdf via SendUserFile;
    the pane stays open at localhost:8140; ask "OK to deploy?" and "OK to submit to
    validator.schema.org after it's live?".
14. **Deploy and live checks.** Pre-flight: `netlify status`, clean git, `npm test`,
    `npm run check:phone`. Primary domain: www must 301 to https://dellagana.uk/; if the apex
    redirects to www, STOP and ask Salvo. Then `stage=$(bash tools/stage.sh)`;
    `node tools/no-phone.mjs "$stage"`;
    `netlify deploy --prod --no-build --dir "$stage" --site e27efa17-c0f0-4a74-98fb-d0f40314ad2f -m "dellagana.uk v2"`.
    Live: curl 200 with the H1; www 301; cv.pdf is application/pdf; fonts cache header; nosniff;
    live Lighthouse; validator if permitted; one headless screenshot to Salvo. One deploy only.
15. **Merge and wrap up:** `git switch main && git pull && git merge --no-ff site-v2 && git push`;
    append the learnings entry with a Bash heredoc; list next steps (Search Console, LinkedIn
    website field, photo, the offer to archive the sh-studios-admin GitHub repo, which needs a yes).

## lib.js (final)

```js
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export function progress(top, height, vh) {
  const span = height - vh
  return span > 0 ? clamp(-top / span, 0, 1) : 0
}
export function heroFrame({ p, vw, vh, cw, ch }) {
  const e = ease(clamp(p / 0.85, 0, 1))
  return {
    n1: -e * 75,
    n2: e * 75,
    factsOpacity: 1 - clamp(p * 3, 0, 1),
    factsY: -p * 60,
    factsHidden: p > 0.34,
    pillOpacity: 1 - clamp(p * 5, 0, 1),
    lift: (1 - e) * 4,
    tilt: -4 * (1 - e),
    scale: 1 + (Math.max(vw / (cw || vw), vh / (ch || vh)) * 1.02 - 1) * e,
    capOpacity: clamp((p - 0.72) / 0.2, 0, 1),
  }
}
export function nameSize({ vw, vh, w100 }) {
  const byW = (100 * vw * 0.965) / w100
  const byH = vh * (vw <= 900 ? 0.2 : 0.36)
  return Math.min(byW, byH)
}
export const shouldRefit = (prev, next) => next.w !== prev.w || Math.abs(next.h - prev.h) >= 150
export const wordOn = (q, count, i) => q * count * 1.15 - i > 0.5
export const splitWords = nodes =>
  nodes.flatMap(n =>
    n.text.trim().split(/\s+/).filter(Boolean).map(w => ({ w, hl: n.name === 'EM' }))
  )
export function flashLabel(el, text, ms = 1600) {
  el.dataset.label ??= el.textContent
  clearTimeout(el._flash)
  el.textContent = text
  el._flash = setTimeout(() => {
    el.textContent = el.dataset.label
  }, ms)
}
export async function copyOrMail({ text, href, clipboard, go }) {
  try {
    await clipboard.writeText(text)
    return true
  } catch {
    go(href)
    return false
  }
}
const london = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', second: '2-digit',
})
export const londonTime = d => london.format(d)
```

## tests/lib.test.mjs values (verified in scratch; use `near()`)

- clamp(-1,0,1)=0; ease(0)=0, ease(1)=1, ease(0.5)=0.5.
- progress: (0,2000,800) 0; (-600,2000,800) 0.5; (-5000,2000,800) 1; (-100,800,800) 0.
- heroFrame at 1280x800 with a 400x250 card: p=0 gives n1 0, lift 4, tilt -4, scale 1, cap 0,
  factsHidden false. p=1 gives n1 -75, n2 75, factsY -60, scale about 3.264, cap 1, factsHidden
  true. p=0.5 gives n1 = -75*ease(0.5/0.85), factsOpacity 0, factsY -30, cap 0. cw=0 gives a
  finite scale.
- nameSize: (390,844,400) about 94.0875; (1280,800,400) 288; (2560,1080,400) 388.8; w100=0 gives
  byH (288 at 1280x800); (900,1000,400) 200; (901,1000,400) about 217.37.
- shouldRefit: 390x844 to 390x760 false; to 844x390 true; 1280x800 to 1280x600 true.
- wordOn: (0.5,10,5) true; (0.5,10,6) false; (0,10,0) false; all on at q=1.
- splitWords: EM words get hl; a whitespace-only node gives [].
- flashLabel with `t.mock.timers.enable({apis:['setTimeout']})`: call, tick 800, call again, tick
  1000, still "Copied ✓"; tick 600, "Email me".
- copyOrMail: resolve gives true; async reject (DOMException NotAllowedError) calls go(href) and
  gives false; a sync throw calls go; clipboard undefined calls go.
- londonTime: 2026-01-15T09:05:07Z gives '09:05:07'; 2026-07-15T09:05:07Z gives '10:05:07'.

## tools/no-phone.mjs (design)

```js
const RUN = /[+\d][\d\s()-]*\d/g
const MOBILE = /^(?:44)?0?7\d{9}$/
export function findPhones(text) {
  const hits = []
  text.split(/\r?\n/).forEach((line, n) => {
    if (/\btel:\s*[+\d]/i.test(line)) hits.push({ line: n + 1, what: 'tel: link' })
    for (const [run] of line.matchAll(RUN)) {
      const groups = run.match(/\d+/g)
      outer: for (let i = 0; i < groups.length; i++) {
        let digits = ''
        for (let j = i; j < groups.length && digits.length < 13; j++) {
          digits += groups[j]
          if (MOBILE.test(digits)) {
            hits.push({ line: n + 1, what: `UK mobile number (${digits.length} digits)` })
            break outer
          }
        }
      }
    }
  })
  return hits
}
```

- `repoFiles()` = `git ls-files -z --cached --others --exclude-standard`, filtered by existsSync
  and isFile. `walk(dir)`. Binary = a NUL in the first 8000 bytes (skipped). PDFs are scanned via
  `pdftotext -q file -` + `pdfinfo file` + `pdfinfo -meta file`. `export function scanFiles(files)`
  returns `[{file,line,what}]`.
- CLI guard: `process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href`. Modes:
  `--stdin`, `<dir>`, or no argument (repo). Prints `file:line: what` to stderr, never the number;
  exit 1 on a hit; clean prints `no-phone: clean (...)`.

## tests/no-phone.test.mjs

- Fixtures built at runtime: `['07700','900','123'].join(' ')` and
  `['+44','7700','900123'].join(' ')`. Positive: spaced, compact, +44, `+44 (0)7700 900123`, in a
  sentence, after `2020-2025 `. Line and digit count: `{line:2, what:'UK mobile number (11 digits)'}`.
  tel rule: `'<a href="' + 'tel' + ':+441234567890">'`.
- Negatives: '£1,700 booked', '2025 – 2027', '1200x750', 'width="1200" height="750"',
  'margin: 0 7px 0 0', 'U+0152-0153', 'salvo-della-gana-979638405', '2026-09-28'.
- Temp dir from mkdtemp, removed in `after` with rmSync. Files: clean.html, leak.html, body.pdf,
  meta.pdf, clean.pdf, photo.png (binary with a NUL, skipped). Expected hits: [body.pdf, leak.html,
  meta.pdf]. CLI on the dir: status 1 and the output has neither the number nor '07700'. `--stdin`
  on clean input exits 0.
- tinyPdf fixture (verified with pdftotext and pdfinfo; write with 'latin1'):

```js
function tinyPdf({ text, title }) {
  const stream = `BT /F1 12 Tf 20 40 Td (${text}) Tj ET`
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 100] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Title (${title}) >>`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xref = pdf.length
  pdf +=
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets.map(o => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return pdf
}
```

## main.js (design)

- Imports progress, heroFrame, nameSize, shouldRefit, wordOn, splitWords, flashLabel, copyOrMail,
  londonTime. `root.classList.add('live')`; `reduce` from matchMedia.
- Split `[data-split]` into `.ch` spans with `--i`, via createElement.
- `fit()`: `nameEl.style.fontSize='100px'`, then
  `nameSize({vw: root.clientWidth, vh: innerHeight, w100: n2.scrollWidth})`, set px,
  `fitted={w:innerWidth,h:innerHeight}`.
- Clock every 1 s, skipped when `document.hidden`: `#clock` full string, `#clock2` `.slice(0,5)`.
- Card cycle every 2600 ms, skipped when reduce, hidden or the hero is off screen (IO on `.hero`):
  remove `was`, `prev.classList.replace('on','was')`, add `on` to next, set `#url` from
  `dataset.url`.
- Statement: `splitWords([...stmt.childNodes].map(n=>({name:n.nodeName,text:n.textContent})))`,
  rebuild as `.w` / `.w hl` spans joined by ' '.
- `let queued=false` before `frame()`. frame applies heroFrame: n1/n2 translateX in vw; facts
  opacity, translateY and `visibility:hidden` when factsHidden; pill opacity; wrap
  `translate(-50%, calc(-50% + ${lift}vh)) rotate(${tilt}deg) scale(${scale})`; cap opacity;
  statement words toggle `on` via wordOn. `schedule()` is a single rAF.
- Reduce: all words get `on`. Otherwise a passive scroll listener. Resize: refit if shouldRefit,
  then schedule unless reduce.
- Rows: IO at threshold .25 adds `seen` then unobserves; `focus` also adds `seen`.
- `[data-copy]` click: with no `navigator.clipboard`, return (native mailto runs). Otherwise
  preventDefault, then copyOrMail({text: href minus 'mailto:', href, clipboard: navigator.clipboard,
  go: url => { location.href = url }}). On success flashLabel(el,'Copied ✓') and `#live` says
  'Email address copied', cleared after 2000 ms.
- Intro: `Promise.race([document.fonts.load("italic 850 100px 'Archivo Display'",'DELLA-GANA'), timeout 2500]).catch(()=>{}).then(()=>{fit(); if(!reduce) frame(); requestAnimationFrame(()=>root.classList.add('in'))})`,
  plus `document.fonts.ready.then(fit)`.

## index.html (design)

- **Head:** `<!doctype html><html lang="en">`, charset, viewport, the exact title. Meta description
  (155 chars, verified): "Salvatori (Salvo) Della-Gana: web developer in Southampton, co-founder
  of SH Studios and sixth-form student, open to a software engineering apprenticeship." Canonical
  https://dellagana.uk/; color-scheme dark; theme-color #07090f; favicon.svg and
  apple-touch-icon.png. og: type profile, site_name, title, description "Web developer in
  Southampton and co-founder of SH Studios, looking for a software engineering apprenticeship.",
  url, image https://dellagana.uk/og.jpg (1200x630), image:alt, locale en_GB, profile:first_name,
  profile:last_name. twitter: summary_large_image, title, description, image. Preload
  fonts/archivo-display.woff2 (crossorigin); styles.css; modulepreload lib.js; the inline js/in
  script; the main.js module.
- **JSON-LD Person:** name "Salvatori Della-Gana"; alternateName [Salvo Della-Gana, Salvo Della
  Gana, Salvatori Della Gana, Della Gana, Dellagana]; givenName, familyName; jobTitle "Web
  Developer"; description; url; email "mailto:salvo@dellagana.uk"; worksFor Organization SH Studios
  https://shstudios.uk/; affiliation EducationalOrganization Barton Peveril Sixth Form College;
  alumniOf King Edward VI School, Southampton; address PostalAddress Southampton GB; knowsAbout
  [React, TypeScript, JavaScript, Web development, UI/UX design]; sameAs [LinkedIn]. No `image`
  until the photo arrives.
- **Body:** `.grain` (aria-hidden), then `<main>`.
  - Hero `.hero > .pin`: the h1 FIRST:
    `<h1 class="name display"><span class="sr">Salvatori (Salvo) Della-Gana</span><span class="line n1" aria-hidden="true" data-split>Salvo</span><span class="line n2" aria-hidden="true" data-split>Della-Gana</span></h1>`.
    Then `.facts` c1 to c5 verbatim from the mockup (`--i` 0 to 15), with Email me as
    `<a class="btn" href="mailto:salvo@dellagana.uk" data-copy>` and LinkedIn as a real link
    (target _blank, rel noopener). `.card-wrap > .card`: 3 `<picture>`s with avif and webp sources
    and a jpg img, srcset 640w/1200w, `sizes="100vw"`, width 1200 height 750, alts, data-url; the
    first img has `class="on"` and `fetchpriority="high"`, the others decoding async; then `.tag`
    with `#url`. `.reveal-cap`; `.scroll-pill` (aria-hidden).
  - Statement (typographic ’, 42 words, 5 highlighted): "I’m Salvo. I study IT, Engineering and
    Business at Barton Peveril, and I co-founded <em>SH Studios,</em> a web design studio with eight
    clients and live sites. I’ve been writing software since I was 13. Now I’m looking for a
    <em>software engineering apprenticeship.</em>"
  - Work: `.work` with `<div class="sec-k"><h2>Selected work</h2><span>03</span></div>`; 3 `a.row`
    (class, then href, target _blank, rel noopener); thumbs with
    `sizes="(max-width: 900px) 100vw, 34vw"`, `alt=""`, lazy, async.
  - CV: `.cv#cv` with
    `<div class="sec-k"><h2>Curriculum vitae</h2><a class="btn" href="cv.pdf" download="Salvatori-Della-Gana-CV.pdf">Download CV</a></div>`,
    then `.cv-grid`:
    - Experience (h3.cv-h): 5 `<details class="job"><summary><span class="t">…</span><span class="o">…</span><span class="when">…</span></summary><ul>…</ul></details>`.
      1. SH Studios: first bullet "Delivered £1,700 of booked work for a client within a day of
         launch: a full rebuild for a mobile car-detailing studio, with a quote-led booking flow I
         designed and coded.", then the 5 CV bullets with em dashes turned into colons.
      2. Cool Move Logistics: 3 bullets. 3. The Chestnut Horse: 1 bullet.
      4. Figurati: "Kept back-of-house running through high-volume service, supporting chefs with
         prep. Left on good terms to take a role closer to my college timetable."
      5. Pryvate: 2 bullets.
    - Education (`.edu`: h4, `.o`, `dl.grades` of div/dt/dd rows, `.note`). Barton Peveril: Website
      Development Distinction; Developing Application Software Merit; Principles of Engineering
      Merit; Business A-Level In progress (note: Year 2 exams January and June 2027). King Edward VI
      GCSEs: CS A, Economics A, Geography A, Triple Science 7, Maths 7, RS short course 7, English
      6/5, French 5; plus the Digital Leader note.
    - Skills: `dl.skills`, dt groups, dd span chips.
    - References note: "Oliver Ferguson (Rinse Revive Detailing), contact details on request.
      Academic reference available from Barton Peveril Sixth Form College."
  - Quote `.quote` as in the mockup; plain-case names, CSS uppercase: `.who` "Oliver Ferguson ·
    Rinse Revive Detailing, Falkirk"; `.who-sm` "Dr Sandip Desai · Kent Chemistry Tutor".
- `</main>`, then `<footer class="otw">`: marquee (aria-hidden), `.big-mail` data-copy, `.foot`
  with 4 divs (LinkedIn ↗ and SH Studios ↗ links, `#clock2`, © line containing "Salvo Della Gana ·
  dellagana.uk"). Then `<div id="live" class="sr" aria-live="polite"></div>`.

## styles.css (design, on top of the mockup CSS)

- 4 `@font-face` with the shared unicode-range and `font-display: swap`, urls `fonts/*.woff2`;
  'Archivo Display' is italic 850 with font-stretch 62%.
- `color-scheme: dark` in :root; `img{display:block}`; `a{color:inherit}`;
  `h1.name{font-size:min(24vw,36vh)}` and `min(24vw,20vh)` at 900px and below (no-JS fallback);
  `.btn` padding 8px 10px; `.thumb picture{display:block;height:100%}`;
  `.sec-k{align-items:center}`; `.sec-k h2{font:inherit;letter-spacing:inherit}`.
- Statement: `.statement em{font-style:normal;color:var(--name)}`;
  `.statement .w{color:var(--dim);transition:color .25s}`; `.statement .w.on{color:var(--text)}`;
  `.statement .w.hl.on{color:var(--name)}`.
- Quote: `.who`, `.who-sm` uppercase; `.who-sm` inline-block, margin-top 14px, mono 12px.
- CV: `.cv{padding:4vh 24px 12vh}`;
  `.cv-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:40px;margin-top:40px}`; `.cv-h`
  like the facts h2 with a blue-dot `::before`; `.job` and `.edu` top border in `--line`;
  `.job summary` grid `1fr auto 14px`, list-style none, marker hidden; `summary::after` '+' in
  column 3 row 1, `.job[open] summary::after` '−'; `.t` 17px/500; `.o`, `.when` mono 12px muted;
  `.when` column 2 row 1; `.job ul` muted 15px/1.55; `.grades` rows flex with a dotted border;
  `.note` muted 14px; `.skills dt` uppercase label; `.skills dd span` chips on `var(--chip)`.
- Drop the `.facts .chip` rule, the theme toggle and data-theme.
- Reduced-motion block must cover `.live .hero`, `.live .statement`, `.pin`, `.statement .stick`,
  `.statement .w`, `.js .facts .l`, `.js h1.name .ch`, `.js .card`, `.live .row`,
  `animation: none !important`, `transition: none !important`.

## Other tests

- **css.test.mjs:** `rules()` via `/([^{}]+)\{([^{}]*)\}/g` after stripping comments;
  `block(src, marker)` brace matcher with an existence assert. Hiding rules
  (`opacity:\s*0\s*(;|$)`, `clip-path:\s*inset\(0 100% 0 0\)`, `translateY\(110%\)`) must have every
  selector matching `/^\.(js|live)\b/`. Reveal selectors exist: `.js.in .facts .l`,
  `.js.in h1.name .ch`, `.js.in .card`, `.live .row.seen`, `.statement .w.on`. Reduced-motion
  overrides present. Contrast: text ≥7, muted ≥4.5, name ≥4.5, dim ≥3, dim is #5a6272.
  `var(--dim)` only in `.statement` rules. 4 @font-face, each with swap and an existing url. No
  fonts.googleapis/gstatic, no data-theme, no prefers-color-scheme.
- **helpers.mjs:**
  `FORBIDDEN = [/instagram/i, /paying clients/i, /14,000/, /£14/, /£2,000/, /github\.com/i, /PK Removals/i, /Dojo/i, /\btel:/i, /onclick=/i, /\bHarry\b/]`;
  `norm = s => s.replace(/\s+/g,' ').trim()`. Task 9 adds `localRefs(html)`: parse
  src/href/srcset (split srcset on ',', first token), skip `https?:`, `mailto:`, `#`, `data:`,
  strip a leading '/'.
- **content.test.mjs:** title, description 120 to 160 chars, canonical, lang; og:image and
  twitter:card; one h1 with the exact sr text; JSON-LD fields; name variants in the body;
  FORBIDDEN; the 3 row hrefs in order with target and noopener; 6 imgs with alt/width/height, the
  first fetchpriority high; LinkedIn; 2 `href="mailto:salvo@dellagana.uk"[^>]*data-copy`; the
  cv.pdf download; 5 `<details`, "eight clients", the 5 employers; inline script has
  `classList.add('js')` and a setTimeout with `add('in')` and 3000; main.js module tag; no
  hard-coded `live` class; no data-theme.
- **assets.test.mjs:** fonts have the `wOF2` magic and are under 200 KB;
  `img/{rinse,kent,f160}-{640,1200}.{avif,webp,jpg}` exist, width via
  `magick identify -format %w`, each under 250 KB, img/ holds only these.
- **cv.test.mjs:** starts `%PDF-`; 1 to 2 pages via pdfinfo; flattened text contains
  SALVATORIDELLA-GANA (/i), salvo@dellagana.uk, dellagana.uk, Barton Peveril; pdffonts shows
  Archivo and Inter; findPhones finds nothing in the text, the pdfinfo output or cv.html; FORBIDDEN
  on the html and the text.
- **stage.test.mjs:** the stage holds exactly the file list plus img/* and fonts/*; absent: docs,
  .superpowers, .wrangler, DESIGN.md, wrangler.jsonc, tests, tools, cv, package.json, .git,
  node_modules; every localRef in the staged index resolves; no-phone on the stage exits 0; rmSync
  in `after`.

## Assets

- Fonts (`curl -fsS -o`):
  - `https://fonts.gstatic.com/s/archivo/v25/k3kSo8UDI-1M0wlSfdzYLGHEA6CF8Q.woff2` to
    fonts/archivo-display.woff2
  - `https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAjjH7Motmp5g.woff2`
    to fonts/instrument-serif-italic.woff2
  - `https://fonts.gstatic.com/s/intertight/v9/NGSwv5HMAFg6IuGlBNMjxLsH8ahuQ2e8.woff2` to
    fonts/inter-tight.woff2
  - `https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwgknk-4.woff2`
    to fonts/jetbrains-mono.woff2
  - Fallback: the css2 API with a Chrome UA
    (`family=Archivo:ital,wdth,wght@1,62,850&family=Instrument+Serif:ital@1&family=Inter+Tight:wght@300..500&family=JetBrains+Mono:wght@400..500`),
    latin blocks.
- Images, in bash, from the `.superpowers` content folder: `magick src -resize ${w}x -strip -quality 55 x.avif`,
  webp at quality 72, jpg at quality 78 with `-sampling-factor 4:2:0 -interlace JPEG`.
- **cv/cv.html:** A4 print page using ../fonts: Archivo h1 in blue #1f6fd1 at 34pt, Inter Tight body
  at 9.6pt, mono meta; `@page{size:A4;margin:13mm 15mm}`; `.job{break-inside:avoid}`. Sections:
  header (name; "Web Developer · Co-Founder, SH Studios · Sixth-Form Student"; contact line without
  the phone), Profile (verbatim), Key achievements (3, verbatim, no £14k), Experience (5), Education
  (2), Skills dl, Projects (3), References (2 quotes plus the note). Title "Salvatori Della-Gana CV".
  Generate:
  `"$chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf="$PWD/cv.pdf" http://127.0.0.1:8140/cv/cv.html`.
- **favicon.svg:**
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#07090F"/><circle cx="16" cy="16" r="7" fill="#3D9BFF"/></svg>`
- **apple-touch-icon:**
  `magick -size 180x180 xc:'#07090F' -fill '#3D9BFF' -draw 'circle 90,90 90,50' apple-touch-icon.png`
- **og.jpg:**
  `"$chrome" --headless=new --hide-scrollbars --force-prefers-reduced-motion --window-size=1200,630 --virtual-time-budget=5000 --screenshot="$raw" http://127.0.0.1:8140/`,
  then `magick "$raw" -resize '1200x630^' -gravity north -extent 1200x630 -strip -quality 85 og.jpg`.
- **robots.txt:** `User-agent: *` / `Allow: /` / `Sitemap: https://dellagana.uk/sitemap.xml`.
  **sitemap.xml:** one URL, lastmod set to the build date.
- **_headers:** `/fonts/*` Cache-Control `public, max-age=31536000, immutable`; `/img/*`
  `public, max-age=604800`; `/*` X-Content-Type-Options nosniff and Referrer-Policy
  strict-origin-when-cross-origin.
- **tools/stage.sh:**

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
out=$(mktemp -d "${TMPDIR:-/tmp}/dellagana-stage.XXXXXX")
files=(index.html styles.css main.js lib.js cv.pdf og.jpg favicon.svg apple-touch-icon.png robots.txt sitemap.xml _headers)
cp "${files[@]}" "$out/"
cp -R img fonts "$out/"
find "$out" -name .DS_Store -delete
echo "$out"
```

## Browser checks (javascript_tool with top-level await)

- **Task 7:** classes 'js live in'; 15 `.ch`; 42 `.w`; 5 `.w.hl`; Archivo loaded. Scroll to the
  statement end: 42 on; at the top: 0 on (rAF needs the pane visible). At the hero end the card
  covers the viewport and the caption opacity is 1. Console errors; one screenshot at scale 0.5.
- **Task 10:** sizes 390x844, 1280x800, 1280x600, 1920x1080, 2560x1080: no sideways scroll, n1 and
  n2 inside, n1 clear of the facts (fix: `.n1{top:max(25vh,170px)}`), no broken images, `.c3`
  display none at 390. Toolbar: 390x844 to 390x760 keeps the font size; to 844x390 changes it.
  Keyboard: Tab reaches Email me, LinkedIn, then row 1, each with a solid outline. Clipboard
  (success path only, stubbed): abort if there is no `navigator.clipboard`; stub
  `navigator.clipboard.writeText = async () => {}`, click: label 'Copied ✓', live 'Email address
  copied'; double click: after 1.8 s the label is back to 'Email me'. No-JS: set `className=''`,
  then clipPath none, transform none, card and row opacity 1, hero height about the viewport;
  reload after. Reduced motion: headless
  `--force-prefers-reduced-motion --virtual-time-budget=4000 --dump-dom`, then
  `grep -o 'class="w[^"]*"' | sort | uniq -c` expects 37 `w on` and 5 `w hl on`. Screenshots at
  390 and 1280, scale 0.5. Reset with preset desktop.

## DESIGN.md (rewrite in Task 6)

A tokens table, the type roles, the motion and gating rules, the phone layout, and the
no-phone/no-libraries rules. It replaces "Midnight Technical" (archived on the local branch).
