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
| `.github/workflows/deploy.yml` | Enables + deploys GitHub Pages on push to `main` |

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow, which enables GitHub
Pages (if needed) and publishes the site. The `CNAME` file wires it to the
custom domain.

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
