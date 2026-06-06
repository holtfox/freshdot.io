/**
 * FreshDot — minimal site interactions
 * - Mobile navigation
 * - FAQ accordion
 * - Contact form validation + success state (demo; wire to backend as needed)
 * - Optional reveal-on-scroll
 * - Header scroll shadow
 */
(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMobile = document.querySelector("[data-nav-mobile]");
  var body = document.body;

  function setNavOpen(open) {
    if (!navToggle || !navMobile) return;
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMobile.classList.toggle("is-open", open);
    body.classList.toggle("nav-open", open);
  }

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") !== "true";
      setNavOpen(open);
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setNavOpen(false);
      }
    });
  }

  if (header) {
    var lastY = 0;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY || 0;
        header.classList.toggle("is-scrolled", y > 8);
        lastY = y;
      },
      { passive: true }
    );
  }

  /* FAQ accordion */
  document.querySelectorAll("[data-faq]").forEach(function (root) {
    root.querySelectorAll(".faq-item").forEach(function (item) {
      var trigger = item.querySelector(".faq-trigger");
      var panel = item.querySelector(".faq-panel");
      if (!trigger || !panel) return;

      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        root.querySelectorAll(".faq-item").forEach(function (other) {
          other.classList.remove("is-open");
          var t = other.querySelector(".faq-trigger");
          if (t) t.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });

      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", panel.id || "");
    });
  });

  /* Contact form */
  var form = document.querySelector("[data-contact-form]");
  var formSuccess = document.querySelector("[data-form-success]");

  if (form && formSuccess) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".form-field");
        if (!wrap) return;
        wrap.classList.remove("is-invalid");
        if (!field.value.trim()) {
          valid = false;
          wrap.classList.add("is-invalid");
        }
      });

      var email = form.querySelector('input[type="email"]');
      if (email && email.value.trim()) {
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
        if (!ok) {
          valid = false;
          var ew = email.closest(".form-field");
          if (ew) ew.classList.add("is-invalid");
        }
      }

      if (!valid) return;

      form.style.display = "none";
      formSuccess.classList.add("is-visible");
      formSuccess.setAttribute("tabindex", "-1");
      formSuccess.focus();
    });
  }

  /* Reveal on scroll */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
})();
