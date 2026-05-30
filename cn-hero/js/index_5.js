(() => {
    const STAGES = [
        { name: 'Discovery', progress: 5 },
        { name: 'Experience', progress: 25 },
        { name: 'Scope', progress: 45 },
        { name: 'Commit', progress: 65 },
        { name: 'Deploy', progress: 85 },
        { name: 'Success', progress: 100 }
    ];

    const STAGE_ROLES = {
        Discovery: {
            buyer: [
                { name: 'Sarah Chen', title: 'Marketing Dir.', accent: true },
                { name: 'Mike Torres', title: 'IT Director' }
            ],
            seller: [
                { name: 'Alex Kim', title: 'AE', accent: true },
                { name: 'Jordan Lee', title: 'SDR' }
            ]
        },
        Experience: {
            buyer: [
                { name: 'Raj Gupta', title: 'Engineering Mgr.', accent: true },
                { name: 'Sarah Chen', title: 'Marketing Dir.' }
            ],
            seller: [
                { name: 'Nina Zhao', title: 'Sales Eng.', accent: true },
                { name: 'Alex Kim', title: 'AE' }
            ]
        },
        Scope: {
            buyer: [
                { name: 'James Park', title: 'VP Finance', accent: true },
                { name: 'Dana West', title: 'Procurement' }
            ],
            seller: [
                { name: 'Alex Kim', title: 'AE', accent: true },
                { name: 'Lena Osei', title: 'Product Mgr.' }
            ]
        },
        Commit: {
            buyer: [
                { name: 'Carmen Vega', title: 'Legal Counsel', accent: true },
                { name: 'James Park', title: 'VP Finance' }
            ],
            seller: [
                { name: 'Marcus Cole', title: 'Legal', accent: true },
                { name: 'Anya Petrov', title: 'Rev. Ops' }
            ]
        },
        Deploy: {
            buyer: [
                { name: 'Raj Gupta', title: 'Engineering Mgr.', accent: true },
                { name: 'Pat Morgan', title: 'Security' }
            ],
            seller: [
                { name: 'Tomas Ruiz', title: 'Solutions Arch.', accent: true },
                { name: 'Kenji Sato', title: 'Integrations' }
            ]
        },
        Success: {
            buyer: [
                { name: 'Priya Patel', title: 'Operations', accent: true },
                { name: 'Sarah Chen', title: 'Engineering Lead' }
            ],
            seller: [
                { name: 'Riley Davis', title: 'CSM', accent: true },
                { name: 'Alex Kim', title: 'AE' }
            ]
        }
    };

    const DISCOVERY_ANSWERS = [
        'Manual reporting',
        'VP Eng, CISO',
        '50% faster'
    ];

    const STAGE_COLLABORATION = {
        Discovery: [
            'Pain points?',
            'Stakeholders?',
            'Success criteria?'
        ],
        Experience: [
            'Product Demo Session',
            'Technical Deep Dive',
            'Security Review Meeting'
        ],
        Scope: [
            'Enterprise Package',
            'API Integration Module',
            'Advanced Analytics Add-on'
        ],
        Commit: [
            'Master Services Agreement',
            'Statement of Work',
            'Data Processing Agreement'
        ],
        Deploy: [
            'Environment setup & config',
            'Data migration planning',
            'User training sessions'
        ],
        Success: [
            'SSO login failing for SAML users',
            'Dashboard export timing out',
            'API rate limits hitting 429s'
        ]
    };

    const AGENT_ICONS = {
        'Smart Conversation': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h9v-8h7z"/><path d="M22.5 16h-2.2l1.7-4h-5v6h2v5z"/></svg>',
        'Think & Sync': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z"/></svg>',
        'Meeting Prep': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        'Notetaker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
        'SOW Generator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"/></svg>',
        'Module Recommender': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41z"/></svg>',
        'Why Commit?': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1 21h4V9H1zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73z"/></svg>',
        'Fit Evaluator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41m.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l8.32-8.34c1.17-1.17 1.17-3.07 0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-.06z"/></svg>',
        'Assign Owners': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zM19.79 10.22C19.92 10.79 20 11.39 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.45-1.45C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39l-1.61 1.61zM15 13h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>',
        'Deployment Navigator': '<svg width="10" height="10" viewBox="0 0 768 971" fill="currentColor" overflow="hidden" aria-hidden="true"><g transform="translate(-1657 -646)"><path fill-rule="evenodd" d="M1767.17 1312.55 1794.45 1362.72C1837.2 1425.87 1903.66 1471.72 1981.08 1487.53L1985.83 1488.01 1693.35 1617 1657 1580.72ZM2314.83 1312.55 2425 1580.72 2388.65 1617 2096.17 1488.01 2100.92 1487.53C2178.34 1471.72 2244.8 1425.87 2287.55 1362.72ZM2041 646 2154.67 922.686 2100.92 906.033C2081.57 902.079 2061.53 900.003 2041 900.003 2020.47 900.003 2000.43 902.079 1981.08 906.033L1927.33 922.686Z"/><path transform="matrix(1 0 0 1.00948 1830 984)" d="M201.953 164.765C204.855 156.061 217.145 156.061 220.047 164.765L237.058 215.853C244.65 238.623 262.524 256.487 285.298 264.066L336.36 281.078C345.064 283.979 345.064 296.27 336.36 299.171L285.272 316.183C262.502 323.774 244.638 341.648 237.058 364.423L220.047 415.485C218.407 420.481 213.027 423.202 208.031 421.562 205.154 420.618 202.897 418.363 201.953 415.485L184.941 364.397C177.355 341.633 159.492 323.769 136.728 316.183L85.6396 299.171C80.6434 297.531 77.9223 292.153 79.562 287.155 80.5062 284.277 82.7626 282.022 85.6396 281.078L136.728 264.066C159.492 256.48 177.355 238.617 184.941 215.853ZM100.067 30.2785C101.06 27.2778 104.298 25.6507 107.299 26.6443 109.017 27.2132 110.364 28.5607 110.933 30.2785L121.14 60.9262C125.703 74.5885 136.411 85.2967 150.074 89.8596L180.721 100.067C183.722 101.06 185.349 104.298 184.356 107.299 183.787 109.017 182.439 110.364 180.721 110.933L150.074 121.14C136.403 125.677 125.677 136.403 121.14 150.074L110.933 180.721C109.94 183.722 106.702 185.349 103.701 184.356 101.983 183.787 100.636 182.439 100.067 180.721L89.8596 150.074C85.3225 136.403 74.5969 125.677 60.9262 121.14L30.2785 110.933C27.2778 109.94 25.6507 106.702 26.6443 103.701 27.2132 101.983 28.5607 100.636 30.2785 100.067L60.9262 89.8596C74.5969 85.3225 85.3225 74.5969 89.8596 60.9262ZM286.511 2.61112C287.202 0.615513 289.381-0.441377 291.378 0.250493 292.485 0.634258 293.353 1.50421 293.738 2.61112L300.543 23.0254C303.576 32.1511 310.724 39.2987 319.849 42.3319L340.264 49.1366C342.26 49.8284 343.315 52.007 342.624 54.0028 342.242 55.1097 341.371 55.9796 340.264 56.3633L319.849 63.1681C310.74 66.216 303.592 73.3652 300.543 82.4746L293.738 102.889C293.047 104.884 290.869 105.941 288.872 105.249 287.764 104.866 286.897 103.996 286.511 102.889L279.707 82.4746C276.658 73.3652 269.51 66.216 260.4 63.1681L240.012 56.3633C238.017 55.6715 236.96 53.493 237.652 51.4972 238.036 50.3902 238.905 49.5204 240.012 49.1366L260.427 42.3319C269.552 39.2987 276.7 32.1511 279.733 23.0254Z"/></g></svg>',
        'Auto Ticket Solve': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.03 3.56c-1.67-1.39-3.74-2.3-6.03-2.51v2.01c1.73.19 3.31.88 4.61 1.92l1.42-1.42zM11 3.06V1.05c-2.29.2-4.36 1.12-6.03 2.51l1.42 1.42C7.69 3.94 9.27 3.25 11 3.06zM4.98 6.39 3.56 4.97C2.17 6.64 1.26 8.71 1.06 11h2.01c.19-1.73.88-3.31 1.91-4.61zM20.94 11h2.01c-.21-2.29-1.11-4.36-2.51-6.03l-1.42 1.42c1.04 1.3 1.73 2.88 1.92 4.61zM7 12l3.44 1.56L12 17l1.56-3.44L17 12l-3.44-1.56L12 7l-1.56 3.44z"/><path d="M12 21c-3.11 0-5.85-1.59-7.46-4H7v-2H1v6h2v-2.7c1.99 2.84 5.27 4.7 9 4.7 4.45 0 8.27-2.64 10-6.43l-1.85-.73C18.64 18.88 15.58 21 12 21z"/></svg>',
        'Cheat Sheet': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 10v9H5V5h9V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-2.5 2.71-3.39 4.08-2.4-2.96L7.5 18h9l-2.5-3.46 1.5-1.83zM18 3V1h-2v2h-2c.01.01 0 2 0 2h2v2.01c.01 0 2 0 2-.01V5h2V3h-2z"/></svg>'
    };

    const STAGE_AGENTS = {
        Discovery: ['Smart Conversation', 'Think & Sync'],
        Experience: ['Meeting Prep', 'Notetaker'],
        Scope: ['SOW Generator', 'Module Recommender'],
        Commit: ['Why Commit?', 'Fit Evaluator'],
        Deploy: ['Assign Owners', 'Deployment Navigator'],
        Success: ['Auto Ticket Solve', 'Cheat Sheet']
    };

    const AGENT_INTELLIGENCE = [
        { label: 'Gathering context', level: 1 },
        { label: 'Building patterns', level: 2 },
        { label: 'Deepening insight', level: 3 },
        { label: 'High confidence', level: 4 },
        { label: 'Full confidence', level: 5 }
    ];

    const STAGE_DURATION = 6000;
    const TEXT_SWAP_DELAY = 400;
    const COLLAPSE_DURATION = 300;
    const EXPAND_DURATION = 400;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const initNavigator = () => {
        const heroContainer = document.querySelector('.hero-wrapper');
        if (!heroContainer) {
            return;
        }

        const stageCard = heroContainer.querySelector('[data-stage-carousel]');
        if (!stageCard) {
            return;
        }

        const stageText = stageCard.querySelector('.currStage');
        /* On v6, the same [data-stage-counter] node is owned by
         * hero_journey_cycle.js, which counts the full 9-step flow
         * (CN intro + picker + plan + 6 stages). Writing STAGES.length
         * (6) here caused a "1 of 6" → "1 of 9" flash. Detect v6 and
         * keep the reference null so the existing `if (stageCounter)`
         * guards short-circuit. */
        const stageCounter = document.querySelector('.v6-mockup-panel')
            ? null
            : heroContainer.querySelector('[data-stage-counter]');
        const progressFill = stageCard.querySelector('.stage-progress-fill');
        const progressPercent = stageCard.querySelector('.stage-progress-percent');
        const navigatorRing = heroContainer.querySelector('.navigator-ring');
        const stageNodes = Array.from(heroContainer.querySelectorAll('.navigator-ring .stage-node'));
        const buyerChips = stageCard.querySelector('[data-buyer-chips]');
        const sellerChips = stageCard.querySelector('[data-seller-chips]');
        const collaborationItems = stageCard.querySelector('[data-collaboration-items]');
        const agentChips = stageCard.querySelector('[data-agent-chips]');

        if (!stageText || !progressFill || stageNodes.length === 0) {
            return;
        }

        progressFill.setAttribute('role', 'progressbar');
        progressFill.setAttribute('aria-valuemin', '0');
        progressFill.setAttribute('aria-valuemax', '100');

        let currentIndex = 0;
        let prevIndex = 0;
        let cycleId = null;
        let isFirstLoad = true;

        const ringTrack = heroContainer.querySelector('.navigator-ring-track');

        // Compute transform-origin % aimed at a stage node's position on the ring
        const getNodeOrigin = (index) => {
            const stageCount = stageNodes.length || 6;
            const angle = index * (360 / stageCount) * Math.PI / 180;
            const x = 50 + 50 * Math.sin(angle);
            const y = 50 - 50 * Math.cos(angle);
            return x.toFixed(1) + '% ' + y.toFixed(1) + '%';
        };

        const fireTransitParticles = (fromIdx, toIdx) => {
            if (!ringTrack || motionQuery.matches) return;

            const fromAngle = fromIdx * 60;
            let toAngle = toIdx * 60;
            // Handle wrap (Success → Discovery: 300° → 360°)
            if (toAngle <= fromAngle) toAngle += 360;

            // Fire 3 staggered particles for a data-stream trail
            for (let i = 0; i < 3; i++) {
                const p = document.createElement('div');
                p.className = 'nav-transit';
                p.dataset.fromAngle = fromAngle;
                p.dataset.toAngle = toAngle;
                ringTrack.appendChild(p);
                window.setTimeout(() => p.remove(), 1600);
            }
        };

        const fireNodeBurst = (activeNode) => {
            if (!activeNode || motionQuery.matches) return;
            const burst = document.createElement('div');
            burst.className = 'stage-burst';
            activeNode.appendChild(burst);
            window.setTimeout(() => burst.remove(), 800);
        };

        const setActiveNode = (stageName, newIdx) => {
            let newActive = null;
            stageNodes.forEach((node) => {
                const nodeIdx = parseInt(node.dataset.stageIndex, 10);
                const isActive = node.dataset.stage === stageName;
                node.classList.toggle('is-active', isActive);
                node.classList.toggle('is-complete', nodeIdx < newIdx);
                node.setAttribute('aria-current', isActive ? 'true' : 'false');
                if (isActive) newActive = node;
            });

            // Update navigator ring progress class
            if (navigatorRing) {
                // Remove all progress classes
                for (let i = 0; i <= 5; i++) {
                    navigatorRing.classList.remove(`navigator-ring--progress-${i}`);
                }
                // Add current progress class
                navigatorRing.classList.add(`navigator-ring--progress-${newIdx}`);
            }

            // Fire transit particles from previous node to new node
            if (prevIndex !== newIdx) {
                fireTransitParticles(prevIndex, newIdx);
            }
            fireNodeBurst(newActive);
            // Active wedge stays at top - doesn't need rotation updates
            prevIndex = newIdx;
        };

        const updateProgress = (progress) => {
            progressFill.dataset.barW = Math.round(progress);
            progressFill.setAttribute('aria-valuenow', progress);
            if (progressPercent) {
                progressPercent.textContent = `${Math.round(progress)}%`;
            }
        };

        const getInitials = (label) => {
            const words = label.split(' ');
            if (words.length === 1) return label.substring(0, 2).toUpperCase();
            return words.map(w => w[0]).join('').toUpperCase();
        };

        const createParticipantChip = (role) => {
            const chip = document.createElement('div');
            chip.className = 'participant-chip';
            if (role.accent) chip.classList.add('is-accent');

            const avatar = document.createElement('div');
            avatar.className = 'participant-avatar';
            avatar.textContent = getInitials(role.name);

            const info = document.createElement('div');
            info.className = 'participant-info';

            const name = document.createElement('div');
            name.className = 'participant-name';
            name.textContent = role.title;

            info.appendChild(name);

            chip.appendChild(avatar);
            chip.appendChild(info);

            return chip;
        };

        const swapParticipants = (stageName) => {
            if (!buyerChips || !sellerChips || motionQuery.matches) return;

            const roles = STAGE_ROLES[stageName];
            if (!roles) return;

            // Clear and add new chips immediately (leave animation already running)
            buyerChips.innerHTML = '';
            sellerChips.innerHTML = '';

            let colorIndex = 0;

            roles.buyer.forEach((role) => {
                const chip = createParticipantChip(role);
                chip.setAttribute('data-color-index', colorIndex);
                buyerChips.appendChild(chip);
                colorIndex++;
            });

            roles.seller.forEach((role) => {
                const chip = createParticipantChip(role);
                chip.setAttribute('data-color-index', colorIndex);
                sellerChips.appendChild(chip);
                colorIndex++;
            });

            // Pop all chips in together on next frame
            requestAnimationFrame(() => {
                Array.from(buyerChips.children).forEach(c => c.classList.add('is-entering'));
                Array.from(sellerChips.children).forEach(c => c.classList.add('is-entering'));
            });
        };

        let collabTimers = [];
        const collabTimeout = (fn, ms) => { const id = window.setTimeout(fn, ms); collabTimers.push(id); return id; };
        const collabInterval = (fn, ms) => { const id = window.setInterval(fn, ms); collabTimers.push(id); return id; };

        const swapCollaboration = (stageName) => {
            if (!collaborationItems || motionQuery.matches) return;

            const items = STAGE_COLLABORATION[stageName];
            if (!items) return;

            // Clear all pending timers from previous stage
            collabTimers.forEach(id => { window.clearTimeout(id); window.clearInterval(id); });
            collabTimers = [];

            // Clear and add new items immediately (leave animation already running)
            collaborationItems.innerHTML = '';

            // Discovery stage shows conversation with Smart Conversation filling in context
            // Deploy stage shows three-row auto-scheduling flow
            if (stageName === 'Deploy') {
                // Create 3 gantt rows
                const row1 = document.createElement('div');
                row1.className = 'collaboration-item deploy-gantt';
                const timeline1 = document.createElement('div');
                timeline1.className = 'deploy-gantt-timeline';
                const bar1 = document.createElement('div');
                bar1.className = 'deploy-gantt-bar deploy-bar-1';
                timeline1.appendChild(bar1);
                row1.appendChild(timeline1);
                collaborationItems.appendChild(row1);

                const row2 = document.createElement('div');
                row2.className = 'collaboration-item deploy-gantt';
                const timeline2 = document.createElement('div');
                timeline2.className = 'deploy-gantt-timeline';
                const bar2 = document.createElement('div');
                bar2.className = 'deploy-gantt-bar deploy-bar-2';
                timeline2.appendChild(bar2);
                row2.appendChild(timeline2);
                collaborationItems.appendChild(row2);

                const row3 = document.createElement('div');
                row3.className = 'collaboration-item deploy-gantt';
                const timeline3 = document.createElement('div');
                timeline3.className = 'deploy-gantt-timeline';
                const bar3 = document.createElement('div');
                bar3.className = 'deploy-gantt-bar deploy-bar-3';
                timeline3.appendChild(bar3);
                row3.appendChild(timeline3);
                collaborationItems.appendChild(row3);

                // Bar3 clone in row2 (hidden, appears when bar3 "moves up" — rescheduled earlier)
                const bar3b = document.createElement('div');
                bar3b.className = 'deploy-gantt-bar deploy-bar-3-rescheduled';
                timeline2.appendChild(bar3b);

                // Bar4 in row3 (hidden, fills the space after bar3 leaves)
                const bar4 = document.createElement('div');
                bar4.className = 'deploy-gantt-bar deploy-bar-4';
                timeline3.appendChild(bar4);

                // Timeline — rows stay fixed, bars move inside them
                // bar2 errors + collapses → bar3 collapses in row3 + appears in row2 → bar4 fills row3
                collabTimeout(() => bar1.classList.add('is-animating'), 400);
                collabTimeout(() => bar2.classList.add('is-animating'), 800);
                collabTimeout(() => bar3.classList.add('is-animating'), 1200);

                collabTimeout(() => bar2.classList.add('is-error'), 2000);
                collabTimeout(() => bar2.classList.add('is-collapsing'), 2300);

                collabTimeout(() => {
                    const textOverlay = document.createElement('div');
                    textOverlay.className = 'deploy-sequence-text deploy-text-overlay';
                    textOverlay.textContent = '(rescheduling...)';
                    row2.appendChild(textOverlay);
                    requestAnimationFrame(() => textOverlay.classList.add('is-visible'));

                    // bar3 collapses in row3, clone appears in row2
                    bar3.classList.add('is-collapsing');
                    collabTimeout(() => {
                        bar3b.classList.add('is-animating');
                    }, 400);

                    collabTimeout(() => {
                        textOverlay.classList.remove('is-visible');
                        collabTimeout(() => {
                            textOverlay.remove();
                            // bar4 fills row3
                            requestAnimationFrame(() => bar4.classList.add('is-animating'));
                        }, 250);
                    }, 1100);
                }, 2900);

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => {
                        c.classList.add('is-entering');
                    });
                });
                return;
            }

            // Scope stage: toggles on incrementally, last toggles off, new option swaps in and toggles on
            if (stageName === 'Scope') {
                const toggleRows = [];
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item scope-toggle';

                    const toggle = document.createElement('div');
                    toggle.className = 'scope-toggle-switch';

                    const label = document.createElement('div');
                    label.className = 'scope-toggle-label';
                    label.textContent = itemText;

                    item.appendChild(toggle);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                    toggleRows.push({ item, toggle, label });
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });

                // 3 sets: initial labels + 2 swap rounds
                // Each set has [label, isOn] — some modules left unchecked
                const swapSets = [
                    [['Custom Reporting Suite', true], ['Security Compliance Pack', false], ['White-label Portal', true]],
                    [['Data Migration Tools', true], ['SSO Integration', true], ['Priority Support Tier', false]]
                ];

                // Which initial modules are toggled on (index → on/off)
                const initialOn = [true, true, false];

                const STAGGER = 150;
                let t = 300;

                // Toggle initial set on (some stay off)
                toggleRows.forEach((row, idx) => {
                    if (initialOn[idx]) {
                        collabTimeout(() => row.toggle.classList.add('is-on'), t + idx * STAGGER);
                    }
                });
                t += toggleRows.length * STAGGER + 500;

                // Swap rounds
                swapSets.forEach((newSet) => {
                    // Toggle off + fade text
                    toggleRows.forEach((row, idx) => {
                        collabTimeout(() => {
                            row.toggle.classList.remove('is-on');
                            row.label.classList.add('is-fading');
                        }, t + idx * STAGGER);
                    });
                    t += toggleRows.length * STAGGER + 300;

                    // Swap text + toggle on (only if marked on)
                    toggleRows.forEach((row, idx) => {
                        collabTimeout(() => {
                            row.label.textContent = newSet[idx][0];
                            row.label.classList.remove('is-fading');
                            if (newSet[idx][1]) {
                                row.toggle.classList.add('is-on');
                            }
                        }, t + idx * STAGGER);
                    });
                    t += toggleRows.length * STAGGER + 900;
                });

                return;
            }

            // Success stage shows issue resolution via AI, sync, and team member
            if (stageName === 'Success') {
                const roles = STAGE_ROLES[stageName] || { buyer: [], seller: [] };
                const sellerName = roles.seller[0] ? roles.seller[0].name.split(' ')[0] : 'Support';

                const resolutionTypes = [
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="22"/>
                        </svg>`,
                        text: 'Auto Solving',
                        className: 'auto-solve'
                    },
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>`,
                        text: 'Synced with Service Desk',
                        className: 'sync'
                    },
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>`,
                        text: sellerName + ' responding',
                        className: 'team-respond'
                    }
                ];

                resolutionTypes.forEach((type, i) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item success-resolve';

                    // Container for swapping states
                    const stateContainer = document.createElement('div');
                    stateContainer.className = 'success-state-container';

                    // State 1: issue icon + issue text
                    const bug = document.createElement('div');
                    bug.className = 'success-state success-bug is-visible';
                    bug.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m8 2 1.88 1.88"/>
                        <path d="M14.12 3.88 16 2"/>
                        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
                        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
                        <path d="M12 20v-9"/>
                        <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
                        <path d="M6 13H2"/>
                        <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
                        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
                        <path d="M22 13h-4"/>
                        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
                    </svg>
                    <span class="success-bug-text">${items[i]}</span>`;

                    // State 2: Working/Syncing state
                    const workingState = document.createElement('div');
                    workingState.className = 'success-state success-working-state';

                    const resolver = document.createElement('div');
                    resolver.className = `success-resolver ${type.className}`;
                    if (type.showInitials) {
                        resolver.textContent = type.initials;
                    } else if (type.icon) {
                        resolver.innerHTML = type.icon;
                    }

                    const statusText = document.createElement('div');
                    statusText.className = 'success-status-text';
                    statusText.textContent = type.text;

                    workingState.appendChild(resolver);
                    workingState.appendChild(statusText);

                    // State 3: Check resolved
                    const checkState = document.createElement('div');
                    checkState.className = 'success-state success-check-state';

                    const checkIcon = document.createElement('div');
                    checkIcon.className = 'success-check-icon';
                    checkIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>`;

                    const resolvedText = document.createElement('div');
                    resolvedText.className = 'success-resolved-text';
                    resolvedText.textContent = 'Resolved';

                    checkState.appendChild(checkIcon);
                    checkState.appendChild(resolvedText);

                    stateContainer.appendChild(bug);
                    stateContainer.appendChild(workingState);
                    stateContainer.appendChild(checkState);
                    item.appendChild(stateContainer);
                    collaborationItems.appendChild(item);

                    // Animate state transitions — spread evenly across 6s
                    const baseDelay = i * 1600 + 600;

                    // State 1 → State 2: Issue → Working
                    collabTimeout(() => {
                        bug.classList.remove('is-visible');
                        bug.classList.add('is-hidden');
                        workingState.classList.add('is-visible');
                    }, baseDelay + 800);

                    // State 2 → State 3: Working → Check
                    collabTimeout(() => {
                        workingState.classList.remove('is-visible');
                        workingState.classList.add('is-hidden');
                        checkState.classList.add('is-visible');
                    }, baseDelay + 2200);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
                return;
            }

            // Commit stage: minimal doc + avatar rows with signature draw
            if (stageName === 'Commit') {
                const roles = STAGE_ROLES[stageName] || { buyer: [], seller: [] };

                // Row 1: Doc icon + title (like a Discovery row)
                const docRow = document.createElement('div');
                docRow.className = 'collaboration-item commit-doc-row';
                docRow.innerHTML = `
                    <div class="commit-row-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 2H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6z"/>
                            <polyline points="11 2 11 6 15 6"/>
                            <line x1="6" y1="10" x2="12" y2="10"/>
                            <line x1="6" y1="13" x2="12" y2="13"/>
                        </svg>
                    </div>
                    <span class="commit-row-label">Master Service Agreement</span>
                `;
                collaborationItems.appendChild(docRow);

                // Row 2 & 3: Avatar + name → signature draws over
                const sigPaths = [
                    'M4 14 C10 6, 18 4, 26 11 C34 18, 40 6, 50 10 C56 13, 58 5, 66 8 C74 11, 78 15, 84 9 C90 3, 96 7, 104 10 C108 11, 112 9, 116 10',
                    'M4 10 C12 16, 20 4, 30 12 C36 16, 42 8, 48 7 C54 6, 62 16, 70 11 C76 7, 80 4, 88 12 C94 17, 100 6, 108 9 L116 8'
                ];
                const signers = [
                    { name: roles.buyer[0]?.name || 'Carmen Vega', color: 'var(--purple)' },
                    { name: roles.seller[0]?.name || 'Marcus Cole', color: 'var(--blurple)' }
                ];

                signers.forEach((signer, idx) => {
                    const row = document.createElement('div');
                    row.className = 'collaboration-item commit-sig-row';
                    row.dataset.signerIndex = idx;

                    const initials = signer.name.split(' ').map(n => n[0]).join('');

                    const avatar = document.createElement('div');
                    avatar.className = 'commit-sig-avatar';
                    // --avatar-color driven by CSS [data-signer-index] on parent row
                    avatar.textContent = initials;
                    row.appendChild(avatar);

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'commit-row-label commit-signer-name';
                    nameSpan.textContent = signer.name;
                    row.appendChild(nameSpan);

                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.classList.add('commit-sig-overlay');
                    svg.setAttribute('viewBox', '0 0 120 20');
                    svg.setAttribute('preserveAspectRatio', 'none');
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.classList.add('commit-sig-path');
                    path.setAttribute('d', sigPaths[idx]);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', signer.color);
                    path.setAttribute('stroke-width', '1.5');
                    path.setAttribute('stroke-linecap', 'round');
                    path.setAttribute('stroke-linejoin', 'round');
                    path.setAttribute('pathLength', '1');
                    svg.appendChild(path);
                    row.appendChild(svg);

                    collaborationItems.appendChild(row);
                });

                // Animate entering
                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });

                // Animate signatures with smoother pacing across 6s
                // 1.2s  sig1 starts drawing
                // 2.2s  sig1 signed + avatar check + path green
                // 3.0s  sig2 starts drawing
                // 4.0s  sig2 signed + avatar check + path green
                // 4.5s  doc icon → check, text → "Completed"
                let signedCount = 0;
                const sigTimings = [1200, 3000];
                const SIG_DRAW_DURATION = 1000;

                sigTimings.forEach((delay, idx) => {
                    collabTimeout(() => {
                        const row = collaborationItems.querySelector(`.commit-sig-row[data-signer-index="${idx}"]`);
                        if (!row) return;
                        row.classList.add('is-signing');
                        const path = row.querySelector('.commit-sig-path');
                        if (path) path.classList.add('is-drawing');

                        collabTimeout(() => {
                            row.classList.add('is-signed');
                            signedCount++;

                            const avatar = row.querySelector('.commit-sig-avatar');
                            if (avatar) {
                                avatar.textContent = '✓';
                                avatar.classList.add('is-signed');
                            }

                            const sigPath = row.querySelector('.commit-sig-path');
                            if (sigPath) sigPath.classList.add('is-complete');

                            if (signedCount === 2) {
                                collabTimeout(() => {
                                    const icon = docRow.querySelector('.commit-row-icon');
                                    if (icon) {
                                        icon.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="4 10 8 14 16 6"/>
                                        </svg>`;
                                        icon.classList.add('is-complete');
                                    }
                                    const label = docRow.querySelector('.commit-row-label');
                                    if (label) {
                                        label.classList.add('is-fading');
                                        collabTimeout(() => {
                                            label.textContent = '2/2 signed!';
                                            label.classList.remove('is-fading');
                                            label.classList.add('is-complete');
                                        }, 300);
                                    }
                                }, 500);
                            }
                        }, SIG_DRAW_DURATION);
                    }, delay);
                });

                return;
            }

            // Experience stage shows meeting rows like Discovery
            if (stageName === 'Experience') {
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item experience-meeting';

                    const icon = document.createElement('div');
                    icon.className = 'meeting-icon';
                    icon.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="11" rx="1"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="1" x2="5" y2="4"/><line x1="11" y1="1" x2="11" y2="4"/></svg>';

                    const label = document.createElement('span');
                    label.textContent = itemText;

                    item.appendChild(icon);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
            } else {
                // Normal list items (Discovery)
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item discovery-item';

                    const dots = document.createElement('span');
                    dots.className = 'discovery-dots';
                    dots.textContent = '.';

                    const label = document.createElement('span');
                    label.className = 'discovery-label';
                    label.textContent = itemText;

                    item.appendChild(dots);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
            }

            // Skip working/completed animations for custom visualizations
            if (stageName === 'Deploy' || stageName === 'Scope' || stageName === 'Commit' || stageName === 'Success') return;

            // Build activity messages from participants + agents for this stage
            const roles = STAGE_ROLES[stageName] || { buyer: [], seller: [] };
            const agents = (STAGE_AGENTS[stageName] || []);
            const allPeople = [...roles.buyer, ...roles.seller];

            // Build a pool of activity messages per item, mixing people and agents
            const buildMessages = (itemIndex) => {
                // Discovery gets custom activity messages showing realistic discovery activities
                if (stageName === 'Discovery') {
                    const buyer = allPeople[0];
                    const seller = allPeople[allPeople.length - 1];
                    const buyerFirst = buyer ? buyer.name.split(' ')[0] : 'User';
                    const sellerFirst = seller ? seller.name.split(' ')[0] : 'Rep';

                    if (itemIndex === 0) {
                        return [
                            buyerFirst + ' asking',
                            'Auto-filled'
                        ];
                    } else if (itemIndex === 1) {
                        return [
                            'Think and Sync processing',
                            'Field auto-filled'
                        ];
                    } else {
                        return [
                            buyerFirst + ' answering',
                            sellerFirst + ' updating'
                        ];
                    }
                }

                // Experience gets meeting-specific activity messages
                if (stageName === 'Experience') {
                    const seller = allPeople[allPeople.length - 1];
                    const sellerFirst = seller ? seller.name.split(' ')[0] : 'Rep';

                    if (itemIndex === 0) {
                        return [
                            sellerFirst + ' presenting',
                            'Screen sharing active'
                        ];
                    } else if (itemIndex === 1) {
                        return [
                            'Live walkthrough',
                            'Architecture review'
                        ];
                    } else {
                        return [
                            'Security review',
                            'Compliance check'
                        ];
                    }
                }

                const msgs = [];
                const buyer = allPeople[itemIndex % allPeople.length];
                const agent = agents[itemIndex % agents.length];
                const seller = allPeople[(itemIndex + 2) % allPeople.length];
                if (buyer) msgs.push(buyer.name.split(' ')[0] + ' is typing');
                if (agent) msgs.push(agent + ' working');
                if (seller && seller !== buyer) msgs.push(seller.name.split(' ')[0] + ' reviewing');
                return msgs;
            };

            // Stagger: working spinner + rotating activity → completed checkmark
            const collabItems = Array.from(collaborationItems.children);
            const WORK_DURATION = 1800;
            const interval = (STAGE_DURATION - WORK_DURATION) / (collabItems.length + 1);
            const MSG_ROTATE_INTERVAL = 800;

            collabItems.forEach((item, i) => {
                const workStart = interval * (i + 1);
                let rotateId = null;
                let dotsId = null;

                collabTimeout(() => {
                    item.classList.add('is-working');

                    // Discovery: animate typing dots (. → .. → ...)
                    const dotsEl = item.querySelector('.discovery-dots');
                    if (dotsEl) {
                        let dotCount = 1;
                        dotsId = collabInterval(() => {
                            dotCount = (dotCount % 3) + 1;
                            dotsEl.textContent = '.'.repeat(dotCount);
                        }, 400);
                    }

                    const messages = buildMessages(i);
                    let msgIndex = 0;

                    // Create activity container
                    const activity = document.createElement('div');
                    activity.className = 'collab-activity';
                    activity.innerHTML = '<span class="activity-text">' + messages[0] + '</span><span class="activity-dots"></span>';
                    item.appendChild(activity);
                    requestAnimationFrame(() => activity.classList.add('is-visible'));

                    // Rotate through messages (stop after last, no looping)
                    if (messages.length > 1) {
                        rotateId = collabInterval(() => {
                            msgIndex++;
                            if (msgIndex >= messages.length) {
                                window.clearInterval(rotateId);
                                rotateId = null;
                                return;
                            }
                            const text = activity.querySelector('.activity-text');
                            if (text) {
                                text.classList.add('is-swapping');
                                collabTimeout(() => {
                                    text.textContent = messages[msgIndex];
                                    text.classList.remove('is-swapping');
                                }, 150);
                            }
                        }, MSG_ROTATE_INTERVAL);
                    }
                }, workStart);

                collabTimeout(() => {
                    if (rotateId) window.clearInterval(rotateId);
                    if (dotsId) window.clearInterval(dotsId);
                    // Swap discovery dots to green check
                    const dotsEl = item.querySelector('.discovery-dots');
                    if (dotsEl) dotsEl.textContent = '✓';
                    // Replace question with answer
                    const labelEl = item.querySelector('.discovery-label');
                    if (labelEl && DISCOVERY_ANSWERS[i]) {
                        labelEl.classList.add('is-fading');
                        collabTimeout(() => {
                            labelEl.textContent = DISCOVERY_ANSWERS[i];
                            labelEl.classList.remove('is-fading');
                            labelEl.classList.add('is-answered');
                        }, 200);
                    }
                    item.classList.remove('is-working');
                    item.classList.add('is-completed');
                    const activity = item.querySelector('.collab-activity');
                    if (activity) activity.remove();
                }, workStart + WORK_DURATION);
            });
        };

        const swapAgents = (stageName, stageIndex) => {
            if (!agentChips || motionQuery.matches) return;

            const agents = STAGE_AGENTS[stageName];
            if (!agents) return;

            const intel = AGENT_INTELLIGENCE[stageIndex] || AGENT_INTELLIGENCE[0];
            const knowledgePct = Math.round(((stageIndex + 1) / STAGES.length) * 100);

            // Clear and add new agents immediately (leave animation already running)
            agentChips.innerHTML = '';

            agents.forEach((agentName) => {
                const agent = document.createElement('div');
                agent.className = 'agent-chip';
                agent.title = agentName;

                const icon = AGENT_ICONS[agentName];
                if (icon) {
                    const iconWrap = document.createElement('span');
                    iconWrap.className = 'agent-chip-icon';
                    iconWrap.innerHTML = icon;
                    agent.appendChild(iconWrap);
                }

                const label = document.createElement('span');
                label.className = 'agent-chip-label';
                label.textContent = agentName;

                agent.appendChild(label);

                agentChips.appendChild(agent);
            });

            // Intelligence status indicator
            const status = document.createElement('div');
            status.className = 'agent-intel-status';
            const sparkles = '✦'.repeat(intel.level);
            status.innerHTML = '<span class="intel-label">' + intel.label + '</span><span class="intel-sparkles">' + sparkles + '</span>';
            agentChips.appendChild(status);

            requestAnimationFrame(() => {
                Array.from(agentChips.children).forEach(c => c.classList.add('is-entering'));
            });
        };

        const triggerLeaveAnimations = () => {
            if (buyerChips && sellerChips && !motionQuery.matches) {
                Array.from(buyerChips.children).forEach(chip => { chip.classList.remove('is-entering'); chip.classList.add('is-leaving'); });
                Array.from(sellerChips.children).forEach(chip => { chip.classList.remove('is-entering'); chip.classList.add('is-leaving'); });
            }
            if (collaborationItems && !motionQuery.matches) {
                Array.from(collaborationItems.children).forEach(item => { item.classList.remove('is-entering'); item.classList.add('is-leaving'); });
            }
            if (agentChips && !motionQuery.matches) {
                Array.from(agentChips.children).forEach(agent => { agent.classList.remove('is-entering'); agent.classList.add('is-leaving'); });
            }
        };

        const swapStageText = (value, index) => {
            stageText.classList.add('is-transitioning');
            window.setTimeout(() => {
                stageText.textContent = `${value} Stage`;
                stageText.classList.remove('is-transitioning');
                // Update stage counter
                if (stageCounter) {
                    stageCounter.textContent = `${index + 1} of ${STAGES.length}`;
                }
                // Swap participant chips after stage text updates
                swapParticipants(value);
                swapCollaboration(value);
                swapAgents(value, index);
            }, TEXT_SWAP_DELAY);
        };

        const applyStage = (index) => {
            const stage = STAGES[index];
            if (!stage) {
                return;
            }

            // First load or reduced motion — instant swap, no collapse/expand
            if (isFirstLoad || motionQuery.matches) {
                isFirstLoad = false;
                triggerLeaveAnimations();
                swapStageText(stage.name, index);
                updateProgress(stage.progress);
                setActiveNode(stage.name, index);
                return;
            }

            // --- Collapse card toward the OLD active node ---
            stageCard.style.transformOrigin = getNodeOrigin(prevIndex);
            stageCard.classList.remove('is-expanding');
            stageCard.classList.add('is-collapsing');
            triggerLeaveAnimations();

            // After collapse completes, swap content while card is invisible
            window.setTimeout(() => {
                // Swap transform-origin to NEW node
                stageCard.style.transformOrigin = getNodeOrigin(index);

                // Swap all content instantly (card is at scale 0)
                stageText.textContent = stage.name + ' Stage';
                stageText.classList.remove('is-transitioning');
                if (stageCounter) {
                    stageCounter.textContent = (index + 1) + ' of ' + STAGES.length;
                }
                updateProgress(stage.progress);
                setActiveNode(stage.name, index);
                swapParticipants(stage.name);
                swapCollaboration(stage.name);
                swapAgents(stage.name, index);

                // --- Expand card from the NEW node ---
                stageCard.classList.remove('is-collapsing');
                // Force reflow so the browser registers scale(0) before transitioning to scale(1)
                void stageCard.offsetHeight;
                stageCard.classList.add('is-expanding');

                // Clean up after expand
                window.setTimeout(() => {
                    stageCard.classList.remove('is-expanding');
                }, EXPAND_DURATION);
            }, COLLAPSE_DURATION);
        };

        const startCycle = () => {
            if (cycleId !== null) {
                window.clearInterval(cycleId);
            }
            cycleId = window.setInterval(() => {
                currentIndex = (currentIndex + 1) % STAGES.length;
                applyStage(currentIndex);
            }, STAGE_DURATION);
        };

        const stopCycle = () => {
            if (cycleId !== null) {
                window.clearInterval(cycleId);
                cycleId = null;
            }
        };

        applyStage(currentIndex);

        // Initialize participant chips immediately for first stage
        if (buyerChips && sellerChips) {
            const initialRoles = STAGE_ROLES[STAGES[currentIndex].name];
            if (initialRoles) {
                let colorIndex = 0;
                initialRoles.buyer.forEach(role => {
                    const chip = createParticipantChip(role);
                    chip.setAttribute('data-color-index', colorIndex);
                    buyerChips.appendChild(chip);
                    colorIndex++;
                });
                initialRoles.seller.forEach(role => {
                    const chip = createParticipantChip(role);
                    chip.setAttribute('data-color-index', colorIndex);
                    sellerChips.appendChild(chip);
                    colorIndex++;
                });
            }
        }

        // Initialize collaboration items for first stage
        if (collaborationItems) {
            const initialCollaboration = STAGE_COLLABORATION[STAGES[currentIndex].name];
            if (initialCollaboration) {
                initialCollaboration.forEach(itemText => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item';
                    item.textContent = itemText;
                    collaborationItems.appendChild(item);
                });
            }
        }

        // Initialize agents for first stage
        if (agentChips && !motionQuery.matches) {
            const initialAgents = STAGE_AGENTS[STAGES[currentIndex].name];
            if (initialAgents) {
                const intel = AGENT_INTELLIGENCE[currentIndex] || AGENT_INTELLIGENCE[0];

                initialAgents.forEach(agentName => {
                    const agent = document.createElement('div');
                    agent.className = 'agent-chip is-entering';
                    agent.title = agentName;

                    const icon = AGENT_ICONS[agentName];
                    if (icon) {
                        const iconWrap = document.createElement('span');
                        iconWrap.className = 'agent-chip-icon';
                        iconWrap.innerHTML = icon;
                        agent.appendChild(iconWrap);
                    }

                    const label = document.createElement('span');
                    label.className = 'agent-chip-label';
                    label.textContent = agentName;
                    agent.appendChild(label);

                    agentChips.appendChild(agent);
                });

                const status = document.createElement('div');
                status.className = 'agent-intel-status is-entering';
                const sparkles = '✦'.repeat(intel.level);
                status.innerHTML = '<span class="intel-label">' + intel.label + '</span><span class="intel-sparkles">' + sparkles + '</span>';
                agentChips.appendChild(status);
            }
        }

        // Wire up navigation chevrons — but only on the legacy (non-v6)
        // hero. On v6 the same .ring-nav-prev / .ring-nav-next buttons are
        // owned by hero_journey_cycle.js, which steps the full 9-beat flow
        // (CN intro + picker + plan + 6 stages). Double-binding here would
        // race the hero cycle for ring state and the user reports the
        // buttons doing nothing because applyStage targets the hidden
        // .stage-progress-card.
        const isV6 = !!document.querySelector('.v6-mockup-panel');
        const navPrev = isV6 ? null : heroContainer.querySelector('.ring-nav-prev');
        const navNext = isV6 ? null : heroContainer.querySelector('.ring-nav-next');

        if (navPrev) {
            navPrev.addEventListener('click', () => {
                stopCycle();
                currentIndex = (currentIndex - 1 + STAGES.length) % STAGES.length;
                applyStage(currentIndex);
            });
        }

        if (navNext) {
            navNext.addEventListener('click', () => {
                stopCycle();
                currentIndex = (currentIndex + 1) % STAGES.length;
                applyStage(currentIndex);
            });
        }

        // Wire up stage node clicks
        stageNodes.forEach((node) => {
            node.classList.add('is-clickable');
            node.addEventListener('click', () => {
                const nodeIndex = parseInt(node.dataset.stageIndex, 10);
                if (!isNaN(nodeIndex)) {
                    stopCycle();
                    currentIndex = nodeIndex;
                    applyStage(currentIndex);
                }
            });
        });

        // Use IntersectionObserver to only start animation when scrolled into view
        let heroCycleStartTimeout = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !motionQuery.matches) {
                    heroCycleStartTimeout = setTimeout(startCycle, 300);
                } else {
                    clearTimeout(heroCycleStartTimeout);
                    stopCycle();
                }
            });
        }, {
            threshold: 0.3 // Start when 30% visible
        });

        observer.observe(stageCard);

        motionQuery.addEventListener('change', (event) => {
            if (event.matches) {
                stopCycle();
            } else {
                // Only restart if element is in view
                const rect = stageCard.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInView) {
                    startCycle();
                }
            }
        });
    };

    /* COMMENTED OUT - No longer needed with grid layout
    const initProofOrbitMagnet = () => {
        const orbit = document.querySelector('.proof-visual .proof-holo');
        const nodes = Array.from(document.querySelectorAll('.proof-node'));

        if (!orbit || nodes.length === 0 || motionQuery.matches) {
            return;
        }

        const pointer = { x: 0, y: 0 };
        let pointerActive = false;
        let rafId = null;
        const MAX_PULL = 14;
        const ATTRACTION_RADIUS = 320;
        const nodeStates = new Map(
            nodes.map((node) => [node, { currentX: 0, currentY: 0, targetX: 0, targetY: 0 }])
        );

        const scheduleUpdate = () => {
            if (rafId !== null) {
                return;
            }
            rafId = window.requestAnimationFrame(tick);
        };

        const tick = () => {
            rafId = null;
            applyTargets();
            const moving = animateNodes();
            if (pointerActive || moving) {
                scheduleUpdate();
            }
        };

        const applyTargets = () => {
            if (!pointerActive) {
                nodeStates.forEach((state) => {
                    state.targetX = 0;
                    state.targetY = 0;
                });
                return;
            }

            let closest = null;
            let minDistance = ATTRACTION_RADIUS;

            nodes.forEach((node) => {
                const rect = node.getBoundingClientRect();
                const nodeX = rect.left + rect.width / 2;
                const nodeY = rect.top + rect.height / 2;
                const dx = pointer.x - nodeX;
                const dy = pointer.y - nodeY;
                const distance = Math.hypot(dx, dy);

                if (distance < minDistance) {
                    minDistance = distance;
                    closest = { node, dx, dy, distance };
                }
            });

            nodeStates.forEach((state, node) => {
                if (!closest || node !== closest.node) {
                    state.targetX = 0;
                    state.targetY = 0;
                    return;
                }

                const { dx, dy, distance } = closest;
                if (distance === 0) {
                    state.targetX = 0;
                    state.targetY = 0;
                    return;
                }

                const strength = 1 - Math.min(distance, ATTRACTION_RADIUS) / ATTRACTION_RADIUS;
                const pull = MAX_PULL * strength;
                state.targetX = (dx / distance) * pull;
                state.targetY = (dy / distance) * pull;
            });
        };

        const animateNodes = () => {
            let moving = false;

            nodeStates.forEach((state, node) => {
                state.currentX += (state.targetX - state.currentX) * 0.18;
                state.currentY += (state.targetY - state.currentY) * 0.18;

                if (
                    Math.abs(state.currentX - state.targetX) > 0.15 ||
                    Math.abs(state.currentY - state.targetY) > 0.15
                ) {
                    moving = true;
                }

                if (Math.abs(state.currentX) < 0.01 && Math.abs(state.targetX) < 0.01) {
                    state.currentX = 0;
                }
                if (Math.abs(state.currentY) < 0.01 && Math.abs(state.targetY) < 0.01) {
                    state.currentY = 0;
                }

                node.dataset.magnetX = Math.round(state.currentX);
                node.dataset.magnetY = Math.round(state.currentY);

                const engaged =
                    Math.abs(state.currentX) > 0.2 ||
                    Math.abs(state.currentY) > 0.2 ||
                    Math.abs(state.targetX) > 0.2 ||
                    Math.abs(state.targetY) > 0.2;
                node.classList.toggle('is-magnetic', engaged);
            });

            return moving;
        };

        const handlePointerMove = (event) => {
            pointerActive = true;
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            scheduleUpdate();
        };

        const handlePointerLeave = () => {
            pointerActive = false;
            scheduleUpdate();
        };

        orbit.addEventListener('pointermove', handlePointerMove, { passive: true });
        orbit.addEventListener('pointerleave', handlePointerLeave);
    };
    */

    const initPageInteractions = () => {
        initNavigator();
        // initProofOrbitMagnet(); // Commented out - no longer needed with grid layout
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initPageInteractions();
    } else {
        document.addEventListener('DOMContentLoaded', initPageInteractions);
    }
})();

// Create Templates AI Flow Animation
(function () {
    const toolFlows = {
        creator: [
            {
                prompt: 'I sell enterprise cybersecurity. Design a journey I can use to get my customers to full threat coverage 3x faster.',
                statusLabel: 'Enterprise Security Partnership',
                statusSteps: [
                    'Mapping compliance requirements to deployment phases...',
                    'Coordinating CISO, IT ops, and security team alignment...',
                    'Establishing ROI metrics and risk mitigation gates...'
                ],
                stages: [
                    'Security Assessment',
                    'Stakeholder Alignment',
                    'Deployment Architecture',
                    'Integration Sprint',
                    'Compliance Validation',
                    'Go-Live Readiness'
                ]
            },
            {
                prompt: 'I run a cloud SaaS business. Build me a motion that lets my junior reps guide customers like seasoned vets.',
                statusLabel: 'SaaS growth studio',
                statusSteps: [
                    'Mapping product usage signals to account health...',
                    'Pairing success plans with executive checkpoints...',
                    'Planning continuation and growth from live data...'
                ],
                stages: [
                    'Usage Pulse',
                    'Value Mapping',
                    'Success Blueprint',
                    'Exec Sync',
                    'Partnership Review',
                    'Growth Planning'
                ]
            },
            {
                prompt: 'I run a global EDA company. Design a journey I can share with customers to shorten their dev cycle 5x.',
                statusLabel: 'EDA acceleration lane',
                statusSteps: [
                    'Capturing customer design goals against tooling paths...',
                    'Pairing architecture labs with rapid verification...',
                    'Sharing cycle-time outcomes across teams...'
                ],
                stages: [
                    'Use-Case Intake',
                    'Architecture Lab',
                    'Prototype Sprint',
                    'Verification Runway',
                    'Launch Readiness',
                    'Success Validation'
                ]
            },
            {
                prompt: 'I run a consulting firm. Design a flow I can use to make our delivery tangible and repeatable so we scale with confidence.',
                statusLabel: 'Consulting scale hub',
                statusSteps: [
                    'Packaging outcomes into repeatable offers...',
                    'Sequencing delivery sprints with client pilots...',
                    'Capturing proof so the next engagement launches faster...'
                ],
                stages: [
                    'Discovery Canvas',
                    'Offer Packaging',
                    'Delivery Sprints',
                    'Value Proof',
                    'Knowledge Transition'
                ]
            },
            {
                prompt: 'I lead sustainability for a manufacturer. Set up a workspace I can use to keep procurement, carbon accounting, and field teams aligned.',
                statusLabel: 'Sustainability control tower',
                statusSteps: [
                    'Rolling supplier data into a single carbon ledger...',
                    'Matching finance checkpoints with climate targets...',
                    'Equipping field teams with ready-to-run playbooks...'
                ],
                stages: [
                    'Signal Intake',
                    'Carbon Ledger',
                    'Boardroom Gate',
                    'Field Sprint'
                ]
            }
        ],
        editor: [
            {
                prompt: 'Rewrite the Discovery stage to focus on technical validation rather than business discovery.',
                statusLabel: 'Stage refinement',
                statusSteps: [
                    'Analyzing current stage objectives and stakeholder roles...',
                    'Restructuring milestones around technical proof points...',
                    'Updating exit criteria for engineering sign-off...'
                ],
                stages: [
                    'Scope Analysis',
                    'Milestone Rewrite',
                    'Criteria Update',
                    'Validation Check'
                ]
            },
            {
                prompt: 'Accelerate time-to-value so the journey completes in 14 days instead of 30.',
                statusLabel: 'Value acceleration',
                statusSteps: [
                    'Identifying parallelizable tasks in current sequence...',
                    'Merging redundant checkpoints into combined gates...',
                    'Recalculating resource allocation for compressed timeline...'
                ],
                stages: [
                    'Dependency Mapping',
                    'Parallel Optimization',
                    'Gate Consolidation',
                    'Timeline Validation'
                ]
            },
            {
                prompt: 'Add an executive stakeholder track that runs alongside the technical implementation stages.',
                statusLabel: 'Stakeholder track insertion',
                statusSteps: [
                    'Mapping executive touchpoints to existing stage boundaries...',
                    'Generating briefing templates for each milestone...',
                    'Linking approval gates to implementation checkpoints...'
                ],
                stages: [
                    'Touchpoint Design',
                    'Briefing Templates',
                    'Approval Gates',
                    'Track Integration',
                    'Sync Validation'
                ]
            }
        ],
        coach: [
            {
                prompt: 'Analyze why deals stall at the Scope stage and suggest template adjustments.',
                statusLabel: 'Stall pattern analysis',
                statusSteps: [
                    'Scanning journey completion data across 47 active deals...',
                    'Identifying common drop-off patterns at Scope stage...',
                    'Correlating stall duration with stakeholder engagement gaps...'
                ],
                stages: [
                    'Data Collection',
                    'Pattern Detection',
                    'Root Cause Analysis',
                    'Recommendation Engine',
                    'Template Patch'
                ]
            },
            {
                prompt: 'Review last quarter execution and recommend improvements for next quarter templates.',
                statusLabel: 'Quarterly performance review',
                statusSteps: [
                    'Aggregating stage completion rates across all journeys...',
                    'Benchmarking cycle times against industry standards...',
                    'Generating optimization recommendations ranked by impact...'
                ],
                stages: [
                    'Metric Aggregation',
                    'Benchmark Comparison',
                    'Gap Identification',
                    'Improvement Ranking',
                    'Template Updates'
                ]
            },
            {
                prompt: 'Which customer segments are completing journeys fastest and what can we learn from them?',
                statusLabel: 'Segment intelligence',
                statusSteps: [
                    'Clustering journey completions by customer attributes...',
                    'Extracting high-velocity patterns from top performers...',
                    'Generating playbook refinements from winning behaviors...'
                ],
                stages: [
                    'Segment Clustering',
                    'Velocity Analysis',
                    'Pattern Extraction',
                    'Playbook Refinement'
                ]
            }
        ]
    };

    let activeTool = 'creator';
    let flows = toolFlows[activeTool];

    const promptDisplay = document.querySelector('.ai-prompt-display');
    const promptTarget = document.querySelector('.ai-prompt-text');
    const caret = document.querySelector('.ai-prompt-caret');
    const statusMessage = document.querySelector('.ai-status-message');
    const statusLabelEl = document.querySelector('.ai-status-label');
    const statusHeader = document.querySelector('.creator-panel-header');
    const statusChipEl = document.querySelector('.ai-status-chip');
    const stageList = document.querySelector('[data-ai-stages]');
    const stageScroll = document.querySelector('[data-ai-stage-scroll]');
    const creatorCircleEl = document.querySelector('[data-ai-creator-circle]');
    const creatorOpenBtn = document.querySelector('[data-creator-open-btn]');
    const creatorPanel = document.querySelector('[data-creator-panel]');
    if (!promptDisplay || !promptTarget || !caret || !statusMessage || !stageList || !statusLabelEl || !statusChipEl || !stageScroll || !statusHeader) {
        return;
    }

    const swapDuration = 280;
    let flowIndex = 0;
    let typedIndex = 0;
    let typeTimer;
    let nextFlowTimer;
    let stageTimer;
    let statusTimer;
    let currentFlow = null;
    let hasBootstrapped = false;
    let isSwapping = false;

    let activePrompt = '';
    let statusSteps = [];
    const typeSpeed = 22;
    const stageDelay = 600;
    const betweenFlowsDelay = 2600;

    function swapFlowContent(callback) {
        var viewEl = creatorPanel?.closest('[data-tool-view]');
        if (!viewEl || isSwapping) {
            callback();
            return;
        }
        isSwapping = true;
        viewEl.classList.add('fade-swap', 'is-faded');
        window.setTimeout(() => {
            callback();
            requestAnimationFrame(() => {
                viewEl.classList.remove('is-faded');
                window.setTimeout(() => {
                    isSwapping = false;
                }, swapDuration);
            });
        }, swapDuration);
    }

    function setStatusLabel(text, state) {
        statusLabelEl.textContent = text;
        if (state) {
            statusHeader.dataset.statusState = state;
        }
    }

    function updateChip(state) {
        const map = {
            idle: 'ai-status-chip--idle',
            active: 'ai-status-chip--active',
            done: 'ai-status-chip--done'
        };
        statusChipEl.classList.remove('ai-status-chip--idle', 'ai-status-chip--active', 'ai-status-chip--done');
        statusChipEl.classList.add(map[state] || map.idle);
        if (state === 'idle') {
            statusChipEl.textContent = 'Not started';
        } else if (state === 'active') {
            statusChipEl.textContent = 'In progress';
        } else {
            statusChipEl.textContent = 'Complete';
        }
    }

    function setStatus(index) {
        if (!statusSteps.length) {
            return;
        }
        const safeIndex = Math.min(index, statusSteps.length - 1);
        statusMessage.textContent = statusSteps[safeIndex];
        statusMessage.classList.add('is-visible');
    }

    function hideCreatorCta() {
        if (creatorOpenBtn) creatorOpenBtn.classList.add('is-hidden');
    }

    function showCreatorCta() {
        if (creatorOpenBtn) creatorOpenBtn.classList.remove('is-hidden');
    }

    const logBody = document.querySelector('[data-creator-log-body]');
    const logTitleEl = document.querySelector('.ai-process-log-title');
    let logStep = 0;

    function addLogEntry(msg, type) {
        if (!logBody) return null;
        var entry = document.createElement('div');
        entry.className = 'ai-log-entry' + (type ? ' ai-log-entry--' + type : '');
        var dots = type === 'system' ? '<span class="ai-log-dots"></span>' : '';
        entry.innerHTML = '<span class="ai-log-msg">' + msg + dots + '</span>';
        logBody.appendChild(entry);
        requestAnimationFrame(function() {
            entry.classList.add('is-visible');
        });
        logBody.scrollTop = logBody.scrollHeight;
        logStep++;
        return entry;
    }

    function clearLog() {
        if (logBody) logBody.innerHTML = '';
        logStep = 0;
    }

    function showCreatorPanel() {
        if (creatorPanel) {
            creatorPanel.classList.remove('is-faded', 'fade-out-fast');
            creatorPanel.classList.add('fade-in-medium');
        }
    }

    function hideCreatorPanel() {
        if (creatorPanel) {
            creatorPanel.classList.remove('fade-in-medium');
            creatorPanel.classList.add('fade-out-fast');
        }
        clearLog();
    }

    function showCreatorCircle() {
        if (creatorCircleEl) {
            creatorCircleEl.classList.remove('is-faded', 'fade-out-medium');
            creatorCircleEl.classList.add('fade-in-slow');
        }
    }

    function hideCreatorCircle() {
        if (creatorCircleEl) {
            creatorCircleEl.classList.remove('fade-in-slow');
            creatorCircleEl.classList.add('fade-out-medium');
        }
    }

    function resetProgressScroll() {
        stageScroll.scrollTo({ top: 0, behavior: 'auto' });
    }

    function scrollStageIntoView(stage, opts = {}) {
        if (!stage) {
            return;
        }
        const topBuffer = opts.forceBottom ? 8 : 28;
        const bottomBuffer = opts.forceBottom ? 8 : 40;

        const stageRect = stage.getBoundingClientRect();
        const scrollRect = stageScroll.getBoundingClientRect();

        if (stageRect.bottom > scrollRect.bottom - bottomBuffer) {
            const offset = stageScroll.scrollTop + (stageRect.bottom - scrollRect.bottom) + bottomBuffer;
            stageScroll.scrollTo({ top: offset, behavior: 'smooth' });
        } else if (stageRect.top < scrollRect.top + topBuffer) {
            const offset = stageScroll.scrollTop - (scrollRect.top - stageRect.top) + topBuffer;
            stageScroll.scrollTo({ top: Math.max(offset, 0), behavior: 'smooth' });
        }
    }

    function scrollStagesToBottom() {
        stageScroll.scrollTo({
            top: stageScroll.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Creator circle chart (radial assembly during creation)
    const creatorCircleNodes = document.querySelector('[data-ai-creator-nodes]');
    const creatorCenterText = document.querySelector('[data-ai-creator-center-text]');

    function setCreatorNode(index, state) {
        if (!creatorCircleNodes) return;
        var node = creatorCircleNodes.querySelector('[data-node-index="' + index + '"]');
        if (!node) return;
        node.classList.remove('is-idle', 'is-working', 'is-complete');
        if (state) node.classList.add(state);
    }

    function buildAllCreatorNodes(count) {
        if (!creatorCircleNodes) return;
        while (creatorCircleNodes.firstChild) creatorCircleNodes.removeChild(creatorCircleNodes.firstChild);
        var cx = 50, cy = 50, r = 38;
        var w = 24, h = 12;
        for (var i = 0; i < count; i++) {
            var angle = (-Math.PI / 2) + (2 * Math.PI * i / count);
            var nx = cx + r * Math.cos(angle);
            var ny = cy + r * Math.sin(angle);
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (nx - w / 2).toFixed(1));
            rect.setAttribute('y', (ny - h / 2).toFixed(1));
            rect.setAttribute('width', String(w));
            rect.setAttribute('height', String(h));
            rect.setAttribute('rx', '6');
            rect.setAttribute('ry', '6');
            rect.dataset.nodeIndex = String(i);
            rect.classList.add('is-idle');
            creatorCircleNodes.appendChild(rect);
        }
    }

    function initStages(stageLabels) {
        stageList.innerHTML = '';
        if (creatorCircleNodes) {
            while (creatorCircleNodes.firstChild) creatorCircleNodes.removeChild(creatorCircleNodes.firstChild);
        }
        if (creatorCenterText) { creatorCenterText.textContent = ''; creatorCenterText.classList.remove('is-hidden'); }
        hideCreatorCta();
    }

    function resetStages() {
        stageList.classList.remove('is-ready');
        stageList.querySelectorAll('.ai-stage').forEach(stage => {
            stage.classList.remove('is-active', 'is-complete');
        });
    }

    function finishStages() {
        updateChip('done');
        statusMessage.textContent = 'Template ready';
        statusMessage.classList.add('is-visible');
        setStatusLabel(currentFlow?.statusLabel || 'Journey Template Ready', 'complete');
        addLogEntry('Template ready', 'success');

        // Mark all creator chart nodes complete
        var totalNodes = currentFlow.stages.length;
        for (var i = 0; i < totalNodes; i++) {
            setCreatorNode(i, 'is-complete');
        }

        // Celebration pulse: flash all nodes bright then settle
        var chartEl = document.querySelector('[data-ai-creator-circle]');
        if (chartEl) chartEl.classList.add('is-celebrating');
        setTimeout(function () {
            if (chartEl) chartEl.classList.remove('is-celebrating');
        }, 1200);

        if (creatorCenterText) creatorCenterText.classList.add('is-hidden');
        showCreatorCta();
        scrollStagesToBottom();

        // Mark all stage list items complete with a stagger
        var stageItems = stageList.querySelectorAll('.ai-stage');
        stageItems.forEach(function (item, i) {
            setTimeout(function () {
                item.classList.add('is-done-pulse');
            }, i * 20);
        });

        nextFlowTimer = setTimeout(() => {
            flowIndex = (flowIndex + 1) % flows.length;
            startFlow();
        }, betweenFlowsDelay);
    }

    function completeLogEntry(entry) {
        if (!entry) return;
        entry.classList.remove('ai-log-entry--system');
        entry.classList.add('ai-log-entry--success');
        var dots = entry.querySelector('.ai-log-dots');
        if (dots) dots.remove();
    }

    function runAssembly() {
        var stages = currentFlow.stages;

        // Phase 1: Digesting your vision
        var digestEntry = addLogEntry('Digesting your vision', 'system');
        if (creatorCenterText) { creatorCenterText.classList.remove('is-hidden'); creatorCenterText.textContent = 'Digesting your vision'; }

        stageTimer = setTimeout(function () {
            completeLogEntry(digestEntry);

            // Phase 2: Creating stage flow
            var stageFlowEntry = addLogEntry('Creating stage flow', 'system');
            if (creatorCenterText) creatorCenterText.textContent = 'Creating stage flow';
            buildAllCreatorNodes(stages.length);
            showCreatorCircle();

            stageTimer = setTimeout(function () {
                completeLogEntry(stageFlowEntry);

                // Phase 3: Create each stage individually
                addLogEntry(stages.length + ' stages resolved', 'success');
                stageList.classList.add('is-ready');
                createNextStage(0);
            }, 700);
        }, 700);

        function createNextStage(idx) {
            if (idx >= stages.length) {
                finishStages();
                return;
            }
            var logEntry = addLogEntry('Creating ' + stages[idx]);
            if (creatorCenterText) creatorCenterText.textContent = stages[idx];

            // Transition node: idle → working
            setCreatorNode(idx, 'is-working');

            var li = document.createElement('li');
            li.className = 'ai-stage';
            li.dataset.stageIndex = String(idx);
            li.innerHTML = '<span class="ai-stage-indicator"><span class="ai-stage-spinner"></span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-stage-check"><path d="M20 6 9 17l-5-5"></path></svg></span><span class="ai-stage-label">' + stages[idx] + '</span>';
            stageList.appendChild(li);
            li.classList.add('is-active');
            scrollStageIntoView(li);

            stageTimer = setTimeout(() => {
                li.classList.remove('is-active');
                li.classList.add('is-complete');
                setCreatorNode(idx, 'is-complete');
                if (logEntry) {
                    logEntry.classList.add('ai-log-entry--success');
                }
                createNextStage(idx + 1);
            }, stageDelay);
        }
    }

    function beginStatusFlow() {
        showCreatorPanel();
        updateChip('active');
        setStatusLabel(currentFlow?.statusLabel || 'In progress...', 'active');
        statusTimer = setTimeout(runAssembly, 400);
    }

    function typePrompt() {
        promptTarget.textContent = activePrompt.slice(0, typedIndex);

        if (typedIndex <= activePrompt.length) {
            typedIndex += 1;
            typeTimer = setTimeout(typePrompt, typeSpeed);
        } else {
            caret?.classList.add('is-solid');
            beginStatusFlow();
        }
    }

    function hydrateFlowContent() {
        clearTimeout(typeTimer);
        const flow = flows[flowIndex];
        currentFlow = flow;
        activePrompt = flow.prompt;
        statusSteps = flow.statusSteps;
        if (logTitleEl) logTitleEl.textContent = flow.statusLabel || 'AI Process';
        typedIndex = 0;
        promptTarget.textContent = '';
        caret?.classList.remove('is-solid');
        statusMessage.textContent = '';
        statusMessage.classList.remove('is-visible');
        setStatusLabel('Ready...', 'ready');
        updateChip('idle');
        initStages(flow.stages);
        resetStages();
        hideCreatorCircle();
        hideCreatorCta();
        hideCreatorPanel();
        resetProgressScroll();
        typePrompt();
        if (!hasBootstrapped) {
            hasBootstrapped = true;
        }
    }

    function startFlow() {
        if (hasBootstrapped) {
            swapFlowContent(hydrateFlowContent);
        } else {
            hydrateFlowContent();
        }
    }

    function jumpToFlow(index) {
        // Stop all running timers
        clearTimeout(typeTimer);
        clearTimeout(nextFlowTimer);
        clearTimeout(stageTimer);
        clearTimeout(statusTimer);
        hideCreatorCircle();
        hideCreatorCta();
        hideCreatorPanel();
        flowIndex = ((index % flows.length) + flows.length) % flows.length;
        startFlow();
    }

    // Nav buttons (prev / next)
    const aiFlowPrev = document.querySelector('.ai-flow-prev');
    const aiFlowNext = document.querySelector('.ai-flow-next');
    if (aiFlowPrev) {
        aiFlowPrev.addEventListener('click', () => jumpToFlow(flowIndex - 1));
    }
    if (aiFlowNext) {
        aiFlowNext.addEventListener('click', () => jumpToFlow(flowIndex + 1));
    }

    // AI Tool card radio-button selectors
    const toolLabel = document.querySelector('.ai-tool-label');
    const toolLabels = { creator: 'AI Creator', editor: 'AI Editor', coach: 'AI Coach' };
    const toolCaptions = {
        creator: 'AI builds a complete journey template — stages, prompts, and flow — in about 15 minutes.',
        editor: 'AI surfaces proposed changes to existing stages as reviewable diffs — accept or reject line by line.',
        coach: 'Ask AI anything about your template — answers flow directly back into the editor.',
    };
    const captionEl = document.getElementById('createBeatCaption');
    const toolCards = document.querySelectorAll('.ai-tool-card');

    // Header icon switching
    const headerIcons = document.querySelectorAll('.ai-header-icon[data-tool-icon]');

    // ========== COACH CHAT ENGINE ==========
    const defaultView = document.querySelector('[data-tool-view="default"]');
    const coachView = document.querySelector('[data-tool-view="coach"]');
    const coachMessages = document.querySelector('[data-coach-messages]');
    const coachInput = document.querySelector('[data-coach-input]');

    const coachConversations = [
        {
            query: 'Where are deals getting stuck right now?',
            thinking: 'Scanning 47 active journeys for stage-level bottlenecks',
            report: {
                tag: 'Bottleneck detected',
                headline: 'Scope stage — no validation gate',
                flow: [
                    { stage: 'Discovery', pct: 95 },
                    { stage: 'Experience', pct: 87 },
                    { stage: 'Scope', pct: 42, alert: true },
                    { stage: 'Commit', pct: 38 }
                ],
                finding: 'Exit criteria requires "stakeholder alignment" but reps self-certify. No enforcement — 38 of 47 deals unvalidated. Avg 12d delay. I can add a validation gate that requires stakeholder sign-off before advancing.',
                source: 'Scope stage exit criteria · 47 active journeys'
            },
            cta: 'Apply Fix in Editor',
            editorPrompt: 'Add stakeholder validation checkpoint to the Scope stage to reduce 12-day stall pattern.'
        },
        {
            query: 'Which Discovery questions need attention?',
            thinking: 'Analyzing question response rates across 4 quarters',
            report: {
                tag: 'Question audit',
                headline: 'Discovery — 2 questions underperforming',
                flow: [
                    { stage: 'Budget?', pct: 31, alert: true, note: '\u221922pp \u00b7 Remove' },
                    { stage: 'Timeline?', pct: 44, alert: true, note: '\u219315pp \u00b7 Reword' },
                    { stage: 'Tech reqs?', pct: 89, good: true, note: '\u21918pp' },
                    { stage: 'Stakeholders?', pct: 76, note: '\u2192 flat' },
                    { stage: 'Success?', pct: 92, good: true, note: '\u219112pp' }
                ],
                finding: '"Budget?" dropped 53%\u219231% over 4Q \u2014 reps skip it, too direct at discovery. I\'ll reframe it as "investment range" and soften "Timeline?" phrasing. Both changes ready to apply.',
                source: 'Discovery responses \u00b7 Q1\u2013Q4 2024 \u00b7 142 journeys'
            },
            cta: 'Apply Fix in Editor',
            editorPrompt: 'Reframe underperforming Discovery questions based on response-rate analysis.'
        },
        {
            query: 'What\'s slowing enterprise deal velocity?',
            thinking: 'Correlating deal velocity with template content',
            report: {
                tag: 'Pattern surfaced',
                headline: 'Commit stage — missing exec sponsor',
                flow: [
                    { stage: 'W/ sponsor', pct: 81, good: true },
                    { stage: 'No sponsor', pct: 35, alert: true },
                    { stage: 'Win rate \u0394', pct: 31, good: true, label: '+31%' }
                ],
                finding: 'Deals with a named exec sponsor complete 2.3x faster. Template doesn\'t require one — 74% of slow deals have none assigned. I\'ll add an exec sponsor field as a required entry gate on Commit.',
                source: 'Velocity analysis · Enterprise segment'
            },
            cta: 'Apply Fix in Editor',
            editorPrompt: 'Add executive sponsor requirement to Commit stage entry criteria based on velocity analysis.'
        }
    ];

    let coachFlowIndex = 0;
    let coachTimers = [];

    function clearCoachTimers() {
        coachTimers.forEach(t => clearTimeout(t));
        coachTimers = [];
    }

    function addCoachBubble(type, content, delay) {
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                const bubble = document.createElement('div');
                bubble.className = 'coach-chat-bubble ' + type;

                if (typeof content === 'string') {
                    bubble.textContent = content;
                } else {
                    bubble.appendChild(content);
                }

                coachMessages.appendChild(bubble);
                requestAnimationFrame(() => {
                    bubble.classList.add('is-visible');
                    coachMessages.scrollTop = coachMessages.scrollHeight;
                });
                resolve(bubble);
            }, delay);
            coachTimers.push(timer);
        });
    }

    function typeCoachInput(text, speed) {
        return new Promise(resolve => {
            let i = 0;
            function tick() {
                if (i <= text.length) {
                    coachInput.textContent = text.slice(0, i);
                    i++;
                    const timer = setTimeout(tick, speed);
                    coachTimers.push(timer);
                } else {
                    resolve();
                }
            }
            tick();
        });
    }

    function buildInsightContent(conv) {
        const frag = document.createDocumentFragment();
        const r = conv.report;

        // Report tag
        const tag = document.createElement('div');
        tag.className = 'coach-report-tag';
        tag.textContent = r.tag;
        frag.appendChild(tag);

        // Headline
        const headline = document.createElement('div');
        headline.className = 'coach-report-headline';
        headline.textContent = r.headline;
        frag.appendChild(headline);

        // Flow pivot
        const pivot = document.createElement('div');
        pivot.className = 'coach-flow-pivot';
        r.flow.forEach(f => {
            const row = document.createElement('div');
            row.className = 'coach-flow-row';
            if (f.alert) row.classList.add('is-alert');
            if (f.good) row.classList.add('is-good');

            const stageLbl = document.createElement('span');
            stageLbl.className = 'coach-flow-stage';
            stageLbl.textContent = f.stage;
            row.appendChild(stageLbl);

            const barWrap = document.createElement('div');
            barWrap.className = 'coach-flow-bar-wrap';
            const bar = document.createElement('div');
            bar.className = 'coach-flow-bar';
            bar.dataset.barW = Math.round(f.pct);
            barWrap.appendChild(bar);
            row.appendChild(barWrap);

            const pctLbl = document.createElement('span');
            pctLbl.className = 'coach-flow-pct';
            pctLbl.textContent = f.label || (f.pct + '%');
            row.appendChild(pctLbl);

            if (f.note) {
                const noteEl = document.createElement('span');
                noteEl.className = 'coach-flow-note';
                noteEl.textContent = f.note;
                row.appendChild(noteEl);
            }

            pivot.appendChild(row);
        });
        frag.appendChild(pivot);

        // Finding
        const finding = document.createElement('div');
        finding.className = 'coach-report-finding';
        finding.textContent = r.finding;
        frag.appendChild(finding);

        // Source
        const source = document.createElement('div');
        source.className = 'coach-report-source';
        source.textContent = r.source;
        frag.appendChild(source);

        // CTA
        const cta = document.createElement('button');
        cta.className = 'coach-cta-btn';
        cta.innerHTML = conv.cta + ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
        cta.addEventListener('click', () => {
            switchTool('editor');
        });
        frag.appendChild(cta);

        return frag;
    }

    async function runCoachConversation() {
        if (!coachMessages || !coachInput) return;

        const conv = coachConversations[coachFlowIndex % coachConversations.length];

        // Type the query in the input
        await typeCoachInput(conv.query, 40);

        // Send as user bubble
        await addCoachBubble('coach-bubble-user', conv.query, 400);
        coachInput.textContent = '';

        // Show thinking bubble
        const thinkingContent = document.createElement('span');
        thinkingContent.textContent = conv.thinking;
        const dots = document.createElement('span');
        dots.className = 'coach-thinking-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        thinkingContent.appendChild(dots);
        const thinkBubble = await addCoachBubble('coach-bubble-thinking', thinkingContent, 600);

        // Replace thinking with insight
        const insightTimer = setTimeout(() => {
            if (thinkBubble && thinkBubble.parentNode) {
                thinkBubble.classList.remove('is-visible');
                setTimeout(() => {
                    if (thinkBubble.parentNode) thinkBubble.parentNode.removeChild(thinkBubble);
                    addCoachBubble('coach-bubble-ai', '', 0).then(bubble => {
                        bubble.textContent = '';
                        bubble.appendChild(buildInsightContent(conv));
                        coachMessages.scrollTop = coachMessages.scrollHeight;
                    });
                }, 300);
            }
        }, 2200);
        coachTimers.push(insightTimer);

        // Cycle to next conversation
        const nextTimer = setTimeout(() => {
            coachFlowIndex++;
            // Clear old messages
            while (coachMessages.firstChild) coachMessages.removeChild(coachMessages.firstChild);
            runCoachConversation();
        }, 10500);
        coachTimers.push(nextTimer);
    }

    function startCoach() {
        clearCoachTimers();
        if (coachMessages) {
            while (coachMessages.firstChild) coachMessages.removeChild(coachMessages.firstChild);
        }
        if (coachInput) coachInput.textContent = '';
        runCoachConversation();
    }

    function stopCoach() {
        clearCoachTimers();
        if (coachMessages) {
            while (coachMessages.firstChild) coachMessages.removeChild(coachMessages.firstChild);
        }
        if (coachInput) coachInput.textContent = '';
    }

    // ========== EDITOR FLOW ENGINE ==========
    const editorView = document.querySelector('[data-tool-view="editor"]');
    const editorPromptEl = document.querySelector('[data-editor-prompt]');
    const editorNodesEl = document.querySelector('[data-editor-nodes]');
    const editorCenterLabel = document.querySelector('[data-editor-center-label]');
    const editorDiffTitle = document.querySelector('[data-editor-diff-title]');
    const editorDiffLines = document.querySelector('[data-editor-diff-lines]');
    const editorDiffActions = document.querySelector('[data-editor-diff-actions]');
    const editorAcceptBtn = document.querySelector('[data-editor-accept]');
    const editorRejectBtn = document.querySelector('[data-editor-reject]');
    const editorCircleCol = editorView ? editorView.querySelector('.editor-circle-column') : null;
    const editorFlowBody = editorView ? editorView.querySelector('.editor-flow-body') : null;

    const editorFlows = [
        {
            prompt: 'Refine the Discovery stage to add technical validation checkpoints.',
            stages: ['Discovery', 'Experience', 'Scope', 'Commit', 'Deploy', 'Success'],
            targetIndex: 0,
            diff: [
                { type: 'remove', text: '- objective: "Business qualification"' },
                { type: 'add', text: '+ objective: "Technical & business validation"' },
                { type: 'remove', text: '- exit: "Budget confirmed"' },
                { type: 'add', text: '+ exit: "Architecture review passed"' },
                { type: 'add', text: '+ checkpoint: "POC complete"' }
            ]
        },
        {
            prompt: 'Rewrite Scope descriptions like an elite technical writer for SOW use.',
            stages: ['Discovery', 'Experience', 'Scope', 'Commit', 'Deploy', 'Success'],
            targetIndex: 2,
            diff: [
                { type: 'remove', text: '- desc: "Define project scope"' },
                { type: 'add', text: '+ desc: "Formalize deliverables & acceptance"' },
                { type: 'remove', text: '- outcome: "Scope doc complete"' },
                { type: 'add', text: '+ outcome: "SOW-ready spec signed off"' },
                { type: 'add', text: '+ tone: "formal-technical"' }
            ]
        },
        {
            prompt: 'Add executive stakeholder touchpoints to the Commit stage.',
            stages: ['Discovery', 'Experience', 'Scope', 'Commit', 'Deploy', 'Success'],
            targetIndex: 3,
            diff: [
                { type: 'add', text: '+ role: "Executive Sponsor"' },
                { type: 'add', text: '+ touchpoint: "ROI briefing"' },
                { type: 'remove', text: '- approval: "Manager level"' },
                { type: 'add', text: '+ approval: "VP+ required"' }
            ]
        }
    ];

    let editorFlowIndex = 0;
    let editorTimers = [];

    function clearEditorTimers() {
        editorTimers.forEach(t => clearTimeout(t));
        editorTimers = [];
    }

    function buildEditorNodes(stages) {
        if (!editorNodesEl) return;
        while (editorNodesEl.firstChild) editorNodesEl.removeChild(editorNodesEl.firstChild);
        const cx = 50, cy = 50, r = 38, count = stages.length;
        const w = 24, h = 12;
        for (let i = 0; i < count; i++) {
            const angle = (-Math.PI / 2) + (2 * Math.PI * i / count);
            const nx = cx + r * Math.cos(angle);
            const ny = cy + r * Math.sin(angle);
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', (nx - w / 2).toFixed(1));
            rect.setAttribute('y', (ny - h / 2).toFixed(1));
            rect.setAttribute('width', String(w));
            rect.setAttribute('height', String(h));
            rect.setAttribute('rx', '6');
            rect.setAttribute('ry', '6');
            rect.dataset.editorNode = String(i);
            rect.classList.add('is-idle');
            editorNodesEl.appendChild(rect);
        }
    }

    function setEditorNodeState(index, state) {
        if (!editorNodesEl) return;
        const node = editorNodesEl.querySelector('[data-editor-node="' + index + '"]');
        if (!node) return;
        node.classList.remove('is-idle', 'is-target', 'is-working', 'is-complete');
        node.classList.add(state);
    }

    function typeEditorPrompt(text, speed) {
        return new Promise(resolve => {
            let i = 0;
            function tick() {
                if (i <= text.length) {
                    editorPromptEl.textContent = text.slice(0, i);
                    i++;
                    const t = setTimeout(tick, speed);
                    editorTimers.push(t);
                } else {
                    resolve();
                }
            }
            tick();
        });
    }

    var editorStatusPhrases = ['Detecting stage', 'Scanning template', 'Generating edits', 'Analyzing dependencies'];
    var editorStatusIdx = 0;
    var editorStatusTimer = null;

    function cycleEditorStatus() {
        if (!editorDiffTitle) return;
        editorStatusIdx = (editorStatusIdx + 1) % editorStatusPhrases.length;
        editorDiffTitle.classList.add('is-faded');
        setTimeout(function() {
            editorDiffTitle.innerHTML = '<span class="editor-ai-status-cycle">' + editorStatusPhrases[editorStatusIdx] + '<span class="ai-log-dots"></span></span>';
            editorDiffTitle.classList.remove('is-faded');
        }, 250);
        editorStatusTimer = setTimeout(cycleEditorStatus, 2200);
    }

    function startEditorStatusCycle() {
        if (editorDiffTitle) {
            editorDiffTitle.innerHTML = '<span class="editor-ai-status-cycle">' + editorStatusPhrases[0] + '<span class="ai-log-dots"></span></span>';
        }
        editorStatusIdx = 0;
        editorStatusTimer = setTimeout(cycleEditorStatus, 2200);
    }

    function stopEditorStatusCycle() {
        if (editorStatusTimer) { clearTimeout(editorStatusTimer); editorStatusTimer = null; }
    }

    async function runEditorFlow() {
        if (!editorNodesEl || !editorPromptEl) return;

        const flow = editorFlows[editorFlowIndex % editorFlows.length];

        // Reset - keep panel visible but clear contents
        if (editorDiffLines) editorDiffLines.innerHTML = '';
        if (editorDiffActions) editorDiffActions.classList.remove('is-visible');
        if (editorCenterLabel) editorCenterLabel.textContent = '';
        editorPromptEl.textContent = '';
        if (editorCircleCol) editorCircleCol.classList.remove('is-collapsed');
        if (editorFlowBody) editorFlowBody.classList.remove('diff-expanded');

        // Start AI status cycling in the diff title
        startEditorStatusCycle();

        // Build circle nodes
        buildEditorNodes(flow.stages);

        // Type prompt
        await typeEditorPrompt(flow.prompt, 35);

        // Highlight target stage
        const t1 = setTimeout(() => {
            setEditorNodeState(flow.targetIndex, 'is-target');
            if (editorCenterLabel) editorCenterLabel.textContent = flow.stages[flow.targetIndex];
        }, 600);
        editorTimers.push(t1);

        // AI working on target
        const t2 = setTimeout(() => {
            setEditorNodeState(flow.targetIndex, 'is-working');
            if (editorCenterLabel) editorCenterLabel.textContent = 'Analyzing...';
        }, 1800);
        editorTimers.push(t2);

        // Show diff results - transition from status text to proposed changes
        const t3 = setTimeout(() => {
            stopEditorStatusCycle();
            setEditorNodeState(flow.targetIndex, 'is-complete');
            if (editorCenterLabel) editorCenterLabel.textContent = flow.stages[flow.targetIndex];
            if (editorDiffTitle) {
                editorDiffTitle.classList.add('is-faded');
                setTimeout(function() {
                    editorDiffTitle.textContent = 'Proposed ' + flow.stages[flow.targetIndex] + ' Changes';
                    editorDiffTitle.classList.remove('is-faded');
                }, 250);
            }

            // Collapse circle column to expand diff panel
            if (editorCircleCol) editorCircleCol.classList.add('is-collapsed');
            if (editorFlowBody) editorFlowBody.classList.add('diff-expanded');

            // Stagger diff lines
            flow.diff.forEach((line, i) => {
                const lt = setTimeout(() => {
                    const el = document.createElement('div');
                    el.className = 'editor-diff-line diff-' + line.type;
                    // Strip key prefix, show only quoted value (e.g. '+ objective: "foo"' → '+ "foo"')
                    var displayText = line.text.replace(/^([+-]\s*)[\w]+:\s*/, '$1');
                    el.textContent = displayText;
                    editorDiffLines.appendChild(el);
                    requestAnimationFrame(() => el.classList.add('is-visible'));
                }, i * 200);
                editorTimers.push(lt);
            });

            // Show accept/reject buttons
            const btnDelay = flow.diff.length * 200 + 400;
            const t4 = setTimeout(() => {
                if (editorDiffActions) editorDiffActions.classList.add('is-visible');
            }, btnDelay);
            editorTimers.push(t4);
        }, 3200);
        editorTimers.push(t3);

        // Auto-accept and cycle
        const t5 = setTimeout(() => {
            if (editorAcceptBtn) {
                editorAcceptBtn.classList.add('flash-accept');
                setTimeout(() => {
                    editorAcceptBtn.classList.remove('flash-accept');
                }, 300);
            }
            const t6 = setTimeout(() => {
                editorFlowIndex++;
                runEditorFlow();
            }, 1200);
            editorTimers.push(t6);
        }, 7500);
        editorTimers.push(t5);
    }

    function startEditor() {
        clearEditorTimers();
        runEditorFlow();
    }

    function stopEditor() {
        clearEditorTimers();
        stopEditorStatusCycle();
        if (editorDiffLines) editorDiffLines.innerHTML = '';
        if (editorDiffActions) editorDiffActions.classList.remove('is-visible');
        if (editorDiffTitle) {
            editorDiffTitle.innerHTML = '<span class="editor-ai-status-cycle">Detecting stage<span class="ai-log-dots"></span></span>';
        }
        if (editorPromptEl) editorPromptEl.textContent = '';
        if (editorNodesEl) {
            while (editorNodesEl.firstChild) editorNodesEl.removeChild(editorNodesEl.firstChild);
        }
    }

    // Wire up accept/reject buttons
    if (editorAcceptBtn) {
        editorAcceptBtn.addEventListener('click', () => {
            clearEditorTimers();
            editorFlowIndex++;
            const t = setTimeout(runEditorFlow, 600);
            editorTimers.push(t);
        });
    }
    if (editorRejectBtn) {
        editorRejectBtn.addEventListener('click', () => {
            clearEditorTimers();
            const t = setTimeout(runEditorFlow, 600);
            editorTimers.push(t);
        });
    }

    function switchTool(tool) {
        if (tool === activeTool || !toolFlows[tool]) return;

        // Stop active tool animations
        if (activeTool === 'coach') stopCoach();
        if (activeTool === 'editor') stopEditor();

        activeTool = tool;
        flows = toolFlows[tool];
        flowIndex = 0;

        // Update radio-button states
        toolCards.forEach(card => {
            const isSelected = card.dataset.aiTool === tool;
            card.classList.toggle('is-active', isSelected);
            card.setAttribute('aria-checked', String(isSelected));
        });

        // Update demo header label
        if (toolLabel) toolLabel.textContent = toolLabels[tool] || tool;
        if (captionEl) captionEl.textContent = toolCaptions[tool] || '';

        // Update demo header icon
        headerIcons.forEach(icon => {
            icon.classList.toggle('is-hidden', icon.dataset.toolIcon !== tool);
        });

        // Hide all views
        if (defaultView) defaultView.classList.add('is-hidden');
        if (coachView) coachView.classList.add('is-hidden');
        if (editorView) editorView.classList.add('is-hidden');

        // Show the right view
        if (tool === 'coach') {
            if (coachView) coachView.classList.remove('is-hidden');
            startCoach();
        } else if (tool === 'editor') {
            if (editorView) editorView.classList.remove('is-hidden');
            startEditor();
        } else {
            if (defaultView) defaultView.classList.remove('is-hidden');
            jumpToFlow(0);
        }
    }

    toolCards.forEach(card => {
        card.addEventListener('click', () => switchTool(card.dataset.aiTool));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                switchTool(card.dataset.aiTool);
            }
        });
    });

    // Mobile: click header icon/label to cycle to next mode
    const toolOrder = ['creator', 'editor', 'coach'];
    const demoHeaderGroup = document.querySelector('.ai-tool-label');
    const demoHeaderIconWrap = demoHeaderGroup ? demoHeaderGroup.parentElement : null;
    if (demoHeaderIconWrap) {
        demoHeaderIconWrap.style.cursor = 'pointer';
        demoHeaderIconWrap.addEventListener('click', () => {
            const curIdx = toolOrder.indexOf(activeTool);
            const nextTool = toolOrder[(curIdx + 1) % toolOrder.length];
            switchTool(nextTool);
        });
        // Add subtle hint text
        const hint = document.createElement('span');
        hint.className = 'ai-demo-mode-hint';
        hint.textContent = 'tap for next mode';
        demoHeaderIconWrap.appendChild(hint);
    }

    // Editor → Coach shortcut button
    const editorCoachBtn = document.querySelector('[data-editor-coach-btn]');
    if (editorCoachBtn) {
        editorCoachBtn.addEventListener('click', () => switchTool('coach'));
    }

    function startWhenVisible() {
        const triggerEl = document.querySelector('.create-templates-content');
        if (!triggerEl || typeof window.IntersectionObserver === 'undefined') {
            startFlow();
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    obs.disconnect();
                    startFlow();
                }
            });
        }, {
            threshold: 0.25
        });

        observer.observe(triggerEl);
    }

    startWhenVisible();
})();

// ============================================
// Navigate Journeys Section (3)
// ============================================
(() => {
    const STAGE_DURATION = 6000;
    const TEXT_SWAP_DELAY = 400;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Journey configurations
    const JOURNEYS = {
        eda: {
            name: 'Electronic Design Automation',
            stages: [
                { name: 'Discovery', progress: 5 },
                { name: 'Experience', progress: 25 },
                { name: 'Scope', progress: 45 },
                { name: 'Commit', progress: 65 },
                { name: 'Deploy', progress: 85 },
                { name: 'Success', progress: 100 }
            ],
            agents: {
                Discovery: ['Smart Conversation', 'Think & Sync'],
                Experience: ['Meeting Prep', 'Notetaker'],
                Scope: ['SOW Generator', 'Module Recommender'],
                Commit: ['Why Commit?', 'Fit Evaluator'],
                Deploy: ['Assign Owners', 'Deployment Navigator'],
                Success: ['Auto Ticket Solve', 'Cheat Sheet']
            },
            roles: {
                Discovery: {
                    buyer: [
                        { name: 'Sarah Chen', title: 'Marketing Dir.', initials: 'SC', accent: true },
                        { name: 'Mike Torres', title: 'IT Director', initials: 'MT' }
                    ],
                    seller: [
                        { name: 'Alex Kim', title: 'AE', initials: 'AK', accent: true },
                        { name: 'Jordan Lee', title: 'SDR', initials: 'JL' }
                    ]
                },
                Experience: {
                    buyer: [
                        { name: 'Raj Gupta', title: 'Engineering Mgr.', initials: 'RG', accent: true },
                        { name: 'Sarah Chen', title: 'Marketing Dir.', initials: 'SC' }
                    ],
                    seller: [
                        { name: 'Nina Zhao', title: 'Sales Eng.', initials: 'NZ', accent: true },
                        { name: 'Alex Kim', title: 'AE', initials: 'AK' }
                    ]
                },
                Scope: {
                    buyer: [
                        { name: 'James Park', title: 'VP Finance', initials: 'JP', accent: true },
                        { name: 'Dana West', title: 'Procurement', initials: 'DW' }
                    ],
                    seller: [
                        { name: 'Alex Kim', title: 'AE', initials: 'AK', accent: true },
                        { name: 'Lena Osei', title: 'Product Mgr.', initials: 'LO' }
                    ]
                },
                Commit: {
                    buyer: [
                        { name: 'Carmen Vega', title: 'Legal Counsel', initials: 'CV', accent: true },
                        { name: 'James Park', title: 'VP Finance', initials: 'JP' }
                    ],
                    seller: [
                        { name: 'Marcus Cole', title: 'Legal', initials: 'MC', accent: true },
                        { name: 'Anya Petrov', title: 'Rev. Ops', initials: 'AP' }
                    ]
                },
                Deploy: {
                    buyer: [
                        { name: 'Raj Gupta', title: 'Engineering Mgr.', initials: 'RG', accent: true },
                        { name: 'Pat Morgan', title: 'Security', initials: 'PM' }
                    ],
                    seller: [
                        { name: 'Tomas Ruiz', title: 'Solutions Arch.', initials: 'TR', accent: true },
                        { name: 'Kenji Sato', title: 'Integrations', initials: 'KS' }
                    ]
                },
                Success: {
                    buyer: [
                        { name: 'Priya Patel', title: 'Operations', initials: 'PP', accent: true },
                        { name: 'Sarah Chen', title: 'Engineering Lead', initials: 'SC' }
                    ],
                    seller: [
                        { name: 'Riley Davis', title: 'CSM', initials: 'RD', accent: true },
                        { name: 'Alex Kim', title: 'AE', initials: 'AK' }
                    ]
                }
            },
            activities: {
                Discovery: ['Identify analytics gaps', 'Map data sources', 'Define success metrics'],
                Experience: ['Product demo', 'Technical deep dive', 'Security review'],
                Scope: ['Enterprise package', 'API integration', 'Analytics add-ons'],
                Commit: ['Master agreement', 'Statement of work', 'Data processing terms'],
                Deploy: ['Environment setup', 'Data migration', 'User training'],
                Success: ['Review KPIs', 'Expansion planning', 'Advocacy program']
            }
        },
        sustainability: {
            name: 'Sustainability Initiative',
            stages: [
                { name: 'Signal Intake', progress: 10, type: 'Discovery' },
                { name: 'Carbon Ledger', progress: 40, type: 'Scope' },
                { name: 'Boardroom Gate', progress: 75, type: 'Commit' },
                { name: 'Field Sprint', progress: 100, type: 'Deploy' }
            ],
            agents: {
                'Signal Intake': ['Emissions Scanner', 'Supplier Monitor'],
                'Carbon Ledger': ['Scope 3 Mapper', 'Footprint Calculator'],
                'Boardroom Gate': ['ESG Reporter', 'Compliance Checker'],
                'Field Sprint': ['Action Tracker', 'Impact Validator']
            },
            roles: {
                'Signal Intake': {
                    buyer: [
                        { name: 'Emma Wilson', title: 'Sustainability Dir.', initials: 'EW', accent: true },
                        { name: 'Tom Harris', title: 'Procurement Lead', initials: 'TH' }
                    ],
                    seller: [
                        { name: 'Dr. Lisa Park', title: 'Carbon Expert', initials: 'LP', accent: true },
                        { name: 'Mark Stevens', title: 'Platform Lead', initials: 'MS' }
                    ]
                },
                'Carbon Ledger': {
                    buyer: [
                        { name: 'Tom Harris', title: 'Procurement Lead', initials: 'TH', accent: true },
                        { name: 'Rachel Green', title: 'Finance VP', initials: 'RG' }
                    ],
                    seller: [
                        { name: 'Dr. Lisa Park', title: 'Carbon Expert', initials: 'LP', accent: true },
                        { name: 'Jamie Chen', title: 'Data Architect', initials: 'JC' }
                    ]
                },
                'Boardroom Gate': {
                    buyer: [
                        { name: 'Rachel Green', title: 'Finance VP', initials: 'RG', accent: true },
                        { name: 'Kevin Brown', title: 'Board Advisor', initials: 'KB' }
                    ],
                    seller: [
                        { name: 'Sam Taylor', title: 'ESG Strategist', initials: 'ST', accent: true },
                        { name: 'Alex Rivera', title: 'Reporting Lead', initials: 'AR' }
                    ]
                },
                'Field Sprint': {
                    buyer: [
                        { name: 'Emma Wilson', title: 'Sustainability Dir.', initials: 'EW', accent: true },
                        { name: 'Tom Harris', title: 'Procurement Lead', initials: 'TH' }
                    ],
                    seller: [
                        { name: 'Dr. Lisa Park', title: 'Carbon Expert', initials: 'LP', accent: true },
                        { name: 'Jordan Blake', title: 'Field Manager', initials: 'JB' }
                    ]
                }
            },
            activities: {
                'Signal Intake': ['Procurement signals?', 'Supplier emissions?', 'Baseline targets?'],
                'Carbon Ledger': ['Scope 1-3 Tracking', 'Supplier Carbon Data', 'Offset Registry'],
                'Boardroom Gate': ['ESG Board Deck', 'CDP Disclosure', 'Net Zero Roadmap'],
                'Field Sprint': ['Vendor transition', 'Renewable sourcing', 'Carbon offsets']
            }
        },
        pestcontrol: {
            name: 'Commercial Pest Control',
            stages: [
                { name: 'Inspection', progress: 15 },
                { name: 'Proposal', progress: 35 },
                { name: 'Agreement', progress: 60 },
                { name: 'Treatment', progress: 80 },
                { name: 'Monitoring', progress: 100 }
            ],
            agents: {
                Inspection: ['Site Analyzer', 'Report Generator'],
                Proposal: ['Quote Builder', 'Package Selector'],
                Agreement: ['Contract Manager', 'Terms Helper'],
                Treatment: ['Schedule Optimizer', 'Safety Checker'],
                Monitoring: ['Issue Tracker', 'Re-treatment Advisor']
            },
            roles: {
                Inspection: {
                    buyer: [
                        { name: 'David Lee', title: 'Facilities Mgr.', initials: 'DL', accent: true },
                        { name: 'Susan Clark', title: 'Operations', initials: 'SC' }
                    ],
                    seller: [
                        { name: 'Mike Anderson', title: 'Inspector', initials: 'MA', accent: true },
                        { name: 'Julie Moore', title: 'Account Rep', initials: 'JM' }
                    ]
                },
                Proposal: {
                    buyer: [
                        { name: 'Susan Clark', title: 'Operations', initials: 'SC', accent: true },
                        { name: 'Robert Kim', title: 'Procurement', initials: 'RK' }
                    ],
                    seller: [
                        { name: 'Julie Moore', title: 'Account Rep', initials: 'JM', accent: true },
                        { name: 'Frank Wilson', title: 'Sales Mgr.', initials: 'FW' }
                    ]
                },
                Agreement: {
                    buyer: [
                        { name: 'Robert Kim', title: 'Procurement', initials: 'RK', accent: true },
                        { name: 'David Lee', title: 'Facilities Mgr.', initials: 'DL' }
                    ],
                    seller: [
                        { name: 'Julie Moore', title: 'Account Rep', initials: 'JM', accent: true },
                        { name: 'Linda Ross', title: 'Contracts', initials: 'LR' }
                    ]
                },
                Treatment: {
                    buyer: [
                        { name: 'David Lee', title: 'Facilities Mgr.', initials: 'DL', accent: true },
                        { name: 'Maria Garcia', title: 'Safety Officer', initials: 'MG' }
                    ],
                    seller: [
                        { name: 'Carlos Santos', title: 'Technician', initials: 'CS', accent: true },
                        { name: 'Mike Anderson', title: 'Inspector', initials: 'MA' }
                    ]
                },
                Monitoring: {
                    buyer: [
                        { name: 'David Lee', title: 'Facilities Mgr.', initials: 'DL', accent: true },
                        { name: 'Susan Clark', title: 'Operations', initials: 'SC' }
                    ],
                    seller: [
                        { name: 'Julie Moore', title: 'Account Rep', initials: 'JM', accent: true },
                        { name: 'Carlos Santos', title: 'Technician', initials: 'CS' }
                    ]
                }
            },
            activities: {
                Inspection: ['Property walkthrough', 'Identify infestation', 'Risk assessment'],
                Proposal: ['Treatment options', 'Pricing packages', 'Service frequency'],
                Agreement: ['Contract terms', 'Service schedule', 'Safety protocols'],
                Treatment: ['Apply treatments', 'Set monitoring stations', 'Document results'],
                Monitoring: ['Station checks', 'Re-treatment review', 'Renewal planning']
            }
        }
    };

    // Discovery answers for question → answer transitions
    const DISCOVERY_ANSWERS = {
        Discovery: ['Manual reporting', 'VP Eng, CISO', '50% faster'],
        Inspection: ['Rodent droppings', 'Break room, storage', 'Quarterly service'],
        'Signal Intake': ['Tracked in Coupa', '120 suppliers', 'Net zero by 2030']
    };

    // Agent intelligence levels by stage index
    const AGENT_INTELLIGENCE = [
        { label: 'Gathering context', level: 1 },
        { label: 'Building patterns', level: 2 },
        { label: 'Deepening insight', level: 3 },
        { label: 'High confidence', level: 4 },
        { label: 'Full confidence', level: 5 }
    ];

    // Agent icons for navigate section (all journeys)
    const AGENT_ICONS = {
        'Smart Conversation': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h9v-8h7z"/><path d="M22.5 16h-2.2l1.7-4h-5v6h2v5z"/></svg>',
        'Think & Sync': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z"/></svg>',
        'Meeting Prep': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
        'Notetaker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
        'SOW Generator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z"/></svg>',
        'Module Recommender': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41z"/></svg>',
        'Why Commit?': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1 21h4V9H1zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73z"/></svg>',
        'Fit Evaluator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41m.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l8.32-8.34c1.17-1.17 1.17-3.07 0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-.06z"/></svg>',
        'Assign Owners': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10L22 5.18zM19.79 10.22C19.92 10.79 20 11.39 20 12c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.45-1.45C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39l-1.61 1.61zM15 13h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9c-.55 0-1-.45-1-1s.45-1 1-1h2V9c0-.55.45-1 1-1s1 .45 1 1v2h2c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>',
        'Deployment Navigator': '<svg width="10" height="10" viewBox="0 0 768 971" fill="currentColor" overflow="hidden" aria-hidden="true"><g transform="translate(-1657 -646)"><path fill-rule="evenodd" d="M1767.17 1312.55 1794.45 1362.72C1837.2 1425.87 1903.66 1471.72 1981.08 1487.53L1985.83 1488.01 1693.35 1617 1657 1580.72ZM2314.83 1312.55 2425 1580.72 2388.65 1617 2096.17 1488.01 2100.92 1487.53C2178.34 1471.72 2244.8 1425.87 2287.55 1362.72ZM2041 646 2154.67 922.686 2100.92 906.033C2081.57 902.079 2061.53 900.003 2041 900.003 2020.47 900.003 2000.43 902.079 1981.08 906.033L1927.33 922.686Z"/><path transform="matrix(1 0 0 1.00948 1830 984)" d="M201.953 164.765C204.855 156.061 217.145 156.061 220.047 164.765L237.058 215.853C244.65 238.623 262.524 256.487 285.298 264.066L336.36 281.078C345.064 283.979 345.064 296.27 336.36 299.171L285.272 316.183C262.502 323.774 244.638 341.648 237.058 364.423L220.047 415.485C218.407 420.481 213.027 423.202 208.031 421.562 205.154 420.618 202.897 418.363 201.953 415.485L184.941 364.397C177.355 341.633 159.492 323.769 136.728 316.183L85.6396 299.171C80.6434 297.531 77.9223 292.153 79.562 287.155 80.5062 284.277 82.7626 282.022 85.6396 281.078L136.728 264.066C159.492 256.48 177.355 238.617 184.941 215.853ZM100.067 30.2785C101.06 27.2778 104.298 25.6507 107.299 26.6443 109.017 27.2132 110.364 28.5607 110.933 30.2785L121.14 60.9262C125.703 74.5885 136.411 85.2967 150.074 89.8596L180.721 100.067C183.722 101.06 185.349 104.298 184.356 107.299 183.787 109.017 182.439 110.364 180.721 110.933L150.074 121.14C136.403 125.677 125.677 136.403 121.14 150.074L110.933 180.721C109.94 183.722 106.702 185.349 103.701 184.356 101.983 183.787 100.636 182.439 100.067 180.721L89.8596 150.074C85.3225 136.403 74.5969 125.677 60.9262 121.14L30.2785 110.933C27.2778 109.94 25.6507 106.702 26.6443 103.701 27.2132 101.983 28.5607 100.636 30.2785 100.067L60.9262 89.8596C74.5969 85.3225 85.3225 74.5969 89.8596 60.9262ZM286.511 2.61112C287.202 0.615513 289.381-0.441377 291.378 0.250493 292.485 0.634258 293.353 1.50421 293.738 2.61112L300.543 23.0254C303.576 32.1511 310.724 39.2987 319.849 42.3319L340.264 49.1366C342.26 49.8284 343.315 52.007 342.624 54.0028 342.242 55.1097 341.371 55.9796 340.264 56.3633L319.849 63.1681C310.74 66.216 303.592 73.3652 300.543 82.4746L293.738 102.889C293.047 104.884 290.869 105.941 288.872 105.249 287.764 104.866 286.897 103.996 286.511 102.889L279.707 82.4746C276.658 73.3652 269.51 66.216 260.4 63.1681L240.012 56.3633C238.017 55.6715 236.96 53.493 237.652 51.4972 238.036 50.3902 238.905 49.5204 240.012 49.1366L260.427 42.3319C269.552 39.2987 276.7 32.1511 279.733 23.0254Z"/></g></svg>',
        'Auto Ticket Solve': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.03 3.56c-1.67-1.39-3.74-2.3-6.03-2.51v2.01c1.73.19 3.31.88 4.61 1.92l1.42-1.42zM11 3.06V1.05c-2.29.2-4.36 1.12-6.03 2.51l1.42 1.42C7.69 3.94 9.27 3.25 11 3.06zM4.98 6.39 3.56 4.97C2.17 6.64 1.26 8.71 1.06 11h2.01c.19-1.73.88-3.31 1.91-4.61zM20.94 11h2.01c-.21-2.29-1.11-4.36-2.51-6.03l-1.42 1.42c1.04 1.3 1.73 2.88 1.92 4.61zM7 12l3.44 1.56L12 17l1.56-3.44L17 12l-3.44-1.56L12 7l-1.56 3.44z"/><path d="M12 21c-3.11 0-5.85-1.59-7.46-4H7v-2H1v6h2v-2.7c1.99 2.84 5.27 4.7 9 4.7 4.45 0 8.27-2.64 10-6.43l-1.85-.73C18.64 18.88 15.58 21 12 21z"/></svg>',
        'Cheat Sheet': '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 10v9H5V5h9V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2zm-2.5 2.71-3.39 4.08-2.4-2.96L7.5 18h9l-2.5-3.46 1.5-1.83zM18 3V1h-2v2h-2c.01.01 0 2 0 2h2v2.01c.01 0 2 0 2-.01V5h2V3h-2z"/></svg>',
        'Emissions Scanner': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        'Supplier Monitor': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
        'Scope 3 Mapper': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
        'Footprint Calculator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/></svg>',
        'ESG Reporter': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        'Compliance Checker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'Action Tracker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        'Impact Validator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        'Site Analyzer': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
        'Report Generator': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
        'Quote Builder': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        'Package Selector': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        'Contract Manager': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/></svg>',
        'Terms Helper': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'Schedule Optimizer': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        'Safety Checker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        'Issue Tracker': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        'Re-treatment Advisor': '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>'
    };

    // Get navigate section container
    const navigateSection = document.getElementById('navigate');
    if (!navigateSection) return;

    // Get all journey cards and visualizations
    const journeyCards = navigateSection.querySelectorAll('.navigate-journey-card');
    const journeyVizs = navigateSection.querySelectorAll('.navigate-journey-viz');

    if (!journeyCards.length || !journeyVizs.length) return;

    let currentJourney = 'eda';
    const initializedJourneys = new Set();

    // Function to switch journeys
    function switchJourney(journeyKey) {
        currentJourney = journeyKey;

        // Update journey card active states
        journeyCards.forEach(card => {
            const isActive = card.dataset.journey === journeyKey;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-checked', String(isActive));
        });

        // Show/hide visualizations
        journeyVizs.forEach(viz => {
            const isActive = viz.dataset.journeyViz === journeyKey;
            if (isActive) {
                viz.classList.remove('is-hidden');
                viz.classList.add('is-active');
                // Initialize the hero ring for this journey (only once)
                if (!initializedJourneys.has(journeyKey)) {
                    initializeJourneyRing(viz, journeyKey);
                    initializedJourneys.add(journeyKey);
                }
            } else {
                viz.classList.add('is-hidden');
                viz.classList.remove('is-active');
            }
        });
    }

    // Initialize journey ring with hero-style functionality
    function initializeJourneyRing(vizElement, journeyKey) {
        const journey = JOURNEYS[journeyKey];
        if (!journey) return;

        const stageCard = vizElement.querySelector('[data-stage-carousel]');
        if (!stageCard) return;

        const stageText = stageCard.querySelector('.currStage');
        const stageCounter = vizElement.querySelector('[data-stage-counter]');
        const progressFill = stageCard.querySelector('.stage-progress-fill');
        const progressPercent = stageCard.querySelector('.stage-progress-percent');
        const navigatorRing = vizElement.querySelector('.navigator-ring');
        const stageNodes = Array.from(vizElement.querySelectorAll('.stage-node'));
        const buyerChips = stageCard.querySelector('[data-buyer-chips]');
        const sellerChips = stageCard.querySelector('[data-seller-chips]');
        const collaborationItems = stageCard.querySelector('[data-collaboration-items]');
        const agentChips = stageCard.querySelector('[data-agent-chips]');
        const navPrev = vizElement.querySelector('.ring-nav-prev');
        const navNext = vizElement.querySelector('.ring-nav-next');

        if (!stageText || !progressFill || stageNodes.length === 0) return;

        progressFill.setAttribute('role', 'progressbar');
        progressFill.setAttribute('aria-valuemin', '0');
        progressFill.setAttribute('aria-valuemax', '100');

        let currentIndex = 0;
        let prevIndex = 0;
        let cycleId = null;

        const ringTrack = vizElement.querySelector('.navigator-ring-track');

        const getInitials = (label) => {
            const words = label.split(' ');
            if (words.length === 1) return label.substring(0, 2).toUpperCase();
            return words.map(w => w[0]).join('').toUpperCase();
        };

        const createParticipantChip = (role) => {
            const chip = document.createElement('div');
            chip.className = 'participant-chip';
            if (role.accent) chip.classList.add('is-accent');

            const avatar = document.createElement('div');
            avatar.className = 'participant-avatar';
            avatar.textContent = getInitials(role.name);

            const info = document.createElement('div');
            info.className = 'participant-info';

            const name = document.createElement('div');
            name.className = 'participant-name';
            name.textContent = role.title;

            const title = document.createElement('div');
            title.className = 'participant-title';
            title.textContent = role.name;

            info.appendChild(name);
            info.appendChild(title);

            chip.appendChild(avatar);
            chip.appendChild(info);

            return chip;
        };

        const fireTransitParticles = (fromIdx, toIdx) => {
            if (!ringTrack || motionQuery.matches) return;

            const anglePerStage = 360 / journey.stages.length;
            const fromAngle = fromIdx * anglePerStage;
            let toAngle = toIdx * anglePerStage;
            if (toAngle <= fromAngle) toAngle += 360;

            for (let i = 0; i < 3; i++) {
                const p = document.createElement('div');
                p.className = 'nav-transit';
                p.dataset.fromAngle = fromAngle;
                p.dataset.toAngle = toAngle;
                ringTrack.appendChild(p);
                window.setTimeout(() => p.remove(), 1600);
            }
        };

        const fireNodeBurst = (activeNode) => {
            if (!activeNode || motionQuery.matches) return;
            const burst = document.createElement('div');
            burst.className = 'stage-burst';
            activeNode.appendChild(burst);
            window.setTimeout(() => burst.remove(), 800);
        };

        const setActiveNode = (stageName, newIdx) => {
            let newActive = null;
            stageNodes.forEach((node) => {
                const nodeIdx = parseInt(node.dataset.stageIndex, 10);
                const isActive = node.dataset.stage === stageName;
                node.classList.toggle('is-active', isActive);
                node.classList.toggle('is-complete', nodeIdx < newIdx);
                node.setAttribute('aria-current', isActive ? 'true' : 'false');
                if (isActive) newActive = node;
            });

            if (navigatorRing) {
                for (let i = 0; i <= journey.stages.length; i++) {
                    navigatorRing.classList.remove(`navigator-ring--progress-${i}`);
                }
                navigatorRing.classList.add(`navigator-ring--progress-${newIdx}`);
            }

            if (prevIndex !== newIdx) {
                fireTransitParticles(prevIndex, newIdx);
            }
            fireNodeBurst(newActive);
            prevIndex = newIdx;
        };

        const updateProgress = (progress) => {
            progressFill.dataset.barW = Math.round(progress);
            progressFill.setAttribute('aria-valuenow', progress);
            if (progressPercent) {
                progressPercent.textContent = `${Math.round(progress)}%`;
            }
        };

        const swapParticipants = (stageName) => {
            if (!buyerChips || !sellerChips || motionQuery.matches) return;

            const roles = journey.roles[stageName];
            if (!roles) return;

            buyerChips.innerHTML = '';
            sellerChips.innerHTML = '';

            let colorIndex = 0;

            roles.buyer.forEach((role) => {
                const chip = createParticipantChip(role);
                chip.setAttribute('data-color-index', colorIndex);
                buyerChips.appendChild(chip);
                colorIndex++;
            });

            roles.seller.forEach((role) => {
                const chip = createParticipantChip(role);
                chip.setAttribute('data-color-index', colorIndex);
                sellerChips.appendChild(chip);
                colorIndex++;
            });

            requestAnimationFrame(() => {
                Array.from(buyerChips.children).forEach(c => c.classList.add('is-entering'));
                Array.from(sellerChips.children).forEach(c => c.classList.add('is-entering'));
            });
        };

        let collabTimers = [];
        const collabTimeout = (fn, ms) => { const id = window.setTimeout(fn, ms); collabTimers.push(id); return id; };
        const collabInterval = (fn, ms) => { const id = window.setInterval(fn, ms); collabTimers.push(id); return id; };

        const swapCollaboration = (stageName) => {
            if (!collaborationItems || motionQuery.matches) return;

            const items = journey.activities[stageName];
            if (!items) return;

            // Resolve stage type — allows custom journeys to map stage names to visual treatments
            const stageObj = journey.stages.find(s => s.name === stageName);
            const stageType = stageObj?.type || stageName;

            collabTimers.forEach(id => { window.clearTimeout(id); window.clearInterval(id); });
            collabTimers = [];

            collaborationItems.innerHTML = '';

            // Deploy stage shows three-row auto-scheduling flow
            if (stageType === 'Deploy' || stageName === 'Treatment' || stageName === 'Implementation') {
                const row1 = document.createElement('div');
                row1.className = 'collaboration-item deploy-gantt';
                const timeline1 = document.createElement('div');
                timeline1.className = 'deploy-gantt-timeline';
                const bar1 = document.createElement('div');
                bar1.className = 'deploy-gantt-bar deploy-bar-1';
                timeline1.appendChild(bar1);
                row1.appendChild(timeline1);
                collaborationItems.appendChild(row1);

                const row2 = document.createElement('div');
                row2.className = 'collaboration-item deploy-gantt';
                const timeline2 = document.createElement('div');
                timeline2.className = 'deploy-gantt-timeline';
                const bar2 = document.createElement('div');
                bar2.className = 'deploy-gantt-bar deploy-bar-2';
                timeline2.appendChild(bar2);
                row2.appendChild(timeline2);
                collaborationItems.appendChild(row2);

                const row3 = document.createElement('div');
                row3.className = 'collaboration-item deploy-gantt';
                const timeline3 = document.createElement('div');
                timeline3.className = 'deploy-gantt-timeline';
                const bar3 = document.createElement('div');
                bar3.className = 'deploy-gantt-bar deploy-bar-3';
                timeline3.appendChild(bar3);
                row3.appendChild(timeline3);
                collaborationItems.appendChild(row3);

                const bar3b = document.createElement('div');
                bar3b.className = 'deploy-gantt-bar deploy-bar-3-rescheduled';
                timeline2.appendChild(bar3b);

                const bar4 = document.createElement('div');
                bar4.className = 'deploy-gantt-bar deploy-bar-4';
                timeline3.appendChild(bar4);

                collabTimeout(() => bar1.classList.add('is-animating'), 400);
                collabTimeout(() => bar2.classList.add('is-animating'), 800);
                collabTimeout(() => bar3.classList.add('is-animating'), 1200);

                collabTimeout(() => bar2.classList.add('is-error'), 2000);
                collabTimeout(() => bar2.classList.add('is-collapsing'), 2300);

                collabTimeout(() => {
                    const textOverlay = document.createElement('div');
                    textOverlay.className = 'deploy-sequence-text deploy-text-overlay';
                    textOverlay.textContent = '(rescheduling...)';
                    row2.appendChild(textOverlay);
                    requestAnimationFrame(() => textOverlay.classList.add('is-visible'));

                    bar3.classList.add('is-collapsing');
                    collabTimeout(() => {
                        bar3b.classList.add('is-animating');
                    }, 400);

                    collabTimeout(() => {
                        textOverlay.classList.remove('is-visible');
                        collabTimeout(() => {
                            textOverlay.remove();
                            requestAnimationFrame(() => bar4.classList.add('is-animating'));
                        }, 250);
                    }, 1100);
                }, 2900);

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
                return;
            }

            // Scope/Proposal/Planning stage: toggles on incrementally, swaps options
            if (stageType === 'Scope' || stageName === 'Proposal' || stageName === 'Planning') {
                const toggleRows = [];
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item scope-toggle';

                    const toggle = document.createElement('div');
                    toggle.className = 'scope-toggle-switch';

                    const label = document.createElement('div');
                    label.className = 'scope-toggle-label';
                    label.textContent = itemText;

                    item.appendChild(toggle);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                    toggleRows.push({ item, toggle, label });
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });

                const swapSets = [
                    [['Custom Reporting', true], ['Security Pack', false], ['White-label', true]],
                    [['Migration Tools', true], ['SSO Integration', true], ['Priority Support', false]]
                ];

                const initialOn = [true, true, false];
                const STAGGER = 150;
                let t = 300;

                toggleRows.forEach((row, idx) => {
                    if (initialOn[idx]) {
                        collabTimeout(() => row.toggle.classList.add('is-on'), t + idx * STAGGER);
                    }
                });
                t += toggleRows.length * STAGGER + 500;

                swapSets.forEach((newSet) => {
                    toggleRows.forEach((row, idx) => {
                        collabTimeout(() => {
                            row.toggle.classList.remove('is-on');
                            row.label.classList.add('is-fading');
                        }, t + idx * STAGGER);
                    });
                    t += toggleRows.length * STAGGER + 300;

                    toggleRows.forEach((row, idx) => {
                        collabTimeout(() => {
                            row.label.textContent = newSet[idx][0];
                            row.label.classList.remove('is-fading');
                            if (newSet[idx][1]) {
                                row.toggle.classList.add('is-on');
                            }
                        }, t + idx * STAGGER);
                    });
                    t += toggleRows.length * STAGGER + 900;
                });

                return;
            }

            // Success/Monitoring/Certification stage shows issue resolution
            if (stageType === 'Success' || stageName === 'Monitoring' || stageName === 'Certification') {
                const roles = journey.roles[stageName] || { buyer: [], seller: [] };
                const sellerName = roles.seller[0] ? roles.seller[0].name.split(' ')[0] : 'Support';

                const resolutionTypes = [
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="22"/>
                        </svg>`,
                        text: 'Auto Solving',
                        className: 'auto-solve'
                    },
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                        </svg>`,
                        text: 'Synced with Desk',
                        className: 'sync'
                    },
                    {
                        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>`,
                        text: sellerName + ' responding',
                        className: 'team-respond'
                    }
                ];

                resolutionTypes.forEach((type, i) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item success-resolve';

                    const stateContainer = document.createElement('div');
                    stateContainer.className = 'success-state-container';

                    const bug = document.createElement('div');
                    bug.className = 'success-state success-bug is-visible';
                    bug.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m8 2 1.88 1.88"/>
                        <path d="M14.12 3.88 16 2"/>
                        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
                        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
                        <path d="M12 20v-9"/>
                        <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
                        <path d="M6 13H2"/>
                        <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
                        <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
                        <path d="M22 13h-4"/>
                        <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
                    </svg>
                    <span class="success-bug-text">${items[i]}</span>`;

                    const workingState = document.createElement('div');
                    workingState.className = 'success-state success-working-state';

                    const resolver = document.createElement('div');
                    resolver.className = `success-resolver ${type.className}`;
                    if (type.icon) {
                        resolver.innerHTML = type.icon;
                    }

                    const statusText = document.createElement('div');
                    statusText.className = 'success-status-text';
                    statusText.textContent = type.text;

                    workingState.appendChild(resolver);
                    workingState.appendChild(statusText);

                    const checkState = document.createElement('div');
                    checkState.className = 'success-state success-check-state';

                    const checkIcon = document.createElement('div');
                    checkIcon.className = 'success-check-icon';
                    checkIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>`;

                    const resolvedText = document.createElement('div');
                    resolvedText.className = 'success-resolved-text';
                    resolvedText.textContent = 'Resolved';

                    checkState.appendChild(checkIcon);
                    checkState.appendChild(resolvedText);

                    stateContainer.appendChild(bug);
                    stateContainer.appendChild(workingState);
                    stateContainer.appendChild(checkState);
                    item.appendChild(stateContainer);
                    collaborationItems.appendChild(item);

                    const baseDelay = i * 1600 + 600;

                    collabTimeout(() => {
                        bug.classList.remove('is-visible');
                        bug.classList.add('is-hidden');
                        workingState.classList.add('is-visible');
                    }, baseDelay + 800);

                    collabTimeout(() => {
                        workingState.classList.remove('is-visible');
                        workingState.classList.add('is-hidden');
                        checkState.classList.add('is-visible');
                    }, baseDelay + 2200);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
                return;
            }

            // Commit/Agreement stage: signature drawing
            if (stageType === 'Commit' || stageName === 'Agreement') {
                const roles = journey.roles[stageName] || { buyer: [], seller: [] };

                const docRow = document.createElement('div');
                docRow.className = 'collaboration-item commit-doc-row';
                docRow.innerHTML = `
                    <div class="commit-row-icon">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 2H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6z"/>
                            <polyline points="11 2 11 6 15 6"/>
                            <line x1="6" y1="10" x2="12" y2="10"/>
                            <line x1="6" y1="13" x2="12" y2="13"/>
                        </svg>
                    </div>
                    <span class="commit-row-label">Service Agreement</span>
                `;
                collaborationItems.appendChild(docRow);

                const sigPaths = [
                    'M4 14 C10 6, 18 4, 26 11 C34 18, 40 6, 50 10 C56 13, 58 5, 66 8 C74 11, 78 15, 84 9 C90 3, 96 7, 104 10 C108 11, 112 9, 116 10',
                    'M4 10 C12 16, 20 4, 30 12 C36 16, 42 8, 48 7 C54 6, 62 16, 70 11 C76 7, 80 4, 88 12 C94 17, 100 6, 108 9 L116 8'
                ];
                const signers = [
                    { name: roles.buyer[0]?.name || 'Client Lead', color: 'var(--purple)' },
                    { name: roles.seller[0]?.name || 'Service Lead', color: 'var(--blurple)' }
                ];

                signers.forEach((signer, idx) => {
                    const row = document.createElement('div');
                    row.className = 'collaboration-item commit-sig-row';
                    row.dataset.signerIndex = idx;

                    const initials = signer.name.split(' ').map(n => n[0]).join('');

                    const avatar = document.createElement('div');
                    avatar.className = 'commit-sig-avatar';
                    // --avatar-color driven by CSS [data-signer-index] on parent row
                    avatar.textContent = initials;
                    row.appendChild(avatar);

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'commit-row-label commit-signer-name';
                    nameSpan.textContent = signer.name;
                    row.appendChild(nameSpan);

                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.classList.add('commit-sig-overlay');
                    svg.setAttribute('viewBox', '0 0 120 20');
                    svg.setAttribute('preserveAspectRatio', 'none');
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.classList.add('commit-sig-path');
                    path.setAttribute('d', sigPaths[idx]);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', signer.color);
                    path.setAttribute('stroke-width', '1.5');
                    path.setAttribute('stroke-linecap', 'round');
                    path.setAttribute('stroke-linejoin', 'round');
                    path.setAttribute('pathLength', '1');
                    svg.appendChild(path);
                    row.appendChild(svg);

                    collaborationItems.appendChild(row);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });

                let signedCount = 0;
                const sigTimings = [1200, 3000];
                const SIG_DRAW_DURATION = 1000;

                sigTimings.forEach((delay, idx) => {
                    collabTimeout(() => {
                        const row = collaborationItems.querySelector(`.commit-sig-row[data-signer-index="${idx}"]`);
                        if (!row) return;
                        row.classList.add('is-signing');
                        const path = row.querySelector('.commit-sig-path');
                        if (path) path.classList.add('is-drawing');

                        collabTimeout(() => {
                            row.classList.add('is-signed');
                            signedCount++;

                            const avatar = row.querySelector('.commit-sig-avatar');
                            if (avatar) {
                                avatar.textContent = '✓';
                                avatar.classList.add('is-signed');
                            }

                            const sigPath = row.querySelector('.commit-sig-path');
                            if (sigPath) sigPath.classList.add('is-complete');

                            if (signedCount === 2) {
                                collabTimeout(() => {
                                    const icon = docRow.querySelector('.commit-row-icon');
                                    if (icon) {
                                        icon.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="4 10 8 14 16 6"/>
                                        </svg>`;
                                        icon.classList.add('is-complete');
                                    }
                                    const label = docRow.querySelector('.commit-row-label');
                                    if (label) {
                                        label.classList.add('is-fading');
                                        collabTimeout(() => {
                                            label.textContent = '2/2 signed!';
                                            label.classList.remove('is-fading');
                                            label.classList.add('is-complete');
                                        }, 300);
                                    }
                                }, 500);
                            }
                        }, SIG_DRAW_DURATION);
                    }, delay);
                });

                return;
            }

            // Experience stage shows meeting rows
            if (stageType === 'Experience') {
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item experience-meeting';

                    const icon = document.createElement('div');
                    icon.className = 'meeting-icon';
                    icon.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="12" height="11" rx="1"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="1" x2="5" y2="4"/><line x1="11" y1="1" x2="11" y2="4"/></svg>';

                    const label = document.createElement('span');
                    label.textContent = itemText;

                    item.appendChild(icon);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
            } else {
                // Discovery/Inspection/Assessment stage: questions with dots
                items.forEach((itemText) => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item discovery-item';

                    const dots = document.createElement('span');
                    dots.className = 'discovery-dots';
                    dots.textContent = '.';

                    const label = document.createElement('span');
                    label.className = 'discovery-label';
                    label.textContent = itemText;

                    item.appendChild(dots);
                    item.appendChild(label);
                    collaborationItems.appendChild(item);
                });

                requestAnimationFrame(() => {
                    Array.from(collaborationItems.children).forEach(c => c.classList.add('is-entering'));
                });
            }

            // Skip working/completed animations for custom visualizations
            if (stageType === 'Deploy' || stageName === 'Treatment' || stageName === 'Implementation' ||
                stageType === 'Scope' || stageName === 'Proposal' || stageName === 'Planning' ||
                stageType === 'Commit' || stageName === 'Agreement' ||
                stageType === 'Success' || stageName === 'Monitoring' || stageName === 'Certification') return;

            // Build activity messages from participants + agents for this stage
            const roles = journey.roles[stageName] || { buyer: [], seller: [] };
            const agents = (journey.agents[stageName] || []);
            const allPeople = [...roles.buyer, ...roles.seller];

            const buildMessages = (itemIndex) => {
                // Discovery/Inspection/Assessment gets custom activity messages
                if (stageName === 'Discovery' || stageName === 'Inspection' || stageName === 'Assessment') {
                    const buyer = allPeople[0];
                    const seller = allPeople[allPeople.length - 1];
                    const buyerFirst = buyer ? buyer.name.split(' ')[0] : 'User';
                    const sellerFirst = seller ? seller.name.split(' ')[0] : 'Rep';

                    if (itemIndex === 0) {
                        return [
                            buyerFirst + ' asking',
                            'Auto-filled'
                        ];
                    } else if (itemIndex === 1) {
                        return [
                            'AI processing',
                            'Field auto-filled'
                        ];
                    } else {
                        return [
                            buyerFirst + ' answering',
                            sellerFirst + ' updating'
                        ];
                    }
                }

                // Experience gets meeting-specific activity messages
                if (stageName === 'Experience') {
                    const seller = allPeople[allPeople.length - 1];
                    const sellerFirst = seller ? seller.name.split(' ')[0] : 'Rep';

                    if (itemIndex === 0) {
                        return [
                            sellerFirst + ' presenting',
                            'Screen sharing'
                        ];
                    } else if (itemIndex === 1) {
                        return [
                            'Live walkthrough',
                            'Architecture review'
                        ];
                    } else {
                        return [
                            'Security review',
                            'Compliance check'
                        ];
                    }
                }

                const msgs = [];
                const buyer = allPeople[itemIndex % allPeople.length];
                const agent = agents[itemIndex % agents.length];
                const seller = allPeople[(itemIndex + 2) % allPeople.length];
                if (buyer) msgs.push(buyer.name.split(' ')[0] + ' typing');
                if (agent) msgs.push(agent + ' working');
                if (seller && seller !== buyer) msgs.push(seller.name.split(' ')[0] + ' reviewing');
                return msgs;
            };

            // Stagger: working spinner + rotating activity → completed checkmark
            const collabItems = Array.from(collaborationItems.children);
            const WORK_DURATION = 1800;
            const interval = (STAGE_DURATION - WORK_DURATION) / (collabItems.length + 1);
            const MSG_ROTATE_INTERVAL = 800;

            collabItems.forEach((item, i) => {
                const workStart = interval * (i + 1);
                let rotateId = null;
                let dotsId = null;

                collabTimeout(() => {
                    item.classList.add('is-working');

                    // Discovery: animate typing dots (. → .. → ...)
                    const dotsEl = item.querySelector('.discovery-dots');
                    if (dotsEl) {
                        let dotCount = 1;
                        dotsId = collabInterval(() => {
                            dotCount = (dotCount % 3) + 1;
                            dotsEl.textContent = '.'.repeat(dotCount);
                        }, 400);
                    }

                    const messages = buildMessages(i);
                    let msgIndex = 0;

                    // Create activity container
                    const activity = document.createElement('div');
                    activity.className = 'collab-activity';
                    activity.innerHTML = '<span class="activity-text">' + messages[0] + '</span><span class="activity-dots"></span>';
                    item.appendChild(activity);
                    requestAnimationFrame(() => activity.classList.add('is-visible'));

                    // Rotate through messages
                    if (messages.length > 1) {
                        rotateId = collabInterval(() => {
                            msgIndex++;
                            if (msgIndex >= messages.length) {
                                window.clearInterval(rotateId);
                                rotateId = null;
                                return;
                            }
                            const text = activity.querySelector('.activity-text');
                            if (text) {
                                text.classList.add('is-swapping');
                                collabTimeout(() => {
                                    text.textContent = messages[msgIndex];
                                    text.classList.remove('is-swapping');
                                }, 150);
                            }
                        }, MSG_ROTATE_INTERVAL);
                    }
                }, workStart);

                collabTimeout(() => {
                    if (rotateId) window.clearInterval(rotateId);
                    if (dotsId) window.clearInterval(dotsId);
                    // Swap discovery dots to green check
                    const dotsEl = item.querySelector('.discovery-dots');
                    if (dotsEl) dotsEl.textContent = '✓';
                    // Replace question with answer
                    const labelEl = item.querySelector('.discovery-label');
                    const answers = DISCOVERY_ANSWERS[stageName];
                    if (labelEl && answers && answers[i]) {
                        labelEl.classList.add('is-fading');
                        collabTimeout(() => {
                            labelEl.textContent = answers[i];
                            labelEl.classList.remove('is-fading');
                            labelEl.classList.add('is-answered');
                        }, 200);
                    }
                    item.classList.remove('is-working');
                    item.classList.add('is-completed');
                    const activity = item.querySelector('.collab-activity');
                    if (activity) activity.remove();
                }, workStart + WORK_DURATION);
            });
        };

        const swapAgents = (stageName, stageIndex) => {
            if (!agentChips || motionQuery.matches) return;

            const agents = journey.agents[stageName];
            if (!agents) return;

            const intel = AGENT_INTELLIGENCE[stageIndex] || AGENT_INTELLIGENCE[0];
            const knowledgePct = Math.round(((stageIndex + 1) / journey.stages.length) * 100);

            agentChips.innerHTML = '';

            agents.forEach((agentName) => {
                const agent = document.createElement('div');
                agent.className = 'agent-chip';
                agent.title = agentName;

                const iconSvg = AGENT_ICONS[agentName];
                if (iconSvg) {
                    const iconWrap = document.createElement('span');
                    iconWrap.className = 'agent-chip-icon';
                    iconWrap.innerHTML = iconSvg;
                    agent.appendChild(iconWrap);
                }

                const label = document.createElement('span');
                label.className = 'agent-chip-label';
                label.textContent = agentName;

                const bar = document.createElement('div');
                bar.className = 'agent-knowledge-bar';
                const fill = document.createElement('div');
                fill.className = 'agent-knowledge-fill';
                bar.appendChild(fill);

                agent.appendChild(label);
                agent.appendChild(bar);

                agentChips.appendChild(agent);

                window.setTimeout(() => {
                    fill.dataset.barW = knowledgePct;
                }, 450);
            });

            // Intelligence status indicator
            const status = document.createElement('div');
            status.className = 'agent-intel-status';
            const sparkles = '✦'.repeat(intel.level);
            status.innerHTML = '<span class="intel-label">' + intel.label + '</span><span class="intel-sparkles">' + sparkles + '</span>';
            agentChips.appendChild(status);

            requestAnimationFrame(() => {
                Array.from(agentChips.children).forEach(c => c.classList.add('is-entering'));
            });
        };

        const triggerLeaveAnimations = () => {
            if (buyerChips && sellerChips && !motionQuery.matches) {
                Array.from(buyerChips.children).forEach(chip => { chip.classList.remove('is-entering'); chip.classList.add('is-leaving'); });
                Array.from(sellerChips.children).forEach(chip => { chip.classList.remove('is-entering'); chip.classList.add('is-leaving'); });
            }
            if (collaborationItems && !motionQuery.matches) {
                Array.from(collaborationItems.children).forEach(item => { item.classList.remove('is-entering'); item.classList.add('is-leaving'); });
            }
            if (agentChips && !motionQuery.matches) {
                Array.from(agentChips.children).forEach(agent => { agent.classList.remove('is-entering'); agent.classList.add('is-leaving'); });
            }
        };

        const swapStageText = (value, index) => {
            stageText.classList.add('is-transitioning');
            window.setTimeout(() => {
                stageText.textContent = `${value} Stage`;
                stageText.classList.remove('is-transitioning');
                if (stageCounter) {
                    stageCounter.textContent = `${index + 1} of ${journey.stages.length}`;
                }
                swapParticipants(value);
                swapCollaboration(value);
                swapAgents(value, index);
            }, TEXT_SWAP_DELAY);
        };

        const applyStage = (index) => {
            const stage = journey.stages[index];
            if (!stage) return;
            triggerLeaveAnimations();
            swapStageText(stage.name, index);
            updateProgress(stage.progress);
            setActiveNode(stage.name, index);
        };

        const startCycle = () => {
            if (cycleId !== null) {
                window.clearInterval(cycleId);
            }
            cycleId = window.setInterval(() => {
                currentIndex = (currentIndex + 1) % journey.stages.length;
                applyStage(currentIndex);
            }, STAGE_DURATION);
        };

        const stopCycle = () => {
            if (cycleId !== null) {
                window.clearInterval(cycleId);
                cycleId = null;
            }
        };

        applyStage(currentIndex);

        // Initialize first stage participants
        if (buyerChips && sellerChips) {
            const initialRoles = journey.roles[journey.stages[currentIndex].name];
            if (initialRoles) {
                let colorIndex = 0;
                initialRoles.buyer.forEach(role => {
                    const chip = createParticipantChip(role);
                    chip.setAttribute('data-color-index', colorIndex);
                    buyerChips.appendChild(chip);
                    colorIndex++;
                });
                initialRoles.seller.forEach(role => {
                    const chip = createParticipantChip(role);
                    chip.setAttribute('data-color-index', colorIndex);
                    sellerChips.appendChild(chip);
                    colorIndex++;
                });
            }
        }

        // Initialize first stage collaboration items
        if (collaborationItems) {
            const initialItems = journey.activities[journey.stages[currentIndex].name];
            if (initialItems) {
                initialItems.forEach(itemText => {
                    const item = document.createElement('div');
                    item.className = 'collaboration-item';
                    item.textContent = itemText;
                    collaborationItems.appendChild(item);
                });
            }
        }

        // Initialize first stage agents
        if (agentChips && !motionQuery.matches) {
            const initialAgents = journey.agents[journey.stages[currentIndex].name];
            if (initialAgents) {
                const intel = AGENT_INTELLIGENCE[currentIndex] || AGENT_INTELLIGENCE[0];
                const knowledgePct = Math.round(((currentIndex + 1) / journey.stages.length) * 100);

                initialAgents.forEach(agentName => {
                    const agent = document.createElement('div');
                    agent.className = 'agent-chip is-entering';
                    agent.title = agentName;

                    const iconSvg = AGENT_ICONS[agentName];
                    if (iconSvg) {
                        const iconWrap = document.createElement('span');
                        iconWrap.className = 'agent-chip-icon';
                        iconWrap.innerHTML = iconSvg;
                        agent.appendChild(iconWrap);
                    }

                    const label = document.createElement('span');
                    label.className = 'agent-chip-label';
                    label.textContent = agentName;

                    const bar = document.createElement('div');
                    bar.className = 'agent-knowledge-bar';
                    const fill = document.createElement('div');
                    fill.className = 'agent-knowledge-fill';
                    bar.appendChild(fill);

                    agent.appendChild(label);
                    agent.appendChild(bar);
                    agentChips.appendChild(agent);

                    window.setTimeout(() => {
                        fill.dataset.barW = knowledgePct;
                    }, 450);
                });

                const status = document.createElement('div');
                status.className = 'agent-intel-status is-entering';
                const sparkles = '✦'.repeat(intel.level);
                status.innerHTML = '<span class="intel-label">' + intel.label + '</span><span class="intel-sparkles">' + sparkles + '</span>';
                agentChips.appendChild(status);
            }
        }

        // Wire up navigation chevrons
        if (navPrev) {
            navPrev.addEventListener('click', () => {
                stopCycle();
                currentIndex = (currentIndex - 1 + journey.stages.length) % journey.stages.length;
                applyStage(currentIndex);
            });
        }

        if (navNext) {
            navNext.addEventListener('click', () => {
                stopCycle();
                currentIndex = (currentIndex + 1) % journey.stages.length;
                applyStage(currentIndex);
            });
        }

        // Wire up stage node clicks
        stageNodes.forEach((node) => {
            node.classList.add('is-clickable');
            node.addEventListener('click', () => {
                const nodeIndex = parseInt(node.dataset.stageIndex, 10);
                if (!isNaN(nodeIndex)) {
                    stopCycle();
                    currentIndex = nodeIndex;
                    applyStage(currentIndex);
                }
            });
        });

        // Use IntersectionObserver to start animation when scrolled into view
        let cycleStartTimeout = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !motionQuery.matches) {
                    cycleStartTimeout = setTimeout(startCycle, 300);
                } else {
                    clearTimeout(cycleStartTimeout);
                    stopCycle();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(stageCard);

        motionQuery.addEventListener('change', (event) => {
            if (event.matches) {
                stopCycle();
            } else {
                const rect = stageCard.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight && rect.bottom > 0;
                if (isInView) {
                    startCycle();
                }
            }
        });
    }

    // Wire up journey card clicks
    journeyCards.forEach(card => {
        card.addEventListener('click', () => {
            const journeyKey = card.dataset.journey;
            if (journeyKey) {
                switchJourney(journeyKey);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const journeyKey = card.dataset.journey;
                if (journeyKey) {
                    switchJourney(journeyKey);
                }
            }
        });
    });

    // Auto-start flow animation when section comes into view
    function startFlowOnScroll() {
        if (!navigateSection || typeof window.IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger flow animation for active journey
                    const activeViz = navigateSection.querySelector('.navigate-journey-viz.is-active');
                    if (activeViz) {
                        const completionArc = activeViz.querySelector('.navigator-ring-completion-arc');
                        if (completionArc) {
                            completionArc.classList.add('completion-arc-animated');
                        }
                    }
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(navigateSection);
    }

    // Initialize with first journey
    switchJourney('eda');
    startFlowOnScroll();

    /* ========== AI Ecosystem Section — Sliding Gallery + Auto-Rotate ========== */
    (() => {
        const pillars = document.querySelectorAll('.ai-eco-pillar');
        if (!pillars.length) return;

        const pillarOrder = ['motion', 'context', 'ai'];
        let autoRotateTimer = null;
        let userInteracted = false;

        // Clone agent rows for infinite scroll on each pillar
        pillars.forEach(pillar => {
            const agentList = pillar.querySelector('.ai-eco-pillar-agents');
            const track = pillar.querySelector('.ai-eco-pillar-agents-track');
            if (!agentList || !track) return;

            const items = track.querySelectorAll('.ai-eco-agent-row');
            items.forEach(item => track.appendChild(item.cloneNode(true)));
        });

        function checkOverflow() {
            pillars.forEach(pillar => {
                const agentList = pillar.querySelector('.ai-eco-pillar-agents');
                const track = pillar.querySelector('.ai-eco-pillar-agents-track');
                if (!agentList || !track) return;

                const overflows = track.scrollHeight > agentList.clientHeight;
                agentList.classList.toggle('is-scrolling', overflows && pillar.classList.contains('is-active'));
            });
        }

        function activatePillar(eco) {
            pillars.forEach(p => {
                const isActive = p.dataset.eco === eco;
                p.classList.toggle('is-active', isActive);
            });
            setTimeout(checkOverflow, 700);
        }

        function startAutoRotate() {
            if (autoRotateTimer) clearInterval(autoRotateTimer);
            autoRotateTimer = setInterval(() => {
                if (userInteracted) return;
                const currentActive = document.querySelector('.ai-eco-pillar.is-active');
                const currentEco = currentActive ? currentActive.dataset.eco : 'navigate';
                const idx = pillarOrder.indexOf(currentEco);
                const nextEco = pillarOrder[(idx + 1) % pillarOrder.length];
                activatePillar(nextEco);
            }, 5200);
        }

        function stopAutoRotate() {
            userInteracted = true;
            if (autoRotateTimer) {
                clearInterval(autoRotateTimer);
                autoRotateTimer = null;
            }
        }

        pillars.forEach(pillar => {
            pillar.addEventListener('click', () => {
                stopAutoRotate();
                activatePillar(pillar.dataset.eco);
            });
            pillar.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    stopAutoRotate();
                    activatePillar(pillar.dataset.eco);
                }
            });
        });

        // Activate first pillar on scroll into view, then auto-rotate
        const ecoSection = document.getElementById('ai-ecosystem');
        if (ecoSection) {
            const ecoObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activatePillar('motion');
                        startAutoRotate();
                        ecoObserver.unobserve(ecoSection);
                    }
                });
            }, { threshold: 0.3 });
            ecoObserver.observe(ecoSection);
        }
    })();

    /* ── ROI Section — Stat Counter & Testimonial Carousel ── */
    (function () {
        /* Testimonial rotation */
        const quotes = document.querySelectorAll('.roi-quote');
        const dots = document.querySelectorAll('.roi-dot');
        if (quotes.length < 2) return;

        let activeQ = 0;
        let autoTimer;

        function showQuote(idx) {
            quotes.forEach((q, i) => {
                q.classList.toggle('is-active', i === idx);
            });
            dots.forEach((d, i) => {
                d.classList.toggle('is-active', i === idx);
            });
            activeQ = idx;
        }

        function nextQuote() {
            showQuote((activeQ + 1) % quotes.length);
        }

        function startAuto() {
            autoTimer = setInterval(nextQuote, 8000);
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(autoTimer);
                showQuote(i);
                startAuto();
            });
        });

        /* Start auto-rotate when section is visible */
        const roiSection = document.getElementById('roi');
        if (roiSection) {
            const roiObs = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    startAuto();
                    roiObs.unobserve(roiSection);
                }
            }, { threshold: 0.3 });
            roiObs.observe(roiSection);
        }
    })();
})();

// =============================================================
// AI IN PRACTICE SECTION
// =============================================================

(function initAiInPracticeSection() {

    const STAGE_DURATION = 6000;
    const TYPEWRITER_SPEED = 38; // ms per character
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const AI_STAGES = [
        {
            key: 'discover',
            label: 'Discover',
            desc: 'Uncovering needs and qualifying intent',
            agents: [
                {
                    name: 'Smart Conversation',
                    recommend: 'buyer',
                    viz: 'chat',
                    chatMessages: [
                        { role: 'ai', text: 'What are your top priorities this quarter?' },
                        { role: 'user', text: 'Cost reduction in claims, HIPAA prep, vendor consolidation.' },
                        { role: 'ai', text: 'How urgent is the HIPAA audit timeline?', captured: 'Top Priorities' },
                        { role: 'user', text: 'Board review in 90 days \u2014 non-negotiable.' },
                        { role: 'ai', text: 'Who are the key decision-makers involved?', captured: 'Timeline' },
                        { role: 'user', text: 'VP Ops, Legal counsel, and our CTO.' },
                        { role: 'ai', text: 'Do you have a budget range in mind?', captured: 'Stakeholders' }
                    ],
                    footer: ['Conversational AI', 'Fills discovery fields']
                },
                {
                    name: 'Think & Sync',
                    recommend: 'seller',
                    viz: 'ingest',
                    ingestSources: [
                        { type: 'audio', label: 'Sales Call #4 \u2014 32 min' },
                        { type: 'doc', label: 'Discovery Brief.pdf' },
                        { type: 'email', label: 'RE: Timeline follow-up' }
                    ],
                    ingestResults: [
                        { field: 'Top Priorities', value: 'Cost reduction, HIPAA, vendor consolidation', status: 'approve' },
                        { field: 'Budget Range', value: '$200K\u2013350K annual', status: 'approve' },
                        { field: 'Decision Timeline', value: 'Q2 board review \u2014 90 days', status: 'deny' }
                    ],
                    footer: ['Multi-source ingest', 'Review & accept']
                }
            ]
        },
        {
            key: 'experience',
            label: 'Experience',
            desc: 'Preparing and delivering tailored experiences',
            agents: [
                {
                    name: 'Diligent Attendee',
                    recommend: 'buyer',
                    viz: 'document',
                    docSections: [
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Scope Alignment Review', content: 'Validate solution modules match your needs' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>', title: 'What This Meeting Is For', content: 'Review proposed scope against your discovery priorities' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>', title: '3 Outcomes to Prioritize', content: 'Budget alignment, module coverage, timeline confirmation' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>', title: 'Questions to Ask the Host', content: '\u201CHow does the Compliance Suite cover physical safeguards?\u201D' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', title: 'What to Listen For', content: 'Budget flexibility signals, implementation timeline hints' }
                    ],
                    footer: ['Guest prep', 'From discovery data']
                },
                {
                    name: 'Tailored Script',
                    recommend: 'seller',
                    viz: 'document',
                    docSections: [
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Scope Alignment Review \u2014 Call Plan', content: 'Lead with compliance gap \u2014 highest urgency signal' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>', title: 'Goals', content: 'Confirm module coverage, address budget holder silence' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', title: 'Agenda \u2014 3 Items', content: '1. Compliance gap review (15 min)\n2. Solution walkthrough (20 min)\n3. Next steps alignment (10 min)', sub: '\u2192 \u201CBoard review in 90 days\u201D \u2014 Discovery\n\u2192 Friction: Budget holder disengaged since Stage 2' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>', title: 'Action Items', content: 'Re-engage budget holder before pricing discussion' }
                    ],
                    footer: ['Host prep', 'Agenda + objections']
                }
            ]
        },
        {
            key: 'scope',
            label: 'Scope',
            desc: 'Mapping requirements to delivery modules',
            agents: [
                {
                    name: 'Solution-Needs Fit',
                    recommend: 'buyer',
                    viz: 'chat',
                    chatMessages: [
                        { role: 'user', text: 'Does the Compliance Suite cover our HIPAA needs?' },
                        { role: 'ai', text: 'It covers 4 of 5 requirements from discovery. Gap: physical safeguard auditing \u2014 that\u2019s an add-on module.', mapping: 'HIPAA Audit \u2194 Compliance Suite' },
                        { role: 'user', text: 'What\u2019s the cost of not including it?' },
                        { role: 'ai', text: 'With your 90-day deadline, skipping it means ~120 hrs of manual review. I\u2019d recommend including it.', mapping: 'Gap: Physical Safeguards add-on' },
                        { role: 'user', text: 'What about vendor consolidation?' },
                        { role: 'ai', text: '3 of your current vendors map directly to Integration Hub.', mapping: 'Vendor Consolidation \u2194 Integration Hub' }
                    ],
                    footer: ['Challenger Sale', 'Discovery \u2192 Scope']
                },
                {
                    name: 'Propose Scope',
                    recommend: 'seller',
                    viz: 'review',
                    step1: 'Customer profile extracted: 3 goals \u00b7 2 constraints \u00b7 1 red flag',
                    reviewCards: [
                        { field: 'Workflow Automation', value: 'Aligns with cost reduction priority', status: 'included', confidence: 96 },
                        { field: 'Compliance Suite', value: 'Directly maps to HIPAA audit goal', status: 'included', confidence: 88 },
                        { field: 'Integration Hub', value: 'Vendor consolidation mentioned but unclear', status: 'potential', confidence: 62 },
                        { field: 'Ad-hoc Reporting', value: 'No signal in discovery data', status: 'excluded', confidence: 34 }
                    ],
                    footer: ['Auto-classified', 'Review & accept']
                }
            ]
        },
        {
            key: 'commit',
            label: 'Commit',
            desc: 'Validating readiness and building the case',
            agents: [
                {
                    name: 'Why Commit?',
                    recommend: 'buyer',
                    viz: 'chat',
                    chatMessages: [
                        { role: 'user', text: 'What\u2019s the strongest case for my exec team?' },
                        { role: 'ai', text: 'Three data-backed arguments from your journey:\n1. 22% cost reduction in claims\n2. Audit readiness in 60 days\n3. $180K/yr saved on consolidation', valueCase: '3 data-backed arguments' },
                        { role: 'user', text: 'They\u2019ll ask about the risk of switching.' },
                        { role: 'ai', text: '2 vendors already at end-of-life. Risk of NOT switching: manual compliance in 90 days with a team at capacity.', valueCase: 'Objection: switching risk \u2192 cost of inaction' },
                        { role: 'user', text: 'And if we delay 30 days?' },
                        { role: 'ai', text: 'Compresses onboarding to 60 days. Puts the board review at risk. I\u2019d recommend moving now.' }
                    ],
                    footer: ['Buyer advocacy', 'Journey data-backed']
                },
                {
                    name: 'Execution Readiness',
                    recommend: 'seller',
                    viz: 'report',
                    reportSections: [
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>', title: 'Journey Progress', lines: ['\u2714 4 of 5 prior stages completed', '\u26A0 Experience stage incomplete \u2014 1 meeting remaining'] },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>', title: 'Strategic Alignment', lines: ['Discovery \u2194 Scope alignment: Strong', '3 of 4 included modules map to stated goals'] },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', title: 'Spin', lines: ['\u26A0 Conditional \u2014 81% confidence', '\u201CReady with caveat: complete remaining Experience meeting\u201D'], highlight: true },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>', title: 'Recommendation', lines: ['Complete Experience stage, then initiate close'] }
                    ],
                    footer: ['One-shot report', 'Verdict + confidence']
                }
            ]
        },
        {
            key: 'deploy',
            label: 'Deploy',
            desc: 'Tracking execution across all workstreams',
            agents: [
                {
                    name: 'AI Navigator',
                    recommend: 'buyer',
                    viz: 'gantt',
                    ganttMonths: ['Jan', 'Feb', 'Mar', 'Apr'],
                    ganttToday: 58,
                    ganttRows: [
                        { label: 'Onboarding', start: 0, end: 38, progress: 100, status: 'complete' },
                        { label: 'Data Migration', start: 18, end: 58, progress: 72, status: 'active' },
                        { label: 'Integration', start: 38, end: 80, progress: 45, status: 'warning' },
                        { label: 'Training', start: 58, end: 100, progress: 30, status: 'upcoming' }
                    ],
                    ganttGuidance: [
                        { level: 'warning', text: 'Integration has no assigned owner \u2014 at risk of slipping' },
                        { level: 'info', text: 'Data Migration on track to complete before Training begins' },
                        { level: 'action', text: 'Assign Integration owner to unblock downstream modules' }
                    ],
                    footer: ['Module timeline', 'Flags blockers']
                },
                {
                    name: 'Assign Owners',
                    recommend: 'seller',
                    viz: 'assignment',
                    assignCards: [
                        { module: 'Data Migration', moduleNum: 1, totalModules: 4, person: 'Sarah K.', reasoning: '3 prior migrations \u00b7 Host team', conflicts: '0 conflicts this period', matchType: 'Best historical match' },
                        { module: 'Integration Setup', moduleNum: 2, totalModules: 4, person: 'James R.', reasoning: '2 prior integrations \u00b7 Host team', conflicts: '1 conflict', matchType: '2 prior integrations' },
                        { module: 'Training Program', moduleNum: 3, totalModules: 4, person: 'Maria L.', reasoning: '4 prior trainings \u00b7 Guest team', conflicts: '0 conflicts', matchType: 'Lowest conflict score' }
                    ],
                    assignProgress: '3 of 4 modules assigned',
                    footer: ['ML-matched', 'Sequential assignment']
                }
            ]
        },
        {
            key: 'success',
            label: 'Success',
            desc: 'Measuring outcomes and resolving issues',
            agents: [
                {
                    name: 'Auto Solve',
                    recommend: 'buyer',
                    viz: 'chat',
                    chatMessages: [
                        { role: 'user', text: 'Integration is failing on the API endpoint.' },
                        { role: 'research', text: '\uD83D\uDD0D Classifying issue\u2026 \u2192 API Integration' },
                        { role: 'research', text: '\uD83D\uDCC2 Searching resolved tickets\u2026 3 matches found' },
                        { role: 'ai', text: 'Found a pattern from similar journeys. Root cause: auth token refresh set to 60m but your IdP expires at 30m.', captured: 'Source: Historical ticket match' },
                        { role: 'user', text: 'How do I fix it?' },
                        { role: 'ai', text: 'Set refresh to 25m in Settings \u2192 Auth \u2192 Token Policy. Config drafted for your review.', actionBtn: 'Raise as Ticket' }
                    ],
                    footer: ['Ticket search', 'Auto-research']
                },
                {
                    name: 'Cheat Sheet',
                    recommend: 'seller',
                    viz: 'dashboard',
                    dashSections: [
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>', title: 'Executive Summary', content: 'Deploy stage \u00b7 On track \u00b7 Due Mar 28' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Key Team: 4 members', content: 'Host: Sarah K. (PM) \u00b7 James R. (Eng Lead)' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>', title: 'Goals: 3 strategic', content: '\u25B8 Cost reduction \u2014 High\n\u25B8 Compliance readiness \u2014 High\n\u25B8 Vendor consolidation \u2014 Medium' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>', title: 'Health Signals', content: 'NPS 8.2 \u00b7 Sentiment 4.1/5 \u00b7 1 open ticket' },
                        { icon: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', title: 'Next Steps', content: 'Complete integration module \u00b7 Schedule training' }
                    ],
                    footer: ['One-page summary', 'Auto-generated']
                }
            ]
        }
    ];

    // ---- Stage Ring (Circular Navigator) ----

    const section = document.getElementById('ai-in-practice');
    if (!section) return;

    const stageNodes = section.querySelectorAll('.ai-stage-node');
    const cardsRoot = document.getElementById('ai-agent-cards-root');
    const stageContextName = document.getElementById('ai-stage-context-name');
    const stageContextDesc = document.getElementById('ai-stage-context-desc');
    // stageContext no longer toggled — ring center is always visible
    const toggleBtns = section.querySelectorAll('.ai-practice-toggle-btn');
    const journeyView = document.getElementById('ai-practice-journey');
    const crossView = document.getElementById('ai-practice-cross');

    let currentStageIndex = 0;
    let cycleTimer = null;
    let manualOverride = false;
    let activeTypewriter = null;
    let agentActionIndices = {};
    let sectionRevealed = false;

    function getStageNodes() {
        var nodeList = Array.from(stageNodes);
        var total = nodeList.length;
        return { nodeList, total };
    }

    // ---- Burst Effect ----

    function spawnNodeBurst(nodeEl) {
        if (REDUCED_MOTION) return;
        var dot = nodeEl.querySelector('.ai-stage-node-dot');
        if (!dot) return;
        var old = dot.querySelector('.ai-node-burst');
        if (old) old.remove();

        var burst = document.createElement('span');
        burst.className = 'ai-node-burst';
        burst.setAttribute('aria-hidden', 'true');
        dot.appendChild(burst);

        setTimeout(function() { burst.remove(); }, 700);
    }

    var trackFill = section.querySelector('.ai-ring-track-fill');
    var stageCounter = document.getElementById('ai-stage-counter');

    // Measure track endpoints once nodes are laid out
    function measureTrack() {
        var nodesWrap = section.querySelector('.ai-ring-nodes');
        var firstDot = stageNodes[0] && stageNodes[0].querySelector('.ai-stage-node-dot');
        var lastDot = stageNodes[stageNodes.length - 1] && stageNodes[stageNodes.length - 1].querySelector('.ai-stage-node-dot');
        var trackEl = section.querySelector('.ai-ring-track');
        if (!nodesWrap || !firstDot || !lastDot || !trackEl) return;
        var wrapRect = nodesWrap.getBoundingClientRect();
        var firstRect = firstDot.getBoundingClientRect();
        var lastRect = lastDot.getBoundingClientRect();
        var leftPx = (firstRect.left + firstRect.width / 2) - wrapRect.left;
        var rightPx = (lastRect.left + lastRect.width / 2) - wrapRect.left;
        trackEl.style.setProperty('--track-left', leftPx + 'px');
        trackEl.style.setProperty('--track-width', (rightPx - leftPx) + 'px');
    }

    function setActiveStage(idx, animate) {
        var prevIdx = currentStageIndex;
        var { nodeList, total } = getStageNodes();
        var stage = AI_STAGES[idx];

        nodeList.forEach(function(n, i) {
            n.classList.toggle('is-active', i === idx);
            n.classList.toggle('is-past', i < idx);
            n.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
        });

        // Fire burst on stage transition
        if (animate && prevIdx !== idx) {
            spawnNodeBurst(nodeList[idx]);
        }

        // Update ring-center context
        if (stageContextName) stageContextName.textContent = stage.label;
        if (stageContextDesc) stageContextDesc.textContent = stage.desc;

        // Update stage counter
        if (stageCounter) stageCounter.textContent = (idx + 1) + ' / ' + total;

        // Progress track fill
        if (trackFill) {
            var pct = total > 1 ? (idx / (total - 1)) * 100 : 0;
            trackFill.style.setProperty('width', pct + '%');
        }

        // Shift atmospheric glow toward active node
        var ring = section.querySelector('.ai-stage-ring');
        if (ring && nodeList[idx]) {
            var dot = nodeList[idx].querySelector('.ai-stage-node-dot');
            if (dot) {
                var ringRect = ring.getBoundingClientRect();
                var dotRect = dot.getBoundingClientRect();
                var glowX = ((dotRect.left + dotRect.width / 2 - ringRect.left) / ringRect.width) * 100;
                ring.style.setProperty('--glow-x', glowX + '%');
            }
        }

        currentStageIndex = idx;
        renderAgentCards(stage, animate);
    }

    // ---- Agent Cards ----

    function renderAgentCards(stageData, animate) {
        if (!cardsRoot) return;

        // Exit existing cards
        var existing = cardsRoot.querySelectorAll('.ai-agent-card');
        existing.forEach(function(card) {
            card.classList.add('is-exiting');
        });

        // Cancel any running typewriter
        if (activeTypewriter) {
            clearTimeout(activeTypewriter);
            activeTypewriter = null;
        }

        var delay = (existing.length > 0 && !REDUCED_MOTION) ? 350 : 0;

        setTimeout(function() {
            cardsRoot.innerHTML = '';

            var cards = [];
            stageData.agents.forEach(function(agent, i) {
                var card = buildAgentCard(agent);
                card.style.setProperty('--shimmer-delay', (i * 2.5) + 's');
                cardsRoot.appendChild(card);
                cards.push({ card: card, agent: agent });
            });

            if (REDUCED_MOTION) {
                cards.forEach(function(c) {
                    c.card.classList.add('is-visible');
                    animateViz(c.card, c.agent);
                });
                return;
            }

            // Both cards enter together
            cards.forEach(function(c, i) {
                setTimeout(function() {
                    c.card.classList.add('is-visible');
                }, i * 180);
            });

            // Focus buyer first, dim seller
            if (cards[0]) {
                cards[0].card.classList.add('is-focused');
            }
            if (cards[1]) {
                cards[1].card.classList.add('is-dimmed');
            }

            // Calculate buyer animation duration for handoff timing
            var buyerDuration = cards[0] ? getVizDuration(cards[0].agent) : 2000;
            var handoffDelay = 400 + buyerDuration + 600; // entrance + animation + pause

            // Buyer (first) animates immediately after entrance
            if (cards[0]) {
                setTimeout(function() {
                    animateViz(cards[0].card, cards[0].agent);
                }, 400);
            }

            // After buyer finishes, shift focus to seller
            if (cards[1]) {
                setTimeout(function() {
                    if (cards[0]) {
                        cards[0].card.classList.remove('is-focused');
                        cards[0].card.classList.add('is-dimmed');
                    }
                    cards[1].card.classList.remove('is-dimmed');
                    cards[1].card.classList.add('is-focused');
                    animateViz(cards[1].card, cards[1].agent);
                }, handoffDelay);
            }
        }, delay);
    }

    function buildAgentCard(agent) {
        var card = document.createElement('div');
        card.className = 'ai-agent-card';

        // Accent bar (left edge)
        var accent = document.createElement('span');
        accent.className = 'ai-agent-card-accent';
        accent.setAttribute('aria-hidden', 'true');

        // Shimmer track (ambient light sweep)
        var shimmer = document.createElement('div');
        shimmer.className = 'ai-agent-card-shimmer-track';
        shimmer.setAttribute('aria-hidden', 'true');

        var head = document.createElement('div');
        head.className = 'ai-agent-card-head';

        // Status dot with pulsing ring
        var dotWrap = document.createElement('span');
        dotWrap.className = 'ai-agent-status-dot-wrap';

        var dot = document.createElement('span');
        dot.className = 'ai-agent-status-dot';
        dot.setAttribute('aria-hidden', 'true');

        var ring = document.createElement('span');
        ring.className = 'ai-agent-status-ring';
        ring.setAttribute('aria-hidden', 'true');

        dotWrap.appendChild(dot);
        dotWrap.appendChild(ring);

        var name = document.createElement('span');
        name.className = 'ai-agent-card-name';
        name.textContent = agent.name;

        var badge = document.createElement('span');
        badge.className = 'ai-agent-card-badge' + (agent.recommend === 'buyer' ? ' ai-badge-buyer' : ' ai-badge-seller');
        badge.textContent = agent.recommend === 'buyer' ? 'For Buyers' : 'For Sellers';

        head.appendChild(dotWrap);
        head.appendChild(name);
        head.appendChild(badge);

        // Viz body — different per viz type
        var vizWrap = document.createElement('div');
        vizWrap.className = 'ai-agent-viz ai-agent-viz--' + (agent.viz || 'typewriter');

        if (agent.viz === 'checklist') {
            // Optional source indicator (e.g. audio recording, document, URL)
            if (agent.source) {
                var srcRow = document.createElement('div');
                srcRow.className = 'ai-viz-source';
                var srcIcon = document.createElement('span');
                srcIcon.className = 'ai-viz-source-icon';
                srcIcon.setAttribute('aria-hidden', 'true');
                if (agent.source.type === 'audio') {
                    srcIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>';
                } else if (agent.source.type === 'doc') {
                    srcIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
                } else {
                    srcIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
                }
                var srcLabel = document.createElement('span');
                srcLabel.className = 'ai-viz-source-label';
                srcLabel.textContent = agent.source.label;
                srcRow.appendChild(srcIcon);
                srcRow.appendChild(srcLabel);
                if (agent.source.type === 'audio') {
                    var srcWave = document.createElement('span');
                    srcWave.className = 'ai-viz-source-wave';
                    srcWave.setAttribute('aria-hidden', 'true');
                    for (var b = 0; b < 5; b++) {
                        var bar = document.createElement('span');
                        bar.className = 'ai-viz-wave-bar';
                        bar.style.setProperty('--wave-i', b);
                        srcWave.appendChild(bar);
                    }
                    srcRow.appendChild(srcWave);
                }
                vizWrap.appendChild(srcRow);
            }
            agent.checkItems.forEach(function(text) {
                var row = document.createElement('div');
                row.className = 'ai-viz-check-row';
                var icon = document.createElement('span');
                icon.className = 'ai-viz-check-icon';
                icon.setAttribute('aria-hidden', 'true');
                var lbl = document.createElement('span');
                lbl.className = 'ai-viz-check-text';
                lbl.textContent = text;
                row.appendChild(icon);
                row.appendChild(lbl);
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'bars') {
            agent.barItems.forEach(function(bar) {
                var row = document.createElement('div');
                row.className = 'ai-viz-bar-row' + (bar.owner ? ' ai-viz-bar-row--extended' : '');
                var lbl = document.createElement('span');
                lbl.className = 'ai-viz-bar-label';
                lbl.textContent = bar.label;
                row.appendChild(lbl);
                if (bar.owner) {
                    var ownerEl = document.createElement('span');
                    ownerEl.className = 'ai-viz-bar-owner';
                    ownerEl.textContent = bar.owner;
                    row.appendChild(ownerEl);
                }
                var track = document.createElement('div');
                track.className = 'ai-viz-bar-track';
                var fill = document.createElement('div');
                fill.className = 'ai-viz-bar-fill';
                fill.setAttribute('data-target', bar.value);
                track.appendChild(fill);
                var val = document.createElement('span');
                val.className = 'ai-viz-bar-val';
                val.textContent = '0%';
                val.setAttribute('data-target', bar.value);
                row.appendChild(track);
                row.appendChild(val);
                if (bar.status) {
                    var statusEl = document.createElement('span');
                    statusEl.className = 'ai-viz-bar-status';
                    statusEl.textContent = bar.status;
                    row.appendChild(statusEl);
                }
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'metrics') {
            agent.metricItems.forEach(function(m) {
                var block = document.createElement('div');
                block.className = 'ai-viz-metric-block';
                var num = document.createElement('span');
                num.className = 'ai-viz-metric-num';
                num.textContent = '0';
                num.setAttribute('data-target', m.value);
                num.setAttribute('data-unit', m.unit);
                var lbl = document.createElement('span');
                lbl.className = 'ai-viz-metric-label';
                lbl.textContent = m.label;
                block.appendChild(num);
                block.appendChild(lbl);
                vizWrap.appendChild(block);
            });
        } else if (agent.viz === 'chat') {
            agent.chatMessages.forEach(function(msg) {
                var bubble = document.createElement('div');
                bubble.className = 'ai-viz-chat-msg ai-viz-chat-' + msg.role;
                var text = document.createElement('span');
                text.className = 'ai-viz-chat-text';
                text.textContent = msg.text;
                bubble.appendChild(text);
                vizWrap.appendChild(bubble);
                // Captured indicator — shows data flowing into the journey record
                if (msg.captured) {
                    var cap = document.createElement('div');
                    cap.className = 'ai-viz-chat-msg ai-viz-chat-captured';
                    var capInner = document.createElement('span');
                    capInner.className = 'ai-viz-captured-tag';
                    capInner.textContent = '\u2192 Saved: \u201C' + msg.captured + '\u201D \u2713';
                    cap.appendChild(capInner);
                    vizWrap.appendChild(cap);
                }
                // Mapping indicator — Discovery↔Scope link
                if (msg.mapping) {
                    var mapEl = document.createElement('div');
                    mapEl.className = 'ai-viz-chat-msg ai-viz-chat-captured';
                    var mapInner = document.createElement('span');
                    mapInner.className = 'ai-viz-mapping-tag';
                    mapInner.textContent = '\u2192 ' + msg.mapping;
                    mapEl.appendChild(mapInner);
                    vizWrap.appendChild(mapEl);
                }
                // Value-case indicator — argument building
                if (msg.valueCase) {
                    var vcEl = document.createElement('div');
                    vcEl.className = 'ai-viz-chat-msg ai-viz-chat-captured';
                    var vcInner = document.createElement('span');
                    vcInner.className = 'ai-viz-valuecase-tag';
                    vcInner.textContent = '\u2192 ' + msg.valueCase;
                    vcEl.appendChild(vcInner);
                    vizWrap.appendChild(vcEl);
                }
                // Action button (e.g. "Raise as Ticket")
                if (msg.actionBtn) {
                    var btnEl = document.createElement('div');
                    btnEl.className = 'ai-viz-chat-msg ai-viz-chat-captured';
                    var btnInner = document.createElement('span');
                    btnInner.className = 'ai-viz-action-btn';
                    btnInner.textContent = '\uD83D\uDCCB ' + msg.actionBtn;
                    btnEl.appendChild(btnInner);
                    vizWrap.appendChild(btnEl);
                }
            });
        } else if (agent.viz === 'fieldCapture') {
            var captureHeader = document.createElement('div');
            captureHeader.className = 'ai-viz-capture-header';
            captureHeader.textContent = 'Discovery Fields';
            vizWrap.appendChild(captureHeader);
            agent.captureFields.forEach(function(field) {
                var row = document.createElement('div');
                row.className = 'ai-viz-capture-field';
                row.setAttribute('data-status', field.status);
                var labelRow = document.createElement('div');
                labelRow.className = 'ai-viz-capture-label';
                var labelText = document.createElement('span');
                labelText.textContent = field.label;
                var statusEl = document.createElement('span');
                statusEl.className = 'ai-viz-capture-status';
                statusEl.textContent = field.status === 'captured' ? '\u2713 Captured' : '\u25CB Awaiting';
                labelRow.appendChild(labelText);
                labelRow.appendChild(statusEl);
                row.appendChild(labelRow);
                if (field.value) {
                    var val = document.createElement('div');
                    val.className = 'ai-viz-capture-value';
                    val.textContent = field.value;
                    row.appendChild(val);
                } else {
                    var empty = document.createElement('div');
                    empty.className = 'ai-viz-capture-empty';
                    empty.textContent = 'Awaiting response\u2026';
                    row.appendChild(empty);
                }
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'document') {
            agent.docSections.forEach(function(sec) {
                var row = document.createElement('div');
                row.className = 'ai-viz-doc-section';
                var header = document.createElement('div');
                header.className = 'ai-viz-doc-header';
                if (sec.icon) {
                    var iconWrap = document.createElement('span');
                    iconWrap.className = 'ai-viz-sec-icon';
                    iconWrap.innerHTML = sec.icon;
                    header.appendChild(iconWrap);
                }
                header.appendChild(document.createTextNode(sec.title));
                var content = document.createElement('div');
                content.className = 'ai-viz-doc-content';
                content.textContent = sec.content;
                row.appendChild(header);
                row.appendChild(content);
                if (sec.sub) {
                    var subEl = document.createElement('div');
                    subEl.className = 'ai-viz-doc-sub';
                    subEl.textContent = sec.sub;
                    row.appendChild(subEl);
                }
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'ingest') {
            var icons = {
                audio: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>',
                doc: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
                url: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
                email: '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'
            };
            function makePhase(label) {
                var phase = document.createElement('div');
                phase.className = 'ai-viz-ingest-phase';
                var dot = document.createElement('span');
                dot.className = 'ai-viz-ingest-phase-dot';
                dot.setAttribute('aria-hidden', 'true');
                var lbl = document.createElement('div');
                lbl.className = 'ai-viz-ingest-phase-label';
                lbl.textContent = label;
                phase.appendChild(dot);
                phase.appendChild(lbl);
                return phase;
            }

            // Phase 1: Ingest
            var phase1 = makePhase('Ingest');
            var srcStrip = document.createElement('div');
            srcStrip.className = 'ai-viz-ingest-strip';
            agent.ingestSources.forEach(function(src) {
                var chip = document.createElement('span');
                chip.className = 'ai-viz-ingest-chip';
                var chipIcon = document.createElement('span');
                chipIcon.className = 'ai-viz-ingest-icon';
                chipIcon.setAttribute('aria-hidden', 'true');
                chipIcon.innerHTML = icons[src.type] || icons.doc;
                var chipLabel = document.createElement('span');
                chipLabel.className = 'ai-viz-ingest-chip-label';
                chipLabel.textContent = src.label;
                chip.appendChild(chipIcon);
                chip.appendChild(chipLabel);
                srcStrip.appendChild(chip);
            });
            phase1.appendChild(srcStrip);
            vizWrap.appendChild(phase1);

            // Phase 2: Extract
            var phase2 = makePhase('Extract');
            var processing = document.createElement('div');
            processing.className = 'ai-viz-ingest-processing';
            processing.textContent = 'Analyzing sources\u2026 extracting structured fields';
            phase2.appendChild(processing);
            vizWrap.appendChild(phase2);

            // Phase 3: Review
            var phase3 = makePhase('Review');
            agent.ingestResults.forEach(function(rc) {
                var card2 = document.createElement('div');
                card2.className = 'ai-viz-review-card';
                if (rc.status) card2.setAttribute('data-status', rc.status);
                var fieldEl = document.createElement('div');
                fieldEl.className = 'ai-viz-review-field';
                fieldEl.textContent = rc.field;
                var valEl = document.createElement('div');
                valEl.className = 'ai-viz-review-value';
                valEl.textContent = rc.value;
                var btns = document.createElement('div');
                btns.className = 'ai-viz-review-btns';
                var approveBtn = document.createElement('span');
                approveBtn.className = 'ai-viz-review-btn ai-viz-review-btn--approve';
                approveBtn.textContent = '\u2713 Approve';
                var denyBtn = document.createElement('span');
                denyBtn.className = 'ai-viz-review-btn ai-viz-review-btn--deny';
                denyBtn.textContent = '\u2717 Deny';
                btns.appendChild(approveBtn);
                btns.appendChild(denyBtn);
                card2.appendChild(fieldEl);
                card2.appendChild(valEl);
                card2.appendChild(btns);
                phase3.appendChild(card2);
            });
            vizWrap.appendChild(phase3);
        } else if (agent.viz === 'review') {
            // Optional source indicator (audio/doc/url)
            if (agent.source) {
                var srcRow = document.createElement('div');
                srcRow.className = 'ai-viz-source';
                var srcIcon = document.createElement('span');
                srcIcon.className = 'ai-viz-source-icon';
                srcIcon.setAttribute('aria-hidden', 'true');
                if (agent.source.type === 'audio') {
                    srcIcon.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>';
                }
                var srcLabel = document.createElement('span');
                srcLabel.className = 'ai-viz-source-label';
                srcLabel.textContent = agent.source.label;
                srcRow.appendChild(srcIcon);
                srcRow.appendChild(srcLabel);
                if (agent.source.type === 'audio') {
                    var srcWave = document.createElement('span');
                    srcWave.className = 'ai-viz-source-wave';
                    srcWave.setAttribute('aria-hidden', 'true');
                    for (var b = 0; b < 5; b++) {
                        var bar = document.createElement('span');
                        bar.className = 'ai-viz-wave-bar';
                        bar.style.setProperty('--wave-i', b);
                        srcWave.appendChild(bar);
                    }
                    srcRow.appendChild(srcWave);
                }
                vizWrap.appendChild(srcRow);
            }
            // Step 1 summary
            if (agent.step1) {
                var step1 = document.createElement('div');
                step1.className = 'ai-viz-review-step1';
                step1.textContent = agent.step1;
                vizWrap.appendChild(step1);
            }
            // Review cards
            agent.reviewCards.forEach(function(rc) {
                var card2 = document.createElement('div');
                card2.className = 'ai-viz-review-card';
                if (rc.status) card2.setAttribute('data-status', rc.status);
                var fieldEl = document.createElement('div');
                fieldEl.className = 'ai-viz-review-field';
                fieldEl.textContent = rc.field;
                if (rc.confidence) {
                    var confEl = document.createElement('span');
                    confEl.className = 'ai-viz-review-conf';
                    confEl.textContent = rc.confidence + '%';
                    fieldEl.appendChild(confEl);
                }
                var valEl = document.createElement('div');
                valEl.className = 'ai-viz-review-value';
                valEl.textContent = rc.value;
                var btns = document.createElement('div');
                btns.className = 'ai-viz-review-btns';
                var approveBtn = document.createElement('span');
                approveBtn.className = 'ai-viz-review-btn ai-viz-review-btn--approve';
                approveBtn.textContent = '\u2713 Approve';
                var denyBtn = document.createElement('span');
                denyBtn.className = 'ai-viz-review-btn ai-viz-review-btn--deny';
                denyBtn.textContent = '\u2717 Deny';
                btns.appendChild(approveBtn);
                btns.appendChild(denyBtn);
                card2.appendChild(fieldEl);
                card2.appendChild(valEl);
                card2.appendChild(btns);
                vizWrap.appendChild(card2);
            });
        } else if (agent.viz === 'report') {
            agent.reportSections.forEach(function(sec) {
                var row = document.createElement('div');
                row.className = 'ai-viz-report-section';
                if (sec.highlight) row.classList.add('ai-viz-report-highlight');
                var header = document.createElement('div');
                header.className = 'ai-viz-report-header';
                if (sec.icon) {
                    var iconWrap = document.createElement('span');
                    iconWrap.className = 'ai-viz-sec-icon';
                    iconWrap.innerHTML = sec.icon;
                    header.appendChild(iconWrap);
                }
                header.appendChild(document.createTextNode(sec.title));
                row.appendChild(header);
                sec.lines.forEach(function(line) {
                    var lineEl = document.createElement('div');
                    lineEl.className = 'ai-viz-report-line';
                    lineEl.textContent = line;
                    row.appendChild(lineEl);
                });
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'assignment') {
            agent.assignCards.forEach(function(ac) {
                var card2 = document.createElement('div');
                card2.className = 'ai-viz-assign-card';
                var modHeader = document.createElement('div');
                modHeader.className = 'ai-viz-assign-module';
                modHeader.textContent = 'Module ' + ac.moduleNum + ' of ' + ac.totalModules + ': ' + ac.module;
                var personRow = document.createElement('div');
                personRow.className = 'ai-viz-assign-person';
                personRow.textContent = '\u2605 ' + ac.person + ' \u2014 ' + ac.matchType;
                var detailRow = document.createElement('div');
                detailRow.className = 'ai-viz-assign-detail';
                detailRow.textContent = ac.reasoning + ' \u00b7 ' + ac.conflicts;
                var btns = document.createElement('div');
                btns.className = 'ai-viz-assign-btns';
                var btn1 = document.createElement('span');
                btn1.className = 'ai-viz-assign-btn';
                btn1.textContent = 'Assign Module';
                var btn2 = document.createElement('span');
                btn2.className = 'ai-viz-assign-btn ai-viz-assign-btn--alt';
                btn2.textContent = 'Assign Hierarchy';
                btns.appendChild(btn1);
                btns.appendChild(btn2);
                card2.appendChild(modHeader);
                card2.appendChild(personRow);
                card2.appendChild(detailRow);
                card2.appendChild(btns);
                vizWrap.appendChild(card2);
            });
            if (agent.assignProgress) {
                var prog = document.createElement('div');
                prog.className = 'ai-viz-assign-progress';
                prog.textContent = '\u2713 ' + agent.assignProgress;
                vizWrap.appendChild(prog);
            }
        } else if (agent.viz === 'dashboard') {
            agent.dashSections.forEach(function(sec) {
                var row = document.createElement('div');
                row.className = 'ai-viz-dash-section';
                var header = document.createElement('span');
                header.className = 'ai-viz-dash-header';
                if (sec.icon) {
                    var iconWrap = document.createElement('span');
                    iconWrap.className = 'ai-viz-sec-icon';
                    iconWrap.innerHTML = sec.icon;
                    header.appendChild(iconWrap);
                }
                header.appendChild(document.createTextNode(sec.title));
                var content = document.createElement('span');
                content.className = 'ai-viz-dash-content';
                content.textContent = sec.content;
                row.appendChild(header);
                row.appendChild(content);
                vizWrap.appendChild(row);
            });
        } else if (agent.viz === 'gantt') {
            // Month headers
            var ganttHeader = document.createElement('div');
            ganttHeader.className = 'ai-viz-gantt-header';
            (agent.ganttMonths || []).forEach(function(m) {
                var mo = document.createElement('span');
                mo.className = 'ai-viz-gantt-month';
                mo.textContent = m;
                ganttHeader.appendChild(mo);
            });
            vizWrap.appendChild(ganttHeader);

            // Body with today marker + rows
            var ganttBody = document.createElement('div');
            ganttBody.className = 'ai-viz-gantt-body';

            var todayLine = document.createElement('div');
            todayLine.className = 'ai-viz-gantt-today';
            // Position: label is 4rem + 0.35rem gap, today is pct of remaining track
            var pct = agent.ganttToday || 50;
            var labelOffset = 4.35; // rem
            todayLine.style.setProperty('left', 'calc(' + (labelOffset * (1 - pct / 100)).toFixed(3) + 'rem + ' + pct + '%)');
            ganttBody.appendChild(todayLine);

            (agent.ganttRows || []).forEach(function(row) {
                var rowEl = document.createElement('div');
                rowEl.className = 'ai-viz-gantt-row';

                var label = document.createElement('div');
                label.className = 'ai-viz-gantt-label';
                label.textContent = row.label;

                var track = document.createElement('div');
                track.className = 'ai-viz-gantt-track';

                var bar = document.createElement('div');
                bar.className = 'ai-viz-gantt-bar';
                if (row.status) bar.setAttribute('data-status', row.status);
                bar.style.setProperty('--gantt-left', row.start + '%');
                bar.style.setProperty('--gantt-width', (row.end - row.start) + '%');

                var fill = document.createElement('div');
                fill.className = 'ai-viz-gantt-fill';
                fill.style.setProperty('--gantt-progress', row.progress + '%');

                bar.appendChild(fill);
                track.appendChild(bar);
                rowEl.appendChild(label);
                rowEl.appendChild(track);
                ganttBody.appendChild(rowEl);
            });

            vizWrap.appendChild(ganttBody);

            // AI guidance callouts
            if (agent.ganttGuidance && agent.ganttGuidance.length) {
                var guidanceWrap = document.createElement('div');
                guidanceWrap.className = 'ai-viz-gantt-guidance';
                agent.ganttGuidance.forEach(function(g) {
                    var line = document.createElement('div');
                    line.className = 'ai-viz-gantt-guidance-line';
                    if (g.level) line.setAttribute('data-level', g.level);
                    var icon = document.createElement('span');
                    icon.className = 'ai-viz-gantt-guidance-icon';
                    icon.setAttribute('aria-hidden', 'true');
                    if (g.level === 'warning') {
                        icon.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
                    } else if (g.level === 'action') {
                        icon.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
                    } else {
                        icon.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
                    }
                    var txt = document.createElement('span');
                    txt.className = 'ai-viz-gantt-guidance-text';
                    txt.textContent = g.text;
                    line.appendChild(icon);
                    line.appendChild(txt);
                    guidanceWrap.appendChild(line);
                });
                vizWrap.appendChild(guidanceWrap);
            }
        } else {
            // Default: typewriter
            var body = document.createElement('p');
            body.className = 'ai-agent-card-body';
            var cursor = document.createElement('span');
            cursor.className = 'ai-agent-card-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            vizWrap.appendChild(body);
            card._cursor = cursor;
            card._body = body;
        }

        // Footer tags
        var footer = document.createElement('div');
        footer.className = 'ai-agent-card-footer';
        if (agent.footer && agent.footer.length) {
            agent.footer.forEach(function(item) {
                var tag = document.createElement('span');
                tag.className = 'ai-agent-card-tag';
                tag.textContent = item;
                footer.appendChild(tag);
            });
        }

        // Data attribute for buyer/seller CSS differentiation
        card.setAttribute('data-recommend', agent.recommend || 'seller');

        card.appendChild(accent);
        card.appendChild(shimmer);
        card.appendChild(head);
        card.appendChild(vizWrap);
        card.appendChild(footer);

        card._vizWrap = vizWrap;

        return card;
    }

    // ---- Viz Duration Calculator ----

    function getVizDuration(agent) {
        var viz = agent.viz || 'typewriter';
        // Returns total ms from first setTimeout to last element fully transitioned.
        // Formula: (count - 1) * interval + transitionTime
        var T = 500; // CSS transition settle time
        if (viz === 'checklist') { var n = agent.checklist ? agent.checklist.length : 4; return (n - 1) * 500 + T; }
        if (viz === 'bars') { var n = agent.barRows ? agent.barRows.length : 4; return (n - 1) * 200 + 800 + T; } // 800 = number counter
        if (viz === 'metrics') { var n = agent.metrics ? agent.metrics.length : 3; return (n - 1) * 300 + 1200; }
        if (viz === 'chat') {
            var n = 0;
            if (agent.chatMessages) {
                agent.chatMessages.forEach(function(m) {
                    n++; // the message itself
                    if (m.captured) n++;
                    if (m.mapping) n++;
                    if (m.valueCase) n++;
                    if (m.actionBtn) n++;
                    if (m.role === 'research') n++;
                });
            }
            if (n === 0) n = 4;
            return (n - 1) * 600 + T;
        }
        if (viz === 'fieldCapture') { var n = agent.captureFields ? agent.captureFields.length : 4; return (n - 1) * 450 + T; }
        if (viz === 'ingest') {
            var chips = agent.ingestSources ? agent.ingestSources.length : 3;
            var results = agent.ingestResults ? agent.ingestResults.length : 3;
            return chips * 400 + 300 + 800 + (results - 1) * 500 + T;
        }
        if (viz === 'document') { var n = agent.docSections ? agent.docSections.length : 4; return (n - 1) * 650 + T; }
        if (viz === 'review') {
            var base = agent.source ? 200 : 0; // source appears immediately
            base += agent.step1 ? 800 : 0;
            var n = agent.reviewCards ? agent.reviewCards.length : 3;
            return base + (n - 1) * 500 + T;
        }
        if (viz === 'report') { var n = agent.reportSections ? agent.reportSections.length : 4; return (n - 1) * 500 + T; }
        if (viz === 'assignment') {
            var n = agent.assignCards ? agent.assignCards.length : 3;
            return (n - 1) * 600 + 300 + T; // 300 = progress footer delay after last card
        }
        if (viz === 'dashboard') { var n = agent.dashSections ? agent.dashSections.length : 5; return (n - 1) * 250 + T; }
        if (viz === 'gantt') {
            var rows = agent.ganttRows ? agent.ganttRows.length : 4;
            var gLines = agent.ganttGuidance ? agent.ganttGuidance.length : 0;
            // rows stagger(350) + todayDelay(200) + todayAnim(600) + fills stagger(250) + guidanceGap(300) + guidance stagger(400) + settle
            return rows * 350 + 200 + 600 + rows * 250 + 300 + (gLines > 0 ? (gLines - 1) * 400 : 0) + T;
        }
        return 3000;
    }

    // ---- Viz Animations ----

    function animateViz(card, agent) {
        if (!document.contains(card)) return;
        var viz = agent.viz || 'typewriter';

        if (viz === 'checklist') {
            animateChecklist(card);
        } else if (viz === 'bars') {
            animateBars(card);
        } else if (viz === 'metrics') {
            animateMetrics(card);
        } else if (viz === 'chat') {
            animateChat(card);
        } else if (viz === 'fieldCapture') {
            animateFieldCapture(card);
        } else if (viz === 'ingest') {
            animateIngest(card);
        } else if (viz === 'document') {
            animateDocument(card);
        } else if (viz === 'review') {
            animateReview(card);
        } else if (viz === 'report') {
            animateReport(card);
        } else if (viz === 'assignment') {
            animateAssignment(card);
        } else if (viz === 'dashboard') {
            animateDashboard(card);
        } else if (viz === 'gantt') {
            animateGantt(card);
        } else {
            startTypewriter(card, agent);
        }
    }

    // Smooth auto-scroll: keeps latest animated element visible
    function autoScroll(card, el) {
        var viz = card._vizWrap;
        if (!viz) return;
        if (el) {
            var vizRect = viz.getBoundingClientRect();
            var elRect = el.getBoundingClientRect();
            var elBottom = elRect.bottom - vizRect.top + viz.scrollTop;
            var target = elBottom - viz.clientHeight + 8;
            if (target > viz.scrollTop) {
                viz.scrollTo({ top: target, behavior: 'smooth' });
            }
        } else {
            viz.scrollTo({ top: viz.scrollHeight, behavior: 'smooth' });
        }
    }

    function animateChecklist(card) {
        var rows = card._vizWrap.querySelectorAll('.ai-viz-check-row');
        rows.forEach(function(row, i) {
            if (REDUCED_MOTION) {
                row.classList.add('is-checked');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                row.classList.add('is-checked');
                autoScroll(card, row);
            }, i * 500);
        });
    }

    function animateBars(card) {
        var fills = card._vizWrap.querySelectorAll('.ai-viz-bar-fill');
        var vals = card._vizWrap.querySelectorAll('.ai-viz-bar-val');
        fills.forEach(function(fill, i) {
            var target = parseInt(fill.getAttribute('data-target'), 10);
            if (REDUCED_MOTION) {
                fill.style.setProperty('width', target + '%');
                if (vals[i]) vals[i].textContent = target + '%';
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                fill.style.setProperty('width', target + '%');
                animateNumber(vals[i], 0, target, '%', 800);
                autoScroll(card, fill.closest('.ai-viz-bar-row'));
            }, i * 200);
        });
    }

    function animateMetrics(card) {
        var nums = card._vizWrap.querySelectorAll('.ai-viz-metric-num');
        nums.forEach(function(num, i) {
            var target = parseFloat(num.getAttribute('data-target'));
            var unit = num.getAttribute('data-unit') || '';
            if (REDUCED_MOTION) {
                num.textContent = formatMetricVal(target) + unit;
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                animateNumber(num, 0, target, unit, 1200);
            }, i * 300);
        });
    }

    function animateChat(card) {
        var msgs = card._vizWrap.querySelectorAll('.ai-viz-chat-msg');
        msgs.forEach(function(msg, i) {
            if (REDUCED_MOTION) {
                msg.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                msg.classList.add('is-visible');
                autoScroll(card, msg);
            }, i * 600);
        });
    }

    function animateFieldCapture(card) {
        var fields = card._vizWrap.querySelectorAll('.ai-viz-capture-field');
        fields.forEach(function(field, i) {
            if (REDUCED_MOTION) {
                field.classList.add('is-captured');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                field.classList.add('is-captured');
                autoScroll(card, field);
            }, i * 450);
        });
    }

    function animateIngest(card) {
        var phases = card._vizWrap.querySelectorAll('.ai-viz-ingest-phase');
        var chips = card._vizWrap.querySelectorAll('.ai-viz-ingest-chip');
        var processing = card._vizWrap.querySelector('.ai-viz-ingest-processing');
        var reviewCards = card._vizWrap.querySelectorAll('.ai-viz-review-card');

        if (REDUCED_MOTION) {
            phases.forEach(function(p) { p.classList.add('is-active'); });
            chips.forEach(function(c) { c.classList.add('is-visible'); });
            if (processing) processing.classList.add('is-visible');
            reviewCards.forEach(function(c) { c.classList.add('is-visible'); });
            return;
        }

        // Phase 1: Activate Ingest phase, chips appear one by one
        if (phases[0]) phases[0].classList.add('is-active');
        chips.forEach(function(chip, i) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                chip.classList.add('is-visible');
                autoScroll(card, chip);
            }, i * 400);
        });

        // Phase 2: Activate Extract phase, show processing text
        var phase2Start = chips.length * 400 + 300;
        activeTypewriter = setTimeout(function() {
            if (!document.contains(card)) return;
            if (phases[1]) phases[1].classList.add('is-active');
            if (processing) {
                processing.classList.add('is-visible');
                autoScroll(card, processing);
            }
        }, phase2Start);

        // Phase 3: Activate Review phase, show review cards one by one
        var phase3Start = phase2Start + 800;
        activeTypewriter = setTimeout(function() {
            if (!document.contains(card)) return;
            if (phases[2]) phases[2].classList.add('is-active');
        }, phase3Start);
        reviewCards.forEach(function(c, i) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                c.classList.add('is-visible');
                autoScroll(card, c);
            }, phase3Start + i * 500);
        });
    }

    function animateDocument(card) {
        var sections = card._vizWrap.querySelectorAll('.ai-viz-doc-section');
        sections.forEach(function(sec, i) {
            if (REDUCED_MOTION) {
                sec.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                sec.classList.add('is-visible');
                autoScroll(card, sec);
            }, i * 650);
        });
    }

    function animateReview(card) {
        var step1 = card._vizWrap.querySelector('.ai-viz-review-step1');
        var cards = card._vizWrap.querySelectorAll('.ai-viz-review-card');
        var source = card._vizWrap.querySelector('.ai-viz-source');
        var baseDelay = 0;
        if (source) {
            if (!REDUCED_MOTION) {
                source.classList.add('is-visible');
            }
        }
        if (step1) {
            if (REDUCED_MOTION) {
                step1.classList.add('is-visible');
            } else {
                activeTypewriter = setTimeout(function() {
                    if (!document.contains(card)) return;
                    step1.classList.add('is-visible');
                }, 400);
                baseDelay = 800;
            }
        }
        cards.forEach(function(c, i) {
            if (REDUCED_MOTION) {
                c.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                c.classList.add('is-visible');
                autoScroll(card, c);
            }, baseDelay + i * 500);
        });
    }

    function animateReport(card) {
        var sections = card._vizWrap.querySelectorAll('.ai-viz-report-section');
        sections.forEach(function(sec, i) {
            if (REDUCED_MOTION) {
                sec.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                sec.classList.add('is-visible');
                autoScroll(card, sec);
            }, i * 500);
        });
    }

    function animateAssignment(card) {
        var cards = card._vizWrap.querySelectorAll('.ai-viz-assign-card');
        var prog = card._vizWrap.querySelector('.ai-viz-assign-progress');
        cards.forEach(function(c, i) {
            if (REDUCED_MOTION) {
                c.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                c.classList.add('is-visible');
                autoScroll(card, c);
            }, i * 600);
        });
        if (prog) {
            if (REDUCED_MOTION) {
                prog.classList.add('is-visible');
            } else {
                activeTypewriter = setTimeout(function() {
                    if (!document.contains(card)) return;
                    prog.classList.add('is-visible');
                    autoScroll(card, prog);
                }, cards.length * 600 + 300);
            }
        }
    }

    function animateDashboard(card) {
        var sections = card._vizWrap.querySelectorAll('.ai-viz-dash-section');
        sections.forEach(function(sec, i) {
            if (REDUCED_MOTION) {
                sec.classList.add('is-visible');
                return;
            }
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                sec.classList.add('is-visible');
                autoScroll(card, sec);
            }, i * 250);
        });
    }

    function animateGantt(card) {
        var rows = card._vizWrap.querySelectorAll('.ai-viz-gantt-row');
        var todayLine = card._vizWrap.querySelector('.ai-viz-gantt-today');
        var fills = card._vizWrap.querySelectorAll('.ai-viz-gantt-fill');
        var guidance = card._vizWrap.querySelectorAll('.ai-viz-gantt-guidance-line');

        if (REDUCED_MOTION) {
            rows.forEach(function(r) { r.classList.add('is-visible'); });
            if (todayLine) todayLine.classList.add('is-visible');
            fills.forEach(function(f) { f.classList.add('is-filled'); });
            guidance.forEach(function(g) { g.classList.add('is-visible'); });
            return;
        }

        // Rows appear one by one
        rows.forEach(function(row, i) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                row.classList.add('is-visible');
                autoScroll(card, row);
            }, i * 350);
        });

        // Today line sweeps in after rows
        var todayDelay = rows.length * 350 + 200;
        if (todayLine) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                todayLine.classList.add('is-visible');
            }, todayDelay);
        }

        // Progress fills animate after today line settles
        var fillDelay = todayDelay + 600;
        fills.forEach(function(f, i) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                f.classList.add('is-filled');
            }, fillDelay + i * 250);
        });

        // AI guidance lines appear after fills
        var guidanceStart = fillDelay + fills.length * 250 + 300;
        guidance.forEach(function(g, i) {
            activeTypewriter = setTimeout(function() {
                if (!document.contains(card)) return;
                g.classList.add('is-visible');
                autoScroll(card, g);
            }, guidanceStart + i * 400);
        });
    }

    function animateNumber(el, from, to, unit, duration) {
        if (!el) return;
        var start = performance.now();
        var isFloat = to % 1 !== 0;
        function tick(now) {
            if (!document.contains(el)) return;
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = from + (to - from) * eased;
            el.textContent = formatMetricVal(isFloat ? current : Math.round(current)) + unit;
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    function formatMetricVal(v) {
        if (v % 1 !== 0) return v.toFixed(1);
        return String(v);
    }

    function startTypewriter(card, agent) {
        if (!card._body) return;
        if (REDUCED_MOTION) {
            card._body.textContent = agent.actions[0];
            return;
        }

        const key = agent.name;
        if (!agentActionIndices[key]) agentActionIndices[key] = 0;

        function typeAction(actionText, onDone) {
            let charIdx = 0;
            card._body.textContent = '';
            card._body.appendChild(card._cursor);

            function tick() {
                if (!document.contains(card)) return;
                if (charIdx < actionText.length) {
                    const textNode = document.createTextNode(actionText[charIdx]);
                    card._body.insertBefore(textNode, card._cursor);
                    charIdx++;
                    activeTypewriter = setTimeout(tick, TYPEWRITER_SPEED);
                } else {
                    activeTypewriter = setTimeout(onDone, 2200);
                }
            }
            tick();
        }

        function cycleActions() {
            if (!document.contains(card)) return;
            const actions = agent.actions;
            const idx = agentActionIndices[key] % actions.length;
            agentActionIndices[key]++;
            typeAction(actions[idx], cycleActions);
        }

        cycleActions();
    }

    // ---- Auto-cycle ----

    function getStageDuration(stageData) {
        var agents = stageData.agents;
        var d0 = agents[0] ? getVizDuration(agents[0]) : 0;
        var d1 = agents[1] ? getVizDuration(agents[1]) : 0;
        // entrance(400) + buyer anim + pause(600) + seller anim + hold(1200)
        return 400 + d0 + 600 + d1 + 1200;
    }

    function startCycle() {
        if (cycleTimer) clearTimeout(cycleTimer);
        function scheduleNext() {
            var duration = getStageDuration(AI_STAGES[currentStageIndex]);
            cycleTimer = setTimeout(function() {
                if (manualOverride) { scheduleNext(); return; }
                var nextIdx = (currentStageIndex + 1) % AI_STAGES.length;
                setActiveStage(nextIdx, true);
                scheduleNext();
            }, duration);
        }
        scheduleNext();
    }

    stageNodes.forEach(function(node, i) {
        node.addEventListener('click', function() {
            manualOverride = true;
            setActiveStage(i, true);
            // Resume auto after 12s of inactivity
            clearTimeout(cycleTimer);
            cycleTimer = setTimeout(function() {
                manualOverride = false;
                startCycle();
            }, 12000);
        });

        node.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                node.click();
            }
        });
    });

    // ---- Integration tag click-to-describe ----

    (function() {
        var intTags = document.getElementById('meets-int-tags');
        var intDesc = document.getElementById('meets-int-desc');
        if (!intTags || !intDesc) return;

        var tags = intTags.querySelectorAll('.meets-tag--int');
        tags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                if (tag.classList.contains('is-active')) return;
                tags.forEach(function(t) { t.classList.remove('is-active'); });
                tag.classList.add('is-active');
                var name = tag.textContent;
                var desc = tag.getAttribute('data-int-desc') || '';
                // Crossfade: fade out, swap, fade in
                intDesc.style.setProperty('opacity', '0');
                setTimeout(function() {
                    intDesc.innerHTML = '<span>' + name + '</span> \u2014 ' + desc;
                    intDesc.style.setProperty('opacity', '1');
                }, 200);
            });
        });

        // Default: highlight Salesforce
        var defaultTag = intTags.querySelector('[data-int-desc*="opportunities"]');
        if (defaultTag) defaultTag.classList.add('is-active');
    })();

    // ---- Cross Journey View (Carousel) ----

    var crossTimers = [];
    var explorerCycleTimer = null;
    var explorerCycleIndex = 0;
    var ai360CycleTimer = null;
    var ai360CycleIndex = 0;
    var successCycleTimer = null;
    var successCycleIndex = 0;

    var AI360_EXCHANGES = [
        {
            question: 'How are my journeys doing?',
            insight: 'Win rate sits at <strong>68%</strong> across 24 active journeys. 3 need attention\u20142 stalled in Scope, 1 at risk in Commit.',
            bars: [
                { w: 150, label: '18 On Track', color: 'pos' },
                { w: 60, label: '3 At Risk', color: 'warn' },
                { w: 40, label: '3 Stalled', color: 'neg' }
            ],
            actions: ['View At-Risk', 'Deep Dive'],
            predict: {
                name: 'Acme Corp', template: 'Enterprise Channel',
                pct: 84, pctLabel: '84% Success', duration: '\u223C28 days to close',
                shap: [
                    { name: 'Discovery', pct: 72, dir: 'pos', label: '+34%' },
                    { name: 'Engagement', pct: 54, dir: 'pos', label: '+22%' },
                    { name: 'Stall time', pct: 22, dir: 'neg', label: '\u22129%' }
                ],
                trust: 'Strong Signal \u00b7 6-dimension trust score'
            }
        },
        {
            question: 'Where are we losing deals?',
            insight: '<strong>4 journeys</strong> lost this quarter. Common pattern: stalls after Scope with no follow-up for 10+ days.',
            bars: [
                { w: 120, label: 'Post-Scope stall', color: 'neg' },
                { w: 80, label: 'No champion', color: 'warn' },
                { w: 50, label: 'Pricing gap', color: 'warn' }
            ],
            actions: ['Review Losses', 'Coach Me'],
            predict: {
                name: 'NovaTech', template: 'Mid-Market',
                pct: 41, pctLabel: '41% Success', duration: '\u223C45 days to close',
                shap: [
                    { name: 'Champion access', pct: 18, dir: 'neg', label: '\u221218%' },
                    { name: 'Stage velocity', pct: 35, dir: 'neg', label: '\u221212%' },
                    { name: 'Buyer activity', pct: 60, dir: 'pos', label: '+15%' }
                ],
                trust: 'Weak Signal \u00b7 3/6 dimensions met'
            }
        },
        {
            question: 'What needs my attention today?',
            insight: '<strong>2 blockers</strong> flagged: Meridian contract awaiting legal (5 days), Apex meeting overdue by 3 days. Both in Commit stage.',
            bars: [
                { w: 160, label: '6 On Track', color: 'pos' },
                { w: 90, label: '2 Blocked', color: 'neg' },
                { w: 45, label: '1 Overdue', color: 'warn' }
            ],
            actions: ['View Blockers', 'Send Nudge'],
            predict: {
                name: 'Meridian Health', template: 'Enterprise Channel',
                pct: 72, pctLabel: '72% Success', duration: '\u223C14 days to close',
                shap: [
                    { name: 'Legal review', pct: 15, dir: 'neg', label: '\u221220%' },
                    { name: 'Sponsor engaged', pct: 68, dir: 'pos', label: '+28%' },
                    { name: 'Multi-thread', pct: 55, dir: 'pos', label: '+18%' }
                ],
                trust: 'Moderate \u00b7 5/6 dimensions met'
            }
        },
        {
            question: 'Compare Q4 vs Q1 performance',
            insight: 'Q1 win rate <strong>up 11%</strong> vs Q4. Average cycle time dropped from 38 to 29 days. Enterprise template driving the gain.',
            bars: [
                { w: 170, label: 'Q1: 72% win', color: 'pos' },
                { w: 110, label: 'Q4: 61% win', color: 'warn' },
                { w: 130, label: '\u039411% improvement', color: 'pos' }
            ],
            actions: ['Q1 Report', 'Share with Team'],
            predict: {
                name: 'Orbit Systems', template: 'Partner Channel',
                pct: 91, pctLabel: '91% Success', duration: '\u223C8 days to close',
                shap: [
                    { name: 'Buyer velocity', pct: 80, dir: 'pos', label: '+38%' },
                    { name: 'Contract sent', pct: 65, dir: 'pos', label: '+25%' },
                    { name: 'Time in stage', pct: 12, dir: 'neg', label: '\u22125%' }
                ],
                trust: 'Very Strong \u00b7 6/6 dimensions met'
            }
        },
        {
            question: 'Which journeys close this month?',
            insight: '<strong>5 journeys</strong> projected to close within 30 days. Combined value represents your strongest month this quarter.',
            bars: [
                { w: 180, label: '5 Closing soon', color: 'pos' },
                { w: 70, label: '2 May slip', color: 'warn' },
                { w: 30, label: '1 At risk', color: 'neg' }
            ],
            actions: ['View Closing', 'Forecast'],
            predict: {
                name: 'Pinnacle Inc', template: 'Enterprise Channel',
                pct: 88, pctLabel: '88% Success', duration: '\u223C12 days to close',
                shap: [
                    { name: 'Exec sponsor', pct: 75, dir: 'pos', label: '+32%' },
                    { name: 'Stage progress', pct: 62, dir: 'pos', label: '+24%' },
                    { name: 'Competitor', pct: 28, dir: 'neg', label: '\u221211%' }
                ],
                trust: 'Strong Signal \u00b7 5/6 dimensions met'
            }
        }
    ];

    var EXPLORER_QUERIES = [
        { query: 'What\u2019s our overall success rate?', level: 'high', highNum: 72, highTrend: '+8% vs last quarter' },
        { query: 'Break it down by template', level: 'mid',
          midHeader: ['Template', 'Won', 'Lost', 'Rate'],
          midRows: [['Enterprise','18','4','82%'],['Mid-Market','12','8','60%'],['Partner','8','3','73%']] },
        { query: 'Show stage drop-off for Enterprise', level: 'deep',
          deepTitle: 'Enterprise \u2014 stage completion',
          deepLabels: ['Discover','Experience','Scope','Commit','Deploy','Success'],
          deepBars: [220,195,170,130,110,90] },
        { query: 'Success rate this quarter?', level: 'high', highNum: 78, highTrend: '+6% vs previous quarter' },
        { query: 'Compare by account size', level: 'mid',
          midHeader: ['Account Size', 'Won', 'Lost', 'Rate'],
          midRows: [['Large (50+)','14','3','82%'],['Mid (10\u201349)','11','6','65%'],['Small (<10)','9','7','56%']] },
        { query: 'Where do Mid-Market deals stall?', level: 'deep',
          deepTitle: 'Mid-Market \u2014 stage completion',
          deepLabels: ['Discover','Evaluate','Scope','Negotiate','Commit','Launch'],
          deepBars: [210,180,120,90,70,55] },
        { query: 'Which rep has the highest win rate?', level: 'mid',
          midHeader: ['Rep', 'Won', 'Lost', 'Rate'],
          midRows: [['Sarah K.','15','2','88%'],['James R.','12','5','71%'],['Maria T.','10','4','71%']] }
    ];

    var SUCCESS_SNAPSHOTS = [
        {
            stats: [{val:'12',label:'Open'},{val:'8',label:'In Progress'},{val:'34',label:'Resolved'}],
            caption: 'Avg resolution: <strong>4.2 hours</strong> \u00b7 Tickets past 30 days',
            tickets: [
                {status:'open',text:'API integration stalled',age:'2d'},
                {status:'progress',text:'SSO config review',age:'5h'},
                {status:'resolved',text:'Data migration complete',age:'1d'},
                {status:'open',text:'Webhook timeout errors',age:'3h'}
            ]
        },
        {
            stats: [{val:'7',label:'Open'},{val:'11',label:'In Progress'},{val:'41',label:'Resolved'}],
            caption: 'Avg resolution: <strong>3.8 hours</strong> \u00b7 Tickets past 7 days',
            tickets: [
                {status:'progress',text:'Onboarding flow update',age:'1d'},
                {status:'open',text:'Dashboard latency spike',age:'4h'},
                {status:'resolved',text:'Email template fix',age:'12h'},
                {status:'progress',text:'SAML cert rotation',age:'6h'}
            ]
        },
        {
            stats: [{val:'3',label:'Open'},{val:'5',label:'In Progress'},{val:'52',label:'Resolved'}],
            caption: 'Avg resolution: <strong>3.1 hours</strong> \u00b7 This month',
            tickets: [
                {status:'resolved',text:'Payment gateway restored',age:'2h'},
                {status:'resolved',text:'Bulk import fixed',age:'4h'},
                {status:'progress',text:'Custom field mapping',age:'1d'},
                {status:'open',text:'Rate limit hit on sync',age:'45m'}
            ]
        },
        {
            stats: [{val:'15',label:'Open'},{val:'6',label:'In Progress'},{val:'28',label:'Resolved'}],
            caption: 'Avg resolution: <strong>5.1 hours</strong> \u00b7 Priority tickets',
            tickets: [
                {status:'open',text:'Auth flow broken on mobile',age:'1h'},
                {status:'open',text:'Export timing out > 1000 rows',age:'3h'},
                {status:'progress',text:'Notification delay > 30min',age:'8h'},
                {status:'resolved',text:'Calendar sync restored',age:'5h'}
            ]
        }
    ];

    function clearCrossTimers() {
        crossTimers.forEach(function(t) { clearTimeout(t); });
        crossTimers = [];
        if (explorerCycleTimer) { clearInterval(explorerCycleTimer); explorerCycleTimer = null; }
        if (ai360CycleTimer) { clearInterval(ai360CycleTimer); ai360CycleTimer = null; }
        if (successCycleTimer) { clearInterval(successCycleTimer); successCycleTimer = null; }
    }

    function crossTimer(fn, ms) {
        var t = setTimeout(fn, ms);
        crossTimers.push(t);
        return t;
    }

    function typeInto(el, text, speed, onDone) {
        var i = 0;
        el.textContent = '';
        function tick() {
            if (!document.contains(el)) return;
            if (i < text.length) {
                el.textContent += text[i];
                i++;
                crossTimer(tick, speed);
            } else if (onDone) {
                onDone();
            }
        }
        tick();
    }

    // ---- Hub 1: AI 360 ----

    function populateAi360(panel, ex) {
        var insightEl = panel.querySelector('.ai-chat-sim-insight');
        var barRects = panel.querySelectorAll('.ai-chat-bar');
        var barLabels = panel.querySelectorAll('.ai-chat-bar-label');
        var actionBtns = panel.querySelectorAll('.ai-chat-sim-btn');

        if (insightEl) insightEl.innerHTML = ex.insight;
        ex.bars.forEach(function(b, i) {
            if (barRects[i]) {
                barRects[i].setAttribute('data-bar-w', b.w);
                barRects[i].setAttribute('data-bar-color', b.color);
                barRects[i].setAttribute('width', '0');
            }
            if (barLabels[i]) {
                barLabels[i].textContent = b.label;
                barLabels[i].setAttribute('x', b.w + 6);
            }
        });
        ex.actions.forEach(function(a, i) {
            if (actionBtns[i]) actionBtns[i].textContent = a;
        });

        var jName = panel.querySelector('.ai-predict-journey-name');
        var tpl = panel.querySelector('.ai-predict-template');
        var mlBar = panel.querySelector('.ai-ml-bar-fill');
        var probLabel = panel.querySelector('.ai-predict-prob-label');
        var duration = panel.querySelector('.ai-predict-duration');
        var shapItems = panel.querySelectorAll('.ai-shap-item');
        var trustBadge = panel.querySelector('.ai-predict-trust');

        if (jName) jName.textContent = ex.predict.name;
        if (tpl) tpl.textContent = ex.predict.template;
        if (mlBar) { mlBar.setAttribute('data-target-pct', ex.predict.pct); mlBar.style.width = '0%'; }
        if (probLabel) probLabel.textContent = ex.predict.pctLabel;
        if (duration) duration.textContent = ex.predict.duration;
        ex.predict.shap.forEach(function(s, i) {
            if (!shapItems[i]) return;
            shapItems[i].setAttribute('data-shap-pct', s.pct);
            shapItems[i].setAttribute('data-shap-dir', s.dir);
            var nameEl = shapItems[i].querySelector('.ai-shap-name');
            var pctEl = shapItems[i].querySelector('.ai-shap-pct');
            var barEl = shapItems[i].querySelector('.ai-shap-bar');
            if (nameEl) nameEl.textContent = s.name;
            if (pctEl) pctEl.textContent = s.label;
            if (barEl) barEl.style.width = '0%';
        });
        if (trustBadge) trustBadge.textContent = ex.predict.trust;
    }

    function playAi360Exchange(panel, idx) {
        var ex = AI360_EXCHANGES[idx];
        populateAi360(panel, ex);

        var userMsg = panel.querySelector('.ai-chat-sim-user');
        var userText = panel.querySelector('.ai-chat-sim-text');
        var typing = panel.querySelector('.ai-chat-sim-typing');
        var aiMsg = panel.querySelector('.ai-chat-sim-ai');
        var chatBars = panel.querySelectorAll('.ai-chat-bar');
        var actionBtns = panel.querySelectorAll('.ai-chat-sim-btn');
        var predictHeader = panel.querySelector('.ai-predict-header');
        var mlBar = panel.querySelector('.ai-ml-bar-fill');
        var shapItems = panel.querySelectorAll('.ai-shap-item');
        var trustBadge = panel.querySelector('.ai-predict-trust');

        if (REDUCED_MOTION) {
            userMsg.classList.add('is-visible');
            userText.textContent = ex.question;
            aiMsg.classList.add('is-visible');
            chatBars.forEach(function(b) { b.setAttribute('width', b.getAttribute('data-bar-w')); });
            actionBtns.forEach(function(b) { b.classList.add('is-visible'); });
            if (predictHeader) predictHeader.classList.add('is-visible');
            if (mlBar) mlBar.style.width = ex.predict.pct + '%';
            shapItems.forEach(function(item) {
                var bar = item.querySelector('.ai-shap-bar');
                if (bar) bar.style.width = item.getAttribute('data-shap-pct') + '%';
            });
            if (trustBadge) trustBadge.classList.add('is-visible');
            return;
        }

        // Chat sequence
        crossTimer(function() {
            userMsg.classList.add('is-visible');
            typeInto(userText, ex.question, TYPEWRITER_SPEED, function() {
                crossTimer(function() {
                    typing.classList.add('is-visible');
                    crossTimer(function() {
                        typing.classList.remove('is-visible');
                        aiMsg.classList.add('is-visible');
                        crossTimer(function() {
                            chatBars.forEach(function(b, i) {
                                crossTimer(function() {
                                    b.setAttribute('width', b.getAttribute('data-bar-w'));
                                }, i * 120);
                            });
                        }, 300);
                        crossTimer(function() {
                            actionBtns.forEach(function(b, i) {
                                crossTimer(function() { b.classList.add('is-visible'); }, i * 150);
                            });
                        }, 600);
                    }, 1200);
                }, 300);
            });
        }, 100);

        // Prediction column (parallel)
        crossTimer(function() { if (predictHeader) predictHeader.classList.add('is-visible'); }, 200);
        crossTimer(function() { if (mlBar) mlBar.style.width = ex.predict.pct + '%'; }, 600);
        crossTimer(function() {
            shapItems.forEach(function(item) {
                var bar = item.querySelector('.ai-shap-bar');
                if (bar) bar.style.width = item.getAttribute('data-shap-pct') + '%';
            });
        }, 900);
        crossTimer(function() { if (trustBadge) trustBadge.classList.add('is-visible'); }, 1200);
    }

    function resetHub_ai360_visuals(panel) {
        panel.querySelectorAll('.is-visible').forEach(function(el) { el.classList.remove('is-visible'); });
        var userText = panel.querySelector('.ai-chat-sim-text');
        if (userText) userText.textContent = '';
        var typing = panel.querySelector('.ai-chat-sim-typing');
        if (typing) typing.classList.remove('is-visible');
        var mlBar = panel.querySelector('.ai-ml-bar-fill');
        if (mlBar) mlBar.style.width = '0%';
        panel.querySelectorAll('.ai-shap-item').forEach(function(item) {
            var bar = item.querySelector('.ai-shap-bar');
            if (bar) bar.style.width = '0%';
        });
        panel.querySelectorAll('.ai-chat-bar').forEach(function(b) { b.setAttribute('width', '0'); });
    }

    function activateHub_ai360() {
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="ai360"]');
        if (!panel) return;
        ai360CycleIndex = 0;
        playAi360Exchange(panel, 0);

        if (!REDUCED_MOTION) {
            ai360CycleTimer = setInterval(function() {
                resetHub_ai360_visuals(panel);
                crossTimer(function() {
                    ai360CycleIndex = (ai360CycleIndex + 1) % AI360_EXCHANGES.length;
                    playAi360Exchange(panel, ai360CycleIndex);
                }, 400);
            }, 9000);
        }
    }

    function resetHub_ai360() {
        if (ai360CycleTimer) { clearInterval(ai360CycleTimer); ai360CycleTimer = null; }
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="ai360"]');
        if (!panel) return;
        resetHub_ai360_visuals(panel);
    }

    // ---- Hub 2: Data Explorer ----

    function populateExplorerResult(panel, q) {
        if (q.level === 'high') {
            var bigNum = panel.querySelector('.ai-explorer-big-num');
            var trendLabel = panel.querySelector('.ai-explorer-trend-label');
            if (bigNum) bigNum.textContent = '0%';
            if (trendLabel) trendLabel.textContent = q.highTrend;
        } else if (q.level === 'mid') {
            var headerSpans = panel.querySelectorAll('.ai-pivot-header-row span');
            q.midHeader.forEach(function(h, i) { if (headerSpans[i]) headerSpans[i].textContent = h; });
            var dataRows = panel.querySelectorAll('.ai-pivot-row:not(.ai-pivot-header-row)');
            q.midRows.forEach(function(row, ri) {
                if (!dataRows[ri]) return;
                var spans = dataRows[ri].querySelectorAll('span');
                row.forEach(function(val, ci) { if (spans[ci]) spans[ci].textContent = val; });
            });
        } else if (q.level === 'deep') {
            var funnelTitle = panel.querySelector('.ai-explorer-funnel-title');
            if (funnelTitle) funnelTitle.textContent = q.deepTitle;
            var funnelLabels = panel.querySelectorAll('.ai-funnel-label');
            q.deepLabels.forEach(function(l, i) { if (funnelLabels[i]) funnelLabels[i].textContent = l; });
            var funnelBars = panel.querySelectorAll('.ai-funnel-bar');
            q.deepBars.forEach(function(w, i) { if (funnelBars[i]) funnelBars[i].setAttribute('data-bar-w', w); });
        }
    }

    function activateHub_explorer() {
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="explorer"]');
        if (!panel) return;

        var promptText = panel.querySelector('.ai-explorer-prompt-text');
        var results = panel.querySelectorAll('.ai-explorer-result');
        explorerCycleIndex = 0;

        function showQuery(idx) {
            var q = EXPLORER_QUERIES[idx];
            results.forEach(function(r) { r.classList.remove('is-visible'); });
            panel.querySelectorAll('.ai-funnel-bar').forEach(function(b) { b.setAttribute('width', '0'); });

            populateExplorerResult(panel, q);

            if (REDUCED_MOTION) {
                promptText.textContent = q.query;
                var target = panel.querySelector('.ai-explorer-result[data-level="' + q.level + '"]');
                if (target) target.classList.add('is-visible');
                if (q.level === 'high') animateBigNum(panel, q.highNum);
                if (q.level === 'deep') animateFunnelBars(panel);
                return;
            }

            promptText.textContent = '';
            typeInto(promptText, q.query, TYPEWRITER_SPEED, function() {
                crossTimer(function() {
                    var target = panel.querySelector('.ai-explorer-result[data-level="' + q.level + '"]');
                    if (target) target.classList.add('is-visible');
                    if (q.level === 'high') animateBigNum(panel, q.highNum);
                    if (q.level === 'deep') animateFunnelBars(panel);
                }, 300);
            });
        }

        showQuery(0);

        if (!REDUCED_MOTION) {
            explorerCycleTimer = setInterval(function() {
                explorerCycleIndex = (explorerCycleIndex + 1) % EXPLORER_QUERIES.length;
                showQuery(explorerCycleIndex);
            }, 7000);
        }
    }

    function animateBigNum(panel, target) {
        var el = panel.querySelector('.ai-explorer-big-num');
        if (!el) return;
        if (REDUCED_MOTION) { el.textContent = target + '%'; return; }
        var current = 0;
        var step = Math.ceil(target / 30);
        function count() {
            current = Math.min(current + step, target);
            el.textContent = current + '%';
            if (current < target) crossTimer(count, 30);
        }
        count();
    }

    function animateFunnelBars(panel) {
        var bars = panel.querySelectorAll('.ai-funnel-bar');
        bars.forEach(function(bar, i) {
            crossTimer(function() {
                bar.setAttribute('width', bar.getAttribute('data-bar-w'));
            }, i * 100);
        });
    }

    function resetHub_explorer() {
        if (explorerCycleTimer) { clearInterval(explorerCycleTimer); explorerCycleTimer = null; }
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="explorer"]');
        if (!panel) return;
        panel.querySelectorAll('.is-visible').forEach(function(el) { el.classList.remove('is-visible'); });
        var promptText = panel.querySelector('.ai-explorer-prompt-text');
        if (promptText) promptText.textContent = '';
        panel.querySelectorAll('.ai-funnel-bar').forEach(function(b) { b.setAttribute('width', '0'); });
        var bigNum = panel.querySelector('.ai-explorer-big-num');
        if (bigNum) bigNum.textContent = '0%';
    }

    // ---- Hub 3: Success Hub ----

    function populateSuccess(panel, snap) {
        var statCards = panel.querySelectorAll('.ai-success-stat-card');
        snap.stats.forEach(function(s, i) {
            if (!statCards[i]) return;
            var valEl = statCards[i].querySelector('.ai-success-stat-value');
            var labelEl = statCards[i].querySelector('.ai-success-stat-label');
            if (valEl) valEl.textContent = s.val;
            if (labelEl) labelEl.textContent = s.label;
        });

        var caption = panel.querySelector('.ai-success-caption');
        if (caption) caption.innerHTML = snap.caption;

        var ticketRows = panel.querySelectorAll('.ai-ticket-row');
        snap.tickets.forEach(function(t, i) {
            if (!ticketRows[i]) return;
            var badge = ticketRows[i].querySelector('.ai-ticket-badge');
            var text = ticketRows[i].querySelector('.ai-ticket-text');
            var age = ticketRows[i].querySelector('.ai-ticket-age');
            if (badge) badge.className = 'ai-ticket-badge ai-ticket-' + t.status;
            if (text) text.textContent = t.text;
            if (age) age.textContent = t.age;
        });
    }

    function playSuccessSnapshot(panel, idx) {
        var snap = SUCCESS_SNAPSHOTS[idx];
        populateSuccess(panel, snap);

        var statCards = panel.querySelectorAll('.ai-success-stat-card');
        var trendLine = panel.querySelector('.ai-success-trend-line');
        var ticketRows = panel.querySelectorAll('.ai-ticket-row');
        var integrations = panel.querySelector('.ai-hub-integrations');

        if (REDUCED_MOTION) {
            statCards.forEach(function(c) { c.classList.add('is-visible'); });
            if (trendLine) trendLine.classList.add('is-drawn');
            ticketRows.forEach(function(r) { r.classList.add('is-visible'); });
            if (integrations) integrations.classList.add('is-visible');
            return;
        }

        statCards.forEach(function(c) { c.classList.add('is-visible'); });
        crossTimer(function() {
            if (trendLine) trendLine.classList.add('is-drawn');
        }, 400);
        crossTimer(function() {
            ticketRows.forEach(function(r) { r.classList.add('is-visible'); });
        }, 300);
        crossTimer(function() {
            if (integrations) integrations.classList.add('is-visible');
        }, 800);
    }

    function resetHub_success_visuals(panel) {
        panel.querySelectorAll('.is-visible, .is-drawn').forEach(function(el) {
            el.classList.remove('is-visible');
            el.classList.remove('is-drawn');
        });
    }

    function activateHub_success() {
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="success"]');
        if (!panel) return;
        successCycleIndex = 0;
        playSuccessSnapshot(panel, 0);

        if (!REDUCED_MOTION) {
            successCycleTimer = setInterval(function() {
                resetHub_success_visuals(panel);
                crossTimer(function() {
                    successCycleIndex = (successCycleIndex + 1) % SUCCESS_SNAPSHOTS.length;
                    playSuccessSnapshot(panel, successCycleIndex);
                }, 400);
            }, 8000);
        }
    }

    function resetHub_success() {
        if (successCycleTimer) { clearInterval(successCycleTimer); successCycleTimer = null; }
        var panel = crossView.querySelector('.ai-cross-panel[data-hub="success"]');
        if (!panel) return;
        resetHub_success_visuals(panel);
    }

    // ---- Hub dispatcher ----

    function activateHub(hub) {
        clearCrossTimers();
        resetHub_ai360();
        resetHub_explorer();
        resetHub_success();
        if (hub === 'ai360') activateHub_ai360();
        else if (hub === 'explorer') activateHub_explorer();
        else if (hub === 'success') activateHub_success();
    }

    function activateCrossView() {
        var activePanel = crossView.querySelector('.carousel-item.is-active');
        if (!activePanel) return;
        activateHub(activePanel.getAttribute('data-hub'));
    }

    function resetCrossView() {
        clearCrossTimers();
        resetHub_ai360();
        resetHub_explorer();
        resetHub_success();
    }

    // ---- Equalize cross-panel heights ----
    function equalizeCrossPanels() {
        if (!crossView) return;
        var panels = crossView.querySelectorAll('.ai-cross-panel');
        if (!panels.length) return;
        var taller = 0;
        panels.forEach(function(p) {
            p.style.minHeight = '';
            p.style.display = 'block';
            p.style.visibility = 'hidden';
            p.style.position = 'absolute';
            var h = p.offsetHeight;
            if (h > taller) taller = h;
        });
        panels.forEach(function(p) {
            p.style.display = '';
            p.style.visibility = '';
            p.style.position = '';
            p.style.minHeight = taller + 'px';
        });
    }
    setTimeout(equalizeCrossPanels, 200);
    window.addEventListener('resize', equalizeCrossPanels);

    // ---- Carousel transition observer ----

    var crossSlides = crossView ? crossView.querySelector('.ai-cross-slides') : null;
    if (crossSlides) {
        var crossObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    var target = m.target;
                    if (target.classList.contains('carousel-item') &&
                        target.classList.contains('is-active')) {
                        var hub = target.getAttribute('data-hub');
                        activateHub(hub);
                        syncNavLabels(hub);
                    }
                }
            });
        });
        crossObserver.observe(crossSlides, { attributes: true, subtree: true, attributeFilter: ['class'] });
    }

    // ---- Nav label sync ----

    var navLabels = crossView ? crossView.querySelectorAll('.ai-cross-nav-label[data-nav]') : [];
    var hubIndexMap = { ai360: '0', explorer: '1', success: '2' };

    function syncNavLabels(hub) {
        var activeIdx = hubIndexMap[hub];
        navLabels.forEach(function(l) {
            l.classList.toggle('is-active', l.getAttribute('data-nav') === activeIdx);
        });
    }

    navLabels.forEach(function(label) {
        label.addEventListener('click', function() {
            var idx = parseInt(label.getAttribute('data-nav'), 10);
            var bullets = crossView.querySelectorAll('.carousel-bullet');
            if (bullets[idx]) bullets[idx].click();
        });
    });

    // ---- Arrow navigation ----
    var crossCarousel = crossView ? crossView.querySelector('.ai-cross-carousel') : null;
    if (crossCarousel) {
        var arrowLeft = crossCarousel.querySelector('.ai-cross-arrow--left');
        var arrowRight = crossCarousel.querySelector('.ai-cross-arrow--right');
        var totalPanels = crossCarousel.querySelectorAll('.carousel-item').length;

        function getCurrentCrossIndex() {
            var active = crossCarousel.querySelector('.ai-cross-nav-label.is-active');
            return active ? parseInt(active.getAttribute('data-nav'), 10) : 0;
        }

        if (arrowLeft) {
            arrowLeft.addEventListener('click', function() {
                var cur = getCurrentCrossIndex();
                var prev = (cur - 1 + totalPanels) % totalPanels;
                var bullets = crossView.querySelectorAll('.carousel-bullet');
                if (bullets[prev]) bullets[prev].click();
            });
        }
        if (arrowRight) {
            arrowRight.addEventListener('click', function() {
                var cur = getCurrentCrossIndex();
                var next = (cur + 1) % totalPanels;
                var bullets = crossView.querySelectorAll('.carousel-bullet');
                if (bullets[next]) bullets[next].click();
            });
        }
    }

    // ---- View Toggle ----

    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const view = btn.getAttribute('data-view');

            toggleBtns.forEach(function(b) {
                b.classList.toggle('is-active', b === btn);
                b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
            });

            if (view === 'journey') {
                crossView.classList.remove('is-active');
                crossView.setAttribute('aria-hidden', 'true');
                journeyView.classList.add('is-active');
                journeyView.setAttribute('aria-hidden', 'false');
                resetCrossView();
                if (!manualOverride) startCycle();
            } else {
                journeyView.classList.remove('is-active');
                journeyView.setAttribute('aria-hidden', 'true');
                crossView.classList.add('is-active');
                crossView.setAttribute('aria-hidden', 'false');
                clearInterval(cycleTimer);
                // Small delay to let view render
                setTimeout(activateCrossView, 80);
            }
        });
    });

    // ---- IntersectionObserver reveal ----

    function onSectionReveal() {
        if (sectionRevealed) return;
        sectionRevealed = true;

        // Measure track endpoints after layout
        requestAnimationFrame(measureTrack);
        window.addEventListener('resize', measureTrack);

        // Set initial stage
        setActiveStage(0, false);

        // Start auto-cycle
        setTimeout(startCycle, 800);
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                onSectionReveal();
                observer.disconnect();
            }
        });
    }, { threshold: 0.15 });

    observer.observe(section);

}());
// =============================================================
// END AI IN PRACTICE SECTION
// =============================================================
