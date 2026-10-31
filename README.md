# Amble Coffee

The website for Amble Coffee: a fast, dependency-free static site (plain HTML, CSS and a little JavaScript).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: hero, open-now badge, highlights, visit card, Instagram, newsletter |
| `menu.html` | Full menu with sticky section tabs |
| `story.html` | The name, the founding story, values, bean-to-cup |
| `visit.html` | Hours, map, FAQs, contact form |

Shared styles are in `assets/css/styles.css` (brand colours and fonts are defined at the top under `:root`), and behaviour is in `assets/js/main.js`.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Still to fill in

Placeholder text is marked with a dotted orange underline (`class="ph"`) so it's easy to spot on the page. Search the code for `ph"`, `TODO` and `PLACEHOLDER`.

- [ ] **Address**: home hero, visit card, visit page, footer (every page)
- [ ] **Email**: `hello@amblecoffee.com` is a guess; confirm it
- [ ] **Opening hours**: edit the `HOURS` object at the top of `assets/js/main.js`. Every hours table and the "Open now" badge update automatically.
- [ ] **Menu items and prices**: `menu.html`
- [ ] **Founding story**: `story.html`, "How it started"
- [ ] **FAQ answers**: `visit.html`
- [ ] **Photos**: each `<div class="photo ..." data-label="Photo · ...">` is a placeholder. Put an `<img src="..." alt="...">` inside it and the placeholder styling switches off automatically.
- [ ] **Map**: replace `.map-placeholder` with a Google Maps embed `<iframe>` for the real address
- [ ] **Forms**: set the `action` on the newsletter form (`index.html`) and contact form (`visit.html`) to a form service such as Formspree or Netlify Forms, or Mailchimp for the newsletter
- [ ] **Instagram tiles**: swap in real post images, or use an embed widget
- [ ] **Google listing data**: complete the JSON-LD block in `index.html` (address, phone, hours, geo)
- [ ] **Share image**: add `assets/img/og.jpg` (1200×630) and uncomment the `og:image` tag
- [ ] **Logo**: the cup mark is a stand-in. Drop in the real logo SVG if there is one.

## Deploying

The site is plain static files and can be hosted anywhere. Free options include GitHub Pages (Settings → Pages → deploy from branch), Netlify and Cloudflare Pages. Then point `amblecoffee.com` at the host.
