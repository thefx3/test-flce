import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StartTestForm from "./StartTestForm";
import TestQuestions from "./TestQuestions";
import TestVideo from "./TestVideo";
import TestEnd from "./TestEnd";

export default function TestInterface() {
  const navigate = useNavigate();

  const [step, setStep] = useState("start");
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  function handleStartSuccess({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("questions"); // move to QCM section
  }

  function handleNext() {
    setStep("part2"); // move to VIDEO section
  }

  function handleTestSubmitted() {
    setStep("end");
    setTimeout(() => navigate("/"), 2500);
  }

  return (
    <div className="french-test">

      {step === "start" && (
        <StartTestForm onSuccess={handleStartSuccess} />
      )}

      {step === "questions" && (
        <TestQuestions
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleNext}
        />
      )}

      {step === "part2" && (
        <TestVideo
          testId={testId}
          sessionToken={sessionToken}
          onSubmitted={handleTestSubmitted}
        />
      )}

      {step === "end" && <TestEnd />}
    </div>
  );
}
