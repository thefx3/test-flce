import { useState } from "react";
import { useNavigate } from "react-router-dom";

import StartTestForm from "./StartTestForm";
import TestQuestions from "./TestQuestions";
import TestEnd from "./TestEnd";

export default function TestInterface() {
  const navigate = useNavigate();

  const [step, setStep] = useState("start");
  const [testId, setTestId] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  function handleIntroNext() {
    setStep("start");
  }

  function handleStartSuccess({ testId, sessionToken }) {
    setTestId(testId);
    setSessionToken(sessionToken);
    setStep("questions");
  }

  function handleTestSubmitted() {
    setStep("end");

    // On peut décider : après 2 secondes → retourner à la home
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
          onSubmitted={handleTestSubmitted}
        />
      )}

      {step === "end" && <TestEnd />}
    </div>
  );
}
