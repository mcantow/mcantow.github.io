/* ═══════════════════════════════════════════════════════════════
   hero_journey_cycle.js — V6 hero widget state machine

   Drives .v6-mockup-panel through a full intro → cycle:

      boot → cn → click → csn → spd → ring → stage → success
                                                ↑________|
                                           (loops 6 times)

   `csn` shows a Create / Share / Navigate picker. The cursor selects
   Navigate. `spd` is a single framing beat (the JourneyDetail's
   Start / Plan / Drive command panel) answering: why are we on this
   journey, how will we get there, where are we + what's next. Then
   the journey ring takes over.

   - Intro plays once per session per visibility entry
   - Stage cycle loops indefinitely while widget is in view
   - Each stage has its own micro-animation that runs during dwell
   - Visibility-gated via IntersectionObserver
   - Reduced-motion: skip intro, sit at ring overview
   ═══════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const panel = document.querySelector('.hero .v6-mockup-panel');
    if (!panel) return;

    /* Existing CN navigator-ring stage nodes — we click these so the
       legacy index_5.js keeps doing its thing (highlights the right
       node in the ring). Stage data lives in our v6-stage-panels. */
    const stageNodes = Array.from(panel.querySelectorAll('.navigator-ring .stage-node'));
    const stagePanels = Array.from(panel.querySelectorAll('.v6-stage-panel'));
    const NUM_STAGES = stagePanels.length || 6;

    /* === Timing (ms) — engineered so each phase has room to breathe ===
     *
     * Calibrated for FIRST-TIME viewers who don't know the product. Dwells
     * are intentionally generous — every beat needs enough time to read
     * the title, take in the data, and understand what just happened.
     * Don't shorten without testing on someone seeing it cold. */
    const T = {
        chaos:    3000,   // tools jitter + connectors flow
        dissolve: 900,    // tools fly to center, connectors retract
        cn:       2400,   // CN logo + wordmark fade in + dwell (was 1700)
        /* UNIFIED CLICK TIMING — all three intro clicks use the same
         * cursor keyframe (50% land / 65% press / 80% release) and the
         * same 700ms post-press dwell before the phase transitions.
         * Formula: T = cursor_delay + (65% × 900ms = 585ms press) + 700.
         *
         *   click:  delay 0   → press 585  → T 1300
         *   csn:    delay 450 → press 1035 → T 1750
         *   spd:    delay 450 → press 1035 → T 1750
         *
         * Before: 1300 / 2400 / 2600 → post-press dwell was 660 / 1020 /
         * 1500ms (wildly inconsistent), and the cursor keyframes used
         * different proportions per phase so each click felt different. */
        click:    1300,
        csn:      3500,  // Picker needs real dwell — the CN logo step used to absorb this time before it was skipped. Reader needs ~2s to register Create/Share/Navigate as a real picker, then sees the cursor land on Navigate.
        spd:      3000,  // SPD framing has 3 panels (Goals + Journey Map + Directions) — needs more than a beat to read before the cursor clicks the map.
        ringIn:    3000,  // ring nodes emerge staggered + settle (was 2400)
        /* Per-stage cycle beats — main place where new viewers get lost.
         * Generous so they can read header + meta, then the agent panel,
         * then the populated workspace. */
        stageHome: 2400,  // beat 1 — stage landing visible (was 1500)
        agentOpen:  800,  // beat 2 — cursor → agent tile → click (was 700)
        agentWork: 7000,  // beat 3 — panel reveal (~2200) + Think click fly+press (~820) + Thinking dwell (~1900) + proposal dwell (~2080). Bumped for legibility — readers couldn't keep up at 5600.
        /* Beat 4 sub-beats: the agent→workspace handoff. Bumped so each
         * sub-action (CTA click, agent slide-out, cursor to tile, workspace
         * open) has time to register. */
        wsHandoffOut:  520,
        wsHandoffMove: 620, /* cursor flies to workspace tile + lands at press (matches fireStageCursor's 620ms click moment) */
        wsHandoffOpen: 300,
        wsHandoff:    1440, // sum — used downstream for t5 math
        wsWork:    1100,  // beat 5 — playDiscovery fills in ~960ms; only ~140ms dwell before the cursor flies to the Customer toggle (rows-just-landed feel)
        personaSwap: 12800,// beat 6 — guest chat with slower typing reveals. Discovery's 7-bubble Smart Conversation now ends around 11s (last user bubble at ~10.3s + 700ms read); the rest of the budget is dwell before chat panel dismisses, then celebrate runs in beat 7. Was 9800 — too short, the LAST user bubble + its row fill never landed before the chat slid out.
        success:   1700,  // (legacy) — unused
        breath:    1100,  // beat 7 — ring breath before next stage opens (was 700)
    };

    /* Stage icons for the ring center — Bootstrap-style stroke SVGs */
    const stageIcons = [
        // 0 Discovery — compass
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" fill="currentColor" stroke="none" opacity="0.85"/></svg>',
        // 1 Experience — layers
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L22 8.5 L12 15 L2 8.5 Z"/><path d="M2 14 L12 20.5 L22 14"/></svg>',
        // 2 Scope — checklist
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l2 2 4-4"/><path d="M7 15l2 2 4-4"/></svg>',
        // 3 Commit — pen
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>',
        // 4 Deploy — gantt bars
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="3" y1="6" x2="13" y2="6"/><line x1="5" y1="12" x2="17" y2="12"/><line x1="7" y1="18" x2="21" y2="18"/></svg>',
        // 5 Success — trophy
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M4 22h16M10 22V18M14 22V18M6 5V3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2c0 4-2 8-6 8s-6-4-6-8Z"/></svg>',
    ];
    const stageTitleStrings = ['Discovery', 'Experience', 'Scope', 'Commit', 'Deploy', 'Success'];

    let visible = false;
    let pending = [];
    let activeStage = 0;
    let introPlayed = false;
    /* The intro path (SPD click → ring expand → stage 1) already shows the
       user clicking the Journey Map pill and watching it bloom into the
       ring. Firing another ring-node click immediately after reads as a
       double-click on the same gesture. Skip the very first ring→stage
       click; subsequent stage advances still play it as a clear cue. */
    let skipFirstRingClick = true;

    const clearPending = () => {
        pending.forEach(id => clearTimeout(id));
        pending = [];
    };
    const wait = (ms, fn) => {
        const id = setTimeout(fn, ms);
        pending.push(id);
        return id;
    };
    /* Whole-flow step map — every beat the demo walks through counts as a
       step, not just the 6 journey stages. Live Journey View label + the
       counter pull from here so the user sees one continuous progress
       narrative across the entire experience. The CN logo + first-click
       step was removed from the intro — the demo opens on CSN — so step 1
       is now Create/Share/Navigate, not CustomerNode. 8 total: picker +
       plan + 6 ring stages. */
    const FLOW_STEPS = [
        { phase: 'csn', label: 'Choose your starting surface' },
        { phase: 'spd', label: 'Frame the journey' },
        { phase: 'stage', stageIndex: 0, label: 'Discovery' },
        { phase: 'stage', stageIndex: 1, label: 'Experience' },
        { phase: 'stage', stageIndex: 2, label: 'Scope' },
        { phase: 'stage', stageIndex: 3, label: 'Commit' },
        { phase: 'stage', stageIndex: 4, label: 'Deploy' },
        { phase: 'stage', stageIndex: 5, label: 'Success' },
    ];
    const TOTAL_FLOW_STEPS = FLOW_STEPS.length;

    const stepIndexForPhase = (phaseName, stageIdx) => {
        /* Stage / success / ring all live in the stage block — use stageIdx. */
        if (phaseName === 'stage' || phaseName === 'success' || phaseName === 'ring') {
            return FLOW_STEPS.findIndex(s => s.phase === 'stage' && s.stageIndex === stageIdx);
        }
        return FLOW_STEPS.findIndex(s => s.phase === phaseName);
    };

    /* Map of phase name → data-v6-fx key for the cursor+ripple wrapper
       that should fire on this phase. Phases not in the map don't drive a
       cursor click (e.g. 'cn', 'ring', 'stage', 'success'). */
    /* `click` keeps its auto-fire because it's a one-shot intro beat,
     * but `csn` and `spd` deliberately do NOT auto-click on phase entry —
     * runIntro fires their click manually after the content has had a
     * beat to fade in. Auto-firing made the cursor "already hover" the
     * target the instant the picker appeared. */
    const FX_FOR_PHASE = { click: 'intro' };

    const setPhase = (name) => {
        panel.setAttribute('data-v6-phase', name);
        /* Cursor + ripple wrappers are toggled in lockstep with the phase
           change. Clear every wrapper first (so re-entering a phase always
           restarts the animation), then fire the one for this phase. */
        panel.querySelectorAll('.v6-fx').forEach(el => el.classList.remove('is-clicking'));
        const fxKey = FX_FOR_PHASE[name];
        if (fxKey) {
            const fx = panel.querySelector(`.v6-fx[data-v6-fx="${fxKey}"]`);
            if (fx) {
                void fx.offsetWidth; /* reflow so re-adding the class restarts the animation */
                fx.classList.add('is-clicking');
            }
        }
        /* Refresh the flow-wide counter + label every time the phase changes. */
        const stepIdx = stepIndexForPhase(name, activeStage);
        if (stepIdx >= 0) {
            const step = FLOW_STEPS[stepIdx];
            updateMicroLabel(step.label);
            if (stageCounter) {
                stageCounter.textContent = `${stepIdx + 1} of ${TOTAL_FLOW_STEPS}`;
            }
        }
    };

    /* ─────────── PER-STAGE MICRO-ANIMATIONS ─────────── */

    /* Stage 0 — Discovery (host): The user just clicked "Accept" on
     * Think & Sync's proposal. All 3 proposed rows light up
     * SIMULTANEOUSLY with their own AI-assist chips (one chip per row,
     * all visible at once), all dwell together, then all 3 resolve in
     * the same beat. The proposal items in the panel transfer in
     * lockstep — dim and ghost together as the rows light up, fully
     * "transferred" the moment the answers land. Reads as one
     * deliberate "data moving from panel into workspace" gesture, not
     * a slow row-by-row trickle.
     *
     * Only the rows Think & Sync derived from sources fill here.
     * Renewal date, Compliance, Decision criteria are left empty for
     * Smart Conversation when the persona swaps to guest. */
    const playDiscovery = () => {
        const panelEl = stagePanels[0];
        if (!panelEl) return;
        const rows = Array.from(panelEl.querySelectorAll('.v6-table-row'));
        const filled = [
            { i: 0, text: 'Salesforce · 3 yrs' },
            { i: 2, text: '~30 users in pilot' },
        ];
        /* Reset: clear ALL rows, drop any leftover chips. */
        rows.forEach(row => {
            row.classList.remove('is-typing', 'is-done');
            row.querySelectorAll('.v6-row-assist').forEach(c => c.remove());
            const a = row.querySelector('.v6-row-a');
            if (a) a.textContent = '';
        });
        const proposalItems = Array.from(document.querySelectorAll('.v6-agent-panel .v6-ap-diff-row'));
        /* All chips appear together, dwell together, resolve together. */
        const CHIP_IN_AT = 240;
        const RESOLVE_AT = CHIP_IN_AT + 720;
        filled.forEach((entry, idx) => {
            const row = rows[entry.i];
            const proposalItem = proposalItems[idx];
            wait(CHIP_IN_AT, () => {
                if (proposalItem) proposalItem.classList.add('is-transferring');
                showRowAssist(row);
            });
            wait(RESOLVE_AT, () => {
                hideRowAssist(row);
                const a = row.querySelector('.v6-row-a');
                if (a) a.textContent = entry.text;
                row.classList.add('is-done');
                if (proposalItem) proposalItem.classList.add('is-transferred');
            });
        });
    };

    /* Inline AI-assist chip on a Q&A row — small floating pill on the
     * right edge of the row showing the AI is mid-work on that row. */
    const ASSIST_ICON_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.5 2.5a.5.5 0 0 1 1 0l.65 2.7a1 1 0 0 0 .73.73l2.7.65a.5.5 0 0 1 0 1l-2.7.65a1 1 0 0 0-.73.73l-.65 2.7a.5.5 0 0 1-1 0l-.65-2.7a1 1 0 0 0-.73-.73l-2.7-.65a.5.5 0 0 1 0-1l2.7-.65a1 1 0 0 0 .73-.73zM5 13a.5.5 0 0 1 1 0l.35 1.45a1 1 0 0 0 .73.73L8.53 15.5a.5.5 0 0 1 0 1l-1.45.32a1 1 0 0 0-.73.73L6 19a.5.5 0 0 1-1 0l-.32-1.45a1 1 0 0 0-.73-.73L2.5 16.5a.5.5 0 0 1 0-1l1.45-.32a1 1 0 0 0 .73-.73zM17 13.5a.5.5 0 0 1 1 0l.4 1.7a1 1 0 0 0 .73.73l1.7.4a.5.5 0 0 1 0 1l-1.7.4a1 1 0 0 0-.73.73l-.4 1.7a.5.5 0 0 1-1 0l-.4-1.7a1 1 0 0 0-.73-.73L14.17 17a.5.5 0 0 1 0-1l1.7-.4a1 1 0 0 0 .73-.73z"/></svg>';

    const showRowAssist = (rowEl) => {
        if (!rowEl) return;
        let chip = rowEl.querySelector(':scope > .v6-row-assist');
        if (chip) chip.remove();
        chip = document.createElement('span');
        chip.className = 'v6-row-assist';
        chip.innerHTML = ASSIST_ICON_SVG + '<span class="v6-row-assist-label">AI</span>';
        rowEl.appendChild(chip);
        void chip.offsetWidth;
        chip.classList.add('is-on');
    };
    const hideRowAssist = (rowEl) => {
        if (!rowEl) return;
        const chip = rowEl.querySelector(':scope > .v6-row-assist');
        if (!chip) return;
        chip.classList.remove('is-on');
        chip.classList.add('is-off');
        wait(220, () => { if (chip.isConnected) chip.remove(); });
    };

    /* Stage 1 — Experience: curated content cards appear one by one */
    /* Stage 1 — Experience (host): Sarah accepted Tailored Script's diff,
     * the 3 content artifacts publish to the workspace. Mirrors playScope:
     * proposal items in the agent panel transfer-then-strike, content
     * cards land in lockstep. */
    const playExperience = () => {
        const panelEl = stagePanels[1];
        if (!panelEl) return;
        const cards = Array.from(panelEl.querySelectorAll('.v6-content-card'));
        /* If cards still have is-shown from the previous cycle, removing
         * it would trigger a 360ms fade-out — which the viewer sees as
         * the cards appearing, fading out, then fading back in (the
         * "renders twice" complaint). Force-clear WITHOUT transition so
         * the cards drop to opacity 0 instantly, then add is-shown later
         * for the single clean fade-in. */
        cards.forEach(c => {
            c.style.transition = 'none';
            c.classList.remove('is-shown');
        });
        void panelEl.offsetWidth; /* flush styles */
        cards.forEach(c => { c.style.transition = ''; });
        const proposalItems = Array.from(document.querySelectorAll('.v6-agent-panel .v6-ap-diff-row'));
        const CHIP_IN_AT = 240;
        const RESOLVE_AT = CHIP_IN_AT + 720;
        cards.forEach((card, idx) => {
            const proposalItem = proposalItems[idx];
            wait(CHIP_IN_AT, () => {
                if (proposalItem) proposalItem.classList.add('is-transferring');
            });
            wait(RESOLVE_AT, () => {
                card.classList.add('is-shown');
                if (proposalItem) proposalItem.classList.add('is-transferred');
            });
        });
    };

    /* Stage 2 — Scope (host): Sarah accepted Proposed Scope's diff,
     * the 3 modules sync into the workspace simultaneously. Mirrors
     * playDiscovery — AI-assist chip on every module row, all chips
     * appear together, all resolve to is-shown+is-in-scope together.
     * Proposal items in the agent panel transfer/strike-through in
     * lockstep. */
    const playScope = () => {
        const panelEl = stagePanels[2];
        if (!panelEl) return;
        const rows = Array.from(panelEl.querySelectorAll('.v6-module-row'));
        /* Force-clear scope marks WITHOUT transition so rows don't fade
         * before the agent transfer animation kicks in. is-shown stays
         * (rows are always visible in the curated list); only the
         * scope status (in/out/badge) is reset. */
        rows.forEach(row => {
            row.style.transition = 'none';
            row.classList.remove('is-in-scope', 'is-out-of-scope');
            const badge = row.querySelector('.v6-module-badge');
            if (badge) badge.textContent = '—';
            row.querySelectorAll('.v6-row-assist').forEach(c => c.remove());
        });
        void panelEl.offsetWidth;
        rows.forEach(row => { row.style.transition = ''; });
        const proposalItems = Array.from(document.querySelectorAll('.v6-agent-panel .v6-ap-diff-row'));
        const CHIP_IN_AT = 240;
        const RESOLVE_AT = CHIP_IN_AT + 720;
        rows.forEach((row, idx) => {
            const proposalItem = proposalItems[idx];
            const scope = proposalItem ? proposalItem.getAttribute('data-scope') : 'in';
            wait(CHIP_IN_AT, () => {
                if (proposalItem) proposalItem.classList.add('is-transferring');
                showRowAssist(row);
            });
            wait(RESOLVE_AT, () => {
                hideRowAssist(row);
                row.classList.add(scope === 'out' ? 'is-out-of-scope' : 'is-in-scope');
                const badge = row.querySelector('.v6-module-badge');
                if (badge) badge.textContent = scope === 'out' ? '−' : '✓';
                if (proposalItem) proposalItem.classList.add('is-transferred');
            });
        });
        /* Update the workspace state chip once the last row resolves. */
        wait(RESOLVE_AT + 50, () => {
            const chip = panelEl.querySelector('[data-v6-scope-summary]');
            if (chip) chip.textContent = '5 in-scope · 3 deferred';
        });
    };

    /* Stage 3 — Commit: legal name + title typewrite, checkbox ticks,
       CTA arms then confirms with check */
    const playCommit = () => {
        const panelEl = stagePanels[3];
        if (!panelEl) return;
        const fields = Array.from(panelEl.querySelectorAll('.v6-sign-value'));
        const checkBox = panelEl.querySelector('.v6-check-box');
        const cta = panelEl.querySelector('.v6-sign-cta');
        const ctaLabel = panelEl.querySelector('.v6-sign-cta-label');

        fields.forEach(f => {
            f.textContent = '';
            f.classList.remove('is-typing');
        });
        if (checkBox) checkBox.classList.remove('is-checked');
        if (cta) cta.classList.remove('is-armed', 'is-signed');
        if (ctaLabel) ctaLabel.textContent = 'Sign agreement';

        wait(300, () => {
            fields[0].classList.add('is-typing');
            typeText(fields[0], 'Sarah Kim', 28, () => {
                fields[0].classList.remove('is-typing');
            });
        });
        wait(1400, () => {
            fields[1].classList.add('is-typing');
            typeText(fields[1], 'CFO · Acme Co', 28, () => {
                fields[1].classList.remove('is-typing');
            });
        });
        wait(2700, () => {
            if (checkBox) checkBox.classList.add('is-checked');
            if (cta) cta.classList.add('is-armed');
        });
        wait(3500, () => {
            if (cta) cta.classList.add('is-signed');
            if (ctaLabel) ctaLabel.textContent = 'Signed';
        });
    };

    /* Stage 4 — Deploy host (Assign Owners). Accept applies an owner
     * badge to each gantt row in lockstep with the agent's diff items
     * transferring (mirrors playScope / playExperience). The bars stay
     * unfilled at this point — the gantt fill animation is owned by
     * the guest beat (playDeployGanttFill), which runs as Jay chats
     * with AI Navigator. That keeps the narrative tight: host "assigns
     * owners," guest "watches tracks ship green." */
    const playDeploy = () => {
        const panelEl = stagePanels[4];
        if (!panelEl) return;
        const bars = Array.from(panelEl.querySelectorAll('.v6-gantt-bar'));
        const rows = Array.from(panelEl.querySelectorAll('.v6-gantt-row'));
        const nowLine = panelEl.querySelector('.v6-gantt-now');
        if (!nowLine) return;

        /* Reset bars + now-line + owner badges from any prior cycle. */
        bars.forEach(b => {
            b.classList.remove('is-running', 'is-done');
            const f = b.querySelector('.v6-gantt-fill');
            if (f) f.style.width = '0%';
        });
        nowLine.classList.remove('is-active');
        nowLine.style.setProperty('--now', '0');
        rows.forEach(row => {
            const existing = row.querySelector('.v6-gantt-owner');
            if (existing) existing.remove();
        });

        /* Pair each gantt row with its proposed owner from the agent's
         * diff. The value text is like "MK · Eng lead" — first two chars
         * are the owner initials. */
        const proposalItems = Array.from(document.querySelectorAll('.v6-agent-panel .v6-ap-diff-row'));
        const CHIP_IN_AT = 240;
        const RESOLVE_AT = CHIP_IN_AT + 720;
        rows.forEach((row, idx) => {
            const proposalItem = proposalItems[idx];
            const valueEl = proposalItem ? proposalItem.querySelector('.v6-ap-diff-value') : null;
            const value = valueEl ? valueEl.textContent : '';
            const initials = (value.match(/^([A-Z]{2})/) || [, ''])[1];
            wait(CHIP_IN_AT, () => {
                if (proposalItem) proposalItem.classList.add('is-transferring');
            });
            wait(RESOLVE_AT, () => {
                const badge = document.createElement('span');
                badge.className = 'v6-gantt-owner';
                badge.textContent = initials;
                row.appendChild(badge);
                if (proposalItem) proposalItem.classList.add('is-transferred');
            });
        });
    };

    /* Gantt-fill animation owned by the guest (AI Navigator) beat —
     * fires when persona swaps to guest on Deploy. The now-line sweeps
     * left-to-right; bars transition from unstarted → running → done
     * as the line passes their span. Duration is long enough to span
     * the full chat reveal. */
    const playDeployGanttFill = () => {
        const panelEl = stagePanels[4];
        if (!panelEl) return;
        const bars = Array.from(panelEl.querySelectorAll('.v6-gantt-bar'));
        const nowLine = panelEl.querySelector('.v6-gantt-now');
        const sampleTrack = panelEl.querySelector('.v6-gantt-track');
        if (!nowLine || !sampleTrack) return;

        wait(200, () => nowLine.classList.add('is-active'));
        const meta = bars.map(b => {
            const start = parseFloat(b.style.getPropertyValue('--start')) || 0;
            const width = parseFloat(b.style.getPropertyValue('--width')) || 0;
            return { el: b, start, width, fill: b.querySelector('.v6-gantt-fill') };
        });
        const trackWidth = sampleTrack.getBoundingClientRect().width;
        const duration = 5200;
        const startTs = performance.now();
        const step = (t) => {
            const progress = Math.min(1, (t - startTs) / duration);
            const eased = 1 - Math.pow(1 - progress, 2);
            const nowPct = eased * 100;
            nowLine.style.setProperty('--now', String((nowPct / 100) * trackWidth));
            meta.forEach(m => {
                const end = m.start + m.width;
                let fillPct, cls = '';
                if (nowPct >= end) { fillPct = 100; cls = 'is-done'; }
                else if (nowPct <= m.start) { fillPct = 0; }
                else { fillPct = ((nowPct - m.start) / m.width) * 100; cls = 'is-running'; }
                if (m.fill) m.fill.style.width = `${fillPct}%`;
                m.el.classList.remove('is-running', 'is-done');
                if (cls) m.el.classList.add(cls);
            });
            if (progress < 1 && visible) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    /* Stage 5 — Success: KPI numbers count up */
    const playSuccess = () => {
        const panelEl = stagePanels[5];
        if (!panelEl) return;
        const kpis = Array.from(panelEl.querySelectorAll('.v6-kpi-value'));
        kpis.forEach(k => {
            k.textContent = (k.dataset.from || '0') + (k.dataset.suffix || '');
        });
        wait(220, () => {
            kpis.forEach(k => countUp(k, 1200));
        });
    };

    const stagePlayers = [playDiscovery, playExperience, playScope, playCommit, playDeploy, playSuccess];

    /* Per-stage agent narration — opens with what AI is doing,
       switches mid-stage to a more concrete action, closes with completion. */
    /* Per-stage agent narration uses each stage's actual agent names
       (multi-role — Host- or Guest-side) so the user reads the platform
       as a real multi-agent surface, not a generic "AI". */
    const agentScript = [
        ['Think & Sync reading 3 calls + 11 emails',                       'Surfaced 3 themes · drafted 5 follow-ups',              'Discovery locked, handing off to Experience'],
        ['Tailored Script drafting demo flow for Acme',                    'Built 22-min outline · 3 case studies queued',          'Experience published — buyer team notified'],
        ['SOW Generator drafting 12-page contract from Discovery + Scope', 'Solution Fit verifying with buyer · 1 flag raised',     'Scope agreed by both sides, ready for signature'],
        ['Execution Readiness pre-flighting terms vs Scope',               'Why Commit? building value case for buying committee',  'Both sides countersigned — agreement filed'],
        ['Assign Owners mapping 5 tracks to bench',                        'AI Navigator tracking rollout for Acme',                'All tracks live — go-live confirmed'],
        ['Cheat Sheet drafting coaching reference for handoff',            'Auto Solve standing by · 0 tickets open',               'Renewed for 36 months at +18% ACV'],
    ];

    const updateAgentText = (text) => {
        const el = document.querySelector(`.v6-stage-panel[data-panel="${activeStage}"] [data-v6-agent-text]`);
        if (!el || el.textContent === text) return;
        el.classList.add('is-changing');
        setTimeout(() => {
            el.textContent = text;
            requestAnimationFrame(() => el.classList.remove('is-changing'));
        }, 220);
    };

    /* ─────────── HELPERS ─────────── */

    const typeText = (el, text, msPerChar, onDone) => {
        if (!el) return;
        el.textContent = '';
        let i = 0;
        const step = () => {
            if (i >= text.length) { if (onDone) onDone(); return; }
            el.textContent += text[i++];
            wait(msPerChar, step);
        };
        step();
    };

    const countUp = (el, ms) => {
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
            if (t < 1 && visible) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    /* Ring center elements (icon swaps + eyebrow + title) */
    const ringIcon = document.querySelector('[data-v6-ring-icon]');
    const ringEyebrow = document.querySelector('[data-v6-ring-eyebrow]');
    const ringTitle = document.querySelector('[data-v6-ring-title]');

    const updateRingCenter = (idx) => {
        if (ringIcon) {
            ringIcon.classList.add('is-changing');
            setTimeout(() => {
                ringIcon.innerHTML = stageIcons[idx] || stageIcons[0];
                requestAnimationFrame(() => ringIcon.classList.remove('is-changing'));
            }, 200);
        }
        if (ringEyebrow) ringEyebrow.textContent = `Stage ${idx + 1} of ${stageNodes.length}`;
        if (ringTitle) {
            ringTitle.classList.add('is-changing');
            setTimeout(() => {
                ringTitle.textContent = stageTitleStrings[idx] || '';
                requestAnimationFrame(() => ringTitle.classList.remove('is-changing'));
            }, 220);
        }
    };

    const navigatorRing = panel.querySelector('.navigator-ring');
    /* Controls (chevrons, counter, live-journey label) live OUTSIDE the
       .v6-mockup-panel — as a sibling inside the .v6-panel-stack wrapper.
       Query from the stack level (panel.parentElement) so we actually find
       them; otherwise the dynamic label never updates. */
    const controlsRoot = panel.parentElement;
    const microLabel = controlsRoot ? controlsRoot.querySelector('.v6-panel-controls .navigator-ring-micro-label') : null;
    const stageCounter = controlsRoot ? controlsRoot.querySelector('.v6-panel-controls .ring-nav-counter') : null;

    /* Smooth swap for the dynamic Live Journey View label. */
    const updateMicroLabel = (text) => {
        if (!microLabel) return;
        /* Preserve the leading pulse dot — only swap the text node. */
        const textNode = Array.from(microLabel.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (textNode) textNode.textContent = ' ' + text;
        else microLabel.append(' ' + text);
    };

    const activateStage = (idx) => {
        activeStage = idx;
        /* Drive the ring's progress percent DIRECTLY so the green arc
         * updates in the same frame as the stage-panel swap.
         *
         * GEOMETRY: Stage nodes sit at angles idx*(360/NUM_STAGES) around
         * the ring. For 6 stages = 60° apart. The green "completion" arc
         * fills from 0° to the active node's angle, representing the
         * stages already completed BEFORE the active one.
         *
         * pct (0-100) = (idx / NUM_STAGES) * 100.
         *   idx 0 →   0%  →   0° (Discovery active, none done)
         *   idx 1 → 16.7% →  60° (Experience active, Discovery done)
         *   idx 2 → 33.3% → 120° (Scope active, 2 done)
         *   idx 3 →   50% → 180°
         *   idx 4 → 66.7% → 240°
         *   idx 5 → 83.3% → 300° (Success active, 5 done)
         *
         * Prior defect: formula used (NUM_STAGES - 1) as denominator — wrong
         * because nodes aren't at intervals of 360/(N-1), they're at
         * intervals of 360/N. The arc was 6/5 = 1.2× too far around the
         * ring, so it overshot every node. */
        const pct = NUM_STAGES > 0 ? (idx / NUM_STAGES) * 100 : 0;
        if (navigatorRing) {
            for (let i = 0; i < NUM_STAGES; i++) {
                navigatorRing.classList.remove(`navigator-ring--progress-${i}`);
            }
            navigatorRing.classList.add(`navigator-ring--progress-${idx}`);
            /* Drive the smooth green completion arc on the desktop ring. */
            navigatorRing.style.setProperty('--completion-percent', pct);
            navigatorRing.setAttribute('data-completion-percent', Math.round(pct));
        }
        /* Also drive the mobile stepper at the top of the phone-frame —
           the .v6-stage-panels::before reads --mobile-progress via the panel. */
        panel.style.setProperty('--mobile-progress', pct);
        /* Still fire the legacy click so applyStage swaps participants/agents/etc. */
        if (stageNodes[idx]) stageNodes[idx].click();
        /* OUR explicit ring tracking: mark active + earlier nodes done.
           The legacy ring's own "active" logic doesn't always keep up
           with our cycle, so we drive it directly with our own classes. */
        stageNodes.forEach((node, i) => {
            node.classList.toggle('v6-is-active', i === idx);
            node.classList.toggle('v6-is-done', i < idx);
        });
        /* Show only this stage's panel */
        stagePanels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
        /* Update the ring center to reflect this stage */
        updateRingCenter(idx);
        /* Counter + Live Journey View label are now driven uniformly by
           setPhase() via the FLOW_STEPS map, so we don't duplicate the
           per-stage update here. */
    };

    /* ─────────── STATE MACHINE ─────────── */

    /* ─────────── FAKE-CURSOR TARGETING UTILITY ───────────
       Anchors a .v6-fx wrapper onto an actual on-screen element instead
       of hard-coded pixel offsets. Writes `target-center - panel-center`
       into --fx-x / --fx-y on the wrapper. Because the cursor SVG is
       pinned to the wrapper's origin and the ripple auto-centers on it,
       changing those two custom props is enough to relocate both — they
       cannot drift apart. Re-runs on resize while the phase is live so
       a resize mid-animation doesn't misalign. */
    const positionFxOnTarget = (fxKey, target) => {
        if (!target) return;
        const fx = panel.querySelector(`.v6-fx[data-v6-fx="${fxKey}"]`);
        if (!fx) return;
        const panelRect = panel.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const x = (targetRect.left + targetRect.width / 2) - (panelRect.left + panelRect.width / 2);
        const y = (targetRect.top + targetRect.height / 2) - (panelRect.top + panelRect.height / 2);
        fx.style.setProperty('--fx-x', `${Math.round(x)}px`);
        fx.style.setProperty('--fx-y', `${Math.round(y)}px`);
    };

    let cursorTargetEl = null;
    const positionCursorOnTarget = (selector) => {
        const target = panel.querySelector(selector);
        if (!target) return;
        cursorTargetEl = target;
        positionFxOnTarget('csn', target);
    };
    const refreshCursorTarget = () => {
        if (cursorTargetEl && cursorTargetEl.isConnected) {
            positionCursorOnTarget(`[data-csn="${cursorTargetEl.dataset.csn || ''}"] .v6-csn-tile-icon`);
        }
    };
    window.addEventListener('resize', refreshCursorTarget);

    const runIntro = (onDone) => {
        if (prefersReducedMotion || introPlayed) { onDone(); return; }
        /* Per-phase rhythm — broken into 4 explicit beats so the reader
         * SEES each transition land before the next one starts:
         *   1. Enter phase → picker content staggers in (CSS, ~880ms).
         *   2. DWELL clean — no cursor, no hover, just the picker.
         *   3. Cursor flies in from lower-right (~450ms to land).
         *   4. As the cursor lands, the target tile lifts into "hover"
         *      (separate class on the panel — used to fire 900ms into
         *      the phase regardless of cursor position; that read as
         *      "already hovered"). Press fires shortly after.
         *   5. Hold the click for ~250ms, then advance to the next phase. */
        const FADE_IN    = 880;   // CSS stagger ends ~880ms after phase entry
        const CLEAN_HOLD = 1100;  // dwell with picker visible + cursor off-screen
        /* Intro cursors (CSN + SPD) use the v6FxCursorIntro keyframe:
         *   35% land · 75% press · 85% release
         * Duration 1400ms → land at 490ms, press at 1050ms, release 1190ms.
         * Linger = 560ms (real "decide then click" beat). */
        const INTRO_LAND  = 490;
        const INTRO_PRESS = 1050;
        const INTRO_HOLD  = 750;   // from land → press + release + small dismiss buffer

        const fireFxClick = (fxKey, targetSelector) => {
            const target = panel.querySelector(targetSelector);
            if (target) positionFxOnTarget(fxKey, target);
            const fx = panel.querySelector(`.v6-fx[data-v6-fx="${fxKey}"]`);
            if (!fx) return;
            fx.classList.remove('is-clicking');
            void fx.offsetWidth;  /* reflow so the animation restarts cleanly */
            fx.classList.add('is-clicking');
        };

        /* CN logo + the first click on it are skipped — the intro opens
           directly on Create/Share/Navigate so the viewer lands inside
           the product, not on a marketing splash. */
        setPhase('csn');
        /* Cursor stays invisible until is-clicking fires.
         * Picker fades in + dwells clean (no hover) before the cursor arrives. */
        wait(FADE_IN + CLEAN_HOLD, () => {
            fireFxClick('csn', '.v6-csn-tile[data-csn="navigate"] .v6-csn-tile-icon');
            const navTile = panel.querySelector('.v6-csn-tile[data-csn="navigate"] .v6-csn-tile-icon');
            if (navTile) cursorTargetEl = navTile;
            /* Hover Navigate when the cursor lands; press fires ~560ms
             * later, so the hover holds for a real beat. */
            wait(INTRO_LAND, () => panel.classList.add('csn-hover-navigate'));
            wait(INTRO_LAND + INTRO_HOLD, () => {
                setPhase('spd');
                panel.classList.remove('csn-hover-navigate');
                wait(FADE_IN + CLEAN_HOLD, () => {
                    fireFxClick('spd', '.v6-spd-map .v6-spd-mini-chart');
                    /* Two-stage map reaction synced to the cursor:
                     *   LAND  → hover state (smooth lift + soft glow)
                     *   PRESS → pressed state (lift further + scale down
                     *           + brighter glow). Both are pure transitions,
                     *           no keyframe animation, so nothing snaps. */
                    wait(INTRO_LAND,  () => panel.classList.add('spd-hover-map'));
                    wait(INTRO_PRESS, () => panel.classList.add('spd-click-map'));
                    wait(INTRO_LAND + INTRO_HOLD, () => {
                        /* Phase change → SPD container fades + lifts + blurs out.
                         * Leave the hover/click classes ON so the map stays
                         * visually pressed during the exit — removing them
                         * here would cause a 2px snap-back on the pill at the
                         * exact moment the container is also transforming,
                         * which read as "jumpy." Cleanup happens after the
                         * exit animation completes (~700ms), when the panel
                         * is invisible anyway. */
                        introPlayed = true;
                        onDone();
                        wait(700, () => {
                            panel.classList.remove('spd-hover-map', 'spd-click-map');
                        });
                    });
                });
            });
        });
    };

    const enterRing = (onDone) => {
        setPhase('ring');
        wait(T.ringIn, onDone);
    };

    /* Run a single stage at activeStage: activate it + panel, narrate the
       agent, then advance.

       The old flow took a hard cut from stage → full-screen `success`
       overlay → ring breath → next stage, which read as three disjoint
       beats. New flow is one smooth motion: when the stage dwell ends,
       the ring zooms back in (ring phase) WHILE the just-completed
       node bursts green (CSS animation on .v6-is-done) and the progress
       segment + completion arc both advance to the next node. After the
       breath, we drop straight into the next stage. No full-screen
       success takeover — the "stage complete" beat lives on the ring
       itself. */
    /* Six-beat per-stage demo flow:
        1. Home          — landing: header/meta/tiles/agent-action.
        2. Agent open    — cursor → top-pick agent tile, click, panel slides in.
        3. Agent work    — panel reveals output lines, state flips to Ready.
        4. WS handoff    — cursor → workspace tile, click, panel slides out.
        5. WS work       — collab-inner zooms in, per-stage micro-anim plays.
        6. Persona swap  — pill flips Host→Guest, re-render agent panel for guest.
        7. Advance to next stage. */
    const stageFxEl = panel.querySelector('.v6-fx[data-v6-fx="stage"]');
    const agentPanelEl  = panel.querySelector('[data-v6-agent-panel]');
    const agentNameEl   = panel.querySelector('[data-v6-agent-panel-name]');
    const agentSubEl    = panel.querySelector('[data-v6-agent-panel-sub]');
    const agentStateEl  = panel.querySelector('[data-v6-agent-panel-state]');
    const agentBodyEl   = panel.querySelector('[data-v6-agent-panel-body]');
    const agentCtaEl    = panel.querySelector('[data-v6-agent-panel-cta]');

    /* ─── Cursor targeting — generalized ─── */
    const positionStageCursor = (selectorWithinActivePanel) => {
        const panelEl = stagePanels[activeStage];
        if (!panelEl || !stageFxEl) return;
        let target;
        /* Allow the agent panel CTA / persona pill as targets too — they live
           OUTSIDE the active stage panel. */
        if (selectorWithinActivePanel.startsWith('!')) {
            target = panel.querySelector(selectorWithinActivePanel.slice(1));
        } else {
            target = panelEl.querySelector(selectorWithinActivePanel);
        }
        positionFxOnTarget('stage', target);
    };

    /* Fire the stage cursor at an explicit DOM element. Optional xRatio /
       yRatio choose where inside the target's box the tip should land
       (defaults to dead center). Used by the deploy stage's gantt-row
       walker, which lands the tip 78% across each row. */
    const fireStageCursorAt = (target, opts = {}) => {
        if (!stageFxEl || !target) return;
        const xRatio = (typeof opts.xRatio === 'number') ? opts.xRatio : 0.5;
        const yRatio = (typeof opts.yRatio === 'number') ? opts.yRatio : 0.5;
        const panelRect = panel.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const x = (targetRect.left + targetRect.width * xRatio) - (panelRect.left + panelRect.width / 2);
        const y = (targetRect.top + targetRect.height * yRatio) - (panelRect.top + panelRect.height / 2);
        stageFxEl.style.setProperty('--fx-x', `${Math.round(x)}px`);
        stageFxEl.style.setProperty('--fx-y', `${Math.round(y)}px`);
        stageFxEl.classList.remove('is-clicking');
        void stageFxEl.offsetWidth;
        stageFxEl.classList.add('is-clicking');
        /* Remove is-clicking just after the release (80% × 1000ms = 800ms)
           so the wrapper is re-fireable and downstream state changes can
           animate the target out without the cursor sitting on empty space. */
        wait(820, () => stageFxEl.classList.remove('is-clicking'));
    };

    /* UI physics timeline for a stage-cursor click (--fx-duration: 1000ms):
     *   0ms     cursor invisible at offset, begins fly-in
     *   500ms   cursor LANDS at target (50%)
     *   650ms   cursor PRESSES + ripple fires (65% — the click moment)
     *           callers should fire state changes at this offset so the
     *           target reacts as the cursor presses, not before or after
     *   800ms   cursor RELEASES (80% — scale back to 1)
     *   820ms   JS removes is-clicking → wrapper resets
     *
     * CALLERS: schedule state changes at ~T+620–650ms after fireStageCursor.
     * Existing callers use 620ms — 30ms before the visual press, imperceptible. */
    const fireStageCursor = (selector) => {
        if (!stageFxEl) return;
        if (selector) positionStageCursor(selector);
        stageFxEl.classList.remove('is-clicking');
        void stageFxEl.offsetWidth;
        stageFxEl.classList.add('is-clicking');
        wait(820, () => stageFxEl.classList.remove('is-clicking'));
    };

    /* ─── AGENT PANEL CONTENT — 6 stages × 2 personas (host / guest) ───
     * Each entry has a `layout` matching the real React implementation:
     *   form-think : seed-tabs + aggressiveness picker + result preview
     *                (matches GeneralThinkAndSync.tsx)
     *   form-sow   : doc-tabs + section toggles + sticky Generate PDF
     *                (matches StatementOfWorkAgent.tsx)
     *   chat       : alternating AI / user bubbles (matches AIChat — the
     *                shared base for Tailored Script, Execution Readiness,
     *                AI Navigator, Why Commit?, Smart Conversation, AutoSolve)
     *   report     : section headers + body content + Regen/Copy chrome
     *                (matches Cheat Sheet's report agent renderer)
     *   list       : checklist / picker — used by guest-side widgets
     *                (Solution Fit, Assign Owners) that aren't true chats. */
    /* Single source of truth for agent icons — SVG paths copied
     * VERBATIM from the React shared/icons/ components. Both the
     * agent-panel orb and the stage-base tile icons read from here. */
    const AGENT_ICONS = {
        /* CloudUploadIcon */
        'think-and-sync':      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z"/></svg>',
        /* QuickreplyIcon */
        'smart-conversation':  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h9v-8h7z"/><path d="M22.5 16h-2.2l1.7-4h-5v6h2v5z"/></svg>',
        /* TailorIcon */
        'tailored-script':     '<svg viewBox="0 0 512.005 512.005" fill="currentColor" aria-hidden="true"><path d="M509.637,133.134c-3.306-3.48-8.773-3.645-12.271-0.356c-29.705,28.047-54.68,30.98-80.072,9.129l8.565-7.099 c22.927-22.918,22.927-60.216,0-83.144c-11.056-11.056-25.826-17.156-41.568-17.156c-15.742,0-30.512,6.101-42.123,17.764 l-6.751,8.166l-8.773-8.773c-22.919-22.927-60.234-22.91-83.144,0c-22.918,22.927-22.918,60.225,0,83.144l16.618,16.61 L137.752,299.283l-29.358-29.366c-22.927-22.927-60.234-22.91-83.144,0c-22.919,22.927-22.919,60.225,0,83.144l37.202,37.202 L1.994,463.314c-2.855,3.454-2.621,8.504,0.555,11.672c1.684,1.692,3.905,2.543,6.135,2.543c1.953,0,3.922-0.659,5.528-1.987 l73.051-60.468l51.382,51.382c1.701,1.692,3.922,2.543,6.135,2.543c2.222,0,4.443-0.85,6.135-2.543 c3.393-3.393,3.393-8.886,0-12.271l-50.219-50.228l109.065-90.277l26.659,26.659c11.307,11.307,25.617,16.158,39.849,16.158 c16.002,0,31.909-6.153,43.286-16.158c11.064-11.064,17.165-25.834,17.165-41.576s-6.101-30.503-17.165-41.567l-18.814-18.823 l103.06-85.296c15.16,13.729,30.833,20.671,46.974,20.671c18.944,0,38.495-9.45,58.507-28.351 C512.77,142.107,512.926,136.623,509.637,133.134z M73.57,376.838l-36.048-36.048c-16.141-16.15-16.141-42.444,0-58.602 c16.141-16.15,42.444-16.158,58.602,0l30.512,30.52L73.57,376.838z M307.285,269.465c7.784,7.793,12.08,18.189,12.08,29.297 s-4.296,21.513-11.672,28.924c-15.273,13.399-42.609,16.766-59.001,0.382l-25.496-25.505l64.121-53.074L307.285,269.465z M271.228,137.994l-15.455-15.455c-16.15-16.15-16.15-42.444,0-58.594c16.15-16.15,42.444-16.167,58.602,0l9.928,9.919 L271.228,137.994z M390.428,99.377l-28.351,28.351c-1.692,1.692-3.914,2.543-6.135,2.543c-2.213,0-4.434-0.85-6.135-2.543 c-3.384-3.393-3.384-8.886,0-12.271l28.351-28.351c3.393-3.393,8.878-3.393,12.271,0 C393.821,90.499,393.821,95.984,390.428,99.377z"/></svg>',
        /* DescriptionIcon */
        'sow-generator':       '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"/></svg>',
        /* HandshakeIcon — Solution-Needs Fit */
        'solution-fit':        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41m.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l8.32-8.34c1.17-1.17 1.17-3.07 0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-.06z"/></svg>',
        /* TaskAltIcon — EXACT SVG from shared/icons/TaskAltIcon.tsx, which is
         * what surfaces/stages/stageAgentRegistry.tsx:182 actually uses for
         * Execution Readiness. (StageAgents/agentRegistry.tsx uses
         * TaskAltAltIcon — same visual intent but mis-encoded as nested
         * circles, which is what was rendering as a "filled-in target".)
         * Two subpaths in ONE path: the check and an OPEN ring with a
         * gap where the check exits. */
        'execution-readiness': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10zm-2.21 5.04c.13.57.21 1.17.21 1.78 0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.44-1.44C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39z"/></svg>',
        /* ThumbUpIcon — Why Commit? */
        'why-commit':          '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0-1a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>',
        /* AddTaskAltIcon — exact path from shared/icons/AddTaskAltIcon.tsx,
         * which is what StageAgents/agentRegistry.tsx:257 uses for
         * Assign Owners. (The other registry uses AddTaskIcon — a different
         * shape with a plus sign inside; that's not what ships.) */
        'assign-owners':       '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.18L10.59 16.6 6.35 12.36l1.41-1.41 2.83 2.83L20.59 3.77 22 5.18zM3 13a9 9 0 0 0 9 9c5 0 9-4 9-9h-2a7 7 0 0 1-7 7 7 7 0 1 1 0-14V4a9 9 0 0 0-9 9z"/></svg>',
        /* AINavigatorIcon */
        'ai-navigator':        '<svg viewBox="0 0 768 971" fill="currentColor" overflow="hidden" aria-hidden="true"><g transform="translate(-1657 -646)"><path fill-rule="evenodd" d="M1767.17 1312.55 1794.45 1362.72C1837.2 1425.87 1903.66 1471.72 1981.08 1487.53L1985.83 1488.01 1693.35 1617 1657 1580.72ZM2314.83 1312.55 2425 1580.72 2388.65 1617 2096.17 1488.01 2100.92 1487.53C2178.34 1471.72 2244.8 1425.87 2287.55 1362.72ZM2041 646 2154.67 922.686 2100.92 906.033C2081.57 902.079 2061.53 900.003 2041 900.003 2020.47 900.003 2000.43 902.079 1981.08 906.033L1927.33 922.686Z"/><path transform="matrix(1 0 0 1.00948 1830 984)" d="M201.953 164.765C204.855 156.061 217.145 156.061 220.047 164.765L237.058 215.853C244.65 238.623 262.524 256.487 285.298 264.066L336.36 281.078C345.064 283.979 345.064 296.27 336.36 299.171L285.272 316.183C262.502 323.774 244.638 341.648 237.058 364.423L220.047 415.485C218.407 420.481 213.027 423.202 208.031 421.562 205.154 420.618 202.897 418.363 201.953 415.485L184.941 364.397C177.355 341.633 159.492 323.769 136.728 316.183L85.6396 299.171C80.6434 297.531 77.9223 292.153 79.562 287.155 80.5062 284.277 82.7626 282.022 85.6396 281.078L136.728 264.066C159.492 256.48 177.355 238.617 184.941 215.853ZM100.067 30.2785C101.06 27.2778 104.298 25.6507 107.299 26.6443 109.017 27.2132 110.364 28.5607 110.933 30.2785L121.14 60.9262C125.703 74.5885 136.411 85.2967 150.074 89.8596L180.721 100.067C183.722 101.06 185.349 104.298 184.356 107.299 183.787 109.017 182.439 110.364 180.721 110.933L150.074 121.14C136.403 125.677 125.677 136.403 121.14 150.074L110.933 180.721C109.94 183.722 106.702 185.349 103.701 184.356 101.983 183.787 100.636 182.439 100.067 180.721L89.8596 150.074C85.3225 136.403 74.5969 125.677 60.9262 121.14L30.2785 110.933C27.2778 109.94 25.6507 106.702 26.6443 103.701 27.2132 101.983 28.5607 100.636 30.2785 100.067L60.9262 89.8596C74.5969 85.3225 85.3225 74.5969 89.8596 60.9262ZM286.511 2.61112C287.202 0.615513 289.381-0.441377 291.378 0.250493 292.485 0.634258 293.353 1.50421 293.738 2.61112L300.543 23.0254C303.576 32.1511 310.724 39.2987 319.849 42.3319L340.264 49.1366C342.26 49.8284 343.315 52.007 342.624 54.0028 342.242 55.1097 341.371 55.9796 340.264 56.3633L319.849 63.1681C310.74 66.216 303.592 73.3652 300.543 82.4746L293.738 102.889C293.047 104.884 290.869 105.941 288.872 105.249 287.764 104.866 286.897 103.996 286.511 102.889L279.707 82.4746C276.658 73.3652 269.51 66.216 260.4 63.1681L240.012 56.3633C238.017 55.6715 236.96 53.493 237.652 51.4972 238.036 50.3902 238.905 49.5204 240.012 49.1366L260.427 42.3319C269.552 39.2987 276.7 32.1511 279.733 23.0254Z"/></g></svg>',
        /* PhotoFilterIcon — Cheat Sheet */
        'cheat-sheet':         '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 10v9H5V5h9V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-2.5 2.71-3.39 4.08-2.4-2.96L7.5 18h9l-2.5-3.46 1.5-1.83zM18 3V1h-2v2h-2c.01.01 0 2 0 2h2v2.01c.01 0 2 0 2-.01V5h2V3h-2z"/></svg>',
        /* SportsHandballAltIcon — Diligent Attendee (person glyph) */
        'diligent-attendee':   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 7c4 0 8 2 8 6v6h-3v-3h-1v3H8v-3H7v3H4v-6c0-4 4-6 8-6z"/></svg>',
        /* AutoFixIcon — Proposed Scope (magic wand + sparkles) */
        'proposed-scope':      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5L22 2zm-7.63 5.29-12.08 11.67a.999.999 0 0 0 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05a.999.999 0 0 0 0-1.41l-2.33-2.35z"/></svg>',
        /* AutoModeIcon */
        'auto-solve':          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.03 3.56c-1.67-1.39-3.74-2.3-6.03-2.51v2.01c1.73.19 3.31.88 4.61 1.92l1.42-1.42zM11 3.06V1.05c-2.29.2-4.36 1.12-6.03 2.51l1.42 1.42C7.69 3.94 9.27 3.25 11 3.06zM4.98 6.39 3.56 4.97C2.17 6.64 1.26 8.71 1.06 11h2.01c.19-1.73.88-3.31 1.91-4.61zM20.94 11h2.01c-.21-2.29-1.11-4.36-2.51-6.03l-1.42 1.42c1.04 1.3 1.73 2.88 1.92 4.61zM7 12l3.44 1.56L12 17l1.56-3.44L17 12l-3.44-1.56L12 7l-1.56 3.44z"/><path d="M12 21c-3.11 0-5.85-1.59-7.46-4H7v-2H1v6h2v-2.7c1.99 2.84 5.27 4.7 9 4.7 4.45 0 8.27-2.64 10-6.43l-1.85-.73C18.64 18.88 15.58 21 12 21z"/></svg>',
    };

    const AGENT_CONTENT = {
        host: [
            { /* 0 Discovery — Think & Sync (form-think) */
                name: 'Think & Sync', sub: 'Reading 3 calls + 11 emails',
                iconKey: 'think-and-sync',
                layout: 'form-think',
                /* Tabs match GeneralThinkAndSync exactly: Text / Weblink / File */
                tabs: ['Text', 'Weblink', 'File'],
                activeTab: 2,
                sources: ['acme-discovery-1.txt', 'acme-call-may14.vtt', '+ 11 more'],
                /* Aggressiveness pills — Shield / Balance / FighterJet icons
                 * copied verbatim from shared/icons/ShieldIcon.tsx,
                 * BalanceIcon.tsx, FighterJetIcon.tsx so the demo matches
                 * what the real ThinkAndSync agent renders in the SPA. */
                aggression: [
                    { iconSvg: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"/></svg>', label: 'Cautious' },
                    { iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3a1 1 0 0 1 1 1v.586l5.293 1.121a1 1 0 0 1 .707.952V8h2v2h-2v.5l2.447 4.894A1 1 0 0 1 20.5 17h-4a1 1 0 0 1-.947-1.606L18 10.5V10h-5v9h3v2H8v-2h3v-9H6v.5l2.447 4.894A1 1 0 0 1 7.5 17h-4a1 1 0 0 1-.947-1.606L5 10.5V10H3V8h2V6.659a1 1 0 0 1 .707-.952L11 4.586V4a1 1 0 0 1 1-1zm5 9.236L15.618 15h2.764L17 12.236zm-10 0L5.618 15h2.764L7 12.236z"/></svg>', label: 'Balanced' },
                    { iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.5 12.5L19 11l-3-1V8l-3-2-3-1V3l-1-1-1 1v2L5 6 4 7v3l-3 1.5v1L4 14v2l1 1 4-1v3l-1 1v1h6v-1l-1-1v-3l4 1 1-1v-2l3-1.5v-1zm-9 4l-1 1-1-1 1-3 1 3z"/></svg>', label: 'Strike' },
                ],
                activeAggression: 1,
                /* Think & Sync only proposes answers it can derive from
                 * sources (calls + emails). Compliance and decision criteria
                 * are intentionally left empty — those come from Smart
                 * Conversation talking to Jay directly, who's the only one
                 * who knows what HE actually cares about. */
                summary: { heading: 'Proposed answers · 2 fields', items: [
                    '<strong>Current vendor</strong> → Salesforce · 3 yrs',
                    '<strong>Team size</strong> → ~30 users in pilot',
                ]},
                cta: 'Accept · Sync to workspace',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 1 Experience — Tailored Script (form-analyze).
                 * Same novel-feature treatment as Proposed Scope: the
                 * agent reads Discovery + the content library and proposes
                 * a tailored demo flow. The thinkingPhases narrate what
                 * the agent "found" in Discovery, then the diff is the
                 * proposed 3-artifact flow. */
                name: 'Tailored Script', sub: 'Drafting demo flow from Discovery',
                iconKey: 'tailored-script',
                layout: 'form-analyze',
                contexts: [
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM7 18v-2h7v2H7zm0-4v-2h10v2H7zm6-7V3.5L18.5 9H13z"/></svg>',
                        label: 'Discovery · Acme',
                        meta: '12 notes · 3 calls · QA themes',
                    },
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2zM18 14v4l3-2-3-2z"/></svg>',
                        label: 'Content library · 84 assets',
                        meta: 'Videos · briefs · ROI charts',
                    },
                ],
                thinkingPhases: [
                    'Reading Discovery · 12 notes',
                    'Compliance is a hot button · noted',
                    'SFDC sync is must-have · noted',
                    'Drafting 22-min demo flow',
                ],
                runLabel: 'Run · Draft demo flow',
                summary: { heading: '3 assets proposed', items: [
                    '<strong>Acme x CN · Pilot</strong> &rarr; 2:14 video · open',
                    '<strong>SOC2 Trust Brief</strong> &rarr; PDF · proof for compliance',
                    '<strong>ROI · 12mo</strong> &rarr; interactive · close',
                ]},
                cta: 'Accept · Publish to Workspace',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 2 Scope — Proposed Scope (form-analyze). Sarah picks
                 * Explore in the stage home, the menu shows 4 agents,
                 * she clicks Proposed Scope. NO file upload — the agent
                 * is smart enough to read Discovery and the module
                 * catalog on its own. Sarah just hits Run, the agent
                 * cross-analyzes the two, and proposes a scope. Same
                 * three-phase pattern as Think & Sync (form → orb →
                 * proposal/Accept), but the input phase shows the
                 * sources being auto-read, not a dropzone. */
                name: 'Proposed Scope', sub: 'Cross-analyzing Discovery + module catalog',
                iconKey: 'proposed-scope',
                layout: 'form-analyze',
                contexts: [
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM7 18v-2h7v2H7zm0-4v-2h10v2H7zm6-7V3.5L18.5 9H13z"/></svg>',
                        label: 'Discovery · Acme',
                        meta: '12 notes · 3 calls · QA themes',
                    },
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.6l7 3.5v7.3l-7-3.5V9.6zm9 10.8v-7.3l7-3.5v7.3l-7 3.5z"/></svg>',
                        label: 'Module catalog · 12 modules',
                        meta: 'Pricing · dependencies · margins',
                    },
                ],
                thinkingPhases: [
                    'Reading Discovery · 12 notes',
                    'Mapping requirements → modules',
                    'Scoring fit · pricing · margin',
                    'Composing proposal',
                ],
                runLabel: 'Run · Propose scope',
                summary: { heading: '5 in-scope · 3 deferred', items: [
                    '<strong>Core platform · SSO</strong> &rarr; In-scope · foundational',
                    '<strong>SFDC sync</strong> &rarr; In-scope · day-one need',
                    '<strong>Multi-region · EU</strong> &rarr; In-scope · EU data residency',
                    '<strong>AI co-pilot</strong> &rarr; In-scope · seller request',
                    '<strong>Premium onboarding</strong> &rarr; In-scope · pilot success',
                    '<strong>Custom workflows</strong> &rarr; Defer · phase 2',
                    '<strong>HIPAA audit pack</strong> &rarr; Defer · not required',
                    '<strong>Mobile SDK</strong> &rarr; Defer · later release',
                ]},
                cta: 'Accept · Sync to workspace',
                wsTile: '.v6-section-collab .v6-app-tile:first-child',
            },
            { /* 3 Commit — Execution Readiness (chat) */
                name: 'Execution Readiness', sub: 'Pre-flight before signature',
                iconKey: 'execution-readiness',
                layout: 'chat',
                bubbles: [
                    { from: 'ai', text: 'Is Acme ready to commit?' },
                    { from: 'user', text: 'Run the pre-flight.' },
                    { from: 'ai', text: '✓ Legal terms approved both sides<br/>✓ Modules locked at $480K<br/>✓ All 4 owners assigned<br/><strong>Ready to send.</strong>' },
                ],
                cta: 'Send for Signature',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 4 Deploy host — Assign Owners (form-analyze). Analyzes the
                 * roster + past deployment patterns and proposes an owner
                 * for each of the 5 rollout tracks. Accept syncs the owner
                 * badges onto the gantt rows. The classic gantt "now-line
                 * + bars filling" animation is moved to the guest chat
                 * beat below — that's where it visually belongs. */
                name: 'Assign Owners', sub: 'Mapping deployment roster to tracks',
                iconKey: 'assign-owners',
                layout: 'form-analyze',
                contexts: [
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
                        label: 'Team roster · 14 owners',
                        meta: 'Eng · IT · Ops · CS · Sales Eng',
                    },
                    {
                        iconSvg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
                        label: 'Past deployments · 12 patterns',
                        meta: 'Owner ↔ track success rates',
                    },
                ],
                thinkingPhases: [
                    'Reading roster · 14 owners available',
                    'Pattern: SFDC sync → IT lead (8/12 wins)',
                    'Pattern: Onboard → CS w/ pilot exp',
                    'Composing assignment plan',
                ],
                runLabel: 'Run · Assign owners',
                summary: { heading: '5 owners proposed', items: [
                    '<strong>Provision</strong> &rarr; MK · Eng lead',
                    '<strong>Integrate</strong> &rarr; SK · IT lead',
                    '<strong>Migrate</strong> &rarr; JB · Ops lead',
                    '<strong>Onboard</strong> &rarr; LA · CS lead',
                    '<strong>Train</strong> &rarr; MC · Sales Eng',
                ]},
                cta: 'Accept · Assign owners',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 5 Success host — Cheat Sheet (report). Sections mirror the
                 * actual CheatSheetAgent schema (core/platform/.../cheat_sheet.py):
                 * Executive Summary · Key Team Members · {Guest} Strategic Goals
                 * · Progress & Value Realization · Health Signals · Next Steps. */
                name: 'Cheat Sheet', sub: 'Stage report · Acme handoff',
                iconKey: 'cheat-sheet',
                layout: 'report',
                sections: [
                    { h: 'Executive Summary', body: 'Welcome to the <strong>Acme rollout</strong> journey between <strong>Customer Node</strong> and <strong>Acme Co.</strong> — a 6-stage flow from <strong>Discovery</strong> to <strong>Success</strong>. Currently on stage 6 of 6: <strong>Success</strong> (<em>Active</em>). On schedule · no risks flagged · healthy trajectory.' },
                    { h: 'Key Team Members', body: '<strong>Customer Node Team</strong><li>Sarah K. — CSM</li><li>Michael K. — Eng lead</li><strong>Acme Co. Team</strong><li>Jay B. — Pilot lead</li><li>Priya N. — IT lead</li>' },
                    { h: 'Acme Strategic Goals', body: '<li>Reduce sales cycle by 30% — <strong>High Priority</strong></li><li>EU data residency — <strong>High Priority</strong></li><li>SOC2 compliance — <strong>Medium Priority</strong></li>' },
                    { h: 'Progress &amp; Value Realization', body: '<strong>Stage progress:</strong><li>Discovery — <em>Success</em></li><li>Experience — <em>Success</em></li><li>Scope — <em>Success</em></li><li>Commit — <em>Success</em></li><li>Deploy — <em>Success</em></li><li>Success — <em>Active</em> (journey is here)</li><strong>Value realization:</strong> Cycle goal → Scope locked the timeline. EU residency → Multi-region track shipped. SOC2 → audit pack queued for Q1.' },
                    { h: 'Health Signals', body: '<li>NPS (average): <strong>72.4%</strong></li><li>Sentiment (average): <strong>89.0%</strong></li><li>Open tickets: <strong>0</strong> · Closed: <strong>4</strong> · Critical open: <strong>0</strong></li><strong>Risks:</strong> none flagged. <strong>Accolades:</strong> pilot delivered 8 days early · all 5 deploy tracks on schedule.' },
                    { h: 'Next Steps', body: 'The path forward is charted — your dedicated agent has outlined the decisive next steps to keep momentum strong. Renewal discussion scheduled · 36-month commit at +18% ACV.' },
                ],
                cta: 'Share with Acme',
                wsTile: '.v6-section-collab .v6-app-tile:first-child',
            },
        ],
        guest: [
            { /* 0 Discovery guest — Smart Conversation (chat). Three
                 * customer messages, each filling one of the three rows
                 * Think & Sync left empty (renewal, compliance, decision).
                 * Bubble order is tuned so the AI prompts → customer
                 * answers → corresponding row fills land in lockstep. */
                name: 'Smart Conversation', sub: 'Filling Discovery for Acme',
                iconKey: 'smart-conversation',
                layout: 'chat',
                bubbles: [
                    { from: 'ai',   text: 'Let\'s finish Discovery — I\'ll fill the sheet as you answer.' },
                    { from: 'ai',   text: 'When are you targeting <strong>renewal / go-live</strong>?' },
                    { from: 'user', text: 'Q3 2026 — locked in.' },
                    { from: 'ai',   text: 'Any <strong>compliance constraints</strong> I should flag?' },
                    { from: 'user', text: 'SOC2 is non-negotiable. EU data must stay EU.' },
                    { from: 'ai',   text: 'And what\'s driving the <strong>decision</strong> overall?' },
                    { from: 'user', text: 'Security first, then SFDC sync.' },
                ],
                cta: 'Save to Discovery',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 1 Experience guest — Diligent Attendee. Scans the
                 * tailored agenda Sarah just published and helps Jay
                 * walk into the meeting prepared with smart questions.
                 * Cheat Sheet stays exclusive to Success — different
                 * agent, different job. */
                name: 'Diligent Attendee', sub: 'Prepping you for the meeting',
                iconKey: 'diligent-attendee',
                layout: 'chat',
                bubbles: [
                    { from: 'ai',   text: 'I scanned Sarah\'s agenda. Want me to draft questions you can ask?' },
                    { from: 'user', text: 'Yes — keep them sharp.' },
                    { from: 'ai',   text: 'On <strong>SOC2 architecture</strong>: "How is key rotation handled in the EU region?"' },
                    { from: 'ai',   text: 'On <strong>SFDC sync</strong>: "What happens to in-flight records during a failover?"' },
                    { from: 'user', text: 'Add one on the Linear case study.' },
                    { from: 'ai',   text: 'On <strong>Linear</strong>: "What was their pilot-to-renewal timeline?"' },
                ],
                cta: 'Save to my prep',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 2 Scope guest — Solution Fit, chat layout. Honest
                 * conversation about whether the proposed scope aligns
                 * with Jay's needs, surfacing changes that should be
                 * made before signature. */
                name: 'Solution Fit', sub: 'How well does this scope fit?',
                iconKey: 'solution-fit',
                layout: 'chat',
                bubbles: [
                    { from: 'ai',   text: 'Sarah proposed 5 in-scope, 3 deferred. Let\'s pressure-test the cuts.' },
                    { from: 'ai',   text: 'On <strong>HIPAA audit pack</strong> — Sarah deferred it. Compliance team will need it eventually.' },
                    { from: 'user', text: 'True. Defer for now, revisit in Q1.' },
                    { from: 'ai',   text: 'On <strong>Mobile SDK</strong> — deferred. Field reps would use it day-one.' },
                    { from: 'user', text: 'Flag it. We may need to pull that into phase 1.' },
                    { from: 'ai',   text: 'Flagged. <strong>AI co-pilot</strong> is in-scope — does that match how your team will actually use it?' },
                    { from: 'user', text: 'Yes — and we want a dedicated EU support pod with Multi-region.' },
                ],
                cta: 'Send feedback to Sarah',
                wsTile: '.v6-section-collab .v6-app-tile:first-child',
            },
            { /* 3 Commit guest — Why Commit? (chat) */
                name: 'Why Commit?', sub: 'Case for moving forward',
                iconKey: 'why-commit',
                layout: 'chat',
                bubbles: [
                    { from: 'user', text: 'Why now? My CFO needs the case.' },
                    { from: 'ai',   text: 'Three signals pulled from your Discovery + Scope:<br/>• Sales-cycle compression vs peer baseline<br/>• Pilot exit clauses preserved<br/>• Q4 procurement freeze risk' },
                    { from: 'user', text: 'CFO will push back on cost. Counter?' },
                    { from: 'ai',   text: 'Two angles: <strong>cost of delay</strong> ≈ 1 quarter of pipeline slip, and the locked-in pilot pricing expires next month.' },
                    { from: 'user', text: 'Good. Frame the write-up around those.' },
                    { from: 'ai',   text: 'Drafted. Sending the 1-pager + supporting Discovery quotes to <strong>cfo@acme.com</strong>.' },
                ],
                cta: 'Send write-up',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 4 Deploy guest — AI Navigator (chat). As Jay talks to the
                 * Navigator, the gantt fills with green (now-line sweeps,
                 * bars run, then complete). The chat narrates what's
                 * happening on the gantt — paced to overlap so the user
                 * sees both at once. */
                name: 'AI Navigator', sub: 'Tracking your rollout',
                iconKey: 'ai-navigator',
                layout: 'chat',
                bubbles: [
                    { from: 'ai',   text: 'Sarah just routed the 5 tracks. I\'ll keep you posted as they ship.' },
                    { from: 'user', text: 'Where do I watch progress?' },
                    { from: 'ai',   text: 'Right here. Each track turns green as we ship: <strong>Provision</strong>, <strong>Integrate</strong>, <strong>Migrate</strong>, <strong>Onboard</strong>, <strong>Train</strong>.' },
                    { from: 'user', text: 'What\'s the ETA?' },
                    { from: 'ai',   text: 'First two tracks finish this week. Full rollout: ~3 weeks. I\'ll page you the moment any track slips.' },
                ],
                cta: 'Save to my workspace',
                wsTile: '.v6-section-collab .v6-app-tile',
            },
            { /* 5 Success guest — Auto Solve (chat) */
                name: 'Auto Solve', sub: 'Self-serve fixes for Acme tickets',
                iconKey: 'auto-solve',
                layout: 'chat',
                bubbles: [
                    { from: 'ai',   text: 'Got your issue. Scanning <strong>247 past tickets</strong> for matches&hellip;' },
                    { from: 'ai',   text: 'Found a close match: <strong>#2149 — EU IdP not mapping users</strong>. Resolved by re-syncing the IdP.' },
                    { from: 'ai',   text: 'Before we open a new ticket, try this:<br/>Settings → Integrations → <strong>SSO</strong> → <strong>Resync IdP</strong>. Should take ~10 seconds.' },
                    { from: 'user', text: 'Worked. Thanks!' },
                    { from: 'ai',   text: '✓ Resolved without a ticket. Logged as a self-served win.' },
                ],
                cta: 'Open Tickets',
                wsTile: '.v6-section-collab .v6-app-tile:nth-child(3)',
            },
        ],
    };

    /* Build the body HTML for an agent based on its layout. Each layout
     * mirrors the corresponding real React component so the demo doesn't
     * read as "all agents look identical with different copy." */
    const buildAgentBody = (entry) => {
        const layout = entry.layout || 'list';
        const esc = (s) => s; /* content is authored, not user input — no escape */

        if (layout === 'form-think') {
            /* Mirrors GeneralThinkAndSync: 3 tabs (Text/Weblink/File), an
             * input area below the tab row (File tab = dropzone w/ filenames),
             * an aggressiveness picker with icon+label chips, and a result
             * preview with the themes the agent surfaced. */
            const tabRow = entry.tabs.map((t, i) =>
                `<span class="v6-ap-tab${i === entry.activeTab ? ' is-active' : ''}">${t}</span>`
            ).join('');
            const sourceRows = entry.sources.map(s =>
                `<span class="v6-ap-source-row"><span class="v6-ap-source-icon">📄</span>${s}</span>`
            ).join('');
            const aggression = entry.aggression.map((a, i) => {
                const lab = typeof a === 'string' ? a : a.label;
                /* Prefer iconSvg (inline SVG) — emoji is forbidden in this UI. */
                const ic = (typeof a === 'object' && a.iconSvg) ? a.iconSvg : '';
                return `<span class="v6-ap-mode-chip${i === entry.activeAggression ? ' is-active' : ''}" data-mode="${lab.toLowerCase()}">${ic ? `<span class="v6-ap-mode-icon">${ic}</span>` : ''}<span class="v6-ap-mode-label">${lab}</span></span>`;
            }).join('');
            const items = entry.summary.items.map(it => `<li>${it}</li>`).join('');
            /* Diff rows mirror the proposal items. We parse the items
             * string for `Field → value` so the diff view can render
             * them as proper +Field/value pairs (not a generic bullet
             * list). */
            const parseDiff = (raw) => {
                const m = raw.match(/<strong>([^<]+)<\/strong>\s*&rarr;\s*(.+)/) || raw.match(/<strong>([^<]+)<\/strong>\s*→\s*(.+)/);
                return m ? { field: m[1].trim(), value: m[2].trim() } : { field: '', value: raw };
            };
            const diffRows = entry.summary.items.map(it => {
                const d = parseDiff(it);
                return `<div class="v6-ap-diff-row"><span class="v6-ap-diff-marker" aria-hidden="true">+</span><span class="v6-ap-diff-field">${d.field}</span><span class="v6-ap-diff-value">${d.value}</span></div>`;
            }).join('');
            return `
                <div class="v6-ap-think-form">
                    <div class="v6-ap-tabs">${tabRow}</div>
                    <div class="v6-ap-file-dropzone">
                        <span class="v6-ap-file-dropzone-hint">
                            <span class="v6-ap-dropzone-spinner" aria-hidden="true"></span>
                            Reading 3 sources&hellip;
                        </span>
                        <div class="v6-ap-source-list">${sourceRows}</div>
                    </div>
                    <div class="v6-ap-modes">
                        <span class="v6-ap-modes-label">Aggressiveness</span>
                        <span class="v6-ap-mode-row">${aggression}</span>
                    </div>
                    <button type="button" class="v6-ap-think-btn" tabindex="-1">
                        <span class="v6-ap-think-btn-label">Think</span>
                        <svg class="v6-ap-think-btn-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/></svg>
                    </button>
                </div>
                <div class="v6-ap-thinking-stage" aria-hidden="true">
                    <span class="v6-ap-thinking-orb">
                        <svg viewBox="0 0 985 1233" fill="currentColor" aria-hidden="true"><g transform="translate(-2734 -311)"><path d="M3301.47 614.058C3291.46 613.588 3281.27 614.112 3270.99 615.716L3107.42 641.243C3025.19 654.076 2968.94 731.134 2981.77 813.358L2988.71 857.835C3001.55 940.059 3078.6 996.313 3160.83 983.481L3324.4 957.953C3406.62 945.121 3462.88 868.063 3450.04 785.839L3443.1 741.362C3431.88 669.416 3371.47 617.354 3301.47 614.058ZM3272.01 487.428C3447.53 481.44 3599.52 596.142 3619.67 756.308 3641.16 927.152 3504.51 1085.03 3314.45 1108.94 3124.38 1132.85 2952.89 1013.73 2931.4 842.889 2909.91 672.045 3046.56 514.166 3236.62 490.258 3248.5 488.763 3260.3 487.828 3272.01 487.428Z" fill-rule="evenodd"/><path d="M3075 772C3075 746.043 3092.24 725 3113.5 725 3134.76 725 3152 746.043 3152 772 3152 797.957 3134.76 819 3113.5 819 3092.24 819 3075 797.957 3075 772Z" fill-rule="evenodd"/><path d="M3253 756C3253 730.043 3270.01 709 3291 709 3311.99 709 3329 730.043 3329 756 3329 781.957 3311.99 803 3291 803 3270.01 803 3253 781.957 3253 756Z" fill-rule="evenodd"/><path d="M3270.64 852.613 3271.34 854.242C3274.87 878.945 3250.7 902.825 3217.36 907.581 3184.03 912.336 3154.15 896.166 3150.62 871.463L3151.49 864.534Z" fill-rule="evenodd"/><path d="M3048.73 1190.87C3044.45 1113.28 3103.88 1046.91 3181.48 1042.63L3364.53 1032.53C3442.12 1028.25 3508.5 1087.68 3512.78 1165.27L3524.91 1385.17C3529.19 1462.76 3469.76 1529.13 3392.17 1533.41L3209.11 1543.51C3131.52 1547.79 3065.15 1488.36 3060.86 1410.77Z" fill-rule="evenodd"/><path d="M3286.38 491C3273.78 452.769 3310.47 401.952 3381.07 359.855" stroke="currentColor" stroke-width="18.3333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M3367 349C3367 328.013 3383.12 311 3403 311 3422.88 311 3439 328.013 3439 349 3439 369.987 3422.88 387 3403 387 3383.12 387 3367 369.987 3367 349Z" fill-rule="evenodd"/><path d="M105.925 0C146.504-6.13069e-14 183.517 52.6958 201.229 135.685" stroke="currentColor" stroke-width="18.3333" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.0483759 -0.998829 -0.998829 -0.0483759 3203.45 602.137)"/><path d="M3025 387C3025 366.013 3041.34 349 3061.5 349 3081.66 349 3098 366.013 3098 387 3098 407.987 3081.66 425 3061.5 425 3041.34 425 3025 407.987 3025 387Z" fill-rule="evenodd"/><path d="M3087.24 1215.05C2966.65 1243.48 2844.79 1170.12 2810.8 1048.64" stroke="currentColor" stroke-width="34.375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M2742.79 1011.54C2726.27 959.753 2734.12 911 2760.31 902.645 2786.5 894.29 2821.13 929.495 2837.65 981.279 2854.16 1033.06 2846.32 1081.81 2820.13 1090.17 2793.94 1098.53 2759.31 1063.32 2742.79 1011.54Z" fill-rule="evenodd"/><path d="M2829.09 1006.65C2838.64 981.342 2853.77 963.615 2862.89 967.055 2872 970.495 2871.64 993.8 2862.09 1019.11 2852.54 1044.42 2837.4 1062.14 2828.29 1058.7 2819.18 1055.26 2819.53 1031.96 2829.09 1006.65Z" fill-rule="evenodd"/><path d="M3704.32 1429.5C3682.87 1479.44 3645.01 1511.13 3619.74 1500.29 3594.48 1489.44 3591.39 1440.15 3612.84 1390.21 3634.29 1340.27 3672.16 1308.58 3697.42 1319.43 3722.68 1330.27 3725.77 1379.56 3704.32 1429.5Z" fill-rule="evenodd"/><path d="M3635.93 1376.65C3612.13 1389.51 3589.08 1392.99 3584.45 1384.42 3579.82 1375.85 3595.36 1358.48 3619.16 1345.62 3642.96 1332.76 3666 1329.28 3670.64 1337.85 3675.27 1346.42 3659.73 1363.79 3635.93 1376.65Z" fill-rule="evenodd"/><path d="M3484.94 1173.56C3593.57 1180.88 3682.21 1264.3 3697.84 1373.93" stroke="currentColor" stroke-width="34.375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>
                    </span>
                    <span class="v6-ap-thinking-label">Thinking&hellip;</span>
                </div>
                <div class="v6-ap-diff" aria-hidden="true">
                    <div class="v6-ap-diff-head">${entry.summary.items.length} changes proposed</div>
                    <div class="v6-ap-diff-rows">${diffRows}</div>
                </div>`;
        }

        if (layout === 'form-analyze') {
            /* Proposed Scope variant of Think & Sync: no file upload.
             * The agent reads its own context (Discovery + module catalog).
             * Pre-run state shows context cards being auto-scanned + a
             * Run button. Thinking / proposing phases match form-think,
             * so we reuse those orb + diff blocks below. */
            const contextCards = entry.contexts.map(c => `
                <div class="v6-ap-context-card">
                    <span class="v6-ap-context-icon">${c.iconSvg}</span>
                    <span class="v6-ap-context-text">
                        <span class="v6-ap-context-label">${c.label}</span>
                        <span class="v6-ap-context-meta">${c.meta}</span>
                    </span>
                    <span class="v6-ap-context-status" aria-hidden="true"></span>
                </div>
            `).join('');
            const parseDiff = (raw) => {
                const m = raw.match(/<strong>([^<]+)<\/strong>\s*&rarr;\s*(.+)/) || raw.match(/<strong>([^<]+)<\/strong>\s*→\s*(.+)/);
                return m ? { field: m[1].trim(), value: m[2].trim() } : { field: '', value: raw };
            };
            const diffRows = entry.summary.items.map(it => {
                const d = parseDiff(it);
                /* Detect in-vs-out scope from the value text. Proposed Scope
                 * proposes both kinds (curate the offering, not just add
                 * items to a cart) so the diff row marker and the workspace
                 * row treatment both need to know which is which. */
                const isOut = /out[- ]of[- ]scope|defer|deferred/i.test(d.value);
                const scope = isOut ? 'out' : 'in';
                const marker = isOut ? '−' : '+';
                /* Bake v6-ap-reveal in so the rows start invisible. Otherwise
                 * they're visible the moment is-proposing fires, then the JS
                 * adds v6-ap-reveal 180ms later → fade OUT → fade BACK IN
                 * (the "renders twice" defect). */
                return `<div class="v6-ap-diff-row v6-ap-reveal" data-scope="${scope}"><span class="v6-ap-diff-marker" aria-hidden="true">${marker}</span><span class="v6-ap-diff-field">${d.field}</span><span class="v6-ap-diff-value">${d.value}</span></div>`;
            }).join('');
            return `
                <div class="v6-ap-analyze-form">
                    <div class="v6-ap-analyze-head">Auto-reading from your stages</div>
                    <div class="v6-ap-context-cards">${contextCards}</div>
                    <button type="button" class="v6-ap-run-btn v6-ap-think-btn" tabindex="-1">
                        <span class="v6-ap-think-btn-label">${entry.runLabel}</span>
                        <svg class="v6-ap-think-btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7L8 5z"/></svg>
                    </button>
                </div>
                <div class="v6-ap-thinking-stage" aria-hidden="true">
                    <span class="v6-ap-thinking-orb">
                        <svg viewBox="0 0 985 1233" fill="currentColor" aria-hidden="true"><g transform="translate(-2734 -311)"><path d="M3301.47 614.058C3291.46 613.588 3281.27 614.112 3270.99 615.716L3107.42 641.243C3025.19 654.076 2968.94 731.134 2981.77 813.358L2988.71 857.835C3001.55 940.059 3078.6 996.313 3160.83 983.481L3324.4 957.953C3406.62 945.121 3462.88 868.063 3450.04 785.839L3443.1 741.362C3431.88 669.416 3371.47 617.354 3301.47 614.058ZM3272.01 487.428C3447.53 481.44 3599.52 596.142 3619.67 756.308 3641.16 927.152 3504.51 1085.03 3314.45 1108.94 3124.38 1132.85 2952.89 1013.73 2931.4 842.889 2909.91 672.045 3046.56 514.166 3236.62 490.258 3248.5 488.763 3260.3 487.828 3272.01 487.428Z" fill-rule="evenodd"/><path d="M3075 772C3075 746.043 3092.24 725 3113.5 725 3134.76 725 3152 746.043 3152 772 3152 797.957 3134.76 819 3113.5 819 3092.24 819 3075 797.957 3075 772Z" fill-rule="evenodd"/><path d="M3253 756C3253 730.043 3270.01 709 3291 709 3311.99 709 3329 730.043 3329 756 3329 781.957 3311.99 803 3291 803 3270.01 803 3253 781.957 3253 756Z" fill-rule="evenodd"/><path d="M3270.64 852.613 3271.34 854.242C3274.87 878.945 3250.7 902.825 3217.36 907.581 3184.03 912.336 3154.15 896.166 3150.62 871.463L3151.49 864.534Z" fill-rule="evenodd"/><path d="M3048.73 1190.87C3044.45 1113.28 3103.88 1046.91 3181.48 1042.63L3364.53 1032.53C3442.12 1028.25 3508.5 1087.68 3512.78 1165.27L3524.91 1385.17C3529.19 1462.76 3469.76 1529.13 3392.17 1533.41L3209.11 1543.51C3131.52 1547.79 3065.15 1488.36 3060.86 1410.77Z" fill-rule="evenodd"/><path d="M3286.38 491C3273.78 452.769 3310.47 401.952 3381.07 359.855" stroke="currentColor" stroke-width="18.3333" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M3367 349C3367 328.013 3383.12 311 3403 311 3422.88 311 3439 328.013 3439 349 3439 369.987 3422.88 387 3403 387 3383.12 387 3367 369.987 3367 349Z" fill-rule="evenodd"/><path d="M105.925 0C146.504-6.13069e-14 183.517 52.6958 201.229 135.685" stroke="currentColor" stroke-width="18.3333" stroke-miterlimit="8" fill="none" fill-rule="evenodd" transform="matrix(0.0483759 -0.998829 -0.998829 -0.0483759 3203.45 602.137)"/><path d="M3025 387C3025 366.013 3041.34 349 3061.5 349 3081.66 349 3098 366.013 3098 387 3098 407.987 3081.66 425 3061.5 425 3041.34 425 3025 407.987 3025 387Z" fill-rule="evenodd"/><path d="M3087.24 1215.05C2966.65 1243.48 2844.79 1170.12 2810.8 1048.64" stroke="currentColor" stroke-width="34.375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/><path d="M2742.79 1011.54C2726.27 959.753 2734.12 911 2760.31 902.645 2786.5 894.29 2821.13 929.495 2837.65 981.279 2854.16 1033.06 2846.32 1081.81 2820.13 1090.17 2793.94 1098.53 2759.31 1063.32 2742.79 1011.54Z" fill-rule="evenodd"/><path d="M2829.09 1006.65C2838.64 981.342 2853.77 963.615 2862.89 967.055 2872 970.495 2871.64 993.8 2862.09 1019.11 2852.54 1044.42 2837.4 1062.14 2828.29 1058.7 2819.18 1055.26 2819.53 1031.96 2829.09 1006.65Z" fill-rule="evenodd"/><path d="M3704.32 1429.5C3682.87 1479.44 3645.01 1511.13 3619.74 1500.29 3594.48 1489.44 3591.39 1440.15 3612.84 1390.21 3634.29 1340.27 3672.16 1308.58 3697.42 1319.43 3722.68 1330.27 3725.77 1379.56 3704.32 1429.5Z" fill-rule="evenodd"/><path d="M3635.93 1376.65C3612.13 1389.51 3589.08 1392.99 3584.45 1384.42 3579.82 1375.85 3595.36 1358.48 3619.16 1345.62 3642.96 1332.76 3666 1329.28 3670.64 1337.85 3675.27 1346.42 3659.73 1363.79 3635.93 1376.65Z" fill-rule="evenodd"/><path d="M3484.94 1173.56C3593.57 1180.88 3682.21 1264.3 3697.84 1373.93" stroke="currentColor" stroke-width="34.375" stroke-miterlimit="8" fill="none" fill-rule="evenodd"/></g></svg>
                    </span>
                    <span class="v6-ap-thinking-label">Cross-analyzing&hellip;</span>
                    <ul class="v6-ap-thinking-findings"></ul>
                </div>
                <div class="v6-ap-diff" aria-hidden="true">
                    <div class="v6-ap-diff-head">${entry.summary.heading}</div>
                    <div class="v6-ap-diff-rows">${diffRows}</div>
                </div>`;
        }

        if (layout === 'form-sow') {
            /* Mirrors StatementOfWorkAgent EmptyLoadedContent: doc-title
             * tabs, file-type chips, accordion section toggles with chevrons,
             * and a sticky bottom Generate button with sparkle icon. */
            const docTabs = entry.docTabs.map((t, i) =>
                `<span class="v6-ap-doc-tab${i === entry.activeDocTab ? ' is-active' : ''}">${t}</span>`
            ).join('');
            const fileTypes = entry.fileType.map((f, i) =>
                `<span class="v6-ap-file-chip${i === entry.activeFileType ? ' is-active' : ''}">${f}</span>`
            ).join('');
            const toggles = entry.sections.map((s, i) =>
                `<label class="v6-ap-toggle${s.on ? ' is-on' : ''}">
                    <span class="v6-ap-toggle-chevron" aria-hidden="true">▾</span>
                    <span class="v6-ap-toggle-box"></span>
                    <span class="v6-ap-toggle-label">${s.label}</span>
                </label>`
            ).join('');
            return `
                <div class="v6-ap-doc-tabs">${docTabs}</div>
                <div class="v6-ap-form-row">
                    <span class="v6-ap-form-label">File type</span>
                    <span class="v6-ap-file-chips">${fileTypes}</span>
                </div>
                <div class="v6-ap-section-head">Included sections</div>
                <div class="v6-ap-toggle-list">${toggles}</div>`;
        }

        if (layout === 'chat') {
            /* Matches AIChat shell: scrolling message list above, an input
             * row at the bottom (textarea + send button), and a "First-Party
             * AI can make mistakes" disclaimer. The input is decorative —
             * the demo doesn't accept typing — but it makes the chat read
             * as a real chat surface, not a static transcript. */
            const bubbles = entry.bubbles.map(b =>
                `<div class="v6-ap-bubble" data-from="${b.from}"><span class="v6-ap-bubble-body">${b.text}</span></div>`
            ).join('');
            return `
                <div class="v6-ap-chat-stream">${bubbles}</div>
                <div class="v6-ap-chat-input">
                    <span class="v6-ap-chat-textarea">Ask anything…</span>
                    <button type="button" class="v6-ap-chat-send" aria-label="Send" tabindex="-1">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                        </svg>
                    </button>
                </div>
                <span class="v6-ap-chat-disclaimer">First-Party AI can make mistakes. Always check important information.</span>`;
        }

        if (layout === 'report') {
            /* Mirrors Cheat Sheet's report renderer: collapsible JSON-tree-
             * style sections with chevron heads. The real component has no
             * "Regenerate / Copy" pills at the top — those live on the
             * parent reviewing-state controls, not the report itself. */
            const secs = entry.sections.map((s, i) => {
                const bodyHtml = s.body.trim().startsWith('<li')
                    ? `<ul>${s.body}</ul>`
                    : `<p>${s.body}</p>`;
                return `<div class="v6-ap-report-section">
                    <span class="v6-ap-report-h"><span class="v6-ap-report-chevron" aria-hidden="true">▾</span>${s.h}</span>
                    <div class="v6-ap-report-body">${bodyHtml}</div>
                </div>`;
            }).join('');
            return `<div class="v6-ap-report-sections">${secs}</div>`;
        }

        /* layout === 'list' (default for Solution Fit, Assign Owners) */
        const rows = (entry.items || []).map(it =>
            `<div class="v6-ap-list-row" data-state="${it.state || 'pass'}"><span class="v6-ap-list-marker"></span>${it.text}</div>`
        ).join('');
        return `<div class="v6-ap-list">${rows}</div>`;
    };

    /* Returns the array of stagger-reveal targets for an agent body */
    const collectStaggerTargets = (entry) => {
        const layout = entry.layout || 'list';
        /* For chat: bubbles inside the stream (input + disclaimer reveal
         * together with the last bubble, not staggered). */
        if (layout === 'chat') return Array.from(agentBodyEl.querySelectorAll('.v6-ap-chat-stream .v6-ap-bubble'));
        if (layout === 'report') return Array.from(agentBodyEl.querySelectorAll('.v6-ap-report-section'));
        if (layout === 'form-think') {
            /* Stage 1 of Think & Sync (the "Think" half): tabs, sources,
             * aggressiveness picker, and the Think submit button all
             * stagger in. The result/proposal block is intentionally
             * EXCLUDED — it stays hidden until the user (cursor) clicks
             * Think, at which point the form-think branch in
             * renderAgentPanel fades it in + flips status to Ready. */
            return Array.from(agentBodyEl.querySelectorAll(
                '.v6-ap-tabs, .v6-ap-file-dropzone, .v6-ap-source-row, .v6-ap-modes, .v6-ap-think-btn'
            ));
        }
        if (layout === 'form-analyze') {
            /* Stage 1 of Proposed Scope: the "Auto-reading" head, the
             * two context cards (Discovery + module catalog), and the
             * Run button. Orb + diff are gated by class flips later. */
            return Array.from(agentBodyEl.querySelectorAll(
                '.v6-ap-analyze-head, .v6-ap-context-card, .v6-ap-run-btn'
            ));
        }
        if (layout === 'form-sow') return Array.from(agentBodyEl.querySelectorAll('.v6-ap-doc-tabs, .v6-ap-form-row, .v6-ap-section-head, .v6-ap-toggle-list'));
        return Array.from(agentBodyEl.querySelectorAll('.v6-ap-list-row'));
    };

    const renderAgentPanel = (stageIdx, persona) => {
        const entry = AGENT_CONTENT[persona] && AGENT_CONTENT[persona][stageIdx];
        if (!entry || !agentBodyEl) return;
        if (agentNameEl)  agentNameEl.textContent  = entry.name;
        if (agentSubEl)   agentSubEl.textContent   = entry.sub;
        if (agentCtaEl)   agentCtaEl.textContent   = entry.cta;
        /* Per-agent identity icon in the panel orb (was a generic star) */
        const orbEl = document.querySelector('.hero [data-v6-agent-orb]');
        if (orbEl && entry.iconKey && AGENT_ICONS[entry.iconKey]) {
            orbEl.innerHTML = AGENT_ICONS[entry.iconKey];
        }
        if (agentStateEl) {
            /* Neutral state language only — no persona-conditional labels.
               Real product uses Thinking / Drafting / Ready. */
            agentStateEl.textContent = 'Drafting';
            agentStateEl.removeAttribute('data-done');
        }
        /* Tag the panel with the layout so layout-specific CSS can target it.
         * Clear the `is-ready` flag — set by the form-think Think-click
         * sequence after the proposal lands, must reset between cycles
         * so the Accept footer is hidden until Think runs again. */
        const panelEl = document.querySelector('.hero .v6-agent-panel');
        if (panelEl) {
            panelEl.setAttribute('data-layout', entry.layout || 'list');
            /* Clear state flags from any previous cycle iteration. */
            panelEl.classList.remove('is-ready', 'is-thinking', 'is-proposing');
        }
        agentBodyEl.innerHTML = buildAgentBody(entry);
        /* Render generation counter — every render bumps it. Each
         * scheduled wait captures the current value; when fired, it
         * bails if the counter has moved on (meaning a newer render
         * replaced this one and our
         * stale callback would otherwise pollute the new DOM). Fixes the
         * "double findings" / "stuff renders twice" defect when persona swap
         * or stage advance happens before the prior chain finishes. */
        agentBodyEl.__renderToken = (agentBodyEl.__renderToken || 0) + 1;
        const myToken = agentBodyEl.__renderToken;
        const alive = () => agentBodyEl.__renderToken === myToken;
        const targets = collectStaggerTargets(entry);
        /* Chat layout gets a custom reveal: typing-dots indicator before
         * each AI bubble, char-by-char typing in the chat input box
         * before each user bubble. Sells "real conversation" instead of
         * the bubbles just popping. Bubble landing times are exported
         * via entry.__bubbleLandTimes so beat 6 can sync row fills. */
        if (entry.layout === 'chat') {
            targets.forEach(b => b.classList.add('v6-ap-reveal'));
            const stream = agentBodyEl.querySelector('.v6-ap-chat-stream');
            const inputBox = agentBodyEl.querySelector('.v6-ap-chat-textarea');
            const originalPlaceholder = inputBox ? inputBox.textContent : '';
            const stripTags = (s) => (s || '').replace(/<[^>]+>/g, '');
            /* Chat layout rules:
             *   - Content fills from the top normally.
             *   - As long as it fits, no scroll — bubbles stack at the top
             *     of the stream and the stream's natural overflow:auto
             *     just shows them there.
             *   - The moment total content exceeds the stream height, slide
             *     the content so its bottom aligns with the stream's bottom
             *     (i.e. the latest turn is always at the visible bottom).
             * `scrollHeight - clientHeight` is exactly that offset; the
             * browser clamps it to 0 when content fits, which gives us
             * the "no scroll until overflow" behavior for free. We measure
             * the LIVE state of the DOM (not a target element) so we don't
             * over-scroll past un-revealed bubbles below the latest. */
            const revealInto = () => {
                if (!stream) return;
                /* Count only revealed bubbles + the typing-indicator (if any).
                 * Un-revealed bubbles are in the DOM but invisible — they'd
                 * inflate scrollHeight and push visible content off the top. */
                const live = stream.querySelectorAll('.v6-ap-bubble.is-shown, .v6-ap-chat-typing');
                if (!live.length) { stream.scrollTop = 0; return; }
                const last = live[live.length - 1];
                const liveBottom = last.offsetTop + last.offsetHeight;
                const overflow = liveBottom - stream.clientHeight;
                stream.scrollTop = overflow > 0 ? overflow : 0;
            };
            const landTimes = [];
            let t = 250;
            entry.bubbles.forEach((bubble, i) => {
                const bubbleEl = targets[i];
                if (bubble.from === 'ai') {
                    /* Typing dots pop in, agent "composes" for a real beat,
                     * then the bubble materializes + dots dismiss. Slower
                     * cadence so the viewer can actually read each turn. */
                    const dotsAt = t;
                    const bubbleAt = t + 720;
                    wait(dotsAt, () => {
                        if (!stream) return;
                        const dots = document.createElement('div');
                        dots.className = 'v6-ap-chat-typing';
                        dots.dataset.typingFor = String(i);
                        dots.innerHTML = '<span></span><span></span><span></span>';
                        /* Insert dots RIGHT BEFORE the bubble they're
                         * announcing — not at the end of the stream.
                         * All un-revealed bubbles below take layout space
                         * (opacity:0 doesn't remove them), so appending
                         * at the end would put dots' offsetTop below
                         * every future bubble, making revealInto scroll
                         * way past the visible area. Inserting before
                         * the target bubble pins dots in their correct
                         * visual position. */
                        if (bubbleEl && bubbleEl.parentNode === stream) {
                            stream.insertBefore(dots, bubbleEl);
                        } else {
                            stream.appendChild(dots);
                        }
                        revealInto();
                    });
                    wait(bubbleAt, () => {
                        if (stream) {
                            const dots = stream.querySelector(`[data-typing-for="${i}"]`);
                            if (dots) dots.remove();
                        }
                        if (bubbleEl) bubbleEl.classList.add('is-shown');
                        revealInto();
                    });
                    landTimes.push(bubbleAt);
                    t = bubbleAt + 620;
                } else {
                    /* Customer "types" the answer char-by-char into the
                     * chat input box, then "sends" — the bubble appears
                     * in the stream and the input clears back to its
                     * placeholder. */
                    const txt = stripTags(bubble.text);
                    const typeStart = t;
                    const perChar = Math.max(28, Math.min(58, 900 / Math.max(txt.length, 1)));
                    const typeEnd = typeStart + Math.round(txt.length * perChar);
                    const sendAt = typeEnd + 260;
                    wait(typeStart, () => {
                        if (!inputBox) return;
                        inputBox.textContent = '';
                        inputBox.classList.add('is-typing');
                    });
                    for (let j = 0; j < txt.length; j++) {
                        wait(typeStart + j * perChar, () => {
                            if (inputBox) inputBox.textContent = txt.slice(0, j + 1);
                        });
                    }
                    wait(sendAt, () => {
                        if (inputBox) {
                            inputBox.textContent = originalPlaceholder;
                            inputBox.classList.remove('is-typing');
                        }
                        if (bubbleEl) bubbleEl.classList.add('is-shown');
                        revealInto();
                    });
                    landTimes.push(sendAt);
                    t = sendAt + 620;
                }
            });
            entry.__bubbleLandTimes = landTimes;
            entry.__chatEndsAt = t;
        } else if (entry.layout === 'form-analyze') {
            /* Proposed Scope: deliberate, premium-paced reveal. The whole
             * point is that this analysis is novel — the demo has to make
             * the user FEEL the agent reading Discovery + the catalog and
             * synthesizing a scope. Each context card lands, visibly
             * scans for ~1.2s, then locks ready before the next one
             * starts. After both are ready, a status line + the Run
             * button settle into place. */
            targets.forEach(el => el.classList.add('v6-ap-reveal'));
            const head = agentBodyEl.querySelector('.v6-ap-analyze-head');
            const cards = agentBodyEl.querySelectorAll('.v6-ap-context-card');
            const runBtn = agentBodyEl.querySelector('.v6-ap-run-btn');
            const PHASE = {
                headIn:   200,
                card1In:  900,
                card1Ready: 2100,
                card2In:  2400,
                card2Ready: 3600,
                runIn:    4200,
            };
            wait(PHASE.headIn,   () => { if (alive() && head) head.classList.add('is-shown'); });
            wait(PHASE.card1In,  () => { if (alive() && cards[0]) cards[0].classList.add('is-shown'); });
            wait(PHASE.card1Ready, () => { if (alive() && cards[0]) cards[0].classList.add('is-ready'); });
            wait(PHASE.card2In,  () => { if (alive() && cards[1]) cards[1].classList.add('is-shown'); });
            wait(PHASE.card2Ready, () => { if (alive() && cards[1]) cards[1].classList.add('is-ready'); });
            wait(PHASE.runIn,    () => { if (alive() && runBtn) runBtn.classList.add('is-shown'); });
            entry.__formReadyAt = PHASE.runIn + 200;
        } else {
            /* Generic stagger — 250ms offset + 320ms per item. */
            targets.forEach((el, i) => {
                el.classList.add('v6-ap-reveal');
                wait(250 + i * 320, () => el.classList.add('is-shown'));
            });
        }

        /* Think & Sync is a TWO-STAGE flow: (1) Run, (2) Proposal ready.
         * The form-think layout reveals tabs → dropzone → sources → modes
         * → result block via the stagger. The user reads stage 1 = "still
         * running" until the result block (the proposal) lands; that's
         * the moment the agent flips to "Ready" and the proposal is
         * accept-able. We update the agent status text in lockstep so
         * the indicator matches the actual state. */
        if (entry.layout === 'form-analyze') {
            /* Proposed Scope timeline — slow + premium, because the
             * cross-analysis itself is the novel feature being sold:
             *   T+0     panel slides in
             *   ...     pre-run reveal (head → card1 scan/ready → card2
             *           scan/ready → Run button) — owned by the form-analyze
             *           branch in the reveal phase above, ends at ~4400ms.
             *   T+4900  cursor flies to Run
             *   T+5520  press → is-thinking, sub-status cycles 4 phases
             *   T+8820  flip to is-proposing, diff head visible
             *   T+9000  diff row 1
             *   T+9380  diff row 2
             *   T+9760  diff row 3
             *   T+10260 status → Ready (Accept footer fades in via CSS)
             * Accept fires later from playActiveStage beat 4 — analyzeOffset
             * pushes t4 out enough to give all of this air to breathe. */
            const flyAt   = 4900;
            const pressAt = flyAt + 620;
            wait(flyAt, () => {
                if (!visible || !alive()) return;
                fireStageCursor('!.v6-ap-run-btn');
            });
            wait(pressAt, () => {
                if (!visible || !alive()) return;
                const btn = agentBodyEl.querySelector('.v6-ap-run-btn');
                if (btn) btn.classList.add('is-clicked');
                const apEl = document.querySelector('.v6-agent-panel');
                if (apEl) apEl.classList.add('is-thinking');
                if (agentStateEl) {
                    agentStateEl.textContent = 'Analyzing';
                    agentStateEl.removeAttribute('data-done');
                }
            });
            const phases = entry.thinkingPhases || [
                'Reading Discovery · 12 notes',
                'Mapping requirements → modules',
                'Scoring fit · pricing · margin',
                'Composing proposal',
            ];
            const phaseStart = pressAt + 250;
            const phaseLen   = 1050;
            phases.forEach((label, i) => {
                wait(phaseStart + i * phaseLen, () => {
                    if (!alive()) return;
                    const list = agentBodyEl.querySelector('.v6-ap-thinking-findings');
                    if (!list) return;
                    const prev = list.querySelector('.v6-ap-thinking-finding.is-current');
                    if (prev) prev.classList.replace('is-current', 'is-done');
                    const li = document.createElement('li');
                    li.className = 'v6-ap-thinking-finding is-current';
                    li.innerHTML = '<span class="v6-ap-thinking-finding-dot" aria-hidden="true"></span><span class="v6-ap-thinking-finding-text">' + label + '</span>';
                    list.appendChild(li);
                });
            });
            const lastDoneAt = phaseStart + phases.length * phaseLen;
            wait(lastDoneAt, () => {
                if (!alive()) return;
                const last = agentBodyEl.querySelector('.v6-ap-thinking-finding.is-current');
                if (last) last.classList.replace('is-current', 'is-done');
            });
            const proposeAt = lastDoneAt + 250;
            wait(proposeAt, () => {
                if (!visible || !alive()) return;
                const apEl = document.querySelector('.v6-agent-panel');
                if (apEl) {
                    apEl.classList.remove('is-thinking');
                    apEl.classList.add('is-proposing');
                }
            });
            const diffStart = proposeAt + 180;
            const rowGap = 380;
            /* Rows already have v6-ap-reveal baked in via buildAgentBody —
             * no need to add it here, that's what was causing the visible
             * fade-out before fade-in. We just sequentially flip is-shown. */
            entry.summary.items.forEach((_, i) => {
                wait(diffStart + i * rowGap, () => {
                    if (!alive()) return;
                    const rows = agentBodyEl.querySelectorAll('.v6-ap-diff-row');
                    if (rows[i]) rows[i].classList.add('is-shown');
                });
            });
            const readyAt = diffStart + entry.summary.items.length * rowGap + 240;
            wait(readyAt, () => {
                if (!visible || !alive()) return;
                const apEl = document.querySelector('.v6-agent-panel');
                if (apEl) apEl.classList.add('is-ready');
                if (agentStateEl) {
                    agentStateEl.textContent = 'Ready';
                    agentStateEl.setAttribute('data-done', 'true');
                }
            });
            return;
        }

        if (entry.layout === 'form-think') {
            const sourceCount = (entry.sources || []).length;
            /* targets list = [tabs, dropzone, ...sources, modes, think-btn].
             * Last source reveals at index (1 + sourceCount). Flip the
             * dropzone hint from "Reading…" → "ready" once sources land. */
            const flipAt = 250 + (1 + sourceCount) * 320 + 250;
            wait(flipAt, () => {
                const hint = agentBodyEl.querySelector('.v6-ap-file-dropzone-hint');
                if (hint) {
                    hint.classList.add('is-done');
                    hint.innerHTML = '<span class="v6-ap-dropzone-check" aria-hidden="true">&#10003;</span> ' + sourceCount + ' sources &middot; ready';
                }
            });
            /* Two-step flow: THINK then SYNC.
             *   1. Stage cursor flies to the Think button (the submit
             *      that triggers the actual reasoning).
             *   2. Click registers → status flips to "Thinking…" → the
             *      proposal/result block fades in → status flips to
             *      "Ready".
             *   3. (Beat 4 later) cursor flies to "Send to Workspace" =
             *      the Accept gesture that SYNCS the proposal into the
             *      sheet.
             *
             *   Timing: targets reveal at 250 + i*320. Last target
             *   (Think button) is at index targets.length-1 = 6 for the
             *   Discovery entry → 250 + 6*320 = 2170ms. Cursor flies in
             *   200ms after that, presses at +620ms. */
            const thinkBtnLandsAt = 250 + (targets.length - 1) * 320;
            const flyAt = thinkBtnLandsAt + 200;
            const pressAt = flyAt + 620;
            wait(flyAt, () => {
                if (!visible) return;
                fireStageCursor('!.v6-ap-think-btn');
            });
            /* The panel has THREE visual stages, gated by classes on the
             * .v6-agent-panel root:
             *   default          → form visible (tabs/sources/aggressiveness/Think button)
             *   .is-thinking     → form hidden, AI assist orb + "Thinking…" centered
             *   .is-proposing    → orb hidden, diff visible, Accept footer visible
             * Each transition is one class swap; CSS handles the visibility. */
            wait(pressAt, () => {
                if (!visible) return;
                const btn = agentBodyEl.querySelector('.v6-ap-think-btn');
                if (btn) btn.classList.add('is-clicked');
                const apEl = document.querySelector('.v6-agent-panel');
                if (apEl) apEl.classList.add('is-thinking');
                if (agentStateEl) {
                    agentStateEl.textContent = 'Thinking';
                    agentStateEl.removeAttribute('data-done');
                }
            });
            /* Thinking dwell — ~1900ms of visible reasoning so the viewer
             * can register "the agent is actually working" before the
             * proposal lands. Then swap to is-proposing: form + orb
             * hidden, diff fades in, Accept footer appears, status →
             * Ready. */
            wait(pressAt + 1900, () => {
                if (!visible) return;
                const apEl = document.querySelector('.v6-agent-panel');
                if (apEl) {
                    apEl.classList.remove('is-thinking');
                    apEl.classList.add('is-proposing', 'is-ready');
                }
                if (agentStateEl) {
                    agentStateEl.textContent = 'Ready';
                    agentStateEl.setAttribute('data-done', 'true');
                }
            });
            /* Don't run the generic-layout "flip to Ready" below — the
             * form-think branch owns its status + footer timing. */
            return;
        }

        /* Non-form-think layouts (chat / report / list / form-sow): flip
         * state to Ready once the stagger reveal completes. */
        wait(250 + targets.length * 320 + 400, () => {
            if (agentStateEl) {
                agentStateEl.textContent = 'Ready';
                agentStateEl.setAttribute('data-done', 'true');
            }
        });
    };

    const setPersona = (p) => {
        panel.setAttribute('data-persona', p);
        const roleEls = panel.querySelectorAll('[data-v6-stage-role]');
        const txt = (p === 'guest') ? 'Viewing as Guest · Jay B.' : 'Viewing as Host · Sarah K.';
        roleEls.forEach(el => { el.textContent = txt; });
    };

    /* Wire the chrome persona toggle so users can flip manually. The
       cycle's beat-6 still drives the auto-swap; this just lets a real
       click do the same thing. If the agent panel is visible at the
       moment of the click, re-render it for the new persona so the
       content stays in sync with the toggle state. */
    panel.querySelectorAll('[data-v6-persona-toggle] .v6-chrome-persona-seg').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-persona-set');
            if (!target || panel.getAttribute('data-persona') === target) return;
            setPersona(target);
            const sub = panel.getAttribute('data-stage-substate');
            if (sub === 'agent' || sub === 'agent-docked' || sub === 'workspace-guest') {
                renderAgentPanel(activeStage, target);
            }
        });
    });

    /* Expose for screenshot diagnostics — drives the agent panel content
     * without running the full cycle so I can shoot every substate. */
    try {
        window.__v6RenderAgent = renderAgentPanel;
        window.__v6Stop = () => { clearPending(); visible = false; };
    } catch (e) {}

    const playActiveStage = () => {
        if (!visible) return;
        const panelEl = stagePanels[activeStage];
        if (!panelEl) return;
        const hostEntry = AGENT_CONTENT.host[activeStage];

        /* Reset for this iteration. data-substate/data-stage-substate
         * are usually already cleared by beat 7's sequenced advance, but
         * we set them explicitly for the first iteration (where we land
         * straight from intro). persona stays host by default.
         * Also clear the explore-menu-open state — it should never persist
         * across iterations. */
        panelEl.setAttribute('data-substate', 'home');
        panelEl.classList.remove('explore-menu-open', 'is-issue-mode');
        panel.removeAttribute('data-stage-substate');
        setPersona('host');

        const script = agentScript[activeStage] || [];
        if (script[0]) updateAgentText(script[0]);

        /* ── Beat 0: Click the active ring node — visible trigger for
         *   the ring → stage transition. The cursor flies to the active
         *   stage node, clicks, ripple fires; ~500ms later setPhase('stage')
         *   actually opens the stage panel. Without this, the stage panel
         *   "magically" appears with no UI trigger.
         *   First iteration after intro: we're already in 'ring' phase
         *   from enterRing(). Subsequent iterations: beat 7c sets ring.
         *   EXCEPTION: the very first ring→stage transition skips the click
         *   (see skipFirstRingClick) — the SPD click that just expanded into
         *   the ring is the gesture; a second click here reads as a dupe. */
        const inRingPhase = panel.getAttribute('data-v6-phase') === 'ring';
        const playRingClick = inRingPhase && !skipFirstRingClick;
        if (inRingPhase) skipFirstRingClick = false;
        const ringDelay = playRingClick ? 620 : 0;
        if (playRingClick) {
            fireStageCursor('!.navigator-ring .stage-node.v6-is-active');
            wait(ringDelay, () => {
                if (!visible) return;
                setPhase('stage');
            });
        } else {
            setPhase('stage');
        }

        /* ── Beat 1: Home (T.stageHome) ── */
        /* Scope (stage 2) uses the Explore menu instead of clicking Top Pick:
         *   T+0     cursor flies to Explore tile
         *   T+620   press registers, menu pops above the tile (animates ~280ms)
         *   T+900   menu fully visible — DWELL so the user can read all 4 items
         *   T+2400  cursor flies to Proposed Scope item (highlight on land)
         *   T+3020  press registers → menu dismisses, agent panel slides in
         * Net offset vs the standard Top Pick click (620ms total): 2400ms. */
        const stageUsesExplore = (activeStage === 2);
        const exploreOffset = stageUsesExplore ? 2400 : 0;

        wait(ringDelay + T.stageHome, () => {
            if (!visible) return;
            /* ── Beat 2: Agent open — cursor flies to Top Pick tile, presses
             * at ~600ms after fire (matches fireStageCursor press moment),
             * THEN agent panel slides in. ── */
            if (stageUsesExplore) {
                /* 2a — cursor flies to Explore tile, presses ~620ms later. */
                fireStageCursor('.v6-section-agents .v6-app-tile-explore');
                wait(620, () => {
                    if (!visible) return;
                    /* 2b — menu pops above the Explore tile. */
                    panelEl.classList.add('explore-menu-open');
                });
                /* 2c — long dwell (1500ms after menu fully visible at +900)
                 * so the 4 agent options are actually readable before the
                 * cursor moves. This is a structural moment — the user
                 * needs to see Explore IS a menu of agents. */
                wait(2400, () => {
                    if (!visible) return;
                    /* 2d — cursor flies to Proposed Scope item in the menu. */
                    fireStageCursor('.v6-explore-menu [data-explore-agent="proposed-scope"]');
                    /* Highlight on land so the item reads as "selected". */
                    const hot = panelEl.querySelector('.v6-explore-menu [data-explore-agent="proposed-scope"]');
                    if (hot) hot.classList.add('is-hot');
                });
                wait(3020, () => {
                    if (!visible) return;
                    /* 2e — press registers, menu dismisses, agent panel
                     * slides in with Proposed Scope content. */
                    panelEl.classList.remove('explore-menu-open');
                    const hot = panelEl.querySelector('.v6-explore-menu .is-hot');
                    if (hot) hot.classList.remove('is-hot');
                    panel.setAttribute('data-stage-substate', 'agent');
                    renderAgentPanel(activeStage, 'host');
                    if (script[1]) updateAgentText(script[1]);
                });
            } else {
                fireStageCursor('.v6-section-agents .v6-app-tile-top');
                wait(620, () => {
                    if (!visible) return;
                    /* Slide agent panel in, populate host content */
                    panel.setAttribute('data-stage-substate', 'agent');
                    renderAgentPanel(activeStage, 'host');
                    if (script[1]) updateAgentText(script[1]);
                });
            }
        });

        /* ── Beat 4: Accept → straight into the workspace.
         *   4a (t4 - 620): cursor flies to the Accept CTA
         *   4b (t4):       press registers → agent panel slides out AND
         *                  workspace opens AND per-stage anim runs, all
         *                  in one tick. No intermediate "cursor flies to
         *                  workspace tile" beat — the AI takes you in.
         */
        /* form-analyze stages (Experience: Tailored Script, Scope: Proposed
         * Scope) run the longest agent UX in the demo — pre-run reveal
         * (4.4s) + Run press (0.6s) + accumulating findings thinking
         * (~4.7s) + 3-row diff stagger (1.4s) + dwell (~1.4s) =
         * ~12.5s of agentWork. Default T.agentWork is 5.6s, so we need
         * ~6.8s more for those stages. */
        const stageUsesAnalyze = (activeStage === 1) || (activeStage === 2) || (activeStage === 4);
        const analyzeOffset = stageUsesAnalyze ? 6800 : 0;
        const t4 = ringDelay + T.stageHome + T.agentOpen + T.agentWork + exploreOffset + analyzeOffset;

        wait(t4 - 620, () => {
            if (!visible) return;
            fireStageCursor('!.v6-agent-panel-cta');
        });

        wait(t4, () => {
            if (!visible) return;
            /* All stages: agent panel slides out, workspace opens in
             * the same tick. (Deploy used to dock the AI Navigator
             * above the gantt — that pattern is gone now that Deploy's
             * host is Assign Owners which uses the standard form-analyze
             * → Accept → workspace handoff like every other stage.) */
            panel.removeAttribute('data-stage-substate');
            panelEl.setAttribute('data-substate', 'workspace');
            stagePlayers[activeStage]();
        });

        /* ── Beat 5: Workspace dwell — narration script[2] near the end.
         * The handoff used to take ~1440ms of cursor-flying-around; now
         * Accept opens the workspace in one tick, so t5 is just t4 + a
         * brief grace for the agent panel to slide off + the workspace
         * dwell duration. */
        const t5 = t4 + 400 + T.wsWork;
        wait(Math.floor(t4 + 400 + T.wsWork * 0.7), () => {
            if (script[2]) updateAgentText(script[2]);
        });

        /* ── Beat 6: Persona swap to Guest — three sub-beats with a
         *   visible cursor click on the chrome persona toggle as the
         *   trigger. The toggle lives in the window chrome (sibling of
         *   the traffic lights), so we use the `!` selector prefix in
         *   fireStageCursor to escape the active-stage-panel scope.
         *   6a (t5):       cursor flies to the Customer segment
         *   6b (+620ms):   press registers → flip data-persona, thumb
         *                  slides right + segment colors update via CSS
         *   6c (+850ms):   agent panel renders with guest content and
         *                  slides in via workspace-guest substate.
         */
        wait(t5, () => {
            if (!visible) return;
            fireStageCursor('!.v6-chrome-persona-seg[data-persona-set="guest"]');
        });
        wait(t5 + 620, () => {
            if (!visible) return;
            setPersona('guest');
        });
        wait(t5 + 850, () => {
            if (!visible) return;
            /* Stage 5 — Success has a different guest flow. Instead of
             * opening Auto Solve immediately, the workspace flips to an
             * issue-submission form. Jay "types" the issue, hits Submit,
             * and only THEN does Auto Solve slide in to analyze + propose
             * a fix from past tickets. The agent panel opens at the press
             * moment, not on persona swap. */
            if (activeStage === 5) {
                const successPanel = stagePanels[5];
                if (!successPanel) return;
                const issueInput  = successPanel.querySelector('[data-v6-issue-input]');
                const issueSubmit = successPanel.querySelector('[data-v6-issue-submit]');
                const issueText   = 'Can\'t log in from the EU office — SSO redirects to a 404.';
                /* Reset state from any prior cycle */
                if (issueInput) {
                    issueInput.textContent = '';
                    issueInput.classList.remove('is-typing');
                }
                if (issueSubmit) issueSubmit.classList.remove('is-pressed');
                successPanel.classList.add('is-issue-mode');
                /* Type the issue char-by-char in the workspace input. */
                const perChar = Math.max(28, Math.min(58, 1100 / Math.max(issueText.length, 1)));
                const typeStart = 400;
                wait(typeStart, () => { if (issueInput) issueInput.classList.add('is-typing'); });
                for (let j = 0; j < issueText.length; j++) {
                    wait(typeStart + j * perChar, () => {
                        if (issueInput) issueInput.textContent = issueText.slice(0, j + 1);
                    });
                }
                const typeEnd = typeStart + issueText.length * perChar;
                /* Brief pause after typing, cursor flies to Submit. */
                wait(typeEnd + 200, () => {
                    if (issueInput) issueInput.classList.remove('is-typing');
                    fireStageCursor('.v6-issue-submit');
                });
                /* Press registers — submit "pressed" feedback, then the
                 * Auto Solve agent panel slides in. */
                wait(typeEnd + 820, () => {
                    if (issueSubmit) issueSubmit.classList.add('is-pressed');
                });
                wait(typeEnd + 1020, () => {
                    if (!visible) return;
                    if (issueSubmit) issueSubmit.classList.remove('is-pressed');
                    renderAgentPanel(activeStage, 'guest');
                    panel.setAttribute('data-stage-substate', 'workspace-guest');
                });
                return;
            }
            renderAgentPanel(activeStage, 'guest');
            panel.setAttribute('data-stage-substate', 'workspace-guest');
            /* Stage 4 — as Jay chats with AI Navigator, the gantt fills
             * green track by track. Triggered here (not in playDeploy)
             * because the visual belongs to the guest conversation, not
             * the host's owner-assignment step. */
            if (activeStage === 4) {
                playDeployGanttFill();
            }
            /* Stage 0 — Smart Conversation fills the 3 rows Think & Sync
             * left empty (Renewal, Compliance, Decision). Each user
             * chat bubble triggers the corresponding row fill. The chat
             * stagger uses 250 + i*320 per bubble (see
             * collectStaggerTargets), so user bubbles land at indices
             * 2, 4, 6 = 890ms, 1530ms, 2170ms. Each row's assist chip
             * appears ~60ms after the user bubble, resolves ~500ms later
             * — visually couples the chat reply to the sheet fill. */
            if (activeStage === 0) {
                const panelEl = stagePanels[0];
                if (!panelEl) return;
                const rows = Array.from(panelEl.querySelectorAll('.v6-table-row'));
                /* bubbleAt = index into the chat bubbles array; the actual
                 * "send" time comes from the custom chat reveal which
                 * publishes __bubbleLandTimes on the agent entry. Falls
                 * back to the old 250 + i*320 cadence if not present. */
                const entry = AGENT_CONTENT.guest && AGENT_CONTENT.guest[0];
                const landTimes = (entry && entry.__bubbleLandTimes) || [];
                const guestFills = [
                    { i: 1, text: 'Q3 2026 · locked in',              bubbleAt: 2 },
                    { i: 3, text: 'SOC2 · EU data must stay EU',      bubbleAt: 4 },
                    { i: 4, text: 'Security first · then SFDC sync',  bubbleAt: 6 },
                ];
                guestFills.forEach(({ i }) => {
                    const r = rows[i];
                    if (!r) return;
                    r.classList.remove('is-done');
                    r.querySelectorAll('.v6-row-assist').forEach(c => c.remove());
                    const a = r.querySelector('.v6-row-a');
                    if (a) a.textContent = '';
                });
                guestFills.forEach((fill) => {
                    const row = rows[fill.i];
                    const bubbleLandAt = landTimes[fill.bubbleAt] !== undefined
                        ? landTimes[fill.bubbleAt]
                        : (250 + fill.bubbleAt * 320);
                    const chipAt    = bubbleLandAt + 60;
                    const resolveAt = chipAt + 460;
                    wait(chipAt, () => showRowAssist(row));
                    wait(resolveAt, () => {
                        hideRowAssist(row);
                        const a = row.querySelector('.v6-row-a');
                        if (a) a.textContent = fill.text;
                        row.classList.add('is-done');
                    });
                });
                /* Celebrate is intentionally NOT triggered here — it
                 * runs in beat 7 AFTER the chat panel dismisses, so the
                 * user gets a moment with the all-green table on screen
                 * WITHOUT any agent panel covering anything. */
            }
        });

        /* ── Beat 7: Dismiss chat → celebrate → Stage Complete CTA → advance.
         *   7a (tAdvance):        agent panel dismisses (chat slides out).
         *   7b (+500ms):          celebrate — rows pulse green, table glows.
         *   7c (+1600ms):         celebration ends, "Stage X complete" CTA
         *                         fades in over the dimmed workspace.
         *   7d (+2800ms):         cursor flies to the Continue CTA.
         *   7e (+3420ms):         press → CTA dismisses, ring slides in.
         *   7f (+3820ms):         completed node bursts green, next stage
         *                         activates.
         *   7g (+3820 + breath):  playActiveStage recurses.
         * The badge stays a click affordance for real users but the demo
         * no longer fires it — the CTA is a more readable end-of-stage
         * gesture than a back-arrow icon at the top.
         */
        const tAdvance = t5 + T.personaSwap;
        wait(tAdvance, () => {
            if (!visible) return;
            /* 7a — dismiss chat panel. */
            panel.removeAttribute('data-stage-substate');
        });
        wait(tAdvance + 500, () => {
            if (!visible) return;
            /* 7b — celebrate beat. All rows green, dots pulse, table glows. */
            panelEl.classList.add('is-celebrating');
        });
        wait(tAdvance + 1600, () => {
            if (!visible) return;
            /* 7c — celebration peaks. Drop the pulse, revert persona, and
             * fade the workspace behind a "Stage X complete · Continue
             * to Y" CTA. Populate labels from stageTitleStrings so each
             * stage's CTA reads in plain English. */
            panelEl.classList.remove('is-celebrating');
            setPersona('host');
            const titleEl    = panel.querySelector('[data-v6-stage-complete-title]');
            const ctaLabelEl = panel.querySelector('[data-v6-stage-complete-cta-label]');
            const currentName = stageTitleStrings[activeStage] || 'Stage';
            const nextName    = stageTitleStrings[(activeStage + 1) % NUM_STAGES] || 'next stage';
            if (titleEl)    titleEl.textContent    = `${currentName} complete`;
            if (ctaLabelEl) ctaLabelEl.textContent = `Continue to ${nextName}`;
            panel.setAttribute('data-stage-substate', 'completed');
        });
        wait(tAdvance + 2800, () => {
            if (!visible) return;
            /* 7d — cursor flies to the Continue CTA. */
            fireStageCursor('!.v6-stage-complete-cta');
        });
        wait(tAdvance + 3420, () => {
            if (!visible) return;
            /* 7e — press registers. Clear the completed substate (CTA
             * fades out, workspace fades up briefly under it), set
             * data-substate=home, slide the ring back in. */
            panel.removeAttribute('data-stage-substate');
            panelEl.setAttribute('data-substate', 'home');
            setPhase('ring');
            const ring = panel.querySelector('.navigator-ring');
            if (ring) {
                ring.classList.remove('v6-ring-slide-in');
                panel.classList.remove('has-ring-sliding');
                void ring.offsetWidth;
                ring.classList.add('v6-ring-slide-in');
                panel.classList.add('has-ring-sliding');
                wait(800, () => {
                    ring.classList.remove('v6-ring-slide-in');
                    panel.classList.remove('has-ring-sliding');
                });
            }
        });
        wait(tAdvance + 3820, () => {
            if (!visible) return;
            /* 7f — completed node bursts green, next stage activates */
            const nextIdx = (activeStage + 1) % NUM_STAGES;
            activeStage = nextIdx;
            activateStage(activeStage);
        });
        wait(tAdvance + 3820 + T.breath, () => {
            if (!visible) return;
            /* 7g — next stage opens (recurses) */
            playActiveStage();
        });
    };

    const runStageCycle = () => {
        if (!visible) return;
        activateStage(activeStage);
        playActiveStage();
    };

    const start = () => {
        clearPending();
        runIntro(() => {
            enterRing(() => {
                runStageCycle();
            });
        });
    };

    const stop = () => {
        clearPending();
    };

    /* ─────────── PREV / NEXT BUTTONS ───────────
     * The footer controls (.ring-nav-prev / .ring-nav-next) step the user
     * manually through the 9-step flow. The legacy index_5.js also wires
     * these for its 6-stage cycle, but on v6 the stage-progress-card is
     * hidden, so those handlers do nothing visible — the user sees the
     * buttons as broken. Owning them here makes them actually advance/
     * rewind the visible v6 hero. */
    const currentStepIndex = () => {
        let phase = panel.getAttribute('data-v6-phase') || 'cn';
        const idx = stepIndexForPhase(phase, activeStage);
        return idx < 0 ? 0 : idx;
    };
    const goToStep = (stepIdx) => {
        if (stepIdx < 0 || stepIdx >= TOTAL_FLOW_STEPS) return;
        clearPending();
        introPlayed = true;
        const step = FLOW_STEPS[stepIdx];
        if (step.phase === 'stage') {
            setPhase('stage');
            activateStage(step.stageIndex);
            if (visible) playActiveStage();
        } else {
            setPhase(step.phase);
        }
    };
    const navPrev = document.querySelector('.v6-panel-controls .ring-nav-prev');
    const navNext = document.querySelector('.v6-panel-controls .ring-nav-next');
    if (navPrev) {
        navPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToStep(currentStepIndex() - 1);
        });
    }
    if (navNext) {
        navNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToStep(currentStepIndex() + 1);
        });
    }

    /* ─────────── VISIBILITY-GATED INIT ─────────── */

    if (prefersReducedMotion) {
        /* Skip intro + cycle. Just sit at ring overview with stage 0 active. */
        introPlayed = true;
        setPhase('ring');
        activateStage(0);
        return;
    }

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                const wasVisible = visible;
                visible = e.isIntersecting;
                if (visible && !wasVisible) {
                    start();
                } else if (!visible && wasVisible) {
                    stop();
                }
            });
        }, { threshold: 0.2 });
        io.observe(panel);
    } else {
        visible = true;
        start();
    }
})();
