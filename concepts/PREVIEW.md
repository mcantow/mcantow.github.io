# Previewing the concepts

These are **explorations**, not the live site. The live site is `../index.html`,
and it only updates when something lands on the `main` branch. Nothing in this
folder is published — you can't break michaelcantow.com by working in here.

## The quickest way to look at it

Download the repo (green **Code** button on GitHub → **Download ZIP**), unzip it,
open the `concepts` folder, and **double-click `journey.html`**. It opens in your
browser and runs.

You'll see a note that some textures loaded from the internet instead of from the
folder — that's expected and fine. Browsers refuse to let a page opened straight
from your hard drive read image files next to it (a security rule), so the page
quietly falls back to downloading them. Everything works; the Earth is just a
little less sharp.

Scroll to move. Scrolling is the whole interface — it flies you from the ground
up into orbit and then out past the Moon, Mars and Jupiter.

## The sharper way (optional)

To see it with the full-resolution NASA maps, you need to "serve" the folder
instead of opening the file. If you have Python installed, open a terminal in the
`mcantow.github.io` folder and run:

    python -m http.server 8099

Then go to <http://localhost:8099/concepts/journey.html> in your browser. Press
`Ctrl+C` in the terminal when you're done.

## What's here

| File | What it is |
|---|---|
| `journey.html` | **The main one.** Earth→space ascent where the altitude is the résumé. |
| `liftoff.html` | The plain ascent it grew out of — no biography layered on. |
| `../concept.html` | AETHER: a drift through deep space. No Earth. |
| `../wayfinder-captions-backup.html` | Parked night-sea concept. Kept for the starfield. |

See `README.md` for the full design notes and open questions.

## If you want to change something

Work on the `feature/scroll-journey` branch, not `main` — `main` is what's live.
Everything is a single self-contained HTML file: the layout, styling, and 3D code
all live in the one file, so you can open `journey.html` in any text editor and
the whole thing is right there. Save, refresh the browser, see the change.
