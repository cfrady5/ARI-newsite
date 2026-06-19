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
