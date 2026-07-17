# Maresfield &amp; Vale — bespokehorsecum.store

A static, single-page **parody** storefront for a fictional luxury equine-genetics
house. Deadpan-realistic copy, responsive layout, accessible interactions, and
tasteful CSS/JS animations. No frameworks, no build step — just HTML, CSS, and
vanilla JavaScript.

> ⚠️ **Satire.** Maresfield &amp; Vale is not a real company. Nothing is sold,
> shipped, or exists. No payment is ever collected.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup |
| `styles.css` | Design tokens, layout, animations, responsive rules |
| `script.js` | Cart drawer, scroll reveals, count-up stats, waitlist form |
| `favicon.svg` | Site icon |
| `CNAME` | Custom domain for GitHub Pages (`bespokehorsecum.store`) |
| `.nojekyll` | Tells GitHub Pages to serve files as-is (skip Jekyll) |

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Deployed via GitHub Pages using **Deploy from a branch**:

1. Repo **Settings → Pages → Build and deployment**
2. **Source:** Deploy from a branch
3. **Branch:** `main`, folder `/ (root)` → **Save**

GitHub reads the `CNAME` file to apply the custom domain and issues an HTTPS
certificate once DNS resolves. Every push to `main` republishes automatically.

### DNS (Squarespace)

Point the domain at GitHub Pages:

**Apex (`bespokehorsecum.store`) — A records:**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**`www` — CNAME:** `joshkautz.github.io`

## Accessibility & performance notes

- Semantic landmarks, skip link, visible focus styles, `aria` on the cart dialog
- Keyboard-operable drawer with focus trap and `Esc` to close
- Honors `prefers-reduced-motion`
- No external JS/CSS dependencies except Google Fonts (with system fallbacks)
