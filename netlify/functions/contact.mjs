// Mon Petit Coin de Bretagne — envoi des demandes de réservation.
//
// Même fonctionnement que le site Studio VM (src/pages/api/contact.ts et
// src/lib/mailer.ts) : le formulaire de contact.html envoie la demande à
// /api/contact ; cette fonction Netlify la vérifie puis l'expédie par email
// (SMTP, via nodemailer) à l'adresse de réception. Aucune donnée n'est
// stockée.
//
// Réglages (variables d'environnement Netlify, voir .env.example) :
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO
import nodemailer from "nodemailer";

export const config = { path: "/api/contact" };

const CONTACT_EMAIL = "monpetitcoindebretagne@outlook.fr";
const CONTACT_PHONE = "07 50 63 09 46";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Un humain ne peut pas ouvrir la page, la lire et envoyer le formulaire en
// moins de ce délai : plus rapide, c'est presque sûrement un robot. Associé
// au champ piège (societe_web), sans aucun service externe.
const MIN_FILL_MS = 1200;

const MAX_LENGTHS = {
  nom: 200,
  email: 254,
  arrivee: 10,
  depart: 10,
  chambre: 60,
  message: 5000,
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Sans JavaScript, le formulaire est envoyé classiquement : on renvoie alors
// le visiteur sur la page contact, au bloc de confirmation ou d'erreur.
function redirect(anchor) {
  return new Response(null, { status: 303, headers: { Location: `/contact.html#${anchor}` } });
}

function env(name) {
  return process.env[name];
}

function isConfigured() {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

function frDate(iso) {
  if (!iso) return "non précisée";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function nights(arrivee, depart) {
  if (!arrivee || !depart) return null;
  const n = Math.round((Date.parse(depart) - Date.parse(arrivee)) / 86400000);
  return n > 0 ? n : null;
}

function renderEmailBody(p) {
  const n = nights(p.arrivee, p.depart);
  return [
    `Nom : ${p.nom}`,
    `Email : ${p.email}`,
    `Arrivée souhaitée : ${frDate(p.arrivee)}`,
    `Départ souhaité : ${frDate(p.depart)}`,
    n ? `Durée : ${n} nuit${n > 1 ? "s" : ""}` : null,
    `Chambre souhaitée : ${p.chambre || "non précisée"}`,
    "",
    "Message :",
    p.message || "(aucun message)",
    "",
    "—",
    "Demande envoyée depuis le formulaire de www.monpetitcoindebretagne.com.",
    "Répondez directement à cet email pour écrire au voyageur.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

async function sendReservationEmail(p) {
  if (!isConfigured()) return { configured: false };

  const port = Number(env("SMTP_PORT") ?? 587);
  const user = env("SMTP_USER");

  const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: { user, pass: env("SMTP_PASS") },
  });

  const n = nights(p.arrivee, p.depart);
  const quand = p.arrivee ? ` — ${frDate(p.arrivee)}${n ? `, ${n} nuit${n > 1 ? "s" : ""}` : ""}` : "";

  await transporter.sendMail({
    from: `"Mon Petit Coin de Bretagne — Site" <${user}>`,
    to: env("CONTACT_TO") || CONTACT_EMAIL,
    replyTo: p.email,
    subject: `Demande de séjour — ${p.nom.replace(/[\r\n]+/g, " ")}${quand}`,
    text: renderEmailBody(p),
  });

  return { configured: true };
}

async function readBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    return { body: await request.json(), isForm: false };
  }
  const form = await request.formData();
  return { body: Object.fromEntries(form.entries()), isForm: true };
}

export default async (request) => {
  if (request.method !== "POST") {
    return json({ ok: false, message: "Méthode non autorisée." }, 405);
  }

  let body;
  let isForm = false;
  try {
    ({ body, isForm } = await readBody(request));
  } catch {
    return json({ ok: false, message: "Requête invalide." }, 400);
  }

  const fail = (message, status) => (isForm ? redirect("demande-erreur") : json({ ok: false, message }, status));
  // Les robots reçoivent une réponse normale pour ne pas apprendre à
  // contourner le piège ; aucun email n'est envoyé.
  const fakeSuccess = () => (isForm ? redirect("demande-envoyee") : json({ ok: true }, 200));

  // Champ piège : invisible, aucun humain ne le remplit.
  if (typeof body.societe_web === "string" && body.societe_web.trim() !== "") {
    return fakeSuccess();
  }

  // Envoi trop rapide ou horodatage absent : comportement de robot. Un écart
  // négatif (horloge du visiteur en retard) n'est pas retenu contre lui.
  // Sans JavaScript le champ reste vide : le contrôle ne s'applique qu'aux
  // envois faits par le script de la page.
  const submittedAt = typeof body.ts === "string" ? Number(body.ts) : NaN;
  const elapsed = Date.now() - submittedAt;
  const looksAutomated = isForm
    ? body.ts !== undefined && body.ts !== "" && Number.isFinite(submittedAt) && elapsed >= 0 && elapsed < MIN_FILL_MS
    : !Number.isFinite(submittedAt) || (elapsed >= 0 && elapsed < MIN_FILL_MS);
  if (looksAutomated) {
    return fakeSuccess();
  }

  const field = (name) => (typeof body[name] === "string" ? body[name].trim() : "");
  const payload = {
    nom: field("nom"),
    email: field("email"),
    arrivee: field("arrivee"),
    depart: field("depart"),
    chambre: field("chambre"),
    message: field("message"),
  };

  if (!payload.nom || !payload.email) {
    return fail("Merci d'indiquer votre nom et votre adresse email.", 400);
  }
  if (!EMAIL_RE.test(payload.email)) {
    return fail("Merci de renseigner une adresse email valide.", 400);
  }
  if ((payload.arrivee && !DATE_RE.test(payload.arrivee)) || (payload.depart && !DATE_RE.test(payload.depart))) {
    return fail("Les dates indiquées ne sont pas valides.", 400);
  }
  if (payload.arrivee && payload.depart && payload.depart <= payload.arrivee) {
    return fail("La date de départ doit être après la date d'arrivée.", 400);
  }
  if (Object.keys(MAX_LENGTHS).some((key) => payload[key].length > MAX_LENGTHS[key])) {
    return fail("Un ou plusieurs champs dépassent la longueur autorisée.", 400);
  }

  try {
    const result = await sendReservationEmail(payload);

    if (!result.configured) {
      console.error("[contact] SMTP non configuré : renseignez SMTP_HOST, SMTP_USER et SMTP_PASS dans Netlify.");
      return fail(
        `L'envoi automatique n'est pas encore activé. Appelez Emmanuelle au ${CONTACT_PHONE} ou écrivez à ${CONTACT_EMAIL}.`,
        503
      );
    }

    return isForm ? redirect("demande-envoyee") : json({ ok: true }, 200);
  } catch (error) {
    console.error("[contact] Échec de l'envoi :", error);
    return fail(
      `Une erreur est survenue lors de l'envoi. Appelez Emmanuelle au ${CONTACT_PHONE} ou écrivez à ${CONTACT_EMAIL}.`,
      502
    );
  }
};
