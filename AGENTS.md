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
   are the Google Play logo's own and the small Indian flag in the footer (official colours). No new hex values without the owner's yes.
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
9. **Public repo: secrets and personal data never go in commits** (keys, tokens, names, emails, real plates, phone
   numbers, locations, screenshots from a real phone). Check `git diff --cached` before every commit; run
   `gitleaks git --redact` if it's installed.
10. **Voice.** "A mate for your auto": tracks trips and spending automatically, easy to set up, no extra device.
   Plain, friendly, exact (vt `docs/design/brand/personality.md`). Sentence case, no exclamation marks.
11. **Pricing** (owner, 18 Nov 2026): three plans. Free: first 99 trips, and Expenses, fuel, FASTag and Garage always;
   trips after 99 are saved but locked. Monthly ₹69 or Lifetime ₹999 once, through Google Play, unlock all trips. Launch offer: lifetime ₹799 (20% off) until 31 Dec 2026, 23:59 IST; `site.js` hides the offer after that
   and the static HTML must then be changed back to ₹999 only. Prices appear in the home pricing section, FAQ and
   Terms; change them together and only to match the Play Console.

12. **Few indexed pages** (owner, 18 Nov 2026). Google indexing was requested for four URLs: `/`, `pricing.html`,
   `how-it-works.html`, `faq.html` (sitemap submitted in Search Console the same day). Put new content into these
   four pages first. Add a page only when it truly needs its own URL; then add it to `sitemap.xml` and tell the
   owner to request indexing for it in Search Console (URL inspection → Request indexing).

## Layout
- `site/index.html` home (design A, 17 Nov 2026): hero, Trips and Fuel bands, feature cards, screenshots, pricing
  (`#pricing`), get the app, contact.
- `site/pricing.html` (plan cards, comparison table, pricing FAQ; must match vt `docs/design/pricing-plan.md`),
  `roadmap.html` (public "Coming next" / "Exploring"; only items the owner has agreed to show, no dates).
- `site/how-it-works.html`, `setup.html`, `faq.html`, `privacy.html` (Play's privacy policy URL),
  `delete-data.html` (Play's data deletion), `terms.html`, `404.html`.
- SEO: every page has a canonical URL, Open Graph + Twitter tags and the share image `img/og.jpg` (1200×630);
  JSON-LD on `index.html` (Organization, WebSite, MobileApplication with the three prices) and `faq.html`
  (FAQPage, built from the page's questions; regenerate it when questions change). `sitemap.xml` lists every page
  but 404 (the check enforces it), `robots.txt`, `manifest.webmanifest`. `llms.txt` (llmstxt.org format) is a plain summary for AI assistants: keep its facts and prices in step with
  the pages, like the FAQ. Screenshots ship as WebP in `<picture>`
  with the JPEG as fallback; make both (`cwebp -q 80`).
- Motion (`site.js` + `style.css`): blocks fade up on scroll, cards lift on hover, the hero phones rise in and a
  copy of the app's real payment notification (demo data) drops in. All off under `prefers-reduced-motion`, and
  everything is visible without JavaScript.
- `site/img/icons.svg` sprite: the Material Icons the app uses (Apache 2.0) plus the app's toll-booth icon.
- `site/img/logo.svg`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`: the app's car icon.
- Header and footer are repeated in every page; change them in all pages together.

## Git
The owner's personal GitHub account only, never a work account: check `gh auth status` and switch before any push or
`gh` call. Commit identity: the GitHub noreply address set in `git config --local` (same as the vt repo).
Conventional Commits, small. Push to `main` only when the owner says so; `main` deploys to getautomate.in.

## Repository settings (public repo, keep them)
Set 18 Nov 2026; don't loosen without the owner's yes. Only the owner has write access. Ruleset "Protect main":
no force-push, no deletion. The `github-pages` environment deploys from `main` only. Fork pull requests wait for
approval to run workflows (all outside contributors). Actions: GitHub-owned only, pinned by full SHA. Default
workflow token is read-only. Wiki and projects off. Secret scanning, push protection and Dependabot alerts on.
