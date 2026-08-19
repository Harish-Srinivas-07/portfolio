"use strict";

/* Scroll-reveal animation for hero + sections */
(() => {
  const revealEls = document.querySelectorAll(".reveal");

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* Copy-to-clipboard + mailto for the "Send an email" button */
(() => {
  const btn = document.querySelector("[data-copy-email]");
  const toast = document.querySelector("[data-toast]");
  if (!btn || !toast) return;

  const label = btn.querySelector("[data-copy-label]");
  const defaultLabel = label ? label.textContent : "";
  let toastTimer = null;
  let labelTimer = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  };

  btn.addEventListener("click", async () => {
    const email = btn.getAttribute("data-email");

    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied to clipboard");
    } catch (err) {
      showToast("Opening your email client…");
    }

    if (label) {
      label.textContent = "Copied!";
      clearTimeout(labelTimer);
      labelTimer = setTimeout(() => {
        label.textContent = defaultLabel;
      }, 1800);
    }

    window.location.href = `mailto:${email}`;
  });
})();

/* Keyboard shortcuts for the hero action buttons (keycap hints are real) */
(() => {
  const targets = document.querySelectorAll("[data-shortcut]");
  if (!targets.length) return;

  const byKey = new Map();
  targets.forEach((el) => byKey.set(el.getAttribute("data-shortcut").toLowerCase(), el));

  const isTyping = (el) =>
    el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable);

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || isTyping(document.activeElement)) return;

    const target = byKey.get(e.key.toLowerCase());
    if (!target) return;

    e.preventDefault();
    const keycap = target.querySelector(".keycap");
    if (keycap) {
      keycap.classList.remove("keycap-pressed");
      void keycap.offsetWidth;
      keycap.classList.add("keycap-pressed");
    }
    target.click();
  });
})();
