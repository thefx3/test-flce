import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TestForm from "./Test-1-Form";
import TestQuestions from "./Test-2-Questions";
import TestVideo from "./Test-3-Video";
import TestOpen from "./Test-4-Open";
import Submitted from "../components/Submitted";

export default function TestInterface() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [allAnswers, setAllAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function mergeAnswers(partial) {
    setAllAnswers(prev => ({ ...prev, ...partial }));
  }

  function handleForm({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("qcm");
  }

  function handleQcmDone(partialAnswers) {
    mergeAnswers(partialAnswers);
    setStep("video");
  }

  function handleVideoDone(partialAnswers) {
    mergeAnswers(partialAnswers);
    setStep("open");
  }

  async function handleTestSubmitted(finalAnswers) {
    // Fusion locale immédiate (pas dépendante du state async)
    const full = { ...allAnswers, ...finalAnswers };

    // Mise à jour state (pour cohérence interne)
    setAllAnswers(full);

    const payload = Object.entries(full).map(([questionId, answerText]) => ({
      questionId: Number(questionId),
      answerText,
    }));

    try {
      setSubmitting(true);
      const { submitResponses } = await import("../api/publicApi");
      await submitResponses(testId, payload, sessionToken);
    } finally {
      setSubmitting(false);
      setStep("submitted");
    }
  }

  return (
    <div className="french-test">
      {submitting && <p>Submitting your test…</p>}

      {step === "form" && (
        <TestForm onSuccess={handleForm} />
      )}

      {step === "qcm" && (
        <TestQuestions
          sessionToken={sessionToken}
          onSubmitted={handleQcmDone}
        />
      )}

      {step === "video" && (
        <TestVideo
          sessionToken={sessionToken}
          onSubmitted={handleVideoDone}
        />
      )}

      {step === "open" && (
        <TestOpen
          sessionToken={sessionToken}
          onSubmitted={handleTestSubmitted}
        />
      )}

      {step === "submitted" && (
        <Submitted testId={testId} sessionToken={sessionToken} />
      )}
    </div>
  );
}
