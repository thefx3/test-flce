import { useEffect, useState } from "react";
import { fetchQuestionsQCM } from "../api/publicApi";

export default function TestQuestions({ sessionToken, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchQuestionsQCM(sessionToken);
        setQuestions(res);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionToken]);

  function handleAnswer(id, value) {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    // setSubmitting(true);

    // const allAnswered = questions.every(q => answers[q.questionId]);
    // if (!allAnswered) {
    //   alert("Please answer all questions.");
    //   setSubmitting(false);
    //   return;
    // }

    onSubmitted(answers);
    setSubmitting(false);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div className="test-wrapper">
      <h2 className="test-title">LA CLEF French Test - Part 1</h2>

      <div className="form-section first-section">
        <p className="instructions">
          Choose the correct answer. Don’t use any dictionary.
        </p>
      </div>

      <div className="test-grid">
        {questions.map(q => {
          const parts = q.text.split("{{BLANK}}");
          const before = parts[0] || "";
          const after = parts[1] || "";

          return (
            <div key={q.questionId} className="test-card">
              <p className="question-text">
                {q.order}. {before}

                <select
                  className="dropdown"
                  value={answers[q.questionId] || ""}
                  onChange={e => handleAnswer(q.questionId, e.target.value)}
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
        })}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        {submitting ? "Loading..." : "Next"}
      </button>
    </div>
  );
}
