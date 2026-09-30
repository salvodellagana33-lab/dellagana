// dellagana.uk: one scroll-driven requestAnimationFrame loop, no libraries.
// Everything that repeats (the loop, the clock, the card cycle, CSS loops) stops while the tab is hidden.
;(() => {
  'use strict'

  const root = document.documentElement
  const $ = (s, r = document) => r.querySelector(s)
  const $$ = (s, r = document) => [...r.querySelectorAll(s)]
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
  let reduce = motionQuery.matches

  /* ---------- Giant name: split into letters for the rise-in ---------- */
  $$('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent]
      .map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`)
      .join('')
  })

  /* ---------- Statement: one span per word, key phrases in blue ---------- */
  const words = (() => {
    const p = $('[data-words]')
    if (!p) return []
    p.innerHTML = [...p.childNodes]
      .map(n => {
        const hl = n.nodeName === 'EM'
        return n.textContent
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map(w => (hl ? `<em class="w">${w}</em>` : `<span class="w">${w}</span>`))
          .join(' ')
      })
      .filter(Boolean)
      .join(' ')
    return $$('.w', p)
  })()

  /* ---------- Southampton clock ---------- */
  const clocks = $$('.clock')
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  })
  const tick = () => {
    const t = fmt.format(new Date())
    clocks.forEach(c => (c.textContent = 'seconds' in c.dataset ? t : t.slice(0, 5)))
  }

  /* ---------- Hero card: projects wipe in like film cuts ---------- */
  const slides = $$('.card .slide')
  const tagUrl = $('.tag__url')
  let cur = 0
  const nextSlide = () => {
    if (reduce || heroZoomed || slides.length < 2) return
    const prev = slides[cur]
    cur = (cur + 1) % slides.length
    slides.forEach(s => s.classList.remove('was'))
    prev.classList.replace('on', 'was')
    slides[cur].classList.add('on')
    if (tagUrl) tagUrl.textContent = slides[cur].dataset.url
  }

  /* ---------- Timers that pause with the tab ---------- */
  let clockTimer = 0
  let slideTimer = 0
  const startTimers = () => {
    tick()
    clearInterval(clockTimer)
    clearInterval(slideTimer)
    clockTimer = setInterval(tick, 1000)
    slideTimer = setInterval(nextSlide, 2600)
  }
  const stopTimers = () => {
    clearInterval(clockTimer)
    clearInterval(slideTimer)
  }

  /* ---------- The scroll loop ---------- */
  const hero = $('.hero')
  const wrap = $('.card-wrap')
  const facts = $('.facts')
  const cap = $('.reveal-cap')
  const pill = $('.scroll-pill')
  const n1 = $('.n1')
  const n2 = $('.n2')
  const bar = $('.bar')
  const stmt = $('.statement')
  let heroZoomed = false
  let raf = 0
  let idle = 0
  let last = ''

  function frame() {
    raf = 0
    const vw = innerWidth
    const vh = innerHeight
    const r = hero.getBoundingClientRect()
    const state = `${r.top}|${vw}|${vh}`

    bar.classList.toggle('show', r.bottom <= vh * 0.35)

    if (!reduce) {
      const p = clamp(-r.top / (r.height - vh), 0, 1)
      const e = ease(clamp(p / 0.85, 0, 1))
      heroZoomed = p > 0.2
      n1.style.transform = `translateX(${-e * 75}vw)`
      n2.style.transform = `translateX(${e * 75}vw)`
      facts.style.opacity = 1 - clamp(p * 3, 0, 1)
      facts.style.transform = `translateY(${-p * 60}px)`
      facts.style.visibility = p > 0.34 ? 'hidden' : ''
      if (pill) pill.style.opacity = 1 - clamp(p * 5, 0, 1)
      const cw = wrap.offsetWidth
      const ch = wrap.offsetHeight
      const s = 1 + (Math.max(vw / cw, vh / ch) * 1.02 - 1) * e
      wrap.style.transform = `translate(-50%, calc(-50% + ${(1 - e) * 4}vh)) rotate(${-4 * (1 - e)}deg) scale(${s})`
      wrap.style.setProperty('--z', clamp((e - 0.15) / 0.45, 0, 1).toFixed(3))
      cap.style.opacity = clamp((p - 0.72) / 0.2, 0, 1)

      // Statement: words light up in order as it scrolls through.
      if (words.length) {
        const sr = stmt.getBoundingClientRect()
        const lit = clamp(-sr.top / (stmt.offsetHeight - vh), 0, 1) * words.length * 1.15
        words.forEach((w, i) => w.classList.toggle('on', lit - i > 0.5))
      }
    }

    // Keep running while things move; stop after a few still frames.
    idle = state === last ? idle + 1 : 0
    last = state
    if (idle < 4 && !document.hidden) raf = requestAnimationFrame(frame)
  }
  const kick = () => {
    idle = 0
    if (!raf && !document.hidden) raf = requestAnimationFrame(frame)
  }
  addEventListener('scroll', kick, { passive: true })
  addEventListener('resize', kick, { passive: true })

  const resetMotion = () => {
    ;[n1, n2, facts, wrap, cap, pill].forEach(el => el && el.removeAttribute('style'))
    words.forEach(w => w.classList.add('on'))
  }
  motionQuery.addEventListener?.('change', e => {
    reduce = e.matches
    if (reduce) resetMotion()
    kick()
  })

  /* ---------- Tab hidden: stop everything ---------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      root.classList.add('paused')
      cancelAnimationFrame(raf)
      raf = 0
      stopTimers()
    } else {
      root.classList.remove('paused')
      startTimers()
      kick()
    }
  })

  /* ---------- Work rows slide up as they arrive ---------- */
  const rows = $$('.row')
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(
      es =>
        es.forEach(e => {
          if (!e.isIntersecting) return
          e.target.classList.add('seen')
          io.unobserve(e.target)
        }),
      { threshold: 0.2 },
    )
    rows.forEach(r => io.observe(r))
  } else {
    rows.forEach(r => r.classList.add('seen'))
  }

  /* ---------- Email: copy on click, fall back to mailto ---------- */
  const announce = $('#announce')
  $$('[data-copy]').forEach(a =>
    a.addEventListener('click', async ev => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || !navigator.clipboard || !isSecureContext) return
      ev.preventDefault()
      const label = $('.big-mail__txt', a) || a
      try {
        await navigator.clipboard.writeText(a.dataset.copy)
      } catch {
        location.href = a.href
        return
      }
      const old = label.dataset.text || label.textContent
      label.dataset.text = old
      label.textContent = 'Copied ✓'
      announce.textContent = `Email address ${a.dataset.copy} copied to the clipboard.`
      clearTimeout(a._t)
      a._t = setTimeout(() => {
        label.textContent = old
        announce.textContent = ''
      }, 1800)
    }),
  )

  /* ---------- Start ---------- */
  if (reduce) words.forEach(w => w.classList.add('on'))
  const start = () => {
    root.classList.add('in')
    kick()
  }
  startTimers()
  if (reduce) start()
  else {
    // Wait for the display face so the letters rise in the right shape, but never for long.
    Promise.race([document.fonts.load('850 italic 1em "Archivo Condensed"'), new Promise(r => setTimeout(r, 900))])
      .catch(() => {})
      .then(() => requestAnimationFrame(start))
  }
  frame()
})()
