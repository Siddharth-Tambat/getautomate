# getautomate.in — agent guide

`CLAUDE.md` is a symlink to this file; edit `AGENTS.md` only.

The public website for the AutoMate Android app (`in.getautomate.app`, Google Play, closed source). The app's code,
design spec and screenshots tooling live in the private `vt` repository (`Siddharth-Tambat/vt`).

## Rules
1. **Plain static site.** HTML and CSS in `site/`, a few lines of optional JavaScript (`site.js`). No build step, no
   frameworks, no web fonts, no analytics, no cookies, no third-party scripts or stylesheets. `scripts/check-site.py`
   enforces the external-asset part; run it before every commit.
2. **Dark brand only.** Colours are the app's tokens, mirrored in `:root` of `site/style.css`; the source of truth is
   vt's `docs/design/brand/`. One brand blue `#3B82F6` for actions; meaning colours only where they mean something
   (amber fuel/service, violet FASTag, green mileage/good); WCAG AA; never colour alone. The only outside colours
   are the Google Play logo's own. No new hex values without the owner's yes.
3. **Nothing the app doesn't really do.** Every claim, screenshot and policy line must match the shipping app.
   Check the vt code before changing copy. The privacy policy, Delete your data and the FAQ must stay in step with
   the app's permissions, Google services used and payment-notification rules (vt `ui/alerts/AGENTS.md`,
   `docs/play/`).
4. **Designs first.** Visible changes: show the owner A/B/C options (an interactive HTML mockup, desktop and phone
   width) and wait for the pick. Then build exactly what was picked.
5. **Phone and desktop both.** Check every page at 375px and at desktop width: no horizontal scroll, nothing
   clipped, touch targets 48px for buttons.
6. **Screenshots** come only from an emulator with vt's fictional demo garage (`scripts/screenshots.sh`), never the
   owner's phone. Look at each one for personal data before adding it. Stored as 450×1000 JPEGs in `site/img/`.
7. **No maker name.** The brand is "AutoMate"; contact is hello@getautomate.in.
8. **Google Play.** Until the app is live, the Play badge is a label ("Coming soon"), not a link. When it's live,
   link it to the listing and use Google's official badge.
9. **Secrets and personal data never go in commits** (keys, tokens, real plates, phone numbers, locations).

## Layout
- `site/index.html` home (design A, 17 Nov 2026): hero, Trips and Fuel bands, feature cards, screenshots, get the
  app, contact.
- `site/how-it-works.html`, `setup.html`, `faq.html`, `privacy.html` (Play's privacy policy URL),
  `delete-data.html` (Play's data deletion), `terms.html`, `404.html`.
- `site/img/icons.svg` sprite: the Material Icons the app uses (Apache 2.0) plus the app's toll-booth icon.
- `site/img/logo.svg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: the app's car icon.
- Header and footer are repeated in every page; change them in all pages together.

## Git
Personal GitHub account `Siddharth-Tambat` only (`gh auth switch --user Siddharth-Tambat`). Commit identity:
`Siddharth Tambat <83575017+Siddharth-Tambat@users.noreply.github.com>`. Conventional Commits, small. Push to `main`
only when the owner says so; `main` deploys to getautomate.in.
