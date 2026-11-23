# getautomate.in — agent guide

`CLAUDE.md` is a symlink to this file; edit `AGENTS.md` only.

The public website for the AutoMate Android app (`in.getautomate.app`, Google Play, closed source). The app's code,
design spec and screenshots tooling live in the private `vt` repository (`Siddharth-Tambat/vt`).

## Rules
1. **Plain static site.** HTML and CSS in `site/`, a few lines of optional JavaScript (`site.js`). No build step, no
   frameworks, no web fonts, no analytics, no cookies, no third-party scripts or stylesheets (exception: the owner-approved, click-to-load YouTube overview iframe). `scripts/check-site.py`
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
11. **Pricing** (owner, 18 Nov 2026; free limit 50 since 23 Nov): three plans. Free: first 50 trips, and Expenses, fuel, FASTag and Garage always;
   trips after 50 are saved but locked. Monthly ₹69 or Lifetime ₹999 once, through Google Play, unlock all trips. Launch offer: lifetime ₹799 (20% off) until 31 Dec 2026, 23:59 IST; `site.js` hides the offer after that
   and the static HTML must then be changed back to ₹999 only. Prices appear in the home pricing section, FAQ and
   Terms; change them together and only to match the Play Console.

12. **Few indexed pages** (owner, 18 Nov 2026). Google indexing was requested for four URLs: `/`, `pricing.html`,
   `how-it-works.html`, `faq.html` (sitemap submitted in Search Console the same day). Put new content into these
   four pages first. Add a page only when it truly needs its own URL; then add it to `sitemap.xml` and tell the
   owner to request indexing for it in Search Console (URL inspection → Request indexing).

## Layout
- `site/index.html` home: approved cinematic trip story A (23 Nov 2026), Trips and Fuel bands, feature cards, screenshots, pricing
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
- `site/img/icons.svg` sprite: the Material Icons the app uses (Apache 2.0) plus the app's toll-booth icon. Pages
  inline the symbols they use in a hidden `<svg class="sprite">` after `<body>` (`<use href="#id">`); copy a symbol
  from the sprite when a page needs a new one.
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

## Cinematic trip story (23 Nov 2026)
Home uses `trip-story.css` (scoped to `#trip-story`) and `trip-story.js`, plain SVG/JS without external assets.
Owner picked inline B. Scrolling starts and reverses the drive directly; there is no Start/Restart button.
One sticky scene pins below the 68px desktop / 60px phone header. Its height is the remaining small viewport.
Grid/flex layout separates the information panel, map and compact Trips-style distance/time/cost tiles.
The padded SVG route viewBox keeps the car visible. The route finishes at 78% of the scroll section;
the final 22% holds the completed summary without trapping scroll. Without JS there is no long empty scroll.

Fictional values: 42 km / 48 driving minutes; estimated fuel 3.36 L at ₹100/L = ₹336, toll ₹85, trip cost ₹421.
Fuel bought ₹2,000 is a separate expense and requires confirmation. No real coordinates or Google tiles.
Material icons come from the existing sprite (plus a clock); amber fuel and violet toll match the cost bar.
The local AutoMate logo asset sits inside the map bottom-right. No new palette colours or external brands.

Map receipts fade after 3.2 seconds: toll −₹85; fuel payment then “Expense added” only after confirmation;
arrival then “Trip logged”. Positions are cached per landmark/map geometry and remain still as the car moves.
Preferred sides: toll right, fuel left, destination above. Collision checks reserve clearance around the
entire route, markers and logo. Suppress receipts if a constrained window has no clear position.
Reduced motion disables receipt transitions. Counter row is transparent; no “Scroll to travel” or star.
Keep the unstarred estimate/setup disclosure in the footer.

Phones use a fixed compact chapter header, larger map and three tiles, without a nested panel scroller.
The full mobile cost breakdown follows the pinned drive in normal page flow; desktop keeps it inline.
Check both summaries if changing shared values. Check narrow/short viewports, forward/backward scrolling,
stationary receipt positions and the no-JS fallback before deployment. Pages deploys from main.

## YouTube overview (owner selected A)
Home has an opening Watch AutoMate button and a portrait preview after the drive and trust badges, before the feature overview. `video.css` and `video.js` implement a native modal dialog. The local poster uses the fictional trip screenshot as an app preview, not a claimed video frame. Only a click inserts the `youtube-nocookie.com` player for `iyXuofIsjlo`; no autoplay or external thumbnail. Escape/Close removes the iframe and restores focus without scrolling. Keep the optional Watch on YouTube link and privacy-page disclosure in sync. Deployment follows the Pages workflow on main.

Pinned summary fit: the desktop information panel has no independent scroller. If the final breakdown exceeds available scene height, `fitSummary` moves the cost breakdown to the existing normal-flow summary below the drive. Recheck after resizing and at short desktop heights; never hide a scrollbar while leaving content clipped.

Combined polish (owner, 23 Nov): trust badges appear directly after the drive/mobile summary and before the video. Shared section spacing is 64px desktop / 40px phone; video padding is 32px desktop / 24px phone, with 24px / 16px before Simple. Document headings and page introductions use tighter shared spacing. Summary fit removes nested desktop scrolling and shows the full breakdown below the drive when necessary. Owner approved deployment after localhost review.

## Asset cache consistency
GitHub Pages caches CSS/JS for ten minutes. Run `python3 scripts/version-assets.py` after editing assets, before the site check and commit. It updates local CSS/JS references in every HTML page with content hashes. CI runs `--check` to reject stale references, preventing an updated page from loading a prior deployment’s cached stylesheet/script. Do not ask visitors to routinely hard-refresh as the release mechanism.

## Split phone and map homepage (23 Nov 2026)
Owner approved B and authorized publishing this revision. Desktop has one static enlarged headline and supporting line above an app-inspired phone and live stats on the left, with the original SVG map on the right. Existing car, fuel/toll markers, route and collision-aware landmark tooltips are reused; Meadow Park and River Road are fictional labels. Four scroll stages: recording, toll, fuel payment to review, saved. The final fifth of the scroll holds the summary. Tooltips explicitly attribute detected payments to AutoMate. There is no detached phone notification or confirmation action: the fuel payment remains ready to review. ₹2,000 purchased fuel stays separate from ₹421 estimated trip cost (₹336 fuel + ₹85 toll). No nested scroll containers.

At 700px and below, skip the whole pinned drive/app simulation and its scroll runway. Retain the headline and explanation, followed immediately by video and content. The home-only Watch · 30 sec navigation control opens the existing click-to-load video dialog. Benefits are four aligned cards: trips, costs, local records, and “Learns as you go” (familiar places and recurring trip tags only; no general AI or cloud profiling claim). Four columns on wide desktops, two at mid widths, one on phones. Trips/Fuel kicker labels are larger. Existing video, features, pricing and support remain. Check mobile header fit, video open/close, forward/backward milestones and anchored tooltips before deployment.
