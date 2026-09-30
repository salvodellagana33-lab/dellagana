// Renders the generated files that ship: cv.pdf, og.jpg, favicon.png, apple-touch-icon.png.
// Needs Chromium and playwright-core (npm i -D playwright-core), and the site served locally:
//   npx serve -l 8080 .   (or any static server)   then   node tools/render-assets.mjs
// Set CHROME_PATH if Chromium is not where Playwright expects it.
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = process.env.SITE_URL || 'http://localhost:8080/'
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {})

// cv.pdf from docs/cv/cv-source.html (phone number never in the source).
{
  const page = await browser.newPage()
  await page.goto(new URL('docs/cv/cv-source.html', site).href, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.pdf({ path: path.join(root, 'cv.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true })
  await page.close()
}

// og.jpg: the hero at 1200x630 once the letters have landed.
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(site, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: '.grain,.scroll-pill{display:none!important}' })
  await page.waitForTimeout(3200)
  await page.screenshot({ path: path.join(root, 'og.jpg'), type: 'jpeg', quality: 86 })
  await page.close()
}

// PNG icons from favicon.svg.
for (const [file, size] of [['favicon.png', 32], ['apple-touch-icon.png', 180]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.goto(site)
  await page.setContent(`<style>html,body{margin:0;background:#07090f}</style><img src="${new URL('favicon.svg', site).href}" width="${size}" height="${size}">`)
  await page.waitForTimeout(200)
  await page.screenshot({ path: path.join(root, file), omitBackground: false })
  await page.close()
}

await browser.close()
console.log('Wrote cv.pdf, og.jpg, favicon.png, apple-touch-icon.png')
