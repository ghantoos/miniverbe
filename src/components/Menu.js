import React, { useState } from "react";
import ModalAlert from "../utils/alert";
import { isKnownVerb, TENSES } from "../utils/questionGenerator";

const GROUPS = [
  { key: "g1", label: "1er groupe (-er)" },
  { key: "g2", label: "2e groupe (-ir → -issons)" },
  { key: "g3", label: "3e groupe (irréguliers)" },
];

export default function Menu({ onStart }) {
  const [inputVerb, setInputVerb] = useState("");
  const [customVerbs, setCustomVerbs] = useState([]); // tableau de verbes validés
  const [inputError, setInputError] = useState("");
  const [groups, setGroups] = useState(["g1"]);
  const [tense, setTense] = useState("indicative/present");
  const [quizType, setQuizType] = useState("full");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timer, setTimer] = useState(60);
  const [showModal, setShowModal] = useState(false);

  const toggleGroup = (key) => {
    setGroups((prev) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
    );
  };

  // Ajout d'un verbe à la liste après validation
  const handleAddVerb = (raw) => {
    const candidates = raw.split(",").map(v => v.trim()).filter(Boolean);
    let error = "";
    let added = false;
    candidates.forEach((verb) => {
      if (!verb) return;
      if (customVerbs.includes(verb)) return;
      if (isKnownVerb(verb)) {
        setCustomVerbs((prev) => [...prev, verb]);
        added = true;
      } else {
        error = error ? error + ", " + verb : verb;
      }
    });
    setInputError(error ? `Verbe inconnu : ${error}` : "");
    if (added) setInputVerb("");
  };

  // Suppression d'un verbe de la liste
  const handleRemoveVerb = (verb) => {
    setCustomVerbs((prev) => prev.filter((v) => v !== verb));
  };

  // Ajout par touche Entrée ou virgule
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddVerb(inputVerb);
    }
  };

  const handleSubmit = () => {
    if (!customVerbs.length && !groups.length) return setShowModal(true);
    onStart({
      customVerbs: customVerbs.length ? customVerbs : undefined,
      groups: customVerbs.length ? [] : groups,
      tense,
      quizType,
      totalQuestions,
      timer,
    });
  };

  return (
    <div className="card p-4 shadow-sm">
      <h5 className="mb-3">⚙️ Paramètres</h5>

      {/* 🔹 Verbes personnalisés */}
      <div className="mb-3">
        <label className="form-label">Ajouter un ou plusieurs verbes</label>
        <div className="d-flex flex-wrap align-items-center mb-2" style={{ gap: "0.5em" }}>
          {customVerbs.map((verb) => (
            <span key={verb} className="badge bg-primary text-light px-2 py-1 me-1">
              {verb}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                aria-label="Supprimer"
                style={{ fontSize: "0.7em" }}
                onClick={() => handleRemoveVerb(verb)}
              />
            </span>
          ))}
          <input
            className="form-control border-0 flex-grow-1"
            style={{ minWidth: 120, boxShadow: "none" }}
            placeholder="ex : parler, finir, aller…"
            value={inputVerb}
            onChange={(e) => setInputVerb(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onBlur={() => inputVerb && handleAddVerb(inputVerb)}
          />
        </div>
        {inputError && <div className="text-danger small">{inputError}</div>}
        <div className="form-text">
          Saisissez un verbe puis Entrée ou virgule. Seuls les verbes connus sont acceptés.
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
            disabled={customVerbs.length > 0}
          >
            {g.label}
          </button>
        ))}
        <div className="form-text">
          Vous pouvez en choisir plusieurs. (Désactivé si des verbes personnalisés sont ajoutés)
        </div>
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
            {Object.entries(TENSES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
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
