(() => {
  "use strict";

  const AERIS = {
    name: "Aeris",
    version: "1.0.1",
    discord: "https://discord.gg/aeris"
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Do not hijack navigation. This is important for static hosting and file://.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(link.getAttribute("href") || "")) return;
    document.body.classList.add("leaving");
    setTimeout(() => document.body.classList.remove("leaving"), 180);
  });

  // Mobile navigation.
  const menu = $('[data-menu], #mobileMenu, .mobile-menu');
  const sidebar = $(".sidebar, .side-nav, nav.sidebar");
  const overlay = $(".sidebar-overlay, .nav-overlay");

  function closeMenu() {
    document.body.classList.remove("sidebar-open");
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
  }

  menu?.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-open");
    sidebar?.classList.toggle("open");
    overlay?.classList.toggle("visible");
  });
  overlay?.addEventListener("click", closeMenu);
  $$(".sidebar a, .side-nav a").forEach(a => a.addEventListener("click", closeMenu));

  // Ctrl/Cmd + K.
  const palette = $("#commandPalette, .command-palette");
  const commandInput = $("#commandInput, .command-palette input");

  function openPalette() {
    if (!palette) return;
    palette.classList.add("open");
    palette.setAttribute("aria-hidden", "false");
    setTimeout(() => commandInput?.focus(), 20);
  }
  function closePalette() {
    if (!palette) return;
    palette.classList.remove("open");
    palette.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openPalette();
    }
    if (e.key === "Escape") {
      closePalette();
      closeMenu();
    }
  });
  palette?.addEventListener("click", e => {
    if (e.target === palette) closePalette();
  });

  // Environment status.
  const set = (selectors, value) => {
    for (const selector of selectors) {
      const el = $(selector);
      if (el) { el.textContent = value; break; }
    }
  };
  set(["[data-browser-status]", "#browserStatus"], "Ready");
  set(["[data-js-status]", "#jsStatus"], "Enabled");
  const updateConnection = () => set(["[data-connection-status]", "#connectionStatus"], navigator.onLine ? "Online" : "Offline");
  updateConnection();
  addEventListener("online", updateConnection);
  addEventListener("offline", updateConnection);

  // FAQ.
  $$(".faq-question, [data-faq]").forEach(button => {
    button.addEventListener("click", () => {
      (button.closest(".faq-item, .faq-card") || button.parentElement)?.classList.toggle("open");
    });
  });

  // Copy buttons.
  $$("[data-copy], .copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy || button.closest(".code-card")?.querySelector("code")?.textContent;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value.trim());
        const old = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => button.textContent = old, 1200);
      } catch (_) {}
    });
  });

  // Current navigation item.
  const current = location.pathname.replace(/\/+$/, "") || "/";
  $$(".sidebar a[href], .side-nav a[href]").forEach(a => {
    try {
      const path = new URL(a.href, location.href).pathname.replace(/\/+$/, "") || "/";
      if (path === current || (current === "/" && /\/index\.html$/.test(path))) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    } catch (_) {}
  });

  window.AERIS = AERIS;
})();
