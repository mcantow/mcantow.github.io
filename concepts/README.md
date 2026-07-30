# Index concept board

A menu of cinematic index directions. Nothing here is the live site — these are
explorations. The live index is `../index.html` (stacked-scroll journey).

## Bookmarked options

### ⭐ Night-sea Wayfinder  — `../wayfinder-captions-backup.html`
A boat crossing a night sea; sections are "chapters" of the crossing
(Red Ocean → Blue Ocean, etc.). **Status: bookmarked / parked.** The boat + water
metaphor isn't landing, but the **night-sky starfield is the strongest asset** and
worth carrying into whatever replaces it. Keep this file as the reference.

### AETHER deep-space fly-through — `../concept.html`
A single camera drifts deeper into space — nebulae, ~6,500 twinkling stars, bloom,
a glowing galactic core. No boat, no water — pure night sky / space. **This is
already the "deep space" destination** any takeoff concept can end in. Reuse it.

## Directions to explore next

### ⭐ A. Liftoff — earth → space ascent  — BUILT: `liftoff.html`
Hyperreal, cinematic. Scroll = altitude. Opens on a high-altitude dawn vista (blue
sky, sun, the curved cloudy Earth below), climbs until the horizon curves and the sky
bleeds to black, then keeps pulling back until Earth is a marble hanging in the dark —
city lights glittering on the night side, atmosphere ringing the limb.

Built on **real NASA imagery + atmospheric scattering**:
- day / night-lights / specular / normal maps on the globe (dawn terminator, ocean
  sun-glint, city lights)
- a drifting cloud layer
- a scatter-glow atmosphere that's a blue sky when low and a razor blue rim in space
- sun bloom + dense starfield

Altitude → section mapping:
- ground vista: name / identity
- atmosphere: the thesis ("next generation of platforms" = leaving the ground)
- the curvature: CustomerNode ("from record to action")
- deep space: the work / credentials (TESS & NICER)
- arrival (the marble): contact

**Production note:** textures currently load live from `threejs.org/examples/` — fine
for a concept, but self-host them (or swap in higher-res Blue Marble maps) before this
ever goes on the real index. Preview/tune shots: `_audit/shots_liftoff/`
(`node _audit/shot_liftoff.cjs`).

### ⭐⭐ A2. Launch Sequence — the biographical ascent  — BUILT: `journey.html`
Liftoff, but the altitude *is the résumé*. Same photoreal earth→space engine, with
your real timeline + assets layered as scroll-driven acts:

1. **Welcome / Mahwah, NJ** — the identity card (headshot, name, Founder · MIT/NJ/NYC)
   over the night-side northeast US, city lights glittering, dawn on the limb;
   Thunderbirds emblem; **map pins** for Mahwah + Boston joined by a glowing arc.
2. **Cambridge / MIT** — rising; MIT seal; "MEng in AI · BSc EECS · varsity football."
3. **Kavli Institute** — serious altitude, and a **satellite streaks past** (the
   TESS/NICER close-call). "Teaching machines to watch the sky."
4. **System of Action I — ThoughtLine** (MIT Media Lab), with the thesis link.
5. **System of Action II — CustomerNode** (NYC).
6. **From record to action** — the CustomerNode pitch + CTA, Earth a marble in the dark.

All copy/imagery pulled from the current `index.html` timeline. Preview/tune:
`_audit/shots_journey/` (`node _audit/shot_journey.cjs`).

Now runs on **self-hosted 8K NASA-derived textures** (`concepts/tex/`; Solar System
Scope, CC BY 4.0). Photoreal surface shading: ocean sun-glint, cloud shadows, soft
dawn terminator, aerial-perspective limb. Shares the wayfinder chrome (branded `#veil`
splash, interactive scrubber, clean corners).

**Grand tour (the deep-space acts).** After Earth orbit the camera pivots outward and
flies the solar system as the story climbs:
- Kavli → a **detailed PBR satellite** (gold-foil bus, grid solar arrays, dish) streaks
  past — the TESS/NICER close-call.
- ThoughtLine → past the **Moon**; CustomerNode → past **Mars**; the finale → the
  banded **Jupiter**, with a **Milky Way** skybox (`scene.background`) + IBL reflections.

**Gotcha fixed (documented so it doesn't bite again):** a giant Milky-Way *sphere mesh*
silently prevented every solid Box/Sphere mesh (planets, satellite) from rasterizing.
Root cause = an extreme camera near/far range (`far=80000`) pushing mid-field bodies to
`z_ndc≈1`. Fix = render the Milky Way as `scene.background` (a real skybox, no mesh) and
keep a modest near/far (`8 / 5600`) with the sky/star spheres pulled inside it.

**Local preview note:** see `PREVIEW.md` for the short version. Textures live in
`concepts/tex/` (8.2MB, committed). WebGL CORS-blocks local files under `file://`,
so `loadTiered()` falls back to a CDN tier and the page still renders when opened
as a plain file — just at lower-res earth maps. To see the real local textures,
serve over http (`python -m http.server` from `mcantow.github.io/`). On the
deployed site it's same-origin and just works.

**Open questions / next passes:** real street-level imagery for the Mahwah/Boston
ground beats (8K blue-marble still can't show a town — pins carry it); an actual
camera *flight* NJ→Boston; a real satellite GLTF model instead of the built primitive;
expanding act 6 into the full CustomerNode product section.

### B. Observatory — stay grounded, sky is the stage
Never leave the ground. Constellations draw themselves to connect ideas; slow
celestial rotation; a meteor streak punctuates each section change. Calmer, less
literal than Liftoff. Reuses the starfield, drops boat + water.

### C. Aurora — high-latitude night
Night sky with volumetric aurora ribbons in the brand blurple/purple (same palette
as the AETHER nebula). Ground stays a dark snowfield silhouette. Moody, brand-tied,
less "space travel."

### D. Orbital — open already in orbit
Skip the takeoff. Open looking down at a slowly rotating night-side Earth, city
lights reading as their own constellations ("connect the dots"), then pull out into
deep space. Cleaner / more corporate than Liftoff.
