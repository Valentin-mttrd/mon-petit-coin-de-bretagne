/* =========================================================================
   Mon Petit Coin de Bretagne — guide « Découvrir la Bretagne autour de vous »
   Rendu des cartes, filtres, recherche, planificateur, expériences, carte
   schématique. S'appuie sur ACTIVITIES / CATEGORIES / EXPERIENCES définis
   dans js/activities-data.js (chargé avant ce fichier).
   ========================================================================= */
(function () {
  "use strict";
  if (typeof ACTIVITIES === "undefined") return;

  var ORIGIN_ADDRESS = "15 route de la Croizetière, 56670 Riantec, France";

  /* ---- Icônes ligne (mêmes proportions que le reste du site) ---- */
  var ICONS = {
    star:     '<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L12 16.9 6.4 20l1.4-6.2-4.8-4.3 6.4-.6L12 3Z"/>',
    wave:     '<path d="M3 15c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 2.5 1.7 3 2M3 10c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 2.5 1.7 3 2"/>',
    path:     '<path d="M4 20c4-1 4-6 8-6s4-8 8-8"/><circle cx="4" cy="20" r="1.4"/><circle cx="20" cy="6" r="1.4"/>',
    landmark: '<path d="M4 21h16M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-7M15 21v-7"/>',
    boat:     '<path d="M3 16h18l-2 4H5l-2-4Z"/><path d="M6 16V8h5l5 5"/><path d="M11 8V4"/>',
    family:   '<circle cx="8" cy="6" r="2.2"/><circle cx="16" cy="6" r="2.2"/><path d="M3 20v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2M13 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h1a3.5 3.5 0 0 1 3.5 3.5V20"/>',
    bike:     '<circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-8h4l3 8M10 9H8m4-4h3l2 4"/>',
    leaf:     '<path d="M20 4c0 9-7 16-16 16 0-9 7-16 16-16Z"/><path d="M9 15c3-3 6-6 11-11"/>',
    umbrella: '<path d="M12 3c5 0 9 3.8 9 8H3c0-4.2 4-8 9-8Z"/><path d="M12 11v8a2 2 0 0 1-4 0"/><path d="M12 3V1"/>',
    pin:      '<path d="M12 21s-7-6.5-7-11.5A7 7 0 0 1 19 9.5C19 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/>',
    home:     '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h5v-6h2v6h5V10"/>',
    search:   '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    compass:  '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-6 2 2-6 6-2Z"/>'
  };
  function icon(name, size) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="' + (size || 20) + '" height="' + (size || 20) + '">' + (ICONS[name] || "") + "</svg>";
  }

  function byId(id) { return ACTIVITIES.filter(function (a) { return a.id === id; })[0]; }
  function directionsUrl(activity) {
    var dest = activity.address || activity.name;
    return "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(ORIGIN_ADDRESS) + "&destination=" + encodeURIComponent(dest);
  }
  function websiteBtn(activity) {
    if (!activity.website) return "";
    return '<a class="btn btn-outline" style="padding:0.6em 1.1em;font-size:0.82rem;" href="' + activity.website + '" target="_blank" rel="noopener">Site officiel</a>';
  }

  /* ---- Rendu d'une carte d'activité ---- */
  function cardHTML(a, opts) {
    opts = opts || {};
    var badge = a.featured ? '<span class="activity-card__badge">Incontournable</span>' : (a.heart ? '<span class="activity-card__badge">Coup de cœur</span>' : "");
    var tip = a.tip ? '<p class="activity-card__tip">' + a.tip + "</p>" : "";
    var priceLine = a.price ? '<p style="font-size:0.82rem;color:var(--slate);margin:0;">' + a.price + "</p>" : "";
    var bookingText = a.bookingRequired === true ? "Réservation conseillée" : (a.bookingRequired === false ? "Sans réservation" : (a.bookingRequired || ""));
    return (
      '<article class="activity-card" data-accent="' + a.accent + '" data-id="' + a.id + '" id="activity-' + a.id + '" data-categories="' + a.categories.join(",") + '" data-search="' + (a.name + " " + a.description + " " + a.tags.join(" ")).toLowerCase().replace(/"/g, "") + '">' +
        '<div class="activity-card__top">' +
          badge +
          '<span class="activity-card__icon">' + icon(a.icon, 20) + "</span>" +
          '<p class="activity-card__cat">' + a.categories.map(function (c) { var cat = CATEGORIES.filter(function (k) { return k.slug === c; })[0]; return cat ? cat.label : c; }).slice(0, 2).join(" · ") + "</p>" +
          "<h3>" + a.name + "</h3>" +
        "</div>" +
        '<div class="activity-card__body">' +
          "<p>" + a.description + "</p>" +
          tip +
          priceLine +
          '<dl class="activity-card__meta">' +
            "<div><dt>Distance</dt><dd>" + a.distance + "</dd></div>" +
            "<div><dt>Trajet</dt><dd>" + a.driveTime + "</dd></div>" +
            "<div><dt>Durée</dt><dd>" + a.duration + "</dd></div>" +
          "</dl>" +
          (bookingText ? '<p style="font-size:0.78rem;color:var(--slate);margin:0;">' + bookingText + "</p>" : "") +
          '<div class="activity-card__actions">' +
            '<a class="btn btn-primary" style="padding:0.6em 1.1em;font-size:0.82rem;" href="' + directionsUrl(a) + '" target="_blank" rel="noopener">Itinéraire</a>' +
            websiteBtn(a) +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---- Grille principale + filtres + recherche ---- */
  var grid = document.getElementById("activity-grid");
  var chipsWrap = document.getElementById("filter-chips");
  var searchInput = document.getElementById("discover-search-input");
  var countEl = document.getElementById("discover-count");
  var state = { category: "all", term: "" };

  if (grid) {
    grid.innerHTML = ACTIVITIES.map(function (a) { return cardHTML(a); }).join("");
  }
  if (chipsWrap) {
    var chips = ['<button type="button" class="chip is-active" data-cat="all">Tous</button>'].concat(
      CATEGORIES.map(function (c) {
        return '<button type="button" class="chip" data-cat="' + c.slug + '">' + icon(c.icon, 15) + "<span>" + c.label + "</span></button>";
      })
    );
    chipsWrap.innerHTML = chips.join("");
    chipsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      chipsWrap.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      state.category = btn.getAttribute("data-cat");
      applyFilters();
      updateMapFilter();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.term = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  function applyFilters() {
    if (!grid) return;
    var visible = 0;
    grid.querySelectorAll(".activity-card").forEach(function (card) {
      var cats = card.getAttribute("data-categories").split(",");
      var matchCat = state.category === "all" || cats.indexOf(state.category) !== -1;
      var matchTerm = !state.term || card.getAttribute("data-search").indexOf(state.term) !== -1;
      var show = matchCat && matchTerm;
      card.hidden = !show;
      if (show) visible++;
    });
    if (countEl) {
      countEl.textContent = visible === 0
        ? "Aucun résultat — essayez un autre mot-clé ou une autre catégorie."
        : visible + " activité" + (visible > 1 ? "s" : "") + (state.term ? ' pour « ' + state.term + " »" : "");
    }
  }
  applyFilters();

  /* ---- Coups de cœur d'Emmanuelle ---- */
  var hearts = document.getElementById("hearts-grid");
  if (hearts) {
    hearts.innerHTML = ACTIVITIES.filter(function (a) { return a.heart; }).map(function (a) { return cardHTML(a); }).join("");
  }

  /* ---- Planificateur « Que faire aujourd'hui ? » ---- */
  var planner = document.getElementById("planner");
  if (planner) {
    var pState = { time: null, who: null, mood: null, weather: null };
    planner.querySelectorAll("[data-field]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        var field = group.getAttribute("data-field");
        group.querySelectorAll("button").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        pState[field] = btn.getAttribute("data-value");
      });
    });
    var submitBtn = document.getElementById("planner-submit");
    var resultEl = document.getElementById("planner-result");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        var scored = ACTIVITIES.map(function (a) {
          var score = 0;
          if (pState.time && a.tags.indexOf(pState.time) !== -1) score += 3;
          if (pState.mood && a.categories.indexOf(pState.mood) !== -1) score += 3;
          if (pState.weather === "pluie" && a.categories.indexOf("pluie") !== -1) score += 4;
          if (pState.weather === "soleil" && a.categories.indexOf("mer") !== -1) score += 2;
          if (pState.who === "famille" && a.categories.indexOf("famille") !== -1) score += 2;
          if (pState.who === "couple" && (a.categories.indexOf("mer") !== -1 || a.heart)) score += 1;
          if (a.featured) score += 1;
          return { a: a, score: score };
        }).sort(function (x, y) { return y.score - x.score; });
        var top = scored.filter(function (s) { return s.score > 0; }).slice(0, 4);
        if (top.length < 3) top = scored.slice(0, 4);
        if (resultEl) {
          resultEl.hidden = false;
          resultEl.querySelector(".planner__result-lede").textContent = "Notre sélection pour vous :";
          resultEl.querySelector(".activity-grid").innerHTML = top.map(function (s) { return cardHTML(s.a); }).join("");
          resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }

  /* ---- Expériences / itinéraires ---- */
  var expTabs = document.getElementById("experience-tabs");
  var expPanels = document.getElementById("experience-panels");
  if (expTabs && expPanels) {
    expTabs.innerHTML = EXPERIENCES.map(function (e, i) {
      return '<button type="button" class="chip' + (i === 0 ? " is-active" : "") + '" data-exp="' + e.id + '">' + e.title + "</button>";
    }).join("");
    expPanels.innerHTML = EXPERIENCES.map(function (e, i) {
      var steps = e.steps.map(function (s) {
        var act = s.activityId ? byId(s.activityId) : null;
        var label = act ? '<a href="#activity-' + act.id + '">' + s.label + "</a>" : s.label;
        return '<div class="timeline__step"><span class="timeline__time">' + s.time + '</span><span class="timeline__label">' + label + "</span></div>";
      }).join("");
      return '<div class="experience-panel' + (i === 0 ? " is-active" : "") + '" data-exp-panel="' + e.id + '"><div class="timeline">' + steps + "</div></div>";
    }).join("");
    expTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var id = btn.getAttribute("data-exp");
      expTabs.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
      expPanels.querySelectorAll(".experience-panel").forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-exp-panel") === id);
      });
    });
  }

  /* ---- Carte schématique (sans clé d'API — positions illustratives) ----
     Remplacement futur : brancher ici une vraie carte (Mapbox GL, Google
     Maps JS API…) en utilisant les coordonnées réelles de chaque activité
     et de l'adresse ORIGIN_ADDRESS ci-dessus. */
  var MAP_POSITIONS = {
    "petite-mer-gavres": { angle: 200, r: 0.15 },
    "grande-plage-port-louis": { angle: 232, r: 0.28 },
    "citadelle-port-louis": { angle: 216, r: 0.21 },
    "reserve-pen-mane": { angle: 205, r: 0.18 },
    "cite-voile-tabarly": { angle: 174, r: 0.55 },
    "base-keroman": { angle: 146, r: 0.52 },
    "festival-interceltique": { angle: 160, r: 0.5 },
    "fort-bloque": { angle: 192, r: 0.5 },
    "larmor-plage": { angle: 180, r: 0.45 },
    "guidel-plages": { angle: 195, r: 0.6 },
    "hennebont": { angle: 110, r: 0.55 },
    "vallee-du-blavet": { angle: 105, r: 0.5 },
    "ile-de-groix": { angle: 205, r: 0.78 },
    "plouhinec-dunes": { angle: 210, r: 0.35 },
    "ria-etel": { angle: 248, r: 0.6 },
    "saint-cado": { angle: 250, r: 0.62 },
    "carnac": { angle: 255, r: 0.85 },
    "quiberon": { angle: 245, r: 0.95 },
    "golfe-morbihan-vannes": { angle: 75, r: 0.9 },
    "izenah-croisieres": { angle: 65, r: 0.88 },
    "saint-goustan-auray": { angle: 68, r: 0.65 },
    "belle-ile": { angle: 225, r: 1.0 },
    "concarneau-ville-close": { angle: 290, r: 0.9 },
    "pont-aven": { angle: 295, r: 0.95 }
  };
  var mapEl = document.getElementById("schema-map");
  if (mapEl) {
    var mapHTML = '<div class="schema-map__ring" style="width:33%;height:33%;"></div><div class="schema-map__ring" style="width:66%;height:66%;"></div><div class="schema-map__ring" style="width:100%;height:100%;"></div>';
    mapHTML += '<div class="schema-map__center" title="Mon Petit Coin de Bretagne">' + icon("home", 26) + "</div>";
    Object.keys(MAP_POSITIONS).forEach(function (id) {
      var a = byId(id);
      if (!a) return;
      var pos = MAP_POSITIONS[id];
      var rad = (pos.angle - 90) * (Math.PI / 180);
      var radiusPct = 8 + pos.r * 42; /* % du conteneur depuis le centre */
      var x = 50 + radiusPct * Math.cos(rad);
      var y = 50 + radiusPct * Math.sin(rad);
      mapHTML += '<button type="button" class="schema-map__pin" data-pin="' + a.id + '" data-categories="' + a.categories.join(",") + '" style="left:' + x + "%;top:" + y + '%;" title="' + a.name + '" aria-label="' + a.name + '">' + icon("pin", 16) + "</button>";
    });
    mapEl.innerHTML = mapHTML;
    mapEl.addEventListener("click", function (e) {
      var pin = e.target.closest(".schema-map__pin");
      if (!pin) return;
      var id = pin.getAttribute("data-pin");
      mapEl.querySelectorAll(".schema-map__pin").forEach(function (p) { p.classList.remove("is-active"); });
      pin.classList.add("is-active");
      var card = document.getElementById("activity-" + id);
      if (card) {
        card.hidden = false;
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.boxShadow = "0 0 0 3px var(--ocean), var(--shadow-lift)";
        setTimeout(function () { card.style.boxShadow = ""; }, 1800);
      }
    });
  }
  function updateMapFilter() {
    if (!mapEl) return;
    mapEl.querySelectorAll(".schema-map__pin").forEach(function (pin) {
      var cats = pin.getAttribute("data-categories").split(",");
      var show = state.category === "all" || cats.indexOf(state.category) !== -1;
      pin.style.opacity = show ? "1" : "0.25";
      pin.style.pointerEvents = show ? "auto" : "none";
    });
  }
})();
