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

## License

Code is MIT licensed; see [LICENSE.md](LICENSE.md). Photos, logos and written content are not covered by that license.
