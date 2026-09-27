/* Mon Petit Coin de Bretagne — envoi du formulaire de réservation.
   Comme sur le site Studio VM, la demande part en arrière-plan et le
   visiteur reste sur la page, avec une confirmation. L'envoi passe par
   les formulaires Netlify (formulaire « reservation ») : Netlify transmet
   chaque demande par email à Emmanuelle, et « Répondre » écrit directement
   au voyageur (champ email). */
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
  var subject = form.querySelector('input[name="subject"]');

  // Dates : pas d'arrivée dans le passé, départ forcément après l'arrivée.
  function isoDate(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function frDate(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
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

    // Objet de l'email reçu par Emmanuelle : nom du voyageur et dates.
    if (subject) {
      var quand = arrivee && arrivee.value
        ? " — du " + frDate(arrivee.value) + (depart && depart.value ? " au " + frDate(depart.value) : "")
        : "";
      subject.value = "Demande de séjour — " + form.nom.value.trim() + quand;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.dataset.label = submitBtn.textContent;
      submitBtn.textContent = "Envoi en cours…";
    }
    setStatus("");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (response) {
        if (response.ok) {
          form.hidden = true;
          if (successPanel) {
            successPanel.hidden = false;
            successPanel.focus();
          }
        } else {
          setStatus("Une erreur est survenue. Appelez Emmanuelle au " + CONTACT_PHONE + " ou écrivez à " + CONTACT_EMAIL + ".");
        }
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
