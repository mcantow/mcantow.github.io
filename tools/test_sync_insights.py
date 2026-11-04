"""Tests for tools/sync_insights.py. Run: python3 -m unittest tools/test_sync_insights.py"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_insights as si  # noqa: E402


def hub(pieces):
    """A minimal hub page shaped like customernode.com/insights."""
    cards = "".join(
        f'<article class="cn-insight-card" id="{p["slug"]}" data-insight-card data-title="{p["title"]}" '
        f'data-format="{p["format"]}" data-onsite="/insights/{p["slug"]}/" data-cover="" data-cover-position="top">'
        "</article>"
        for p in pieces
    )
    ld = {"@graph": [{"@type": "Blog", "blogPost": [
        {"@id": f"https://customernode.com/insights/#{p['slug']}", "headline": p["title"],
         "description": p["teaser"], "datePublished": p["date"]} for p in pieces]}]}
    return f'<html><script type="application/ld+json">{json.dumps(ld)}</script>{cards}</html>'


INDEX = """<ol>
          <!--INSIGHTS:START (kept by hand)-->
        <li><a class="ins-card" href="https://customernode.com/insights/old/">old</a></li>
          <!--INSIGHTS:END-->
          <li class="ins-thesis">thesis</li>
</ol>
"""

A = {"slug": "a", "title": "CustomerNode Ships A", "teaser": "First.", "format": "Post", "date": "2026-01-02"}
B = {"slug": "b", "title": "B", "teaser": "Second, by CustomerNode™.", "format": "Article", "date": "2026-03-04"}


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.index = root / "index.html"
        self.index.write_text(INDEX)
        self.hub = root / "hub.html"
        self._saved = si.INDEX, si.IMG_DIR, si.SOURCES
        si.INDEX, si.IMG_DIR = self.index, root / "img"
        si.SOURCES = si.IMG_DIR / "sources.json"

    def tearDown(self):
        si.INDEX, si.IMG_DIR, si.SOURCES = self._saved
        self.tmp.cleanup()

    def run_sync(self, pieces, *extra):
        self.hub.write_text(hub(pieces))
        return si.main(["--hub", str(self.hub), *extra])

    def test_every_hub_piece_becomes_a_card_newest_first(self):
        self.assertEqual(self.run_sync([A, B]), 0)
        page = self.index.read_text()
        self.assertLess(page.index("/insights/b/"), page.index("/insights/a/"))
        self.assertNotIn("/insights/old/", page)
        self.assertIn('<time datetime="2026-03-04">Mar 4, 2026</time>', page)
        self.assertIn("ins-cover--none", page)
        self.assertIn('class="ins-thesis"', page)  # the thesis card after the markers is kept

    def test_customernode_is_written_with_the_mark_once(self):
        self.run_sync([A, B])
        page = self.index.read_text()
        self.assertIn('<span class="tmw">CustomerNode<span class="tm">™</span></span> Ships A', page)
        self.assertNotIn("™™", page)
        self.assertNotIn("CustomerNode™.", page.replace('<span class="tm">™</span></span>', ""))

    def test_second_run_changes_nothing(self):
        self.run_sync([A, B])
        first = self.index.read_text()
        self.assertEqual(self.run_sync([A, B], "--check"), 0)
        self.assertEqual(self.index.read_text(), first)

    def test_a_shorter_hub_never_shrinks_the_carousel(self):
        self.run_sync([A, B])
        with self.assertRaises(SystemExit):
            self.run_sync([A])
        self.assertIn("/insights/b/", self.index.read_text())

    def test_an_empty_hub_writes_nothing(self):
        with self.assertRaises(SystemExit):
            self.run_sync([])
        self.assertIn("/insights/old/", self.index.read_text())

    def test_a_piece_without_a_date_is_refused(self):
        with self.assertRaises(SystemExit):
            self.run_sync([dict(A, date="")])


if __name__ == "__main__":
    unittest.main()
