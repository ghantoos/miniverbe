import React, { useEffect } from "react";
import { launchFireworks } from "../utils/fireworks";
import Stats from "./Stats";

export default function Result({ score, total, onRestart, history = [] }) {
  const percentage = Math.round((score / total) * 100);
  let badgeClass = "bg-warning text-dark";
  let message = "À retravailler 💪";

  if (percentage === 100) {
    badgeClass = "bg-success";
    message = "Excellent ! 🎉";
  } else if (percentage >= 80) {
    badgeClass = "bg-info text-dark";
    message = "Bravo ! 👍";
  } else if (percentage >= 60) {
    badgeClass = "bg-warning text-dark";
    message = "Bien joué ! 👏";
  }

  // 🎆 Fireworks for perfect score
  useEffect(() => {
    if (percentage === 100) launchFireworks(total);
  }, [percentage, total]);

  // 🧩 Highlight conjugated verb (green/red)
  const renderLine = (item) => {
    const pronoun =
        item.pronoun && item.pronoun.length
        ? item.pronoun.charAt(0).toUpperCase() + item.pronoun.slice(1)
        : "";
    const highlighted = `<strong class="${
        item.correct ? "text-success" : "text-danger"
    }">${item.right || ""}</strong>`;
    const tense = item.tense || "";
    const answered =
        !item.correct && item.user
        ? ` <span>(répondu : ${item.user})</span>`
        : "";
    // ✅ Simplified and clean: Elle chante (répondu: asd) — Indicatif/Présent
    return `${pronoun} ${highlighted}${answered} — ${tense}`;
  };

  return (
    <div className="card p-4 text-center shadow-sm">
      <h2>🎯 Résultat : {percentage}%</h2>
      <h4 className="my-3">
        Score {score}/{total}
      </h4>
      <span className={`badge fs-5 px-3 py-2 ${badgeClass}`}>{message}</span>

      {history.length > 0 && (
        <div className="mt-4 text-start">
          <h5>Résumé</h5>
          <ul className="list-group">
            {history.map((item, i) => (
              <li
                key={i}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  item.correct
                    ? "list-group-item-success"
                    : "list-group-item-danger"
                }`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: renderLine(item),
                  }}
                />
                <span className="text-muted small">{item.time}s</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 mb-4">
            <h5>📊 Analyse</h5>
            <Stats history={history} />
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-lg btn-success" onClick={onRestart}>
          Retour au menu
        </button>
      </div>
    </div>
  );
}
