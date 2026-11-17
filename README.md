# getautomate.in

The website for **AutoMate**, an Android app for your car, bike or scooter: trips that record themselves, fill-ups
from payment notifications, mileage, FASTag tolls, expenses and service reminders. The app itself is closed source
and lives in a separate private repository.

- `site/` is the whole website: plain HTML and CSS, no build step, no trackers, no third-party scripts or fonts.
- `scripts/check-site.py site` checks links, anchors, titles, descriptions, external assets and `CNAME`.
- `.github/workflows/site.yml` runs the check on every push and pull request, and deploys `site/` to GitHub Pages
  from `main`. The custom domain is `getautomate.in` (`site/CNAME`).

Preview locally:

```bash
python3 -m http.server 8767 --directory site
```

Contact: hello@getautomate.in
