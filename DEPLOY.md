# Deploying — GitHub Pages + custom domain

This is a plain static site (no build step), so GitHub Pages can serve the repo
root directly. Target: an **apex** custom domain (e.g. `example.com`) on the
existing repo **`matthewplaisance/mpdesign`**.

## 0. Registrar recommendation
You still need to buy a domain. Recommendations:

- **Cloudflare Registrar — cheapest.** Sells domains at wholesale cost (no
  renewal markup) and includes fast, free DNS. Best long-term price. When adding
  the GitHub records below, set them to **"DNS only" (grey cloud)** — not proxied
  (orange cloud) — so GitHub can verify the domain and issue the TLS cert.
- **Namecheap — simplest dashboard.** Slightly pricier but the most beginner-
  friendly DNS UI, with step-by-step GitHub Pages docs.

Either works. Pick a name, buy it, then come back for the DNS step.

## 1. Enable GitHub Pages (one time)
On the existing repo:
- GitHub → repo **Settings → Pages**
- **Source:** "Deploy from a branch"
- **Branch:** `main`, folder `/ (root)` → Save

After the first push (see §4) the site goes live at the default URL
`https://matthewplaisance.github.io/mpdesign/` within a minute or two. Confirm it
works there *before* attaching the domain — it isolates DNS issues from site
issues.

(CLI equivalent, since `gh` is authenticated:)
```
gh api -X POST repos/matthewplaisance/mpdesign/pages \
  -f source.branch=main -f source.path=/
```

## 2. Point the apex domain at GitHub (DNS)
In your registrar's DNS settings for the domain, add:

**Four A records** (apex `@`) → GitHub Pages IPv4:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
**Four AAAA records** (apex `@`) → GitHub Pages IPv6 (recommended):
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```
**One CNAME record** for `www` → `matthewplaisance.github.io.`
(so `www.example.com` redirects to the apex).

DNS can take from minutes up to ~24h to propagate.

## 3. Tell GitHub the custom domain
- Settings → Pages → **Custom domain** → enter `example.com` → Save.
  This writes a `CNAME` file to the repo root (or add it yourself — see below).
- Wait for the green "DNS check successful".
- Tick **Enforce HTTPS** (may take a few minutes after the check passes while the
  cert is issued).

The repo needs a `CNAME` file at the root containing exactly the apex domain, e.g.:
```
example.com
```
I'll create this for you once you've chosen the name (a wrong value breaks Pages,
so it isn't pre-filled).

## 4. Push the current site
All the recent work is currently uncommitted. To publish it:
```
git add -A
git commit -m "Deploy-ready: mobile + UX cleanups, search, branding"
git push origin main
```
GitHub Pages rebuilds automatically on every push to `main`.

## Notes / gotchas
- `.nojekyll` is already in the repo root so Pages serves files as-is (no Jekyll
  processing of `assets/vendors/`).
- All asset/link paths are relative, so the site works at both the `github.io`
  subpath and the apex root with no changes.
- If you later want the domain to be the *only* URL, that's the default once the
  custom domain + HTTPS are set; the `github.io` URL will redirect to it.
