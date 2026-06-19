# ARI — Applied Research Institute · Website Rebuild

A premium, static, **plain HTML / CSS / JS** rebuild of the ARI website, built from the
*Rebuild & Handoff Guide* and the **ARI Brand Guidelines** (June 2026). Every page uses
real, crawlable HTML (no text baked into images), semantic markup, accessible patterns,
and a shared design system — so it previews instantly today and maps cleanly onto **Wix**
(sections + CMS collections) tomorrow.

> **Tagline:** *“Because the warfighter can't wait.”*
> **Mission:** *We catalyze opportunities that enhance national security and drive economic prosperity.*

---

## Quick start (local preview)

The site uses **root-absolute paths** (`/assets/...`, `/about.html`) so the header, footer,
and assets are byte-identical on every page, including those in subfolders. Because of that,
open it through a local web server (not `file://`):

```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000/
```

Any static server works (`npx serve`, VS Code Live Server, etc.). When deployed at a domain
root (or on Wix), the same absolute paths resolve correctly.

---

## Brand system (from ARI Brand Guidelines)

| Token | Value | Use |
|-------|-------|-----|
| Navy | `#1F3655` | Primary brand / text on light |
| Navy (deep / near-black) | `#16273F` / `#0E1B2C` | Dark sections, hero |
| Light Green | `#3BAE48` | Primary accent, highlights |
| Medium Green | `#007941` | Buttons, links |
| Grey | `#808285` | Muted text, fine print |
| Gradients | navy → green | Hero, CTA bands |

- **Typeface:** Plus Jakarta Sans (Extra Light → Extra Bold), loaded from Google Fonts.
- **Type hierarchy:** Level 1 titles (Bold/Extrabold) · Level 2 subtitles (Semi Bold/Medium)
  · Level 3 body (Regular/Light) · Level 4 fine print (Extra Light).
- **Logo:** the `ARI` wordmark is rendered in the brand typeface (ExtraBold Italic) via the
  `.logo-mark` class, so it's crisp at any size and recolorable. **Swap in the official vector
  logo** (SVG) when available — replace the `<span class="logo-mark">ARI</span>` in the header
  and footer.

All tokens live as CSS custom properties at the top of `assets/css/styles.css`.

---

## Project structure

```
/
├── index.html                  Home
├── about.html                  About (mission, principles, history, leadership)
├── initiatives.html            Programs & Initiatives (filterable cards + process)
├── markets.html                Markets & Capabilities (10 crawlable domains)
├── impact.html                 Impact dashboard (metrics, RAM results, tech hubs)
├── insights.html               Press & Insights index (featured + cards + newsletter)
├── events.html                 Events (featured, upcoming, past, filters)
├── contact.html                Contact / Partner (form, info, map)
├── 404.html                    Not-found page
├── robots.txt, sitemap.xml     SEO
├── insights/                   Article pages
│   ├── ari-affirms-acquisition-transformation-memorandum.html
│   ├── heartland-bioworks-headquarters.html
│   ├── andrew-kossack-ceo.html
│   ├── midwest-tech-hubs-economic-growth.html
│   └── ram-prototype-followon-awards.html
├── policies/                   Legal
│   ├── privacy.html
│   ├── cookie.html
│   └── terms.html
└── assets/
    ├── css/styles.css          The entire design system (tokens + components)
    ├── js/main.js              Nav, mega-menu, scroll-reveal, counters, forms
    └── img/                    favicon.svg, og-default.svg
```

---

## Design-system components (in `styles.css`)

Reusable, class-driven building blocks — reuse these rather than writing new CSS:

- **Layout:** `.container` (+`--narrow`), `.section` (+`--mist`/`--ink`/`--navy`/`--tight`),
  `.grid` `.grid-2/3/4`, `.section-head`.
- **Type:** `.eyebrow`, `.lede`, `.text-accent`, `.prose` (article/policy bodies).
- **Hero:** `.hero` (home split layout) and `.hero--page` (interior pages, with `.crumbs`).
- **Buttons/links:** `.btn` (`--primary/--accent/--dark/--ghost/--on-dark/--lg/--block`),
  `.link-arrow`.
- **Cards:** `.card`, `.pillar`, `.init-card`, `.market-card`, `.metric`, `.person`,
  `.article-card`, `.feature-article`, `.event`, `.event-feature`, `.tag`, `.status-dot`.
- **Data:** `.stat-ribbon`/`.stat`, `.metric`, `.pullstat`, `.timeline`, `.steps`/`.step`.
- **Forms:** `.form`, `.field`, `.form-row`, `.newsletter`, `.form-status`.
- **Bands:** `.cta-band`, `.newsletter`.

### Animated number counters
Any element with `data-count` animates up when scrolled into view:

```html
<span data-count="450" data-prefix="$" data-suffix="M+" data-decimals="0">$450M+</span>
```

### Forms (important for launch)
Forms carrying the `data-demo` attribute are handled **front-end only** — they show a
confirmation and clear, with **no backend**. Before launch, wire these to **Wix Forms** or a
**Velo** backend that posts to ARI's CRM / email platform. See the note in `assets/js/main.js`.

---

## Accessibility & SEO

- Semantic landmarks (`<header>`, `<main id="main">`, `<nav>`, `<footer>`), skip link, one
  `<h1>` per page, proper heading order, labeled form fields, `aria-current` on the active nav
  item, keyboard-operable menu, and `prefers-reduced-motion` support.
- Per-page unique `<title>` + meta description, canonical URLs, Open Graph + Twitter cards,
  and JSON-LD (Organization on Home; Article on posts; Event on the featured event).
- `robots.txt` + `sitemap.xml` included.

---

## Migrating to Wix

This codebase is built to translate cleanly:

1. **Global header/footer → Wix site header/footer.** They're identical on every page here;
   rebuild once as Wix global sections.
2. **Repeating cards → Wix CMS collections.** The patterns below are intentionally uniform so
   each becomes a collection + repeater:
   - `Initiatives` (title, slug, category, status, summary, link) → `.init-card`
   - `Markets` (name, slug, summary, related initiatives) → `.market-card`
   - `Insights` (title, slug, category, date, read time, excerpt, body) → `.article-card`
   - `Events` (name, date, location, audience, tags, registration URL) → `.event`
   - `Leadership` (name, title, bio, photo, LinkedIn) → `.person`
3. **Section-by-section** the HTML maps 1:1 to Wix sections (hero, mission, pillars, grids,
   dashboard, newsletter, CTA). Colors/fonts above are the values to set in the Wix theme.
4. **Forms** → Wix Forms / Velo + CRM.

---

## Content notes (verify before publishing)

Most copy is drawn directly from the existing site and the handoff guide. A few items are
**placeholders or need verification**:

- **Impact metrics** (network size, jobs, procurement timeline, funding, economic impact) and
  the RAM/tech-hub figures come from ARI reporting and press releases summarized in the handoff
  guide — confirm against the latest source data. A methodology note is included on `impact.html`.
- **Events** listings are illustrative placeholders pending real event data / CMS.
- **Social, email, and map** links use sensible defaults (`theari.us`, `16 Tech Innovation
  District`) — confirm handles and addresses.
- **Leadership bios** are concise paraphrases; replace with approved bios + real headshots
  (currently shown as initials avatars).
- **Policy pages** are templates and should be reviewed by legal counsel.
- Replace the wordmark with the **official ARI vector logo** when available.

---

*Built as a handoff-ready reference implementation of the ARI Brand Guidelines.*
