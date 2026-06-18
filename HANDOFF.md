# Handoff — mpdesign portfolio refactor

> For the next Claude instance: read this, then continue. State as of 2026-06-18.
> Repo: `C:\Users\plaisancem\Documents\Dev\mpdesign` · branch `main` · **all work uncommitted**
> (only 2 prior commits, both "init"). Durable architecture notes live in `CLAUDE.md`.

## Project
Static woodworking/design portfolio (jQuery + Isotope grid + Owl Carousel, plain HTML/CSS).
Mid-refactor from **hardcoded project cards** to a **data-driven** model. See `CLAUDE.md` for
the architecture and image naming convention.

## What was done this session (all uncommitted)
1. **Killed fake data on detail pages** — `project-detail.html` had baked-in `Client: Brumely`,
   a fake date, and `Project type: Kitchen Remodel` that showed on *every* project (JSON has no
   client/date/type fields). Emptied those values and rewrote `assets/js/project.js` with a
   `fillInfobox()` helper that **populates from data or hides the infobox column** when empty.
   `Project type` falls back to the project's `description`. Net effect: Client/Date columns hide
   (no data), Project type shows the category.
2. **Removed 2 broken `<img src="">`** in the detail page (never wired → broken-image icons).
3. **Deleted `assets/css/added.css`** — dead file, not linked anywhere; its `.slider__item` rule
   already exists in `main.css` (~line 4672, which IS needed for carousel height — keep it).
4. **Fixed typos** in `data/projects.json` + `index.html`: Restruant→Restaurant, Modernn→Modern,
   Wordrobe→Wardrobe (2 spots), `__ wood` / `Custom __ Wood` placeholders → "Custom Wood…", and
   **`commerical`→`commercial`** synced across JSON className, JSON description, AND the
   `index.html` filter (`data-filter` + label) so filtering still works.
5. Removed duplicate commented-out bootstrap `<link>` lines in `index.html` `<head>`.

## Files touched
`assets/js/project.js`, `project-detail.html`, `data/projects.json`, `index.html`,
deleted `assets/css/added.css`.

## Verified
- `data/projects.json` valid, 9 projects, classNames `[bathrooms, cabinets, commercial, kitchens]`
  matching the 4 filters in `index.html`.
- All pages/scripts/JSON and sampled images return HTTP 200 via `python -m http.server`.
- **NOT visually confirmed in a browser** — user stopped before the final browser open.
  JS logic was traced by hand against the on-disk files.

## Known remaining issues / next steps (NOT done)
- **`bath2` has thin assets** — only `index.JPG` (+ a stray `IMG_6993.JPG`). No before/after or
  index2, so its detail carousel slide 2 / img2 fall back to the same image or stay blank.
  Needs real photos.
- **Lorem ipsum** still fills detail-page body paragraphs and the home About/Testimonials/textbox
  sections — placeholder copy, needs real content (left as-is; not a functional error).
- **Stray non-`index*` files** in project folders (e.g. `kitchen1/IMG_9439 copy.jpg.zip`, leftover
  `IMG_*.JPG`, `MP_Credenza...JPG`) — harmless but messy; cleanup candidates.
- **`index1.html`** (untracked) = original pre-refactor backup; still references deleted `job-*`
  images. Not linked anywhere; delete once the refactor is trusted.
- **Nothing is committed.** Suggest committing on a branch once visually verified.

## Run locally
Must be served over HTTP (the JS uses `fetch()`, which fails on `file://`):
```
cd C:\Users\plaisancem\Documents\Dev\mpdesign
python -m http.server 8000
# open http://localhost:8000/index.html
```
First visual check: all 9 cards appear in the grid; filter tabs (Kitchens / Bathrooms /
Cabinets / Commercial) work; clicking a card opens its detail page with images + before/after
carousel.
