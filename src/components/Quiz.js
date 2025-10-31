import React, { useEffect, useRef, useState } from "react";
import { generateQuestion, tenseLabel } from "../utils/questionGenerator";

export default function Quiz({ settings, onFinish }) {
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.timer);
  const [history, setHistory] = useState([]);
  const [startTs, setStartTs] = useState(Date.now());
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    newQuestion();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [question]);

  useEffect(() => {
    if (!settings.timer || !question || feedback) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t && t > 1) return t - 1;
        clearInterval(timerRef.current);
        handleTimeout();
        return 0;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [question, feedback, settings.timer]);

  const newQuestion = () => {
    const q = generateQuestion(settings);
    if (!q.full) {
        setFeedback("⚠️ Conjugaison introuvable pour ce verbe, question sautée.");
        setTimeout(() => setIndex((i) => i + 1), 1000);
        return;
    }
    setQuestion(q);
    setInput("");
    setFeedback("");
    setTimeLeft(settings.timer);
    setStartTs(Date.now());
    };


  const pushAndAdvance = (entry, wasCorrect) => {
    const newHistory = [...history, entry];
    const newScore = score + (wasCorrect ? 1 : 0);
    setHistory(newHistory);
    setScore(newScore);

    setTimeout(() => {
      if (index >= settings.totalQuestions) {
        onFinish(newScore, newHistory);
      } else {
        setIndex((i) => i + 1);
      }
    }, 800);
  };

  const handleAnswer = () => {
    if (!question || feedback) return;
    const given = (input || "").trim();
    const ok = normalize(given) === normalize(question.expected);
    const duration = ((Date.now() - startTs) / 1000).toFixed(1);

    const entry = {
      q: `${question.pronoun} ${question.verb} — ${tenseLabel(question.tense)}${settings.quizType === "ending" ? " [terminaison]" : ""}`,
      pronoun: question.pronoun,
      verb: question.verb,
      tense: tenseLabel(question.tense),
      correct: ok,
      user: given || null,
      right: question.full,
      time: duration
    };

    setFeedback(ok ? "✅ Bravo !" : `❌ Oups. Réponse attendue : ${settings.quizType === "ending" ? question.expected : question.full}`);
    pushAndAdvance(entry, ok);
  };

  useEffect(() => {
    if (index > 1 && index <= settings.totalQuestions) newQuestion();
    // eslint-disable-next-line
  }, [index]);

  const handleTimeout = () => {
    if (!question) return;
    const duration = ((Date.now() - startTs) / 1000).toFixed(1);
    const entry = {
      q: `${question.pronoun} ${question.verb} — ${tenseLabel(question.tense)}${settings.quizType === "ending" ? " [terminaison]" : ""}`,
      pronoun: question.pronoun,
      verb: question.verb,
      tense: tenseLabel(question.tense),
      correct: false,
      user: null,
      right: question.full,
      time: duration
    };
    setFeedback(`⏰ Temps écoulé ! Réponse attendue : ${settings.quizType === "ending" ? question.expected : question.full}`);
    pushAndAdvance(entry, false);
  };

  const normalize = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  if (!question) return null;

  return (
    <div className="card p-4 shadow-sm">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="badge bg-dark">Question {Math.min(index, settings.totalQuestions)}/{settings.totalQuestions}</span>
        {settings.timer && (
          <div className="progress flex-grow-1" style={{ height: 8 }}>
            <div className="progress-bar bg-warning" style={{ width: `${(timeLeft / settings.timer) * 100}%`, transition: "width 1s linear" }} />
          </div>
        )}
        <span className="badge bg-info">Score {score}</span>
      </div>

      <div className="h5 mb-2">
        <span className="text-primary me-2">{question.pronoun}</span>
        <span className="me-2">{question.verb}</span>
        <span className="badge text-bg-info">{tenseLabel(question.tense)}</span>
        {settings.quizType === "ending" && (
          <span className="badge text-bg-warning ms-2">Terminaison</span>
        )}
      </div>

      <div className="d-flex gap-2 mt-2">
        <input ref={inputRef} className="form-control form-control-lg" placeholder={settings.quizType === "ending" ? "Ex: ais, es, ent…" : "Tape ta réponse"} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAnswer()} />
        <button className="btn btn-success btn-lg" onClick={handleAnswer}>Valider</button>
      </div>

      {feedback && <div className={`alert mt-3 ${feedback.startsWith("✅") ? "alert-success" : "alert-danger"}`}>{feedback}</div>}
    </div>
  );
}
