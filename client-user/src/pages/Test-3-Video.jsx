import { useEffect, useState } from "react";
import { fetchVideosWithQuestions, submitResponses } from "../api/publicApi";

export default function TestVideo({ testId, sessionToken, onSubmitted }) {
  const [videos, setVideos] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await fetchVideosWithQuestions(sessionToken);
      setVideos(data);
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

      <h2 className="test-title">Listening — Video Section</h2>

      <div className="form-section first-section">
        <p className="instructions">
        
        You will begin the video test part. In this part, you will watch a short video, after which, you will answer the following questions listed bellow. <br/>

        Please read the questions before watching the video. <br/> <br/>

        <b>Warning </b> : after the video is started, you will not be able to pause or stop. You will have to watch the video straight through, in one sitting. <br/>
        Don't use any dictionary. 
        </p>
      </div>

      {videos.map(video => (
        <div key={video.videoId} className="test-card">

          {/* video */}
          <video
            src={video.url}
            controls
            style={{ width: "100%", borderRadius: "12px", marginBottom: "20px" }}
          />

          {video.questions.map(q => {

          // 🟦 CAS 1 : QUESTION OUVERTE
          if (q.type === "OPEN") {
            return (
              <div key={q.questionId}>

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
            );
          }

          // 🟧 CAS 2 : QUESTION QCM (split {{BLANK}})
          const [before, after] = q.text.split("{{BLANK}}");

          return (
            <div key={q.questionId} className="question-text" style={{ marginBottom: "20px" }}>
              {q.order}. {before}

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
            </div>
          );
          })}

        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit}>
        {submitting ? "Loading..." : "Next"}
      </button>
      
    </div>
  );
}
