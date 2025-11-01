import React, { useMemo } from "react";

export default function Stats({ history = [] }) {
  // 🧮 Compute breakdown by pronoun and tense
  const { byPronoun, byTense } = useMemo(() => {
    const p = {}, t = {};
    const add = (map, key, ok) => {
        if (!map[key]) map[key] = { total: 0, ok: 0 };
        map[key].total++;
        if (ok) map[key].ok++;
    };
    history.forEach((h) => {
        const pronoun = h.pronoun || "?";
        const tense = h.tense || "?";
        add(p, pronoun, h.correct);
        add(t, tense, h.correct);
    });
    return { byPronoun: p, byTense: t };
  }, [history]);


  const render = (map) =>
    Object.entries(map).map(([k, v], i) => {
      const acc = Math.round((v.ok / v.total) * 100);
      const cls =
        acc >= 80
          ? "list-group-item list-group-item-success"
          : acc >= 60
          ? "list-group-item list-group-item-warning"
          : "list-group-item list-group-item-danger";
      return (
        <li key={i} className={cls}>
          <div className="d-flex justify-content-between">
            <strong>{k}</strong>
            <span>
              {v.ok}/{v.total} — {acc}%
            </span>
          </div>
        </li>
      );
    });

  if (!history.length)
    return <div className="text-muted small">Aucune donnée disponible</div>;

  return (
    <div className="mt-3 d-grid gap-3">
      <div>
        <h6>Par pronom</h6>
        <ul className="list-group">{render(byPronoun)}</ul>
      </div>
      <div>
        <h6>Par temps</h6>
        <ul className="list-group">{render(byTense)}</ul>
      </div>
    </div>
  );
}
