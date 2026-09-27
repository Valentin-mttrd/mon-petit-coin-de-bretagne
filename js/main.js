/* Mon Petit Coin de Bretagne — interactions légères (menu mobile, apparition douce) */
(function () {
  "use strict";

  // --- Menu mobile ---
  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.querySelector("[data-nav-mobile]");
  var closeBtn = document.querySelector("[data-nav-close]");

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
    toggle && toggle.setAttribute("aria-expanded", "true");
  }
  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
    toggle && toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  // --- Apparition douce au scroll ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- En-tête : légère ombre après scroll ---
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 8px 24px -18px rgba(16,34,44,0.35)" : "none";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // --- Hero principal : respiration + très léger parallaxe ---
  // Purement décoratif (image du hero d'accueil uniquement) : un mouvement
  // lent et continu qui évoque la surface de l'eau, complété d'un déplacement
  // vertical infime au scroll. Désactivé sur mobile et si l'utilisateur
  // préfère limiter les animations. Une seule propriété (`transform`) pilotée
  // ici pour éviter tout conflit avec une animation CSS sur le même élément.
  var heroImg = document.querySelector(".hero__media img");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroImg && !reduceMotion && window.innerWidth > 640) {
    var startTime = Date.now();
    var frame = function () {
      var elapsed = Date.now() - startTime;
      var breathe = 1.08 + Math.sin(elapsed / 9000) * 0.018;
      var drift = Math.min(window.scrollY * 0.05, 36);
      heroImg.style.transform = "translate3d(0," + drift + "px,0) scale(" + breathe.toFixed(4) + ")";
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
