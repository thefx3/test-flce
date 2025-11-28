// src/pages/TestQuestions.jsx
import { useEffect, useState } from "react";
import { fetchQuestions, submitResponses } from "../api/publicApi";

export default function TestVideo({ testId, sessionToken, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [questionId]: selectedValue }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all questions from backend
  useEffect(() => {
    async function load() {
      try {
        const res = await fetchQuestions(sessionToken); 
        setQuestions(res);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionToken]);

  // Update answer for a specific question
  function handleAnswer(questionId, value) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }

  // Submit answer to backend
  async function handleSubmit() {
    setSubmitting(true);

    try {
      const payload = Object.entries(answers).map(([questionId, value]) => ({
        questionId: Number(questionId),
        answerText: value
      }));

      await submitResponses(testId, payload, sessionToken);
      onSubmitted(); // move to end screen

    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // Format each question into fragments
  function renderQuestion(q) {
    const [before, after] = q.text.split("{{BLANK}}");

    return (
      <div key={q.questionId} className="question-block">
        <p className="question-text">
          {before}

          <select
            className="dropdown"
            value={answers[q.questionId] || ""}
            onChange={(e) => handleAnswer(q.questionId, e.target.value)}
          >
            <option value="">---</option>
            {q.choices.map(choice => (
              <option key={choice} value={choice}>{choice}</option>
            ))}
          </select>

          {after}
        </p>
      </div>
    );
  }

  if (loading) return <p>Loading questions…</p>;

  return (
    <div className="questions-container">

      <h2 className="test-title">Grammar Section</h2>

      {questions.map(q => renderQuestion(q))}

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={submitting || Object.keys(answers).length < questions.length}
      >
        {submitting ? "Submitting…" : "Submit test"}
      </button>
    </div>
  );
}
