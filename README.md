# getautomate.in

The website for **AutoMate**, a mate for your auto: an Android app that tracks your car, bike or scooter's trips and
spending on its own. Easy to set up, no extra device, just your phone. Free for your first 99 trips, with expenses, fuel,
FASTag and garage always free; then ₹999 once for life or ₹69 a month unlocks every trip. The app itself is closed source and lives in a separate private repository.

- `site/` is the whole website: plain HTML and CSS, no build step, no trackers, no third-party scripts or fonts.
- `scripts/check-site.py site` checks links, anchors, titles, descriptions, external assets and `CNAME`.
- `.github/workflows/site.yml` runs the check on every push and pull request, and deploys `site/` to GitHub Pages
  from `main`. The custom domain is `getautomate.in` (`site/CNAME`).

Preview locally:

```bash
python3 -m http.server 8767 --directory site
```

This repository is public so the site can be hosted on GitHub Pages; it is not open for contributions. Only the
owner can push, `main` can't be force-pushed or deleted, and only `main` deploys. Pull requests from forks run the
check only after the owner approves them, and never deploy.

Contact: hello@getautomate.in
