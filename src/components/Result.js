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
                <span>
                  {item.q}
                  {!item.correct && item.user
                    ? ` (répondu : ${item.user})`
                    : ""}
                </span>
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
