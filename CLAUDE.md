# CLAUDE.md

Guidance for Claude Code when working in this repo. For current in-progress session state,
see `HANDOFF.md`.

## What this is
A static woodworking / interior-design portfolio site (Matthew Plaisance). No build step, no
framework — plain HTML/CSS/JS served as static files. Vendored libraries under `assets/vendors/`:
jQuery, Isotope (masonry grid), Owl Carousel, imagesLoaded, Magnific Popup, Bootstrap 4 grid.

## Architecture: data-driven projects
The portfolio is driven by **`data/projects.json`** — an array of project objects:
```json
{ "postId": "kitchen1", "title": "...", "description": "Kitchens", "className": "kitchens" }
```
- `postId` — unique id; also the image folder name.
- `title` — display title.
- `description` — used BOTH as the card's category label AND the detail page "Project type".
- `className` — Isotope filter class; MUST match a `data-filter` in `index.html`
  (current set: `kitchens`, `bathrooms`, `cabinets`, `commercial`).

### Page flow
- **`index.html`** — `assets/js/index.js` fetches `projects.json` and injects cards into
  `#work-grid` (Isotope), then wires the category filter tabs. The grid is empty in the HTML;
  it is populated by JS at runtime.
- **`project-detail.html`** — opened as `project-detail.html?project=<postId>`. `assets/js/project.js`
  reads the query param, finds the matching JSON entry, sets the title, fills info boxes (hiding any
  with no data), and paints img1/img2 + the before/after Owl carousel.
- **`assets/js/main.js`** — site-wide behavior (carousel init, menu, scroll, matchHeight, etc.).
  Runs before `index.js`/`project.js`.

### Image convention — `assets/img/projects/<postId>/`
- `index.*` — card thumbnail / first detail image.
- `index2.*`, `index3.*` — additional detail images.
- `mainbefore.*` / `mainafter.*` — detail carousel "before"/"after" slides.
- The JS tries multiple case + extension variants (`.JPG`/`.jpg`/`.png`) per image, so it works on
  case-sensitive hosts (Linux / GitHub Pages). When adding a project, create the folder + at least
  an `index.*`, and add an entry to `data/projects.json`.

## Running locally
Serve over HTTP — `file://` breaks `fetch()` of `projects.json`:
```
python -m http.server 8000   # then open http://localhost:8000/index.html
```

## Conventions / gotchas
- Files use **tabs** for indentation.
- No automated tests or linters — verify changes by serving the site and checking the browser.
- `index1.html` is a stale pre-refactor backup (references deleted `assets/img/job-*`); not linked.
- Keep `className` values in `projects.json` in sync with the `data-filter` values in `index.html`.
