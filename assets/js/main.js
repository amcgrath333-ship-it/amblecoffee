/* Amble Coffee — interactions. Vanilla, no dependencies. */

/* --------------------------------------------------------------------------
   Opening hours: the one place to edit them. Every hours table and every
   "open now" status reads from here. 24h "HH:MM", or null when closed.
   -------------------------------------------------------------------------- */
const HOURS = {
  mon: ["07:00", "17:00"],
  tue: ["07:00", "17:00"],
  wed: ["07:00", "17:00"],
  thu: ["07:00", "17:00"],
  fri: ["07:00", "17:00"],
  sat: ["08:00", "17:00"],
  sun: ["08:00", "16:00"],
};

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_NAMES = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

root.classList.remove("no-js");

/* Preloader: plays once per visit, then the curtain lifts. */
function initPreloader() {
  const pre = document.querySelector(".preloader");
  if (!pre) return;
  let seen = false;
  try { seen = sessionStorage.getItem("amble-intro") === "1"; } catch {}
  if (seen || reduceMotion) {
    pre.classList.add("is-skipped");
    return;
  }
  document.body.classList.add("is-locked");
  window.addEventListener("load", () => {
    setTimeout(() => {
      pre.classList.add("is-done");
      document.body.classList.remove("is-locked");
      try { sessionStorage.setItem("amble-intro", "1"); } catch {}
      setTimeout(() => pre.classList.add("is-skipped"), 1400);
    }, 1300);
  });
}

/* Header: goes solid after the hero, hides on scroll down, returns on scroll up. */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    const hide = y > last && y > 400 && !document.body.classList.contains("menu-open");
    header.classList.toggle("is-hidden", hide);
    document.body.classList.toggle("header-visible", !hide && y > 40);
    last = y;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;
  const label = toggle.querySelector(".txt");
  const setOpen = (open) => {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("is-locked", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  document.querySelectorAll(".menu-overlay a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

/* Wrap each word of .split headings so they can rise into place. */
function splitHeadings() {
  document.querySelectorAll(".split").forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w";
            const s = document.createElement("span");
            s.textContent = part;
            w.appendChild(s);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.classList.contains("w")) {
          walk(child);
        }
      });
    };
    walk(el);
    el.querySelectorAll(".w > span").forEach((s, i) => (s.style.transitionDelay = `${Math.min(i * 0.06, 0.9)}s`));
  });
}

/* One observer drives .reveal, .split and .wipe entrances. */
function initReveals() {
  const items = document.querySelectorAll(".reveal, .split, .media.wipe");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }),
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
}

/* Scroll-linked effects share one rAF loop: parallax, lit words, horizontal track. */
function initScrollEffects() {
  if (reduceMotion) return;
  const parallax = [...document.querySelectorAll("[data-parallax] img")];

  // Manifesto: words light up as the paragraph passes through the viewport.
  const litWords = [];
  document.querySelectorAll(".lit").forEach((el) => {
    const accents = (el.dataset.accent || "").split(",").map((s) => s.trim().toLowerCase());
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => {
      const clean = w.toLowerCase().replace(/[^a-z']/g, "");
      return `<span class="word${accents.includes(clean) ? " accent" : ""}">${w}</span>`;
    }).join(" ");
    litWords.push({ el, words: [...el.querySelectorAll(".word")] });
  });

  // Horizontal track: section height grows so vertical scroll drives sideways motion.
  const hs = document.querySelector(".hscroll");
  const track = hs && hs.querySelector(".hscroll-track");
  const bar = hs && hs.querySelector(".hscroll-progress i");
  const mq = window.matchMedia("(max-width: 860px)");
  const sizeTrack = () => {
    if (!hs) return;
    if (mq.matches) { hs.style.height = ""; return; }
    const dist = track.scrollWidth - window.innerWidth;
    hs.style.height = `${window.innerHeight + Math.max(dist, 0)}px`;
  };
  sizeTrack();
  window.addEventListener("resize", sizeTrack);
  window.addEventListener("load", sizeTrack);

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    parallax.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh + r.height);
      img.style.transform = `translate3d(0, ${(-p * 18 - 9).toFixed(2)}%, 0)`;
    });

    litWords.forEach(({ el, words }) => {
      const r = el.getBoundingClientRect();
      const p = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    });

    if (hs && !mq.matches) {
      const r = hs.getBoundingClientRect();
      const dist = track.scrollWidth - window.innerWidth;
      const p = Math.min(Math.max(-r.top / (r.height - vh), 0), 1);
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

/* Signature list: a floating photo follows the cursor over each item. */
function initHoverImages() {
  const list = document.querySelector(".sig-list");
  const float = document.querySelector(".sig-float");
  if (!list || !float || !window.matchMedia("(hover: hover)").matches) return;
  const imgs = [...float.querySelectorAll("img")];
  let x = 0, y = 0, cx = 0, cy = 0, raf = null;
  const loop = () => {
    cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
    float.style.left = `${cx}px`; float.style.top = `${cy}px`;
    raf = requestAnimationFrame(loop);
  };
  list.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
  list.querySelectorAll(".sig-item").forEach((item, i) => {
    item.addEventListener("mouseenter", (e) => {
      if (!raf) { cx = x = e.clientX; cy = y = e.clientY; loop(); }
      float.classList.add("is-on");
      imgs.forEach((im, j) => im.classList.toggle("is-on", i === j));
    });
  });
  list.addEventListener("mouseleave", () => {
    float.classList.remove("is-on");
    cancelAnimationFrame(raf); raf = null;
  });
}

/* Hours tables + open/closed status. */
const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fmt = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""}${h >= 12 ? "pm" : "am"}`;
};
function renderHours() {
  const now = new Date();
  const today = DAYS[now.getDay()];
  document.querySelectorAll("[data-hours]").forEach((t) => {
    t.innerHTML = "<tbody>" + WEEK.map((d) => {
      const s = HOURS[d];
      return `<tr${d === today ? ' class="is-today"' : ""}><td>${DAY_NAMES[d]}</td><td>${s ? `${fmt(s[0])} – ${fmt(s[1])}` : "Closed"}</td></tr>`;
    }).join("") + "</tbody>";
  });

  const mins = now.getHours() * 60 + now.getMinutes();
  const span = HOURS[today];
  const open = span && mins >= toMin(span[0]) && mins < toMin(span[1]);
  let text = "";
  if (open) {
    text = `Open now · until ${fmt(span[1])}`;
  } else {
    for (let i = 0; i < 8; i++) {
      const d = DAYS[(now.getDay() + i) % 7];
      const s = HOURS[d];
      if (!s || (i === 0 && mins >= toMin(s[0]))) continue;
      text = `Closed · opens ${i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_NAMES[d]} at ${fmt(s[0])}`;
      break;
    }
  }
  document.querySelectorAll("[data-status]").forEach((el) => {
    el.textContent = text;
    el.classList.add("status", open ? "is-open" : "is-closed");
  });
}

/* Menu page: highlight the section in view. */
function initMenuNav() {
  const links = [...document.querySelectorAll(".menu-nav a")];
  if (!links.length) return;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => {
        const on = l.getAttribute("href") === `#${e.target.id}`;
        l.classList.toggle("is-active", on);
        if (on) l.scrollIntoView({ block: "nearest", inline: "center" });
      });
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  links.forEach((l) => { const s = document.querySelector(l.getAttribute("href")); if (s) io.observe(s); });
}

/* Forms post to their `action` (Formspree, Netlify, Mailchimp…). Until one is
   set they just thank the visitor so the page can be reviewed end to end. */
function initForms() {
  document.querySelectorAll("form[data-async]").forEach((form) => {
    const note = form.querySelector(".form-note");
    const say = (m) => { if (note) note.textContent = m; };
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = form.getAttribute("action");
      if (!action || action === "#") { say(form.dataset.success || "Thank you."); form.reset(); return; }
      say("Sending…");
      try {
        const res = await fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
        say(form.dataset.success || "Thank you."); form.reset();
      } catch { say("Something went wrong. Please email hello@amblecoffee.com."); }
    });
  });
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
initPreloader();
splitHeadings();
initHeader();
initReveals();
initScrollEffects();
initHoverImages();
renderHours();
initMenuNav();
initForms();
