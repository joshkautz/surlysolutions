/* ============================================================
   Maresfield & Vale — interactions
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---- A reusable equine-silhouette SVG for product media ---- */
  const horseSVG = (a, b) => `
    <svg viewBox="0 0 200 150" width="200" height="150" role="img" aria-hidden="true">
      <defs><linearGradient id="g${a}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
      </linearGradient></defs>
      <rect width="200" height="150" fill="url(#g${a})"/>
      <path d="M52 120c0-30 10-50 27-63-6-9-6-19-3-29 10 6 17 14 20 24 10-7 21-10 33-10-6 10-16 17-26 20 9 9 13 22 13 40 0 6 0 12 3 18H52z"
        fill="none" stroke="rgba(246,241,231,.85)" stroke-width="2.2" stroke-linejoin="round"/>
    </svg>`;

  /* ---- Product catalogue (parody) ---- */
  const PRODUCTS = [
    { id: "midnight",  region: "The Cotswolds",   name: "Midnight Reserve '19", notes: "Structured and brooding, with notes of wet oak, ambition, and a long, dignified finish.", price: 480, tag: "Single-Sire",  tagGold: true,  c1: "#1d3529", c2: "#0d1a13" },
    { id: "goldleaf",  region: "Loire Valley",     name: "Gold-Leaf Cuvée",      notes: "Bright, athletic, and impossibly poised. Bred for dressage and quiet self-belief.",     price: 620, tag: "Limited",     tagGold: false, c1: "#4a3a1c", c2: "#2a2110" },
    { id: "highland",  region: "Scottish Borders", name: "Highland Small-Batch", notes: "Rugged, honest, cold-weather stamina with a peppery, heathered nose.",                  price: 390, tag: "Small-Batch", tagGold: false, c1: "#2b2f33", c2: "#14171a" },
    { id: "provence",  region: "Provence",         name: "Provençal Estate",     notes: "Sun-warmed and generous. A rounded, lavender-edged bloodline for the romantic paddock.", price: 540, tag: "Terroir",     tagGold: true,  c1: "#3a2b3f", c2: "#1f1622" },
    { id: "nordic",    region: "Jutland",          name: "Nordic Heritage",      notes: "Broad-shouldered and unshakably calm. Winters like a Viking, trots like a poem.",       price: 450, tag: "Heritage",    tagGold: false, c1: "#1b3340", c2: "#0c1a21" },
    { id: "cellar",    region: "Undisclosed",      name: "The Cellar Selection", notes: "Our master's private vault. Provenance sealed. Availability whispered, never advertised.", price: 980, tag: "Vault",       tagGold: true,  c1: "#3f2318", c2: "#20110b" },
  ];

  const fmt = (n) => "$" + n.toLocaleString("en-US");

  /* ============================================================
     Render product cards
     ============================================================ */
  const grid = $("#productGrid");
  if (grid) {
    PRODUCTS.forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "card reveal";
      card.style.transitionDelay = prefersReduced ? "0s" : (i % 3) * 0.08 + "s";
      card.innerHTML = `
        <div class="card__media">
          <span class="card__tag ${p.tagGold ? "card__tag--gold" : ""}">${p.tag}</span>
          ${horseSVG(p.c1, p.c2)}
        </div>
        <div class="card__body">
          <span class="card__region">${p.region}</span>
          <h3 class="card__name">${p.name}</h3>
          <p class="card__notes">${p.notes}</p>
          <div class="card__foot">
            <span class="card__price">${fmt(p.price)} <small>/ straw</small></span>
            <button class="card__add" data-id="${p.id}" aria-label="Reserve ${p.name}">Reserve</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ============================================================
     Cart state
     ============================================================ */
  const cart = new Map(); // id -> qty
  const cartCount = $("#cartCount");
  const cartCountLabel = $("#cartCountLabel");
  const drawerItems = $("#drawerItems");
  const drawerEmpty = $("#drawerEmpty");
  const drawerTotal = $("#drawerTotal");
  const checkoutBtn = $("#checkoutBtn");

  function totals() {
    let qty = 0, sum = 0;
    cart.forEach((q, id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) { qty += q; sum += q * p.price; }
    });
    return { qty, sum };
  }

  function renderCart() {
    const { qty, sum } = totals();
    // header badge
    cartCount.textContent = qty;
    cartCount.classList.toggle("is-visible", qty > 0);
    if (cartCountLabel) cartCountLabel.textContent = qty + (qty === 1 ? " item reserved" : " items reserved");

    // drawer list
    drawerItems.innerHTML = "";
    if (qty === 0) {
      drawerEmpty.hidden = false;
      checkoutBtn.disabled = true;
    } else {
      drawerEmpty.hidden = true;
      checkoutBtn.disabled = false;
      cart.forEach((q, id) => {
        const p = PRODUCTS.find((x) => x.id === id);
        if (!p) return;
        const li = document.createElement("li");
        li.className = "drawer__item";
        li.innerHTML = `
          <span class="drawer__thumb" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4">
              <path d="M5 20c0-6 2-10 5-12-1-2-1-4-.5-6 2 1.2 3.4 3 4 5 2-1.4 4-2 6-2-1 2-3 3.4-5 4 2 2 2.6 4.4 2.6 8 0 1 0 2 .4 3z" stroke-linejoin="round"/>
            </svg>
          </span>
          <div class="drawer__meta">
            <span class="drawer__name">${p.name}</span>
            <span class="drawer__qty">
              <button data-act="dec" data-id="${id}" aria-label="Decrease quantity of ${p.name}">−</button>
              <span aria-live="polite">${q}</span>
              <button data-act="inc" data-id="${id}" aria-label="Increase quantity of ${p.name}">+</button>
            </span>
          </div>
          <div>
            <span class="drawer__price">${fmt(p.price * q)}</span>
            <button class="drawer__remove" data-act="rm" data-id="${id}">Remove</button>
          </div>`;
        drawerItems.appendChild(li);
      });
    }
    drawerTotal.textContent = fmt(sum);
  }

  function bumpBadge() {
    if (prefersReduced) return;
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth; // reflow to restart animation
    cartCount.classList.add("bump");
  }

  function addToCart(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    bumpBadge();
    const p = PRODUCTS.find((x) => x.id === id);
    showToast(`${p ? p.name : "Straw"} reserved`);
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest(".card__add");
    if (add) { addToCart(add.dataset.id); return; }

    const qbtn = e.target.closest("[data-act]");
    if (qbtn) {
      const { act, id } = qbtn.dataset;
      if (act === "inc") cart.set(id, (cart.get(id) || 0) + 1);
      if (act === "dec") { const n = (cart.get(id) || 0) - 1; n <= 0 ? cart.delete(id) : cart.set(id, n); }
      if (act === "rm") cart.delete(id);
      renderCart();
    }
  });

  /* ============================================================
     Drawer open/close + focus management
     ============================================================ */
  const drawer = $("#cartDrawer");
  const overlay = $("#drawerOverlay");
  const cartToggle = $("#cartToggle");
  const drawerClose = $("#drawerClose");
  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => { overlay.classList.add("is-open"); drawer.classList.add("is-open"); });
    drawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    drawerClose.focus();
    document.addEventListener("keydown", onKeydown);
  }
  function closeDrawer() {
    overlay.classList.remove("is-open");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    setTimeout(() => { overlay.hidden = true; }, 500);
    if (lastFocused) lastFocused.focus();
  }
  function onKeydown(e) {
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key === "Tab") {
      const focusables = $$("button, a, input", drawer).filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  cartToggle.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  checkoutBtn.addEventListener("click", () => {
    showToast("This is a parody boutique — no payment taken. Thank you for playing along!");
  });

  /* ============================================================
     Mobile menu
     ============================================================ */
  const menuToggle = $("#menuToggle");
  const nav = $(".nav");
  if (menuToggle && nav) {
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    $$(".nav__list a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuToggle.focus(); }
    });
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
    });
  }

  /* ============================================================
     Sticky header shadow
     ============================================================ */
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ============================================================
     Scroll reveal
     ============================================================ */
  const reveals = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ============================================================
     Count-up stats
     ============================================================ */
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length) {
    if (!("IntersectionObserver" in window)) counters.forEach(runCount);
    else {
      const co = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach((el) => co.observe(el));
    }
  }

  /* ============================================================
     Waitlist form
     ============================================================ */
  const form = $("#waitlistForm");
  if (form) {
    const email = $("#wlEmail");
    const emailErr = $("#wlEmailError");
    const status = $("#wlStatus");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = form.checkValidity() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value);
      if (!valid) {
        emailErr.hidden = false;
        email.focus();
        return;
      }
      emailErr.hidden = true;
      status.textContent = "Thank you — you're on the list. We'll be in touch when the next bloodline is drawn.";
      form.reset();
    });
    email.addEventListener("input", () => { emailErr.hidden = true; });
  }

  /* ============================================================
     Toast
     ============================================================ */
  let toastTimer;
  const toastEl = $("#toast");
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
      setTimeout(() => { toastEl.hidden = true; }, 400);
    }, 2600);
  }

  /* ---- Footer year ---- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- init ---- */
  renderCart();
})();
