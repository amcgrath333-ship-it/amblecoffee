# Amble Coffee

The website for Amble Coffee: a fast, dependency-free static site (plain HTML, CSS and a little JavaScript).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: hero, open-now badge, highlights, visit card, Instagram, newsletter |
| `menu.html` | Full menu with sticky section tabs |
| `story.html` | The name, the founding story, values, bean-to-cup |
| `visit.html` | Hours, map, FAQs, contact form |
| `careers.html` | Careers (`careers/` redirects here from the old WordPress URL) |
| `404.html` | Friendly "wandered off" page |

Shared styles are in `assets/css/styles.css` (brand colours and fonts are defined at the top under `:root`), and behaviour is in `assets/js/main.js`.

The look is taken from the café itself: the sage bird logo (`assets/img/bird.svg`, traced from the old site's icon), green tile, white shiplap and pale pine. The photos in `assets/img/` come from the previous amblecoffee.com.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Still to fill in

Placeholder text is marked with a dotted orange underline (`class="ph"`) so it's easy to spot on the page. Search the code for `ph"`, `TODO` and `PLACEHOLDER`.

- [ ] **Café address**: home hero, visit card, visit page, footer (every page)
- [ ] **Opening hours**: edit the `HOURS` object at the top of `assets/js/main.js`. Every hours table and the "Open now" badge update automatically.
- [ ] **General contact email**: the contact form needs a destination (careers@amblecoffee.com is real and already used)
- [ ] **Menu items and prices**: `menu.html` (everything there is an example)
- [ ] **Story**: optional line about who's behind Amble and when the café opened (`story.html`)
- [ ] **FAQ answers**: `visit.html`
- [ ] **Careers bullets**: `careers.html`, "Join the team"
- [ ] **More photos**: the coloured blocks (menu cards, Instagram tiles) are placeholders. Put an `<img src="..." alt="...">` inside the `.photo` div and the placeholder styling switches off automatically.
- [ ] **Map**: replace `.map-placeholder` with a Google Maps embed `<iframe>` for the café
- [ ] **Forms**: set the `action` on the newsletter form (`index.html`) and contact form (`visit.html`) to a form service such as Formspree or Netlify Forms, or Mailchimp for the newsletter
- [ ] **Google listing data**: add address, phone and hours to the JSON-LD block in `index.html`

## Deploying

The site is plain static files and can be hosted anywhere. Free options include GitHub Pages (Settings → Pages → deploy from branch), Netlify and Cloudflare Pages. Then point `amblecoffee.com` at the host.
