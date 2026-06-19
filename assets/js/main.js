/* ==========================================================================
   ARI — global interactions
   - Mobile navigation + mega-menu accordion
   - Active link highlighting
   - Scroll reveal
   - Animated stat counters
   - Form handling (front-end demo; wire to Wix Forms / CRM on launch)
   - Footer year
   ========================================================================== */
(function () {
  "use strict";

  var body = document.body;

  /* ----- Sticky header: add presence once scrolled ------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Animated network hero background (motion borrowed from RAM) -------
     Injected here (not in HTML) so it stays DRY across every page and degrades
     gracefully: no-JS users and crawlers just see the gradient hero.          */
  var heroBgMarkup =
    '<div class="grid-overlay"></div>' +
    '<svg class="hero-paths" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">' +
      '<path class="flow-path" d="M-50 470 C 250 450, 350 300, 600 285 S 1000 175, 1260 135" stroke="#4EC06B" stroke-opacity="0.55" stroke-width="1.8"/>' +
      '<path class="flow-path flow-delay-1" d="M-50 540 C 300 530, 420 380, 650 360 S 1050 250, 1260 220" stroke="#3BAE48" stroke-opacity="0.4" stroke-width="1.4"/>' +
      '<path class="flow-path flow-delay-2" d="M-50 410 C 220 395, 380 235, 620 225 S 980 115, 1260 70" stroke="#8FB0D8" stroke-opacity="0.45" stroke-width="1.2"/>' +
      '<path class="flow-path flow-delay-1" d="M-50 250 C 260 240, 430 140, 680 150 S 1040 230, 1260 250" stroke="#4EC06B" stroke-opacity="0.3" stroke-width="1.1"/>' +
      '<path class="flow-path flow-delay-2" d="M-50 330 C 300 340, 520 470, 760 450 S 1080 360, 1260 380" stroke="#8FB0D8" stroke-opacity="0.28" stroke-width="1"/>' +
      '<circle class="flow-node" cx="600" cy="285" r="4.5" fill="#4EC06B"/>' +
      '<circle class="flow-node flow-delay-1" cx="650" cy="360" r="3.5" fill="#3BAE48"/>' +
      '<circle class="flow-node flow-delay-2" cx="620" cy="225" r="3.5" fill="#8FB0D8"/>' +
      '<circle class="flow-node flow-delay-1" cx="680" cy="150" r="3" fill="#4EC06B"/>' +
      '<circle class="flow-node" cx="760" cy="450" r="3" fill="#8FB0D8"/>' +
    '</svg>';
  document.querySelectorAll(".hero, .hero--page").forEach(function (hero) {
    if (hero.querySelector(".hero-bg")) return;
    var bg = document.createElement("div");
    bg.className = "hero-bg";
    bg.setAttribute("aria-hidden", "true");
    bg.innerHTML = heroBgMarkup;
    hero.insertBefore(bg, hero.firstChild);
  });

  /* ----- Mobile nav -------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".nav-menu");

  function closeNav() {
    body.classList.remove("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  function openNav() {
    body.classList.add("nav-open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      body.classList.contains("nav-open") ? closeNav() : openNav();
    });
  }

  /* Mega-menu: hover on desktop (CSS), tap-to-expand accordion on mobile */
  document.querySelectorAll(".has-mega > .nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 860px)").matches) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

  /* Close mobile nav when a real link is followed */
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!a.closest(".has-mega") || !window.matchMedia("(max-width: 860px)").matches) {
        closeNav();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });
  window.addEventListener("resize", function () {
    if (!window.matchMedia("(max-width: 860px)").matches) closeNav();
  });

  /* ----- Active nav link --------------------------------------------------- */
  (function markActive() {
    var path = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
    document.querySelectorAll(".nav-link[href]").forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) === "#" || /^https?:/.test(href)) return;
      var linkPath = href
        .replace(/^\.+\//, "/")
        .replace(/index\.html$/, "")
        .replace(/\.html$/, "")
        .replace(/\/$/, "");
      var here = path.split("/").pop();
      var there = linkPath.split("/").pop();
      if (there && here === there) link.setAttribute("aria-current", "page");
      // section landing (e.g. /insights matches /insights/article)
      if (there && here.indexOf(there) === 0 && there.length > 2) {
        link.setAttribute("aria-current", "page");
      }
    });
  })();

  /* ----- Scroll reveal ----------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Animated counters ------------------------------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString("en-US", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ----- Forms (front-end demo) -------------------------------------------
     NOTE FOR LAUNCH: On Wix, replace this with Wix Forms or a Velo backend
     that posts to ARI's CRM / email platform. This handler only shows a
     friendly confirmation so the prototype is testable without a backend.   */
  document.querySelectorAll("form[data-demo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = status.getAttribute("data-msg") ||
          "Thanks — your submission was received. We'll be in touch shortly.";
        status.classList.add("is-ok");
      }
      form.querySelectorAll("input, textarea, select").forEach(function (f) {
        if (f.type !== "submit") f.value = "";
      });
    });
  });

  /* ----- Footer year ------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
