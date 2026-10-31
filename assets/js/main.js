/* Amble Coffee — site behaviour. No dependencies. */

/* --------------------------------------------------------------------------
   Opening hours: the single source of truth. Every hours table and the
   "open now" badge read from here. 24h "HH:MM", or null when closed.
   PLACEHOLDER — replace with real hours.
   -------------------------------------------------------------------------- */
const HOURS = {
  mon: ["07:00", "15:00"],
  tue: ["07:00", "15:00"],
  wed: ["07:00", "15:00"],
  thu: ["07:00", "15:00"],
  fri: ["07:00", "15:00"],
  sat: ["08:00", "16:00"],
  sun: ["08:00", "14:00"],
};

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_NAMES = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };

document.documentElement.classList.remove("no-js");

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const formatTime = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
};

function renderHours() {
  const today = DAYS[new Date().getDay()];

  document.querySelectorAll("[data-hours]").forEach((table) => {
    const rows = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => {
      const span = HOURS[day];
      const time = span ? `${formatTime(span[0])} – ${formatTime(span[1])}` : "Closed";
      return `<tr${day === today ? ' class="is-today"' : ""}><td>${DAY_NAMES[day]}</td><td>${time}</td></tr>`;
    });
    table.innerHTML = `<tbody>${rows.join("")}</tbody>`;
  });

  document.querySelectorAll("[data-open-badge]").forEach((badge) => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const span = HOURS[today];
    const open = span && mins >= toMinutes(span[0]) && mins < toMinutes(span[1]);

    if (open) {
      badge.textContent = `Open now · until ${formatTime(span[1])}`;
      badge.classList.add("is-open");
      return;
    }
    // Find the next opening time, looking up to a week ahead.
    for (let i = 0; i < 8; i++) {
      const day = DAYS[(now.getDay() + i) % 7];
      const s = HOURS[day];
      if (!s || (i === 0 && mins >= toMinutes(s[0]))) continue;
      const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_NAMES[day];
      badge.textContent = `Closed · opens ${when} at ${formatTime(s[0])}`;
      break;
    }
    badge.classList.add("is-closed");
  });
}

function initNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  if (!header) return;

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!toggle) return;
  const setOpen = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  items.forEach((el) => io.observe(el));
}

/* Highlights the menu tab for the section currently in view. */
function initMenuTabs() {
  const tabs = [...document.querySelectorAll(".menu-tabs a")];
  if (!tabs.length) return;
  const sections = tabs.map((t) => document.querySelector(t.getAttribute("href"))).filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tabs.forEach((t) => {
        const active = t.getAttribute("href") === `#${entry.target.id}`;
        t.classList.toggle("is-active", active);
        if (active) t.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    }),
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

/* Forms post to whatever endpoint is in their `action` (Formspree, Netlify,
   Mailchimp...). Until one is configured they show a friendly note instead. */
function initForms() {
  document.querySelectorAll("form[data-async]").forEach((form) => {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = form.getAttribute("action");
      const say = (msg) => { if (note) note.textContent = msg; };

      if (!action || action === "#") {
        say("Thanks! (This form isn't connected yet — see README.)");
        form.reset();
        return;
      }
      say("Sending…");
      try {
        const res = await fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(res.statusText);
        say(form.dataset.success || "Thanks — we'll be in touch.");
        form.reset();
      } catch {
        say("Something went wrong. Please try again or email us directly.");
      }
    });
  });
}

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
renderHours();
initNav();
initReveal();
initMenuTabs();
initForms();
