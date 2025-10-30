import React, { useState } from "react";
import ModalAlert from "../utils/alert";

const TENSES = [
  { key: "present", label: "Indicatif — Présent" },
  { key: "imparfait", label: "Indicatif — Imparfait" },
  { key: "futur", label: "Indicatif — Futur simple" },
  { key: "passeCompose", label: "Indicatif — Passé composé" },
];

const GROUPS = [
  { key: "g1", label: "1er groupe (-er)" },
  { key: "g2", label: "2e groupe (-ir → -issons)" },
  { key: "g3", label: "3e groupe (irréguliers)" },
];

export default function Menu({ onStart }) {
  const [customVerb, setCustomVerb] = useState("");
  const [groups, setGroups] = useState(["g1"]); // sélection multiple autorisée
  const [tense, setTense] = useState("present");
  const [quizType, setQuizType] = useState("full"); // "full" | "ending"
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timer, setTimer] = useState(60);
  const [showModal, setShowModal] = useState(false);

  const toggleGroup = (key) => {
    setGroups((prev) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (!groups.length) return setShowModal(true);
    onStart({ customVerb, groups, tense, quizType, totalQuestions, timer });
  };

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="mb-3">⚙️ Paramètres</h5>

      {/* 🔹 Verbe personnalisé */}
      <div className="mb-3">
        <label className="form-label">Ajouter un verbe (optionnel)</label>
        <input
          className="form-control"
          placeholder="ex : parler, finir, aller…"
          value={customVerb}
          onChange={(e) => setCustomVerb(e.target.value)}
        />
        <div className="form-text">
          Il sera ajouté au tirage aléatoire du quiz.
        </div>
      </div>

      {/* 🔹 Groupes de verbes */}
      <h6>Groupes de verbes</h6>
      <div className="mb-3">
        {GROUPS.map((g) => (
          <button
            key={g.key}
            className={`btn me-2 mb-2 ${
              groups.includes(g.key) ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => toggleGroup(g.key)}
          >
            {g.label}
          </button>
        ))}
        <div className="form-text">Vous pouvez en choisir plusieurs.</div>
      </div>

      {/* 🔹 Temps et type de quiz */}
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label">Temps</label>
          <select
            className="form-select"
            value={tense}
            onChange={(e) => setTense(e.target.value)}
          >
            {TENSES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label">Type de quiz</label>
          <select
            className="form-select"
            value={quizType}
            onChange={(e) => setQuizType(e.target.value)}
          >
            <option value="full">Forme complète</option>
            <option value="ending">Terminaison seulement</option>
          </select>
        </div>
      </div>

      {/* 🔹 Nombre de questions et minuteur */}
      <div className="row mb-3">
        <div className="col-6">
          <label className="form-label">Nombre de questions</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={100}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Number(e.target.value))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Minuteur (secondes)</label>
          <input
            type="number"
            className="form-control"
            min={10}
            max={3600}
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
          />
        </div>
      </div>

      {/* 🔹 Bouton démarrer */}
      <button className="btn btn-lg btn-success" onClick={handleSubmit}>
        🚀 Démarrer le quiz
      </button>

      {/* 🔹 Modal d’avertissement */}
      <ModalAlert
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Info"
        message="Veuillez choisir au moins un groupe de verbes."
      />
    </div>
  );
}
