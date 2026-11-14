// Motion check for the scroll reveals on michaelcantow.com.
//   serve the site folder locally (python3 -m http.server), then
//   node tools/check_motion.cjs <address of index.html>
// Needs Node 18+ and puppeteer-core (npm i puppeteer-core); set CHROME to your
// Chrome or Chromium binary if it is not in the usual place.
// Runs the page at desktop, tablet and phone sizes, scrolls it top to bottom at a
// reading pace and at a flick, and FAILS (exit 1) when the reveal motion drifts:
//   order     pieces revealing together must cascade in reading order AS LAID OUT
//             (top to bottom, then left to right) - catches desktop-ordered delays
//             left on a restacked phone layout
//   unseen    a piece must not start revealing while it is still below the screen
//             (a tall block revealed as one unit: mark it data-rv-each)
//   overlap   desktop/tablet: two sections never mid-reveal on screen at once;
//             phone: a new section starts at least 250ms after the previous one
//   tall      a reveal unit may not be taller than 75% of the screen (same fix)
//   handset   no hand-written delays (style="--rd:...") in the markup
//   complete  every piece is revealed by the end, and no page errors
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(p => fs.existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const url = process.argv[2];
if (!url) { console.error('usage: node check_motion.cjs <page url>'); process.exit(2); }
const SIZES = [['desktop', 1440, 900, false], ['tablet', 820, 1180, true], ['phone', 393, 852, true]];
const PACES = [['reading', 12], ['flick', 90]];

(async () => {
  const fails = [];
  const html = await (await fetch(url)).text();
  const handset = (html.match(/style="[^"]*--rd\s*:/g) || []).length;
  if (handset) fails.push(`handset: ${handset} hand-written reveal delay(s) in the markup; delete them, the order comes from the layout`);

  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  for (const [size, W, H, touch] of SIZES) for (const [pace, step] of PACES) {
    const tag = `${size} ${W}x${H} ${pace}`;
    const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.setViewport({ width: W, height: H, deviceScaleFactor: 1, isMobile: touch, hasTouch: touch });
    await p.goto(url, { waitUntil: 'load' }); await sleep(2500);
    await p.evaluate(() => {
      const L = window.__m = { starts: [], overlapFrames: 0, pairs: {}, tall: [] };
      const name = el => { const s = el.closest('main > section'); return s ? (s.id || 'section') : 'page'; };
      const label = el => (el.className || el.tagName).toString().replace(/\b(rv|in)\b/g, '').trim().slice(0, 28) || el.tagName.toLowerCase();
      const all = [...document.querySelectorAll('.rv')];
      all.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.height > innerHeight * 0.75) L.tall.push(`${name(el)} › ${label(el)} (${Math.round(r.height)}px)`);
        if (el.classList.contains('in')) return;
        new MutationObserver((m, o) => {
          if (!el.classList.contains('in')) return; o.disconnect();
          const rr = el.getBoundingClientRect();
          const rd = parseFloat(el.style.getPropertyValue('--rd')) || 0;
          L.starts.push({ sec: name(el), what: label(el), t: performance.now() + rd, top: rr.top + scrollY, left: rr.left + scrollX, h: rr.height, onScreen: rr.bottom > 0 && rr.top < innerHeight, below: rr.top >= innerHeight, sy: scrollY, vh: innerHeight });
        }).observe(el, { attributes: true, attributeFilter: ['class'] });
      });
      const f = () => {
        const mid = new Set();
        all.forEach(el => { if (!el.classList.contains('in')) return; const r = el.getBoundingClientRect(); if (!r.height || r.bottom <= 0 || r.top >= innerHeight) return;
          const o = +getComputedStyle(el).opacity; if (o > 0.02 && o < 0.98) mid.add(name(el)); });
        if (mid.size > 1) { L.overlapFrames++; const k = [...mid].join(' + '); L.pairs[k] = (L.pairs[k] || 0) + 1; }
        requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    });
    const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= max; y += step) { await p.evaluate(v => scrollTo(0, v), y); await sleep(16); }
    await p.evaluate(v => scrollTo(0, v), max);
    await sleep(5000);
    const m = await p.evaluate(() => { const left = [...document.querySelectorAll('.rv:not(.in)')].filter(el => el.getBoundingClientRect().height).length; return { ...__m, left }; });
    const local = [];
    // order: within one section, among pieces that started on screen within the same cascade window,
    // a piece clearly lower on the page (or same row, further right) must not start before one above/left of it (page coordinates)
    const on = m.starts.filter(s => s.onScreen);
    for (const a of on) for (const c of on) {
      if (a === c || a.sec !== c.sec || Math.abs(a.t - c.t) > 600) continue;
      const tol = Math.min(24, Math.min(a.h, c.h) / 2);
      const cAfter = Math.abs(a.top - c.top) <= tol ? c.left > a.left + 1 : c.top > a.top + tol;
      if (cAfter && c.t < a.t - 5) local.push(`order: in ${a.sec}, "${c.what}" started ${Math.round(a.t - c.t)}ms before "${a.what}", which sits above/left of it`);
    }
    m.starts.filter(s => s.below).forEach(s => local.push(`unseen: in ${s.sec}, "${s.what}" started revealing while still below the screen`));
    if (W > 720) { if (m.overlapFrames) local.push(`overlap: ${m.overlapFrames} frames with two sections revealing at once (${Object.keys(m.pairs).join(', ')})`); }
    else {
      const firsts = {}; on.forEach(s => { if (!(s.sec in firsts) || s.t < firsts[s.sec].t) firsts[s.sec] = s; });
      const lastStart = {}; on.forEach(s => { lastStart[s.sec] = Math.max(lastStart[s.sec] || 0, s.t); });
      on.forEach(s => Object.keys(firsts).forEach(k => { const f = firsts[k]; if (k !== s.sec && f.t > s.t && f.t - s.t < 250 && s.top + s.h - f.sy > 40 && s.top - f.sy < f.vh - 40) local.push(`overlap: ${k} started ${Math.round(f.t - s.t)}ms after a piece of ${s.sec} (needs 250ms)`); }));
    }
    if (pace === 'reading') m.tall.forEach(t => local.push(`tall: ${t} is one reveal taller than 75% of the screen; mark its parent data-rv-each`));
    if (m.left) local.push(`complete: ${m.left} piece(s) never revealed`);
    if (errs.length) local.push(`complete: page errors: ${errs.join(' | ')}`);
    const uniq = [...new Set(local)];
    console.log(`${uniq.length ? 'FAIL' : 'ok  '}  ${tag.padEnd(28)} ${m.starts.length} reveals` + (uniq.length ? '\n      ' + uniq.slice(0, 8).join('\n      ') + (uniq.length > 8 ? `\n      … ${uniq.length - 8} more` : '') : ''));
    uniq.forEach(u => fails.push(`${tag}: ${u}`));
    await p.close();
  }
  await b.close();
  console.log(fails.length ? `\nMOTION CHECK FAILED: ${fails.length} problem(s)` : '\nMOTION CHECK PASSED');
  process.exit(fails.length ? 1 : 0);
})();
