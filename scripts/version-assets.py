#!/usr/bin/env python3
"""Version local CSS/JS references by content so browsers fetch changed assets after deployment."""
import hashlib
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

root = Path(__file__).resolve().parent.parent / 'site'
check = '--check' in sys.argv
stale = []
for page in sorted(root.glob('*.html')):
    original = page.read_text()
    def replace(match):
        attribute, quote, value = match.groups()
        parsed = urlsplit(value)
        if parsed.scheme or parsed.netloc or not parsed.path.endswith(('.css', '.js')):
            return match.group()
        asset = page.parent / parsed.path
        if not asset.is_file():
            return match.group()
        digest = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
        return f'{attribute}={quote}{parsed.path}?v={digest}{quote}'
    updated = re.sub(r'''(href|src)=(["'])([^"']+)\2''', replace, original)
    if updated != original:
        stale.append(page.name)
        if not check:
            page.write_text(updated)
if check and stale:
    raise SystemExit('Stale asset versions in ' + ', '.join(stale) + '; run python3 scripts/version-assets.py')
print('Asset versions verified' if check else 'Asset references versioned')
