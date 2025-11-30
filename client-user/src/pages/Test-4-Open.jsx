import { useEffect, useState } from "react";
import { fetchQuestionsOPEN } from "../api/publicApi";

export default function TestOpen({ sessionToken, onSubmitted }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetchQuestionsOPEN(sessionToken);
        setQuestions(res);
      } catch (err) {
        console.error("Error fetching open questions:", err);
        setError("An error occurred while loading the questions.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionToken]);

  function handleAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    // setSubmitting(true);

    // const allAnswered = questions.every(
    //   (q) => answers[q.questionId] && answers[q.questionId].trim() !== ""
    // );

    // if (!allAnswered) {
    //   alert("Please answer all the questions before submitting the test.");
    //   setSubmitting(false);
    //   return;
    // }

    onSubmitted(answers);
    setSubmitting(false);
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;

  // const allAnswered = questions.length > 0 && questions.every(
  //   (q) => answers[q.questionId] && answers[q.questionId].trim() !== ""
  // );

  return (
    <div className="test-wrapper">
      <h2 className="test-title">LA CLEF French Test - Part 3</h2>

      <div className="form-section first-section">
        <p className="instructions">
          Answer these 5 questions. Write your answers in complete sentences.
          <br />
          Don&apos;t use any dictionary.
        </p>
      </div>

      {questions.map((q) => (
        <div key={q.questionId} className="test-card">
          <p className="question-text">
            {q.order}. {q.text}
          </p>

          <textarea
            className="open-textarea"
            maxLength={400}
            placeholder="Write your answer…"
            value={answers[q.questionId] || ""}
            onChange={(e) => handleAnswer(q.questionId, e.target.value)}
          />
        </div>
      ))}

      <button
        className="submit-btn"
        // disabled={!allAnswered || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Submitting..." : "Submit test"}
      </button>
    </div>
  );
}
