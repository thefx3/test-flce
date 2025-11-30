import { useEffect, useState, useMemo, createRef } from "react";
import { fetchVideosWithQuestions } from "../api/publicApi";

export default function TestVideo({ sessionToken, onSubmitted }) {
  const [videos, setVideos] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // stepByVideo[videoId] = "init" | "read" | "video" | "answer"
  const [stepByVideo, setStepByVideo] = useState({});
  // playCount[videoId] = nombre de lectures
  const [playCount, setPlayCount] = useState({});

  // refs: pour contrôler les vidéos (play programmatically)
  const videoRefs = useMemo(
    () =>
      Object.fromEntries(
        videos.map((v) => [v.videoId, createRef()])
      ),
    [videos]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchVideosWithQuestions(sessionToken);
        setVideos(data);

        const initialSteps = {};
        const initialPlays = {};

        data.forEach((v) => {
          initialSteps[v.videoId] = "init"; // l'utilisateur doit cliquer "Read questions"
          initialPlays[v.videoId] = 0;
        });

        setStepByVideo(initialSteps);
        setPlayCount(initialPlays);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("An error occurred while loading the videos.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionToken]);

  // Update a single answer
  function handleAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  // Limite: 1 visionnage par vidéo
  function handleVideoPlay(videoId, videoEl) {
    const count = playCount[videoId] || 0;

    if (count >= 1) {
      // Déjà regardée une fois → pas de replay
      videoEl.pause();
      alert("You can only watch the video once.");
      return;
    }

    // First/only allowed play
    setPlayCount((prev) => ({ ...prev, [videoId]: count + 1 }));
  }

  async function handleSubmit() {
    setSubmitting(true);

    // // Vérifier que toutes les questions (toutes vidéos confondues) ont une réponse
    // const allQuestions = videos.flatMap((v) => v.questions);
    // const allAnswered = allQuestions.every(
    //   (q) => answers[q.questionId] && answers[q.questionId].trim() !== ""
    // );

    // if (!allAnswered) {
    //   alert("Please answer all the questions before continuing.");
    //   setSubmitting(false);
    //   return;
    // }

    onSubmitted(answers);
    setSubmitting(false);
  }

  if (loading) return <p>Loading videos…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="test-wrapper">
      <h2 className="test-title">LA CLEF French Test — Part 2</h2>

      <div className="form-section first-section">
        <p className="instructions">
          You will now watch one or more videos and answer questions.
          <br />
          <b>Warning:</b> you can only watch each video once. Watch carefully!
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

            {/* ========== READ QUESTIONS ========== */}
            {currentStep === "read" && (
              <div className="questions-preview">
                {video.questions.map((q) => (
                  <p key={q.questionId} className="question-preview">
                    {q.order}.{" "}
                    {q.text.includes("{{BLANK}}")
                      ? q.text.replace("{{BLANK}}", "_____")
                      : q.text}
                    {q.type !== "OPEN" && (
                      <span style={{ opacity: 0.6, marginLeft: 6 }}>
                        ({q.choices.join(" / ")})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            )}

            {/* ========== VIDEO STEP ========== */}
            {currentStep === "video" && (
              <div className="video-container">
                {/* custom play btn */}
                <button
                  className="button-instruction"
                  onClick={() => {
                    if (videoEl.current) {
                      videoEl.current.play();
                    }
                  }}
                >
                  ▶ Play video
                </button>

                <video
                  ref={videoEl}
                  src={video.url}
                  controls={false}
                  onPlay={(e) => handleVideoPlay(video.videoId, e.target)}
                  onEnded={() =>
                    setStepByVideo((prev) => ({
                      ...prev,
                      [video.videoId]: "answer",
                    }))
                  }
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    marginTop: "15px",
                  }}
                />
              </div>
            )}

            {/* ========== ANSWER STEP ========== */}
            {currentStep === "answer" && (
              <div className="questions-block">
                {video.questions.map((q) => {
                  if (q.type === "OPEN") {
                    return (
                      <div key={q.questionId} className="question-open">
                        <p className="question-text">
                          {q.order}. {q.text}
                        </p>

                        <textarea
                          className="open-textarea"
                          maxLength={400}
                          value={answers[q.questionId] || ""}
                          onChange={(e) =>
                            handleAnswer(q.questionId, e.target.value)
                          }
                        />
                      </div>
                    );
                  }

                  const parts = q.text.split("{{BLANK}}");
                  const before = parts[0] || "";
                  const after = parts[1] || "";

                  return (
                    <div key={q.questionId} className="question-text">
                      {q.order}. {before}
                      <select
                        className="dropdown"
                        value={answers[q.questionId] || ""}
                        onChange={(e) =>
                          handleAnswer(q.questionId, e.target.value)
                        }
                      >
                        <option value="">---</option>
                        {q.choices.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                      {after}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <button className="submit-btn" onClick={handleSubmit}>
        {submitting ? "Loading…" : "Next"}
      </button>
    </div>
  );
}
