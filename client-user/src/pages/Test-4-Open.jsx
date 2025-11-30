import { useEffect, useState } from "react";
import { fetchQuestionsOPEN, submitResponses } from "../api/publicApi";

export default function TestOpen({ testId, sessionToken, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetchQuestionsOPEN(sessionToken);
      setQuestions(res);
      setLoading(false);
    }
    load();
  }, [sessionToken]);

  function handleAnswer(id, value) {
    setAnswers(p => ({ ...p, [id]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);

    const payload = Object.entries(answers).map(([id, value]) => ({
      questionId: Number(id),
      answerText: value
    }));

    await submitResponses(testId, payload, sessionToken);
    onSubmitted();
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="test-wrapper">

      <h2 className="test-title">LA CLEF French Test - Part 3</h2>

      <div className="form-section first-section">
        <p className="instructions">
        Answer these 5 questions. Write your answers in complete sentences. <br/>
        Don't use any dictionary.
        </p>
      </div>

      {questions.map(q => (
        <div key={q.questionId} className="test-card">
          <p className="question-text">{q.order}. {q.text}</p>

          <textarea
            className="open-textarea"
            maxLength="400"
            placeholder="Write your answer…"
            value={answers[q.questionId] || ""}
            onChange={(e) => handleAnswer(q.questionId, e.target.value)}
          />
        </div>
      ))}

      <button
        className="submit-btn"
        disabled={Object.keys(answers).length < questions.length}
        onClick={handleSubmit}
      >
      {submitting ? "Submitting..." : "Submit test"}
      </button>
      
    </div>
  );
}
