
# Copilot Instructions for MiniVerbe

## Project Overview
- **MiniVerbe** is a bilingual (English/French) French verb conjugation quiz web app for children, built with React and styled using Bootstrap.
- The app supports quizzes on French verb conjugations, with customizable settings (tenses, verbs, pronouns, question count, timer, and format).
- It is installable as a PWA and can be run locally via Docker or with npm scripts.

## Architecture & Key Files
- **Frontend:** All logic is in `src/` (no backend). Main entry: `src/App.js`.
  - `src/components/` — UI components: `Menu.js`, `Quiz.js`, `Result.js`, `Stats.js`.
  - `src/utils/` — Utility modules: `questionGenerator.js` (quiz logic for conjugation), `i18n.js` (translations/context), `fireworks.js` (celebration effects), `alert.js` (modal alerts).
  - `src/styles/theme.css` — Custom Bootstrap theme and color palette.
- **PWA:** Service worker in `public/sw.js`, manifest in `public/manifest.json`.
- **Docker:** Containerization via `docker/` (see `justfile` for commands).

## Developer Workflows
- **Start locally (Docker):**
  ```bash
  just start
  # App at http://localhost:9998
  ```
- **Start locally (npm):**
  ```bash
  npm install
  npm start
  # App at http://localhost:3000
  ```
- **Build for production:**
  ```bash
  npm run build
  ```
- **Deploy:**
  - Automatic on push to `main` (GitHub Actions, see `.github/workflows/deploy-gp.yaml`).
- **Shell into container:**
  ```bash
  just shell
  ```

## Project Conventions & Patterns
- **Bilingual support:** All user-facing text uses the translation context (`useTranslation` from `i18n.js`).
- **Quiz logic:** Conjugation questions are generated uniquely per session (`questionGenerator.js`).
- **UI:** Bootstrap 5 is used, with custom theme overrides in `theme.css`.
- **Celebration:** Fireworks and emoji effects for perfect scores (`fireworks.js`).
- **No backend:** All state is client-side; no API calls.
- **PWA:** Service worker caches assets for offline use; see `sw.js` for cache logic.
- **Settings:** Quiz settings are passed as props between components, not via global state.

## Integration Points
- **External:**
  - `canvas-confetti` for fireworks
  - `bootstrap` for UI
  - `react`, `react-dom` for app
- **Deployment:**
  - GitHub Pages via `gh-pages` (see `package.json` scripts and workflow)

## Examples
- To add a new quiz format (e.g., new tense or pronoun set), update `Menu.js` (formats array) and `questionGenerator.js` (format logic).
- To add a new language, extend `translations` in `i18n.js` and update UI as needed.

---
For questions, see `README.md` or inspect the `justfile` for available commands.
