// Minimal i18n stub (French only as requested)
export function useTranslation() {
  const t = (key, vars = {}) => {
    const dict = {
      appTitle: "MiniVerbe",
      startQuiz: "Démarrer",
      restartQuiz: "Rejouer",
      score: "Score",
      question: "Question",
      timer: "Minuteur",
      typeFull: "Forme complète",
      typeEnding: "Terminaison seulement",
      settings: "Paramètres",
      result: "Résultat",
      chooseGroups: "Choisissez un ou plusieurs groupes de verbes",
      customVerb: "Ajouter un verbe (optionnel)",
      selectTense: "Choisissez le temps",
      quizType: "Type de quiz",
      numberOfQuestions: "Nombre de questions",
      seconds: "secondes",
      returnMenu: "Retour au menu",
    };
    let out = dict[key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      out = out.replace(new RegExp(`{${k}}`, "g"), v);
    });
    return out;
  };
  return { t };
}
