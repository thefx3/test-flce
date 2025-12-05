import { useEffect, useState, useMemo, createRef } from "react";
import { fetchVideoList, fetchVideoQuestions } from "../api/publicApi";

export default function TestVideo({ sessionToken, onSubmitted }) {
  const [videos, setVideos] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Flow per video
  const [stepByVideo, setStepByVideo] = useState({});

  // Refs for each video
  const videoRefs = useMemo(
    () =>
      Object.fromEntries(
        videos.map((v) => [v.videoId, createRef()])
      ),
    [videos]
  );

  // ----------------------------------------------------------
  // LOAD VIDEO LIST → then load questions per video
  // ----------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const list = await fetchVideoList();

        // Load each video's questions
        const fullData = [];
        for (const v of list) {
          const questions = await fetchVideoQuestions(v.videoId);
          fullData.push({ ...v, questions });
        }

        setVideos(fullData);

        // Init step per video
        const steps = {};
        fullData.forEach((v) => (steps[v.videoId] = "init"));
        setStepByVideo(steps);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Could not load video test.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessionToken]);

  // ----------------------------------------------------------
  // Handle answers
  // ----------------------------------------------------------
  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  // ----------------------------------------------------------
  // Submit
  // ----------------------------------------------------------
  function handleSubmit() {
    onSubmitted(answers);
  }

  // ----------------------------------------------------------
  // Rendering
  // ----------------------------------------------------------
  if (loading) return <p>Loading videos…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="test-wrapper">
      <h2 className="test-title">LA CLEF French Test — Part 2</h2>

      <div className="form-section first-section">
        <p className="instructions">
          You will now watch one or more videos and answer questions.
          <br />
          <b>Debug mode:</b> video can be watched unlimited times.
        </p>
      </div>

      {videos.map((video, index) => {
        const currentStep = stepByVideo[video.videoId];
        const videoEl = videoRefs[video.videoId];

        return (
          <div key={video.videoId} className="test-card">
            <p className="video-x">Video n°{index + 1}</p>

            {/* STEP BUTTONS */}
            <div className="instructions-wrapper">
              {/* READ */}
              <button
                className={`button-instruction ${
                  currentStep === "read" ? "active-step" : ""
                }`}
                disabled={currentStep !== "init"}
                onClick={() =>
                  setStepByVideo((prev) => ({
                    ...prev,
                    [video.videoId]: "read",
                  }))
                }
              >
                Read questions
              </button>

              {/* WATCH */}
              <button
                className={`button-instruction ${
                  currentStep === "video" ? "active-step" : ""
                }`}
                disabled={currentStep !== "read"}
                onClick={() =>
                  setStepByVideo((prev) => ({
                    ...prev,
                    [video.videoId]: "video",
                  }))
                }
              >
                See video
              </button>

              {/* ANSWER */}
              <button
                className={`button-instruction ${
                  currentStep === "answer" ? "active-step" : ""
                }`}
                disabled={currentStep !== "video"}
                onClick={() =>
                  setStepByVideo((prev) => ({
                    ...prev,
                    [video.videoId]: "answer",
                  }))
                }
              >
                Answer questions
              </button>
            </div>

            {/* READ QUESTIONS */}
            {currentStep === "read" && (
            <div className="questions-preview">
              {video.questions.map((q) => (
                <p key={q.questionId} className="question-preview">
                  {q.order}.{" "}
                  {q.text.includes("{{BLANK}}")
                    ? q.text.replace("{{BLANK}}", "_____")
                    : q.text}

                  {/* Afficher les choix pour les QCM */}
                  {q.type !== "OPEN" && q.choices?.length > 0 && (
                    <span style={{ opacity: 0.6, marginLeft: 6 }}>
                      ({q.choices.join(" / ")})
                    </span>
                  )}
                </p>
              ))}
            </div>
            )}


            {/* VIDEO STEP */}
            {currentStep === "video" && (
              <div className="video-container">
                <video
                ref={videoEl}
                controls
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  marginTop: "15px",
                }}
                onEnded={() =>
                  setStepByVideo((prev) => ({
                    ...prev,
                    [video.videoId]: "answer",
                  }))
                }
              >
                <source src={video.url}  />
              </video>

              </div>
            )}

            {/* ANSWER QUESTIONS */}
            {currentStep === "answer" && (
              <div className="questions-block">
                {video.questions.map((q) => (
                  <div key={q.questionId} className="question-item">
                    {q.type === "OPEN" ? (
                      <>
                        <p>{q.order}. {q.text}</p>
                        <textarea
                          value={answers[q.questionId] || ""}
                          onChange={(e) =>
                            handleAnswer(q.questionId, e.target.value)
                          }
                          className="open-textarea"
                        />
                      </>
                    ) : (
                      <>
                        <p className="question-text">
                          {q.order}.{" "}
                          {q.text.split("{{BLANK}}")[0] || ""}
                          <select
                            className="dropdown"
                            value={answers[q.questionId] || ""}
                            onChange={(e) => handleAnswer(q.questionId, e.target.value)}
                          >
                            <option value="">---</option>
                            {q.choices.map((c, idx) => (
                              <option key={`${q.questionId}-${idx}`} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          {q.text.split("{{BLANK}}")[1] || ""}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <button className="submit-btn" onClick={handleSubmit}>
        Next
      </button>
    </div>
  );
}
