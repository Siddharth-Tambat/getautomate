#!/usr/bin/env python3
"""Checks the static site: every relative link and #anchor resolves, no page loads third-party scripts or
stylesheets, every page has a title and description, and CNAME still points at getautomate.in.

Usage: scripts/check-site.py site
"""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.scripts, self.styles, self.meta = set(), [], [], [], set()
        self.in_title = False
        self.title = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        for key in ("href", "src"):
            if a.get(key):
                self.refs.append(a[key])
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        if tag == "link" and a.get("rel") == "stylesheet":
            self.styles.append(a.get("href", ""))
        if tag == "meta" and a.get("name"):
            self.meta.add(a["name"])
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def main(root: Path) -> int:
    pages = {p.relative_to(root).as_posix(): p for p in root.rglob("*.html")}
    parsed = {}
    for name, path in pages.items():
        page = Page()
        page.feed(path.read_text(encoding="utf-8"))
        parsed[name] = page

    errors = []
    for name, page in parsed.items():
        for src in page.scripts:
            if urlparse(src).scheme:
                errors.append(f"{name}: external script {src} (the site has no third-party scripts)")
        for href in page.styles:
            if urlparse(href).scheme or href.startswith("//"):
                errors.append(f"{name}: external stylesheet {href} (no web fonts or third-party CSS)")
        if not page.title.strip():
            errors.append(f"{name}: missing <title>")
        if "description" not in page.meta:
            errors.append(f"{name}: missing meta description")
        for ref in page.refs:
            u = urlparse(ref)
            if u.scheme or ref.startswith("//"):
                continue  # external link or mailto:
            target = name if not u.path else (Path(name).parent / u.path).as_posix()
            if target.endswith("/") or target in ("", "."):
                target = (target.rstrip("/") + "/index.html").lstrip("./").lstrip("/") or "index.html"
            target = target.removeprefix("./")
            if not (root / target).exists():
                errors.append(f"{name}: broken link {ref}")
                continue
            if u.fragment and target in parsed and u.fragment not in parsed[target].ids:
                errors.append(f"{name}: missing anchor {ref}")

    cname = root / "CNAME"
    if not cname.exists() or cname.read_text().strip() != "getautomate.in":
        errors.append("CNAME must contain getautomate.in")

    for e in errors:
        print(e)
    print(f"{len(pages)} pages checked, {len(errors)} problems")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(Path(sys.argv[1] if len(sys.argv) > 1 else "site")))
