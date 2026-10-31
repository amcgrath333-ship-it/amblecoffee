# Amble Coffee

A dark, golden-hour website for Amble Coffee: hand-written HTML, CSS and vanilla JavaScript, with no build step and no dependencies.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: full-height hero, scroll-lit manifesto, made-in-house collage, signature menu with hover photos, horizontal "day at Amble", catering band, visit and map, Instagram |
| `menu.html` | Full menu with sticky section tabs |
| `story.html` | The Amble story (copy from the original site), values, how it's made |
| `catering.html` | Packages, how it works, FAQ, enquiry form |
| `visit.html` | Address, hours, map, FAQ, contact form |
| `careers.html` | Careers (`careers/` redirects here from the old WordPress URL) |
| `404.html` | "You've wandered off" |

- **Styles:** `assets/css/styles.css`. All colours, fonts and easing are tokens at the top.
- **Behaviour:** `assets/js/main.js` (intro, header, reveals, parallax, hover images, horizontal scroll, hours).
- **Fonts:** Instrument Serif (display) and Manrope (text, the original site's typeface), from Google Fonts.
- **Logo:** the original Amble bird (`assets/img/bird.svg`, from the old site's icon set), used as a mask so it can take any colour. The favicons are the originals too.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Invented content to replace

The following are made up so the site reads as finished. Swap in the real details before launch:

- **Address**: `8120 Riverbend Lane, Chilliwack, BC V2P 0A1`. Change it in every page footer, the visit blocks (`index.html`, `visit.html`), the JSON-LD block in `index.html` and the map `iframe` query.
- **Phone**: `(604) 555-0187` (a 555 number, not real)
- **Email**: `hello@amblecoffee.com` (`careers@amblecoffee.com` is real)
- **Hours**: the `HOURS` object at the top of `assets/js/main.js`. Every table and "Open now" status updates from it. Also update `openingHours` in the JSON-LD.
- **Menu items and prices** (`menu.html`, plus the signatures on `index.html`)
- **Catering packages and prices**, **FAQ answers** and **careers perks**
- **Forms**: set each form's `action` to a service such as Formspree or Netlify Forms (catering, contact, newsletter). Until then they show a thank-you message only.

## Photos

Most photography is free stock from Unsplash and Pexels, colour-graded to match (see `CREDITS.md`). `cafe-bar` and `cafe-barista` are Amble's own photos from the previous site. Replace any of them by keeping the same filenames and sizes.
