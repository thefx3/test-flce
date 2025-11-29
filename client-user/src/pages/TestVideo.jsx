// src/pages/TestVideo.jsx
import { useEffect, useState } from "react";
import { fetchVideosWithQuestions, submitResponses } from "../api/publicApi";

export default function TestVideo({ testId, sessionToken, onSubmitted }) {
  const [videos, setVideos] = useState([]);       // [{ videoId, url, questions: [] }]
  const [answers, setAnswers] = useState({});     // { [questionId]: selectedValue }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch grouped videos + questions
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchVideosWithQuestions(sessionToken);
        setVideos(data);
      } catch (err) {
        console.error("Error fetching video questions:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionToken]);

  // Update answer
  function handleAnswer(questionId, value) {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }

  // Submit all answers
  async function handleSubmit() {
    setSubmitting(true);

    try {
      const payload = Object.entries(answers).map(([questionId, value]) => ({
        questionId: Number(questionId),
        answerText: value
      }));

      await submitResponses(testId, payload, sessionToken);
      onSubmitted();

    } catch (err) {
      console.error("Error submitting:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // Render a single QCM question with dropdown
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

      <h2 className="test-title">Test de compréhension vidéo</h2>

      {videos.map(video => (
        <div key={video.videoId} className="video-section">

          {/* ▶️ VIDEO */}
          <video
            src={video.url}
            controls
            className="video-player"
            style={{ width: "100%", marginBottom: "20px", borderRadius: "10px" }}
          />

          {/* 📝 QUESTIONS ASSOCIÉES */}
          {video.questions.map(q => renderQuestion(q))}
        </div>
      ))}

      <button
        className="submit-btn"
        onClick={handleSubmit}
      >
        {submitting ? "Loading…" : "Next"}
      </button>
    </div>
  );
}
