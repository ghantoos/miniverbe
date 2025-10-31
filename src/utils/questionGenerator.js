// Vérifie si un verbe existe dans la base (BANK_G1, BANK_G2, BANK_G3, et lefff si dispo)
export function isKnownVerb(verb) {
  const v = strip(verb);
  if (!v) return false;
  if (
    BANK_G1.map(strip).includes(v) ||
    BANK_G2.map(strip).includes(v) ||
    BANK_G3.map(strip).includes(v)
  ) return true;
  if (conjugator && typeof conjugator.conjugate === "function") {
    try {
      // conjugator.conjugate renvoie null/undefined si inconnu
      return !!conjugator.conjugate(v, "present", "je");
    } catch {
      return false;
    }
  }
  return false;
}
// Uses conjugation-fr when available; falls back to simple rules for regular -er and -ir (2e groupe)
let conjugator = null;
try { conjugator = require("conjugation-fr"); } catch (_) { conjugator = null; }

export const TENSES = {
  present: ["present", "Présent", "present"],
  imparfait: ["imparfait", "Imparfait", "imparfait"],
  futur: ["futur", "Futur", "futur"],
  passeCompose: ["passeCompose", "Passé composé", "passeCompose"],
};

export const tenseLabel = (key) => ({
  present: "Indicatif/Présent",
  imparfait: "Indicatif/Imparfait",
  futur: "Indicatif/Futur simple",
  passeCompose: "Indicatif/Passé composé",
}[key] || key);

const PRONOUNS8 = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];

const BANK_G1 = ["parler", "chanter", "danser", "jouer", "marcher", "regarder", "manger", "travailler", "aimer", "écouter"];
const BANK_G2 = ["finir", "choisir", "grandir", "applaudir", "réussir", "rougir", "bondir", "nourrir", "polir", "franchir"];
const BANK_G3 = ["aller", "avoir", "être", "faire", "venir", "dire", "prendre", "voir", "pouvoir", "vouloir"];

const strip = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pronounToPersonIndex(p) {
  switch (p) {
    case "je": return 0;
    case "tu": return 1;
    case "il":
    case "elle": return 2;
    case "nous": return 3;
    case "vous": return 4;
    default: return 5; // ils/elles
  }
}

function conjFallback(verb, tense, person) {
  // -er regular
  if (verb.endsWith("er")) {
    const rad = verb.slice(0, -2);
    const pres = ["e", "es", "e", "ons", "ez", "ent"]; // present
    const imp = ["ais", "ais", "ait", "ions", "iez", "aient"]; // imparfait (simplified for -er)
    const fut = ["erai", "eras", "era", "erons", "erez", "eront"]; // futur simple
    if (tense === "present") return rad + pres[person];
    if (tense === "imparfait") return rad + imp[person];
    if (tense === "futur") return rad + fut[person];
  }
  // 2e groupe -ir regular (finir)
  if (verb.endsWith("ir")) {
    const rad = verb.slice(0, -2);
    const pres = ["is", "is", "it", "issons", "issez", "issent"];
    const imp = ["issais", "issais", "issait", "issions", "issiez", "issaient"];
    const fut = ["irai", "iras", "ira", "irons", "irez", "iront"];
    if (tense === "present") return rad + pres[person];
    if (tense === "imparfait") return rad + imp[person];
    if (tense === "futur") return rad + fut[person];
  }
  return "";
}

function conjugate(verb, tenseKey, personIndex) {
  if (conjugator && typeof conjugator.conjugate === "function") {
    try {
      const pronouns = ["je", "tu", "il", "nous", "vous", "ils"];
      const pronoun = pronouns[personIndex] || "je";
      const result = conjugator.conjugate(verb, tenseKey, pronoun);
      if (result && typeof result === "string") return result;
    } catch (_) {}
  }
  return conjFallback(verb, tenseKey, personIndex);
}

function extractEnding(verb, tenseKey, full) {
  if (!full) return "";
  if (verb.endsWith("er") && ["present", "imparfait", "futur"].includes(tenseKey)) {
    const rad = verb.slice(0, -2);
    if (full.startsWith(rad)) return full.slice(rad.length);
  }
  if (verb.endsWith("ir") && ["present", "imparfait", "futur"].includes(tenseKey)) {
    const rad = verb.slice(0, -2);
    if (full.startsWith(rad)) return full.slice(rad.length);
  }
  // Fallback: longest common prefix
  let i = 0;
  while (i < verb.length && i < full.length && verb[i] === full[i]) i++;
  return full.slice(i) || full.slice(-1);
}

export function generateQuestion(settings) {
  const { customVerbs, customVerb, groups, tense, quizType } = settings;
  let pool = [];
  if (Array.isArray(customVerbs) && customVerbs.length > 0) {
    pool = customVerbs;
  } else {
    if (groups.includes("g1")) pool.push(...BANK_G1);
    if (groups.includes("g2")) pool.push(...BANK_G2);
    if (groups.includes("g3")) pool.push(...BANK_G3);
    if (customVerb && customVerb.trim()) pool.push(customVerb.trim());
    if (!pool.length) pool.push(...BANK_G1);
  }

  const pronoun = rand(PRONOUNS8);
  const person = pronounToPersonIndex(pronoun);
  const verb = rand(pool);
  const full = conjugate(verb, tense, person);
  const expected = quizType === "ending" ? extractEnding(verb, tense, full) : full;

  return { pronoun, person, verb, tense, full, expected };
}
