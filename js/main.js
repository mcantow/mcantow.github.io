/* ═══════════════════════════════════════════════════════════════
   Michael Cantow · main.js
   Motion: cursor, reveals, magnetics, canvas node network, marquee
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ──────────── Footer year ──────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ──────────── Theme toggle (persists in localStorage) ──────────── */
  const THEME_KEY = 'mc-theme';
  const root = document.documentElement;
  // Apply stored theme on load (overrides whatever class HTML shipped with)
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') root.classList.add('theme-dark');
    else if (stored === 'light') root.classList.remove('theme-dark');
  } catch (e) { /* localStorage may be unavailable */ }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.toggle('theme-dark');
      try { localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light'); } catch (e) {}
    });
  }

  /* ──────────── Role odometer (whole-word cinematic transition) ──────────── */
  document.querySelectorAll('.role-flip').forEach(el => {
    const roles = (el.dataset.roles || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!roles.length) return;

    el.innerHTML = roles
      .map((r, i) => `<span class="${i === 0 ? 'is-active' : ''}">${r}</span>`)
      .join('');

    if (prefersReducedMotion) return;

    const items = el.querySelectorAll(':scope > span');
    let idx = 0;
    const cycle = () => {
      const next = (idx + 1) % items.length;
      items[idx].classList.remove('is-active');
      items[idx].classList.add('is-out');
      items[next].classList.remove('is-out');
      // Small delay so the outgoing word starts leaving before the new one enters
      setTimeout(() => items[next].classList.add('is-active'), 140);
      idx = next;
    };
    setTimeout(() => {
      cycle();
      setInterval(cycle, 2600);
    }, 2200);
  });

  /* ──────────── Nav hide on scroll down, show on scroll up ──────────── */
  const nav = document.getElementById('nav');
  let lastY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    if (!nav) return;
    const hide = y > lastY && y > 200;
    nav.classList.toggle('hidden', hide);
    // Mirror state on <html> so things like the mobile sticky tracker
    // can slide up to fill the space when the nav hides
    document.documentElement.classList.toggle('nav-hidden', hide);
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ──────────── Reveal on scroll (premium variants + auto-stagger) ──────────── */
  // Auto-assign --i to children of .reveal-stagger parents so their CSS
  // transition-delay cascades naturally (no manual numbering needed).
  document.querySelectorAll('.reveal-stagger').forEach(parent => {
    let i = 0;
    Array.from(parent.children).forEach(child => {
      if (child.matches('.reveal, .reveal-card, .reveal-left, .reveal-right')) {
        child.style.setProperty('--i', i++);
      }
    });
  });

  const revealSelectors = '.reveal, .reveal-card, .reveal-left, .reveal-right, .reveal-shimmer, .journey-bridge';
  const reveals = document.querySelectorAll(revealSelectors);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay || '0', 10);
          if (delay) {
            setTimeout(() => entry.target.classList.add('is-visible'), delay);
          } else {
            entry.target.classList.add('is-visible');
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ──────────── Card tilt (glass cards) ──────────── */
  if (isFinePointer && !prefersReducedMotion) {
    const tiltables = document.querySelectorAll('[data-tilt]');
    tiltables.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
    });
  }

  /* ──────────── Mouse-driven tilt (CN journey card) ────────────
     The cursor's position over the container drives the card's rotateX/Y.
     Spring-eased for buttery hand-feel. Pauses the ambient float anim on enter,
     restores it on leave. */
  if (isFinePointer && !prefersReducedMotion) {
    const tiltEls = document.querySelectorAll('[data-mouse-tilt]');
    tiltEls.forEach(container => {
      const card = container.querySelector('.cn-journey-card');
      if (!card) return;

      let rafId = null;
      let targetRX = 0, targetRY = 0;
      let curRX = 0, curRY = 0;
      let active = false;

      const animate = () => {
        // Easing toward target (spring-ish lerp)
        curRX += (targetRX - curRX) * 0.12;
        curRY += (targetRY - curRY) * 0.12;
        card.style.transform =
          `rotateY(${curRY.toFixed(2)}deg) rotateX(${curRX.toFixed(2)}deg) translateY(${active ? -2 : 0}px)`;
        if (active || Math.abs(targetRX - curRX) > 0.05 || Math.abs(targetRY - curRY) > 0.05) {
          rafId = requestAnimationFrame(animate);
        } else {
          // Settled — restore the floating animation
          card.style.transform = '';
          card.style.animation = '';
          rafId = null;
        }
      };

      container.addEventListener('mouseenter', () => {
        active = true;
        card.style.animation = 'none'; // pause ambient float
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 .. 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetRY = -x * 14;  // horizontal cursor → rotateY (±7°)
        targetRX =  y * 10;  // vertical cursor → rotateX (±5°)
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
      container.addEventListener('mouseleave', () => {
        active = false;
        targetRX = 0;
        targetRY = 0;
        if (!rafId) rafId = requestAnimationFrame(animate);
      });
    });
  }

  /* ──────────── Particle-network canvas (reusable) ────────────
     Connected-nodes background with mouse interaction. Used in hero AND
     contact section (bookends the page). Theme-aware via MutationObserver. */
  const setupNetworkCanvas = (canvas, opts = {}) => {
    if (!canvas || prefersReducedMotion) return;
    const densityMobile  = opts.densityMobile  ?? 28;
    const densityDesktop = opts.densityDesktop ?? 64;
    const linkDist = opts.linkDist ?? 130;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let nodes = [];
    let mouse = { x: -9999, y: -9999, active: false };

    let nodeFill, lineBase;
    const updateThemeColors = () => {
      const isDark = document.documentElement.classList.contains('theme-dark');
      nodeFill = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,11,0.5)';
      lineBase = isDark ? 'rgba(143, 184, 255,'   : 'rgba(120, 115, 245,';
    };
    updateThemeColors();
    new MutationObserver(updateThemeColors).observe(document.documentElement, {
      attributes: true, attributeFilter: ['class'],
    });

    const makeNode = (W, H) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1.4 + Math.random() * 1.6,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const newW = rect.width, newH = rect.height;
      if (newW < 4 || newH < 4) return;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targetCount = newW < 768 ? densityMobile : densityDesktop;
      if (nodes.length === 0) {
        for (let i = 0; i < targetCount; i++) nodes.push(makeNode(newW, newH));
      } else {
        if (w > 0 && h > 0) {
          const sx = newW / w, sy = newH / h;
          for (const n of nodes) { n.x *= sx; n.y *= sy; }
        }
        while (nodes.length < targetCount) nodes.push(makeNode(newW, newH));
        if (nodes.length > targetCount) nodes.length = targetCount;
      }
      w = newW; h = newH;
    };

    let ready = false;
    const markReady = () => {
      if (ready) return;
      ready = true;
      canvas.classList.add('is-ready');
    };
    const remeasure = () => { resize(); if (w > 4 && h > 4) markReady(); };

    let lastW = 0, lastH = 0, stableFrames = 0, attempts = 0;
    const settle = () => {
      const rect = canvas.getBoundingClientRect();
      const sameW = Math.abs(rect.width - lastW) < 1;
      const sameH = Math.abs(rect.height - lastH) < 1;
      if (rect.width > 4 && rect.height > 4 && sameW && sameH) {
        stableFrames++;
        if (stableFrames >= 2) { remeasure(); return; }
      } else { stableFrames = 0; }
      lastW = rect.width; lastH = rect.height;
      if (++attempts < 180) requestAnimationFrame(settle);
      else remeasure();
    };
    requestAnimationFrame(settle);

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(remeasure).observe(canvas);
    } else {
      window.addEventListener('resize', remeasure);
    }
    window.addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', remeasure);

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.active = false; mouse.x = -9999; mouse.y = -9999;
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (mouse.active) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 14400) {
            const force = (14400 - dist2) / 14400 * 0.06;
            n.x += dx * force; n.y += dy * force;
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const alpha = (1 - Math.sqrt(d2) / linkDist) * 0.4;
            ctx.strokeStyle = `${lineBase}${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        if (mouse.active) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            const alpha = (1 - d / 180) * 0.55;
            ctx.strokeStyle = `${lineBase}${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = nodeFill;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };

  // Hero — full network with mouse interaction
  setupNetworkCanvas(document.getElementById('heroCanvas'));
  // Contact (page closing bookend) — slightly less dense than hero
  setupNetworkCanvas(document.getElementById('contactCanvas'), {
    densityMobile: 22, densityDesktop: 50, linkDist: 140,
  });

  /* ──────────── CustomerNode journey mockup: circle → stage detail → loop ──────────── */
  const journeyMockup = document.getElementById('cnJourneyMockup');
  if (journeyMockup) {
    const journeyBody = document.getElementById('cnJourneyBody');
    const ovNodes = Array.from(journeyMockup.querySelectorAll('.ov-node'));
    const ovTitle = document.getElementById('cnOverviewTitle');
    const ovProgress = document.getElementById('cnOverviewProgress');
    const donutText = document.getElementById('cnDonutText');
    const ringProgress = document.getElementById('cnRingProgress');
    const progressCurrentEl = journeyMockup.querySelector('.progress-current');
    const detailTitle = document.getElementById('cnDetailTitle');
    const detailStep = document.getElementById('cnDetailStep');
    const detailBack = journeyMockup.querySelector('.detail-back');
    const panels = Array.from(journeyMockup.querySelectorAll('.stage-panel'));
    const agentLabel = document.getElementById('cnAgentLabel');
    const nextActionEl = document.getElementById('cnNextAction');
    const calloutAction = journeyMockup.querySelector('.cn-callout-action');
    const calloutLabel = calloutAction ? calloutAction.querySelector('.callout-label') : null;
    const total = ovNodes.length;
    const minActive = 2;

    const stageNames = ['Discovery', 'Experience', 'Scope', 'Commit', 'Deploy', 'Success'];
    const stageDetailHeaders = [
      'DISCOVERY · questionnaire',
      'EXPERIENCE · curated content',
      'SCOPE · solution configuration',
      'COMMIT · master service agreement',
      'DEPLOY · launch tickets',
      'SUCCESS · health & outcomes',
    ];
    // Agent narration: 2 lines per stage (working, then complete)
    const agentScript = [
      ['Agent is filling answers from your last call',     'Agent finalized the questionnaire — review ready'],
      ['Agent is curating content tailored to discovery',  'Agent assembled 3 personalized assets'],
      ['Agent is pre-configuring scope from similar deals','Agent locked the configuration — ready for review'],
      ['Agent drafted the MSA from your approved template','Agent collected both signatures — countersigned'],
      ['Agent is handling integration tickets in parallel','Agent finished all deployment tasks'],
      ['Agent is monitoring health and resolving tickets', 'Agent: customer is healthy, expansion signal detected'],
    ];
    const nextActions = [
      'Lock the success criteria with the CFO',
      'Walk security through the architecture',
      'Commit to phase-1 outcomes by Friday',
      'Clear the redlines with Acme counsel',
      'Hit the first activation milestone',
      'Trigger the expansion play in Q3',
    ];
    const fpaiActions = [
      'First Party AI is mapping the decision committee',
      'First Party AI is staging the architecture proof',
      'First Party AI is drafting the outcome contract',
      'First Party AI is reconciling the redlines',
      'First Party AI is orchestrating the kickoff',
      'First Party AI is firing the expansion play',
    ];

    let activeIdx = 2;
    let cycleCount = 0;
    let view = 'overview'; // 'overview' | 'detail' | 'success'
    let pending = [];
    let visible = false;

    const clearPending = () => { pending.forEach(id => clearTimeout(id)); pending = []; };
    const wait = (ms, fn) => { const id = setTimeout(fn, ms); pending.push(id); return id; };

    // Smoothly swap text on an element: fade-out → set → fade-in
    const swapText = (el, text) => {
      if (!el || el.textContent === text) return;
      el.classList.add('is-text-swap');
      setTimeout(() => {
        el.textContent = text;
        requestAnimationFrame(() => el.classList.remove('is-text-swap'));
      }, 200);
    };

    const setNextAction = (idx, aiMode) => {
      if (!calloutAction) return;
      if (aiMode) {
        calloutAction.classList.add('is-ai');
        // Restart the takeover sweep animation by re-mounting the ::before
        calloutAction.style.animation = 'none';
        calloutAction.offsetHeight; // force reflow
        calloutAction.style.animation = '';
        swapText(calloutLabel, 'FIRST PARTY AI');
        swapText(nextActionEl, fpaiActions[idx]);
      } else {
        calloutAction.classList.remove('is-ai');
        swapText(calloutLabel, 'NEXT ACTION');
        swapText(nextActionEl, nextActions[idx]);
      }
    };

    const renderRing = () => {
      const offset = 100 - (activeIdx / total) * 100;
      if (ovProgress) ovProgress.setAttribute('stroke-dashoffset', String(offset));
      if (ringProgress) ringProgress.setAttribute('stroke-dashoffset', String(offset));
      if (donutText) donutText.textContent = `${activeIdx + 1}/${total}`;
      swapText(progressCurrentEl, String(activeIdx + 1));
      swapText(ovTitle, stageNames[activeIdx]);
    };

    const renderNodes = () => {
      ovNodes.forEach((n, i) => {
        n.classList.remove('is-done', 'is-active', 'is-upcoming');
        if (i < activeIdx) n.classList.add('is-done');
        else if (i === activeIdx) n.classList.add('is-active');
        else n.classList.add('is-upcoming');
      });
    };

    const showOverview = () => {
      view = 'overview';
      journeyBody.classList.remove('is-detail', 'is-success');
      renderRing();
      renderNodes();
      if (!prefersReducedMotion && visible) {
        wait(2400, openDetail);
      }
    };

    /* ── Per-stage "play" sequences (animate the work happening) ── */
    const resetPanel = (panel) => {
      panel.querySelectorAll('.qq-row').forEach(r => {
        r.classList.remove('is-typing', 'is-done');
        const a = r.querySelector('.qq-a');
        if (a) a.textContent = '';
      });
      panel.querySelectorAll('.cc-card').forEach(c => c.classList.add('is-loading'));
      panel.querySelectorAll('.cfg-row').forEach(r => r.classList.remove('cfg-on'));
      panel.querySelectorAll('.toggle').forEach(t => t.classList.remove('is-on'));
      const seats = panel.querySelector('.cfg-value');
      if (seats) seats.dataset.final = seats.textContent;
      if (seats) seats.textContent = '—';
      panel.querySelectorAll('.sig').forEach(s => s.classList.remove('is-done', 'is-signing'));
      panel.querySelectorAll('.gantt-bar').forEach(b => {
        b.classList.remove('is-running', 'is-done');
        const f = b.querySelector('.gantt-fill');
        if (f) f.style.width = '0%';
      });
      const ganttNow = panel.querySelector('.gantt-now');
      if (ganttNow) {
        ganttNow.classList.remove('is-active');
        ganttNow.style.setProperty('--now', '0');
      }
      panel.querySelectorAll('.kpi-value').forEach(v => {
        v.textContent = v.dataset.from || '0';
      });
      const spark = panel.querySelector('.kpi-spark-line');
      if (spark) {
        const len = spark.getTotalLength ? spark.getTotalLength() : 100;
        spark.style.strokeDasharray = String(len);
        spark.style.strokeDashoffset = String(len);
      }
    };

    // Number count-up helper
    const countUp = (el, ms = 1100) => {
      if (!el) return;
      const from = parseFloat(el.dataset.from || '0');
      const to = parseFloat(el.dataset.to || '0');
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / ms);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = from + (to - from) * eased;
        el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    // Typewriter helper
    const typeText = (el, text, msPerChar = 28) => {
      if (!el) return;
      el.textContent = '';
      let i = 0;
      const step = () => {
        if (i >= text.length) return;
        el.textContent += text[i++];
        wait(msPerChar, step);
      };
      step();
    };

    const playStage = (idx) => {
      const panel = panels[idx];
      if (!panel) return;
      resetPanel(panel);

      if (idx === 0) {
        // Discovery: type each answer, then mark done; cascade through rows
        const rows = Array.from(panel.querySelectorAll('.qq-row'));
        rows.forEach((row, i) => {
          const a = row.querySelector('.qq-a');
          const answer = a ? a.dataset.answer || '' : '';
          const start = 200 + i * 900;
          wait(start, () => {
            row.classList.add('is-typing');
            typeText(a, answer, 22);
          });
          wait(start + 700, () => {
            row.classList.remove('is-typing');
            row.classList.add('is-done');
          });
        });
      } else if (idx === 1) {
        // Experience: cards load in one by one
        const cards = Array.from(panel.querySelectorAll('.cc-card'));
        cards.forEach((card, i) => {
          wait(220 + i * 520, () => card.classList.remove('is-loading'));
        });
      } else if (idx === 2) {
        // Scope: toggles flip on in sequence, then seats value reveals
        const rows = Array.from(panel.querySelectorAll('.cfg-row'));
        rows.forEach((row, i) => {
          const start = 260 + i * 560;
          wait(start, () => {
            row.classList.add('cfg-on');
            const t = row.querySelector('.toggle');
            if (t) t.classList.add('is-on');
            const val = row.querySelector('.cfg-value');
            if (val && val.dataset.final) val.textContent = val.dataset.final;
          });
        });
      } else if (idx === 3) {
        // Commit: each signature pen → check, in sequence
        const sigs = Array.from(panel.querySelectorAll('.sig'));
        sigs.forEach((sig, i) => {
          const start = 400 + i * 1200;
          wait(start, () => sig.classList.add('is-signing'));
          wait(start + 700, () => {
            sig.classList.remove('is-signing');
            sig.classList.add('is-done');
          });
        });
      } else if (idx === 4) {
        // Deploy: Gantt — "today" line sweeps across, bars fill in as it crosses them
        const gantt = panel.querySelector('.gantt');
        const bars = Array.from(panel.querySelectorAll('.gantt-bar'));
        const nowLine = panel.querySelector('.gantt-now');
        const sampleRow = panel.querySelector('.gantt-row');
        if (!gantt || !nowLine || !sampleRow) return;

        const trackWidth = sampleRow.getBoundingClientRect().width;
        const meta = bars.map(b => ({
          el: b,
          start: parseFloat(b.dataset.start || '0'),
          width: parseFloat(b.dataset.width || '0'),
          fill: b.querySelector('.gantt-fill'),
        }));

        // Reveal the now line (was hidden during the off-stage reset)
        wait(150, () => nowLine.classList.add('is-active'));

        const duration = 3200;
        const start = performance.now();
        const step = (t) => {
          const progress = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 2);
          const nowPct = eased * 100;
          // Position the line in pixels (relative to track width)
          nowLine.style.setProperty('--now', String((nowPct / 100) * trackWidth));

          meta.forEach(m => {
            const end = m.start + m.width;
            let fillPct;
            let cls = '';
            if (nowPct >= end) { fillPct = 100; cls = 'is-done'; }
            else if (nowPct <= m.start) { fillPct = 0; cls = ''; }
            else { fillPct = ((nowPct - m.start) / m.width) * 100; cls = 'is-running'; }
            if (m.fill) m.fill.style.width = `${fillPct}%`;
            m.el.classList.remove('is-running', 'is-done');
            if (cls) m.el.classList.add(cls);
          });

          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } else if (idx === 5) {
        // Success: count up KPI numbers + animate sparkline draw
        const kpis = Array.from(panel.querySelectorAll('.kpi-value'));
        wait(220, () => kpis.forEach(k => countUp(k, 1200)));
        const spark = panel.querySelector('.kpi-spark-line');
        if (spark) {
          wait(220, () => {
            spark.style.transition = 'stroke-dashoffset 1400ms ease-out';
            spark.style.strokeDashoffset = '0';
          });
        }
      }
    };

    const openDetail = (overrideIdx) => {
      if (typeof overrideIdx === 'number') activeIdx = overrideIdx;
      view = 'detail';
      cycleCount++;
      journeyBody.classList.add('is-detail');
      journeyBody.classList.remove('is-success');
      panels.forEach((p, i) => p.classList.toggle('is-active', i === activeIdx));
      swapText(detailTitle, stageDetailHeaders[activeIdx]);
      swapText(detailStep, `${activeIdx + 1} of ${total}`);
      swapText(agentLabel, agentScript[activeIdx][0]);
      // Start with human next action
      setNextAction(activeIdx, false);
      renderRing();
      renderNodes();
      // Kick off the per-stage animation sequence (work happening!)
      playStage(activeIdx);

      if (!prefersReducedMotion && visible) {
        // Sometimes First Party AI steps in mid-cycle and takes over the next action
        const aiSteps = cycleCount % 2 === 0;
        if (aiSteps) {
          wait(1200, () => setNextAction(activeIdx, true));
        }
        // Hold longer so the work animations finish before completing
        wait(4400, completeStage);
      }
    };

    const completeStage = () => {
      swapText(agentLabel, agentScript[activeIdx][1]);
      view = 'success';
      journeyBody.classList.add('is-success');
      wait(1200, () => {
        journeyBody.classList.remove('is-success');
        activeIdx = (activeIdx + 1) >= total ? minActive : activeIdx + 1;
        showOverview();
      });
    };

    // Click any overview node → jump to its detail
    ovNodes.forEach((n, i) => {
      n.addEventListener('click', () => {
        clearPending();
        openDetail(i);
      });
    });

    // Back button → overview
    if (detailBack) {
      detailBack.addEventListener('click', () => {
        clearPending();
        view = 'overview';
        journeyBody.classList.remove('is-detail', 'is-success');
      });
    }

    // Visibility-gated auto-play
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const wasVisible = visible;
        visible = e.isIntersecting;
        if (visible && !wasVisible && !prefersReducedMotion) {
          clearPending();
          if (view === 'overview') wait(1200, openDetail);
        } else if (!visible) {
          clearPending();
        }
      });
    }, { threshold: 0.2 });
    io.observe(journeyMockup);

    // Initial paint
    renderRing();
    renderNodes();
    if (agentLabel) agentLabel.textContent = agentScript[activeIdx][0];
    setNextAction(activeIdx, false);
  }

  /* ──────────── Journey tracker — updates as cards scroll past ────────────
     Updates ALL .tracker-bar / .tracker-count instances (the aside one on
     desktop AND the sticky mobile pill share state). */
  const trackerText = document.getElementById('trackerText');
  const trackerBars = Array.from(document.querySelectorAll('.tracker-bar'));
  const trackerCounts = Array.from(document.querySelectorAll('.tracker-count'));
  const journeyTimeline = document.getElementById('journeyTimeline');
  if (journeyTimeline && trackerBars.length) {
    const items = Array.from(journeyTimeline.querySelectorAll('.timeline-item'));
    const total = items.length;

    // Build progress segments in every tracker bar
    const segmentsList = trackerBars.map(bar => {
      bar.innerHTML = items.map(() => '<span></span>').join('');
      return Array.from(bar.children);
    });

    const setActiveIdx = (idx) => {
      const item = items[idx];
      if (!item) return;
      // Focus current card; defocus the rest (CSS does the blur/opacity/scale)
      items.forEach((c, i) => c.classList.toggle('is-current', i === idx));
      const label = item.dataset.tracker || '';
      if (trackerText && label && trackerText.textContent !== label) {
        trackerText.classList.add('is-changing');
        setTimeout(() => {
          trackerText.textContent = label;
          requestAnimationFrame(() => trackerText.classList.remove('is-changing'));
        }, 220);
      }
      const countText = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
      trackerCounts.forEach(el => el.textContent = countText);
      segmentsList.forEach(segs => segs.forEach((s, i) => s.classList.toggle('is-on', i <= idx)));
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = items.indexOf(entry.target);
          if (idx >= 0) setActiveIdx(idx);
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    items.forEach(item => io.observe(item));

    setActiveIdx(0);
  }

  /* ──────────── Smooth scroll for nav anchors ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ──────────── Orb mouse drift (very subtle) ──────────── */
  // Not used since we removed the orbs in the light theme rewrite; kept conditional
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length && isFinePointer && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      orbs.forEach((orb, i) => {
        const mult = (i + 1) * 8;
        orb.style.transform = `translate(${x * mult}px, ${y * mult}px)`;
      });
    });
  }

})();
