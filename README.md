# michaelcantow.com

Source for [michaelcantow.com](https://michaelcantow.com), the personal site of Michael Cantow, founder of [CustomerNode™](https://customernode.com).

## How it's built

A static site in plain HTML, CSS and JavaScript, with no build step and no framework.

- `index.html`: the homepage
- `css/`, `js/`: site styles and scripts
- `cn-demo.html`, `cn-hero/`: the embedded CustomerNode™ product demo
- `img/`: photos, logos and article images
- `tools/sync_insights.py`: rebuilds the essay carousel from customernode.com/insights. The CustomerNode release pipeline runs it on every live release and fails if this site does not list every piece; do not edit those cards by hand

Hosted on GitHub Pages, with DNS through Cloudflare. To preview locally, open `index.html` in a browser or run `python3 -m http.server` in this folder.


## Scroll reveals

Pieces marked `rv` fade up into focus as they scroll in. Their order and timing come from the page as it is laid out at that moment, so moving content or changing how it stacks on a phone keeps the motion in reading order on its own:

- never write a delay into the markup (`style="--rd:…"`): pieces that reveal together cascade top to bottom, then left to right;
- a group whose items stack on some screens (cards, timeline entries) gets `data-rv-each="<selector for its items>"` instead of `rv`, so each item reveals as it arrives;
- one section reveals at a time; the next waits for the one playing to finish.
- anything that appears (hidden to shown) is played with `mcSwap(el, addClass, removeClass, delay)`, never by switching a class and letting a CSS transition run: iPhone Safari drops transitions that start mid-scroll and shows the end state at once. Keep describing both looks and the timing in CSS (`transition` on the element); `mcSwap` reads them and plays an animation that always starts from the first frame.

After any layout change, serve the folder locally and run `node tools/check_motion.cjs <address of index.html>`. It scrolls the page at desktop, tablet and phone sizes and fails if anything reveals out of order, before it is on screen, alongside another section, before its section is lit, or through a plain CSS transition instead of `mcSwap`.

## License

Code is MIT licensed; see [LICENSE.md](LICENSE.md). Photos, logos and written content are not covered by that license.
