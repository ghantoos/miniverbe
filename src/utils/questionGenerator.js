// Utilise exclusivement la librairie conjugation-fr (plus de 7000 verbes)
let conjugator = null;
try { conjugator = require("conjugation-fr"); } catch (_) { conjugator = null; }

if (!conjugator || typeof conjugator.conjugate !== "function") {
  console.error("❌ Erreur : la librairie conjugation-fr est requise.");
}

// Liste complète des temps et modes disponibles (basée sur la documentation)
export const TENSES = {
  "indicative/present": "Indicatif/Présent",
  "indicative/imperfect": "Indicatif/Imparfait",
  "indicative/future": "Indicatif/Futur",
  "indicative/simple-past": "Indicatif/Passé simple",
  "indicative/perfect-tense": "Indicatif/Passé composé",
  "indicative/pluperfect": "Indicatif/Plus-que-parfait",
  "indicative/anterior-past": "Indicatif/Passé antérieur",
  "indicative/anterior-future": "Indicatif/Futur antérieur",

  "conditional/present": "Conditionnel/Présent",
  "conditional/conditional-past": "Conditionnel/Passé",

  "subjunctive/present": "Subjonctif/Présent",
  "subjunctive/imperfect": "Subjonctif/Imparfait",
  "subjunctive/subjunctive-past": "Subjonctif/Passé",
  "subjunctive/subjunctive-pluperfect": "Subjonctif/Plus-que-parfait",

  "imperative/imperative-present": "Impératif/Présent",
  "imperative/imperative-past": "Impératif/Passé",

  "participle/present-participle": "Participe/Présent",
  "participle/past-participle": "Participe/Passé",

  "infinitive/infinitive-present": "Infinitif/Présent"
};


// Retourne un label propre à partir du couple mode/temps
export const tenseLabel = (key) => TENSES[key] || key;

const PRONOUNS8 = ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"];

const strip = (s) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

// Conjugue un verbe avec conjugation-fr
function conjugate(verb, tenseKey, personIndex) {
  if (conjugator && typeof conjugator.conjugate === "function") {
    try {
      const [mode, tense] = tenseKey.split("/");
      const forms = conjugator.conjugate(verb, mode, tense); // ✅ returns an array
      if (Array.isArray(forms) && forms.length > personIndex) {
        const item = forms.find(f => f.pronounIndex === personIndex);
        return item ? item.verb : forms[personIndex]?.verb || "";
      }
    } catch (err) {
      console.warn("Erreur de conjugaison:", err);
    }
  }
  return "";
}

// Extrait la terminaison si quizType = "ending"
function extractEnding(verb, tenseKey, full) {
  if (!full) return "";
  const rad = verb.slice(0, -2);
  if (full.startsWith(rad)) return full.slice(rad.length);
  let i = 0;
  while (i < verb.length && i < full.length && verb[i] === full[i]) i++;
  return full.slice(i) || full.slice(-1);
}

// Vérifie si un verbe existe dans la base
export function isKnownVerb(verb) {
  const v = strip(verb);
  if (!v) return false;
  try {
    // ✅ conjudation-fr n’expose pas list(), on accède directement au dictionnaire interne
    const verbsData = require("conjugation-fr/verbs-fr.json");
    return Object.prototype.hasOwnProperty.call(verbsData, v);
  } catch (err) {
    console.error("Erreur lors de la vérification du verbe:", err);
    return false;
  }
}

// Génère une question (verbe + pronom + temps)
export function generateQuestion(settings) {
  const { customVerbs, customVerb, groups, tense, quizType } = settings;
  let pool = [];

  if (Array.isArray(customVerbs) && customVerbs.length > 0) {
    pool = customVerbs.map(strip);
  } else if (conjugator && typeof conjugator.conjugate === "function") {
    try {
        // ✅ utilise le dictionnaire interne
        const verbsData = require("conjugation-fr/verbs-fr.json");
        const all = Object.keys(verbsData); // ~7000 verbes
        if (groups.includes("g1")) pool.push(...all.filter(v => v.endsWith("er")));
        if (groups.includes("g2")) pool.push(...all.filter(v => v.endsWith("ir")));
        if (groups.includes("g3")) pool.push(...all.filter(v =>
            !v.endsWith("er") && !v.endsWith("ir")
        ));
    } catch (err) {
        console.error("Erreur de génération de la liste:", err);
    }
 }

  const pronoun = rand(PRONOUNS8);
  const person = pronounToPersonIndex(pronoun);
  const verb = rand(pool);
  const full = conjugate(verb, tense, person);
  const expected =
    quizType === "ending" ? extractEnding(verb, tense, full) : full;

  return { pronoun, person, verb, tense, full, expected };
}
