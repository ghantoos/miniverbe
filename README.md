# MiniVerbe [![Netlify Status](https://api.netlify.com/api/v1/badges/20d56378-8471-462a-b25d-b64a4b6a9d02/deploy-status)](https://app.netlify.com/projects/petitlab-miniverbe/deploys)

**MiniVerbe** is a simple, fun web app designed to help children practice French verb conjugation — various tenses, verbs and pronouns — through quick, interactive quizzes. Installable as a PWA and tuned for a child-friendly UX inspired by MiniMath.

**MiniVerbe** est une application web simple et ludique conçue pour aider les enfants à s'entraîner à la conjugaison française — temps, verbes et pronoms — via des quiz rapides et interactifs. Installable en tant que PWA, avec une interface pensée pour les enfants.

👉 Live site and app: https://miniverbe.petitlab.ca

## 🚀 Features

- **Tenses covered:**
	- Indicative: Present, Imperfect, Future, Simple Past, Perfect (Passé composé), Pluperfect (Plus-que-parfait), Anterior Past (Passé antérieur), Anterior Future (Futur antérieur)
	- Conditional: Present, Past
	- Subjunctive: Present, Imperfect, Past, Pluperfect
	- Imperative: Present, Past
	- Participles & Infinitive: Present participle, Past participle, Infinitive present
- **Pronouns:** je, tu, il/elle, nous, vous, ils/elles
- **Custom verb input:** Add one or several verbs (validated immediately). If custom verbs are provided the quiz will use only that list.
- **Verb groups:** 1er groupe (-er), 2e groupe (-ir → -issons), 3e groupe (irréguliers)
- **Two quiz modes:** Full conjugation (complete form) or Ending-only (terminale)
- **Customizable quiz length & timer:** Choose number of questions and optional per-quiz timer
- **Progress & results:** Score summary, detailed results and feedback after the quiz
- **Bilingual UI:** English and French translations supported via `i18n` utilities
- **Celebration effects:** Fireworks 🎆 and small animations for perfect scores
- **Installable PWA:** Works offline and can be installed to behave like a native app

_Français_

- **Temps pris en charge :**
	- Indicatif : Présent, Imparfait, Futur, Passé simple, Passé composé, Plus-que-parfait, Passé antérieur, Futur antérieur
	- Conditionnel : Présent, Passé
	- Subjonctif : Présent, Imparfait, Passé, Plus-que-parfait
	- Impératif : Présent, Passé
	- Participes & Infinitif : Participe présent, Participe passé, Infinitif présent
- **Pronoms :** je, tu, il/elle, nous, vous, ils/elles
- **Saisie de verbes personnalisés :** Ajoutez un ou plusieurs verbes (validés immédiatement). Si des verbes personnalisés sont fournis, le quiz utilisera uniquement cette liste.
- **Groupes de verbes :** 1er groupe (-er), 2e groupe (-ir → -issons), 3e groupe (irréguliers)
- **Deux modes de quiz :** Forme complète ou Terminaison seulement
- **Personnalisation :** Nombre de questions et minuteur
- **Résultats :** Score, récapitulatif et retours après chaque quiz
- **Bilingue :** Interface disponible en anglais et français via `i18n`
- **Effets :** Feux d'artifice 🎆 pour les scores parfaits
- **PWA :** Installable et utilisable hors ligne


## Démarrage
```bash
npm install
npm start
```

## Docker
```bash
just start
# puis http://localhost:9998
```