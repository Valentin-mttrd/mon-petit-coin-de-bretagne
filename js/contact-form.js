/* Mon Petit Coin de Bretagne — envoi du formulaire de réservation.
   Même fonctionnement que le site Studio VM : la demande est envoyée en
   arrière-plan à /api/contact (fonction Netlify, voir
   netlify/functions/contact.mjs) qui l'expédie par email à Emmanuelle ;
   le visiteur reste sur la page et voit une confirmation. */
(function () {
  "use strict";

  var CONTACT_EMAIL = "monpetitcoindebretagne@outlook.fr";
  var CONTACT_PHONE = "07 50 63 09 46";

  var form = document.querySelector("[data-contact-form]");
  if (!form || !window.fetch) return;

  var submitBtn = form.querySelector("[data-submit]");
  var statusEl = form.querySelector("[data-form-status]");
  var successPanel = document.querySelector("[data-form-success]");
  var arrivee = form.querySelector('input[name="arrivee"]');
  var depart = form.querySelector('input[name="depart"]');

  // Anti-robot (voir la fonction) : moment où le formulaire est devenu
  // utilisable dans ce navigateur.
  var timestampField = form.querySelector('input[name="ts"]');
  if (timestampField) timestampField.value = String(Date.now());

  // Dates : pas d'arrivée dans le passé, départ forcément après l'arrivée.
  function isoDate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  if (arrivee && depart) {
    arrivee.min = isoDate(new Date());
    var syncDates = function () {
      depart.min = arrivee.value || arrivee.min;
      depart.setCustomValidity(
        arrivee.value && depart.value && depart.value <= arrivee.value
          ? "La date de départ doit être après la date d'arrivée."
          : ""
      );
    };
    arrivee.addEventListener("change", syncDates);
    depart.addEventListener("change", syncDates);
    syncDates();
  }

  function setStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = message.length === 0;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var honeypot = form.querySelector('input[name="societe_web"]');
    if (honeypot && honeypot.value) return;

    var payload = {};
    new FormData(form).forEach(function (value, key) { payload[key] = value; });

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours…";
    }
    setStatus("");

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        return response.json().catch(function () { return { ok: false }; }).then(function (data) {
          if (response.ok && data.ok) {
            form.hidden = true;
            if (successPanel) {
              successPanel.hidden = false;
              successPanel.focus();
            }
          } else {
            setStatus(data.message || "Une erreur est survenue. Appelez Emmanuelle au " + CONTACT_PHONE + " ou écrivez à " + CONTACT_EMAIL + ".");
          }
        });
      })
      .catch(function () {
        setStatus("Impossible d'envoyer votre demande pour le moment. Appelez Emmanuelle au " + CONTACT_PHONE + " ou écrivez à " + CONTACT_EMAIL + ".");
      })
      .then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
          if (submitBtn.dataset.label) submitBtn.textContent = submitBtn.dataset.label;
        }
      });
  });
})();
