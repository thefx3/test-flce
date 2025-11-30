import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TestForm from "./Test-1-Form";
import TestQuestions from "./Test-2-Questions";
import TestVideo from "./Test-3-Video";
import TestOpen from "./Test-4-Open";

export default function TestInterface() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  function handleForm({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("qcm"); // move to QCM section
  }

  function handleVideo() {
    setStep("video"); // move to VIDEO section
  }

  function handleOpen() {
    setStep("open"); // move to OPEN section
  }

  function handleTestSubmitted() {
    setTimeout(() => navigate("/"), 2500);
  }

  return (
    <div className="french-test">

      {step === "form" && (
        <TestForm onSuccess={handleForm} />
      )}

      {step === "qcm" && (
        <TestQuestions
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleVideo}
        />
      )}

      {step === "video" && (
        <TestVideo
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleOpen}
        />
      )}

      {step === "open" && <TestOpen onSubmitted={handleTestSubmitted}/>}
    </div>
  );
}
