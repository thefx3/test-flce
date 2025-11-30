import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitComment } from "../api/publicApi";
import "../components/TestForm.css";

export default function Submitted({ testId, sessionToken }) {
  const navigate = useNavigate();
  const [wantsComment, setWantsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmitComment() {
    setError("");
    setSubmitting(true);
    try {
      await submitComment(testId, comment, sessionToken);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to send your comment");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSkip() {
    navigate("/");
  }

  return (
    <div className="test-wrapper">
      <div className="test-title">Thanks for finishing the test</div>

      <div className="form-section">
        <label className="section-label">Do you want to leave a comment?</label>

        <div className="radio-group">
          <label className="radio-line">
            <input
              type="radio"
              checked={wantsComment === true}
              onChange={() => setWantsComment(true)}
            />
            Yes
          </label>

          <label className="radio-line">
            <input
              type="radio"
              checked={wantsComment === false}
              onChange={() => setWantsComment(false)}
            />
            No
          </label>
        </div>
     

      {wantsComment ? (
        <div className="comment-card">
          <p className="question-text">Write a comment</p>

          <textarea
            className="open-textarea"
            maxLength={400}
            placeholder="Write your comment…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="form-error">{error}</p>}

          <button
            className="submit-btn"
            disabled={submitting || comment.trim() === ""}
            onClick={handleSubmitComment}
          >
            {submitting ? "Sending..." : "Send comment"}
          </button>
        </div>
      ) : (
        <button className="submit-btn" onClick={handleSkip}>
          Finish and return home
        </button>
      )}

        </div>
    </div>
  );
}
